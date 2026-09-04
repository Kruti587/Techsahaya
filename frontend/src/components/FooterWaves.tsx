export function FooterWaves() {
  return (
    <div className="relative w-full overflow-hidden bg-sahaya-ink" aria-hidden="true">
      <style>{`
        @keyframes sahayaWave1 { 0%{transform:translateY(0) scaleY(1);} 50%{transform:translateY(-10px) scaleY(1.12);} 100%{transform:translateY(-4px) scaleY(0.95);} }
        @keyframes sahayaWave2 { 0%{transform:translateY(0) scaleY(1);} 40%{transform:translateY(8px) scaleY(0.88);} 100%{transform:translateY(4px) scaleY(1.08);} }
        @keyframes sahayaWave3 { 0%{transform:translateY(0) scaleY(1);} 50%{transform:translateY(-7px) scaleY(1.1);} 100%{transform:translateY(3px) scaleY(0.94);} }
        .sahaya-wave-1 { animation: sahayaWave1 8s ease-in-out infinite alternate; transform-origin: center bottom; }
        .sahaya-wave-2 { animation: sahayaWave2 11s ease-in-out infinite alternate; transform-origin: center bottom; }
        .sahaya-wave-3 { animation: sahayaWave3 7s ease-in-out infinite alternate; transform-origin: center bottom; }
      `}</style>
      <svg
        className="relative -left-[10%] block h-[110px] w-[120%]"
        viewBox="0 0 1440 140"
        preserveAspectRatio="none"
      >
        {/* deep green base layer */}
        <path
          className="sahaya-wave-1"
          fill="rgba(15, 61, 46, 0.45)"
          d="M0,40L48,50C96,60,192,80,288,85C384,90,480,80,576,68C672,56,768,44,864,50C960,56,1056,78,1152,84C1248,90,1344,80,1392,74L1440,68L1440,0L0,0Z"
        />
        {/* saffron accent layer */}
        <path
          className="sahaya-wave-2"
          fill="rgba(184, 92, 0, 0.25)"
          d="M0,68L48,62C96,56,192,44,288,50C384,56,480,78,576,78C672,78,768,56,864,50C960,44,1056,56,1152,62C1248,68,1344,68,1392,68L1440,68L1440,0L0,0Z"
        />
        {/* sand highlight layer */}
        <path
          className="sahaya-wave-3"
          fill="rgba(247, 246, 242, 0.3)"
          d="M0,84L60,76C120,68,240,52,360,57C480,62,600,88,720,92C840,96,960,80,1080,74C1200,68,1320,74,1380,77L1440,80L1440,0L0,0Z"
        />
        {/* solid ink base so text above always has contrast */}
        <path
          fill="#17342c"
          d="M0,100L80,95C160,90,320,80,480,85C640,90,800,102,960,102C1120,102,1280,90,1360,84L1440,78L1440,140L0,140Z"
        />
      </svg>
    </div>
  );
}
