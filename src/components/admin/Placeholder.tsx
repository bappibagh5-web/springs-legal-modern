export function Placeholder({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#111a2e] p-10 text-center">
      <div className="text-lg font-semibold mb-1">{label}</div>
      <p className="text-white/50 text-sm">This module will be built in the next step.</p>
    </div>
  );
}
