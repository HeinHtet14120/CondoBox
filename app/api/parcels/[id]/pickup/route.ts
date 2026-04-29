import { NextResponse } from "next/server";
import { requireAdmin, AuthError } from "@/lib/auth";
import { markParcelPickedUp, getParcelById } from "@/lib/models/parcel";
import { emitParcelEvent } from "@/lib/events";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    const body = await req.json().catch(() => ({}));
    const otp = body?.otp;

    const fixedOtp = process.env.FIXED_OTP ?? "123456";
    if (otp !== fixedOtp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    const existing = await getParcelById(params.id);
    if (!existing) return NextResponse.json({ error: "Parcel not found" }, { status: 404 });
    if (existing.status === "picked_up") {
      return NextResponse.json(
        { error: "Parcel already picked up", pickedUpAt: existing.pickedUpAt },
        { status: 409 },
      );
    }

    const updated = await markParcelPickedUp(params.id);

    // Notify connected dashboards (resident in this room + all admins).
    if (updated) {
      emitParcelEvent({
        type: "parcel:picked_up",
        roomId: updated.roomId,
        parcelId: updated.id,
      });
    }

    return NextResponse.json(updated);
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.status });
    const msg = e instanceof Error ? e.message : "ERROR";
    if (msg === "ALREADY_PICKED_UP_OR_MISSING") {
      return NextResponse.json({ error: "Parcel already picked up" }, { status: 409 });
    }
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
