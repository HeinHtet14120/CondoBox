import Link from "next/link";
import { Icon } from "./Icon";

type Tab = "home" | "parcels" | "profile";

interface Props {
  active: Tab;
}

const TABS: { id: Tab; label: string; href: string; icon: React.ReactNode }[] = [
  { id: "home", label: "Home", href: "/resident/dashboard", icon: <Icon.Home size={20} /> },
  { id: "parcels", label: "Parcels", href: "/resident/parcels", icon: <Icon.Package size={20} /> },
  { id: "profile", label: "Profile", href: "/resident/profile", icon: <Icon.User size={20} /> },
];

export default function ResidentTabBar({ active }: Props) {
  return (
    <nav
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        borderTop: "1px solid var(--border)",
        background: "var(--bg-elev)",
        padding: "8px 8px calc(8px + env(safe-area-inset-bottom, 0px))",
      }}
    >
      {TABS.map((t) => {
        const isActive = t.id === active;
        return (
          <Link
            key={t.id}
            href={t.href}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              padding: "6px 0",
              borderRadius: 10,
              color: isActive ? "var(--accent)" : "var(--text-tertiary)",
              fontSize: 11,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            {t.icon}
            <span>{t.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
