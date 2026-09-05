import React from "react";

interface TechSahayaLoaderProps {
  size?: number;
  color?: string; // Optional override for single-color mode
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

export function TechSahayaLoader({
  size = 80,
  color,
  text = "Loading ...",
  fullScreen = false,
  className = "",
}: TechSahayaLoaderProps) {
  // Vibrant, high-contrast colors inspired by the Indian tricolor & Tech Sahaya identity:
  // Saffron (#f59e0b), Radiant Emerald (#10b981), and Royal Cyan (#0284c7)
  const outerColor = color || "#f59e0b"; // Saffron gold
  const middleColor = color || "#10b981"; // Vibrant Emerald
  const innerColor = color || "#0284c7"; // Royal Cyan / Sapphire

  const content = (
    <div className={`flex flex-col items-center justify-center gap-4 p-4 ${className}`}>
      {/* High-visibility orbital rotating spinner with drop shadow */}
      <svg
        version="1.1"
        id="TechSahayaL7"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        width={size}
        height={size}
        viewBox="0 0 100 100"
        enableBackground="new 0 0 100 100"
        xmlSpace="preserve"
        style={{ filter: "drop-shadow(0 4px 10px rgba(245, 158, 11, 0.35))" }}
      >
        {/* Outer Orbit: 2s clockwise rotation */}
        <path
          fill={outerColor}
          d="M31.6,3.5C5.9,13.6-6.6,42.7,3.5,68.4c10.1,25.7,39.2,38.3,64.9,28.1l-3.1-7.9c-21.3,8.4-45.4-2-53.8-23.3 c-8.4-21.3,2-45.4,23.3-53.8L31.6,3.5z"
        >
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="rotate"
            dur="2s"
            from="0 50 50"
            to="360 50 50"
            repeatCount="indefinite"
          />
        </path>

        {/* Middle Orbit: 1s counter-clockwise rotation */}
        <path
          fill={middleColor}
          d="M42.3,39.6c5.7-4.3,13.9-3.1,18.1,2.7c4.3,5.7,3.1,13.9-2.7,18.1l4.1,5.5c8.8-6.5,10.6-19,4.1-27.7 c-6.5-8.8-19-10.6-27.7-4.1L42.3,39.6z"
        >
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="rotate"
            dur="1s"
            from="0 50 50"
            to="-360 50 50"
            repeatCount="indefinite"
          />
        </path>

        {/* Inner Orbit: 2s clockwise rotation */}
        <path
          fill={innerColor}
          d="M82,35.7C74.1,18,53.4,10.1,35.7,18S10.1,46.6,18,64.3l7.6-3.4c-6-13.5,0-29.3,13.5-35.3s29.3,0,35.3,13.5 L82,35.7z"
        >
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="rotate"
            dur="2s"
            from="0 50 50"
            to="360 50 50"
            repeatCount="indefinite"
          />
        </path>
      </svg>

      {/* Moving animated text: High contrast and clearly visible */}
      {text && (
        <div className="flex items-center gap-1.5 font-mono text-sm font-extrabold tracking-widest uppercase text-slate-900 bg-white/90 px-3.5 py-1 rounded-full border border-stone-200 shadow-sm">
          <span className="bg-gradient-to-r from-amber-600 via-emerald-700 to-amber-600 bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient-x font-bold">
            {text}
          </span>
          <span className="inline-flex text-sahaya-saffron font-black">
            <span className="animate-bounce text-base" style={{ animationDelay: "0ms" }}>.</span>
            <span className="animate-bounce text-base" style={{ animationDelay: "150ms" }}>.</span>
            <span className="animate-bounce text-base" style={{ animationDelay: "300ms" }}>.</span>
          </span>
        </div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md animate-fade-in">
        <div className="rounded-3xl border border-stone-200 bg-white/95 p-8 shadow-2xl">
          {content}
        </div>
      </div>
    );
  }

  return content;
}
