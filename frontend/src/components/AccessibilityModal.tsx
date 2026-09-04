import { X } from "lucide-react";

export function AccessibilityModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-fade-in"
    >
      <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-stone-200 bg-white p-6 md:p-8 shadow-2xl text-slate-800">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close Accessibility Policy"
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-stone-100 text-slate-500 hover:bg-stone-200 hover:text-slate-800 transition"
        >
          <X size={20} />
        </button>

        <span className="text-xs font-bold uppercase tracking-widest text-sahaya-saffron">
          ACCESSIBILITY
        </span>
        <h2 className="mt-1 text-2xl md:text-3xl font-bold font-serif text-slate-900">
          Designed for the person who needs it most
        </h2>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
          Our users include people with low vision, limited literacy, older citizens using a shared phone, and people reading in a script the internet mostly ignores.
        </p>

        <div className="mt-6 divide-y divide-stone-100 space-y-5 text-sm">
          <div className="pt-4 first:pt-0">
            <h3 className="font-bold text-slate-900 text-base font-serif">What we commit to</h3>
            <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
              WCAG 2.2 AA as the baseline: 4.5:1 contrast on all body text, visible focus outlines on every interactive element, full keyboard operability, and no interaction that requires a hover or a precise gesture.
            </p>
          </div>

          <div className="pt-4">
            <h3 className="font-bold text-slate-900 text-base font-serif">Reading comfort, on every screen</h3>
            <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
              Text scales to 130% from the bar at the top of the page without any layout breaking or text truncating. High contrast removes decorative surfaces and shadows. Simple Mode enlarges every touch target past 52px and hides decoration so one action is obvious per screen.
            </p>
          </div>

          <div className="pt-4">
            <h3 className="font-bold text-slate-900 text-base font-serif">Language and voice</h3>
            <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
              English, Hindi, Kannada, Tamil, Telugu and Marathi, with Noto typefaces so every script renders correctly rather than falling back to boxes. Any answer can be read aloud, and questions can be spoken instead of typed.
            </p>
          </div>

          <div className="pt-4">
            <h3 className="font-bold text-slate-900 text-base font-serif">Devices</h3>
            <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
              One responsive interface from a 320px Android phone through iPhone, iPad, Windows laptops and macOS. On phones the primary navigation becomes a thumb-reachable bottom bar; on desktop it becomes a persistent sidebar. Layouts respect the safe area on notched devices.
            </p>
          </div>

          <div className="pt-4">
            <h3 className="font-bold text-slate-900 text-base font-serif">Motion</h3>
            <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
              All motion is under 300ms and respects the operating system&apos;s reduce-motion setting, which disables every transition and animation.
            </p>
          </div>

          <div className="pt-4">
            <h3 className="font-bold text-slate-900 text-base font-serif">Known gaps</h3>
            <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
              Voice output quality varies by language and device. Some official scheme portals we link out to are not themselves accessible; we describe each application step in text so you can complete it at a Common Service Centre instead.
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-[#0f3d2e] px-5 py-2 text-xs font-bold text-white hover:bg-emerald-950 transition"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
}
