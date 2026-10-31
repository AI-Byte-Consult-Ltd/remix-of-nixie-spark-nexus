import { useEffect, useRef } from "react";
import { isHalloween } from "@/lib/halloween";
import { isNewYear } from "@/lib/newYear";

// A cartoon fly in a helmet that wanders around the /trading hero. Pure
// decoration: aria-hidden, pointer-events none (never blocks a click), moved by
// one requestAnimationFrame loop writing a transform (no React re-renders),
// paused while the hero is off screen or the tab is hidden. With
// prefers-reduced-motion it just sits still in a corner. Until the end of
// Halloween (src/lib/halloween.ts) it wears a witch hat instead of the helmet.
// During the New Year theme (src/lib/newYear.ts) the fly is replaced by a wasp
// dressed as Santa Claus (red coat, belt, hat, white beard).

const SIZE = 56;

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export type FlyCostume = "helmet" | "witch";

export const FlySvg = ({ size = SIZE, costume = "helmet" }: { size?: number; costume?: FlyCostume }) => (
  <svg viewBox="0 0 64 64" width={size} height={size} className="overflow-visible drop-shadow-md">
    {/* wings */}
    <g className="hero-fly-wings" style={{ transformOrigin: "30px 26px" }}>
      <ellipse cx="22" cy="16" rx="9" ry="15" transform="rotate(-35 22 16)" fill="#dbeafe" fillOpacity="0.75" stroke="#93c5fd" strokeWidth="1.2" />
      <ellipse cx="34" cy="14" rx="8" ry="14" transform="rotate(20 34 14)" fill="#e0f2fe" fillOpacity="0.7" stroke="#93c5fd" strokeWidth="1.2" />
    </g>
    {/* legs */}
    <g stroke="#1f2937" strokeWidth="1.8" strokeLinecap="round" fill="none">
      <path d="M22 40 q-3 6 -7 7" />
      <path d="M28 42 q0 6 -3 9" />
      <path d="M34 41 q3 6 2 9" />
    </g>
    {/* shiny green-blue body, like a real housefly */}
    <ellipse cx="24" cy="34" rx="15" ry="10" fill="#0f766e" />
    <path d="M17 26 q-3 8 0 16" stroke="#134e4a" strokeWidth="2" fill="none" />
    <path d="M25 24.5 q-3 9.5 0 19" stroke="#134e4a" strokeWidth="2" fill="none" />
    <ellipse cx="22" cy="29" rx="7" ry="2.5" fill="#5eead4" fillOpacity="0.55" />
    {/* head */}
    <circle cx="44" cy="32" r="11" fill="#4b5563" />
    {/* big eyes */}
    <circle cx="47" cy="29" r="6.5" fill="#ef4444" />
    <circle cx="49" cy="27" r="2.2" fill="#fff" />
    <circle cx="45.5" cy="31" r="1" fill="#fff" />
    {/* smile */}
    <path d="M44 38 q4 3.5 8 -0.5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" fill="none" />
    {costume === "witch" ? (
      // witch hat: purple cone with a bent tip, orange band and buckle
      <g transform="rotate(-8 44 22)">
        <ellipse cx="44" cy="23.5" rx="13.5" ry="3.2" fill="#3b0764" />
        <path d="M36.5 23 L43 6 Q45 1 50 3.5 Q46 5 46.5 9 L52 23 Z" fill="#6d28d9" stroke="#3b0764" strokeWidth="1" />
        <rect x="37.6" y="18.8" width="13.6" height="3" fill="#f97316" />
        <rect x="42.6" y="18.3" width="3.6" height="4" rx="0.6" fill="none" stroke="#fde047" strokeWidth="1" />
      </g>
    ) : (
      <>
        {/* helmet with visor and a little antenna light */}
        <path d="M33 28 a11.5 11.5 0 0 1 22 -2 l-2 2 h-18 z" fill="#f59e0b" stroke="#b45309" strokeWidth="1.2" />
        <rect x="34" y="26.5" width="20" height="3" rx="1.5" fill="#b45309" />
        <line x1="44" y1="17.5" x2="44" y2="13" stroke="#b45309" strokeWidth="1.5" />
        <circle cx="44" cy="12" r="2" fill="#22c55e" />
      </>
    )}
  </svg>
);

