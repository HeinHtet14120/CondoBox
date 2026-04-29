import { NextResponse } from "next/server";
import { requireUser, AuthError } from "@/lib/auth";
import { getCondoConfig } from "@/lib/models/condo";

export async function GET() {
  try {
    await requireUser();
    const config = await getCondoConfig();
    return NextResponse.json({
      isInitialized: config.isInitialized,
      totalRooms: config.totalRooms,
    });
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.status });
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
