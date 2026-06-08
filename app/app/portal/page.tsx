import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth/session";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { TrackingId } from "@/components/dashboard/TrackingId";
import { RouteInlineCell } from "@/components/dashboard/TableCells";
import { Button } from "@/components/ui/button";
import { Package, ClipboardList, Truck } from "lucide-react";
import { formatTableDate, shipmentDetailRow } from "@/lib/dashboard/table-details";

export default async function PortalHomePage() {
  const profile = await getCurrentProfile();
  const supabase = await createClient();

  const { data: shipments } = await supabase
    .from("shipments")
    .select("*")
    .eq("created_by", profile!.id)
    .order("created_at", { ascending: false });

  const active = (shipments ?? []).filter(
    (s) => s.status !== "delivered" && s.status !== "cancelled"
  );

  return (
    <div>
      <PageHeader
        title={`Hello, ${profile?.full_name?.split(" ")[0] ?? "there"}`}
        description="Track shipments, request quotes, and manage your logistics."
        action={
          <Button asChild>
            <Link href="/app/portal/book">Book shipment</Link>
          </Button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <StatCard title="Active shipments" value={active.length} icon={Package} />
        <StatCard title="Total shipments" value={shipments?.length ?? 0} icon={Truck} />
        <StatCard title="Quick action" value="Quote" subtitle="Get an estimate" icon={ClipboardList} />
      </div>

      <div className="flex items-center justify-between gap-4 mb-3">
        <h2 className="font-semibold">Recent shipments</h2>
        {(shipments ?? []).length > 0 && (
          <Button variant="ghost" size="sm" asChild>
            <Link href="/app/portal/track">View all</Link>
          </Button>
        )}
      </div>

      <DataTable
        columns={[
          { key: "tracking", label: "Tracking ID" },
          { key: "route", label: "Route", className: "min-w-[140px] max-w-[220px]" },
          { key: "service", label: "Service" },
          { key: "status", label: "Status" },
          { key: "date", label: "Booked" },
        ]}
        rows={(shipments ?? []).map((s) => ({
          _id: s.id,
          _detail: shipmentDetailRow(s),
          tracking: <TrackingId value={s.tracking_number} />,
          route: (
            <RouteInlineCell origin={s.origin} destination={s.destination} />
          ),
          service: (
            <span className="capitalize text-sm text-muted-foreground">
              {s.service_type.replace(/_/g, " ")}
            </span>
          ),
          status: <StatusBadge status={s.status} />,
          date: (
            <span className="text-sm text-muted-foreground tabular-nums">
              {formatTableDate(s.created_at)}
            </span>
          ),
        }))}
        emptyMessage="No shipments yet. Book your first shipment to get started."
      />
    </div>
  );
}