// Wasp in a Santa Claus outfit, same 64x64 box and orientation as the fly
// (head on the right) so the flight loop and flipping work unchanged.
export const SantaWaspSvg = ({ size = SIZE }: { size?: number }) => (
  <svg viewBox="0 0 64 64" width={size} height={size} className="overflow-visible drop-shadow-md">
    {/* wings */}
    <g className="hero-fly-wings" style={{ transformOrigin: "32px 26px" }}>
      <ellipse cx="25" cy="16" rx="7" ry="14" transform="rotate(-30 25 16)" fill="#e0f2fe" fillOpacity="0.75" stroke="#7dd3fc" strokeWidth="1.1" />
      <ellipse cx="35" cy="15" rx="6" ry="12" transform="rotate(18 35 15)" fill="#f0f9ff" fillOpacity="0.7" stroke="#7dd3fc" strokeWidth="1.1" />
    </g>
    {/* legs in black boots */}
    <g stroke="#1f2937" strokeWidth="1.7" strokeLinecap="round" fill="none">
      <path d="M26 41 q-2 5 -5 7" />
      <path d="M31 42 q0 5 -2 8" />
      <path d="M36 41 q2 5 2 8" />
    </g>
    <circle cx="20.5" cy="48.5" r="1.8" fill="#111827" />
    <circle cx="29" cy="50.5" r="1.8" fill="#111827" />
    <circle cx="38" cy="49.5" r="1.8" fill="#111827" />
    {/* striped abdomen with a stinger */}
    <path d="M6 37 L1 39.5 L6 40.5 Z" fill="#111827" />
    <ellipse cx="15" cy="37" rx="11" ry="7.5" fill="#facc15" />
    <path d="M10 30.2 q-2.4 6.8 0 13.6" stroke="#111827" strokeWidth="2.6" fill="none" />
    <path d="M15.5 29.5 q-2.6 7.5 0 15" stroke="#111827" strokeWidth="2.6" fill="none" />
    <path d="M21 30 q-2.4 7 0 14" stroke="#111827" strokeWidth="2.6" fill="none" />
    {/* Santa coat on the thorax: red with white fur trim, black belt, gold buckle */}
    <ellipse cx="31" cy="35" rx="8.5" ry="8.5" fill="#dc2626" />
    <path d="M24.5 29.5 q6.5 -3.5 13 0" stroke="#f8fafc" strokeWidth="2.6" strokeLinecap="round" fill="none" />
    <rect x="22.5" y="35" width="17" height="3" fill="#111827" />
    <rect x="29" y="34.4" width="4.2" height="4.2" rx="0.6" fill="none" stroke="#fbbf24" strokeWidth="1.2" />
    <path d="M23.5 42 q7.5 3 15 0" stroke="#f8fafc" strokeWidth="2.4" strokeLinecap="round" fill="none" />
    {/* head */}
    <circle cx="45" cy="32" r="9.5" fill="#fde047" />
    {/* big eyes */}
    <ellipse cx="48" cy="30" rx="4.2" ry="5" fill="#111827" />
    <circle cx="49.4" cy="28.3" r="1.5" fill="#fff" />
    {/* rosy cheek and smile */}
    <circle cx="42" cy="34.5" r="1.8" fill="#fb7185" fillOpacity="0.7" />
    {/* white Santa beard */}
    <path d="M38 35 q2 11 9 10 q7 -1 8 -9 q-3 3 -6 2.5 q-3 2 -6 0 q-3 1.5 -5 -3.5 z" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="0.6" />
    <path d="M45.5 39 q3 2 6 -0.5" stroke="#9f1239" strokeWidth="1.3" strokeLinecap="round" fill="none" />
    {/* antennae */}
    <g stroke="#111827" strokeWidth="1.3" strokeLinecap="round" fill="none">
      <path d="M50 24 q4 -5 8 -4" />
      <circle cx="58.3" cy="20" r="0.9" fill="#111827" />
    </g>
    {/* Santa hat: red cone flopping back, white brim and pom-pom */}
    <g transform="rotate(-10 45 23)">
      <path d="M36.5 24 Q40 9 47 8 Q53 9 54 24 Z" fill="#dc2626" />
      <path d="M47 8 Q37 6 33 14" stroke="#dc2626" strokeWidth="4.5" strokeLinecap="round" fill="none" />
      <circle cx="32.5" cy="15" r="3" fill="#f8fafc" />
      <rect x="35" y="22" width="20.5" height="4.6" rx="2.3" fill="#f8fafc" />
    </g>
  </svg>
);

