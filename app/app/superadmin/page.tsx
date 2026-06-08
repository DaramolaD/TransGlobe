import Link from "next/link";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { DataTable, OVERVIEW_PREVIEW_ROWS } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { TrackingId } from "@/components/dashboard/TrackingId";
import { OverviewTablePanel } from "@/components/dashboard/OverviewTablePanel";
import { ProfileDirectoryTable } from "@/components/dashboard/ProfileDirectoryTable";
import { RouteTableCell } from "@/components/dashboard/TableCells";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import {
  getDefaultOrganization,
  organizationDisplayName,
} from "@/lib/data/organization";
import { TEAM_DIRECTORY_ROLES } from "@/lib/auth/roles";
import { dashboardTrackingHref } from "@/lib/dashboard/tracking-links";
import { formatTableDate, shipmentDetailRow } from "@/lib/dashboard/table-details";
import { Users, Package, FileText, Truck, UserCircle, Briefcase } from "lucide-react";

export default async function SuperadminDashboardPage() {
  const supabase = await createClient();
  const org = await getDefaultOrganization();
  const brandName = organizationDisplayName(org);

  const [
    staffCountRes,
    customersCountRes,
    shipmentsRes,
    postsRes,
    driversRes,
    adminsRes,
    superadminsRes,
    staffRes,
    customersRes,
    recentShipmentsRes,
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .in("role", TEAM_DIRECTORY_ROLES),
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("role", "user"),
    supabase.from("shipments").select("id", { count: "exact", head: true }),
    supabase.from("cms_posts").select("id", { count: "exact", head: true }),
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("role", "driver"),
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("role", "admin"),
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("role", "superadmin"),
    supabase
      .from("profiles")
      .select("id, full_name, email, role, is_active, created_at")
      .in("role", TEAM_DIRECTORY_ROLES)
      .order("created_at", { ascending: false })
      .limit(OVERVIEW_PREVIEW_ROWS),
    supabase
      .from("profiles")
      .select("id, full_name, email, role, is_active, created_at")
      .eq("role", "user")
      .order("created_at", { ascending: false })
      .limit(OVERVIEW_PREVIEW_ROWS),
    supabase
      .from("shipments")
      .select("id, tracking_number, origin, destination, status, service_type, created_at")
      .order("created_at", { ascending: false })
      .limit(OVERVIEW_PREVIEW_ROWS),
  ]);

  const staff = staffRes.data ?? [];
  const customers = customersRes.data ?? [];
  const shipments = recentShipmentsRes.data ?? [];
  const staffTotal = staffCountRes.count ?? staff.length;
  const customersTotal = customersCountRes.count ?? customers.length;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Platform overview"
        description={`${brandName} - team, customers, and shipments kept separate.`}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Operations team"
          value={staffCountRes.count ?? 0}
          subtitle={`${driversRes.count ?? 0} drivers · ${adminsRes.count ?? 0} admins`}
          icon={Briefcase}
        />
        <StatCard
          title="Customers"
          value={customersCountRes.count ?? 0}
          subtitle="Portal accounts"
          icon={UserCircle}
        />
        <StatCard title="Shipments" value={shipmentsRes.count ?? 0} icon={Package} />
        <StatCard
          title="Super admins"
          value={superadminsRes.count ?? 0}
          subtitle={`${postsRes.count ?? 0} CMS posts`}
          icon={Users}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <OverviewTablePanel
          title="Team"
          description="Admins and drivers only"
          icon={Briefcase}
          count={staffTotal}
          href="/app/superadmin/users"
          hrefLabel="Manage team"
        >
          <ProfileDirectoryTable
            profiles={staff}
            audience="team"
            overview
            totalCount={staffTotal}
            emptyMessage="No team members. Add staff in Supabase Auth and seed-dev-users.sql."
          />
        </OverviewTablePanel>

        <OverviewTablePanel
          title="Customers"
          description="Shippers using the customer portal"
          icon={UserCircle}
          count={customersTotal}
          href="/app/superadmin/customers"
          hrefLabel="All customers"
        >
          <ProfileDirectoryTable
            profiles={customers}
            audience="customer"
            overview
            totalCount={customersTotal}
            emptyMessage="No customers yet. Sign-ups at /login create portal accounts."
          />
        </OverviewTablePanel>
      </div>

      <OverviewTablePanel
        title="Recent shipments"
        description="Latest bookings across the network"
        icon={Package}
        count={shipmentsRes.count ?? shipments.length}
        href="/app/admin/shipments"
        hrefLabel="All shipments"
      >
        <DataTable
          embedded
          compact
          variant="overview"
          summaryLabel="shipments"
          paginate={false}
          maxRows={OVERVIEW_PREVIEW_ROWS}
          totalCount={shipmentsRes.count ?? shipments.length}
          columns={[
            { key: "tracking", label: "Tracking" },
            { key: "route", label: "Route", className: "min-w-[140px]" },
            { key: "service", label: "Service", className: "hidden md:table-cell" },
            { key: "status", label: "Status" },
          ]}
          rows={shipments.map((s) => ({
            _id: s.id,
            _detail: shipmentDetailRow(s, {
              href: dashboardTrackingHref(s.id),
              hrefLabel: "Track shipment",
            }),
            tracking: <TrackingId value={s.tracking_number} />,
            route: (
              <RouteTableCell origin={s.origin} destination={s.destination} />
            ),
            service: (
              <span className="text-xs font-medium capitalize text-muted-foreground">
                {s.service_type}
              </span>
            ),
            status: <StatusBadge status={s.status} />,
          }))}
          emptyMessage="No shipments yet. Customers book from the portal or seed demo tracking."
        />
      </OverviewTablePanel>

      <div className="flex flex-wrap gap-2">
        <Button asChild variant="outline" size="sm">
          <Link href="/app/admin/dispatch">
            <Truck className="h-4 w-4 mr-2" />
            Dispatch
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href="/app/admin/invoices">Billing</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href="/app/superadmin/audit">Audit logs</Link>
        </Button>
      </div>
    </div>
  );
}
