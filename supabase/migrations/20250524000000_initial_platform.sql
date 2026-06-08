-- TransGlobe / SwiftCargo platform schema
-- Single-tenant default org; organization_id on all tables for future multi-tenant

-- Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enums
CREATE TYPE user_role AS ENUM ('superadmin', 'admin', 'driver', 'user');
CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'qualified', 'converted', 'lost');
CREATE TYPE quote_status AS ENUM ('draft', 'sent', 'approved', 'rejected', 'expired', 'converted');
CREATE TYPE shipment_status AS ENUM (
  'draft', 'quote_pending', 'booked', 'pickup_scheduled', 'picked_up',
  'at_origin_hub', 'in_transit', 'customs', 'at_destination_hub',
  'out_for_delivery', 'delivered', 'exception', 'cancelled', 'returned'
);
CREATE TYPE pickup_status AS ENUM ('pending', 'scheduled', 'assigned', 'completed', 'cancelled');
CREATE TYPE assignment_status AS ENUM ('pending', 'accepted', 'in_progress', 'completed', 'failed');
CREATE TYPE invoice_status AS ENUM ('draft', 'sent', 'paid', 'overdue', 'cancelled');
CREATE TYPE claim_status AS ENUM ('open', 'investigating', 'resolved', 'rejected');
CREATE TYPE cms_post_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE notification_channel AS ENUM ('email', 'sms', 'in_app');
CREATE TYPE service_type AS ENUM ('air', 'sea', 'road', 'rail', 'express', 'standard');

-- Organizations (single default tenant; extensible)
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  logo_url TEXT,
  settings JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO organizations (slug, name) VALUES ('default', 'SwiftCargo');

-- Profiles (linked to auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  role user_role NOT NULL DEFAULT 'user',
  full_name TEXT,
  phone TEXT,
  email TEXT,
  avatar_url TEXT,
  company_name TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_profiles_org ON profiles(organization_id);
CREATE INDEX idx_profiles_role ON profiles(role);

-- Leads (contact form)
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  service_interest TEXT,
  message TEXT,
  status lead_status NOT NULL DEFAULT 'new',
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  source TEXT DEFAULT 'website',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Quotes (estimator)
CREATE TABLE quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  weight_kg NUMERIC(10,2),
  dimensions TEXT,
  service_type service_type NOT NULL DEFAULT 'air',
  package_type TEXT DEFAULT 'general',
  insurance BOOLEAN DEFAULT false,
  express BOOLEAN DEFAULT false,
  base_price NUMERIC(12,2),
  total_price NUMERIC(12,2),
  currency TEXT NOT NULL DEFAULT 'USD',
  status quote_status NOT NULL DEFAULT 'draft',
  valid_until DATE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Addresses
CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  label TEXT,
  contact_name TEXT,
  phone TEXT,
  email TEXT,
  line1 TEXT NOT NULL,
  line2 TEXT,
  city TEXT NOT NULL,
  state TEXT,
  postal_code TEXT,
  country TEXT NOT NULL DEFAULT 'US',
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Shipments
CREATE TABLE shipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  quote_id UUID REFERENCES quotes(id) ON DELETE SET NULL,
  tracking_number TEXT NOT NULL UNIQUE,
  status shipment_status NOT NULL DEFAULT 'draft',
  service_type service_type NOT NULL DEFAULT 'air',
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  current_location TEXT,
  estimated_delivery DATE,
  actual_delivery TIMESTAMPTZ,
  weight_kg NUMERIC(10,2),
  package_count INT DEFAULT 1,
  special_instructions TEXT,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_shipments_org ON shipments(organization_id);
CREATE INDEX idx_shipments_tracking ON shipments(tracking_number);
CREATE INDEX idx_shipments_status ON shipments(status);
CREATE INDEX idx_shipments_created_by ON shipments(created_by);

-- Packages (line items per shipment)
CREATE TABLE packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
  description TEXT,
  weight_kg NUMERIC(10,2),
  dimensions TEXT,
  quantity INT DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Pickup requests
CREATE TABLE pickup_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  shipment_id UUID REFERENCES shipments(id) ON DELETE SET NULL,
  status pickup_status NOT NULL DEFAULT 'pending',
  pickup_type TEXT DEFAULT 'package',
  pickup_date DATE NOT NULL,
  pickup_time TEXT,
  pickup_address TEXT NOT NULL,
  pickup_city TEXT NOT NULL,
  pickup_state TEXT,
  pickup_zip TEXT,
  pickup_country TEXT DEFAULT 'US',
  contact_name TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  package_count INT DEFAULT 1,
  package_weight TEXT,
  package_dimensions TEXT,
  service_type TEXT DEFAULT 'standard',
  special_instructions TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Driver assignments
CREATE TABLE assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  shipment_id UUID NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
  driver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  status assignment_status NOT NULL DEFAULT 'pending',
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  notes TEXT,
  UNIQUE (shipment_id, driver_id)
);

