import { SahayaAvatar } from "./SahayaAvatar";

export function SahayaLoader({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10 text-emerald-700">
      <SahayaAvatar state="thinking" size={48} />
      <span className="text-sm font-medium">{label ?? "Loading…"}</span>
    </div>
  );
}
