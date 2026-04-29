"use client";

import { FormEvent, useState } from "react";
import Button from "@/components/Button";
import RoomBadge from "@/components/RoomBadge";
import StatusBadge from "@/components/StatusBadge";
import EmptyState from "@/components/EmptyState";
import OTPInput from "@/components/OTPInput";
import QRScanner from "@/components/QRScanner";
import { Icon } from "@/components/Icon";

interface ParcelWithRoom {
  id: string;
  qrCode: string;
  roomId: string;
  sender: string;
  description: string;
  status: string;
  arrivedAt: string;
  pickedUpAt: string | null;
  room?: { id: string; user?: { name: string } | null };
}

function CornerBracket({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  const v = pos[0];
  const h = pos[1];
  return (
    <div
      style={{
        position: "absolute",
        ...(v === "t" ? { top: 16 } : { bottom: 16 }),
        ...(h === "l" ? { left: 16 } : { right: 16 }),
        width: 36,
        height: 36,
        borderTop: v === "t" ? "3px solid var(--accent)" : "none",
        borderBottom: v === "b" ? "3px solid var(--accent)" : "none",
        borderLeft: h === "l" ? "3px solid var(--accent)" : "none",
        borderRight: h === "r" ? "3px solid var(--accent)" : "none",
        borderRadius: 6,
      }}
    />
  );
}

export default function ScanClient() {
  const [code, setCode] = useState("");
  const [parcel, setParcel] = useState<ParcelWithRoom | null>(null);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [scannerOn, setScannerOn] = useState(false);
  const [busy, setBusy] = useState(false);

  async function lookup(qr: string) {
    setError(null);
    setInfo(null);
    setParcel(null);
    if (!qr.trim()) return setError("Enter a parcel code");
    setBusy(true);
    try {
      const res = await fetch(`/api/parcels/qr/${encodeURIComponent(qr.trim())}`);
      const data = await res.json();
      if (!res.ok) return setError(data.error ?? "Lookup failed");
      setParcel(data);
    } finally {
      setBusy(false);
    }
  }

  async function onLookupSubmit(e: FormEvent) {
    e.preventDefault();
    await lookup(code);
  }

  async function confirmPickup() {
    if (!parcel) return;
    setError(null);
    setBusy(true);
    try {
      const res = await fetch(`/api/parcels/${parcel.id}/pickup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error ?? "Pickup failed");
      setInfo("Pickup confirmed.");
      setParcel({ ...parcel, status: "picked_up", pickedUpAt: data.pickedUpAt });
      setOtp("");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 18 }}>
      {/* Scanner */}
      <div className="card" style={{ padding: 18 }}>
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)" }}>Camera scanner</div>
          <div style={{ fontSize: 13, color: "var(--text-tertiary)", marginTop: 2 }}>
            Point the front-desk camera at the QR sticker
          </div>
        </div>

        <div
          style={{
            position: "relative",
            aspectRatio: "4 / 3",
            background: "linear-gradient(135deg, #0b0b0f, #1a1a22)",
            borderRadius: 16,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {(["tl", "tr", "bl", "br"] as const).map((p) => (
            <CornerBracket key={p} pos={p} />
          ))}
          <div
            style={{
              position: "absolute",
              left: 16,
              right: 16,
              height: 2,
              background:
                "linear-gradient(90deg, transparent, var(--accent), transparent)",
              top: "50%",
              boxShadow: "0 0 18px var(--accent)",
            }}
          />
          {scannerOn ? (
            <div style={{ position: "absolute", inset: 0 }}>
              <QRScanner
                onScan={(text) => {
                  setCode(text);
                  setScannerOn(false);
                  lookup(text);
                }}
              />
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
                color: "rgba(255,255,255,0.7)",
                zIndex: 1,
              }}
            >
              <Icon.Camera size={26} />
              <span style={{ fontSize: 13, fontWeight: 600 }}>Point camera at QR</span>
            </div>
          )}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 14,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              color: "var(--text-tertiary)",
              fontSize: 12,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: scannerOn ? "var(--emerald)" : "var(--text-tertiary)",
              }}
            />
            {scannerOn ? "Camera active" : "Camera off"}
          </div>
          <Button
            variant={scannerOn ? "secondary" : "primary"}
            size="sm"
            onClick={() => setScannerOn((v) => !v)}
          >
            {scannerOn ? "Stop camera" : "Start camera"}
          </Button>
        </div>
      </div>

      {/* Manual */}
      <div
        className="card"
        style={{ padding: 18, display: "flex", flexDirection: "column", gap: 14 }}
      >
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)" }}>
            Or enter code manually
          </div>
          <div style={{ fontSize: 13, color: "var(--text-tertiary)", marginTop: 2 }}>
            Use the parcel ID printed on the QR sticker
          </div>
        </div>

        <form onSubmit={onLookupSubmit} style={{ display: "flex", gap: 8 }}>
          <input
            className="input mono"
            placeholder="Paste UUID or parcel code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            style={{ letterSpacing: ".05em", flex: 1 }}
          />
          <Button type="submit" disabled={busy}>
            Look up
          </Button>
        </form>

        {parcel ? (
          <div
            style={{
              padding: 14,
              borderRadius: 14,
              background: "var(--bg-soft)",
              border: "1px solid var(--border)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 10,
              }}
            >
              <Icon.CheckCircle size={15} style={{ color: "var(--emerald)" }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>
                Parcel found
              </span>
              <span style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
                <StatusBadge status={parcel.status} />
                <RoomBadge room={parcel.roomId} />
              </span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "90px 1fr",
                rowGap: 6,
                columnGap: 12,
                fontSize: 13,
              }}
            >
              <span style={{ color: "var(--text-tertiary)" }}>Resident</span>
              <span style={{ color: "var(--text)", fontWeight: 600 }}>
                {parcel.room?.user?.name ?? "—"}
              </span>
              <span style={{ color: "var(--text-tertiary)" }}>Sender</span>
              <span style={{ color: "var(--text)" }}>{parcel.sender}</span>
              <span style={{ color: "var(--text-tertiary)" }}>Description</span>
              <span style={{ color: "var(--text)" }}>{parcel.description}</span>
              <span style={{ color: "var(--text-tertiary)" }}>Arrived</span>
              <span style={{ color: "var(--text)" }}>
                {new Date(parcel.arrivedAt).toLocaleString()}
              </span>
            </div>
          </div>
        ) : (
          <EmptyState
            icon={<Icon.QrCode size={22} />}
            title="Waiting for a code"
            body="Scan a QR or paste a parcel ID to load the pickup details."
          />
        )}

        <div>
          <label className="field-label">Pickup code (OTP)</label>
          <OTPInput value={otp} onChange={setOtp} />
          <div className="field-help">
            Ask the resident for their 6-digit pickup code.{" "}
            <span className="mono">(Prototype: 123456)</span>
          </div>
        </div>

        {error && (
          <p
            style={{
              fontSize: 13,
              color: "var(--rose)",
              background: "var(--rose-soft)",
              padding: "8px 12px",
              borderRadius: 10,
              margin: 0,
            }}
          >
            {error}
          </p>
        )}
        {info && (
          <p
            style={{
              fontSize: 13,
              color: "var(--emerald)",
              background: "var(--emerald-soft)",
              padding: "8px 12px",
              borderRadius: 10,
              margin: 0,
            }}
          >
            {info}
          </p>
        )}

        <Button
          block
          size="lg"
          disabled={!parcel || parcel.status !== "waiting" || otp.length < 6 || busy}
          leftIcon={<Icon.ShieldCheck size={16} />}
          onClick={confirmPickup}
        >
          Confirm pickup
        </Button>
      </div>
    </div>
  );
}
