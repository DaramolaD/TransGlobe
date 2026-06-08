-- Superadmin can update default organization (name, logo, settings JSONB)

CREATE POLICY org_superadmin_update ON organizations
  FOR UPDATE TO authenticated
  USING (
    id = default_organization_id()
    AND current_user_role() = 'superadmin'
  )
  WITH CHECK (
    id = default_organization_id()
    AND current_user_role() = 'superadmin'
  );
