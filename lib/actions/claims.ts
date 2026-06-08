"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth/session";
import { isStaff } from "@/lib/auth/roles";
import { getDefaultOrganizationId } from "@/lib/data/organization";
import { writeAuditLog } from "@/lib/audit/log";
import {
  CLAIM_RELATIONS_SELECT,
  normalizeClaimRow,
  type ClaimWithRelations,
} from "@/lib/data/entity-relations";
import type { ClaimStatus } from "@/lib/types/database";
import {
  markClaimNotificationsRead,
  notifyStaffNewClaim,
} from "@/lib/actions/notifications";

const ADMIN_PATHS = ["/app/admin/claims", "/app/portal/claims"];

function revalidateClaims() {
  for (const p of ADMIN_PATHS) revalidatePath(p);
}

async function requireStaff() {
  const profile = await requireProfile();
  if (!isStaff(profile.role)) return { error: "Forbidden" as const };
  return { profile, error: null };
}

async function resolveCustomerShipmentId(
  supabase: Awaited<ReturnType<typeof createClient>>,
  profileId: string,
  reference: string
): Promise<{ id: string } | { error: string }> {
  const ref = reference.trim();
  if (!ref) return { error: "Enter your tracking number." };

  const uuidLike =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      ref
    );

  const query = supabase
    .from("shipments")
    .select("id")
    .eq("created_by", profileId);

  const { data, error } = uuidLike
    ? await query.eq("id", ref).maybeSingle()
    : await query.eq("tracking_number", ref).maybeSingle();

  if (error) return { error: error.message };
  if (!data) {
    return {
      error: "We could not find that shipment on your account. Check the tracking number.",
    };
  }
  return { id: data.id };
}

export async function createClaim(data: {
  shipmentId: string;
  claimType: string;
  description: string;
}) {
  const profile = await requireProfile();
  const orgId = await getDefaultOrganizationId();
  if (!orgId) return { error: "Something went wrong. Please try again later." };

  const supabase = await createClient();
  const resolved = await resolveCustomerShipmentId(
    supabase,
    profile.id,
    data.shipmentId
  );
  if ("error" in resolved) return { error: resolved.error };

  const shipmentId = resolved.id;

  const { data: row, error } = await supabase
    .from("claims")
    .insert({
      organization_id: orgId,
      shipment_id: shipmentId,
      created_by: profile.id,
      claim_type: data.claimType,
      description: data.description,
    })
    .select("id, claim_type, shipment_id")
    .single();

  if (error) return { error: error.message };

  const { data: shipment } = await supabase
    .from("shipments")
    .select("tracking_number")
    .eq("id", shipmentId)
    .single();

  await writeAuditLog({
    action: "claim_filed",
    entityType: "claim",
    entityId: row.id,
    payload: {
      claim_type: data.claimType,
      tracking_number: shipment?.tracking_number,
    },
  });

  await notifyStaffNewClaim(row.id, data.claimType, shipment?.tracking_number);

  revalidateClaims();
  return { success: true, id: row.id };
}

export async function listMyClaims() {
  const profile = await requireProfile();
  const supabase = await createClient();
  const { data } = await supabase
    .from("claims")
    .select("*, shipments(tracking_number)")
    .eq("created_by", profile.id)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function listClaimsAdmin(): Promise<{
  data: ClaimWithRelations[];
  error?: string;
}> {
  const auth = await requireStaff();
  if (auth.error) return { data: [], error: auth.error };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("claims")
    .select(CLAIM_RELATIONS_SELECT)
    .order("created_at", { ascending: false });

  if (error) return { data: [], error: error.message };
  return {
    data: ((data ?? []) as Record<string, unknown>[]).map(normalizeClaimRow),
  };
}

export async function getClaimWithRelations(id: string): Promise<{
  data: ClaimWithRelations | null;
  error?: string;
}> {
  const auth = await requireStaff();
  if (auth.error) return { data: null, error: auth.error };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("claims")
    .select(CLAIM_RELATIONS_SELECT)
    .eq("id", id)
    .single();

  if (error || !data) return { data: null, error: error?.message ?? "Not found" };
  return { data: normalizeClaimRow(data as Record<string, unknown>) };
}

export async function updateClaimStatus(
  id: string,
  status: ClaimStatus,
  resolutionNotes?: string
) {
  const auth = await requireStaff();
  if (auth.error) return { error: auth.error };

  const supabase = await createClient();
  const { data: claim, error } = await supabase
    .from("claims")
    .update({
      status,
      resolution_notes: resolutionNotes?.trim() || undefined,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("id, claim_type, status")
    .single();

  if (error) return { error: error.message };

  await writeAuditLog({
    action: "claim_status_updated",
    entityType: "claim",
    entityId: id,
    payload: {
      status,
      claim_type: claim.claim_type,
      resolution_notes: resolutionNotes?.trim() || null,
    },
  });

  revalidateClaims();
  revalidatePath(`/app/admin/claims/${id}`);
  return { success: true as const };
}

/** Mark claim as seen by ops staff (first view + clear inbox alerts for this user). */
export async function markClaimViewed(id: string) {
  const auth = await requireStaff();
  if (auth.error) return { error: auth.error };

  const supabase = await createClient();
  const now = new Date().toISOString();

  await supabase
    .from("claims")
    .update({
      staff_viewed_at: now,
      staff_viewed_by: auth.profile!.id,
    })
    .eq("id", id)
    .is("staff_viewed_at", null);

  await markClaimNotificationsRead(id);

  revalidateClaims();
  revalidatePath(`/app/admin/claims/${id}`);
  revalidatePath("/app");
  return { success: true as const };
}

export async function getUnviewedClaimsCount(): Promise<number> {
  const auth = await requireStaff();
  if (auth.error) return 0;

  const supabase = await createClient();
  const { count } = await supabase
    .from("claims")
    .select("*", { count: "exact", head: true })
    .is("staff_viewed_at", null);

  return count ?? 0;
}
