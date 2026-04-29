import Link from "next/link";
import { redirect } from "next/navigation";
import Logo from "@/components/Logo";
import EmptyState from "@/components/EmptyState";
import ResidentParcelList from "@/components/ResidentParcelList";
import ResidentTabBar from "@/components/ResidentTabBar";
import LiveUpdates from "@/components/LiveUpdates";
import { Icon } from "@/components/Icon";
import { getCurrentUser } from "@/lib/auth";
import { listParcelsByRoom } from "@/lib/models/parcel";

export const dynamic = "force-dynamic";

type Filter = "all" | "waiting" | "picked_up";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "waiting", label: "Waiting" },
  { id: "picked_up", label: "Picked up" },
];

function toIsoOrNull(d: Date | null | undefined) {
  return d ? new Date(d).toISOString() : null;
}

export default async function ResidentParcelsPage({
  searchParams,
}: {
  searchParams: { filter?: string };
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "owner" || !user.roomId) redirect("/admin/dashboard");

  const filter: Filter =
    searchParams.filter === "waiting" || searchParams.filter === "picked_up"
      ? searchParams.filter
      : "all";

  const all = await listParcelsByRoom(user.roomId);
  const visible =
    filter === "all" ? all : all.filter((p) => p.status === filter);
  const waitingCount = all.filter((p) => p.status === "waiting").length;
  const pickedUpCount = all.length - waitingCount;

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
      </header>

      <main
        className="scroll-y"
        style={{
          flex: 1,
          padding: "18px 18px 24px",
          maxWidth: 600,
          margin: "0 auto",
          width: "100%",
        }}
      >
        <div style={{ marginBottom: 16 }}>
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: "-0.02em",
              color: "var(--text)",
            }}
          >
            My parcels
          </div>
          <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 2 }}>
            {waitingCount} waiting · {pickedUpCount} picked up
          </div>
        </div>

        {/* Filter tabs */}
        <div
          style={{
            display: "inline-flex",
            background: "var(--bg-muted)",
            borderRadius: 12,
            padding: 3,
            marginBottom: 16,
            gap: 2,
          }}
        >
          {FILTERS.map((f) => {
            const isActive = f.id === filter;
            return (
              <Link
                key={f.id}
                href={f.id === "all" ? "/resident/parcels" : `/resident/parcels?filter=${f.id}`}
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  padding: "7px 14px",
                  borderRadius: 9,
                  textDecoration: "none",
                  background: isActive ? "var(--bg-elev)" : "transparent",
                  color: isActive ? "var(--text)" : "var(--text-secondary)",
                  boxShadow: isActive ? "var(--shadow-sm)" : "none",
                }}
              >
                {f.label}
              </Link>
            );
          })}
        </div>

        {visible.length === 0 ? (
          <div className="card" style={{ padding: 0 }}>
            <EmptyState
              icon={<Icon.Inbox size={22} />}
              title={
                filter === "waiting"
                  ? "No parcels waiting"
                  : filter === "picked_up"
                  ? "No picked-up parcels yet"
                  : "No parcels yet"
              }
              body={
                filter === "waiting"
                  ? "When the office logs a new delivery, it'll show up here."
                  : "Once you pick up a parcel, it'll appear in your history."
              }
            />
          </div>
        ) : (
          <ResidentParcelList
            compactPickedUp
            parcels={visible.map((p) => ({
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
      </main>

      <ResidentTabBar active="parcels" />
    </div>
  );
}
