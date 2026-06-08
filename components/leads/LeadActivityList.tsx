"use client";

import { useEffect, useState } from "react";
import { listEntityActivity } from "@/lib/actions/audit-activity";
import { AUDIT_ACTION_LABELS } from "@/lib/audit/action-labels";

function formatPayloadNote(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;
  const p = payload as Record<string, unknown>;
  if (p.note) return String(p.note);
  if (p.description) return String(p.description);
  if (p.channel) return `Channel: ${String(p.channel)}`;
  if (p.email) return String(p.email);
  return null;
}

export function LeadActivityList({ leadId }: { leadId: string }) {
  const [entries, setEntries] = useState<
    Awaited<ReturnType<typeof listEntityActivity>>["data"]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    listEntityActivity("lead", leadId).then((r) => {
      if (cancelled) return;
      setEntries(r.data ?? []);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [leadId]);

  if (loading) {
    return <p className="text-xs text-muted-foreground">Loading activity…</p>;
  }

  if (!entries.length) {
    return <p className="text-xs text-muted-foreground">No activity yet.</p>;
  }

  return (
    <ol className="relative border-l border-border/80 ml-2 space-y-3 max-h-40 overflow-y-auto pr-1">
      {entries.map((e) => {
        const note = formatPayloadNote(e.payload);
        return (
          <li key={e.id} className="ml-4">
            <span className="absolute -left-1.5 mt-1 h-2.5 w-2.5 rounded-full border-2 border-background bg-primary" />
            <p className="text-xs font-medium">
              {AUDIT_ACTION_LABELS[e.action] ?? e.action.replace(/_/g, " ")}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {new Date(e.created_at).toLocaleString(undefined, {
                dateStyle: "short",
                timeStyle: "short",
              })}
              {e.actor_name ? ` · ${e.actor_name}` : ""}
            </p>
            {note ? <p className="text-[11px] text-muted-foreground mt-0.5">{note}</p> : null}
          </li>
        );
      })}
    </ol>
  );
}
