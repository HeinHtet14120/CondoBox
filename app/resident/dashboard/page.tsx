import { redirect } from "next/navigation";
import Logo from "@/components/Logo";
import RoomBadge from "@/components/RoomBadge";
import EmptyState from "@/components/EmptyState";
import ResidentParcelList from "@/components/ResidentParcelList";
import ResidentTabBar from "@/components/ResidentTabBar";
import LiveUpdates from "@/components/LiveUpdates";
import { Icon } from "@/components/Icon";
import { getCurrentUser } from "@/lib/auth";
import { listParcelsByRoom } from "@/lib/models/parcel";

export const dynamic = "force-dynamic";

function toIsoOrNull(d: Date | null | undefined) {
  return d ? new Date(d).toISOString() : null;
}

export default async function ResidentDashboard() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "owner" || !user.roomId) redirect("/admin/dashboard");

  const parcels = await listParcelsByRoom(user.roomId);
  const waiting = parcels.filter((p) => p.status === "waiting");
  const history = parcels.filter((p) => p.status === "picked_up").slice(0, 10);
  const firstName = user.name.split(" ")[0];
  const otp = "482 197";

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
      {/* Top app bar */}
      <header
        style={{
          padding: "14px 18px 12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "var(--bg-elev)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <Logo />
        <button
          aria-label="Notifications"
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            border: "1px solid var(--border)",
            background: "var(--bg-elev)",
            color: "var(--text-secondary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            cursor: "pointer",
          }}
        >
          <Icon.Bell size={16} />
          {waiting.length > 0 ? (
            <span
              style={{
                position: "absolute",
                top: 7,
                right: 7,
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "var(--rose)",
                border: "2px solid var(--bg-elev)",
              }}
            />
          ) : null}
        </button>
      </header>

      <main
        className="scroll-y"
        style={{ flex: 1, padding: "18px 18px 24px", maxWidth: 600, margin: "0 auto", width: "100%" }}
      >
        {/* Greeting */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 800,
                letterSpacing: "-0.02em",
                color: "var(--text)",
              }}
            >
              Hello, {firstName}
            </div>
            <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 2 }}>
              Welcome back
            </div>
          </div>
          <RoomBadge room={`Room ${user.roomId}`} />
        </div>

        {/* OTP card */}
        <div
          className="card glow-accent"
          style={{
            padding: 20,
            background:
              "linear-gradient(160deg, color-mix(in oklab, var(--accent) 7%, var(--bg-elev)), var(--bg-elev) 70%)",
            border: "1px solid color-mix(in oklab, var(--accent) 25%, var(--border))",
            marginBottom: 22,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: "var(--accent)",
              fontWeight: 700,
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: ".08em",
            }}
          >
            <Icon.ShieldCheck size={14} /> Your pickup code
          </div>
          <div
            className="mono"
            style={{
              fontSize: 38,
              fontWeight: 700,
              letterSpacing: "0.18em",
              color: "var(--text)",
              marginTop: 10,
            }}
          >
            {otp}
          </div>
          <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 6 }}>
            Show this to the office at pickup. (Prototype only — fixed value 123456 also accepted.)
          </div>
        </div>

        {/* Waiting */}
        <section style={{ marginBottom: 22 }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)" }}>
              Waiting for pickup ({waiting.length})
            </div>
          </div>
          {waiting.length === 0 ? (
            <div className="card" style={{ padding: 0 }}>
              <EmptyState
                icon={<Icon.Inbox size={22} />}
                title="No parcels waiting"
                body="When the office logs a new delivery for you, it'll show up here."
              />
            </div>
          ) : (
            <ResidentParcelList
              parcels={waiting.map((p) => ({
                id: p.id,
                qrCode: p.qrCode,
                roomId: p.roomId,
                sender: p.sender,
                description: p.description,
                status: p.status,
                arrivedAt: new Date(p.arrivedAt).toISOString(),
                pickedUpAt: toIsoOrNull(p.pickedUpAt),
              }))}
            />
          )}
        </section>

        {/* History */}
        <section>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)" }}>History</div>
          </div>
          {history.length === 0 ? (
            <div className="card" style={{ padding: 0 }}>
              <EmptyState
                icon={<Icon.History size={22} />}
                title="No history yet"
                body="Picked-up parcels will appear here."
              />
            </div>
          ) : (
            <ResidentParcelList
              compactPickedUp
              parcels={history.map((p) => ({
                id: p.id,
                qrCode: p.qrCode,
                roomId: p.roomId,
                sender: p.sender,
                description: p.description,
                status: p.status,
                arrivedAt: new Date(p.arrivedAt).toISOString(),
                pickedUpAt: toIsoOrNull(p.pickedUpAt),
              }))}
            />
          )}
        </section>
      </main>

      <ResidentTabBar active="home" />
    </div>
  );
}
