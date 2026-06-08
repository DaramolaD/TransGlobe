import type {
  MapVisibilityMode,
  MapWaypoint,
  MapWaypointKind,
  PublicTrackingPayload,
  TrackingEventRow,
} from "@/lib/types/tracking";

function hasCoords(e: TrackingEventRow): boolean {
  if (e.latitude != null && e.longitude != null) return true;
  if (e.facility?.latitude != null && e.facility?.longitude != null) return true;
  return false;
}

function eventCoords(e: TrackingEventRow): { lat: number; lng: number } | null {
  if (e.latitude != null && e.longitude != null) {
    return { lat: e.latitude, lng: e.longitude };
  }
  if (e.facility) {
    return { lat: e.facility.latitude, lng: e.facility.longitude };
  }
  return null;
}

function eventLabel(e: TrackingEventRow): string {
  if (e.facility?.name) return e.facility.name;
  return e.location ?? e.status.replace(/_/g, " ");
}

export function buildMapWaypoints(
  payload: PublicTrackingPayload,
  currentStatus: string
): MapWaypoint[] {
  const { events, locations, shipment } = payload;
  const mode = shipment.map_visibility_mode ?? "past_and_current";
  const sorted = [...events].sort(
    (a, b) => new Date(a.event_at).getTime() - new Date(b.event_at).getTime()
  );

  const milestoneWaypoints: MapWaypoint[] = [];
  sorted.forEach((e, index) => {
    const coords = eventCoords(e);
    if (!coords) return;

    const isLast = index === sorted.length - 1;
    let kind: MapWaypointKind = "past";
    if (e.is_planned) kind = "planned";
    else if (isLast && e.status === currentStatus) kind = "current";
    else if (isLast) kind = "current";

    milestoneWaypoints.push({
      id: e.id,
      lat: coords.lat,
      lng: coords.lng,
      label: eventLabel(e),
      kind,
      subtitle: e.status.replace(/_/g, " "),
    });
  });

  const gpsWaypoints: MapWaypoint[] = locations.map((l, i) => ({
    id: l.id,
    lat: l.latitude,
    lng: l.longitude,
    label: i === locations.length - 1 ? "Live position" : "Route point",
    kind: "gps" as const,
    subtitle: new Date(l.recorded_at).toLocaleString(),
  }));

  switch (mode) {
    case "live_gps_only":
      return gpsWaypoints;
    case "milestones_only":
      return filterMilestonesByMode(milestoneWaypoints, mode, currentStatus);
    case "full_journey":
      return [...filterMilestonesByMode(milestoneWaypoints, mode, currentStatus), ...gpsWaypoints];
    case "past_and_current":
    default:
      return [
        ...filterMilestonesByMode(milestoneWaypoints, "past_and_current", currentStatus),
        ...gpsWaypoints,
      ];
  }
}

function filterMilestonesByMode(
  waypoints: MapWaypoint[],
  mode: MapVisibilityMode,
  currentStatus: string
): MapWaypoint[] {
  if (mode === "full_journey") return waypoints;
  if (mode === "milestones_only") {
    return waypoints.filter((w) => w.kind !== "planned");
  }
  // past_and_current: hide planned future stops
  return waypoints.filter((w) => w.kind !== "planned");
}

export function routeLineFromWaypoints(
  waypoints: MapWaypoint[],
  options: { showMilestones: boolean; showGps: boolean }
): { lat: number; lng: number }[] {
  const filtered = waypoints.filter((w) => {
    if (w.kind === "gps") return options.showGps;
    return options.showMilestones;
  });
  return filtered.map((w) => ({ lat: w.lat, lng: w.lng }));
}
