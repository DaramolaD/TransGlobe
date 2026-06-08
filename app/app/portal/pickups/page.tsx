import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth/session";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { PortalShippingHelp } from "@/components/portal/PortalShippingHelp";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/ui/button";
import { TableTextCell } from "@/components/dashboard/TableCells";
import { formatTableDate, pickupDetailRow } from "@/lib/dashboard/table-details";

export default async function PortalPickupsPage() {
  const profile = await getCurrentProfile();
  const supabase = await createClient();
  const { data } = await supabase
    .from("pickup_requests")
    .select("*")
    .eq("created_by", profile!.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <PageHeader
        title="Pickups"
        description="Collection requests — when we come to you. Linked to a shipment when booked together."
        action={
          <Button asChild>
            <Link href="/app/portal/pickups/schedule">Schedule pickup</Link>
          </Button>
        }
      />
      <PortalShippingHelp variant="pickups" />
      <DataTable
        columns={[
          { key: "address", label: "Location", className: "min-w-[140px] max-w-[220px]" },
          { key: "date", label: "Pickup date" },
          { key: "time", label: "Window" },
          { key: "packages", label: "Packages" },
          { key: "status", label: "Status" },
        ]}
        rows={(data ?? []).map((p) => ({
          _id: p.id,
          _detail: pickupDetailRow(p),
          address: (
            <span className="min-w-0">
              <span className="font-medium text-sm truncate block">{p.pickup_city}</span>
              <TableTextCell className="text-xs text-muted-foreground" title={p.pickup_address}>
                {p.pickup_address}
              </TableTextCell>
            </span>
          ),
          date: (
            <span className="text-sm tabular-nums text-muted-foreground">
              {formatTableDate(p.pickup_date)}
            </span>
          ),
          time: <span className="text-sm text-muted-foreground">{p.pickup_time ?? "—"}</span>,
          packages: <span className="text-sm tabular-nums">{p.package_count ?? 1}</span>,
          status: <StatusBadge status={p.status} />,
        }))}
        emptyMessage="No pickups scheduled yet. Use Schedule pickup to request a collection."
      />
    </div>
  );
}
