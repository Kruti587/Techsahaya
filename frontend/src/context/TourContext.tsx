import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { TOURS_REGISTRY, type TourDefinition, type TourStep } from "../data/tours";
import { api } from "../services/api";

interface TourContextType {
  activeTour: TourDefinition | null;
  currentStepIndex: number;
  currentStep: TourStep | null;
  targetRect: DOMRect | null;
  startTour: (tourId: string, params?: Record<string, any>) => boolean;
  nextStep: () => void;
  prevStep: () => void;
  endTour: () => void;
  isElementFound: boolean;
}

const TourContext = createContext<TourContextType | null>(null);

export function TourProvider({ children }: { children: React.ReactNode }) {
  const [tours, setTours] = useState<Record<string, TourDefinition>>(TOURS_REGISTRY);
  const [activeTour, setActiveTour] = useState<TourDefinition | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [isElementFound, setIsElementFound] = useState<boolean>(false);

  const navigate = useNavigate();
  const location = useLocation();
  const observerRef = useRef<MutationObserver | null>(null);

  // Load tours from backend config if available
  useEffect(() => {
    api.get("/api/config/tours")
      .then((res) => {
        if (res.data?.tours && Array.isArray(res.data.tours)) {
          const map: Record<string, TourDefinition> = {};
          res.data.tours.forEach((t: TourDefinition) => {
            map[t.id] = t;
          });
          setTours((prev) => ({ ...prev, ...map }));
        }
      })
      .catch(() => undefined);
  }, []);

  const currentStep = activeTour && activeTour.steps[currentStepIndex] ? activeTour.steps[currentStepIndex] : null;

  const updateTargetPosition = useCallback(() => {
    if (!currentStep) {
      setTargetRect(null);
      setIsElementFound(false);
      return;
    }

    const el = document.querySelector<HTMLElement>(currentStep.targetSelector);
    if (el) {
      const rect = el.getBoundingClientRect();
      setTargetRect(rect);
      setIsElementFound(true);

      // Scroll into view if needed
      if (rect.top < 0 || rect.bottom > window.innerHeight) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      // Execute optional step action
      if (currentStep.action === "focus") {
        el.focus?.();
      }
    } else {
      setTargetRect(null);
      setIsElementFound(false);
    }
  }, [currentStep]);

  // Navigate route and observe element mount
  useEffect(() => {
    if (!activeTour || !currentStep) return;

    // Check if route navigation is needed
    if (currentStep.route && location.pathname !== currentStep.route) {
      navigate(currentStep.route);
      return;
    }

    // Try finding element immediately
    updateTargetPosition();

    // Set up polling / observer to wait for element to appear
    let attempts = 0;
    const interval = setInterval(() => {
      attempts += 1;
      const el = document.querySelector<HTMLElement>(currentStep.targetSelector);
      if (el) {
        updateTargetPosition();
        clearInterval(interval);
      } else if (attempts >= 15) {
        clearInterval(interval);
        // If element never mounts after 3 seconds, gracefully end tour
        console.warn(`Tour step target not found: ${currentStep.targetSelector}`);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [activeTour, currentStep, location.pathname, navigate, updateTargetPosition]);

  // Track window resize & scroll
  useEffect(() => {
    if (!activeTour) return;

    const handleUpdate = () => updateTargetPosition();
    window.addEventListener("resize", handleUpdate);
    window.addEventListener("scroll", handleUpdate, true);

    return () => {
      window.removeEventListener("resize", handleUpdate);
      window.removeEventListener("scroll", handleUpdate, true);
    };
  }, [activeTour, updateTargetPosition]);

  const startTour = useCallback((tourId: string, params?: Record<string, any>): boolean => {
    const tour = tours[tourId];
    if (!tour || tour.steps.length === 0) {
      console.warn(`Tour "${tourId}" not found in registry.`);
      return false;
    }

    setActiveTour(tour);
    setCurrentStepIndex(0);
    setIsElementFound(false);

    // Initial navigation
    if (tour.steps[0].route && location.pathname !== tour.steps[0].route) {
      navigate(tour.steps[0].route);
    }

    return true;
  }, [tours, location.pathname, navigate]);

  const nextStep = useCallback(() => {
    if (!activeTour) return;
    if (currentStepIndex < activeTour.steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      endTour();
    }
  }, [activeTour, currentStepIndex]);

  const prevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  }, [currentStepIndex]);

  const endTour = useCallback(() => {
    setActiveTour(null);
    setCurrentStepIndex(0);
    setTargetRect(null);
    setIsElementFound(false);
  }, []);

  return (
    <TourContext.Provider
      value={{
        activeTour,
        currentStepIndex,
        currentStep,
        targetRect,
        startTour,
        nextStep,
        prevStep,
        endTour,
        isElementFound,
      }}
    >
      {children}
    </TourContext.Provider>
  );
}

export function useTour() {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error("useTour must be used within a TourProvider");
  }
  return context;
}
