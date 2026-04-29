// ─────────────────────────────────────────────────────────────
// Server-Sent Events (SSE) endpoint for live parcel updates
// ─────────────────────────────────────────────────────────────
// Reads top-to-bottom in three steps:
//   1. Authenticate the request and pick the audience filter.
//   2. Build a streaming Response that subscribes to the bus.
//   3. Tear down (unsubscribe + clear interval) when the client disconnects.
// ─────────────────────────────────────────────────────────────

import { getCurrentUser } from "@/lib/auth";
import { onParcelEvent, type ParcelEvent } from "@/lib/events";

// SSE needs the Node runtime (uses Node's EventEmitter under the hood)
// and must never be cached.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const KEEPALIVE_MS = 25_000; // proxy idle timeouts are usually ~30s

export async function GET(req: Request) {
  // 1. Auth + audience
  const user = await getCurrentUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  // Residents only see events for their room; admins see everything.
  const shouldDeliver = (event: ParcelEvent) =>
    user.role === "admin" || event.roomId === user.roomId;

  // 2. Stream
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      const sendEvent = (event: ParcelEvent) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
      };

      const sendKeepAlive = () => {
        // Lines starting with `:` are SSE comments — ignored by the client,
        // but keep the TCP connection alive through proxies and load balancers.
        controller.enqueue(encoder.encode(`:ping\n\n`));
      };

      const keepAliveTimer = setInterval(sendKeepAlive, KEEPALIVE_MS);

      const unsubscribe = onParcelEvent((event) => {
        if (shouldDeliver(event)) sendEvent(event);
      });

      // 3. Cleanup on client disconnect
      req.signal.addEventListener("abort", () => {
        clearInterval(keepAliveTimer);
        unsubscribe();
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