-- Tracking events
CREATE TABLE tracking_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  location TEXT,
  description TEXT,
  event_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  is_public BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_tracking_events_shipment ON tracking_events(shipment_id);

-- Documents
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  shipment_id UUID REFERENCES shipments(id) ON DELETE CASCADE,
  uploaded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT,
  doc_type TEXT DEFAULT 'other',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Invoices
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  shipment_id UUID REFERENCES shipments(id) ON DELETE SET NULL,
  customer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  invoice_number TEXT NOT NULL UNIQUE,
  amount NUMERIC(12,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status invoice_status NOT NULL DEFAULT 'draft',
  due_date DATE,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Claims
CREATE TABLE claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  shipment_id UUID NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  claim_type TEXT NOT NULL,
  description TEXT NOT NULL,
  status claim_status NOT NULL DEFAULT 'open',
  resolution_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT,
  channel notification_channel NOT NULL DEFAULT 'in_app',
  read_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Audit logs
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  payload JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- CMS
CREATE TABLE cms_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  UNIQUE (organization_id, slug)
);

CREATE TABLE cms_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  category_id UUID REFERENCES cms_categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL DEFAULT '',
  cover_image_url TEXT,
  status cms_post_status NOT NULL DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  read_time_minutes INT DEFAULT 5,
  views_count INT DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (organization_id, slug)
);

CREATE INDEX idx_cms_posts_status ON cms_posts(status);

