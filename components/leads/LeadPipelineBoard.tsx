"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { GripVertical, Mail, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { updateLeadStatus } from "@/lib/actions/leads";
import {
  assigneeLabel,
  groupLeadsByStatus,
  LEAD_PIPELINE_COLUMNS,
} from "@/components/leads/lead-helpers";
import { LEAD_CATEGORY_LABELS, leadDisplayName } from "@/lib/leads/utils";
import type { Lead, LeadStatus } from "@/lib/types/database";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function LeadPipelineBoard({
  leads,
  onOpenLead,
}: {
  leads: Lead[];
  onOpenLead: (lead: Lead) => void;
}) {
  const router = useRouter();
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overColumn, setOverColumn] = useState<LeadStatus | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const grouped = useMemo(() => groupLeadsByStatus(leads), [leads]);

  async function moveLead(leadId: string, toStatus: LeadStatus, fromStatus: LeadStatus) {
    if (toStatus === fromStatus) return;

    setBusyId(leadId);
    const result = await updateLeadStatus(leadId, toStatus);
    setBusyId(null);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success("Lead moved");
    router.refresh();
  }

  function onDragStart(e: React.DragEvent, leadId: string) {
    e.dataTransfer.setData("text/lead-id", leadId);
    e.dataTransfer.effectAllowed = "move";
    setDraggingId(leadId);
  }

  function onDragEnd() {
    setDraggingId(null);
    setOverColumn(null);
  }

  return (
    <ScrollArea className="w-full whitespace-nowrap pb-3">
      <div className="flex gap-4 min-w-max pb-2">
        {LEAD_PIPELINE_COLUMNS.map((column) => {
          const columnLeads = grouped[column.status];
          const isOver = overColumn === column.status;

          return (
            <div
              key={column.status}
              className={cn(
                "w-[280px] shrink-0 rounded-xl border bg-muted/20 transition-colors",
                isOver && "border-primary/50 bg-primary/5"
              )}
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
                setOverColumn(column.status);
              }}
              onDragLeave={() => setOverColumn(null)}
              onDrop={(e) => {
                e.preventDefault();
                const leadId = e.dataTransfer.getData("text/lead-id");
                const lead = leads.find((l) => l.id === leadId);
                setOverColumn(null);
                setDraggingId(null);
                if (lead) void moveLead(leadId, column.status, lead.status);
              }}
            >
              <div className="border-b px-3 py-3">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold text-sm">{column.label}</h3>
                  <Badge variant="secondary" className="tabular-nums">
                    {columnLeads.length}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 whitespace-normal">
                  {column.hint}
                </p>
              </div>

              <div className="space-y-2 p-2 min-h-[320px] max-h-[calc(100vh-320px)] overflow-y-auto">
                {columnLeads.map((lead) => (
                  <PipelineCard
                    key={lead.id}
                    lead={lead}
                    dragging={draggingId === lead.id}
                    busy={busyId === lead.id}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                    onOpen={() => onOpenLead(lead)}
                  />
                ))}

                {!columnLeads.length ? (
                  <p className="text-xs text-muted-foreground text-center py-8 px-2 whitespace-normal">
                    Drop leads here
                  </p>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

function PipelineCard({
  lead,
  dragging,
  busy,
  onDragStart,
  onDragEnd,
  onOpen,
}: {
  lead: Lead;
  dragging: boolean;
  busy: boolean;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDragEnd: () => void;
  onOpen: () => void;
}) {
  return (
    <Card
      draggable={!busy}
      onDragStart={(e) => onDragStart(e, lead.id)}
      onDragEnd={onDragEnd}
      onClick={onOpen}
      className={cn(
        "cursor-grab active:cursor-grabbing shadow-sm transition-opacity",
        dragging && "opacity-40",
        busy && "opacity-60 pointer-events-none"
      )}
    >
      <CardHeader className="p-3 pb-2">
        <div className="flex items-start gap-2">
          <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground mt-0.5" />
          <div className="min-w-0 flex-1 whitespace-normal">
            <p className="font-medium text-sm leading-snug">{leadDisplayName(lead)}</p>
            <p className="text-xs text-muted-foreground truncate">{lead.email}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-0 space-y-2 whitespace-normal">
        {lead.company ? (
          <p className="text-xs text-muted-foreground truncate">{lead.company}</p>
        ) : null}
        <div className="flex flex-wrap gap-1">
          <Badge variant="outline" className="text-[10px]">
            {LEAD_CATEGORY_LABELS[lead.category ?? "sales"]}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-3 text-[11px] text-muted-foreground">
          {lead.phone ? (
            <span className="inline-flex items-center gap-1">
              <Phone className="h-3 w-3" />
              {lead.phone}
            </span>
          ) : null}
          <span className="inline-flex items-center gap-1 truncate">
            <Mail className="h-3 w-3 shrink-0" />
            {assigneeLabel(lead)}
          </span>
        </div>
        <p className="text-[10px] text-muted-foreground">
          Updated {new Date(lead.updated_at).toLocaleDateString()}
        </p>
      </CardContent>
    </Card>
  );
}