const HeroFly = () => {
  const layerRef = useRef<HTMLDivElement>(null);
  const flyRef = useRef<HTMLDivElement>(null);
  const reduced = prefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const layer = layerRef.current;
    const fly = flyRef.current;
    if (!layer || !fly) return;

    let w = layer.clientWidth;
    let h = layer.clientHeight;
    const margin = 12;
    const rand = (min: number, max: number) => min + Math.random() * (max - min);
    const pickTarget = () => ({ x: rand(margin, w - SIZE - margin), y: rand(margin + 60, h - SIZE - margin) });

    const pos = { x: w * 0.6, y: h * 0.3 };
    let vel = { x: 0, y: 0 };
    let target = pickTarget();
    let hoverUntil = 0;
    let facing = 1;
    let visible = true;
    let raf = 0;
    let last = performance.now();

    const step = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      const dx = target.x - pos.x;
      const dy = target.y - pos.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 20) {
        if (!hoverUntil) hoverUntil = now + (Math.random() < 0.35 ? rand(600, 1600) : 0);
        if (now >= hoverUntil) {
          target = pickTarget();
          hoverUntil = 0;
        }
      }

      // Steer toward the target, plus a jittery buzz so it never flies straight.
      const accel = 420;
      const ax = (dist > 1 ? (dx / dist) * accel : 0) + rand(-900, 900);
      const ay = (dist > 1 ? (dy / dist) * accel : 0) + rand(-900, 900);
      vel.x = (vel.x + ax * dt) * 0.96;
      vel.y = (vel.y + ay * dt) * 0.96;
      const speed = Math.hypot(vel.x, vel.y);
      const max = 260;
      if (speed > max) {
        vel = { x: (vel.x / speed) * max, y: (vel.y / speed) * max };
      }
      pos.x = Math.max(0, Math.min(w - SIZE, pos.x + vel.x * dt));
      pos.y = Math.max(0, Math.min(h - SIZE, pos.y + vel.y * dt));

      if (Math.abs(vel.x) > 25) facing = vel.x > 0 ? 1 : -1;
      const tilt = Math.max(-20, Math.min(20, vel.y * 0.08)) * facing;
      fly.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) scaleX(${facing}) rotate(${tilt}deg)`;

      raf = requestAnimationFrame(step);
    };

    const start = () => {
      if (raf || !visible || document.hidden) return;
      last = performance.now();
      raf = requestAnimationFrame(step);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(layer);

    const ro = new ResizeObserver(() => {
      w = layer.clientWidth;
      h = layer.clientHeight;
      target = pickTarget();
    });
    ro.observe(layer);

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    start();
    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduced]);

  return (
    <div ref={layerRef} aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-20 h-full max-h-[100svh] overflow-hidden">
      <style>{`
        @keyframes hero-fly-flap { 0%, 100% { transform: scaleY(1); } 50% { transform: scaleY(0.35); } }
        .hero-fly-wings { animation: hero-fly-flap 0.09s linear infinite; }
        @media (prefers-reduced-motion: reduce) { .hero-fly-wings { animation: none; } }
      `}</style>
      <div
        ref={flyRef}
        className={reduced ? "absolute right-6 top-24" : "absolute left-0 top-0 will-change-transform"}
        style={reduced ? undefined : { transform: "translate3d(-100px, -100px, 0)" }}
      >
        {isNewYear() ? <SantaWaspSvg /> : <FlySvg costume={isHalloween() ? "witch" : "helmet"} />}
      </div>
    </div>
  );
};

export default HeroFly;
