import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 220) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto transition-all duration-300 animate-fade-in">
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Back to top"
        className="group flex items-center gap-2 rounded-full border border-emerald-600/40 bg-emerald-900/90 px-5 py-2.5 text-xs font-bold text-white shadow-2xl backdrop-blur-md transition-all duration-200 hover:bg-sahaya-green hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-sahaya-saffron"
      >
        <ArrowUp size={15} className="transition-transform group-hover:-translate-y-0.5" />
        <span>Back to top</span>
      </button>
    </div>
  );
}
