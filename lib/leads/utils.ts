import type { LeadCategory, LeadStatus } from "@/lib/types/database";

export type LeadViewFilter =
  | "all"
  | "new"
  | "contacted"
  | "in_progress"
  | "converted"
  | "content";

export const LEAD_VIEW_OPTIONS: { id: LeadViewFilter; label: string }[] = [
  { id: "all", label: "All leads" },
  { id: "new", label: "New" },
  { id: "contacted", label: "Contacted" },
  { id: "in_progress", label: "In progress" },
  { id: "converted", label: "Converted" },
  { id: "content", label: "Content / marketing" },
];

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "In progress",
  converted: "Converted",
  lost: "Lost",
};

export const LEAD_CATEGORY_LABELS: Record<LeadCategory, string> = {
  sales: "Sales",
  content: "Content",
  marketing: "Marketing",
};

export function leadDisplayName(lead: {
  first_name: string;
  last_name: string;
  email: string;
}) {
  const name = `${lead.first_name} ${lead.last_name}`.trim();
  return name || lead.email;
}

export function filterLeadByView(
  lead: { status: LeadStatus; category: LeadCategory },
  view: LeadViewFilter
) {
  switch (view) {
    case "all":
      return true;
    case "new":
      return lead.status === "new";
    case "contacted":
      return lead.status === "contacted";
    case "in_progress":
      return lead.status === "qualified";
    case "converted":
      return lead.status === "converted";
    case "content":
      return lead.category === "content" || lead.category === "marketing";
    default:
      return true;
  }
}

export function leadsToCsv(
  rows: Array<{
    first_name: string;
    last_name: string;
    email: string;
    phone: string | null;
    company: string | null;
    status: LeadStatus;
    category: LeadCategory;
    source: string | null;
    assignee_name: string | null;
    created_at: string;
    updated_at: string;
  }>
) {
  const header = [
    "Name",
    "Email",
    "Phone",
    "Company",
    "Status",
    "Category",
    "Source",
    "Assigned to",
    "Created",
    "Updated",
  ];

  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;

  const lines = rows.map((r) =>
    [
      `${r.first_name} ${r.last_name}`.trim(),
      r.email,
      r.phone ?? "",
      r.company ?? "",
      LEAD_STATUS_LABELS[r.status] ?? r.status,
      LEAD_CATEGORY_LABELS[r.category] ?? r.category,
      r.source ?? "",
      r.assignee_name ?? "",
      new Date(r.created_at).toISOString(),
      new Date(r.updated_at).toISOString(),
    ]
      .map(escape)
      .join(",")
  );

  return [header.map(escape).join(","), ...lines].join("\n");
}
