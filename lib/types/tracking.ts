export type MapVisibilityMode =
  | "past_and_current"
  | "full_journey"
  | "milestones_only"
  | "live_gps_only";

/** Slug from `facility_types` catalog (e.g. warehouse, hub, or custom) */
export type FacilityType = string;

export type GpsPoint = {
  latitude: number;
  longitude: number;
  accuracy_m?: number | null;
  heading?: number | null;
  speed_mps?: number | null;
  recorded_at: string;
  client_id: string;
};

export type ShipmentLocationRow = GpsPoint & {
  id: string;
  shipment_id: string;
  driver_id: string | null;
  received_at: string;
  source: string;
};

export type TrackingEventRow = {
  id: string;
  status: string;
  location: string | null;
  description: string | null;
  event_at: string;
  latitude?: number | null;
  longitude?: number | null;
  is_planned?: boolean;
  is_public?: boolean;
  facility_location_id?: string | null;
  facility?: {
    id: string;
    name: string;
    facility_type: string;
    city: string | null;
    latitude: number;
    longitude: number;
  } | null;
};

export type PublicTrackingPayload = {
  shipment: {
    id: string;
    tracking_number: string;
    status: string;
    service_type: string;
    origin: string;
    destination: string;
    estimated_delivery: string | null;
    current_location: string | null;
    last_latitude: number | null;
    last_longitude: number | null;
    last_location_at: string | null;
    live_tracking_enabled: boolean;
    map_visibility_mode: MapVisibilityMode;
    /** First name only when platform setting allows */
    driver_first_name?: string | null;
  };
  events: TrackingEventRow[];
  locations: ShipmentLocationRow[];
  facilities: FacilityLocationRow[];
};

export type FacilityLocationRow = {
  id: string;
  name: string;
  facility_type: FacilityType;
  address_line: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postal_code: string | null;
  latitude: number;
  longitude: number;
  is_active: boolean;
  notes: string | null;
};

export type MapWaypointKind = "past" | "current" | "planned" | "gps";

export type MapWaypoint = {
  id: string;
  lat: number;
  lng: number;
  label: string;
  kind: MapWaypointKind;
  subtitle?: string;
};
