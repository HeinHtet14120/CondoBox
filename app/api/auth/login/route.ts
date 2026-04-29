import { NextRequest, NextResponse } from "next/server";
import { createSession } from "@/lib/auth";
import { findUserByUsername, verifyPassword } from "@/lib/models/user";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body ?? {};

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password required" }, { status: 400 });
    }

    const user = await findUserByUsername(username);
    if (!user) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }

    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }

    await createSession({ userId: user.id, role: user.role as "admin" | "owner" });

    return NextResponse.json({
      id: user.id,
      username: user.username,
      role: user.role,
      roomId: user.roomId,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
