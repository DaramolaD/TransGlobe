import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { formatTableDate, pickupDetailRow } from "@/lib/dashboard/table-details";

export default async function AdminPickupsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("pickup_requests")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <PageHeader
        title="Pickup requests"
        description="Scheduled and pending pickups from the website."
      />
      <DataTable
        showIndex
        columns={[
          { key: "name", label: "Name" },
          { key: "mobile", label: "Mobile" },
          { key: "address", label: "Address", className: "min-w-[160px]" },
          { key: "date", label: "Date" },
          { key: "status", label: "Status" },
        ]}
        rows={(data ?? []).map((p) => ({
          _id: p.id,
          _detail: pickupDetailRow(p),
          name: <span className="font-medium">{p.contact_name}</span>,
          mobile: (
            <span className="text-sm text-muted-foreground tabular-nums">
              {p.contact_phone}
            </span>
          ),
          address: `${p.pickup_address}, ${p.pickup_city}`,
          date: (
            <span className="text-sm tabular-nums text-muted-foreground">
              {formatTableDate(p.pickup_date)}
            </span>
          ),
          status: <StatusBadge status={p.status} />,
        }))}
        emptyMessage="No pickup requests yet."
      />
    </div>
  );
}
