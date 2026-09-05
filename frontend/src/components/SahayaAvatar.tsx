import { useEffect, useRef, useState } from "react";

export type AvatarState = "idle" | "listening" | "thinking" | "speaking" | "happy";

// Organic blob coordinates for the smooth morphing perimeter
const BLOB_STATES: Record<AvatarState, number[]> = {
  idle: [32, 32, 32, 32, 32, 32, 32, 32],
  listening: [35, 29, 36, 28, 35, 29, 36, 28], // subtle attentive tilt
  thinking: [28, 34, 26, 35, 28, 34, 26, 35], // curious asymmetric wiggle
  speaking: [34, 30, 37, 28, 34, 30, 37, 28], // squash and stretch rhythm
  happy: [37, 27, 37, 27, 37, 27, 37, 27], // bouncy squash
};

function blobPath(radii: number[], cx = 40, cy = 40): string {
  const pts = radii.map((r, i) => {
    const angle = (Math.PI * 2 * i) / radii.length - Math.PI / 2;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  });
  const d = pts.map(([x, y], i) => {
    const [px, py] = pts[(i - 1 + pts.length) % pts.length];
    const [nx, ny] = pts[(i + 1) % pts.length];
    const cx1 = px + (x - px) / 2,
      cy1 = py + (y - py) / 2;
    const cx2 = x + (nx - x) / 2,
      cy2 = y + (ny - y) / 2;
    return i === 0 ? `M ${x} ${y}` : `C ${cx1} ${cy1} ${x} ${y} ${x} ${y}`;
  });
  return d.join(" ") + " Z";
}

function lerp(a: number[], b: number[], t: number) {
  return a.map((v, i) => v + (b[i] - v) * t);
}

export function SahayaAvatar({
  state = "idle",
  size = 32,
  color = "#26baa3", // Authentic Bloub turquoise-emerald
}: {
  state?: AvatarState;
  size?: number;
  color?: string;
}) {
  const [radii, setRadii] = useState(BLOB_STATES.idle);
  const [isBlinking, setIsBlinking] = useState(false);
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const fromRef = useRef(BLOB_STATES.idle);
  const targetRef = useRef(BLOB_STATES[state]);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | undefined>(undefined);

  // Smooth blob shape morphing on state change
  useEffect(() => {
    fromRef.current = radii;
    targetRef.current = BLOB_STATES[state];
    startRef.current = null;

    const durationMs = 420;
    const tick = (t: number) => {
      if (startRef.current === null) startRef.current = t;
      const progress = Math.min(1, (t - startRef.current) / durationMs);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setRadii(lerp(fromRef.current, targetRef.current, eased));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== undefined) {
        cancelAnimationFrame(rafRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  // Gentle breathing loop when idle
  useEffect(() => {
    if (state !== "idle") return;
    let raf: number;
    const loop = (t: number) => {
      const breathe = Math.sin(t / 800) * 1.4;
      setRadii(BLOB_STATES.idle.map((r) => r + breathe));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [state]);

  // Bloub natural blinking loop (every 3 to 5 seconds)
  useEffect(() => {
    let blinkTimeout: ReturnType<typeof setTimeout>;
    let unblinkTimeout: ReturnType<typeof setTimeout>;

    const scheduleBlink = () => {
      const nextBlinkDelay = 2500 + Math.random() * 3000;
      blinkTimeout = setTimeout(() => {
        setIsBlinking(true);
        unblinkTimeout = setTimeout(() => {
          setIsBlinking(false);
          scheduleBlink();
        }, 160); // 160ms blink duration
      }, nextBlinkDelay);
    };

    scheduleBlink();

    return () => {
      clearTimeout(blinkTimeout);
      clearTimeout(unblinkTimeout);
    };
  }, []);

  // Bloub interactive eye tracking: eyes gently follow mouse cursor!
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const nx = (e.clientX / innerWidth - 0.5) * 6; // max +-3px dx
      const ny = (e.clientY / innerHeight - 0.5) * 5; // max +-2.5px dy
      setEyeOffset({ x: nx, y: ny });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Eye geometries based on state (matching Bloub specifications)
  const isThinking = state === "thinking";
  const isListening = state === "listening";
  const isSpeaking = state === "speaking";

  // Pill eye positions
  const eyeY = 36 + eyeOffset.y;
  const leftEyeX = 30 + eyeOffset.x;
  const rightEyeX = 47 + eyeOffset.x;

  // Eye dimensions:
  // - thinking: horizontal squished capsule (Image 2)
  // - blinking: thin horizontal slit
  // - idle/listening: vertical elongated capsule (Image 1)
  const eyeWidth = isThinking ? 11 : 7;
  const eyeHeight = isBlinking ? 1.5 : isThinking ? 6 : isListening ? 16 : isSpeaking ? 14 : 15;
  const eyeRadius = isThinking ? 3 : isBlinking ? 0.75 : 3.5;
  const eyeTransformLeft = isListening ? "rotate(8 33.5 43.5)" : "";
  const eyeTransformRight = isListening ? "rotate(8 50.5 43.5)" : "";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      role="img"
      aria-label={`Bloub Sahaya assistant - ${state}`}
      className="transition-transform duration-300 select-none overflow-visible"
    >
      <defs>
        {/* Soft radial shadow for Bloub depth */}
        <radialGradient id="bloubGlow" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.12" />
        </radialGradient>
      </defs>

      {/* Bloub Organic Morphing Body */}
      <path
        d={blobPath(radii)}
        fill={color}
        className="transition-colors duration-300 filter drop-shadow-sm"
      />

      {/* Subtle 3D gradient overlay */}
      <path d={blobPath(radii)} fill="url(#bloubGlow)" pointerEvents="none" />

      {/* Bloub Expressive White Capsule Eyes */}
      {size >= 20 && (
        <g className="transition-all duration-150 ease-out">
          {/* Left Capsule Eye */}
          <rect
            x={leftEyeX - eyeWidth / 2}
            y={eyeY - eyeHeight / 2}
            width={eyeWidth}
            height={eyeHeight}
            rx={eyeRadius}
            ry={eyeRadius}
            fill="#ffffff"
            transform={eyeTransformLeft}
            style={{
              transition: isBlinking ? "height 0.08s ease-in, y 0.08s ease-in" : "all 0.15s ease-out",
            }}
          />

          {/* Right Capsule Eye */}
          <rect
            x={rightEyeX - eyeWidth / 2}
            y={eyeY - eyeHeight / 2}
            width={eyeWidth}
            height={eyeHeight}
            rx={eyeRadius}
            ry={eyeRadius}
            fill="#ffffff"
            transform={eyeTransformRight}
            style={{
              transition: isBlinking ? "height 0.08s ease-in, y 0.08s ease-in" : "all 0.15s ease-out",
            }}
          />

          {/* Speaking bounce mouth or sparkle when happy/speaking */}
          {isSpeaking && size >= 32 && (
            <ellipse
              cx={40 + eyeOffset.x * 0.5}
              cy={51}
              rx={4}
              ry={3}
              fill="#ffffff"
              opacity={0.9}
              className="animate-pulse"
            />
          )}
        </g>
      )}
    </svg>
  );
}
