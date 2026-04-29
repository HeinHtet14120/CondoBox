import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import LiveUpdates from "@/components/LiveUpdates";
import { getCurrentUser } from "@/lib/auth";
import ScanClient from "./scan-client";

export default async function ScanPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/resident/dashboard");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <LiveUpdates />
      <Navbar userName={user.name} role="admin" />
      <main className="scroll-y" style={{ flex: 1, padding: "24px 28px 40px" }}>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <div style={{ marginBottom: 20 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "var(--text-tertiary)",
                textTransform: "uppercase",
                letterSpacing: ".06em",
              }}
            >
              Pickup
            </div>
            <div
              style={{
                fontSize: 26,
                fontWeight: 800,
                letterSpacing: "-0.025em",
                color: "var(--text)",
                marginTop: 4,
              }}
            >
              Confirm parcel pickup
            </div>
            <div style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 4 }}>
              Scan the printed QR or enter the parcel code manually.
            </div>
          </div>

          <ScanClient />
        </div>
      </main>
    </div>
  );
}
