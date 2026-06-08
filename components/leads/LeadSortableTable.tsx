"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import {
  LEAD_SORT_LABELS,
  normalizeAssignee,
  type LeadSortKey,
} from "@/components/leads/lead-helpers";
import { LEAD_CATEGORY_LABELS, LEAD_STATUS_LABELS, leadDisplayName } from "@/lib/leads/utils";
import type { Lead } from "@/lib/types/database";
import { cn } from "@/lib/utils";

const COLUMNS: { key: LeadSortKey; className?: string; maxClass?: string }[] = [
  { key: "name", maxClass: "max-w-[160px]" },
  { key: "email", className: "hidden lg:table-cell", maxClass: "max-w-[200px]" },
  { key: "company", className: "hidden xl:table-cell", maxClass: "max-w-[160px]" },
  { key: "status" },
  { key: "category", className: "hidden md:table-cell", maxClass: "max-w-[120px]" },
  { key: "assignee", className: "hidden md:table-cell", maxClass: "max-w-[140px]" },
  { key: "created_at", maxClass: "max-w-[110px]" },
  { key: "updated_at", className: "hidden sm:table-cell", maxClass: "max-w-[110px]" },
];

export function LeadSortableTable({
  leads,
  canManage,
  sortKey,
  sortDir,
  onSort,
  selected,
  onToggle,
  onRowClick,
  activeLeadId,
}: {
  leads: Lead[];
  canManage: boolean;
  sortKey: LeadSortKey;
  sortDir: "asc" | "desc";
  onSort: (key: LeadSortKey) => void;
  selected: Set<string>;
  onToggle: (id: string) => void;
  onRowClick: (lead: Lead) => void;
  activeLeadId?: string | null;
}) {
  function SortIcon({ column }: { column: LeadSortKey }) {
    if (sortKey !== column) {
      return <ArrowUpDown className="ml-1 inline h-3.5 w-3.5 opacity-40" />;
    }
    return sortDir === "asc" ? (
      <ArrowUp className="ml-1 inline h-3.5 w-3.5" />
    ) : (
      <ArrowDown className="ml-1 inline h-3.5 w-3.5" />
    );
  }

  return (
    <div className="rounded-lg border overflow-x-auto">
      <table className="w-full min-w-[720px] table-fixed text-sm">
        <thead className="bg-muted/40 text-left">
          <tr>
            {canManage ? <th className="p-3 w-10" aria-label="Select" /> : null}
            {COLUMNS.map((col) => (
              <th
                key={col.key}
                className={cn("p-3 font-medium", col.maxClass, col.className)}
              >
                <button
                  type="button"
                  onClick={() => onSort(col.key)}
                  className="inline-flex items-center hover:text-foreground text-muted-foreground transition-colors"
                >
                  {LEAD_SORT_LABELS[col.key]}
                  <SortIcon column={col.key} />
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => {
            const assignee = normalizeAssignee(lead);
            return (
              <tr
                key={lead.id}
                onClick={() => onRowClick(lead)}
                className={cn(
                  "border-t cursor-pointer transition-colors hover:bg-muted/30",
                  activeLeadId === lead.id && "bg-primary/5 hover:bg-primary/10"
                )}
              >
                {canManage ? (
                  <td className="p-3" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selected.has(lead.id)}
                      onCheckedChange={() => onToggle(lead.id)}
                      aria-label={`Select ${leadDisplayName(lead)}`}
                    />
                  </td>
                ) : null}
                <td className="p-3 max-w-0 font-medium">
                  <span className="truncate block" title={leadDisplayName(lead)}>
                    {leadDisplayName(lead)}
                  </span>
                </td>
                <td className="p-3 hidden lg:table-cell max-w-0 text-muted-foreground">
                  <span className="truncate block" title={lead.email}>
                    {lead.email}
                  </span>
                </td>
                <td className="p-3 hidden xl:table-cell max-w-0 text-muted-foreground">
                  <span className="truncate block" title={lead.company ?? undefined}>
                    {lead.company ?? "—"}
                  </span>
                </td>
                <td className="p-3">
                  <StatusBadge status={LEAD_STATUS_LABELS[lead.status]} />
                </td>
                <td className="p-3 hidden md:table-cell max-w-0">
                  <span className="truncate block">
                    {LEAD_CATEGORY_LABELS[lead.category ?? "sales"]}
                  </span>
                </td>
                <td className="p-3 hidden md:table-cell max-w-0 text-muted-foreground">
                  <span
                    className="truncate block"
                    title={assignee?.full_name ?? assignee?.email ?? undefined}
                  >
                    {assignee?.full_name ?? assignee?.email ?? "—"}
                  </span>
                </td>
                <td className="p-3 whitespace-nowrap tabular-nums">
                  {new Date(lead.created_at).toLocaleDateString()}
                </td>
                <td className="p-3 hidden sm:table-cell whitespace-nowrap tabular-nums text-muted-foreground">
                  {new Date(lead.updated_at).toLocaleDateString()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {!leads.length ? (
        <p className="text-sm text-muted-foreground text-center py-10">No leads match your search.</p>
      ) : null}
    </div>
  );
}
