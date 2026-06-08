-- =============================================================================
-- SwiftCargo — Dev test users (profiles + roles)
-- =============================================================================
--
-- PASSWORDS CANNOT BE SET IN SQL on Supabase Cloud.
-- One-time (2 min): Dashboard → Authentication → Users → Add user
--   • superadmin@swiftcargo.com  + password + Auto Confirm ✓
--   • admin@swiftcargo.com       + password + Auto Confirm ✓
--   • sales@swiftcargo.com       + password + Auto Confirm ✓
--   • driver@swiftcargo.com      + password + Auto Confirm ✓
--   • customer@swiftcargo.com    + password + Auto Confirm ✓  (optional)
--
-- Prerequisite: run migration 20250604000000_add_sales_user_role.sql first
-- (adds `sales` to user_role enum).
--
-- Then paste THIS ENTIRE FILE in SQL Editor → Run.
-- Login at http://localhost:3000/login with those emails/passwords.
-- =============================================================================

-- Needs initial migration (organizations + profiles table + backfill function)
SELECT public.backfill_missing_profiles();

-- Branding for dashboards (internal slug stays "default")
UPDATE organizations
SET
  name = 'SwiftCargo International',
  settings = jsonb_build_object(
    'region', 'Americas · Europe · Africa',
    'support_email', 'ops@swiftcargo.com',
    'headquarters', 'Lagos · New York · London hubs'
  )
WHERE slug = 'default';

UPDATE profiles
SET
  role = 'superadmin',
  is_active = true,
  full_name = COALESCE(full_name, 'Super Admin')
WHERE email = 'superadmin@swiftcargo.com';

UPDATE profiles
SET
  role = 'admin',
  is_active = true,
  full_name = COALESCE(full_name, 'Operations Admin')
WHERE email = 'admin@swiftcargo.com';

UPDATE profiles
SET
  role = 'sales',
  is_active = true,
  full_name = COALESCE(full_name, 'Sales Rep')
WHERE email = 'sales@swiftcargo.com';

UPDATE profiles
SET
  role = 'driver',
  is_active = true,
  full_name = COALESCE(full_name, 'Field Driver')
WHERE email = 'driver@swiftcargo.com';

-- Optional customer portal account
UPDATE profiles
SET
  role = 'user',
  is_active = true,
  full_name = COALESCE(full_name, 'Test Customer')
WHERE email = 'customer@swiftcargo.com';

-- Verify
SELECT email, role, is_active, full_name
FROM profiles
WHERE email IN (
  'superadmin@swiftcargo.com',
  'admin@swiftcargo.com',
  'sales@swiftcargo.com',
  'driver@swiftcargo.com',
  'customer@swiftcargo.com'
)
ORDER BY role;
