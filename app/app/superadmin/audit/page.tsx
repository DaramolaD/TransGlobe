import { createClient } from "@/lib/supabase/server";
import { AUDIT_ACTION_LABELS } from "@/lib/audit/action-labels";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { DataTable } from "@/components/dashboard/DataTable";

export default async function SuperadminAuditPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("audit_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div>
      <PageHeader title="Audit logs" description="System activity trail." />
      <DataTable
        columns={[
          { key: "action", label: "Action" },
          { key: "entity", label: "Entity" },
          { key: "date", label: "When" },
        ]}
        rows={(data ?? []).map((a) => {
          const payload = a.payload as Record<string, unknown> | null;
          const extra =
            payload?.invoice_number != null
              ? ` · ${String(payload.invoice_number)}`
              : payload?.reference != null
                ? ` · ref ${String(payload.reference)}`
                : "";
          return {
            action: AUDIT_ACTION_LABELS[a.action] ?? a.action.replace(/_/g, " "),
            entity: `${a.entity_type}${a.entity_id ? ` #${a.entity_id.slice(0, 8)}` : ""}${extra}`,
            date: new Date(a.created_at).toLocaleString(),
          };
        })}
        emptyMessage="No audit entries yet."
      />
    </div>
  );
}
