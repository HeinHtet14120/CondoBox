import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getCondoConfig } from "@/lib/models/condo";

export default async function HomePage() {
  const user = await getCurrentUser();
  console.log("user", user)
  if (!user) redirect("/");

  if (user.role === "admin") {
    const config = await getCondoConfig();
    redirect(config.isInitialized ? "/admin/dashboard" : "/admin/setup");
  }
  redirect("/resident/dashboard");
}
