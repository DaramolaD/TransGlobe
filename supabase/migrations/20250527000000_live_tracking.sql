-- Phase 1 live tracking: PostGIS + GPS points + Realtime
--
-- BEFORE running this file:
-- 1. Supabase Dashboard → Database → Extensions → enable "postgis"
-- 2. Then run this entire script in the SQL Editor

SET search_path TO public, extensions;

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA extensions;

DO $$
BEGIN
  IF to_regtype('extensions.geography') IS NULL THEN
    RAISE EXCEPTION
      'PostGIS is not enabled. Go to Database → Extensions, enable "postgis", then run this migration again.';
  END IF;
END $$;

ALTER TABLE shipments
  ADD COLUMN IF NOT EXISTS last_latitude DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS last_longitude DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS last_location_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS live_tracking_enabled BOOLEAN NOT NULL DEFAULT true;

CREATE TABLE IF NOT EXISTS shipment_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  shipment_id UUID NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
  driver_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  accuracy_m DOUBLE PRECISION,
  heading DOUBLE PRECISION,
  speed_mps DOUBLE PRECISION,
  recorded_at TIMESTAMPTZ NOT NULL,
  received_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  source TEXT NOT NULL DEFAULT 'driver_gps',
  client_id TEXT,
  is_public BOOLEAN NOT NULL DEFAULT true,
  CONSTRAINT shipment_locations_lat_chk CHECK (latitude >= -90 AND latitude <= 90),
  CONSTRAINT shipment_locations_lng_chk CHECK (longitude >= -180 AND longitude <= 180)
);

CREATE INDEX IF NOT EXISTS idx_shipment_locations_shipment_time
  ON shipment_locations (shipment_id, recorded_at DESC);

CREATE INDEX IF NOT EXISTS idx_shipment_locations_org
  ON shipment_locations (organization_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_shipment_locations_client_dedup
  ON shipment_locations (shipment_id, client_id)
  WHERE client_id IS NOT NULL;

-- PostGIS geography for future geofencing / radius queries
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'shipment_locations'
      AND column_name = 'geom'
  ) THEN
    ALTER TABLE shipment_locations
      ADD COLUMN geom geography(POINT, 4326)
      GENERATED ALWAYS AS (
        st_setsrid(st_makepoint(longitude, latitude), 4326)::geography
      ) STORED;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_shipment_locations_geom
  ON shipment_locations USING GIST (geom);

CREATE OR REPLACE FUNCTION public.sync_shipment_last_location()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE shipments
  SET
    last_latitude = NEW.latitude,
    last_longitude = NEW.longitude,
    last_location_at = NEW.recorded_at,
    updated_at = now()
  WHERE id = NEW.shipment_id
    AND (last_location_at IS NULL OR NEW.recorded_at >= last_location_at);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS shipment_locations_sync_last ON shipment_locations;
CREATE TRIGGER shipment_locations_sync_last
  AFTER INSERT ON shipment_locations
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_shipment_last_location();

ALTER TABLE shipment_locations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS shipment_locations_public_read ON shipment_locations;
CREATE POLICY shipment_locations_public_read ON shipment_locations
  FOR SELECT TO anon, authenticated
  USING (
    is_public = true
    AND recorded_at > now() - INTERVAL '7 days'
    AND EXISTS (
      SELECT 1 FROM shipments s
      WHERE s.id = shipment_locations.shipment_id
        AND s.organization_id = default_organization_id()
        AND s.live_tracking_enabled = true
    )
  );

DROP POLICY IF EXISTS shipment_locations_customer_read ON shipment_locations;
CREATE POLICY shipment_locations_customer_read ON shipment_locations
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM shipments s
      WHERE s.id = shipment_locations.shipment_id
        AND s.created_by = auth.uid()
    )
  );

DROP POLICY IF EXISTS shipment_locations_driver_read ON shipment_locations;
CREATE POLICY shipment_locations_driver_read ON shipment_locations
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM assignments a
      WHERE a.shipment_id = shipment_locations.shipment_id
        AND a.driver_id = auth.uid()
    )
    OR current_user_role() IN ('superadmin', 'admin')
  );

DROP POLICY IF EXISTS shipment_locations_insert ON shipment_locations;
CREATE POLICY shipment_locations_insert ON shipment_locations
  FOR INSERT TO authenticated
  WITH CHECK (
    organization_id = default_organization_id()
    AND (
      current_user_role() IN ('superadmin', 'admin')
      OR EXISTS (
        SELECT 1 FROM assignments a
        WHERE a.shipment_id = shipment_locations.shipment_id
          AND a.driver_id = auth.uid()
          AND a.status IN ('pending', 'accepted', 'in_progress')
      )
    )
  );

ALTER TABLE shipment_locations REPLICA IDENTITY FULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'shipment_locations'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE shipment_locations;
  END IF;
END $$;
