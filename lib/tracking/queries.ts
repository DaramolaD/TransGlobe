import type { PublicTrackingPayload, TrackingEventRow } from "@/lib/types/tracking";

const EVENT_SELECT = `
  id,
  status,
  location,
  description,
  event_at,
  latitude,
  longitude,
  is_planned,
  is_public,
  facility_location_id,
  facility_locations (
    id,
    name,
    facility_type,
    city,
    latitude,
    longitude
  )
`;

export function normalizeTrackingEvent(raw: Record<string, unknown>): TrackingEventRow {
  const facilityRaw = raw.facility_locations as TrackingEventRow["facility"] | null;
  const facility = Array.isArray(facilityRaw) ? facilityRaw[0] ?? null : facilityRaw;
  return {
    id: raw.id as string,
    status: raw.status as string,
    location: (raw.location as string) ?? null,
    description: (raw.description as string) ?? null,
    event_at: raw.event_at as string,
    latitude: (raw.latitude as number) ?? facility?.latitude ?? null,
    longitude: (raw.longitude as number) ?? facility?.longitude ?? null,
    is_planned: Boolean(raw.is_planned),
    is_public: raw.is_public as boolean | undefined,
    facility_location_id: (raw.facility_location_id as string) ?? null,
    facility: facility ?? null,
  };
}

export const TRACKING_EVENT_SELECT = EVENT_SELECT;

export function shipmentTrackingSelect(extra = "") {
  return `
      id,
      tracking_number,
      status,
      service_type,
      origin,
      destination,
      estimated_delivery,
      current_location,
      last_latitude,
      last_longitude,
      last_location_at,
      live_tracking_enabled,
      map_visibility_mode
      ${extra}
    `;
}

function driverFirstNameFromEmbed(raw: unknown): string | null {
  const row = Array.isArray(raw) ? raw[0] : raw;
  if (!row || typeof row !== "object") return null;
  const name = (row as { full_name?: string | null }).full_name?.trim();
  if (!name) return null;
  return name.split(/\s+/)[0] ?? null;
}

export function buildTrackingPayload(
  shipment: Record<string, unknown>,
  events: Record<string, unknown>[],
  locations: PublicTrackingPayload["locations"],
  facilities: PublicTrackingPayload["facilities"] = [],
  options?: { showDriverName?: boolean }
): PublicTrackingPayload {
  const driverFirstName =
    options?.showDriverName
      ? driverFirstNameFromEmbed(shipment.active_driver)
      : null;

  return {
    shipment: {
      id: shipment.id as string,
      tracking_number: shipment.tracking_number as string,
      status: shipment.status as string,
      service_type: shipment.service_type as string,
      origin: shipment.origin as string,
      destination: shipment.destination as string,
      estimated_delivery: (shipment.estimated_delivery as string) ?? null,
      current_location: (shipment.current_location as string) ?? null,
      last_latitude: (shipment.last_latitude as number) ?? null,
      last_longitude: (shipment.last_longitude as number) ?? null,
      last_location_at: (shipment.last_location_at as string) ?? null,
      live_tracking_enabled: (shipment.live_tracking_enabled as boolean) ?? true,
      map_visibility_mode:
        (shipment.map_visibility_mode as PublicTrackingPayload["shipment"]["map_visibility_mode"]) ??
        "past_and_current",
      driver_first_name: driverFirstName,
    },
    events: events.map((e) => normalizeTrackingEvent(e)),
    locations,
    facilities,
  };
}
