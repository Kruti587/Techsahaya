import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Check, ChevronDown, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface OnboardingStep {
  id: number | string;
  title: string;
  description?: string;
  isCompleted: boolean;
  route?: string;
  onClick?: () => void;
}

export interface OnboardingChecklistProps {
  steps: OnboardingStep[];
  title?: string;
  subtitle?: string;
  onStepClick?: (step: OnboardingStep) => void;
  defaultExpanded?: boolean;
}

export function OnboardingChecklist({
  steps,
  title = "Getting Started",
  subtitle = "Complete these key steps to maximize your welfare benefits",
  onStepClick,
  defaultExpanded = true,
}: OnboardingChecklistProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const navigate = useNavigate();

  const completedCount = steps.filter((s) => s.isCompleted).length;
  const totalCount = steps.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const isAllComplete = completedCount === totalCount && totalCount > 0;

  const handleStepClick = (step: OnboardingStep) => {
    if (step.onClick) {
      step.onClick();
    } else if (step.route) {
      navigate(step.route);
    }
    if (onStepClick) {
      onStepClick(step);
    }
  };

  return (
    <div className="w-full overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-card transition-all duration-300">
      {/* Header Bar */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between gap-3 p-5 text-left transition hover:bg-stone-50/70 focus:outline-none"
        aria-expanded={isExpanded}
        aria-label={`${title} Checklist (${completedCount} of ${totalCount} completed)`}
      >
        <div className="flex items-center gap-3.5">
          <div className="flex h-10 w-10 min-w-[40px] items-center justify-center rounded-2xl bg-emerald-50 text-sahaya-green shadow-sm">
            {isAllComplete ? <Check size={20} className="stroke-[3]" /> : <Sparkles size={20} className="text-sahaya-saffron" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-sahaya-ink sm:text-lg">{title}</h2>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-sahaya-green">
                {completedCount}/{totalCount}
              </span>
            </div>
            <p className="text-xs text-slate-500 line-clamp-1">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Circular/Linear Progress Indicator on Header */}
          <div className="hidden items-center gap-2.5 sm:flex">
            <div className="h-2 w-24 overflow-hidden rounded-full bg-stone-100">
              <motion.div
                className="h-full rounded-full bg-sahaya-green"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
            <span className="text-xs font-semibold text-slate-600">{progressPercent}%</span>
          </div>

          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:text-slate-700"
          >
            <ChevronDown size={18} />
          </motion.div>
        </div>
      </button>

      {/* Progress Line on Mobile */}
      <div className="h-1 w-full bg-stone-100 sm:hidden">
        <motion.div
          className="h-full bg-sahaya-green"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      {/* Collapsible Content */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden border-t border-stone-100"
          >
            <div className="space-y-2 p-4 sm:p-5">
              {steps.map((step, index) => {
                const isActionable = Boolean(step.route || step.onClick);

                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.2 }}
                    onClick={() => isActionable && handleStepClick(step)}
                    role={isActionable ? "button" : undefined}
                    tabIndex={isActionable ? 0 : undefined}
                    onKeyDown={(e) => {
                      if (isActionable && (e.key === "Enter" || e.key === " ")) {
                        e.preventDefault();
                        handleStepClick(step);
                      }
                    }}
                    className={`group flex items-center justify-between gap-3.5 rounded-2xl border p-3.5 transition-all duration-200 ${
                      step.isCompleted
                        ? "border-emerald-100 bg-emerald-50/40 text-slate-700"
                        : "border-stone-200 bg-white text-slate-800 hover:border-emerald-300 hover:bg-stone-50/70"
                    } ${isActionable ? "cursor-pointer active:scale-[0.99]" : ""}`}
                  >
                    {/* Left Icon + Text */}
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Checkbox Icon */}
                      <div
                        className={`flex h-7 w-7 min-w-[28px] items-center justify-center rounded-xl transition-colors duration-200 ${
                          step.isCompleted
                            ? "bg-sahaya-green text-white shadow-sm"
                            : "border-2 border-stone-300 bg-white text-transparent group-hover:border-emerald-400"
                        }`}
                      >
                        <Check size={14} className="stroke-[3]" />
                      </div>

                      <div className="min-w-0">
                        <span
                          className={`text-sm font-semibold leading-tight line-clamp-1 ${
                            step.isCompleted ? "text-slate-600 line-through opacity-80" : "text-sahaya-ink"
                          }`}
                        >
                          {step.title}
                        </span>
                        {step.description && (
                          <p className="mt-0.5 text-xs text-slate-500 line-clamp-1">{step.description}</p>
                        )}
                      </div>
                    </div>

                    {/* Right Arrow / Status */}
                    <div className="flex items-center gap-2 text-xs font-semibold shrink-0">
                      {step.isCompleted ? (
                        <span className="text-emerald-700">Done</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-slate-400 transition-colors group-hover:text-sahaya-green">
                          <span className="hidden sm:inline">Start</span>
                          <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
