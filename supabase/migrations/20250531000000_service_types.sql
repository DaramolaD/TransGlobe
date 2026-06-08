-- Configurable service types (replaces fixed service_type enum for catalog + pricing)

CREATE TABLE service_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  slug TEXT NOT NULL,
  label TEXT NOT NULL,
  description TEXT,
  delivery_hint TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (organization_id, slug)
);

CREATE INDEX idx_service_types_org ON service_types(organization_id);

-- Seed catalog from legacy enum values
INSERT INTO service_types (organization_id, slug, label, delivery_hint, sort_order)
SELECT id, 'air', 'Air Freight', '2-5 days', 10 FROM organizations WHERE slug = 'default'
UNION ALL
SELECT id, 'sea', 'Sea Freight', '15-30 days', 20 FROM organizations WHERE slug = 'default'
UNION ALL
SELECT id, 'road', 'Road Freight', '3-7 days', 30 FROM organizations WHERE slug = 'default'
UNION ALL
SELECT id, 'rail', 'Rail Freight', '5-10 days', 40 FROM organizations WHERE slug = 'default'
UNION ALL
SELECT id, 'express', 'Express', '1-3 days', 50 FROM organizations WHERE slug = 'default'
UNION ALL
SELECT id, 'standard', 'Standard', '5-10 days', 60 FROM organizations WHERE slug = 'default';

-- Store slugs as text (matches service_types.slug)
ALTER TABLE rate_cards
  ALTER COLUMN service_type TYPE TEXT USING service_type::text;

ALTER TABLE quotes
  ALTER COLUMN service_type DROP DEFAULT,
  ALTER COLUMN service_type TYPE TEXT USING service_type::text,
  ALTER COLUMN service_type SET DEFAULT 'air';

ALTER TABLE shipments
  ALTER COLUMN service_type DROP DEFAULT,
  ALTER COLUMN service_type TYPE TEXT USING service_type::text,
  ALTER COLUMN service_type SET DEFAULT 'air';

ALTER TABLE rate_cards
  ADD CONSTRAINT rate_cards_service_type_fkey
  FOREIGN KEY (organization_id, service_type)
  REFERENCES service_types (organization_id, slug)
  ON DELETE RESTRICT;

DROP TYPE IF EXISTS service_type;

ALTER TABLE service_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY service_types_read ON service_types
  FOR SELECT TO anon, authenticated
  USING (organization_id = default_organization_id() AND is_active = true);

CREATE POLICY service_types_staff ON service_types
  FOR ALL TO authenticated
  USING (current_user_role() IN ('superadmin', 'admin'))
  WITH CHECK (organization_id = default_organization_id());
