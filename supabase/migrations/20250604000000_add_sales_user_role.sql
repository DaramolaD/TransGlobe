-- Step 1 of 2: add sales role enum value
-- Must run in its own transaction before 20250604000001_lead_crm_invoice_proof.sql
-- (PostgreSQL rejects new enum values in the same transaction as policies that use them)

ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'sales';
