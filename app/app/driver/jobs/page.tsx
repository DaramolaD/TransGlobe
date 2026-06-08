import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth/session";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { RouteInlineCell } from "@/components/dashboard/TableCells";

export default async function DriverJobsPage() {
  const profile = await getCurrentProfile();
  const supabase = await createClient();
  const { data } = await supabase
    .from("assignments")
    .select("*, shipments(tracking_number, origin, destination, status)")
    .eq("driver_id", profile!.id)
    .order("assigned_at", { ascending: false });

  return (
    <div>
      <PageHeader title="My jobs" description="All assignments." />
      <DataTable
        columns={[
          { key: "tracking", label: "Tracking" },
          { key: "route", label: "Route", className: "min-w-[140px] max-w-[220px]" },
          { key: "shipment", label: "Shipment status" },
          { key: "assignment", label: "Assignment" },
        ]}
        rows={(data ?? []).map((a) => {
          const s = a.shipments as { tracking_number: string; origin: string; destination: string; status: string };
          return {
            tracking: s?.tracking_number,
            route: s?.origin && s?.destination ? (
              <RouteInlineCell origin={s.origin} destination={s.destination} />
            ) : (
              "—"
            ),
            shipment: <StatusBadge status={s?.status ?? ""} />,
            assignment: <StatusBadge status={a.status} />,
          };
        })}
      />
    </div>
  );
}
