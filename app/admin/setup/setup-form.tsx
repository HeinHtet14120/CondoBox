"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import Button from "@/components/Button";
import { Icon } from "@/components/Icon";

export default function SetupForm() {
  const router = useRouter();
  const [totalRooms, setTotalRooms] = useState("10");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const n = Math.max(0, Math.min(999, parseInt(totalRooms, 10) || 0));
  const previewIds = Array.from({ length: Math.min(n, 12) }, (_, i) =>
    "R" + String(i + 1).padStart(3, "0"),
  );
  const more = Math.max(0, n - previewIds.length);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/condo/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ totalRooms: Number(totalRooms) }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error ?? "Setup failed");
      router.push("/admin/dashboard");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <div>
        <label className="field-label">Total number of rooms</label>
        <input
          className="input"
          type="number"
          min={1}
          max={999}
          value={totalRooms}
          onChange={(e) => setTotalRooms(e.target.value)}
          placeholder="e.g. 50"
          style={{ maxWidth: 200 }}
          required
        />
        <div className="field-help">
          We'll create rooms{" "}
          <span className="mono" style={{ color: "var(--text-secondary)" }}>
            R001
          </span>{" "}
          through{" "}
          <span className="mono" style={{ color: "var(--text-secondary)" }}>
            R{String(Math.max(n, 1)).padStart(3, "0")}
          </span>{" "}
          automatically. This can't be undone.
        </div>
      </div>

      {n > 0 ? (
        <div style={{ marginTop: 24 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "var(--text-tertiary)",
              textTransform: "uppercase",
              letterSpacing: ".06em",
              marginBottom: 10,
            }}
          >
            Preview
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {previewIds.map((id) => (
              <span
                key={id}
                className="mono"
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  padding: "4px 10px",
                  borderRadius: 999,
                  background: "var(--bg-muted)",
                  color: "var(--text-secondary)",
                }}
              >
                {id}
              </span>
            ))}
            {more > 0 ? (
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  padding: "4px 10px",
                  borderRadius: 999,
                  background: "var(--accent-soft)",
                  color: "var(--accent)",
                }}
              >
                +{more} more
              </span>
            ) : null}
          </div>
        </div>
      ) : null}

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

      <div style={{ display: "flex", gap: 10, marginTop: 28 }}>
        <Button variant="secondary" type="button" onClick={() => router.back()}>
          Cancel
        </Button>
        <div style={{ flex: 1 }} />
        <Button
          type="submit"
          disabled={!n || busy}
          leftIcon={<Icon.Sparkles size={15} />}
        >
          {busy ? "Initializing…" : "Initialize condo"}
        </Button>
      </div>
    </form>
  );
}
