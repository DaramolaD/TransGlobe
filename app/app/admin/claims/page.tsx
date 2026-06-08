import { listClaimsAdmin, getUnviewedClaimsCount } from "@/lib/actions/claims";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { AdminClaimsTable } from "./AdminClaimsTable";

export default async function AdminClaimsPage() {
  const [{ data: claims, error }, unviewedCount] = await Promise.all([
    listClaimsAdmin(),
    getUnviewedClaimsCount(),
  ]);

  return (
    <div>
      <PageHeader
        title="Claims"
        description={
          unviewedCount > 0
            ? `${unviewedCount} new claim${unviewedCount === 1 ? "" : "s"} not yet opened by your team. Click a row to review.`
            : "Customer damage, loss, and delay claims. Click a row for details."
        }
      />
      {error ? (
        <p className="text-sm text-destructive mb-4 rounded-lg border border-destructive/30 p-3">
          {error}
        </p>
      ) : null}
      <AdminClaimsTable claims={claims} />
    </div>
  );
}
