import { NextResponse } from "next/server";
import { requireUser, AuthError } from "@/lib/auth";
import { getParcelById } from "@/lib/models/parcel";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await requireUser();
    const parcel = await getParcelById(params.id);
    if (!parcel) return NextResponse.json({ error: "Parcel not found" }, { status: 404 });

    if (user.role === "owner" && parcel.roomId !== user.roomId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json(parcel);
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.status });
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
