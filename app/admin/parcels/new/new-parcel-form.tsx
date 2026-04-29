"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import Button from "@/components/Button";
import RoomBadge from "@/components/RoomBadge";
import QRDisplay from "@/components/QRDisplay";
import { Icon } from "@/components/Icon";

interface Parcel {
  id: string;
  qrCode: string;
  roomId: string;
  sender: string;
  description: string;
  status: string;
  arrivedAt: string;
}

function Step({
  n,
  label,
  active,
  done,
}: {
  n: string;
  label: string;
  active?: boolean;
  done?: boolean;
}) {
  const bg = done || active ? "var(--accent)" : "var(--bg-muted)";
  const fg = done || active ? "white" : "var(--text-tertiary)";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div
        style={{
          width: 24,
          height: 24,
          borderRadius: "50%",
          background: bg,
          color: fg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 12,
          fontWeight: 700,
        }}
      >
        {done ? <Icon.Check size={13} strokeWidth={3} /> : n}
      </div>
      <span
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: active || done ? "var(--text)" : "var(--text-tertiary)",
        }}
      >
        {label}
      </span>
    </div>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <>
      <div style={{ color: "var(--text-tertiary)", fontSize: 13 }}>{label}</div>
      <div style={{ color: "var(--text)", fontWeight: 600 }}>{value}</div>
    </>
  );
}

export default function NewParcelForm({ rooms }: { rooms: string[] }) {
  const [roomId, setRoomId] = useState("");
  const [sender, setSender] = useState("");
  const [description, setDescription] = useState("");
  const [tracking, setTracking] = useState("");
  const [created, setCreated] = useState<Parcel | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/parcels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId, sender, description, tracking }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error ?? "Could not create parcel");
      setCreated(data);
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    setCreated(null);
    setSender("");
    setDescription("");
    setTracking("");
  }

  const step: "form" | "success" = created ? "success" : "form";

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontSize: 13,
          color: "var(--text-tertiary)",
          marginBottom: 14,
        }}
      >
        <Link href="/admin/dashboard" className="lnk" style={{ color: "var(--text-secondary)" }}>
          Dashboard
        </Link>
        <Icon.ChevronRight size={13} />
        <span style={{ color: "var(--text)" }}>New parcel</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
        <Step n="1" label="Details" active={step === "form"} done={step === "success"} />
        <div
          style={{
            flex: 1,
            height: 2,
            background: step === "success" ? "var(--accent)" : "var(--border-strong)",
            borderRadius: 1,
          }}
        />
        <Step n="2" label="QR ready" active={step === "success"} />
      </div>

      {step === "form" ? (
        <form onSubmit={onSubmit} className="card" style={{ padding: 28 }}>
          <div
            style={{
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "var(--text)",
            }}
          >
            Log a new parcel
          </div>
          <div
            style={{
              fontSize: 14,
              color: "var(--text-secondary)",
              marginTop: 4,
              marginBottom: 22,
            }}
          >
            Generate a QR code that the resident will use to claim their delivery.
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div style={{ gridColumn: "1 / -1" }}>
              <label className="field-label">Room</label>
              <select
                className="select"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select an occupied room…
                </option>
                {rooms.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <div className="field-help">Only rooms with a registered resident are shown.</div>
            </div>
            <div>
              <label className="field-label">Sender</label>
              <input
                className="input"
                placeholder="e.g. Lazada"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="field-label">
                Tracking #{" "}
                <span style={{ color: "var(--text-tertiary)", fontWeight: 500 }}>(optional)</span>
              </label>
              <input
                className="input"
                placeholder="LZD-..."
                value={tracking}
                onChange={(e) => setTracking(e.target.value)}
              />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label className="field-label">Description</label>
              <input
                className="input"
                placeholder="Box size, weight, notes…"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
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
                marginTop: 16,
              }}
            >
              {error}
            </p>
          )}

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 24 }}>
            <Link href="/admin/dashboard" className="btn btn-secondary">
              <span>Cancel</span>
            </Link>
            <Button type="submit" disabled={busy} leftIcon={<Icon.QrCode size={15} />}>
              {busy ? "Creating…" : "Create parcel"}
            </Button>
          </div>
        </form>
      ) : (
        created && (
          <div
            className="card"
            style={{
              padding: 28,
              display: "grid",
              gridTemplateColumns: "240px 1fr",
              gap: 32,
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
              }}
            >
              <QRDisplay value={created.qrCode} size={200} />
              <div
                className="mono"
                style={{
                  fontSize: 12,
                  color: "var(--text-tertiary)",
                  letterSpacing: ".04em",
                }}
              >
                {created.id}
              </div>
            </div>
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  color: "var(--emerald)",
                  fontWeight: 700,
                  fontSize: 13,
                  marginBottom: 6,
                }}
              >
                <Icon.CheckCircle size={16} /> Parcel created
              </div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  color: "var(--text)",
                }}
              >
                QR is ready to print
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: "var(--text-secondary)",
                  marginTop: 4,
                  marginBottom: 18,
                }}
              >
                Stick the printed QR on the parcel. The resident is now notified.
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "110px 1fr",
                  rowGap: 10,
                  columnGap: 16,
                  fontSize: 14,
                }}
              >
                <Field label="Room" value={<RoomBadge room={created.roomId} />} />
                <Field label="Sender" value={created.sender} />
                <Field label="Description" value={created.description} />
                <Field label="Arrived" value="Just now" />
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 22, flexWrap: "wrap" }}>
                <Button leftIcon={<Icon.Printer size={15} />} onClick={() => window.print()}>
                  Print QR
                </Button>
                <Button
                  variant="secondary"
                  leftIcon={<Icon.Plus size={15} />}
                  onClick={reset}
                >
                  Create another
                </Button>
                <Link href="/admin/dashboard" className="btn btn-ghost">
                  <Icon.ArrowLeft size={15} />
                  <span>Back to dashboard</span>
                </Link>
              </div>
            </div>
          </div>
        )
      )}
    </>
  );
}
