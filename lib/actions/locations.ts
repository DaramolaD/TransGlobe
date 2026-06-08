"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth/session";
import { isStaff } from "@/lib/auth/roles";
import { getDefaultOrganizationId } from "@/lib/data/organization";
import type { GpsPoint } from "@/lib/types/tracking";

async function assertCanPublish(
  shipmentId: string,
  userId: string,
  role: Parameters<typeof isStaff>[0]
) {
  if (isStaff(role)) return { ok: true as const };

  const supabase = await createClient();
  const { data } = await supabase
    .from("assignments")
    .select("id")
    .eq("shipment_id", shipmentId)
    .eq("driver_id", userId)
    .in("status", ["pending", "accepted", "in_progress"])
    .maybeSingle();

  if (!data) {
    return { ok: false as const, error: "No active assignment for this shipment" };
  }
  return { ok: true as const };
}

export async function uploadLocationBatch(
  shipmentId: string,
  points: GpsPoint[]
) {
  if (!points.length) return { success: true, inserted: 0 };

  const profile = await requireProfile();
  const gate = await assertCanPublish(shipmentId, profile.id, profile.role);
  if (!gate.ok) return { error: gate.error };

  const orgId = await getDefaultOrganizationId();
  if (!orgId) return { error: "Not configured" };

  const supabase = await createClient();

  const { data: shipment } = await supabase
    .from("shipments")
    .select("id, live_tracking_enabled")
    .eq("id", shipmentId)
    .single();

  if (!shipment) return { error: "Shipment not found" };
  if (!shipment.live_tracking_enabled) return { error: "Live tracking disabled" };

  const rows = points.map((p) => ({
    organization_id: orgId,
    shipment_id: shipmentId,
    driver_id: profile.role === "driver" ? profile.id : null,
    latitude: p.latitude,
    longitude: p.longitude,
    accuracy_m: p.accuracy_m ?? null,
    heading: p.heading ?? null,
    speed_mps: p.speed_mps ?? null,
    recorded_at: p.recorded_at,
    client_id: p.client_id,
    source: "driver_gps",
    is_public: true,
  }));

  const { data, error } = await supabase
    .from("shipment_locations")
    .upsert(rows, { onConflict: "shipment_id,client_id", ignoreDuplicates: true })
    .select("id");

  if (error) return { error: error.message };

  revalidatePath("/app/driver");
  revalidatePath("/app/portal/track");
  return { success: true, inserted: data?.length ?? 0 };
}

export async function getShipmentLocations(
  shipmentId: string,
  limit = 200
) {
  await requireProfile();
  const supabase = await createClient();

  const { data: shipment } = await supabase
    .from("shipments")
    .select("id, created_by")
    .eq("id", shipmentId)
    .single();

  if (!shipment) return { error: "Not found", data: [] };

  const { data, error } = await supabase
    .from("shipment_locations")
    .select("*")
    .eq("shipment_id", shipmentId)
    .order("recorded_at", { ascending: true })
    .limit(limit);

  if (error) return { error: error.message, data: [] };
  return { data: data ?? [] };
}
