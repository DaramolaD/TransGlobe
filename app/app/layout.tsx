import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth/session";
import { isStaff } from "@/lib/auth/roles";
import { getUnviewedClaimsCount } from "@/lib/actions/claims";
import { getStaffInboxSummary } from "@/lib/actions/notifications";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import {
  parseSidebarOpenCookie,
  SIDEBAR_STATE_COOKIE,
} from "@/lib/dashboard/sidebar-state";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isSupabaseConfigured()) {
    redirect("/login?error=config");
  }

  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");

  const cookieStore = await cookies();
  const defaultSidebarOpen = parseSidebarOpenCookie(
    cookieStore.get(SIDEBAR_STATE_COOKIE)?.value
  );

  let staffInbox = null;
  let navBadges: Record<string, number> = {};

  if (isStaff(profile.role)) {
    const [inbox, unviewedClaims] = await Promise.all([
      getStaffInboxSummary(),
      getUnviewedClaimsCount(),
    ]);
    staffInbox = inbox;
    if (unviewedClaims > 0) {
      navBadges = { "/app/admin/claims": unviewedClaims };
    }
  }

  return (
    <DashboardShell
      role={profile.role}
      userName={profile.full_name ?? profile.email ?? "User"}
      userEmail={profile.email}
      avatarUrl={profile.avatar_url}
      defaultSidebarOpen={defaultSidebarOpen}
      staffInbox={staffInbox}
      navBadges={navBadges}
    >
      {children}
    </DashboardShell>
  );
}
