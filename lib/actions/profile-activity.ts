"use server";

import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth/session";
import type { UserRole } from "@/lib/types/database";
import {
  FULL_ACTIVITY_LIMIT,
  PREVIEW_ACTIVITY_LIMIT,
  mapAssignments,
  mapClaims,
  type ActivityAssignment,
  type ActivityClaim,
  type ActivityInvoice,
  type ActivityPickup,
  type ActivityQuote,
  type ActivityShipment,
  type ProfileActivityOptions,
  type ProfileActivityResult,
} from "@/lib/profile-activity";

export async function getProfileActivity(
  profileId: string,
  options: ProfileActivityOptions = {}
): Promise<{ data: ProfileActivityResult | null; error?: string }> {
  const me = await requireProfile();
  if (me.role !== "superadmin") return { data: null, error: "Forbidden" };

  const scope = options.scope ?? "full";
  const limit =
    options.limit ?? (scope === "preview" ? PREVIEW_ACTIVITY_LIMIT : FULL_ACTIVITY_LIMIT);

  const supabase = await createClient();

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select(
      "id, full_name, email, phone, company_name, role, is_active, created_at, updated_at"
    )
    .eq("id", profileId)
    .single();

  if (profileError || !profile) {
    return { data: null, error: profileError?.message ?? "Profile not found" };
  }

  const role = profile.role as UserRole;
  const empty = {
    shipments: [] as ActivityShipment[],
    assignments: [] as ActivityAssignment[],
    invoices: [] as ActivityInvoice[],
    pickups: [] as ActivityPickup[],
    quotes: [] as ActivityQuote[],
    claims: [] as ActivityClaim[],
  };

  if (scope === "preview") {
    if (role === "driver") {
      const { data } = await supabase
        .from("assignments")
        .select(
          "id, status, assigned_at, completed_at, shipments(id, tracking_number, status, service_type, origin, destination, weight_kg, package_count, estimated_delivery, created_at)"
        )
        .eq("driver_id", profileId)
        .order("assigned_at", { ascending: false })
        .limit(limit);
      return {
        data: {
          profile: { ...profile, role },
          ...empty,
          assignments: mapAssignments(data ?? []),
        },
      };
    }

    if (role === "user") {
      const { data } = await supabase
        .from("shipments")
        .select(
          "id, tracking_number, status, service_type, origin, destination, weight_kg, package_count, estimated_delivery, created_at"
        )
        .eq("created_by", profileId)
        .order("created_at", { ascending: false })
        .limit(limit);
      return {
        data: {
          profile: { ...profile, role },
          ...empty,
          shipments: (data ?? []) as ActivityShipment[],
        },
      };
    }

    const { data } = await supabase
      .from("shipments")
      .select(
        "id, tracking_number, status, service_type, origin, destination, weight_kg, package_count, estimated_delivery, created_at"
      )
      .eq("created_by", profileId)
      .order("created_at", { ascending: false })
      .limit(limit);
    return {
      data: {
        profile: { ...profile, role },
        ...empty,
        shipments: (data ?? []) as ActivityShipment[],
      },
    };
  }

  const [
    shipmentsRes,
    assignmentsRes,
    invoicesRes,
    pickupsRes,
    quotesRes,
    claimsRes,
  ] = await Promise.all([
    supabase
      .from("shipments")
      .select(
        "id, tracking_number, status, service_type, origin, destination, weight_kg, package_count, estimated_delivery, created_at"
      )
      .eq("created_by", profileId)
      .order("created_at", { ascending: false })
      .limit(limit),
    role === "driver"
      ? supabase
          .from("assignments")
          .select(
            "id, status, assigned_at, completed_at, shipments(id, tracking_number, status, service_type, origin, destination, weight_kg, package_count, estimated_delivery, created_at)"
          )
          .eq("driver_id", profileId)
          .order("assigned_at", { ascending: false })
          .limit(limit)
      : Promise.resolve({ data: [] as never[], error: null }),
    supabase
      .from("invoices")
      .select("id, invoice_number, amount, currency, status, due_date, created_at")
      .eq("customer_id", profileId)
      .order("created_at", { ascending: false })
      .limit(limit),
    supabase
      .from("pickup_requests")
      .select(
        "id, status, pickup_city, pickup_address, pickup_date, pickup_time, pickup_country, contact_name, contact_phone, contact_email, package_count, package_weight, special_instructions, created_at"
      )
      .eq("created_by", profileId)
      .order("created_at", { ascending: false })
      .limit(limit),
    supabase
      .from("quotes")
      .select(
        "id, origin, destination, status, service_type, total_price, weight_kg, created_at"
      )
      .eq("created_by", profileId)
      .order("created_at", { ascending: false })
      .limit(limit),
    supabase
      .from("claims")
      .select("id, claim_type, status, description, created_at, shipments(tracking_number)")
      .eq("created_by", profileId)
      .order("created_at", { ascending: false })
      .limit(limit),
  ]);

  return {
    data: {
      profile: { ...profile, role },
      shipments: (shipmentsRes.data ?? []) as ActivityShipment[],
      assignments: mapAssignments(assignmentsRes.data ?? []),
      invoices: (invoicesRes.data ?? []).map((i) => ({
        ...i,
        amount: Number(i.amount),
      })),
      pickups: (pickupsRes.data ?? []) as ActivityPickup[],
      quotes: (quotesRes.data ?? []) as ActivityQuote[],
      claims: mapClaims(claimsRes.data ?? []),
    },
  };
}
