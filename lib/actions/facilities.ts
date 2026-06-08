"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth/session";
import { isStaff } from "@/lib/auth/roles";
import { getDefaultOrganizationId } from "@/lib/data/organization";
import type { FacilityType } from "@/lib/types/tracking";

const PATHS = [
  "/app/admin/settings/locations",
  "/app/admin/tracking",
  "/app/admin/tracking",
  "/app/admin/shipments",
];

function revalidateFacilities() {
  for (const p of PATHS) revalidatePath(p);
  revalidatePath("/app/superadmin/settings");
}

async function requireStaff() {
  const profile = await requireProfile();
  if (!isStaff(profile.role)) return { error: "Forbidden" as const };
  return { profile, error: null };
}

export async function listFacilityLocations(includeInactive = false) {
  const supabase = await createClient();
  let q = supabase
    .from("facility_locations")
    .select("*")
    .order("name", { ascending: true });
  if (!includeInactive) q = q.eq("is_active", true);
  const { data, error } = await q;
  if (error) return { data: [], error: error.message };
  return { data: data ?? [], error: null };
}

export type FacilityInput = {
  id?: string;
  name: string;
  facility_type: FacilityType;
  address_line?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  latitude: number;
  longitude: number;
  is_active?: boolean;
  notes?: string;
};

export async function upsertFacilityLocation(input: FacilityInput) {
  const { error: authErr } = await requireStaff();
  if (authErr) return { error: authErr };

  const orgId = await getDefaultOrganizationId();
  if (!orgId) return { error: "Organization not configured" };

  const name = input.name.trim();
  if (!name) return { error: "Name is required" };

  const lat = Number(input.latitude);
  const lng = Number(input.longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return { error: "Valid latitude and longitude are required for the map" };
  }

  const supabase = await createClient();
  const payload = {
    organization_id: orgId,
    name,
    facility_type: input.facility_type,
    address_line: input.address_line?.trim() || null,
    city: input.city?.trim() || null,
    state: input.state?.trim() || null,
    country: input.country?.trim() || "US",
    postal_code: input.postal_code?.trim() || null,
    latitude: lat,
    longitude: lng,
    is_active: input.is_active !== false,
    notes: input.notes?.trim() || null,
    updated_at: new Date().toISOString(),
  };

  if (input.id) {
    const { error } = await supabase
      .from("facility_locations")
      .update(payload)
      .eq("id", input.id)
      .eq("organization_id", orgId);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("facility_locations").insert(payload);
    if (error) return { error: error.message };
  }

  revalidateFacilities();
  return { success: true as const };
}

export async function deleteFacilityLocation(id: string) {
  const { error: authErr } = await requireStaff();
  if (authErr) return { error: authErr };

  const orgId = await getDefaultOrganizationId();
  if (!orgId) return { error: "Organization not configured" };

  const supabase = await createClient();
  const { count } = await supabase
    .from("tracking_events")
    .select("id", { count: "exact", head: true })
    .eq("facility_location_id", id);

  if ((count ?? 0) > 0) {
    return {
      error: "This location is used on tracking events. Deactivate it instead of deleting.",
    };
  }

  const { error } = await supabase
    .from("facility_locations")
    .delete()
    .eq("id", id)
    .eq("organization_id", orgId);

  if (error) return { error: error.message };
  revalidateFacilities();
  return { success: true as const };
}

export async function updateShipmentMapVisibility(
  shipmentId: string,
  mode: import("@/lib/types/tracking").MapVisibilityMode
) {
  const { error: authErr } = await requireStaff();
  if (authErr) return { error: authErr };

  const supabase = await createClient();
  const { error } = await supabase
    .from("shipments")
    .update({ map_visibility_mode: mode, updated_at: new Date().toISOString() })
    .eq("id", shipmentId);

  if (error) return { error: error.message };
  revalidatePath(`/app/admin/tracking/${shipmentId}`);
  revalidatePath("/tracking");
  return { success: true as const };
}
