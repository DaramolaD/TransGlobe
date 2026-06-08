-- Invoice billing enhancements

ALTER TABLE invoices
  ADD COLUMN IF NOT EXISTS notes TEXT,
  ADD COLUMN IF NOT EXISTS payment_reference TEXT,
  ADD COLUMN IF NOT EXISTS sent_at TIMESTAMPTZ;

CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN 'INV-' || to_char(now(), 'YYMMDD') || '-' || upper(substr(encode(gen_random_bytes(4), 'hex'), 1, 8));
END;
$$;

-- Prevent duplicate active invoices per shipment
CREATE UNIQUE INDEX IF NOT EXISTS idx_invoices_one_active_per_shipment
  ON invoices (shipment_id)
  WHERE shipment_id IS NOT NULL AND status NOT IN ('cancelled');

-- Auto-create draft invoice when shipment is delivered (any role)
CREATE OR REPLACE FUNCTION public.auto_invoice_on_delivered()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  inv_num TEXT;
  amt NUMERIC(12,2);
  cur TEXT := 'USD';
BEGIN
  IF NEW.status = 'delivered'
    AND (OLD.status IS DISTINCT FROM NEW.status)
    AND NEW.created_by IS NOT NULL
  THEN
    IF EXISTS (
      SELECT 1 FROM invoices
      WHERE shipment_id = NEW.id AND status <> 'cancelled'
    ) THEN
      RETURN NEW;
    END IF;

    IF NEW.quote_id IS NOT NULL THEN
      SELECT q.total_price, q.currency INTO amt, cur
      FROM quotes q WHERE q.id = NEW.quote_id;
    END IF;

    IF amt IS NULL THEN
      amt := round(COALESCE(NEW.weight_kg, 50) * 2.5, 2);
    END IF;

    inv_num := public.generate_invoice_number();

    INSERT INTO invoices (
      organization_id, shipment_id, customer_id,
      invoice_number, amount, currency, status, due_date
    ) VALUES (
      NEW.organization_id,
      NEW.id,
      NEW.created_by,
      inv_num,
      amt,
      cur,
      'draft',
      (CURRENT_DATE + INTERVAL '30 days')::date
    );

    INSERT INTO notifications (organization_id, user_id, title, body, metadata)
    VALUES (
      NEW.organization_id,
      NEW.created_by,
      'Shipment delivered',
      'Invoice ' || inv_num || ' has been prepared for tracking ' || NEW.tracking_number || '.',
      jsonb_build_object('type', 'invoice_draft', 'tracking_number', NEW.tracking_number)
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS shipment_delivered_invoice ON shipments;
CREATE TRIGGER shipment_delivered_invoice
  AFTER UPDATE OF status ON shipments
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_invoice_on_delivered();
