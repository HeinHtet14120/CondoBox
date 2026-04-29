import type { ReactNode } from "react";

interface Props {
  label: string;
  value: ReactNode;
  sub?: string;
  accent?: "amber" | "emerald" | "indigo";
  icon?: ReactNode;
}

export default function StatCard({ label, value, sub, accent = "indigo", icon }: Props) {
  const tone =
    accent === "amber"
      ? { bg: "var(--amber-soft)", fg: "var(--amber)" }
      : accent === "emerald"
      ? { bg: "var(--emerald-soft)", fg: "var(--emerald)" }
      : { bg: "var(--accent-soft)", fg: "var(--accent)" };

  return (
    <div className="card" style={{ padding: 18, display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ color: "var(--text-secondary)", fontSize: 13, fontWeight: 600 }}>{label}</div>
        {icon ? (
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: tone.bg,
              color: tone.fg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon}
          </div>
        ) : null}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <div
          style={{
            fontSize: 32,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: "var(--text)",
          }}
        >
          {value}
        </div>
        {sub ? <div style={{ color: "var(--text-tertiary)", fontSize: 13 }}>{sub}</div> : null}
      </div>
    </div>
  );
}
