import { useEffect, useRef } from "react";
import Link from "@/components/SiteLink";
import { HERO_PRODUCTS, homeAxisPoint, type HeroProduct } from "./homeDna";

/*
 * 2026-11-12 (Alexander chose variant "C"): the NICS products are glowing
 * nodes on the axis of the home-page DNA spiral, each with a short leader
 * line and a label link. Replaces the old product orbit. The nodes follow
 * the spiral's slow bend (same formula as DnaHelix). Shown from xl up; on
 * smaller screens the spiral runs behind the text, so HeroProductChips
 * lists the products as plain buttons instead.
 */

// Position on the axis (0 = bottom-left start, 1 = top-right end) and the
// side the label goes to. Chosen so no label touches the headline.
const PLACES: Record<string, { u: number; side: -1 | 1 }> = {
  "NICS Video": { u: 0.33, side: 1 },
  "NICS Trading Ecosystem": { u: 0.44, side: 1 },
  "NICS Real Estate": { u: 0.55, side: -1 },
  "NICS Multimedia": { u: 0.66, side: -1 },
  "NICS AI Lab": { u: 0.78, side: -1 },
};

const LEADER = 46;

const pillClass =
  "pointer-events-auto inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-white/20 bg-[#0b1118]/75 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md transition-colors hover:border-white/60 hover:bg-[#0b1118]";

const ProductLink = ({ p, className }: { p: HeroProduct; className: string }) => {
  const inner = (
    <>
      <span className="h-2 w-2 rounded-full" style={{ background: p.color, boxShadow: `0 0 8px ${p.color}` }} />
      {p.label}
    </>
  );
  return p.external ? (
    <a href={p.href} target="_blank" rel="noopener noreferrer" className={className}>
      {inner}
    </a>
  ) : (
    <Link to={p.href} className={className}>
      {inner}
    </Link>
  );
};

export const HeroProductChips = () => (
  <nav aria-label="NICS AI Ecosystem" className="flex flex-wrap gap-2">
    {HERO_PRODUCTS.map((p) => (
      <ProductLink key={p.label} p={p} className={pillClass} />
    ))}
  </nav>
);

const HeroDnaProducts = () => {
  const boxRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const place = () => {
      const w = box.clientWidth;
      const h = box.clientHeight;
      const t = performance.now() / 1000;
      HERO_PRODUCTS.forEach((p, i) => {
        const el = nodeRefs.current[i];
        const pl = PLACES[p.label];
        if (!el || !pl) return;
        const q = homeAxisPoint(w, h, pl.u, t);
        el.style.transform = `translate3d(${q.x}px, ${q.y}px, 0)`;
      });
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(box);
    if (reduce) return () => ro.disconnect();

    let raf = 0;
    let visible = true;
    const tick = () => {
      place();
      raf = requestAnimationFrame(tick);
    };
    const update = () => {
      const should = visible && document.visibilityState === "visible";
      if (should && !raf) raf = requestAnimationFrame(tick);
      if (!should && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      update();
    });
    io.observe(box);
    document.addEventListener("visibilitychange", update);
    update();
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  return (
    <nav aria-label="NICS AI Ecosystem" ref={boxRef} className="pointer-events-none absolute inset-0">
      {HERO_PRODUCTS.map((p, i) => {
        const pl = PLACES[p.label] ?? { u: 0.5, side: 1 };
        return (
          <div key={p.label} ref={(el) => (nodeRefs.current[i] = el)} className="absolute left-0 top-0 will-change-transform">
            {/* node on the spiral axis */}
            <span
              aria-hidden="true"
              className="nics-node absolute -left-[7px] -top-[7px] h-3.5 w-3.5 rounded-full bg-white"
              style={{ boxShadow: `0 0 10px 3px rgba(255,255,255,0.75), 0 0 26px 8px ${p.color}66`, animationDelay: `${-i * 0.7}s` }}
            />
            {/* leader line */}
            <span
              aria-hidden="true"
              className="absolute top-0 h-px"
              style={{
                width: LEADER,
                left: pl.side > 0 ? 7 : -7 - LEADER,
                background:
                  pl.side > 0
                    ? "linear-gradient(90deg, rgba(255,255,255,0.75), rgba(255,255,255,0.15))"
                    : "linear-gradient(270deg, rgba(255,255,255,0.75), rgba(255,255,255,0.15))",
              }}
            />
            <div
              className="absolute top-0"
              style={{
                left: pl.side > 0 ? 7 + LEADER : undefined,
                right: pl.side < 0 ? 7 + LEADER : undefined,
                transform: "translateY(-50%)",
              }}
            >
              <ProductLink p={p} className={pillClass} />
            </div>
          </div>
        );
      })}
      <style>{`
        @keyframes nics-node-pulse { 0%, 100% { transform: scale(1); opacity: 0.95; } 50% { transform: scale(1.35); opacity: 1; } }
        .nics-node { animation: nics-node-pulse 2.8s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .nics-node { animation: none; } }
      `}</style>
    </nav>
  );
};

export default HeroDnaProducts;
