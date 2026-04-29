"use client";

import { useEffect, useState } from "react";
import Button from "./Button";
import RoomBadge from "./RoomBadge";
import StatusBadge from "./StatusBadge";
import QRDisplay from "./QRDisplay";
import { Icon } from "./Icon";

// ── UI feature flags ────────────────────────────────────────────
// Flip to `false` to hide the raw QR/UUID block from residents.
// Kept as a single top-level constant so it can be toggled in one place.
const SHOW_PARCEL_UUID = true;
// ────────────────────────────────────────────────────────────────

interface Parcel {
  id: string;
  qrCode: string;
  roomId: string;
  sender: string;
  description: string;
  status: string;
  arrivedAt: string | Date;
  pickedUpAt?: string | Date | null;
}

interface Props {
  parcel: Parcel | null;
  onClose: () => void;
}

function fmt(d: Date | string | null | undefined) {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ParcelDetailSheet({ parcel, onClose }: Props) {
  const [copied, setCopied] = useState(false);

  // Lock body scroll while open + close on Escape
  useEffect(() => {
    if (!parcel) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [parcel, onClose]);

  if (!parcel) return null;

  async function copyUuid() {
    if (!parcel) return;
    try {
      await navigator.clipboard.writeText(parcel.qrCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard may be blocked (insecure context, permissions, etc.)
      // Fall back to selecting via prompt so the user can copy manually.
      window.prompt("Copy parcel code", parcel.qrCode);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Parcel detail"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(11,11,15,0.55)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--bg-elev)",
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          width: "100%",
          maxWidth: 600,
          boxShadow: "0 -20px 60px rgba(0,0,0,0.25)",
          display: "flex",
          flexDirection: "column",
          maxHeight: "92vh",
        }}
      >
        {/* Grabber */}
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 10 }}>
          <div
            style={{
              width: 42,
              height: 4,
              borderRadius: 2,
              background: "var(--border-strong)",
            }}
          />
        </div>

        {/* Header row */}
        <div
          style={{
            padding: "8px 18px 0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "var(--text-tertiary)",
              textTransform: "uppercase",
              letterSpacing: ".08em",
            }}
          >
            Parcel
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              border: "1px solid var(--border)",
              background: "var(--bg-elev)",
              color: "var(--text-secondary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <Icon.X size={16} />
          </button>
        </div>

        <div
          className="scroll-y"
          style={{
            padding: "14px 22px 22px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 18,
          }}
        >
          <QRDisplay value={parcel.qrCode} size={210} />

          <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
            <StatusBadge status={parcel.status} />
          </div>

          {/* UUID copy block — hidden when SHOW_PARCEL_UUID = false */}
          {SHOW_PARCEL_UUID ? (
            <div
              style={{
                width: "100%",
                display: "flex",
                gap: 8,
                alignItems: "stretch",
                background: "var(--bg-soft)",
                border: "1px solid var(--border)",
                borderRadius: 14,
                padding: 8,
              }}
            >
              <div
                className="mono"
                style={{
                  flex: 1,
                  minWidth: 0,
                  fontSize: 12,
                  color: "var(--text-secondary)",
                  background: "var(--bg-elev)",
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                  padding: "10px 12px",
                  display: "flex",
                  alignItems: "center",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  userSelect: "all",
                }}
                title={parcel.qrCode}
              >
                {parcel.qrCode}
              </div>
              <Button
                variant={copied ? "secondary" : "primary"}
                size="sm"
                onClick={copyUuid}
                leftIcon={
                  copied ? (
                    <Icon.Check size={14} strokeWidth={3} />
                  ) : (
                    <Icon.QrCode size={14} />
                  )
                }
              >
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
          ) : null}

          {/* Details grid */}
          <div
            style={{
              width: "100%",
              background: "var(--bg-soft)",
              border: "1px solid var(--border)",
              borderRadius: 16,
              padding: 14,
              display: "grid",
              gridTemplateColumns: "100px 1fr",
              rowGap: 10,
              columnGap: 12,
              fontSize: 14,
            }}
          >
            <span style={{ color: "var(--text-tertiary)" }}>Sender</span>
            <span style={{ color: "var(--text)", fontWeight: 600 }}>{parcel.sender}</span>
            <span style={{ color: "var(--text-tertiary)" }}>Description</span>
            <span style={{ color: "var(--text)" }}>{parcel.description}</span>
            <span style={{ color: "var(--text-tertiary)" }}>Arrived</span>
            <span style={{ color: "var(--text)" }}>{fmt(parcel.arrivedAt)}</span>
            {parcel.pickedUpAt ? (
              <>
                <span style={{ color: "var(--text-tertiary)" }}>Picked up</span>
                <span style={{ color: "var(--text)" }}>{fmt(parcel.pickedUpAt)}</span>
              </>
            ) : null}
            <span style={{ color: "var(--text-tertiary)" }}>Room</span>
            <span>
              <RoomBadge room={parcel.roomId} />
            </span>
          </div>

          <Button block variant="ghost" leftIcon={<Icon.X size={15} />} onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
