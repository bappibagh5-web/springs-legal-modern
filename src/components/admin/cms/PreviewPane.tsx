import { useEffect, useRef, useState } from "react";
import { Maximize2, Minimize2, Monitor, Smartphone, Tablet, RotateCw } from "lucide-react";
import { MSG, PREVIEW_PARAM } from "@/lib/cms/context";
import type { PageContent } from "@/lib/cms/registry";

const DEVICES = {
  desktop: { w: 1280, icon: Monitor, label: "Desktop" },
  tablet: { w: 820, icon: Tablet, label: "Tablet" },
  mobile: { w: 390, icon: Smartphone, label: "Mobile" },
} as const;
type Device = keyof typeof DEVICES;

export function PreviewPane({
  path,
  pages,
  selected,
  onSectionClick,
}: {
  path: string;
  pages: Record<string, PageContent>;
  selected: string | null;
  onSectionClick: (id: string) => void;
}) {
  const [device, setDevice] = useState<Device>("desktop");
  const [full, setFull] = useState(false);
  const [ready, setReady] = useState(false);
  const [boxW, setBoxW] = useState(600);
  const [reloadKey, setReloadKey] = useState(0);
  const frame = useRef<HTMLIFrameElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const latest = useRef({ pages, selected });
  latest.current = { pages, selected };

  const post = (msg: unknown) => frame.current?.contentWindow?.postMessage(msg, window.location.origin);

  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.origin !== window.location.origin || e.source !== frame.current?.contentWindow) return;
      if (e.data?.type === MSG.ready) {
        setReady(true);
        post({ type: MSG.draft, pages: latest.current.pages });
        post({ type: MSG.select, id: latest.current.selected });
      }
      if (e.data?.type === MSG.clicked && typeof e.data.id === "string") onSectionClick(e.data.id);
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [onSectionClick]);

  useEffect(() => {
    if (ready) post({ type: MSG.draft, pages });
  }, [pages, ready]);
  useEffect(() => {
    if (ready) post({ type: MSG.select, id: selected });
  }, [selected, ready]);

  useEffect(() => {
    if (!box.current) return;
    const ro = new ResizeObserver(([e]) => setBoxW(e.contentRect.width));
    ro.observe(box.current);
    return () => ro.disconnect();
  }, [full]);

  const devW = DEVICES[device].w;
  const scale = Math.min(1, (boxW - 16) / devW);
  const src = `${path}${path.includes("?") ? "&" : "?"}${PREVIEW_PARAM}=1`;

  return (
    <div
      className={
        full
          ? "fixed inset-0 z-[100] flex flex-col bg-[#0b1220]"
          : "flex h-full min-h-0 flex-col rounded-xl border border-white/10 bg-[#0a1122]"
      }
    >
      <div className="flex items-center justify-between gap-2 border-b border-white/10 px-3 py-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-white/50">Draft preview</span>
        <div className="flex items-center gap-1">
          {(Object.keys(DEVICES) as Device[]).map((d) => {
            const Icon = DEVICES[d].icon;
            return (
              <button
                key={d}
                onClick={() => setDevice(d)}
                title={DEVICES[d].label}
                className={`rounded-md p-1.5 ${device === d ? "bg-[color:var(--gold)] text-black" : "text-white/60 hover:bg-white/10"}`}
              >
                <Icon className="h-4 w-4" />
              </button>
            );
          })}
          <button onClick={() => { setReady(false); setReloadKey((k) => k + 1); }} title="Reload" className="rounded-md p-1.5 text-white/60 hover:bg-white/10">
            <RotateCw className="h-4 w-4" />
          </button>
          <button onClick={() => setFull((f) => !f)} title={full ? "Exit full screen" : "Full screen"} className="rounded-md p-1.5 text-white/60 hover:bg-white/10">
            {full ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </div>
      <div ref={box} className="relative min-h-0 flex-1 overflow-hidden p-2">
        <div
          className="mx-auto h-full overflow-hidden rounded-md bg-white shadow-2xl"
          style={{ width: devW * scale }}
        >
          <iframe
            key={reloadKey}
            ref={frame}
            src={src}
            title="Draft preview"
            onLoad={() => setReady(false)}
            style={{
              width: devW,
              height: `${100 / scale}%`,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
              border: 0,
            }}
          />
        </div>
      </div>
    </div>
  );
}
