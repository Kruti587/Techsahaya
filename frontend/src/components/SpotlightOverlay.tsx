import React, { useMemo } from "react";
import { ArrowLeft, ArrowRight, Check, Compass, Sparkles, X } from "lucide-react";
import { useTour } from "../context/TourContext";

export function SpotlightOverlay() {
  const { activeTour, currentStepIndex, currentStep, targetRect, nextStep, prevStep, endTour, isElementFound } = useTour();

  if (!activeTour || !currentStep) {
    return null;
  }

  const padding = 8;
  const isLastStep = currentStepIndex === activeTour.steps.length - 1;

  // Compute tooltip position
  const tooltipStyle = useMemo(() => {
    if (!targetRect) {
      // Fallback: center in viewport
      return {
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      };
    }

    const cardWidth = 360;
    const cardHeight = 220;
    const margin = 16;

    let top = targetRect.bottom + margin;
    let left = targetRect.left + targetRect.width / 2 - cardWidth / 2;

    // Check bottom boundary overflow
    if (top + cardHeight > window.innerHeight) {
      top = Math.max(margin, targetRect.top - cardHeight - margin);
    }

    // Check horizontal boundaries
    if (left < margin) {
      left = margin;
    } else if (left + cardWidth > window.innerWidth - margin) {
      left = window.innerWidth - cardWidth - margin;
    }

    return {
      top: `${top}px`,
      left: `${left}px`,
    };
  }, [targetRect]);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* SVG Backdrop Mask */}
      <svg className="absolute inset-0 h-full w-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <mask id="spotlight-mask">
            {/* White background: dark overlay */}
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {/* Black cutout: fully transparent window */}
            {targetRect && isElementFound && (
              <rect
                x={targetRect.left - padding}
                y={targetRect.top - padding}
                width={targetRect.width + padding * 2}
                height={targetRect.height + padding * 2}
                rx="12"
                ry="12"
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(15, 23, 42, 0.72)"
          mask="url(#spotlight-mask)"
        />
      </svg>

      {/* Target Element Glow Ring */}
      {targetRect && isElementFound && (
        <div
          style={{
            top: `${targetRect.top - padding}px`,
            left: `${targetRect.left - padding}px`,
            width: `${targetRect.width + padding * 2}px`,
            height: `${targetRect.height + padding * 2}px`,
          }}
          className="pointer-events-none absolute rounded-xl border-2 border-emerald-400 shadow-[0_0_25px_rgba(52,211,153,0.7)] animate-pulse"
        />
      )}

      {/* Interactive Tooltip Card */}
      <div
        style={tooltipStyle}
        className="pointer-events-auto absolute z-50 w-[92vw] max-w-[380px] rounded-2xl border border-emerald-100 bg-white p-5 shadow-2xl transition-all duration-300 animate-in fade-in zoom-in-95"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tour-step-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
              <Compass size={16} />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
              {activeTour.title}
            </span>
          </div>
          <button
            type="button"
            onClick={endTour}
            className="rounded-lg p-1 text-slate-400 hover:bg-stone-100 hover:text-slate-700 transition"
            aria-label="Close tour"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="mt-3">
          <div className="text-xs font-medium text-emerald-600">
            Step {currentStepIndex + 1} of {activeTour.steps.length}
          </div>
          <h3 id="tour-step-title" className="text-base font-bold text-slate-900 mt-0.5">
            {currentStep.title}
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
            {currentStep.description}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-stone-100">
          <div
            className="h-full bg-emerald-600 transition-all duration-300"
            style={{ width: `${((currentStepIndex + 1) / activeTour.steps.length) * 100}%` }}
          />
        </div>

        {/* Footer Buttons */}
        <div className="mt-4 flex items-center justify-between gap-2 pt-2 border-t border-stone-100">
          <button
            type="button"
            onClick={endTour}
            className="text-xs font-medium text-slate-500 hover:text-slate-800 px-2 py-1.5"
          >
            Skip Tour
          </button>

          <div className="flex items-center gap-2">
            {currentStepIndex > 0 && (
              <button
                type="button"
                onClick={prevStep}
                className="inline-flex items-center gap-1 rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-stone-50 transition"
              >
                <ArrowLeft size={14} /> Back
              </button>
            )}
            <button
              type="button"
              onClick={nextStep}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition"
            >
              {isLastStep ? (
                <>
                  <Check size={14} /> Finish
                </>
              ) : (
                <>
                  Next <ArrowRight size={14} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
