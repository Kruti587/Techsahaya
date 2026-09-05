import logoUrl from "../assets/logo.svg";

export function Logo({ size = 56, className = "" }: { size?: number; className?: string }) {
  return (
    <div
      className={`inline-flex shrink-0 items-center justify-center rounded-2xl border-2 border-amber-400 bg-white p-1 shadow-[0_0_22px_rgba(245,158,11,0.75)] ring-2 ring-amber-300/70 transition-all duration-300 hover:shadow-[0_0_32px_rgba(245,158,11,0.95)] hover:scale-105 ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src={logoUrl}
        width={size}
        height={size}
        alt="Tech Sahaya"
        className="h-full w-full object-contain"
      />
    </div>
  );
}
