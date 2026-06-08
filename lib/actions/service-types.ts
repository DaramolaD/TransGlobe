"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth/session";
import { isStaff } from "@/lib/auth/roles";
import { getDefaultOrganizationId } from "@/lib/data/organization";
import { isValidServiceSlug, slugifyServiceType } from "@/lib/service-types/utils";

const PATHS = ["/app/superadmin/rates", "/estimator", "/app/portal/book"];

function revalidateServiceTypes() {
  for (const p of PATHS) revalidatePath(p);
}

async function requireStaff() {
  const profile = await requireProfile();
  if (!isStaff(profile.role)) return { error: "Forbidden" as const, profile: null };
  return { profile, error: null };
}

export type ServiceTypeInput = {
  id?: string;
  label: string;
  slug?: string;
  description?: string;
  delivery_hint?: string;
  is_active?: boolean;
  sort_order?: number;
};

export async function upsertServiceType(input: ServiceTypeInput) {
  const { error: authErr } = await requireStaff();
  if (authErr) return { error: authErr };

  const orgId = await getDefaultOrganizationId();
  if (!orgId) return { error: "Organization not configured" };

  const label = input.label.trim();
  if (!label) return { error: "Label is required" };

  const slug = (input.slug?.trim() || slugifyServiceType(label)).toLowerCase();
  if (!isValidServiceSlug(slug)) {
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
    delivery_hint: input.delivery_hint?.trim() || null,
    is_active: input.is_active !== false,
    sort_order: Number(input.sort_order ?? 0),
  };

  if (input.id) {
    const { data: existing } = await supabase
      .from("service_types")
      .select("slug")
      .eq("id", input.id)
      .single();

    if (existing && existing.slug !== slug) {
      return { error: "Service code cannot be changed after creation" };
    }

    const { error } = await supabase
      .from("service_types")
      .update({
        label: payload.label,
        description: payload.description,
        delivery_hint: payload.delivery_hint,
        is_active: payload.is_active,
        sort_order: payload.sort_order,
      })
      .eq("id", input.id)
      .eq("organization_id", orgId);

    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("service_types").insert(payload);
    if (error) {
      if (error.code === "23505") return { error: "A service with this code already exists" };
      return { error: error.message };
    }
  }

  revalidateServiceTypes();
  return { success: true as const };
}

export async function deleteServiceType(id: string) {
  const { error: authErr } = await requireStaff();
  if (authErr) return { error: authErr };

  const orgId = await getDefaultOrganizationId();
  if (!orgId) return { error: "Organization not configured" };

  const supabase = await createClient();
  const { data: row } = await supabase
    .from("service_types")
    .select("slug, label")
    .eq("id", id)
    .eq("organization_id", orgId)
    .single();

  if (!row) return { error: "Service type not found" };

  const slug = row.slug as string;

  const [rates, quotes, shipments] = await Promise.all([
    supabase
      .from("rate_cards")
      .select("id", { count: "exact", head: true })
      .eq("organization_id", orgId)
      .eq("service_type", slug),
    supabase
      .from("quotes")
      .select("id", { count: "exact", head: true })
      .eq("organization_id", orgId)
      .eq("service_type", slug),
    supabase
      .from("shipments")
      .select("id", { count: "exact", head: true })
      .eq("organization_id", orgId)
      .eq("service_type", slug),
  ]);

  const rateCount = rates.count;
  const quoteCount = quotes.count;
  const shipmentCount = shipments.count;

  const inUse =
    (rateCount ?? 0) + (quoteCount ?? 0) + (shipmentCount ?? 0) > 0;
  if (inUse) {
    return {
      error: `Cannot delete “${row.label}”: it is used by rate cards, quotes, or shipments. Deactivate it instead.`,
    };
  }

  const { error } = await supabase
    .from("service_types")
    .delete()
    .eq("id", id)
    .eq("organization_id", orgId);

  if (error) return { error: error.message };
  revalidateServiceTypes();
  return { success: true as const };
}

export async function listServiceTypesForStaff() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("service_types")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("label", { ascending: true });

  if (error) return { data: [], error: error.message };
  return { data: data ?? [], error: null };
}
