import { redirect } from "next/navigation";
import Logo from "@/components/Logo";
import RoomBadge from "@/components/RoomBadge";
import ResidentTabBar from "@/components/ResidentTabBar";
import { Icon } from "@/components/Icon";
import { getCurrentUser } from "@/lib/auth";
import { listParcelsByRoom } from "@/lib/models/parcel";
import LogoutButton from "./logout-button";

export const dynamic = "force-dynamic";

function Row({
  label,
  value,
  icon,
}: {
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "14px 16px",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: "var(--bg-muted)",
          color: "var(--text-secondary)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div
          style={{
            fontSize: 12,
            color: "var(--text-tertiary)",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: ".06em",
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: 14,
            color: "var(--text)",
            fontWeight: 600,
            marginTop: 2,
            wordBreak: "break-word",
          }}
        >
          {value}
        </div>
      </div>
    </div>
  );
}

export default async function ResidentProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "owner" || !user.roomId) redirect("/admin/dashboard");

  const parcels = await listParcelsByRoom(user.roomId);
  const totalCount = parcels.length;
  const waitingCount = parcels.filter((p) => p.status === "waiting").length;
  const pickedUpCount = totalCount - waitingCount;

  const initials = user.name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        display: "flex",
        flexDirection: "column",
      }}
    >
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
          padding: "24px 18px 24px",
          maxWidth: 600,
          margin: "0 auto",
          width: "100%",
        }}
      >
        {/* Identity hero */}
        <div
          className="card"
          style={{
            padding: 24,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            marginBottom: 18,
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background:
                "linear-gradient(135deg, color-mix(in oklab, var(--accent) 70%, white), var(--accent))",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              fontWeight: 800,
              letterSpacing: "-0.02em",
              marginBottom: 14,
              boxShadow: "0 6px 18px color-mix(in oklab, var(--accent) 30%, transparent)",
            }}
          >
            {initials || "·"}
          </div>
          <div
            style={{
              fontSize: 20,
              fontWeight: 800,
              letterSpacing: "-0.02em",
              color: "var(--text)",
            }}
          >
            {user.name}
          </div>
          <div
            className="mono"
            style={{
              fontSize: 13,
              color: "var(--text-tertiary)",
              marginTop: 4,
            }}
          >
            @{user.username}
          </div>
          <div style={{ marginTop: 12 }}>
            <RoomBadge room={`Room ${user.roomId}`} />
          </div>
        </div>

        {/* Stats strip */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 10,
            marginBottom: 18,
          }}
        >
          {[
            { label: "Waiting", value: waitingCount, tone: "var(--amber)" },
            { label: "Picked up", value: pickedUpCount, tone: "var(--emerald)" },
            { label: "Total", value: totalCount, tone: "var(--accent)" },
          ].map((s) => (
            <div
              key={s.label}
              className="card"
              style={{
                padding: 14,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
              }}
            >
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: s.tone,
                  letterSpacing: "-0.02em",
                }}
              >
                {s.value}
              </div>
              <div style={{ fontSize: 11, color: "var(--text-tertiary)", fontWeight: 600 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Account details */}
        <div className="card" style={{ marginBottom: 18, overflow: "hidden" }}>
          <div
            style={{
              padding: "14px 16px",
              fontSize: 12,
              fontWeight: 700,
              color: "var(--text-tertiary)",
              textTransform: "uppercase",
              letterSpacing: ".06em",
            }}
          >
            Account
          </div>
          <Row icon={<Icon.User size={16} />} label="Full name" value={user.name} />
          <Row icon={<Icon.ShieldCheck size={16} />} label="Username" value={`@${user.username}`} />
          <Row icon={<Icon.Building size={16} />} label="Room" value={user.roomId} />
        </div>

        {/* Actions */}
        <LogoutButton />
      </main>

      <ResidentTabBar active="profile" />
    </div>
  );
}
