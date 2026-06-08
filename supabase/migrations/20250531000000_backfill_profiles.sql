-- Backfill profiles for auth users created before migrations/triggers ran.
-- Safe to run multiple times.

CREATE OR REPLACE FUNCTION public.backfill_missing_profiles()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  org_id UUID;
  inserted_count INTEGER := 0;
BEGIN
  org_id := default_organization_id();
  IF org_id IS NULL THEN
    RAISE EXCEPTION 'Default organization not found. Run initial platform migration first.';
  END IF;

  INSERT INTO profiles (id, organization_id, role, full_name, email, is_active)
  SELECT
    u.id,
    org_id,
    COALESCE((u.raw_app_meta_data->>'role')::user_role, 'user'::user_role),
    COALESCE(u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1)),
    u.email,
    true
  FROM auth.users u
  LEFT JOIN profiles p ON p.id = u.id
  WHERE p.id IS NULL;

  GET DIAGNOSTICS inserted_count = ROW_COUNT;
  RETURN inserted_count;
END;
$$;

-- Run once when applying this migration
SELECT public.backfill_missing_profiles();
