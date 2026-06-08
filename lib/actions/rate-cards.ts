"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth/session";
import { isStaff } from "@/lib/auth/roles";
import { getDefaultOrganizationId } from "@/lib/data/organization";
import type { ServiceType } from "@/lib/types/database";

const RATES_PATH = "/app/superadmin/rates";

function revalidateRates() {
  revalidatePath(RATES_PATH);
  revalidatePath("/estimator");
}

async function requireStaff() {
  const profile = await requireProfile();
  if (!isStaff(profile.role)) return { error: "Forbidden" as const, profile: null };
  return { profile, error: null };
}

export type RateCardInput = {
  id?: string;
  name: string;
  service_type: ServiceType;
  price_per_kg: number;
  min_charge?: number;
  is_active?: boolean;
};

export async function upsertRateCard(input: RateCardInput) {
  const { error: authErr } = await requireStaff();
  if (authErr) return { error: authErr };

  const orgId = await getDefaultOrganizationId();
  if (!orgId) return { error: "Organization not configured" };

  const name = input.name.trim();
  if (!name) return { error: "Name is required" };

  const price = Number(input.price_per_kg);
  if (!Number.isFinite(price) || price <= 0) {
    return { error: "Price per kg must be greater than 0" };
  }

  const minCharge = Number(input.min_charge ?? 0);
  if (!Number.isFinite(minCharge) || minCharge < 0) {
    return { error: "Minimum charge cannot be negative" };
  }

  const isActive = input.is_active !== false;
  const supabase = await createClient();

  const { data: serviceRow } = await supabase
    .from("service_types")
    .select("slug")
    .eq("organization_id", orgId)
    .eq("slug", input.service_type)
    .maybeSingle();

  if (!serviceRow) {
    return { error: "Unknown service type. Add it under Service types first." };
  }

  if (isActive) {
    let deactivate = supabase
      .from("rate_cards")
      .update({ is_active: false })
      .eq("organization_id", orgId)
      .eq("service_type", input.service_type);
    if (input.id) deactivate = deactivate.neq("id", input.id);
    await deactivate;
  }

  const payload = {
    organization_id: orgId,
    name,
    service_type: input.service_type,
    price_per_kg: price,
    min_charge: minCharge,
    is_active: isActive,
  };

  if (input.id) {
    const { error } = await supabase
      .from("rate_cards")
      .update(payload)
      .eq("id", input.id)
      .eq("organization_id", orgId);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("rate_cards").insert(payload);
    if (error) return { error: error.message };
  }

  revalidateRates();
  return { success: true as const };
}

export async function deleteRateCard(id: string) {
  const { error: authErr } = await requireStaff();
  if (authErr) return { error: authErr };

  const orgId = await getDefaultOrganizationId();
  if (!orgId) return { error: "Organization not configured" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("rate_cards")
    .delete()
    .eq("id", id)
    .eq("organization_id", orgId);

  if (error) return { error: error.message };
  revalidateRates();
  return { success: true as const };
}

export async function getActiveRateCardsForPricing() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("rate_cards")
    .select("service_type, price_per_kg, min_charge, name")
    .eq("is_active", true)
    .order("service_type");

  if (error || !data?.length) return { data: null, error: error?.message };
  return { data, error: null };
}
