-- Phase 1b: Driver availability (manual toggle) + admin visibility
-- Safe to re-run if a previous attempt stopped partway through.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typname = 'driver_availability_status'
      AND n.nspname = 'public'
  ) THEN
    CREATE TYPE public.driver_availability_status AS ENUM ('available', 'busy', 'offline');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS driver_availability (
  driver_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  status driver_availability_status NOT NULL DEFAULT 'offline',
  reason TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_driver_availability_org
  ON driver_availability(organization_id);

ALTER TABLE driver_availability ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS driver_availability_staff_select ON driver_availability;
CREATE POLICY driver_availability_staff_select ON driver_availability
  FOR SELECT TO authenticated
  USING (
    organization_id = default_organization_id()
    AND current_user_role() IN ('superadmin', 'admin')
  );

DROP POLICY IF EXISTS driver_availability_driver_select_own ON driver_availability;
CREATE POLICY driver_availability_driver_select_own ON driver_availability
  FOR SELECT TO authenticated
  USING (driver_id = auth.uid());

DROP POLICY IF EXISTS driver_availability_driver_insert_own ON driver_availability;
CREATE POLICY driver_availability_driver_insert_own ON driver_availability
  FOR INSERT TO authenticated
  WITH CHECK (
    organization_id = default_organization_id()
    AND driver_id = auth.uid()
    AND current_user_role() = 'driver'
  );

DROP POLICY IF EXISTS driver_availability_driver_update_own ON driver_availability;
CREATE POLICY driver_availability_driver_update_own ON driver_availability
  FOR UPDATE TO authenticated
  USING (driver_id = auth.uid())
  WITH CHECK (driver_id = auth.uid());

DROP POLICY IF EXISTS driver_availability_staff_update ON driver_availability;
CREATE POLICY driver_availability_staff_update ON driver_availability
  FOR UPDATE TO authenticated
  USING (
    organization_id = default_organization_id()
    AND current_user_role() IN ('superadmin', 'admin')
  )
  WITH CHECK (organization_id = default_organization_id());
