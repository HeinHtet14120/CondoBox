import { NextRequest, NextResponse } from "next/server";
import { requireUser, requireAdmin, AuthError } from "@/lib/auth";
import {
  createParcel,
  listAllParcels,
  listParcelsByRoom,
} from "@/lib/models/parcel";
import { emitParcelEvent } from "@/lib/events";

type ParcelStatus = "waiting" | "picked_up";

function parseStatus(v: string | null): ParcelStatus | undefined {
  return v === "waiting" || v === "picked_up" ? v : undefined;
}

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser();
    const status = parseStatus(new URL(req.url).searchParams.get("status"));

    if (user.role === "admin") {
      return NextResponse.json(await listAllParcels(status));
    }
    if (!user.roomId) return NextResponse.json([]);
    return NextResponse.json(await listParcelsByRoom(user.roomId, status));
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.status });
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const { roomId, sender, description } = body ?? {};

    if (!roomId || !sender || !description) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const parcel = await createParcel({ roomId, sender, description });

    // Notify connected dashboards (resident in this room + all admins).
    emitParcelEvent({
      type: "parcel:new",
      roomId: parcel.roomId,
      parcelId: parcel.id,
    });

    return NextResponse.json(parcel, { status: 201 });
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.status });
    const msg = e instanceof Error ? e.message : "ERROR";
    if (msg === "ROOM_NOT_FOUND")
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    if (msg === "ROOM_NOT_OCCUPIED")
      return NextResponse.json({ error: "Room has no resident" }, { status: 409 });
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
