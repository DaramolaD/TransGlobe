import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { ActivitySection } from "@/components/dashboard/ActivitySection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LeadDetailActions } from "./LeadDetailActions";
import {
  leadDisplayName,
  LEAD_CATEGORY_LABELS,
  LEAD_STATUS_LABELS,
} from "@/lib/leads/utils";
import type { Lead } from "@/lib/types/database";

type Assignee = { id: string; full_name: string | null; email: string };

function normalizeAssignee(lead: Lead) {
  const raw = lead.assignee as
    | { full_name: string | null; email: string }
    | { full_name: string | null; email: string }[]
    | null
    | undefined;
  if (!raw) return null;
  return Array.isArray(raw) ? raw[0] ?? null : raw;
}

export function LeadDetailView({
  lead,
  assignees,
  canManage,
  backHref,
  activityCount,
}: {
  lead: Lead;
  assignees: Assignee[];
  canManage: boolean;
  backHref: string;
  activityCount?: number;
}) {
  const assignee = normalizeAssignee(lead);

  return (
    <div className="space-y-6 max-w-4xl">
      <Button variant="ghost" size="sm" className="-ml-2 gap-2" asChild>
        <Link href={backHref}>
          <ArrowLeft className="h-4 w-4" />
          Back to leads
        </Link>
      </Button>

      <PageHeader
        title={leadDisplayName(lead)}
        description={lead.email}
        action={
          <div className="flex flex-wrap gap-2">
            <StatusBadge status={LEAD_STATUS_LABELS[lead.status]} />
            <StatusBadge status={LEAD_CATEGORY_LABELS[lead.category ?? "sales"]} />
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <span className="text-muted-foreground">Phone:</span> {lead.phone ?? "—"}
            </p>
            <p>
              <span className="text-muted-foreground">Company:</span> {lead.company ?? "—"}
            </p>
            <p>
              <span className="text-muted-foreground">Service:</span>{" "}
              {lead.service_interest ?? "—"}
            </p>
            <p>
              <span className="text-muted-foreground">Source:</span> {lead.source ?? "—"}
            </p>
            <p>
              <span className="text-muted-foreground">Assigned:</span>{" "}
              {assignee?.full_name ?? assignee?.email ?? "Unassigned"}
            </p>
            <p>
              <span className="text-muted-foreground">Created:</span>{" "}
              {new Date(lead.created_at).toLocaleString()}
            </p>
            <p>
              <span className="text-muted-foreground">Updated:</span>{" "}
              {new Date(lead.updated_at).toLocaleString()}
            </p>
            {lead.last_contacted_at ? (
              <p>
                <span className="text-muted-foreground">Last contact:</span>{" "}
                {new Date(lead.last_contacted_at).toLocaleString()}
              </p>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Message</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground whitespace-pre-wrap">
            {lead.message ?? "No message provided."}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Workflow</CardTitle>
        </CardHeader>
        <CardContent>
          <LeadDetailActions lead={lead} assignees={assignees} canManage={canManage} />
        </CardContent>
      </Card>

      <ActivitySection
        entityType="lead"
        entityId={lead.id}
        title="Follow-up timeline"
        description={
          activityCount != null
            ? `${activityCount} logged event(s). Full audit also in Superadmin → Audit logs.`
            : undefined
        }
      />
    </div>
  );
}
