import Link from "next/link";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import StatusBadge from "@/components/StatusBadge";
import RoomBadge from "@/components/RoomBadge";
import StatCard from "@/components/StatCard";
import EmptyState from "@/components/EmptyState";
import ParcelCard from "@/components/ParcelCard";
import LiveUpdates from "@/components/LiveUpdates";
import { Icon } from "@/components/Icon";
import { getCurrentUser } from "@/lib/auth";
import { getCondoConfig } from "@/lib/models/condo";
import { listAllParcels } from "@/lib/models/parcel";
import { listRooms } from "@/lib/models/room";

export const dynamic = "force-dynamic";

function timeOnly(d: Date | string | null | undefined) {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default async function AdminDashboard() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/resident/dashboard");

  const config = await getCondoConfig();
  if (!config.isInitialized) redirect("/admin/setup");

  const [parcels, rooms] = await Promise.all([listAllParcels(), listRooms()]);
  const waiting = parcels.filter((p) => p.status === "waiting");
  const recent = parcels.filter((p) => p.status === "picked_up").slice(0, 10);
  const occupied = rooms.filter((r) => r.isOccupied).length;
  const todayPickups = parcels.filter((p) => {
    if (p.status !== "picked_up" || !p.pickedUpAt) return false;
    const d = new Date(p.pickedUpAt);
    const now = new Date();
    return (
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate()
    );
  }).length;

  const greetingName = user.name.split(" ")[0];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column" }}>
      <LiveUpdates />
      <Navbar userName={user.name} role="admin" />
      <main className="scroll-y" style={{ flex: 1, padding: "24px 28px 40px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          {/* Page header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: 24,
              gap: 24,
              flexWrap: "wrap",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--text-tertiary)",
                  textTransform: "uppercase",
                  letterSpacing: ".06em",
                }}
              >
                Front desk
              </div>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  letterSpacing: "-0.025em",
                  color: "var(--text)",
                  marginTop: 4,
                }}
              >
                Good day, {greetingName}
              </div>
              <div style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 4 }}>
                Here's what's happening today.
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <Link href="/admin/scan" className="btn btn-secondary">
                <Icon.QrCode size={15} />
                <span>Scan QR for pickup</span>
              </Link>
              <Link href="/admin/parcels/new" className="btn btn-primary">
                <Icon.Plus size={15} />
                <span>New parcel</span>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 14,
              marginBottom: 24,
            }}
          >
            <StatCard
              label="Waiting for pickup"
              value={waiting.length}
              sub="parcels"
              accent="amber"
              icon={<Icon.Package size={15} />}
            />
            <StatCard
              label="Picked up today"
              value={todayPickups}
              sub="parcels"
              accent="emerald"
              icon={<Icon.CheckCircle size={15} />}
            />
            <StatCard
              label="Occupied rooms"
              value={occupied}
              sub={`of ${rooms.length} rooms`}
              icon={<Icon.Building size={15} />}
            />
          </div>

          {/* Waiting list */}
          <div className="card" style={{ marginBottom: 18 }}>
            <div
              style={{
                padding: "16px 18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>
                  Waiting for pickup
                </div>
                <div style={{ fontSize: 13, color: "var(--text-tertiary)", marginTop: 2 }}>
                  {waiting.length} parcels — oldest first
                </div>
              </div>
            </div>

            {waiting.length === 0 ? (
              <EmptyState
                icon={<Icon.Inbox size={26} />}
                title="All caught up"
                body="No parcels are waiting for pickup right now. New ones will show up here automatically."
                action={
                  <Link href="/admin/parcels/new" className="btn btn-primary btn-sm">
                    <Icon.Plus size={14} />
                    <span>New parcel</span>
                  </Link>
                }
              />
            ) : (
              <>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "76px 1.4fr 1.2fr 1.6fr 130px 28px",
                    gap: 16,
                    padding: "10px 16px",
                    fontSize: 12,
                    fontWeight: 600,
                    color: "var(--text-tertiary)",
                    textTransform: "uppercase",
                    letterSpacing: ".06em",
                    borderTop: "1px solid var(--border)",
                    borderBottom: "1px solid var(--border)",
                    background: "var(--bg-soft)",
                  }}
                >
                  <div>Room</div>
                  <div>Resident</div>
                  <div>Sender</div>
                  <div>Description</div>
                  <div>Arrived</div>
                  <div />
                </div>
                {waiting.map((p) => (
                  <ParcelCard
                    key={p.id}
                    variant="admin"
                    parcel={{
                      id: p.id,
                      roomId: p.roomId,
                      sender: p.sender,
                      description: p.description,
                      status: p.status,
                      arrivedAt: p.arrivedAt as unknown as Date,
                      resident: p.room?.user?.name ?? null,
                    }}
                  />
                ))}
              </>
            )}
          </div>

          {/* Recent pickups */}
          <div className="card">
            <div
              style={{
                padding: "14px 18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)" }}>
                  Recent pickups
                </div>
                <div style={{ fontSize: 13, color: "var(--text-tertiary)", marginTop: 2 }}>
                  Last {recent.length} parcels
                </div>
              </div>
            </div>
            {recent.length === 0 ? (
              <EmptyState
                icon={<Icon.History size={22} />}
                title="No pickups yet"
                body="Recent pickups will be listed here once residents collect their parcels."
              />
            ) : (
              recent.map((p) => (
                <div
                  key={p.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "76px 1.4fr 1.2fr 1.6fr 1fr",
                    alignItems: "center",
                    gap: 16,
                    padding: "10px 18px",
                    borderTop: "1px solid var(--border)",
                    fontSize: 13,
                    color: "var(--text-secondary)",
                  }}
                >
                  <RoomBadge room={p.roomId} />
                  <div style={{ color: "var(--text)", fontWeight: 600 }}>
                    {p.room?.user?.name ?? "—"}
                  </div>
                  <div>{p.sender}</div>
                  <div>{p.description}</div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      gap: 8,
                    }}
                  >
                    <StatusBadge status="picked_up" />
                    <span style={{ color: "var(--text-tertiary)", fontSize: 12 }}>
                      {timeOnly(p.pickedUpAt)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
