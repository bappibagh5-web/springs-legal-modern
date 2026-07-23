
CREATE TABLE public.analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  category text,
  label text,
  page_path text,
  referrer text,
  traffic_source text,
  utm_campaign text,
  utm_source text,
  utm_medium text,
  session_id text,
  visitor_id text,
  device_type text,
  browser text,
  duration_seconds integer,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX analytics_events_created_at_idx ON public.analytics_events (created_at DESC);
CREATE INDEX analytics_events_event_type_idx ON public.analytics_events (event_type);
CREATE INDEX analytics_events_session_id_idx ON public.analytics_events (session_id);
CREATE INDEX analytics_events_visitor_id_idx ON public.analytics_events (visitor_id);

GRANT INSERT ON public.analytics_events TO anon;
GRANT INSERT, SELECT ON public.analytics_events TO authenticated;
GRANT ALL ON public.analytics_events TO service_role;

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert analytics events"
  ON public.analytics_events FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view analytics events"
  ON public.analytics_events FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND status = 'active' AND role IN ('super_admin','admin')
    )
  );
