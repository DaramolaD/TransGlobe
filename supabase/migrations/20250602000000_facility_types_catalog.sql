-- Configurable facility types (warehouse, hub, etc.) — replaces facility_type enum

CREATE TABLE facility_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  slug TEXT NOT NULL,
  label TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (organization_id, slug)
);

CREATE INDEX idx_facility_types_org ON facility_types(organization_id);

INSERT INTO facility_types (organization_id, slug, label, sort_order)
SELECT id, 'warehouse', 'Warehouse', 10 FROM organizations WHERE slug = 'default'
UNION ALL
SELECT id, 'hub', 'Hub', 20 FROM organizations WHERE slug = 'default'
UNION ALL
SELECT id, 'port', 'Port', 30 FROM organizations WHERE slug = 'default'
UNION ALL
SELECT id, 'customs', 'Customs', 40 FROM organizations WHERE slug = 'default'
UNION ALL
SELECT id, 'depot', 'Depot', 50 FROM organizations WHERE slug = 'default'
UNION ALL
SELECT id, 'other', 'Other', 60 FROM organizations WHERE slug = 'default';

-- facility_locations must exist (from 20250601000000_tracking_facilities.sql)
ALTER TABLE facility_locations
  ALTER COLUMN facility_type DROP DEFAULT,
  ALTER COLUMN facility_type TYPE TEXT USING facility_type::text,
  ALTER COLUMN facility_type SET DEFAULT 'hub';

ALTER TABLE facility_locations
  ADD CONSTRAINT facility_locations_type_fkey
  FOREIGN KEY (organization_id, facility_type)
  REFERENCES facility_types (organization_id, slug)
  ON DELETE RESTRICT;

DROP TYPE IF EXISTS facility_type;

ALTER TABLE facility_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY facility_types_read ON facility_types
  FOR SELECT TO anon, authenticated
  USING (organization_id = default_organization_id() AND is_active = true);

CREATE POLICY facility_types_staff ON facility_types
  FOR ALL TO authenticated
  USING (current_user_role() IN ('superadmin', 'admin'))
  WITH CHECK (organization_id = default_organization_id());
