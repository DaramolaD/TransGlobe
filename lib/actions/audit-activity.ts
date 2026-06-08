"use server";

import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth/session";
import { canWorkLeads, isSales, isStaff } from "@/lib/auth/roles";
import type { AuditEntityType } from "@/lib/audit/log";

async function canReadEntityActivity(
  profile: { id: string; role: import("@/lib/types/database").UserRole },
  entityType: AuditEntityType,
  entityId: string
) {
  if (isStaff(profile.role)) return true;
  if (entityType !== "lead" || !isSales(profile.role)) return false;

  const supabase = await createClient();
  const { data } = await supabase
    .from("leads")
    .select("assigned_to")
    .eq("id", entityId)
    .single();

  return data?.assigned_to === profile.id;
}

export async function listEntityActivity(
  entityType: AuditEntityType,
  entityId: string
) {
  const profile = await requireProfile();
  if (!canWorkLeads(profile.role) && !isStaff(profile.role)) {
    return { data: [], error: "Forbidden" };
  }

  const allowed = await canReadEntityActivity(profile, entityType, entityId);
  if (!allowed) return { data: [], error: "Forbidden" };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("audit_logs")
    .select("id, action, payload, created_at, actor_id")
    .eq("entity_type", entityType)
    .eq("entity_id", entityId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) return { data: [], error: error.message };

  const actorIds = [
    ...new Set((data ?? []).map((e) => e.actor_id).filter(Boolean)),
  ] as string[];

  let actors: Record<string, string> = {};
  if (actorIds.length) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, email")
      .in("id", actorIds);
    actors = Object.fromEntries(
      (profiles ?? []).map((p) => [p.id, p.full_name ?? p.email ?? "Staff"])
    );
  }

  return {
    data: (data ?? []).map((e) => ({
      id: e.id,
      action: e.action,
      payload: e.payload,
      created_at: e.created_at,
      actor_name: e.actor_id ? actors[e.actor_id] : null,
    })),
  };
}
