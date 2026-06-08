"use server";

import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth/session";
import { isStaff } from "@/lib/auth/roles";
import { formatTrackingNumber } from "@/lib/tracking/tracking-number";
import type { PublicTrackingPayload } from "@/lib/types/tracking";
import {
  buildTrackingPayload,
  TRACKING_EVENT_SELECT,
  shipmentTrackingSelect,
} from "@/lib/tracking/queries";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function resolveShipmentIdByQuery(
  query: string
): Promise<{ id: string | null; error?: string }> {
  const me = await requireProfile();
  if (!isStaff(me.role)) {
    return { id: null, error: "Forbidden" };
  }

  const trimmed = query.trim();
  if (!trimmed) {
    return { id: null, error: "Enter a tracking number or shipment ID" };
  }

  const supabase = await createClient();

  if (UUID_RE.test(trimmed)) {
    const { data, error } = await supabase
      .from("shipments")
      .select("id")
      .eq("id", trimmed)
      .maybeSingle();
    if (error) return { id: null, error: error.message };
    if (data) return { id: data.id };
    return { id: null, error: "No shipment found for that ID" };
  }

  const normalized = formatTrackingNumber(trimmed);
  const { data, error } = await supabase
    .from("shipments")
    .select("id")
    .ilike("tracking_number", normalized)
    .maybeSingle();

  if (error) return { id: null, error: error.message };
  if (data) return { id: data.id };
  return { id: null, error: "No shipment found for that tracking number" };
}

export async function getDashboardTracking(
  shipmentId: string
): Promise<{ data: PublicTrackingPayload | null; error?: string }> {
  const me = await requireProfile();
  if (!isStaff(me.role)) {
    return { data: null, error: "Forbidden" };
  }

  const supabase = await createClient();

  const { data: shipment, error } = await supabase
    .from("shipments")
    .select(shipmentTrackingSelect())
    .eq("id", shipmentId)
    .single();

  if (error || !shipment) {
    return { data: null, error: error?.message ?? "Shipment not found" };
  }

  const row = shipment as unknown as Record<string, unknown>;

  const [{ data: events }, { data: locations }, { data: facilities }] =
    await Promise.all([
      supabase
        .from("tracking_events")
        .select(TRACKING_EVENT_SELECT)
        .eq("shipment_id", shipmentId)
        .order("event_at", { ascending: true }),
      supabase
        .from("shipment_locations")
        .select("*")
        .eq("shipment_id", shipmentId)
        .order("recorded_at", { ascending: true })
        .limit(500),
      supabase
        .from("facility_locations")
        .select("*")
        .order("name"),
    ]);

  return {
    data: buildTrackingPayload(
      row,
      (events ?? []) as Record<string, unknown>[],
      (locations ?? []).map((l) => ({
        ...l,
        client_id: l.client_id ?? "",
      })),
      facilities ?? []
    ),
  };
}
