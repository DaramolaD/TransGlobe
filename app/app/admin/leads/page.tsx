import { listLeads, listSalesAssignees } from "@/lib/actions/leads";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { LeadWorkspace } from "@/components/leads/LeadWorkspace";

export default async function AdminLeadsPage() {
  const [{ data: leads }, { data: assignees }] = await Promise.all([
    listLeads(),
    listSalesAssignees(),
  ]);

  return (
    <div>
      <PageHeader
        title="Leads"
        description="Contact form submissions, sales pipeline, and assignments."
      />
      <LeadWorkspace
        leads={leads ?? []}
        assignees={assignees ?? []}
        basePath="/app/admin/leads"
        canManage
      />
    </div>
  );
}
