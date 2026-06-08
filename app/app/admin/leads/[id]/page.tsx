import { notFound } from "next/navigation";
import {
  getLead,
  getLeadActivitySummary,
  listSalesAssignees,
} from "@/lib/actions/leads";
import { LeadDetailView } from "@/components/leads/LeadDetailView";

export default async function AdminLeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [{ data: lead, error }, { data: assignees }, activity] = await Promise.all([
    getLead(id),
    listSalesAssignees(),
    getLeadActivitySummary(id),
  ]);

  if (error || !lead) notFound();

  return (
    <LeadDetailView
      lead={lead}
      assignees={assignees ?? []}
      canManage
      backHref="/app/admin/leads"
      activityCount={activity.count}
    />
  );
}
