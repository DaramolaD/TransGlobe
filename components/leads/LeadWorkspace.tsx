"use client";

import { useMemo, useState } from "react";
import { Kanban, List, UserPlus } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  filterLeadsByQuery,
  sortLeads,
  type LeadSortKey,
} from "@/components/leads/lead-helpers";
import type { Lead } from "@/lib/types/database";
import { LeadAssignModal } from "./LeadAssignModal";
import { LeadEditModal } from "./LeadEditModal";
import { LeadExportDialog } from "./LeadExportDialog";
import { LeadPipelineBoard } from "./LeadPipelineBoard";
import { LeadSortableTable } from "./LeadSortableTable";

type Assignee = { id: string; full_name: string | null; email: string };

type WorkspaceMode = "all" | "pipeline";

export function LeadWorkspace({
  leads,
  assignees,
  basePath,
  canManage,
}: {
  leads: Lead[];
  assignees: Assignee[];
  basePath: "/app/admin/leads" | "/app/sales/leads";
  canManage: boolean;
}) {
  const [mode, setMode] = useState<WorkspaceMode>("pipeline");
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<LeadSortKey>("updated_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [assignOpen, setAssignOpen] = useState(false);
  const [assignMode, setAssignMode] = useState<"selected" | "all_new">("selected");
  const [editLeadId, setEditLeadId] = useState<string | null>(null);

  const editLead = useMemo(
    () => leads.find((l) => l.id === editLeadId) ?? null,
    [leads, editLeadId]
  );

  const filtered = useMemo(
    () => filterLeadsByQuery(leads, query),
    [leads, query]
  );

  const sorted = useMemo(
    () => sortLeads(filtered, sortKey, sortDir),
    [filtered, sortKey, sortDir]
  );

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleSort(key: LeadSortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "created_at" || key === "updated_at" ? "desc" : "asc");
    }
  }

  function openAssign(nextMode: "selected" | "all_new") {
    setAssignMode(nextMode);
    setAssignOpen(true);
  }

  function openLead(lead: Lead) {
    setEditLeadId(lead.id);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3">
        <Tabs
          value={mode}
          onValueChange={(v) => setMode(v as WorkspaceMode)}
          className="w-full sm:w-auto"
        >
          <TabsList className="grid w-full grid-cols-2 sm:w-[320px]">
            <TabsTrigger value="all" className="gap-1.5">
              <List className="h-4 w-4" />
              All
            </TabsTrigger>
            <TabsTrigger value="pipeline" className="gap-1.5">
              <Kanban className="h-4 w-4" />
              Pipeline
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-1 flex-col md:flex-row md:items-center justify-between gap-3">
          <Input
            placeholder="Search leads…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="sm:max-w-xs"
          />
          {canManage ? (
            <div className="flex flex-wrap items-center gap-2">
              <LeadExportDialog assignees={assignees} />
              {mode === "all" ? (
                <>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={!selected.size}
                    onClick={() => openAssign("selected")}
                  >
                    <UserPlus className="h-4 w-4 mr-1" />
                    Assign ({selected.size})
                  </Button>
                  <Button type="button" size="sm" onClick={() => openAssign("all_new")}>
                    Assign all new
                  </Button>
                </>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      {mode === "all" ? (
        <LeadSortableTable
          leads={sorted}
          canManage={canManage}
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={handleSort}
          selected={selected}
          onToggle={toggle}
          onRowClick={openLead}
          activeLeadId={editLeadId}
        />
      ) : (
        <>
          <p className="text-xs text-muted-foreground">
            Drag cards between columns to update status. Click a card to view details — use Edit in the modal to change fields.
          </p>
          <LeadPipelineBoard leads={filtered} onOpenLead={openLead} />
        </>
      )}

      <LeadEditModal
        lead={editLead}
        open={Boolean(editLeadId)}
        onOpenChange={(open) => {
          if (!open) setEditLeadId(null);
        }}
        assignees={assignees}
        canManage={canManage}
        basePath={basePath}
      />

      {canManage ? (
        <LeadAssignModal
          open={assignOpen}
          onOpenChange={setAssignOpen}
          assignees={assignees}
          leadIds={assignMode === "selected" ? [...selected] : []}
          mode={assignMode}
          onComplete={() => setSelected(new Set())}
        />
      ) : null}
    </div>
  );
}
