-- Warehouses / hubs with map coordinates + richer tracking events

CREATE TYPE facility_type AS ENUM (
  'warehouse',
  'hub',
  'port',
  'customs',
  'depot',
  'other'
);

CREATE TYPE map_visibility_mode AS ENUM (
  'past_and_current',
  'full_journey',
  'milestones_only',
  'live_gps_only'
);

CREATE TABLE facility_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  facility_type facility_type NOT NULL DEFAULT 'hub'::facility_type,
  address_line TEXT,
  city TEXT,
  state TEXT,
  country TEXT DEFAULT 'US',
  postal_code TEXT,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT facility_lat_chk CHECK (latitude >= -90 AND latitude <= 90),
  CONSTRAINT facility_lng_chk CHECK (longitude >= -180 AND longitude <= 180)
);

CREATE INDEX idx_facility_locations_org ON facility_locations(organization_id);

ALTER TABLE shipments
  ADD COLUMN IF NOT EXISTS map_visibility_mode map_visibility_mode NOT NULL DEFAULT 'past_and_current'::map_visibility_mode;

ALTER TABLE tracking_events
  ADD COLUMN IF NOT EXISTS facility_location_id UUID REFERENCES facility_locations(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS is_planned BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX idx_tracking_events_facility ON tracking_events(facility_location_id);

-- Default facilities for demo org
INSERT INTO facility_locations (
  organization_id, name, facility_type, city, state, country, latitude, longitude
)
SELECT id, 'Origin warehouse', 'warehouse'::facility_type, 'Sioux Falls', 'SD', 'US', 43.5446, -96.7311
FROM organizations WHERE slug = 'default'
UNION ALL
SELECT id, 'Regional hub', 'hub'::facility_type, 'Chicago', 'IL', 'US', 41.8781, -87.6298
FROM organizations WHERE slug = 'default'
UNION ALL
SELECT id, 'Destination hub', 'hub'::facility_type, 'New York', 'NY', 'US', 40.7128, -74.0060
FROM organizations WHERE slug = 'default';

ALTER TABLE facility_locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY facility_locations_read ON facility_locations
  FOR SELECT TO anon, authenticated
  USING (organization_id = default_organization_id() AND is_active = true);

CREATE POLICY facility_locations_staff ON facility_locations
  FOR ALL TO authenticated
  USING (current_user_role() IN ('superadmin', 'admin'))
  WITH CHECK (organization_id = default_organization_id());
