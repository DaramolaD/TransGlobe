import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth/session";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { RouteInlineCell } from "@/components/dashboard/TableCells";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function PortalQuotesPage() {
  const profile = await getCurrentProfile();
  const supabase = await createClient();
  const { data } = await supabase
    .from("quotes")
    .select("*")
    .eq("created_by", profile!.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <PageHeader
        title="Quotes"
        description="Your cost estimates and formal quotes."
        action={
          <Button asChild variant="outline">
            <Link href="/estimator">New estimate</Link>
          </Button>
        }
      />
      <DataTable
        columns={[
          { key: "route", label: "Route", className: "min-w-[140px] max-w-[220px]" },
          { key: "total", label: "Total" },
          { key: "status", label: "Status" },
        ]}
        rows={(data ?? []).map((q) => ({
          _id: q.id,
          _detail: {
            kind: "quote",
            title: `${q.origin} → ${q.destination}`,
            subtitle: "Quote estimate",
            fields: [
              { label: "Status", value: <StatusBadge status={q.status} /> },
              { label: "Service", value: q.service_type },
              { label: "Weight", value: q.weight_kg ? `${q.weight_kg} kg` : "—" },
              {
                label: "Total",
                value: q.total_price ? `$${q.total_price}` : "Pending",
              },
            ],
          },
          route: (
            <RouteInlineCell origin={q.origin} destination={q.destination} />
          ),
          total: q.total_price ? `$${q.total_price}` : "—",
          status: <StatusBadge status={q.status} />,
        }))}
      />
    </div>
  );
}
