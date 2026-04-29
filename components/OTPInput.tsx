"use client";

import { useRef } from "react";

interface Props {
  value: string;
  onChange: (next: string) => void;
}

export default function OTPInput({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const digits = value.padEnd(6, " ").slice(0, 6).split("");
  const cursor = Math.min(value.length, 5);

  return (
    <div style={{ position: "relative" }}>
      <div style={{ display: "flex", gap: 8 }}>
        {digits.map((d, i) => {
          const focused = i === cursor && value.length < 6;
          return (
            <div
              key={i}
              className="mono"
              onClick={() => inputRef.current?.focus()}
              style={{
                flex: 1,
                height: 52,
                borderRadius: 12,
                border: `1px solid ${focused ? "var(--accent)" : "var(--border-strong)"}`,
                background: "var(--bg-elev)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                fontWeight: 700,
                color: d.trim() ? "var(--text)" : "var(--text-tertiary)",
                boxShadow: focused
                  ? "0 0 0 3px color-mix(in oklab, var(--accent) 18%, transparent)"
                  : "none",
                cursor: "text",
                userSelect: "none",
              }}
            >
              {d.trim() || "·"}
            </div>
          );
        })}
      </div>
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 6))}
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0,
          width: "100%",
          height: "100%",
          padding: 0,
          border: 0,
        }}
        aria-label="One-time pickup code"
      />
    </div>
  );
}
