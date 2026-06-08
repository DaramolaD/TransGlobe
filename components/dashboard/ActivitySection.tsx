import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EntityActivityTimeline } from "./EntityActivityTimeline";
import type { AuditEntityType } from "@/lib/audit/log";

export function ActivitySection({
  entityType,
  entityId,
  title = "Activity",
  description = "Logged actions also appear under Superadmin → Audit logs.",
}: {
  entityType: AuditEntityType;
  entityId: string;
  title?: string;
  description?: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
        <p className="text-xs text-muted-foreground font-normal">{description}</p>
      </CardHeader>
      <CardContent>
        <EntityActivityTimeline entityType={entityType} entityId={entityId} />
      </CardContent>
    </Card>
  );
}
