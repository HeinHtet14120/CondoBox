import { redirect } from "next/navigation";
import Logo from "@/components/Logo";
import { Icon } from "@/components/Icon";
import { getCurrentUser } from "@/lib/auth";
import { getCondoConfig } from "@/lib/models/condo";
import SetupForm from "./setup-form";

export default async function AdminSetupPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/resident/dashboard");

  const config = await getCondoConfig();
  if (config.isInitialized) redirect("/admin/dashboard");

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        padding: "40px 28px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div style={{ width: 560, maxWidth: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <Logo />
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "var(--text-tertiary)",
              textTransform: "uppercase",
              letterSpacing: ".06em",
            }}
          >
            Onboarding
          </span>
        </div>

        <div className="card" style={{ padding: 32 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: "var(--accent-soft)",
              color: "var(--accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 18,
            }}
          >
            <Icon.Building size={22} />
          </div>
          <div
            style={{
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "var(--text)",
            }}
          >
            Set up your condo
          </div>
          <div
            style={{
              fontSize: 14,
              color: "var(--text-secondary)",
              marginTop: 6,
              marginBottom: 24,
              lineHeight: 1.5,
            }}
          >
            Tell us how many units you manage and we'll create the room directory for you.
          </div>

          <SetupForm />
        </div>

        <div
          style={{
            marginTop: 16,
            display: "flex",
            gap: 8,
            alignItems: "center",
            color: "var(--text-tertiary)",
            fontSize: 12,
          }}
        >
          <Icon.ShieldCheck size={14} /> Step 1 of 1 · You can invite residents after setup
        </div>
      </div>
    </main>
  );
}
