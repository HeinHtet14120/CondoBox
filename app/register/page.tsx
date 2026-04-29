"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import Logo from "@/components/Logo";
import Button from "@/components/Button";

interface Room {
  id: string;
  isOccupied: boolean;
}

export default function RegisterPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [roomId, setRoomId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch("/api/rooms?available=true")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setRooms(data);
      })
      .finally(() => setLoadingRooms(false));
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    if (password !== confirm) return setError("Passwords do not match.");
    if (!roomId) return setError("Please select a room.");

    setBusy(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, password, roomId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Registration failed");
        return;
      }
      setSuccess("Account created. Redirecting to login…");
      setTimeout(() => router.push("/login"), 1200);
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
        overflow: "auto",
      }}
    >
      <div
        className="card-elev"
        style={{
          width: 400,
          padding: 32,
          display: "flex",
          flexDirection: "column",
          gap: 18,
          margin: "24px 0",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
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
              Create your account
            </div>
            <div style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 4 }}>
              Sign up as a resident.
            </div>
          </div>
        </div>

        <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label className="field-label">Full name</label>
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              required
            />
          </div>
          <div>
            <label className="field-label">Username</label>
            <input
              className="input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              required
            />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label className="field-label">Password</label>
              <input
                className="input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                minLength={6}
                required
              />
            </div>
            <div>
              <label className="field-label">Confirm</label>
              <input
                className="input"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                minLength={6}
                required
              />
            </div>
          </div>
          <div>
            <label className="field-label">
              Room ID <span style={{ color: "var(--accent)" }}>*</span>
            </label>
            {loadingRooms ? (
              <p style={{ fontSize: 13, color: "var(--text-tertiary)", margin: "4px 0 0" }}>
                Loading rooms…
              </p>
            ) : rooms.length === 0 ? (
              <p style={{ fontSize: 13, color: "var(--rose)", margin: "4px 0 0" }}>
                No available rooms. Please contact the office.
              </p>
            ) : (
              <select
                className="select"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select a room…
                </option>
                {rooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.id}
                  </option>
                ))}
              </select>
            )}
            <div className="field-help">Select your assigned room number.</div>
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
          {success && (
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
              {success}
            </p>
          )}

          <Button block size="lg" type="submit" disabled={busy || rooms.length === 0}>
            {busy ? "Creating account…" : "Create account"}
          </Button>
        </form>

        <div style={{ textAlign: "center", fontSize: 13, color: "var(--text-secondary)" }}>
          Already have an account?{" "}
          <Link href="/login" className="lnk">
            Sign in
          </Link>
        </div>
      </div>
    </main>
  );
}
