"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth/session";
import { isStaff } from "@/lib/auth/roles";
import { getDefaultOrganizationId } from "@/lib/data/organization";
import {
  isValidFacilityTypeSlug,
  slugifyFacilityType,
} from "@/lib/facility-types/utils";

const PATHS = ["/app/admin/settings/locations"];

function revalidateFacilityTypes() {
  for (const p of PATHS) revalidatePath(p);
}

async function requireStaff() {
  const profile = await requireProfile();
  if (!isStaff(profile.role)) return { error: "Forbidden" as const };
  return { profile, error: null };
}

export type FacilityTypeInput = {
  id?: string;
  label: string;
  slug?: string;
  description?: string;
  is_active?: boolean;
  sort_order?: number;
};

export async function listFacilityTypesForStaff(includeInactive = true) {
  const supabase = await createClient();
  let q = supabase
    .from("facility_types")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("label", { ascending: true });
  if (!includeInactive) q = q.eq("is_active", true);
  const { data, error } = await q;
  if (error) return { data: [], error: error.message };
  return { data: data ?? [], error: null };
}

export async function upsertFacilityType(input: FacilityTypeInput) {
  const { error: authErr } = await requireStaff();
  if (authErr) return { error: authErr };

  const orgId = await getDefaultOrganizationId();
  if (!orgId) return { error: "Organization not configured" };

  const label = input.label.trim();
  if (!label) return { error: "Label is required" };

  const slug = (input.slug?.trim() || slugifyFacilityType(label)).toLowerCase();
  if (!isValidFacilityTypeSlug(slug)) {
    return {
      error:
        "Code must start with a letter and use only lowercase letters, numbers, and underscores",
    };
  }

  const supabase = await createClient();
  const payload = {
    organization_id: orgId,
    slug,
    label,
    description: input.description?.trim() || null,
    is_active: input.is_active !== false,
    sort_order: Number(input.sort_order ?? 0),
  };

  if (input.id) {
    const { data: existing } = await supabase
      .from("facility_types")
      .select("slug")
      .eq("id", input.id)
      .single();

    if (existing && existing.slug !== slug) {
      return { error: "Type code cannot be changed after creation" };
    }

    const { error } = await supabase
      .from("facility_types")
      .update({
        label: payload.label,
        description: payload.description,
        is_active: payload.is_active,
        sort_order: payload.sort_order,
      })
      .eq("id", input.id)
      .eq("organization_id", orgId);

    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("facility_types").insert(payload);
    if (error) {
      if (error.code === "23505") return { error: "A type with this code already exists" };
      return { error: error.message };
    }
  }

  revalidateFacilityTypes();
  return { success: true as const };
}

export async function deleteFacilityType(id: string) {
  const { error: authErr } = await requireStaff();
  if (authErr) return { error: authErr };

  const orgId = await getDefaultOrganizationId();
  if (!orgId) return { error: "Organization not configured" };

  const supabase = await createClient();
  const { data: row } = await supabase
    .from("facility_types")
    .select("slug, label")
    .eq("id", id)
    .eq("organization_id", orgId)
    .single();

  if (!row) return { error: "Facility type not found" };

  const { count } = await supabase
    .from("facility_locations")
    .select("id", { count: "exact", head: true })
    .eq("organization_id", orgId)
    .eq("facility_type", row.slug);

  if ((count ?? 0) > 0) {
    return {
      error: `Cannot delete “${row.label}”: locations use this type. Deactivate it instead.`,
    };
  }

  const { error } = await supabase
    .from("facility_types")
    .delete()
    .eq("id", id)
    .eq("organization_id", orgId);

  if (error) return { error: error.message };
  revalidateFacilityTypes();
  return { success: true as const };
}
