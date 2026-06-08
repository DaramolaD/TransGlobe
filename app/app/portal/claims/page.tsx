import { listMyClaims } from "@/lib/actions/claims";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { ClaimForm } from "./ClaimForm";

export default async function PortalClaimsPage() {
  const claims = await listMyClaims();

  return (
    <div>
      <PageHeader title="Claims" description="Report damage, loss, or delays." />
      <div className="mb-8">
        <ClaimForm />
      </div>
      <DataTable
        columns={[
          { key: "tracking", label: "Shipment" },
          { key: "type", label: "Type" },
          { key: "status", label: "Status" },
        ]}
        rows={claims.map((c) => {
          const tracking =
            (c.shipments as { tracking_number: string })?.tracking_number ?? "—";
          return {
            _id: c.id,
            _detail: {
              kind: "claim",
              title: `Claim · ${tracking}`,
              subtitle: c.claim_type,
              fields: [
                { label: "Status", value: <StatusBadge status={c.status} /> },
                { label: "Type", value: c.claim_type },
                { label: "Shipment", value: tracking },
                ...(c.description
                  ? [{ label: "Description", value: c.description }]
                  : []),
              ],
            },
            tracking,
            type: c.claim_type,
            status: <StatusBadge status={c.status} />,
          };
        })}
      />
    </div>
  );
}
