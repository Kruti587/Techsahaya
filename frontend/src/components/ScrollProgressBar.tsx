import { useEffect, useRef } from "react";

export function ScrollProgressBar() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const el = barRef.current;
      if (!el) return;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      el.style.transform = `scaleX(${Math.min(Math.max(progress, 0), 1)})`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={barRef}
      className="fixed left-0 right-0 top-0 z-[100] h-1 origin-left pointer-events-none"
      style={{
        transform: "scaleX(0)",
        background: "linear-gradient(90deg, #0f3d2e, #b85c00, #f7f6f2)",
        boxShadow: "0 0 10px rgba(184, 92, 0, 0.5)",
        transition: "transform 0.05s linear",
      }}
    />
  );
}
