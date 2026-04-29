import { NextRequest, NextResponse } from "next/server";
import { createOwner } from "@/lib/models/user";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, username, password, roomId } = body ?? {};

    if (!name || !username || !password || !roomId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    if (typeof password !== "string" || password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const user = await createOwner({ name, username, password, roomId });
    return NextResponse.json(
      { id: user.id, username: user.username, name: user.name, roomId: user.roomId },
      { status: 201 },
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : "ERROR";
    if (msg === "USERNAME_TAKEN")
      return NextResponse.json({ error: "Username already taken" }, { status: 409 });
    if (msg === "ROOM_OCCUPIED")
      return NextResponse.json({ error: "Room already occupied" }, { status: 409 });
    if (msg === "ROOM_NOT_FOUND")
      return NextResponse.json({ error: "Room not found" }, { status: 409 });
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
