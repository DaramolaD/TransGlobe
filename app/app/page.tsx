import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth/session";
import { ROLE_HOME } from "@/lib/auth/roles";

export default async function AppIndexPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  redirect(ROLE_HOME[profile.role]);
}
