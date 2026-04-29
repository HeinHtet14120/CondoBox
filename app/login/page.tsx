"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import Logo from "@/components/Logo";
import Button from "@/components/Button";
import { Icon } from "@/components/Icon";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Login failed");
        return;
      }
      const dest = data.role === "admin" ? "/admin/dashboard" : "/resident/dashboard";
      router.push(dest);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <main
      className="bg-mesh"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        className="card-elev"
        style={{ width: 380, padding: 32, display: "flex", flexDirection: "column", gap: 22 }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <Logo size="lg" />
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: "var(--text)",
              }}
            >
              Welcome back
            </div>
            <div style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 4 }}>
              Sign in to manage your parcels.
            </div>
          </div>
        </div>

        <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label className="field-label">Username</label>
            <div style={{ position: "relative" }}>
              <input
                className="input"
                placeholder="sarah.p"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{ paddingLeft: 38 }}
              />
              <span
                style={{
                  position: "absolute",
                  left: 12,
                  top: 0,
                  bottom: 0,
                  display: "flex",
                  alignItems: "center",
                  color: "var(--text-tertiary)",
                }}
              >
                <Icon.User size={16} />
              </span>
            </div>
          </div>
          <div>
            <label className="field-label">Password</label>
            <div style={{ position: "relative" }}>
              <input
                className="input"
                type={showPw ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingLeft: 38, paddingRight: 38 }}
              />
              <span
                style={{
                  position: "absolute",
                  left: 12,
                  top: 0,
                  bottom: 0,
                  display: "flex",
                  alignItems: "center",
                  color: "var(--text-tertiary)",
                }}
              >
                <Icon.Lock size={16} />
              </span>
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                style={{
                  position: "absolute",
                  right: 8,
                  top: 0,
                  bottom: 0,
                  padding: 6,
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-tertiary)",
                }}
                aria-label={showPw ? "Hide password" : "Show password"}
              >
                {showPw ? <Icon.EyeOff size={16} /> : <Icon.Eye size={16} />}
              </button>
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
          <Button block size="lg" type="submit" disabled={busy}>
            {busy ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <div style={{ textAlign: "center", fontSize: 13, color: "var(--text-secondary)" }}>
          New resident?{" "}
          <Link href="/register" className="lnk">
            Register here
          </Link>
        </div>
      </div>
    </main>
  );
}
