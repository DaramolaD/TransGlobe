import Link from "next/link";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { listLeads } from "@/lib/actions/leads";
import { LeadWorkspace } from "@/components/leads/LeadWorkspace";
import { Button } from "@/components/ui/button";
import { filterLeadByView } from "@/lib/leads/utils";
import { Briefcase, CheckCircle2, Sparkles } from "lucide-react";

export default async function SalesDashboardPage() {
  const { data: leads } = await listLeads({ assignedOnly: true });
  const rows = leads ?? [];

  const newCount = rows.filter((l) => l.status === "new").length;
  const inProgress = rows.filter((l) => filterLeadByView(l, "in_progress")).length;
  const converted = rows.filter((l) => l.status === "converted").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sales dashboard"
        description="Leads assigned to you — follow up, log activity, and move deals forward."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="New assigned" value={String(newCount)} icon={Sparkles} />
        <StatCard title="In progress" value={String(inProgress)} icon={Briefcase} />
        <StatCard title="Converted" value={String(converted)} icon={CheckCircle2} />
      </div>

      <LeadWorkspace
        leads={rows}
        assignees={[]}
        basePath="/app/sales/leads"
        canManage={false}
      />

      {!rows.length ? (
        <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
          No leads assigned yet. An admin will assign new inquiries to you.
          <div className="mt-3">
            <Button variant="outline" size="sm" asChild>
              <Link href="/login">Refresh session</Link>
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
