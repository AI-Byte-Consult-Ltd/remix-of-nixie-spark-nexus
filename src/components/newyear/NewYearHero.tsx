import HeroFly from "@/components/trading/HeroFly";
import { isNewYear } from "@/lib/newYear";

// New Year layer for the home hero (Alexander, 2026-10-31): Santa's sleigh
// pulled by flying reindeer, falling snowflakes and candy canes and the wasp
// in a Santa outfit (HeroFly). Static figures (snowmen, standing Santa, gift
// boxes) removed at Alexander's request 2026-11-12; only moving things stay.
// Renders nothing outside the dates in src/lib/newYear.ts. All decoration is
// aria-hidden and pointer-events none.

// Deterministic pseudo-random so the layout is the same on every render.
const rnd = (i: number, salt: number) => {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

const Snowflake = ({ size }: { size: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size}>
    <g stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" fill="none">
      {[0, 60, 120].map((a) => (
        <g key={a} transform={`rotate(${a} 12 12)`}>
          <line x1="12" y1="2" x2="12" y2="22" />
          <path d="M9.5 4.5 L12 7 L14.5 4.5 M9.5 19.5 L12 17 L14.5 19.5" />
        </g>
      ))}
    </g>
  </svg>
);

const CandyCane = ({ size }: { size: number }) => (
  <svg viewBox="0 0 24 40" width={size * 0.6} height={size}>
    <path d="M8 38 V12 a6 6 0 0 1 12 0 v3" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" fill="none" />
    <path
      d="M8 38 V12 a6 6 0 0 1 12 0 v3"
      stroke="#dc2626"
      strokeWidth="5"
      strokeLinecap="round"
      strokeDasharray="3.5 3.5"
      fill="none"
    />
  </svg>
);

const Reindeer = ({ x, lead = false }: { x: number; lead?: boolean }) => (
  <g transform={`translate(${x} 0)`}>
    <g className="ny-legs-a" stroke="#5b3a1e" strokeWidth="2.4" strokeLinecap="round">
      <line x1="10" y1="30" x2="5" y2="40" />
      <line x1="30" y1="30" x2="36" y2="39" />
    </g>
    <g className="ny-legs-b" stroke="#6b4423" strokeWidth="2.4" strokeLinecap="round">
      <line x1="13" y1="30" x2="15" y2="41" />
      <line x1="27" y1="30" x2="26" y2="41" />
    </g>
    <ellipse cx="20" cy="26" rx="15" ry="7.5" fill="#8b5a2b" />
    <ellipse cx="18" cy="28" rx="8" ry="3" fill="#c49a6c" />
    <path d="M4 24 q-4 -2 -3 -6 q3 1 5 4 z" fill="#f5f5f4" />
    <path d="M32 22 q4 -8 8 -10" stroke="#8b5a2b" strokeWidth="6" strokeLinecap="round" fill="none" />
    <ellipse cx="44" cy="11" rx="6.5" ry="4.5" fill="#8b5a2b" />
    <circle cx="44" cy="9" r="1.1" fill="#111827" />
    <circle cx="50.5" cy="12" r={lead ? 2.6 : 1.6} fill={lead ? "#ef4444" : "#3f2a16"} />
    {lead && <circle cx="50.5" cy="12" r="5" fill="#ef4444" fillOpacity="0.25" />}
    <g stroke="#a16207" strokeWidth="1.6" strokeLinecap="round" fill="none">
      <path d="M41 7 q-2 -6 1 -9 M41 3 q-3 -1 -4 -4" />
      <path d="M45 6 q1 -6 5 -8 M47.5 2 q2 -2 1.5 -5" />
    </g>
    <path d="M38 8 q-4 -2 -5 1 q3 1 5 0 z" fill="#6b4423" />
    <rect x="31" y="17" width="5" height="3" rx="1" fill="#dc2626" transform="rotate(-50 33 18)" />
  </g>
);

const Sleigh = () => (
  <svg viewBox="0 -8 230 64" className="ny-sleigh-svg overflow-visible">
    {/* reins from Santa to both reindeer */}
    <path d="M36 16 Q80 10 124 17 M124 17 Q150 12 182 17" stroke="#fbbf24" strokeWidth="1.2" fill="none" />
    <Reindeer x={92} />
    <Reindeer x={150} lead />
    {/* sleigh */}
    <g transform="translate(0 0)">
      <path d="M2 46 H66 q8 0 10 -8" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M8 44 L6 28 Q6 24 12 24 H52 Q60 24 62 18 L66 12 Q70 12 70 20 L64 40 Q62 44 56 44 Z" fill="#b91c1c" />
      <path d="M10 38 H60" stroke="#fbbf24" strokeWidth="1.4" />
      {/* gift sack */}
      <path d="M44 24 q-4 -14 4 -18 q10 -2 12 6 q2 8 -4 12 z" fill="#92400e" />
      <path d="M47 7 q3 -3 7 0" stroke="#fbbf24" strokeWidth="1.4" fill="none" />
      {/* Santa */}
      <path d="M16 26 q0 -16 12 -16 q12 0 12 16 z" fill="#dc2626" />
      <circle cx="28" cy="8" r="6" fill="#fcd9b6" />
      <path d="M21 9 q1 10 7 10 q6 0 7 -10 q-3 3 -7 2 q-4 1 -7 -2 z" fill="#f8fafc" />
      <path d="M22 4 Q26 -6 34 -2 Q31 0 33 4 Z" fill="#dc2626" />
      <rect x="20.5" y="2.5" width="15" height="3.4" rx="1.7" fill="#f8fafc" />
      <circle cx="35" cy="-2" r="2.2" fill="#f8fafc" />
      <path d="M16 18 q-6 -2 -10 2" stroke="#dc2626" strokeWidth="4" strokeLinecap="round" fill="none" />
    </g>
  </svg>
);

const SNOWFLAKES = Array.from({ length: 26 }, (_, i) => ({
  left: rnd(i, 1) * 100,
  size: 8 + rnd(i, 2) * 12,
  duration: 9 + rnd(i, 3) * 9,
  delay: -rnd(i, 4) * 18,
  drift: (rnd(i, 5) - 0.5) * 60,
  opacity: 0.55 + rnd(i, 6) * 0.4,
}));

const CANES = Array.from({ length: 7 }, (_, i) => ({
  left: 5 + rnd(i, 7) * 90,
  size: 30 + rnd(i, 8) * 12,
  duration: 11 + rnd(i, 9) * 6,
  delay: -rnd(i, 10) * 17,
  spin: rnd(i, 11) < 0.5 ? -1 : 1,
}));

const NewYearHero = () => {
  if (!isNewYear()) return null;

  return (
    <>
      <style>{`
        @keyframes ny-fall {
          0% { transform: translate3d(0, -12vh, 0) rotate(0deg); }
          100% { transform: translate3d(var(--ny-drift, 0px), 112vh, 0) rotate(calc(var(--ny-spin, 1) * 360deg)); }
        }
        @keyframes ny-sleigh-fly {
          0% { transform: translate(-260px, 0) rotate(-4deg); }
          25% { transform: translate(25vw, -3vh) rotate(-2deg); }
          50% { transform: translate(55vw, 2vh) rotate(-5deg); }
          75% { transform: translate(85vw, -4vh) rotate(-3deg); }
          100% { transform: translate(calc(100vw + 40px), -1vh) rotate(-6deg); }
        }
        @keyframes ny-gallop { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(14deg); } }
        .ny-fall { position: absolute; top: 0; animation: ny-fall linear infinite; will-change: transform; }
        .ny-sleigh { position: absolute; left: 0; width: 230px; animation: ny-sleigh-fly 24s linear infinite; }
        .ny-legs-a, .ny-legs-b { transform-box: fill-box; transform-origin: top center; animation: ny-gallop 0.5s ease-in-out infinite; }
        .ny-legs-b { animation-delay: -0.25s; }
        @media (max-width: 640px) { .ny-sleigh { width: 160px; } }
        @media (prefers-reduced-motion: reduce) {
          .ny-fall, .ny-legs-a, .ny-legs-b { animation: none; }
          .ny-fall { display: none; }
          .ny-sleigh { animation: none; left: auto; right: 8%; }
        }
      `}</style>

      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[7] overflow-hidden">
        {SNOWFLAKES.map((f, i) => (
          <div
            key={`s${i}`}
            className="ny-fall"
            style={{
              left: `${f.left}%`,
              opacity: f.opacity,
              animationDuration: `${f.duration}s`,
              animationDelay: `${f.delay}s`,
              ["--ny-drift" as string]: `${f.drift}px`,
            }}
          >
            <Snowflake size={f.size} />
          </div>
        ))}
        {CANES.map((c, i) => (
          <div
            key={`c${i}`}
            className="ny-fall"
            style={{
              left: `${c.left}%`,
              animationDuration: `${c.duration}s`,
              animationDelay: `${c.delay}s`,
              ["--ny-spin" as string]: c.spin,
            }}
          >
            <CandyCane size={c.size} />
          </div>
        ))}
        <div className="ny-sleigh top-[16%]">
          <Sleigh />
        </div>
      </div>
      <HeroFly />
    </>
  );
};

export default NewYearHero;
