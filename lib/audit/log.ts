"use server";

import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth/session";
import { getDefaultOrganizationId } from "@/lib/data/organization";

export type AuditEntityType =
  | "invoice"
  | "shipment"
  | "user"
  | "organization"
  | "quote"
  | "claim"
  | "lead";

export async function writeAuditLog(input: {
  action: string;
  entityType: AuditEntityType;
  entityId?: string | null;
  payload?: Record<string, unknown>;
}) {
  try {
    const profile = await requireProfile();
    const orgId = await getDefaultOrganizationId();
    const supabase = await createClient();

    await supabase.from("audit_logs").insert({
      organization_id: orgId,
      actor_id: profile.id,
      action: input.action,
      entity_type: input.entityType,
      entity_id: input.entityId ?? null,
      payload: input.payload ?? {},
    });
  } catch {
    // Audit must not block primary operations
  }
}
