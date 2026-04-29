import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, AuthError } from "@/lib/auth";
import { initializeCondo } from "@/lib/models/condo";

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const totalRooms = Number(body?.totalRooms);

    const result = await initializeCondo(totalRooms);
    return NextResponse.json({ isInitialized: true, ...result }, { status: 201 });
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.status });
    const msg = e instanceof Error ? e.message : "ERROR";
    if (msg === "INVALID_ROOM_COUNT")
      return NextResponse.json({ error: "totalRooms must be 1–999" }, { status: 400 });
    if (msg === "ALREADY_INITIALIZED")
      return NextResponse.json({ error: "Condo already initialized" }, { status: 409 });
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