-- Rate cards (pricing engine placeholder)
CREATE TABLE rate_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  service_type service_type NOT NULL,
  price_per_kg NUMERIC(10,2) NOT NULL,
  min_charge NUMERIC(10,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO rate_cards (organization_id, name, service_type, price_per_kg)
SELECT id, 'Air Standard', 'air'::service_type, 15 FROM organizations WHERE slug = 'default'
UNION ALL
SELECT id, 'Sea Standard', 'sea'::service_type, 3 FROM organizations WHERE slug = 'default'
UNION ALL
SELECT id, 'Road Standard', 'road'::service_type, 8 FROM organizations WHERE slug = 'default'
UNION ALL
SELECT id, 'Rail Standard', 'rail'::service_type, 5 FROM organizations WHERE slug = 'default';

-- CMS seed categories
INSERT INTO cms_categories (organization_id, name, slug)
SELECT id, 'Technology', 'technology' FROM organizations WHERE slug = 'default'
UNION ALL
SELECT id, 'Sustainability', 'sustainability' FROM organizations WHERE slug = 'default';

-- Helper: default org id
CREATE OR REPLACE FUNCTION public.default_organization_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM organizations WHERE slug = 'default' LIMIT 1;
$$;

-- Helper: current user profile
CREATE OR REPLACE FUNCTION public.current_profile()
RETURNS profiles
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM profiles WHERE id = auth.uid() LIMIT 1;
$$;

-- Helper: current user role
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM profiles WHERE id = auth.uid() LIMIT 1;
$$;

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  org_id UUID;
  user_role_val user_role;
BEGIN
  org_id := default_organization_id();
  user_role_val := COALESCE(
    (NEW.raw_app_meta_data->>'role')::user_role,
    'user'::user_role
  );
  INSERT INTO profiles (id, organization_id, role, full_name, email)
  VALUES (
    NEW.id,
    org_id,
    user_role_val,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Generate tracking number
CREATE OR REPLACE FUNCTION public.generate_tracking_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN 'SC' || to_char(now(), 'YYMMDD') || upper(substr(encode(gen_random_bytes(4), 'hex'), 1, 8));
END;
$$;

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER leads_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER quotes_updated_at BEFORE UPDATE ON quotes FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER shipments_updated_at BEFORE UPDATE ON shipments FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER pickup_requests_updated_at BEFORE UPDATE ON pickup_requests FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER invoices_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER claims_updated_at BEFORE UPDATE ON claims FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER cms_posts_updated_at BEFORE UPDATE ON cms_posts FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- RLS
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE pickup_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracking_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_cards ENABLE ROW LEVEL SECURITY;

-- Organizations: staff read default org
CREATE POLICY org_select ON organizations FOR SELECT TO authenticated
  USING (
    id = default_organization_id()
    AND current_user_role() IN ('superadmin', 'admin', 'driver', 'user')
  );

-- Profiles
CREATE POLICY profiles_select_own ON profiles FOR SELECT TO authenticated
  USING (id = auth.uid() OR current_user_role() IN ('superadmin', 'admin'));

CREATE POLICY profiles_select_org ON profiles FOR SELECT TO authenticated
  USING (
    organization_id = default_organization_id()
    AND current_user_role() IN ('superadmin', 'admin')
  );

CREATE POLICY profiles_update_own ON profiles FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY profiles_admin_update ON profiles FOR UPDATE TO authenticated
  USING (current_user_role() IN ('superadmin', 'admin'))
  WITH CHECK (organization_id = default_organization_id());

-- Public insert for leads (anonymous)
CREATE POLICY leads_public_insert ON leads FOR INSERT TO anon, authenticated
  WITH CHECK (organization_id = default_organization_id());

CREATE POLICY leads_staff_all ON leads FOR ALL TO authenticated
  USING (
    organization_id = default_organization_id()
    AND current_user_role() IN ('superadmin', 'admin')
  )
  WITH CHECK (organization_id = default_organization_id());

-- Quotes: users own; staff all
CREATE POLICY quotes_insert ON quotes FOR INSERT TO anon, authenticated
  WITH CHECK (organization_id = default_organization_id());

CREATE POLICY quotes_select ON quotes FOR SELECT TO authenticated
  USING (
    organization_id = default_organization_id()
    AND (
      created_by = auth.uid()
      OR current_user_role() IN ('superadmin', 'admin')
    )
  );

CREATE POLICY quotes_staff_write ON quotes FOR ALL TO authenticated
  USING (
    organization_id = default_organization_id()
    AND current_user_role() IN ('superadmin', 'admin')
  )
  WITH CHECK (organization_id = default_organization_id());

-- Pickup public insert
CREATE POLICY pickup_public_insert ON pickup_requests FOR INSERT TO anon, authenticated
  WITH CHECK (organization_id = default_organization_id());

CREATE POLICY pickup_select ON pickup_requests FOR SELECT TO authenticated
  USING (
    organization_id = default_organization_id()
    AND (
      created_by = auth.uid()
      OR current_user_role() IN ('superadmin', 'admin', 'driver')
    )
  );

CREATE POLICY pickup_staff ON pickup_requests FOR ALL TO authenticated
  USING (
    organization_id = default_organization_id()
    AND current_user_role() IN ('superadmin', 'admin')
  )
  WITH CHECK (organization_id = default_organization_id());

-- Shipments
CREATE POLICY shipments_public_track ON shipments FOR SELECT TO anon
  USING (organization_id = default_organization_id());

CREATE POLICY shipments_user_select ON shipments FOR SELECT TO authenticated
  USING (
    organization_id = default_organization_id()
    AND (
      created_by = auth.uid()
      OR current_user_role() IN ('superadmin', 'admin', 'driver')
      OR EXISTS (
        SELECT 1 FROM assignments a
        WHERE a.shipment_id = shipments.id AND a.driver_id = auth.uid()
      )
    )
  );

CREATE POLICY shipments_user_insert ON shipments FOR INSERT TO authenticated
  WITH CHECK (
    organization_id = default_organization_id()
    AND (created_by = auth.uid() OR current_user_role() IN ('superadmin', 'admin'))
  );

CREATE POLICY shipments_staff_write ON shipments FOR ALL TO authenticated
  USING (
    organization_id = default_organization_id()
    AND current_user_role() IN ('superadmin', 'admin')
  )
  WITH CHECK (organization_id = default_organization_id());

-- Tracking events: public read for public events
CREATE POLICY tracking_public ON tracking_events FOR SELECT TO anon, authenticated
  USING (
    is_public = true
    AND EXISTS (
      SELECT 1 FROM shipments s
      WHERE s.id = tracking_events.shipment_id
      AND s.organization_id = default_organization_id()
    )
  );

CREATE POLICY tracking_staff_write ON tracking_events FOR ALL TO authenticated
  USING (current_user_role() IN ('superadmin', 'admin', 'driver'))
  WITH CHECK (true);

-- Assignments
CREATE POLICY assignments_driver ON assignments FOR SELECT TO authenticated
  USING (
    driver_id = auth.uid()
    OR current_user_role() IN ('superadmin', 'admin')
  );

CREATE POLICY assignments_staff ON assignments FOR ALL TO authenticated
  USING (current_user_role() IN ('superadmin', 'admin'))
  WITH CHECK (current_user_role() IN ('superadmin', 'admin'));

CREATE POLICY assignments_driver_update ON assignments FOR UPDATE TO authenticated
  USING (driver_id = auth.uid())
  WITH CHECK (driver_id = auth.uid());

-- CMS: public read published
CREATE POLICY cms_posts_public ON cms_posts FOR SELECT TO anon, authenticated
  USING (status = 'published' AND organization_id = default_organization_id());

CREATE POLICY cms_posts_staff ON cms_posts FOR ALL TO authenticated
  USING (
    organization_id = default_organization_id()
    AND current_user_role() IN ('superadmin', 'admin')
  )
  WITH CHECK (
    organization_id = default_organization_id()
    AND current_user_role() IN ('superadmin', 'admin')
  );

CREATE POLICY cms_categories_public ON cms_categories FOR SELECT TO anon, authenticated
  USING (organization_id = default_organization_id());

CREATE POLICY cms_categories_staff ON cms_categories FOR ALL TO authenticated
  USING (current_user_role() IN ('superadmin', 'admin'))
  WITH CHECK (organization_id = default_organization_id());

-- Notifications: own only
CREATE POLICY notifications_own ON notifications FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Invoices
CREATE POLICY invoices_customer ON invoices FOR SELECT TO authenticated
  USING (
    customer_id = auth.uid()
    OR current_user_role() IN ('superadmin', 'admin')
  );

CREATE POLICY invoices_staff ON invoices FOR ALL TO authenticated
  USING (current_user_role() IN ('superadmin', 'admin'))
  WITH CHECK (current_user_role() IN ('superadmin', 'admin'));

-- Claims
CREATE POLICY claims_user ON claims FOR ALL TO authenticated
  USING (
    created_by = auth.uid()
    OR current_user_role() IN ('superadmin', 'admin')
  )
  WITH CHECK (organization_id = default_organization_id());

-- Addresses
CREATE POLICY addresses_own ON addresses FOR ALL TO authenticated
  USING (profile_id = auth.uid() OR current_user_role() IN ('superadmin', 'admin'))
  WITH CHECK (profile_id = auth.uid() OR current_user_role() IN ('superadmin', 'admin'));

-- Rate cards: public read for estimator
CREATE POLICY rate_cards_read ON rate_cards FOR SELECT TO anon, authenticated
  USING (organization_id = default_organization_id() AND is_active = true);

CREATE POLICY rate_cards_staff ON rate_cards FOR ALL TO authenticated
  USING (current_user_role() IN ('superadmin', 'admin'))
  WITH CHECK (organization_id = default_organization_id());

-- Packages (via shipment access)
CREATE POLICY packages_select ON packages FOR SELECT TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM shipments s WHERE s.id = packages.shipment_id));

CREATE POLICY packages_staff ON packages FOR ALL TO authenticated
  USING (current_user_role() IN ('superadmin', 'admin'))
  WITH CHECK (true);

-- Documents
CREATE POLICY documents_access ON documents FOR ALL TO authenticated
  USING (
    uploaded_by = auth.uid()
    OR current_user_role() IN ('superadmin', 'admin', 'driver')
  );

-- Audit logs: staff only
CREATE POLICY audit_staff ON audit_logs FOR SELECT TO authenticated
  USING (current_user_role() IN ('superadmin', 'admin'));

CREATE POLICY audit_insert ON audit_logs FOR INSERT TO authenticated
  WITH CHECK (actor_id = auth.uid());

-- Storage bucket for documents (run in dashboard or separate migration)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false);
