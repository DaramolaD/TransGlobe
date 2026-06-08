import { notFound } from "next/navigation";
import { getLead, getLeadActivitySummary } from "@/lib/actions/leads";
import { LeadDetailView } from "@/components/leads/LeadDetailView";

export default async function SalesLeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [{ data: lead, error }, activity] = await Promise.all([
    getLead(id),
    getLeadActivitySummary(id),
  ]);

  if (error || !lead) notFound();

  return (
    <LeadDetailView
      lead={lead}
      assignees={[]}
      canManage={false}
      backHref="/app/sales"
      activityCount={activity.count}
    />
  );
}
