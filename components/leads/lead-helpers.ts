import type { Lead, LeadCategory, LeadStatus } from "@/lib/types/database";
import { LEAD_CATEGORY_LABELS, LEAD_STATUS_LABELS, leadDisplayName } from "@/lib/leads/utils";

export type AssigneeSnippet = {
  id: string;
  full_name: string | null;
  email: string;
};

export function normalizeAssignee(lead: Lead) {
  const raw = lead.assignee as
    | AssigneeSnippet
    | AssigneeSnippet[]
    | null
    | undefined;
  if (!raw) return null;
  return Array.isArray(raw) ? raw[0] ?? null : raw;
}

export function assigneeLabel(lead: Lead) {
  const assignee = normalizeAssignee(lead);
  return assignee?.full_name ?? assignee?.email ?? "Unassigned";
}

export type LeadSortKey =
  | "name"
  | "email"
  | "status"
  | "category"
  | "assignee"
  | "company"
  | "created_at"
  | "updated_at";

export const LEAD_SORT_LABELS: Record<LeadSortKey, string> = {
  name: "Name",
  email: "Email",
  status: "Status",
  category: "Category",
  assignee: "Assigned to",
  company: "Company",
  created_at: "Created",
  updated_at: "Updated",
};

export const LEAD_PIPELINE_COLUMNS: {
  status: LeadStatus;
  label: string;
  hint: string;
}[] = [
  { status: "new", label: LEAD_STATUS_LABELS.new, hint: "Fresh inquiries" },
  { status: "contacted", label: LEAD_STATUS_LABELS.contacted, hint: "First touch made" },
  { status: "qualified", label: LEAD_STATUS_LABELS.qualified, hint: "Active follow-up" },
  { status: "converted", label: LEAD_STATUS_LABELS.converted, hint: "Won deals" },
  { status: "lost", label: LEAD_STATUS_LABELS.lost, hint: "Closed — no sale" },
];

export function sortLeads(
  rows: Lead[],
  key: LeadSortKey,
  direction: "asc" | "desc"
): Lead[] {
  const dir = direction === "asc" ? 1 : -1;

  return [...rows].sort((a, b) => {
    let av: string | number = "";
    let bv: string | number = "";

    switch (key) {
      case "name":
        av = leadDisplayName(a).toLowerCase();
        bv = leadDisplayName(b).toLowerCase();
        break;
      case "email":
        av = a.email.toLowerCase();
        bv = b.email.toLowerCase();
        break;
      case "status":
        av = LEAD_STATUS_LABELS[a.status];
        bv = LEAD_STATUS_LABELS[b.status];
        break;
      case "category":
        av = LEAD_CATEGORY_LABELS[a.category ?? "sales"];
        bv = LEAD_CATEGORY_LABELS[b.category ?? "sales"];
        break;
      case "assignee":
        av = assigneeLabel(a).toLowerCase();
        bv = assigneeLabel(b).toLowerCase();
        break;
      case "company":
        av = (a.company ?? "").toLowerCase();
        bv = (b.company ?? "").toLowerCase();
        break;
      case "created_at":
        av = new Date(a.created_at).getTime();
        bv = new Date(b.created_at).getTime();
        break;
      case "updated_at":
        av = new Date(a.updated_at).getTime();
        bv = new Date(b.updated_at).getTime();
        break;
    }

    if (av < bv) return -1 * dir;
    if (av > bv) return 1 * dir;
    return 0;
  });
}

export function filterLeadsByQuery(leads: Lead[], query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return leads;

  return leads.filter((lead) => {
    const blob = [
      lead.first_name,
      lead.last_name,
      lead.email,
      lead.company,
      lead.phone,
      lead.service_interest,
      LEAD_STATUS_LABELS[lead.status],
      LEAD_CATEGORY_LABELS[lead.category ?? "sales"],
      assigneeLabel(lead),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return blob.includes(q);
  });
}

export function groupLeadsByStatus(leads: Lead[]): Record<LeadStatus, Lead[]> {
  const groups: Record<LeadStatus, Lead[]> = {
    new: [],
    contacted: [],
    qualified: [],
    converted: [],
    lost: [],
  };

  for (const lead of leads) {
    groups[lead.status].push(lead);
  }

  return groups;
}
