import { NextResponse } from "next/server";
import { requireAdmin, AuthError } from "@/lib/auth";
import { getParcelByQrCode } from "@/lib/models/parcel";

export async function GET(_req: Request, { params }: { params: { qrCode: string } }) {
  try {
    await requireAdmin();
    const parcel = await getParcelByQrCode(params.qrCode);
    if (!parcel) return NextResponse.json({ error: "Parcel not found" }, { status: 404 });
    return NextResponse.json(parcel);
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.status });
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
