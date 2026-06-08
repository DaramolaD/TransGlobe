"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth/session";
import {
  canManageLeads,
  canWorkLeads,
  isSales,
  LEAD_ASSIGNEE_ROLES,
} from "@/lib/auth/roles";
import { writeAuditLog } from "@/lib/audit/log";
import { getDefaultOrganizationId } from "@/lib/data/organization";
import { leadsToCsv } from "@/lib/leads/utils";
import type { LeadCategory, LeadStatus } from "@/lib/types/database";

const LEAD_PATHS = ["/app/admin/leads", "/app/sales", "/app/sales/leads"];

const LEAD_SELECT = `
  *,
  assignee:profiles!assigned_to(id, full_name, email)
`;

function revalidateLeads() {
  for (const p of LEAD_PATHS) revalidatePath(p);
}

async function requireLeadAccess() {
  const profile = await requireProfile();
  if (!canWorkLeads(profile.role)) {
    return { error: "Forbidden" as const, profile: null };
  }
  return { profile, error: null };
}

async function requireLeadManage() {
  const profile = await requireProfile();
  if (!canManageLeads(profile.role)) {
    return { error: "Forbidden" as const, profile: null };
  }
  return { profile, error: null };
}

async function canAccessLead(leadId: string) {
  const { profile, error } = await requireLeadAccess();
  if (error || !profile) return { ok: false as const, profile: null };

  if (canManageLeads(profile.role)) {
    return { ok: true as const, profile };
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("leads")
    .select("id, assigned_to")
    .eq("id", leadId)
    .single();

  if (!data || data.assigned_to !== profile.id) {
    return { ok: false as const, profile: null };
  }

  return { ok: true as const, profile };
}

function actorLabel(profile: { full_name: string | null; email: string | null }) {
  return profile.full_name ?? profile.email ?? "Staff";
}

export async function listSalesAssignees() {
  const { error } = await requireLeadManage();
  if (error) return { error, data: [] };

  const supabase = await createClient();
  const { data, error: qErr } = await supabase
    .from("profiles")
    .select("id, full_name, email, role")
    .in("role", LEAD_ASSIGNEE_ROLES)
    .eq("is_active", true)
    .order("full_name");

  if (qErr) return { error: qErr.message, data: [] };
  return { data: data ?? [] };
}

export async function listLeads(options?: { assignedOnly?: boolean }) {
  const { profile, error } = await requireLeadAccess();
  if (error) return { error, data: [] };

  const supabase = await createClient();
  let query = supabase
    .from("leads")
    .select(LEAD_SELECT)
    .order("created_at", { ascending: false });

  if (isSales(profile!.role) || options?.assignedOnly) {
    query = query.eq("assigned_to", profile!.id);
  }

  const { data, error: qErr } = await query;
  if (qErr) return { error: qErr.message, data: [] };

  return { data: data ?? [] };
}

export async function getLead(id: string) {
  const access = await canAccessLead(id);
  if (!access.ok) return { error: "Forbidden", data: null };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("leads")
    .select(LEAD_SELECT)
    .eq("id", id)
    .single();

  if (error) return { error: error.message, data: null };
  return { data };
}

export async function updateLeadDetails(
  id: string,
  input: {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string | null;
    company?: string | null;
    service_interest?: string | null;
    message?: string | null;
    status?: LeadStatus;
    category?: LeadCategory;
  }
) {
  const access = await canAccessLead(id);
  if (!access.ok || !access.profile) return { error: "Forbidden" };

  const first_name = input.first_name.trim();
  const last_name = input.last_name.trim();
  const email = input.email.trim();

  if (!first_name || !last_name) return { error: "Name is required" };
  if (!email) return { error: "Email is required" };

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("leads")
    .select("status, category")
    .eq("id", id)
    .single();

  const patch: Record<string, unknown> = {
    first_name,
    last_name,
    email,
    phone: input.phone?.trim() || null,
    company: input.company?.trim() || null,
    service_interest: input.service_interest?.trim() || null,
    message: input.message?.trim() || null,
  };

  if (input.status && input.status !== existing?.status) {
    patch.status = input.status;
    if (input.status === "contacted") {
      patch.last_contacted_at = new Date().toISOString();
    }
  }

  if (input.category && canManageLeads(access.profile.role)) {
    patch.category = input.category;
  }

  const { error } = await supabase.from("leads").update(patch).eq("id", id);
  if (error) return { error: error.message };

  await writeAuditLog({
    action: "lead_updated",
    entityType: "lead",
    entityId: id,
    payload: {
      actor: actorLabel(access.profile),
      email,
      status: input.status ?? existing?.status,
    },
  });

  if (input.status && input.status !== existing?.status) {
    await writeAuditLog({
      action: "lead_status_updated",
      entityType: "lead",
      entityId: id,
      payload: {
        from: existing?.status,
        to: input.status,
        actor: actorLabel(access.profile),
      },
    });
  }

  if (input.category && input.category !== existing?.category) {
    await writeAuditLog({
      action: "lead_category_updated",
      entityType: "lead",
      entityId: id,
      payload: { category: input.category },
    });
  }

  revalidateLeads();
  revalidatePath(`/app/admin/leads/${id}`);
  revalidatePath(`/app/sales/leads/${id}`);
  return { success: true as const };
}

export async function updateLeadStatus(id: string, status: LeadStatus) {
  const access = await canAccessLead(id);
  if (!access.ok || !access.profile) return { error: "Forbidden" };

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("leads")
    .select("status")
    .eq("id", id)
    .single();

  const patch: Record<string, unknown> = { status };
  if (status === "contacted") {
    patch.last_contacted_at = new Date().toISOString();
  }

  const { error } = await supabase.from("leads").update(patch).eq("id", id);
  if (error) return { error: error.message };

  await writeAuditLog({
    action: "lead_status_updated",
    entityType: "lead",
    entityId: id,
    payload: {
      from: existing?.status,
      to: status,
      actor: actorLabel(access.profile),
    },
  });

  revalidateLeads();
  revalidatePath(`/app/admin/leads/${id}`);
  revalidatePath(`/app/sales/leads/${id}`);
  return { success: true as const };
}

export async function assignLead(id: string, assigneeId: string | null) {
  const { profile, error } = await requireLeadManage();
  if (error) return { error };

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("leads")
    .select("assigned_to")
    .eq("id", id)
    .single();

  const { error: uErr } = await supabase
    .from("leads")
    .update({ assigned_to: assigneeId })
    .eq("id", id);

  if (uErr) return { error: uErr.message };

  let assigneeName: string | null = null;
  if (assigneeId) {
    const { data: assignee } = await supabase
      .from("profiles")
      .select("full_name, email")
      .eq("id", assigneeId)
      .single();
    assigneeName = assignee?.full_name ?? assignee?.email ?? null;
  }

  await writeAuditLog({
    action: "lead_assigned",
    entityType: "lead",
    entityId: id,
    payload: {
      from: existing?.assigned_to,
      to: assigneeId,
      assignee_name: assigneeName,
      assigned_by: actorLabel(profile!),
    },
  });

  revalidateLeads();
  revalidatePath(`/app/admin/leads/${id}`);
  return { success: true as const };
}

export async function bulkAssignLeads(ids: string[], assigneeId: string) {
  const { profile, error } = await requireLeadManage();
  if (error) return { error };
  if (!ids.length) return { error: "No leads selected" };

  const supabase = await createClient();
  const { data: assignee } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", assigneeId)
    .single();

  const assigneeName = assignee?.full_name ?? assignee?.email ?? "Staff";

  const { error: uErr } = await supabase
    .from("leads")
    .update({ assigned_to: assigneeId })
    .in("id", ids);

  if (uErr) return { error: uErr.message };

  for (const id of ids) {
    await writeAuditLog({
      action: "lead_assigned",
      entityType: "lead",
      entityId: id,
      payload: {
        to: assigneeId,
        assignee_name: assigneeName,
        assigned_by: actorLabel(profile!),
        bulk: true,
      },
    });
  }

  revalidateLeads();
  return { success: true as const, count: ids.length };
}

export async function assignAllNewLeads(assigneeId: string) {
  const { error } = await requireLeadManage();
  if (error) return { error };

  const supabase = await createClient();
  const { data: newLeads, error: qErr } = await supabase
    .from("leads")
    .select("id")
    .eq("status", "new")
    .is("assigned_to", null);

  if (qErr) return { error: qErr.message };
  const ids = (newLeads ?? []).map((l) => l.id);
  if (!ids.length) return { success: true as const, count: 0 };

  return bulkAssignLeads(ids, assigneeId);
}

export async function addLeadNote(id: string, body: string) {
  const access = await canAccessLead(id);
  if (!access.ok || !access.profile) return { error: "Forbidden" };

  const text = body.trim();
  if (!text) return { error: "Note is required" };

  await writeAuditLog({
    action: "lead_note_added",
    entityType: "lead",
    entityId: id,
    payload: {
      note: text,
      actor: actorLabel(access.profile),
    },
  });

  revalidatePath(`/app/admin/leads/${id}`);
  revalidatePath(`/app/sales/leads/${id}`);
  return { success: true as const };
}

export async function updateLeadCategory(id: string, category: LeadCategory) {
  const { error } = await requireLeadManage();
  if (error) return { error };

  const supabase = await createClient();
  const { error: uErr } = await supabase
    .from("leads")
    .update({ category })
    .eq("id", id);

  if (uErr) return { error: uErr.message };

  await writeAuditLog({
    action: "lead_category_updated",
    entityType: "lead",
    entityId: id,
    payload: { category },
  });

  revalidateLeads();
  return { success: true as const };
}

export async function exportLeadsCsv(filters: {
  status?: LeadStatus | "all";
  assigneeId?: string | "all" | "unassigned";
  from?: string;
  to?: string;
}) {
  const { error } = await requireLeadManage();
  if (error) return { error, csv: null as string | null };

  const supabase = await createClient();
  let query = supabase
    .from("leads")
    .select(`${LEAD_SELECT}`)
    .order("created_at", { ascending: false });

  if (filters.status && filters.status !== "all") {
    query = query.eq("status", filters.status);
  }
  if (filters.assigneeId === "unassigned") {
    query = query.is("assigned_to", null);
  } else if (filters.assigneeId && filters.assigneeId !== "all") {
    query = query.eq("assigned_to", filters.assigneeId);
  }
  if (filters.from) {
    query = query.gte("created_at", filters.from);
  }
  if (filters.to) {
    query = query.lte("created_at", filters.to);
  }

  const { data, error: qErr } = await query;
  if (qErr) return { error: qErr.message, csv: null };

  const csv = leadsToCsv(
    (data ?? []).map((row) => {
      const r = row as Record<string, unknown>;
      const assigneeRaw = r.assignee;
      const assignee = Array.isArray(assigneeRaw)
        ? (assigneeRaw[0] as { full_name: string | null; email: string } | undefined)
        : (assigneeRaw as { full_name: string | null; email: string } | null);

      return {
        first_name: String(r.first_name),
        last_name: String(r.last_name),
        email: String(r.email),
        phone: (r.phone as string | null) ?? null,
        company: (r.company as string | null) ?? null,
        status: r.status as LeadStatus,
        category: (r.category as LeadCategory) ?? "sales",
        source: (r.source as string | null) ?? null,
        assignee_name: assignee?.full_name ?? assignee?.email ?? null,
        created_at: String(r.created_at),
        updated_at: String(r.updated_at),
      };
    })
  );

  return { csv, filename: `leads-export-${new Date().toISOString().slice(0, 10)}.csv` };
}

export async function getLeadActivitySummary(leadId: string) {
  const access = await canAccessLead(leadId);
  if (!access.ok) return { count: 0 };

  const supabase = await createClient();
  const { count } = await supabase
    .from("audit_logs")
    .select("id", { count: "exact", head: true })
    .eq("entity_type", "lead")
    .eq("entity_id", leadId);

  return { count: count ?? 0 };
}

export async function notifyStaffNewLead(leadId: string, name: string) {
  const orgId = await getDefaultOrganizationId();
  if (!orgId) return;

  const supabase = await createClient();
  const { data: staff } = await supabase
    .from("profiles")
    .select("id")
    .in("role", ["admin", "superadmin"])
    .eq("is_active", true);

  if (!staff?.length) return;

  await supabase.from("notifications").insert(
    staff.map((s) => ({
      organization_id: orgId,
      user_id: s.id,
      title: "New lead",
      body: `${name} submitted the contact form.`,
      metadata: { lead_id: leadId },
    }))
  );
}
