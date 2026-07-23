
DROP POLICY IF EXISTS "Anyone can submit a lead" ON public.leads;

CREATE POLICY "Anyone can submit a consultation lead"
  ON public.leads FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(coalesce(name,'')) BETWEEN 1 AND 200
    AND length(coalesce(email,'')) BETWEEN 3 AND 320
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND coalesce(length(message), 0) <= 5000
    AND status = 'new'
    AND email_sent = false
  );
