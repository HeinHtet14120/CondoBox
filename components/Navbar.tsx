"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "./Logo";
import { Icon } from "./Icon";

interface NavbarProps {
  userName: string;
  role: "admin" | "owner";
  roomId?: string | null;
}

export default function Navbar({ userName, role, roomId }: NavbarProps) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  const initials = userName
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header
      style={{
        height: 56,
        padding: "0 20px",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        background: "var(--bg-elev)",
        gap: 16,
      }}
    >
      <Link
        href={role === "admin" ? "/admin/dashboard" : "/resident/dashboard"}
        style={{ textDecoration: "none" }}
      >
        <Logo />
      </Link>
      <div
        style={{
          marginLeft: 8,
          display: "flex",
          alignItems: "center",
          gap: 4,
          color: "var(--text-tertiary)",
          fontSize: 13,
        }}
      >
        <Icon.ChevronRight size={14} />
        <span style={{ color: "var(--text-secondary)", fontWeight: 600 }}>
          {role === "admin" ? "Front desk" : roomId ? `Room ${roomId}` : "Resident"}
        </span>
      </div>
      <div style={{ flex: 1 }} />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "6px 12px 6px 6px",
          border: "1px solid var(--border)",
          borderRadius: 999,
          color: "var(--text-secondary)",
          fontSize: 13,
          fontWeight: 600,
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background:
              "linear-gradient(135deg, color-mix(in oklab, var(--accent) 70%, white), var(--accent))",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          {initials || "·"}
        </div>
        <span style={{ color: "var(--text)" }}>{userName}</span>
      </div>
      <button
        onClick={handleLogout}
        className="btn btn-ghost btn-sm"
        style={{ borderRadius: 10 }}
        title="Sign out"
      >
        <Icon.LogOut size={14} />
        <span>Sign out</span>
      </button>
    </header>
  );
}
