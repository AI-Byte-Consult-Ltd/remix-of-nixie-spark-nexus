import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

// The NICS products circling a glowing core, on the right of the home hero.
// Every product is a real link. Positions are written straight to the DOM from
// one requestAnimationFrame loop (no React re-renders); the loop pauses while
// the hero is off screen, the tab is hidden, or the pointer is over the orbit
// (so a moving link is easy to click). With prefers-reduced-motion the products
// stay where they start.

type Product = { label: string; href: string; external?: boolean; color: string; ring: 0 | 1; phase: number };

const PRODUCTS: Product[] = [
  { label: "NICS AI Trading", href: "/trading", color: "#f5b83d", ring: 0, phase: 0 },
  { label: "NICS Video", href: "/nics-video", color: "#f472b6", ring: 0, phase: Math.PI },
  { label: "NICS Real Estate", href: "https://estate.aibyteconsult.com", external: true, color: "#4ade80", ring: 1, phase: 1.2 },
  { label: "NICS Multimedia", href: "/nics-multimedia", color: "#a78bfa", ring: 1, phase: 4.3 },
  { label: "NICS AI Lab", href: "https://github.com/AI-Byte-Consult-Ltd/nics-ai-lab", external: true, color: "#6cc6ff", ring: 1, phase: 2.7 },
];

// Ring radius as a share of the box width, seconds per turn, vertical squash.
const RINGS = [
  { r: 0.25, period: 26 },
  { r: 0.4, period: 40 },
];
const TILT = 0.44;

const pillClass =
  "pointer-events-auto inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-white/20 bg-[#12151d]/80 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-md transition-colors hover:border-white/50 hover:bg-[#12151d] sm:px-3 sm:py-1.5 sm:text-xs";

const HeroOrbit = () => {
  const boxRef = useRef<HTMLDivElement>(null);
  const satRefs = useRef<(HTMLDivElement | null)[]>([]);
  const ringRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    let width = box.clientWidth;

    const place = (seconds: number) => {
      PRODUCTS.forEach((p, i) => {
        const el = satRefs.current[i];
        if (!el) return;
        const ring = RINGS[p.ring];
        const a = p.phase + (seconds * Math.PI * 2) / ring.period;
        const depth = (Math.sin(a) + 1) / 2;
        const x = Math.cos(a) * ring.r * width;
        const y = Math.sin(a) * ring.r * width * TILT;
        el.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${y}px, 0) scale(${0.82 + depth * 0.25})`;
        el.style.zIndex = depth > 0.5 ? "3" : "1";
        el.style.opacity = String(0.6 + depth * 0.4);
      });
    };
    const sizeRings = () => {
      width = box.clientWidth;
      RINGS.forEach((ring, i) => {
        const el = ringRefs.current[i];
        if (!el) return;
        el.style.width = `${ring.r * 2 * width}px`;
        el.style.height = `${ring.r * 2 * width * TILT}px`;
      });
    };
    sizeRings();

    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    let elapsed = 0;
    const ro = new ResizeObserver(() => {
      sizeRings();
      place(elapsed);
    });
    ro.observe(box);
    place(0);
    if (reduced) return () => ro.disconnect();

    let raf = 0;
    let last = 0;
    let visible = true;
    let hovered = false;
    const tick = (now: number) => {
      if (last) elapsed += Math.min(0.05, (now - last) / 1000);
      last = now;
      place(elapsed);
      raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (raf || !visible || hovered || document.hidden) return;
      last = 0;
      raf = requestAnimationFrame(tick);
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
    io.observe(box);
    const onEnter = () => {
      hovered = true;
      stop();
    };
    const onLeave = () => {
      hovered = false;
      start();
    };
    box.addEventListener("pointerenter", onEnter);
    box.addEventListener("pointerleave", onLeave);
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);
    start();

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      box.removeEventListener("pointerenter", onEnter);
      box.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <nav aria-label="NICS AI Ecosystem" className="relative mx-auto w-full max-w-[560px]">
      <div ref={boxRef} className="pointer-events-none relative aspect-[16/10] w-full">
        {RINGS.map((_, i) => (
          <div
            key={i}
            ref={(el) => (ringRefs.current[i] = el)}
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-white/15"
          />
        ))}
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 z-[2] grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full font-mono text-[11px] font-bold text-[#241800] sm:h-20 sm:w-20 sm:text-xs"
          style={{
            background: "radial-gradient(circle at 35% 35%, #fff6d8, #f5b83d 45%, #8a5a00)",
            boxShadow: "0 0 60px 10px rgba(245,184,61,0.35)",
          }}
        >
          NICS
        </div>
        {PRODUCTS.map((p, i) => {
          const inner = (
            <>
              <span className="h-1.5 w-1.5 rounded-full sm:h-2 sm:w-2" style={{ background: p.color, boxShadow: `0 0 8px ${p.color}` }} />
              {p.label}
            </>
          );
          return (
            <div
              key={p.label}
              ref={(el) => (satRefs.current[i] = el)}
              className="absolute left-1/2 top-1/2 will-change-transform"
              style={{ transform: "translate(-50%, -50%)" }}
            >
              {p.external ? (
                <a href={p.href} target="_blank" rel="noopener noreferrer" className={pillClass}>
                  {inner}
                </a>
              ) : (
                <Link to={p.href} className={pillClass}>
                  {inner}
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
};

export default HeroOrbit;
