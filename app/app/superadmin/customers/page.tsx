import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ProfileDirectoryTable } from "@/components/dashboard/ProfileDirectoryTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function SuperadminCustomersPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, is_active, created_at")
    .eq("role", "user")
    .order("created_at", { ascending: false });

  const customers = data ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description="Click a row for recent activity, or open full details from the menu."
        />
      <ProfileDirectoryTable
        profiles={customers}
        audience="customer"
        emptyMessage="No customers yet. They appear when someone signs up at /login (default role: customer)."
      />
      <p className="text-xs text-muted-foreground">
        Promoting a customer to <Badge variant="outline" className="mx-1">driver</Badge> or{" "}
        <Badge variant="outline" className="mx-1">admin</Badge> moves them to the{" "}
        <Link href="/app/superadmin/users" className="underline">
          Team
        </Link>{" "}
        page.
      </p>
    </div>
  );
}
