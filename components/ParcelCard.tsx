import StatusBadge from "./StatusBadge";
import RoomBadge from "./RoomBadge";
import { Icon } from "./Icon";

interface Parcel {
  id: string;
  qrCode?: string;
  roomId: string;
  sender: string;
  description: string;
  status: string;
  arrivedAt: string | Date;
  pickedUpAt?: string | Date | null;
  resident?: string | null;
}

interface Props {
  parcel: Parcel;
  variant?: "admin" | "resident";
  onClick?: () => void;
  rightSlot?: React.ReactNode;
}

function relTime(date: string | Date | null | undefined) {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  const diffMs = Date.now() - d.getTime();
  const mins = Math.round(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return days === 1 ? "Yesterday" : `${days} days ago`;
  return d.toLocaleDateString();
}

export default function ParcelCard({ parcel, variant = "admin", onClick, rightSlot }: Props) {
  if (variant === "admin") {
    return (
      <div
        className="row-hover"
        onClick={onClick}
        style={{
          display: "grid",
          gridTemplateColumns: "76px 1.4fr 1.2fr 1.6fr 130px 28px",
          alignItems: "center",
          gap: 16,
          padding: "14px 16px",
          borderTop: "1px solid var(--border)",
          cursor: onClick ? "pointer" : "default",
          fontSize: 14,
        }}
      >
        <RoomBadge room={parcel.roomId} />
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontWeight: 600,
              color: "var(--text)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {parcel.resident ?? "—"}
          </div>
        </div>
        <div
          style={{
            color: "var(--text-secondary)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {parcel.sender}
        </div>
        <div
          style={{
            color: "var(--text-secondary)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {parcel.description}
        </div>
        <div
          style={{
            color: "var(--text-tertiary)",
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 13,
          }}
        >
          <Icon.Clock size={13} /> {relTime(parcel.arrivedAt)}
        </div>
        {rightSlot ?? <Icon.ChevronRight size={16} style={{ color: "var(--text-tertiary)" }} />}
      </div>
    );
  }

  // Resident mobile card
  return (
    <div
      onClick={onClick}
      style={{
        background: "var(--bg-elev)",
        border: "1px solid var(--border)",
        borderRadius: 16,
        padding: 14,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        cursor: onClick ? "pointer" : "default",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", gap: 12, alignItems: "center", minWidth: 0 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              flexShrink: 0,
              background: "var(--accent-soft)",
              color: "var(--accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon.Package size={20} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontWeight: 700,
                fontSize: 15,
                color: "var(--text)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {parcel.sender}
            </div>
            <div
              style={{
                color: "var(--text-secondary)",
                fontSize: 13,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {parcel.description}
            </div>
          </div>
        </div>
        <StatusBadge status={parcel.status} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div
          style={{
            color: "var(--text-tertiary)",
            fontSize: 12,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Icon.Clock size={12} />
          {parcel.status === "picked_up"
            ? `Picked up · ${relTime(parcel.pickedUpAt)}`
            : relTime(parcel.arrivedAt)}
        </div>
        {parcel.status !== "picked_up" ? (
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={(e) => {
              e.stopPropagation();
              onClick?.();
            }}
          >
            <Icon.QrCode size={13} />
            <span>View QR</span>
          </button>
        ) : null}
      </div>
    </div>
  );
}
