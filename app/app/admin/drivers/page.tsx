import { listDriversOperationalStatus } from "@/lib/actions/driver-availability";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { DataTable } from "@/components/dashboard/DataTable";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/dashboard/StatusBadge";

export default async function AdminDriversPage() {
  const { data } = await listDriversOperationalStatus();

  return (
    <div>
      <PageHeader
        title="Drivers"
        description="Availability is a manual toggle; GPS online is automatic (recent location updates)."
      />
      <DataTable
        columns={[
          { key: "name", label: "Name" },
          { key: "email", label: "Email" },
          { key: "phone", label: "Phone" },
          { key: "active", label: "Status" },
          { key: "availability", label: "Availability" },
          { key: "gps", label: "GPS" },
          { key: "lastSeen", label: "Last seen" },
        ]}
        rows={(data ?? []).map((d) => ({
          name: d.full_name ?? "—",
          email: d.email ?? "—",
          phone: d.phone ?? "—",
          active: (
            <Badge variant={d.is_active ? "default" : "secondary"}>
              {d.is_active ? "Active" : "Inactive"}
            </Badge>
          ),
          availability: (
            <div className="space-y-1">
              <StatusBadge status={d.availability} />
              {d.availability_reason && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {d.availability_reason}
                </p>
              )}
            </div>
          ),
          gps: (
            <Badge variant={d.gps_online ? "default" : "secondary"}>
              {d.gps_online ? "Online" : "Offline"}
            </Badge>
          ),
          lastSeen: d.gps_last_seen_at
            ? new Date(d.gps_last_seen_at).toLocaleString()
            : "—",
        }))}
        emptyMessage="No drivers. Set a user's role to driver in Superadmin → Users."
      />
    </div>
  );
}
