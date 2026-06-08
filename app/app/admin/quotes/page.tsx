import { listQuotesAdmin } from "@/lib/actions/quotes";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { AdminQuotesTable } from "./AdminQuotesTable";

export default async function AdminQuotesPage() {
  const { data: quotes, error } = await listQuotesAdmin();

  return (
    <div>
      <PageHeader
        title="Quotes"
        description="Estimator and formal quotes with customer, lead, and converted shipment in one view."
      />
      {error ? (
        <p className="text-sm text-destructive mb-4 rounded-lg border border-destructive/30 p-3">
          {error}
        </p>
      ) : null}
      <AdminQuotesTable quotes={quotes} />
    </div>
  );
}
