import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  Loader2, Save, Mail, Clock, Code2, Eye, EyeOff, Plus, Trash2, Edit3, CheckCircle2, XCircle,
  AlertTriangle, Lock, Send,
} from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  getScheduleSettings, updateScheduleSettings,
  getEmailSettings, updateEmailSettings, sendTestEmail,
  listCodeSnippets, createCodeSnippet, updateCodeSnippet, deleteCodeSnippet,
  type ScheduleSettings, type EmailSettings, type EmailProvider, type CodeSnippet,
} from "@/lib/settings.functions";

export const Route = createFileRoute("/admin/settings")({
  ssr: false,
  component: SettingsPage,
});

type Tab = "schedule" | "email" | "code";

const TABS: { id: Tab; label: string; icon: any }[] = [
  { id: "schedule", label: "Schedule", icon: Clock },
  { id: "email", label: "Email", icon: Mail },
  { id: "code", label: "Code Manager", icon: Code2 },
];

function SettingsPage() {
  const [tab, setTab] = useState<Tab>("schedule");
  const [saving, setSaving] = useState(false);

  // Schedule
  const [schedule, setSchedule] = useState<ScheduleSettings | null>(null);
  const fetchSchedule = useServerFn(getScheduleSettings);
  const saveSchedule = useServerFn(updateScheduleSettings);

  // Email
  const [email, setEmail] = useState<EmailSettings | null>(null);
  const fetchEmail = useServerFn(getEmailSettings);
  const saveEmail = useServerFn(updateEmailSettings);
  const testEmail = useServerFn(sendTestEmail);
  const [testTo, setTestTo] = useState("");
  const [testing, setTesting] = useState(false);
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});

  // Snippets
  const [snippets, setSnippets] = useState<CodeSnippet[]>([]);
  const fetchSnippets = useServerFn(listCodeSnippets);
  const createSnippet = useServerFn(createCodeSnippet);
  const updateSnippet = useServerFn(updateCodeSnippet);
  const removeSnippet = useServerFn(deleteCodeSnippet);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [snipForm, setSnipForm] = useState<Omit<CodeSnippet, "id" | "created_at" | "updated_at" | "is_system_managed">>({
    name: "", description: "", location: "head", load_on: "all", code: "", active: true, priority: 10,
  });

  useEffect(() => {
    (async () => {
      try {
        const [s, e, sn] = await Promise.all([fetchSchedule(), fetchEmail(), fetchSnippets()]);
        setSchedule(s as ScheduleSettings);
        setEmail(e as EmailSettings);
        setSnippets(sn as CodeSnippet[]);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to load settings");
      }
    })();
  }, [fetchSchedule, fetchEmail, fetchSnippets]);

  async function refreshSnippets() {
    setSnippets((await fetchSnippets()) as CodeSnippet[]);
  }

  async function handleSaveAll() {
    if (!schedule) return;
    setSaving(true);
    try {
      if (tab === "schedule") {
        await saveSchedule({ data: schedule });
        toast.success("Schedule saved");
      } else if (tab === "email" && email) {
        await saveEmail({ data: email });
        toast.success("Email settings saved");
      } else {
        // Save active tab defaults to schedule
        await saveSchedule({ data: schedule });
        toast.success("Settings saved");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleTestEmail() {
    if (!testTo) return toast.error("Enter a recipient email");
    setTesting(true);
    try {
      const res = (await testEmail({ data: { to: testTo } })) as { ok: boolean; error?: string };
      if (res.ok) {
        toast.success("Test email sent");
      } else {
        toast.error(res.error || "Test failed");
      }
      setEmail((await fetchEmail()) as EmailSettings);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Test failed");
    } finally {
      setTesting(false);
    }
  }

  function resetSnipForm() {
    setEditingId(null);
    setSnipForm({ name: "", description: "", location: "head", load_on: "all", code: "", active: true, priority: 10 });
  }

  async function handleSnippetSubmit() {
    if (!snipForm.name.trim() || !snipForm.code.trim()) return toast.error("Name and code are required");
    try {
      if (editingId) {
        await updateSnippet({ data: { id: editingId, ...snipForm } });
        toast.success("Snippet updated");
      } else {
        await createSnippet({ data: snipForm });
        toast.success("Snippet added");
      }
      resetSnipForm();
      await refreshSnippets();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    }
  }

  async function handleSnippetDelete(id: string) {
    if (!confirm("Delete this snippet?")) return;
    try {
      await removeSnippet({ data: { id } });
      toast.success("Deleted");
      await refreshSnippets();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  }

  const quickTemplates = [
    { id: "ga4", icon: "📊", name: "Google Analytics 4", desc: "GA4 measurement tag", loc: "head" as const,
      code: `<!-- Google Analytics 4 -->\n<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>\n<script>\n  window.dataLayer = window.dataLayer || [];\n  function gtag(){dataLayer.push(arguments);}\n  gtag('js', new Date());\n  gtag('config', 'G-XXXXXXXXXX');\n</script>` },
    { id: "gtm", icon: "🏷️", name: "Google Tag Manager", desc: "GTM container", loc: "head" as const,
      code: `<!-- Google Tag Manager -->\n<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':\nnew Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],\nj=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=\n'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);\n})(window,document,'script','dataLayer','GTM-XXXXXXX');</script>` },
    { id: "fbp", icon: "📘", name: "Facebook Pixel", desc: "Meta / FB Pixel", loc: "head" as const,
      code: `<!-- Meta Pixel -->\n<script>\n!function(f,b,e,v,n,t,s){/* fbq init */}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');\nfbq('init', 'YOUR_PIXEL_ID');\nfbq('track', 'PageView');\n</script>` },
    { id: "gsc", icon: "🔍", name: "Google Search Console", desc: "Verification meta tag", loc: "head" as const,
      code: `<meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" />` },
    { id: "hotjar", icon: "🔥", name: "Hotjar", desc: "Session recordings", loc: "head" as const,
      code: `<!-- Hotjar Tracking Code -->\n<script>\n(function(h,o,t,j,a,r){h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};/* hj init */})(window,document);\n</script>` },
    { id: "crisp", icon: "💬", name: "Crisp Chat", desc: "Chat widget", loc: "body_end" as const,
      code: `<script type="text/javascript">window.$crisp=[];window.CRISP_WEBSITE_ID="YOUR_WEBSITE_ID";(function(){var d=document;var s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();</script>` },
    { id: "css", icon: "🎨", name: "Custom CSS", desc: "Site-wide styles", loc: "head" as const,
      code: `<style>\n  /* Your custom CSS */\n</style>` },
    { id: "js", icon: "⚡", name: "Custom JavaScript", desc: "Custom scripts", loc: "body_end" as const,
      code: `<script>\n  // Your custom JavaScript\n</script>` },
  ];

  function applyTemplate(t: typeof quickTemplates[number]) {
    setEditingId(null);
    setSnipForm({
      name: t.name, description: t.desc, location: t.loc, load_on: "all",
      code: t.code, active: true, priority: t.id === "gtm" ? 1 : 10,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <AdminShell title="Settings">
      {/* Tabs */}
      <div className="border-b border-white/10 mb-6 flex gap-1">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              tab === id
                ? "border-[color:var(--gold)] text-white"
                : "border-transparent text-white/60 hover:text-white"
            }`}>
            <Icon className="h-4 w-4" /> {label}
          </button>
        ))}
      </div>

      {/* Schedule */}
      {tab === "schedule" && (
        <div className="max-w-2xl">
          <div className="rounded-xl border border-white/10 bg-[#111a2e] p-6">
            <h3 className="text-lg font-semibold text-white mb-1">Schedule</h3>
            <p className="text-sm text-white/50 mb-6">Controls the Blog Automation runs.</p>
            {!schedule ? <div className="text-white/50"><Loader2 className="h-4 w-4 animate-spin inline mr-2" />Loading…</div> : (
              <div className="space-y-4">
                <div>
                  <Label className="text-white/80">Frequency</Label>
                  <select
                    value={schedule.frequency}
                    onChange={(e) => setSchedule({ ...schedule, frequency: e.target.value as any })}
                    className="mt-1 w-full h-10 rounded-md bg-[#0b1220] border border-white/10 px-3 text-white"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white/80">Time</Label>
                    <div className="flex gap-2 items-center mt-1">
                      <Input type="time" value={schedule.time}
                        onChange={(e) => setSchedule({ ...schedule, time: e.target.value })}
                        className="bg-[#0b1220] border-white/10 text-white" />
                      <Input value={schedule.timezone}
                        onChange={(e) => setSchedule({ ...schedule, timezone: e.target.value })}
                        placeholder="MST" className="bg-[#0b1220] border-white/10 text-white w-24" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-white/80">Posts per run</Label>
                    <Input type="number" min={1} max={50} value={schedule.postsPerRun}
                      onChange={(e) => setSchedule({ ...schedule, postsPerRun: Math.max(1, parseInt(e.target.value) || 1) })}
                      className="mt-1 bg-[#0b1220] border-white/10 text-white" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Email */}
      {tab === "email" && email && (
        <div className="max-w-4xl space-y-6">
          {/* Provider */}
          <div className="rounded-xl border border-white/10 bg-[#111a2e] p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Email Provider</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {([
                { id: "smtp", name: "SMTP", desc: "Any SMTP server" },
                { id: "sendgrid", name: "SendGrid", desc: "Reliable · Free tier" },
                { id: "resend", name: "Resend", desc: "Developer-first · Free tier" },
                { id: "mailgun", name: "Mailgun", desc: "Powerful API" },
              ] as { id: EmailProvider; name: string; desc: string }[]).map((p) => (
                <button key={p.id} type="button"
                  onClick={() => setEmail({ ...email, provider: p.id })}
                  className={`text-left rounded-lg p-4 border transition-colors ${
                    email.provider === p.id
                      ? "border-[color:var(--gold)] bg-[color:var(--gold)]/5"
                      : "border-white/10 bg-white/5 hover:border-white/20"
                  }`}>
                  <div className="font-semibold text-white">{p.name}</div>
                  <div className="text-xs text-white/50 mt-1">{p.desc}</div>
                </button>
              ))}
            </div>

            {/* Provider config */}
            <div className="mt-6 space-y-4">
              {email.provider === "smtp" && (
                <div className="grid grid-cols-2 gap-4">
                  <FieldInput label="Host" value={email.smtp.host}
                    onChange={(v) => setEmail({ ...email, smtp: { ...email.smtp, host: v } })} />
                  <FieldInput label="Port" type="number" value={String(email.smtp.port)}
                    onChange={(v) => setEmail({ ...email, smtp: { ...email.smtp, port: parseInt(v) || 587 } })} />
                  <FieldInput label="Username" value={email.smtp.username}
                    onChange={(v) => setEmail({ ...email, smtp: { ...email.smtp, username: v } })} />
                  <MaskedInput label="Password" value={email.smtp.password} show={!!showKey.smtp}
                    toggle={() => setShowKey((s) => ({ ...s, smtp: !s.smtp }))}
                    onChange={(v) => setEmail({ ...email, smtp: { ...email.smtp, password: v } })} />
                  <div className="flex items-center gap-3 mt-6">
                    <Switch checked={email.smtp.useTls}
                      onCheckedChange={(c) => setEmail({ ...email, smtp: { ...email.smtp, useTls: c } })} />
                    <Label className="text-white/80">Use TLS</Label>
                  </div>
                </div>
              )}
              {email.provider === "sendgrid" && (
                <MaskedInput label="SendGrid API Key" value={email.sendgrid.apiKey} show={!!showKey.sg}
                  toggle={() => setShowKey((s) => ({ ...s, sg: !s.sg }))}
                  onChange={(v) => setEmail({ ...email, sendgrid: { apiKey: v } })} />
              )}
              {email.provider === "resend" && (
                <>
                  <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-4 text-sm text-white/70">
                    <div className="font-semibold text-white mb-2">Setup instructions</div>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Sign up at <a className="text-[color:var(--gold)] underline" href="https://resend.com" target="_blank" rel="noopener noreferrer">resend.com</a></li>
                      <li>Create an API key in the dashboard</li>
                      <li>Paste it below</li>
                      <li>Verify your sending domain</li>
                    </ol>
                  </div>
                  <MaskedInput label="Resend API Key" value={email.resend.apiKey} show={!!showKey.rs}
                    toggle={() => setShowKey((s) => ({ ...s, rs: !s.rs }))}
                    onChange={(v) => setEmail({ ...email, resend: { apiKey: v } })} />
                </>
              )}
              {email.provider === "mailgun" && (
                <div className="grid grid-cols-2 gap-4">
                  <MaskedInput label="Mailgun API Key" value={email.mailgun.apiKey} show={!!showKey.mg}
                    toggle={() => setShowKey((s) => ({ ...s, mg: !s.mg }))}
                    onChange={(v) => setEmail({ ...email, mailgun: { ...email.mailgun, apiKey: v } })} />
                  <FieldInput label="Mailgun Domain" value={email.mailgun.domain}
                    onChange={(v) => setEmail({ ...email, mailgun: { ...email.mailgun, domain: v } })} />
                </div>
              )}
            </div>
          </div>

          {/* General */}
          <div className="rounded-xl border border-white/10 bg-[#111a2e] p-6">
            <h3 className="text-lg font-semibold text-white mb-4">General Settings</h3>
            <div className="grid grid-cols-2 gap-4">
              <FieldInput label="From Name" value={email.general.fromName}
                onChange={(v) => setEmail({ ...email, general: { ...email.general, fromName: v } })} />
              <FieldInput label="From Email" value={email.general.fromEmail}
                onChange={(v) => setEmail({ ...email, general: { ...email.general, fromEmail: v } })} />
              <FieldInput label="Reply-To Email" value={email.general.replyTo}
                onChange={(v) => setEmail({ ...email, general: { ...email.general, replyTo: v } })} />
              <div>
                <Label className="text-white/80">Admin Notification Email</Label>
                <Input value={email.general.adminNotificationEmail}
                  onChange={(e) => setEmail({ ...email, general: { ...email.general, adminNotificationEmail: e.target.value } })}
                  className="mt-1 bg-[#0b1220] border-white/10 text-white" />
                <p className="text-xs text-white/50 mt-1">
                  Where contact form and consultation form submissions are sent. Multiple emails separated by comma.
                </p>
              </div>
            </div>
          </div>

          {/* Test */}
          <div className="rounded-xl border border-white/10 bg-[#111a2e] p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Test Email Connection</h3>
            <div className="flex gap-3 flex-wrap items-end">
              <div className="flex-1 min-w-[240px]">
                <Label className="text-white/80">Send test to</Label>
                <Input value={testTo} onChange={(e) => setTestTo(e.target.value)}
                  placeholder="you@example.com"
                  className="mt-1 bg-[#0b1220] border-white/10 text-white" />
              </div>
              <Button onClick={handleTestEmail} disabled={testing}
                className="bg-[color:var(--brand)] hover:bg-[color:var(--brand)]/90">
                {testing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                Send Test Email
              </Button>
            </div>
            {email.lastTestedAt && (
              <div className="mt-3 text-sm flex items-center gap-2">
                {email.lastTestSuccess ? (
                  <><CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span className="text-green-400">Verified</span>
                    <span className="text-white/50">— Last tested {new Date(email.lastTestedAt).toLocaleString()}</span></>
                ) : (
                  <><XCircle className="h-4 w-4 text-[color:var(--crimson)]" />
                    <span className="text-[color:var(--crimson)]">{email.lastTestError || "Failed"}</span></>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSaveAll} disabled={saving}
              className="bg-[color:var(--gold)] text-[color:var(--ink)] hover:bg-[color:var(--gold)]/90">
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              Save Email Settings
            </Button>
          </div>
        </div>
      )}

      {/* Code Manager */}
      {tab === "code" && (
        <div className="max-w-6xl space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-white">Header &amp; Footer Code Manager</h3>
            <p className="text-sm text-white/60 mt-1">
              Inject custom code into your site's &lt;head&gt; or before &lt;/body&gt;. Use for tracking pixels, analytics, custom scripts, and more.
            </p>
          </div>

          <div className="rounded-lg border border-orange-500/40 bg-orange-500/10 p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-orange-400 shrink-0 mt-0.5" />
            <div className="text-sm text-orange-100">
              <b>Advanced Feature</b> — Incorrect code can break your site. Only add code you trust. Changes apply to all public pages instantly.
            </div>
          </div>

          {/* Add snippet */}
          <div className="rounded-xl border border-white/10 bg-[#111a2e] p-6">
            <h4 className="text-base font-semibold text-white mb-4">
              {editingId ? "Edit Code Snippet" : "Add New Code Snippet"}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FieldInput label="Name" value={snipForm.name}
                onChange={(v) => setSnipForm({ ...snipForm, name: v })} />
              <FieldInput label="Description" value={snipForm.description ?? ""}
                onChange={(v) => setSnipForm({ ...snipForm, description: v })} />
              <div>
                <Label className="text-white/80">Location</Label>
                <select value={snipForm.location}
                  onChange={(e) => setSnipForm({ ...snipForm, location: e.target.value as any })}
                  className="mt-1 w-full h-10 rounded-md bg-[#0b1220] border border-white/10 px-3 text-white">
                  <option value="head">Head (&lt;head&gt;) — tracking, analytics, meta tags</option>
                  <option value="body_start">Body Start</option>
                  <option value="body_end">Body End</option>
                </select>
              </div>
              <div>
                <Label className="text-white/80">Load On</Label>
                <select value={snipForm.load_on}
                  onChange={(e) => setSnipForm({ ...snipForm, load_on: e.target.value })}
                  className="mt-1 w-full h-10 rounded-md bg-[#0b1220] border border-white/10 px-3 text-white">
                  <option value="all">All Pages</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <Label className="text-white/80">Code</Label>
                <Textarea value={snipForm.code}
                  onChange={(e) => setSnipForm({ ...snipForm, code: e.target.value })}
                  placeholder="Paste your code here..."
                  className="mt-1 font-mono text-xs bg-[#0b1220] border-white/10 text-white min-h-[160px]" />
              </div>
              <div>
                <Label className="text-white/80">Priority (1-100)</Label>
                <Input type="number" min={1} max={100} value={snipForm.priority}
                  onChange={(e) => setSnipForm({ ...snipForm, priority: Math.max(1, parseInt(e.target.value) || 10) })}
                  className="mt-1 bg-[#0b1220] border-white/10 text-white" />
                <p className="text-xs text-white/50 mt-1">Lower numbers load first. Use 1 for critical scripts.</p>
              </div>
              <div className="flex items-center gap-3 mt-6">
                <Switch checked={snipForm.active}
                  onCheckedChange={(c) => setSnipForm({ ...snipForm, active: c })} />
                <Label className="text-white/80">Active (will be injected)</Label>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button onClick={handleSnippetSubmit}
                className="bg-[color:var(--brand)] hover:bg-[color:var(--brand)]/90">
                <Plus className="h-4 w-4 mr-2" />
                {editingId ? "Update Snippet" : "Add Snippet"}
              </Button>
              {editingId && (
                <Button variant="ghost" onClick={resetSnipForm}
                  className="text-white/70 hover:text-white hover:bg-white/5">Cancel</Button>
              )}
            </div>
          </div>

          {/* Quick add templates */}
          <div className="rounded-xl border border-white/10 bg-[#111a2e] p-6">
            <h4 className="text-base font-semibold text-white mb-4">Quick Add Templates</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {quickTemplates.map((t) => (
                <div key={t.id} className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{t.icon}</span>
                    <div className="font-semibold text-white text-sm">{t.name}</div>
                  </div>
                  <p className="text-xs text-white/50 mb-3">{t.desc}</p>
                  <Button size="sm" onClick={() => applyTemplate(t)}
                    className="w-full bg-[color:var(--gold)] text-[color:var(--ink)] hover:bg-[color:var(--gold)]/90">
                    Add to Site
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Installed snippets */}
          <div className="rounded-xl border border-white/10 bg-[#111a2e]">
            <div className="px-5 py-4 border-b border-white/10">
              <h4 className="text-base font-semibold text-white">Installed Snippets</h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-white/50 text-xs uppercase tracking-wider">
                  <tr className="border-b border-white/10">
                    <th className="text-left px-5 py-3 font-medium">Status</th>
                    <th className="text-left px-4 py-3 font-medium">Name</th>
                    <th className="text-left px-4 py-3 font-medium">Location</th>
                    <th className="text-left px-4 py-3 font-medium">Load On</th>
                    <th className="text-left px-4 py-3 font-medium">Priority</th>
                    <th className="text-right px-5 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {snippets.length === 0 ? (
                    <tr><td colSpan={6} className="text-center text-white/50 py-10">No snippets yet.</td></tr>
                  ) : snippets.map((s) => (
                    <tr key={s.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="px-5 py-3">
                        <span className={`inline-block h-2 w-2 rounded-full ${s.active ? "bg-green-400" : "bg-white/30"}`} />
                      </td>
                      <td className="px-4 py-3 text-white">
                        <div className="flex items-center gap-2">
                          {s.name}
                          {s.is_system_managed && (
                            <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-[color:var(--gold)]/15 text-[color:var(--gold)] border border-[color:var(--gold)]/30">
                              <Lock className="h-3 w-3" /> System
                            </span>
                          )}
                        </div>
                        {s.description && <div className="text-xs text-white/50 mt-0.5">{s.description}</div>}
                      </td>
                      <td className="px-4 py-3 text-white/70">{s.location}</td>
                      <td className="px-4 py-3 text-white/70">{s.load_on}</td>
                      <td className="px-4 py-3 text-white/70">{s.priority}</td>
                      <td className="px-5 py-3 text-right space-x-1">
                        {!s.is_system_managed ? (
                          <>
                            <Button size="sm" variant="ghost"
                              onClick={() => {
                                setEditingId(s.id);
                                setSnipForm({
                                  name: s.name, description: s.description ?? "", location: s.location,
                                  load_on: s.load_on, code: s.code, active: s.active, priority: s.priority,
                                });
                                window.scrollTo({ top: 0, behavior: "smooth" });
                              }}
                              className="text-white/70 hover:text-white hover:bg-white/5">
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleSnippetDelete(s.id)}
                              className="text-[color:var(--crimson)] hover:bg-[color:var(--crimson)]/10">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <span className="text-xs text-white/40 inline-flex items-center gap-1">
                            <Lock className="h-3 w-3" /> Auto-managed
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* How it injects */}
          <div className="rounded-xl border border-white/10 bg-[#111a2e] p-6">
            <h4 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
              <Eye className="h-4 w-4" /> How It Injects
            </h4>
            <pre className="text-xs font-mono bg-[#0b1220] border border-white/10 rounded-lg p-4 text-white/70 overflow-x-auto">
{`<!DOCTYPE html>
<html>
  <head>
    <!-- ↓ HEAD snippets injected here (sorted by priority ascending) -->
    <script>...</script>
    <!-- ↑ -->
  </head>
  <body>
    <!-- ↓ BODY START snippets injected here -->
    ...
    <!-- ↑ -->

    <!-- your app -->

    <!-- ↓ BODY END snippets injected here -->
    ...
    <!-- ↑ -->
  </body>
</html>`}
            </pre>
          </div>
        </div>
      )}

      {/* Sticky save-all */}
      <div className="sticky bottom-0 -mx-6 mt-8 px-6 py-4 bg-[#0a1122]/95 backdrop-blur border-t border-white/10 flex justify-end">
        <Button onClick={handleSaveAll} disabled={saving}
          className="bg-[color:var(--gold)] text-[color:var(--ink)] hover:bg-[color:var(--gold)]/90">
          {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          Save All Settings
        </Button>
      </div>
    </AdminShell>
  );
}

function FieldInput({ label, value, onChange, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void; type?: string;
}) {
  return (
    <div>
      <Label className="text-white/80">{label}</Label>
      <Input type={type} value={value} onChange={(e) => onChange(e.target.value)}
        className="mt-1 bg-[#0b1220] border-white/10 text-white" />
    </div>
  );
}

function MaskedInput({ label, value, onChange, show, toggle }: {
  label: string; value: string; onChange: (v: string) => void; show: boolean; toggle: () => void;
}) {
  return (
    <div>
      <Label className="text-white/80">{label}</Label>
      <div className="mt-1 relative">
        <Input type={show ? "text" : "password"} value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-[#0b1220] border-white/10 text-white pr-10" />
        <button type="button" onClick={toggle}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-white/50 hover:text-white">
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
