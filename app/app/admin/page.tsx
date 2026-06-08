import Link from "next/link";
import { Package, Users, ClipboardList, Truck } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { TrackingId } from "@/components/dashboard/TrackingId";
import { OverviewTablePanel } from "@/components/dashboard/OverviewTablePanel";
import { RouteTableCell } from "@/components/dashboard/TableCells";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { dashboardTrackingHref } from "@/lib/dashboard/tracking-links";
import { formatTableDate, shipmentDetailRow } from "@/lib/dashboard/table-details";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [leads, shipments, pickups, quotes, recentLeads, recentShipments] =
    await Promise.all([
      supabase.from("leads").select("id", { count: "exact", head: true }).eq("status", "new"),
      supabase.from("shipments").select("id", { count: "exact", head: true }),
      supabase
        .from("pickup_requests")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending"),
      supabase.from("quotes").select("id", { count: "exact", head: true }).eq("status", "draft"),
      supabase
        .from("leads")
        .select("id, first_name, last_name, email, company, status, created_at")
        .order("created_at", { ascending: false })
        .limit(30),
      supabase
        .from("shipments")
        .select(
          "id, tracking_number, origin, destination, status, service_type, weight_kg, package_count, created_at"
        )
        .order("created_at", { ascending: false })
        .limit(30),
    ]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Operations dashboard"
        description="Leads, shipments, dispatch, and billing — your control tower."
        action={
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/app/admin/dispatch">Dispatch</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/app/admin/shipments">Shipments</Link>
            </Button>
          </div>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="New leads" value={leads.count ?? 0} icon={Users} />
        <StatCard title="All shipments" value={shipments.count ?? 0} icon={Package} />
        <StatCard title="Pending pickups" value={pickups.count ?? 0} icon={Truck} />
        <StatCard title="Draft quotes" value={quotes.count ?? 0} icon={ClipboardList} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <OverviewTablePanel
          title="Latest leads"
          description="Inbound inquiries from the website"
          icon={Users}
          count={(recentLeads.data ?? []).length}
          href="/app/admin/leads"
        >
          <DataTable
            embedded
            compact
            variant="overview"
            summaryLabel="leads"
            pageSize={5}
            columns={[
              { key: "name", label: "Contact" },
              { key: "company", label: "Company" },
              { key: "status", label: "Status" },
            ]}
            rows={(recentLeads.data ?? []).map((l) => ({
              _id: l.id,
              _detail: {
                kind: "lead",
                title: `${l.first_name} ${l.last_name}`,
                subtitle: l.email,
                fields: [
                  { label: "Company", value: l.company ?? "—" },
                  { label: "Status", value: <StatusBadge status={l.status} /> },
                  { label: "Received", value: formatTableDate(l.created_at) },
                ],
                href: "/app/admin/leads",
              },
              name: `${l.first_name} ${l.last_name}`,
              company: l.company ?? "—",
              status: <StatusBadge status={l.status} />,
            }))}
            emptyMessage="No leads yet. They appear when visitors submit the contact form."
          />
        </OverviewTablePanel>

        <OverviewTablePanel
          title="Recent shipments"
          description="Newest bookings and active lanes"
          icon={Package}
          count={(recentShipments.data ?? []).length}
          href="/app/admin/shipments"
        >
          <DataTable
            embedded
            compact
            variant="overview"
            summaryLabel="shipments"
            pageSize={5}
            columns={[
              { key: "tracking", label: "Tracking" },
              { key: "route", label: "Route", className: "min-w-[140px]" },
              { key: "status", label: "Status" },
            ]}
            rows={(recentShipments.data ?? []).map((s) => ({
              _id: s.id,
              _detail: shipmentDetailRow(s, {
                href: dashboardTrackingHref(s.id),
                hrefLabel: "Track shipment",
              }),
              tracking: <TrackingId value={s.tracking_number} />,
              route: (
                <RouteTableCell origin={s.origin} destination={s.destination} />
              ),
              status: <StatusBadge status={s.status} />,
            }))}
            emptyMessage="No shipments in the system yet."
          />
        </OverviewTablePanel>
      </div>
    </div>
  );
}
