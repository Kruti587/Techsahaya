import logoUrl from "../assets/logo.svg";

export function Logo({ size = 36, className = "" }: { size?: number; className?: string }) {
  return (
    <img
      src={logoUrl}
      width={size}
      height={size}
      alt="Tech Sahaya"
      className={`object-contain ${className}`}
    />
  );
}
