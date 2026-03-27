/*
  supabase/migrations/002_add_missing_fields.sql

  Adds contact info, GPS coordinates, scheduling, icon,
  updated_at triggers, and fixes the status constraint.
*/


-- ── Contact ──────────────────────────────────────────────────────────────

ALTER TABLE public.booking_requests
  ADD COLUMN IF NOT EXISTS customer_name  TEXT,
  ADD COLUMN IF NOT EXISTS customer_phone TEXT;


-- ── GPS ──────────────────────────────────────────────────────────────────

ALTER TABLE public.booking_requests
  ADD COLUMN IF NOT EXISTS pickup_lat   NUMERIC(10,7),
  ADD COLUMN IF NOT EXISTS pickup_lng   NUMERIC(10,7),
  ADD COLUMN IF NOT EXISTS dropoff_lat  NUMERIC(10,7),
  ADD COLUMN IF NOT EXISTS dropoff_lng  NUMERIC(10,7);


-- ── Planification + remarques ────────────────────────────────────────────

ALTER TABLE public.booking_requests
  ADD COLUMN IF NOT EXISTS requested_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS notes        TEXT;


-- ── Statut : remplacer "reviewed" par "completed" + champ reviewed_at ───

ALTER TABLE public.booking_requests
  DROP CONSTRAINT IF EXISTS booking_requests_status_check;

ALTER TABLE public.booking_requests
  ADD CONSTRAINT booking_requests_status_check
  CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled'));

ALTER TABLE public.booking_requests
  ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ;

UPDATE public.booking_requests
  SET status = 'confirmed', reviewed_at = now()
  WHERE status = 'reviewed';


-- ── updated_at sur les 3 tables ──────────────────────────────────────────

ALTER TABLE public.booking_requests
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

ALTER TABLE public.ride_options
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

ALTER TABLE public.booking_request_options
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at_booking_requests ON public.booking_requests;
CREATE TRIGGER set_updated_at_booking_requests
  BEFORE UPDATE ON public.booking_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_ride_options ON public.ride_options;
CREATE TRIGGER set_updated_at_ride_options
  BEFORE UPDATE ON public.ride_options
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_booking_request_options ON public.booking_request_options;
CREATE TRIGGER set_updated_at_booking_request_options
  BEFORE UPDATE ON public.booking_request_options
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


-- ── Icône sur ride_options ───────────────────────────────────────────────

ALTER TABLE public.ride_options
  ADD COLUMN IF NOT EXISTS icon TEXT;