import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { listRooms } from "@/lib/models/room";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const available = searchParams.get("available") === "true";
    const occupied = searchParams.get("occupied") === "true";

    // The registration page (public) needs available rooms to populate
    // its dropdown. All other room queries require auth.
    if (!available) {
      const user = await getCurrentUser();
      if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const rooms = await listRooms({ available, occupied });
    return NextResponse.json(rooms);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
