import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Check, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";
import { cn } from "../lib/utils";

interface SaveButtonProps {
  text?: {
    idle?: string;
    saving?: string;
    saved?: string;
  };
  className?: string;
  onSave?: () => Promise<void> | void;
  particleCount?: number;
  spread?: number;
  y?: number;
  scale?: number;
}

export function SaveButton({
  text = {
    idle: "Save and continue →",
    saving: "Saving & Verifying...",
    saved: "Saved Successfully!",
  },
  className,
  onSave,
  particleCount = 100,
  spread = 70,
  y = 0.6,
  scale = 1,
}: SaveButtonProps) {
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [bounce, setBounce] = useState(false);
  const isDark = typeof document !== "undefined" && document.documentElement.classList.contains("dark");

  const handleSave = async () => {
    if (status === "idle") {
      setStatus("saving");
      try {
        if (onSave) {
          await onSave();
        } else {
          // Simulation fallback
          await new Promise((resolve) => setTimeout(resolve, 1500));
        }
        setStatus("saved");
        setBounce(true);
        confetti({
          particleCount,
          spread,
          scalar: scale,
          origin: { y },
          colors: [
            "#10b981",
            "#059669",
            "#047857",
            "#f59e0b",
            "#d97706",
            "#34d399",
          ],
          shapes: ["star", "circle"],
        });
        setTimeout(() => {
          setStatus("idle");
          setBounce(false);
        }, 2500);
      } catch (error) {
        setStatus("idle");
        console.error("Save failed:", error);
      }
    }
  };

  const buttonVariants = {
    idle: {
      backgroundColor: isDark ? "rgb(64, 64, 64)" : "#0f3d2e",
      color: "white",
      scale: 1,
    },
    saving: {
      backgroundColor: "rgb(16, 185, 129)",
      color: "white",
      scale: 1,
    },
    saved: {
      backgroundColor: "rgb(5, 150, 105)",
      color: "white",
      scale: [1, 1.05, 1],
      transition: {
        duration: 0.2,
        times: [0, 0.5, 1],
      },
    },
  };

  const sparkleVariants = {
    initial: { opacity: 0, scale: 0 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0 },
  };

  return (
    <div className="relative inline-block">
      <motion.button
        type="button"
        onClick={handleSave}
        animate={status}
        variants={buttonVariants}
        className={cn(
          "group relative grid overflow-hidden rounded-xl px-7 py-3 transition-all duration-200 cursor-pointer",
          status === "idle"
            ? "shadow-md hover:shadow-lg hover:bg-emerald-900"
            : "",
          className
        )}
        style={{ minWidth: "180px" }}
        whileHover={status === "idle" ? { scale: 1.02 } : {}}
        whileTap={status === "idle" ? { scale: 0.98 } : {}}
      >
        {status === "idle" && (
          <span className="pointer-events-none">
            <span
              className={cn(
                "spark mask-gradient absolute inset-0 h-[100%] w-[100%] animate-flip overflow-hidden rounded-xl",
                "[mask:linear-gradient(black,_transparent_50%)] before:absolute before:aspect-square before:w-[200%] before:bg-[conic-gradient(from_0deg,transparent_0_340deg,rgba(16,185,129,0.5)_360deg)]",
                "before:rotate-[-90deg] before:animate-rotate",
                "before:content-[''] before:[inset:0_auto_auto_50%] before:[translate:-50%_-15%]"
              )}
            />
          </span>
        )}
        <span className="z-10 flex items-center justify-center gap-2 text-sm font-bold text-white">
          <AnimatePresence mode="wait">
            {status === "saving" && (
              <motion.span
                key="saving"
                initial={{ opacity: 0, rotate: 0 }}
                animate={{ opacity: 1, rotate: 360 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.3,
                  rotate: {
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 1,
                    ease: "linear",
                  },
                }}
              >
                <Loader2 className="w-4 h-4 text-white" />
              </motion.span>
            )}
            {status === "saved" && (
              <motion.span
                key="saved"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                <Check className="w-4 h-4 text-white" />
              </motion.span>
            )}
          </AnimatePresence>
          <motion.span
            key={status}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {status === "idle"
              ? text.idle
              : status === "saving"
              ? text.saving
              : text.saved}
          </motion.span>
        </span>
      </motion.button>
      <AnimatePresence>
        {bounce && (
          <motion.div
            className="absolute -top-2 -right-2 pointer-events-none"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={sparkleVariants}
          >
            <Sparkles className="w-6 h-6 text-amber-400" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SaveButton;
