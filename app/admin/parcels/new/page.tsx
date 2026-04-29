import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import { getCurrentUser } from "@/lib/auth";
import { listRooms } from "@/lib/models/room";
import NewParcelForm from "./new-parcel-form";

export const dynamic = "force-dynamic";

export default async function NewParcelPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/resident/dashboard");

  const rooms = await listRooms({ occupied: true });

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar userName={user.name} role="admin" />
      <main className="scroll-y" style={{ flex: 1, padding: "24px 28px 40px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          {rooms.length === 0 ? (
            <div className="card" style={{ padding: 28, textAlign: "center" }}>
              <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>
                No occupied rooms — at least one resident must be registered before logging
                parcels.
              </p>
            </div>
          ) : (
            <NewParcelForm rooms={rooms.map((r) => r.id)} />
          )}
        </div>
      </main>
    </div>
  );
}
