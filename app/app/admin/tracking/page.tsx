import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { AdminTrackingClient } from "./AdminTrackingClient";

export default async function AdminTrackingPage() {
  const supabase = await createClient();
  const { data: recent } = await supabase
    .from("shipments")
    .select(
      "id, tracking_number, origin, destination, status, service_type, created_at"
    )
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Track shipment"
        description="Filter recent shipments in the table, click a row for a preview, or open live tracking for a specific ID."
      />
      <AdminTrackingClient recent={recent ?? []} />
    </div>
  );
}
