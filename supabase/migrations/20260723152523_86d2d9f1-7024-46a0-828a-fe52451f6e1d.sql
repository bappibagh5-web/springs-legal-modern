CREATE TYPE public.automation_run_status AS ENUM ('success', 'failed');
CREATE TYPE public.automation_trigger_type AS ENUM ('manual', 'scheduled');

CREATE TABLE public.automation_runs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_id UUID REFERENCES public.topics(id) ON DELETE SET NULL,
  post_id UUID REFERENCES public.posts(id) ON DELETE SET NULL,
  topic_title TEXT,
  status public.automation_run_status NOT NULL,
  trigger_type public.automation_trigger_type NOT NULL DEFAULT 'manual',
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_automation_runs_created_at ON public.automation_runs(created_at DESC);

GRANT SELECT, INSERT ON public.automation_runs TO authenticated;
GRANT ALL ON public.automation_runs TO service_role;

ALTER TABLE public.automation_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view automation runs" ON public.automation_runs
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Admins can insert automation runs" ON public.automation_runs
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));