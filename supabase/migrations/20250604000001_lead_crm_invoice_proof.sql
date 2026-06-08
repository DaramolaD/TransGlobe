-- Step 2 of 2: Lead CRM columns, invoice payment proof, RLS for sales
-- Requires 20250604000000_add_sales_user_role.sql to be applied first.

ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'sales'
    CHECK (category IN ('sales', 'content', 'marketing')),
  ADD COLUMN IF NOT EXISTS last_contacted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS lost_reason TEXT;

ALTER TABLE invoices
  ADD COLUMN IF NOT EXISTS payment_proof_url TEXT,
  ADD COLUMN IF NOT EXISTS payment_proof_public_id TEXT,
  ADD COLUMN IF NOT EXISTS payment_proof_uploaded_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS payment_submitted_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_category ON leads(category);
CREATE INDEX IF NOT EXISTS idx_leads_assigned_to ON leads(assigned_to) WHERE assigned_to IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);

DROP POLICY IF EXISTS leads_staff_all ON leads;
DROP POLICY IF EXISTS leads_admin_all ON leads;
DROP POLICY IF EXISTS leads_sales_select ON leads;
DROP POLICY IF EXISTS leads_sales_update ON leads;
DROP POLICY IF EXISTS audit_sales_leads ON audit_logs;

CREATE POLICY leads_admin_all ON leads FOR ALL TO authenticated
  USING (
    organization_id = (SELECT id FROM organizations WHERE slug = 'default')
    AND current_user_role() IN ('superadmin', 'admin')
  )
  WITH CHECK (
    organization_id = (SELECT id FROM organizations WHERE slug = 'default')
    AND current_user_role() IN ('superadmin', 'admin')
  );

CREATE POLICY leads_sales_select ON leads FOR SELECT TO authenticated
  USING (
    organization_id = (SELECT id FROM organizations WHERE slug = 'default')
    AND current_user_role() = 'sales'
    AND assigned_to = auth.uid()
  );

CREATE POLICY leads_sales_update ON leads FOR UPDATE TO authenticated
  USING (
    organization_id = (SELECT id FROM organizations WHERE slug = 'default')
    AND current_user_role() = 'sales'
    AND assigned_to = auth.uid()
  )
  WITH CHECK (
    organization_id = (SELECT id FROM organizations WHERE slug = 'default')
    AND current_user_role() = 'sales'
    AND assigned_to = auth.uid()
  );

CREATE POLICY audit_sales_leads ON audit_logs FOR SELECT TO authenticated
  USING (
    current_user_role() = 'sales'
    AND entity_type = 'lead'
    AND entity_id IN (SELECT id FROM leads WHERE assigned_to = auth.uid())
  );
