-- Track when ops staff first open a customer claim + support staff inbox badges

ALTER TABLE claims
  ADD COLUMN IF NOT EXISTS staff_viewed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS staff_viewed_by UUID REFERENCES profiles(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_claims_staff_unviewed
  ON claims (created_at DESC)
  WHERE staff_viewed_at IS NULL;

COMMENT ON COLUMN claims.staff_viewed_at IS 'First time admin/superadmin opened the claim';
COMMENT ON COLUMN claims.staff_viewed_by IS 'Staff profile who first viewed the claim';
