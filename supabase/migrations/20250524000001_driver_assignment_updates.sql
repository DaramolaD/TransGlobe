-- Safe to re-run: driver assignment UPDATE policy (also included in initial migration)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'assignments'
  ) THEN
    DROP POLICY IF EXISTS assignments_driver_update ON assignments;
    CREATE POLICY assignments_driver_update ON assignments FOR UPDATE TO authenticated
      USING (driver_id = auth.uid())
      WITH CHECK (driver_id = auth.uid());
  END IF;
END $$;
