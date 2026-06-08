import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth/session";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ProfileDirectoryTable } from "@/components/dashboard/ProfileDirectoryTable";
import { TEAM_DIRECTORY_ROLES } from "@/lib/auth/roles";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ROLE_LABELS } from "@/lib/auth/roles";

export default async function SuperadminTeamPage() {
  const me = await getCurrentProfile();
  const supabase = await createClient();

  const { data: team } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, is_active, created_at")
    .in("role", TEAM_DIRECTORY_ROLES)
    .order("created_at", { ascending: false });

  const staff = team ?? [];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Team"
        description="Click a row for a quick view, or use the menu to open the full profile page."
        />

      <ProfileDirectoryTable
        profiles={staff}
        audience="team"
        emptyMessage="No operations team yet. Promote customers or create admin/driver accounts in Supabase Auth."
      />
    </div>
  );
}
