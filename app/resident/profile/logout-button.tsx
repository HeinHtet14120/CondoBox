"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "@/components/Button";
import { Icon } from "@/components/Icon";

export default function LogoutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleLogout() {
    setBusy(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <Button
      block
      variant="secondary"
      leftIcon={<Icon.LogOut size={16} />}
      onClick={handleLogout}
      disabled={busy}
    >
      {busy ? "Signing out…" : "Sign out"}
    </Button>
  );
}
