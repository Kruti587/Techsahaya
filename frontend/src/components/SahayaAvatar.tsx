import { useEffect, useRef, useState } from "react";

export type AvatarState = "idle" | "listening" | "thinking" | "speaking" | "happy";

// Each state is a blob defined as 8 radii around a circle (0°, 45°, 90°...).
// Interpolating radii (not raw path strings) keeps the morph smooth and cheap.
const BLOB_STATES: Record<AvatarState, number[]> = {
  idle:      [30, 30, 30, 30, 30, 30, 30, 30],
  listening: [34, 28, 34, 28, 34, 28, 34, 28], // gentle wobble
  thinking:  [26, 32, 24, 34, 26, 32, 24, 34], // asymmetric, restless
  speaking:  [32, 30, 36, 28, 32, 30, 36, 28], // pulses on the beat of playAudio
  happy:     [36, 26, 36, 26, 36, 26, 36, 26], // bouncy
};

function blobPath(radii: number[], cx = 40, cy = 40): string {
  const pts = radii.map((r, i) => {
    const angle = (Math.PI * 2 * i) / radii.length - Math.PI / 2;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  });
  // Catmull-Rom -> cubic bezier through the points for a smooth closed blob
  const d = pts.map(([x, y], i) => {
    const [px, py] = pts[(i - 1 + pts.length) % pts.length];
    const [nx, ny] = pts[(i + 1) % pts.length];
    const cx1 = px + (x - px) / 2, cy1 = py + (y - py) / 2;
    const cx2 = x + (nx - x) / 2, cy2 = y + (ny - y) / 2;
    return i === 0 ? `M ${x} ${y}` : `C ${cx1} ${cy1} ${x} ${y} ${x} ${y}`;
  });
  return d.join(" ") + " Z";
}

function lerp(a: number[], b: number[], t: number) {
  return a.map((v, i) => v + (b[i] - v) * t);
}

export function SahayaAvatar({ state = "idle", size = 28 }: { state?: AvatarState; size?: number }) {
  const [radii, setRadii] = useState(BLOB_STATES.idle);
  const fromRef = useRef(BLOB_STATES.idle);
  const targetRef = useRef(BLOB_STATES[state]);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    fromRef.current = radii;
    targetRef.current = BLOB_STATES[state];
    startRef.current = null;

    const durationMs = 450;
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

  // Idle breathing loop layered on top when nothing else is happening
  useEffect(() => {
    if (state !== "idle") return;
    let raf: number;
    const loop = (t: number) => {
      const breathe = Math.sin(t / 900) * 1.5;
      setRadii(BLOB_STATES.idle.map((r) => r + breathe));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [state]);

  return (
    <svg width={size} height={size} viewBox="0 0 80 80" role="img" aria-label={`Sahaya assistant — ${state}`}>
      <path d={blobPath(radii)} fill="currentColor" />
      {/* eyes: two small circles, only shown above a size where they read clearly */}
      {size >= 24 && (
        <>
          <circle cx="32" cy="38" r="3.5" fill="white" />
          <circle cx="48" cy="38" r="3.5" fill="white" />
        </>
      )}
    </svg>
  );
}
