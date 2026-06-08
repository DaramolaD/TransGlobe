import { createClient } from "@/lib/supabase/server";
import { getPlatformSettings } from "@/lib/organization/platform-settings";
import type { PublicTrackingPayload } from "@/lib/types/tracking";
import {
  buildTrackingPayload,
  TRACKING_EVENT_SELECT,
  shipmentTrackingSelect,
} from "@/lib/tracking/queries";

export async function getPublicTracking(
  trackingNumber: string
): Promise<{ data: PublicTrackingPayload | null; error?: string }> {
  const platform = await getPlatformSettings();
  if (!platform.public_tracking_enabled) {
    return { data: null, error: "Public tracking is disabled for this operator" };
  }

  const supabase = await createClient();

  const { data: shipment, error } = await supabase
    .from("shipments")
    .select(
      shipmentTrackingSelect(
        platform.show_driver_name_public
          ? `,
      assignments (
        status,
        driver:profiles!assignments_driver_id_fkey ( full_name )
      )`
          : ""
      )
    )
    .ilike("tracking_number", trackingNumber.trim())
    .maybeSingle();

  if (error) return { data: null, error: error.message };
  if (!shipment) return { data: null, error: "Shipment not found" };

  const row = shipment as unknown as Record<string, unknown>;
  const shipmentId = row.id as string;

  if (platform.show_driver_name_public) {
    const assignments = row.assignments as
      | { status: string; driver?: { full_name?: string | null } | null }[]
      | { status: string; driver?: { full_name?: string | null } | null }
      | null;
    const list = Array.isArray(assignments)
      ? assignments
      : assignments
        ? [assignments]
        : [];
    const active = list.find((a) =>
      ["accepted", "in_progress", "pending"].includes(a.status)
    );
    row.active_driver = active?.driver ?? null;
  }

  const [{ data: events }, { data: locations }, { data: facilities }] =
    await Promise.all([
      supabase
        .from("tracking_events")
        .select(TRACKING_EVENT_SELECT)
        .eq("shipment_id", shipmentId)
        .eq("is_public", true)
        .order("event_at", { ascending: true }),
      supabase
        .from("shipment_locations")
        .select("*")
        .eq("shipment_id", shipmentId)
        .eq("is_public", true)
        .order("recorded_at", { ascending: true })
        .limit(200),
      supabase
        .from("facility_locations")
        .select("*")
        .eq("is_active", true)
        .order("name"),
    ]);

  const locRows = (locations ?? []).map((l) => ({
    id: l.id,
    shipment_id: l.shipment_id,
    driver_id: l.driver_id,
    latitude: l.latitude,
    longitude: l.longitude,
    accuracy_m: l.accuracy_m,
    heading: l.heading,
    speed_mps: l.speed_mps,
    recorded_at: l.recorded_at,
    received_at: l.received_at,
    source: l.source,
    client_id: l.client_id ?? "",
  }));

  return {
    data: buildTrackingPayload(
      row,
      (events ?? []) as Record<string, unknown>[],
      locRows,
      facilities ?? [],
      { showDriverName: platform.show_driver_name_public }
    ),
  };
}
