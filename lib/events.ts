// ─────────────────────────────────────────────────────────────
// Real-time parcel event bus
// ─────────────────────────────────────────────────────────────
// One Node EventEmitter, shared across the process.
//
// Producers: API mutations call `emitParcelEvent(...)` after they persist.
// Consumers: the SSE handler at `app/api/events/route.ts` calls
//            `onParcelEvent(...)` to forward events to connected clients.
//
// Limitation: in-memory only. Works for `next dev` and any single Node
// process. For multi-instance deployments, replace the body with a
// Redis Pub/Sub adapter — the public API (emit/on) stays the same.
// ─────────────────────────────────────────────────────────────

import { EventEmitter } from "events";

// Stash on globalThis so Next.js hot-reload doesn't create duplicate
// emitters in dev (same trick lib/db.ts uses for the Prisma client).
const globalForBus = globalThis as unknown as { __bus?: EventEmitter };
export const bus = globalForBus.__bus ?? new EventEmitter();
if (!globalForBus.__bus) globalForBus.__bus = bus;

// Two event shapes — that's it. Add new ones here if needed.
export type ParcelEvent =
  | { type: "parcel:new"; roomId: string; parcelId: string }
  | { type: "parcel:picked_up"; roomId: string; parcelId: string };

// One channel name. One emit function. One subscribe function.
const CHANNEL = "parcel";

export function emitParcelEvent(event: ParcelEvent) {
  bus.emit(CHANNEL, event);
}

export function onParcelEvent(handler: (event: ParcelEvent) => void) {
  bus.on(CHANNEL, handler);
  return () => {
    bus.off(CHANNEL, handler);
  };
}
