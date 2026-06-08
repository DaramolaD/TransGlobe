import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Package, CheckCircle, AlertTriangle, Clock } from "lucide-react";

const STATUS_ORDER = [
  "pending",
  "booked",
  "picked_up",
  "in_transit",
  "out_for_delivery",
  "delivered",
  "exception",
  "cancelled",
] as const;

export default async function AdminReportsPage() {
  const supabase = await createClient();

  const { data: allShipments } = await supabase.from("shipments").select("status");

  const byStatus = (allShipments ?? []).reduce(
    (acc, s) => {
      acc[s.status] = (acc[s.status] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const totalCount = allShipments?.length ?? 0;
  const deliveredCount = byStatus.delivered ?? 0;
  const inTransit =
    (byStatus.in_transit ?? 0) +
    (byStatus.out_for_delivery ?? 0) +
    (byStatus.picked_up ?? 0);
  const otif = totalCount > 0 ? Math.round((deliveredCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-8">
      <PageHeader title="Reports" description="Operational KPIs and shipment pipeline." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total shipments" value={totalCount} icon={Package} />
        <StatCard title="Delivered" value={deliveredCount} icon={CheckCircle} />
        <StatCard title="In motion" value={inTransit} subtitle="Transit & delivery" icon={Clock} />
        <StatCard title="OTIF %" value={`${otif}%`} subtitle="On-time in full" icon={AlertTriangle} />
      </div>

      <div>
        <h2 className="font-semibold mb-3">Status breakdown</h2>
        <DataTable
          pageSize={10}
          columns={[
            { key: "status", label: "Status" },
            { key: "count", label: "Shipments" },
            { key: "share", label: "% of total" },
          ]}
          rows={STATUS_ORDER.filter((st) => (byStatus[st] ?? 0) > 0).map((st) => {
            const count = byStatus[st] ?? 0;
            const share = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
            return {
              status: <StatusBadge status={st} />,
              count,
              share: `${share}%`,
            };
          })}
          emptyMessage="No shipment data yet."
        />
      </div>
    </div>
  );
}
