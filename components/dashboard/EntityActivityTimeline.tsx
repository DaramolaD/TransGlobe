import { listEntityActivity } from "@/lib/actions/audit-activity";
import { AUDIT_ACTION_LABELS } from "@/lib/audit/action-labels";
import type { AuditEntityType } from "@/lib/audit/log";

function formatPayloadNote(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;
  const p = payload as Record<string, unknown>;
  if (p.note) return String(p.note);
  if (p.description) return String(p.description);
  if (p.assignee_name) return `Assigned to ${String(p.assignee_name)}`;
  if (p.channel) return `Channel: ${String(p.channel)}`;
  if (p.from && p.to) {
    return `${String(p.from).replace(/_/g, " ")} → ${String(p.to).replace(/_/g, " ")}`;
  }
  if (p.resolution_notes) return String(p.resolution_notes);
  if (p.location) return `Location: ${String(p.location)}`;
  if (p.tracking_number && p.to_status) {
    return `${String(p.tracking_number)} → ${String(p.to_status).replace(/_/g, " ")}`;
  }
  if (p.driver_name) return `Driver: ${String(p.driver_name)}`;
  return null;
}

export async function EntityActivityTimeline({
  entityType,
  entityId,
  emptyMessage = "No activity recorded yet.",
}: {
  entityType: AuditEntityType;
  entityId: string;
  emptyMessage?: string;
}) {
  const { data: entries } = await listEntityActivity(entityType, entityId);

  if (!entries?.length) {
    return <p className="text-sm text-muted-foreground">{emptyMessage}</p>;
  }

  return (
    <ol className="relative border-l border-border/80 ml-2 space-y-4 max-h-[280px] overflow-y-auto pr-2">
      {entries.map((e) => {
        const note = formatPayloadNote(e.payload);
        return (
          <li key={e.id} className="ml-5">
            <span className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border-2 border-background bg-primary" />
            <p className="text-sm font-medium">
              {AUDIT_ACTION_LABELS[e.action] ?? e.action.replace(/_/g, " ")}
            </p>
            <p className="text-xs text-muted-foreground">
              {new Date(e.created_at).toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
              })}
              {e.actor_name ? ` · ${e.actor_name}` : ""}
            </p>
            {note ? (
              <p className="text-xs text-muted-foreground mt-0.5">{note}</p>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
