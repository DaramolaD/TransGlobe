import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth/session";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { DataTable } from "@/components/dashboard/DataTable";

export default async function DriverHistoryPage() {
  const profile = await getCurrentProfile();
  const supabase = await createClient();
  const { data } = await supabase
    .from("assignments")
    .select("*, shipments(tracking_number)")
    .eq("driver_id", profile!.id)
    .eq("status", "completed")
    .order("completed_at", { ascending: false });

  return (
    <div>
      <PageHeader title="History" description="Completed jobs." />
      <DataTable
        columns={[
          { key: "tracking", label: "Tracking" },
          { key: "completed", label: "Completed" },
        ]}
        rows={(data ?? []).map((a) => ({
          tracking: (a.shipments as { tracking_number: string })?.tracking_number,
          completed: a.completed_at ? new Date(a.completed_at).toLocaleString() : "—",
        }))}
      />
    </div>
  );
}
