import { useEffect, useRef } from "react";
import { isHalloween } from "@/lib/halloween";

// A cartoon fly in a helmet that wanders around the /trading hero. Pure
// decoration: aria-hidden, pointer-events none (never blocks a click), moved by
// one requestAnimationFrame loop writing a transform (no React re-renders),
// paused while the hero is off screen or the tab is hidden. With
// prefers-reduced-motion it just sits still in a corner. Until the end of
// Halloween (src/lib/halloween.ts) it wears a witch hat instead of the helmet.

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
        <FlySvg costume={isHalloween() ? "witch" : "helmet"} />
      </div>
    </div>
  );
};

export default HeroFly;
