import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/*
 * 2026-11-11 (Alexander): a large, continuously rotating DNA double helix
 * made of fine glowing "dust" with white bridges between the strands.
 * One engine for every place it appears:
 *   - the site banners (home page hero, /trading hero), decorative;
 *   - "My DNA" on the app statistics screen and the dashboard home, where
 *     every bridge is one of the user's real closed signals (green = profit,
 *     red = loss, grey = zero);
 *   - the small strip on every signal card (stop, entry, targets; a target
 *     bridge lights only when that target was really hit).
 *
 * Plain canvas 2D, no library. Cheap by design: the animation starts only
 * when the canvas is on screen and stops when it scrolls away or the tab is
 * hidden; with prefers-reduced-motion one still frame is drawn.
 */

export type DnaTone = "win" | "loss" | "flat" | "entry" | "stop" | "idle";

export interface DnaRung {
  tone: DnaTone;
  /** 0..1, how bright the bridge is (e.g. size of the result). */
  strength?: number;
  /** A lit bridge glows; an unlit one is drawn faint. Default true. */
  lit?: boolean;
}

type RGB = [number, number, number];

const DARK: Record<DnaTone | "a" | "b" | "bridge", RGB> = {
  win: [45, 212, 160],
  loss: [244, 114, 150],
  flat: [148, 163, 214],
  entry: [125, 211, 252],
  stop: [244, 114, 150],
  idle: [148, 163, 184],
  a: [45, 212, 170],
  b: [244, 114, 160],
  bridge: [255, 255, 255],
};

const LIGHT: typeof DARK = {
  win: [5, 150, 105],
  loss: [219, 39, 119],
  flat: [100, 116, 139],
  entry: [2, 132, 199],
  stop: [219, 39, 119],
  idle: [100, 116, 139],
  a: [13, 148, 136],
  b: [219, 39, 119],
  bridge: [51, 65, 85],
};

const mix = (a: RGB, b: RGB, t: number): RGB => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;

// Soft round glow, rendered once per colour and reused with drawImage.
const spriteCache = new Map<string, HTMLCanvasElement>();
const glowSprite = (rgb: RGB) => {
  const key = rgb.map((v) => v | 0).join(",");
  const hit = spriteCache.get(key);
  if (hit) return hit;
  const size = 64;
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const g = c.getContext("2d");
  if (g) {
    const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grad.addColorStop(0, `rgba(${key},1)`);
    grad.addColorStop(0.18, `rgba(${key},0.75)`);
    grad.addColorStop(0.45, `rgba(${key},0.18)`);
    grad.addColorStop(1, `rgba(${key},0)`);
    g.fillStyle = grad;
    g.fillRect(0, 0, size, size);
  }
  spriteCache.set(key, c);
  return c;
};

export interface DnaHelixProps {
  className?: string;
  /** Axis start / end as fractions of the canvas box, [x, y]. */
  from?: [number, number];
  to?: [number, number];
  /** Helix radius as a fraction of the axis length. */
  radius?: number;
  /** Radius multiplier at the start and the end of the axis (perspective). */
  taper?: [number, number];
  turns?: number;
  /** Radians per second. */
  speed?: number;
  /** Dust particles per strand at most (scaled down on small canvases). */
  density?: number;
  /** One bridge per entry; without data the helix is decorative. */
  rungs?: DnaRung[];
  /** Number of decorative bridges when `rungs` is not given. */
  bridges?: number;
  /** Bright knots on the strands, as positions 0..1 along the axis. */
  knots?: number[];
  theme?: "dark" | "light";
  /** Overall opacity multiplier. */
  intensity?: number;
  /** Max device pixel ratio (big banners: keep it low). */
  maxDpr?: number;
  ariaLabel?: string;
  /** Canvas px² per dust particle before `density` caps it (lower = denser). */
  areaPerDust?: number;
}

export const DnaHelix = ({
  className,
  from = [0.04, 0.92],
  to = [0.98, 0.1],
  radius = 0.085,
  taper = [0.6, 1.15],
  turns = 3,
  speed = 0.55,
  density = 2400,
  rungs,
  bridges = 18,
  knots = [],
  theme = "dark",
  intensity = 1,
  maxDpr = 2,
  ariaLabel,
  areaPerDust = 120,
}: DnaHelixProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rungsRef = useRef<DnaRung[] | undefined>(rungs);
  rungsRef.current = rungs;
  const rungKey = rungs ? rungs.map((r) => `${r.tone}${r.lit === false ? 0 : 1}${(r.strength ?? 1).toFixed(2)}`).join("|") : "";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const pal = theme === "light" ? LIGHT : DARK;
    const light = theme === "light";
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let dust: Array<{ s: number; u: number; jr: number; ja: number; ox: number; oy: number; size: number; alpha: number; seed: number; halo: boolean }> = [];
    const data = rungsRef.current;

    const build = () => {
      const area = width * height;
      const perStrand = Math.max(160, Math.min(density, Math.round(area / areaPerDust)));
      const count = (reduce ? 0.6 : 1) * perStrand * 2;
      dust = Array.from({ length: Math.round(count) }, (_, i) => {
        const halo = Math.random() < 0.07;
        return {
          s: i % 2,
          u: Math.random(),
          jr: halo ? gauss() * 0.9 : gauss() * 0.1,
          ja: gauss() * (halo ? 0.04 : 0.004),
          // Screen-space scatter: makes each strand a ribbon of dust.
          ox: gauss() * (halo ? 2.2 : 1),
          oy: gauss() * (halo ? 2.2 : 1),
          size: 0.8 + Math.random() * (halo ? 1 : 1.7),
          alpha: 0.35 + Math.random() * 0.65,
          seed: Math.random(),
          halo,
        };
      });
    };

    const resize = () => {
      dpr = Math.min(maxDpr, window.devicePixelRatio || 1);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) return;
      const changed = Math.abs(w - width) > 2 || Math.abs(h - height) > 2;
      width = w;
      height = h;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      if (changed || !dust.length) build();
      if (!running) draw(performance.now());
    };

    const toneAt = (u: number): DnaRung | null => {
      if (!data || !data.length) return null;
      const i = Math.max(0, Math.min(data.length - 1, Math.floor(u * data.length)));
      return data[i];
    };

    const sprites = {
      bridge: glowSprite(pal.bridge),
      a: glowSprite(pal.a),
      b: glowSprite(pal.b),
    };
    const toneSprite = (tone: DnaTone) => glowSprite(pal[tone]);

    let phase = Math.random() * Math.PI * 2;
    let last = performance.now();

    const draw = (now: number) => {
      if (!width || !height) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!reduce) phase += dt * speed;
      const t = now / 1000;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = light ? "source-over" : "lighter";

      const x0 = from[0] * width;
      const y0 = from[1] * height;
      const dx = to[0] * width - x0;
      const dy = to[1] * height - y0;
      const len = Math.hypot(dx, dy) || 1;
      const ex = dx / len;
      const ey = dy / len;
      const nx = -ey;
      const ny = ex;
      const baseR = len * radius;

      const point = (u: number, strand: number, extraAngle = 0, extraR = 0) => {
        // Gentle bend of the axis so it does not look like a ruler.
        const bend = Math.sin(u * Math.PI * 1.2 + t * 0.15) * len * 0.025;
        const cx = x0 + dx * u + nx * bend;
        const cy = y0 + dy * u + ny * bend;
        const r = baseR * (taper[0] + (taper[1] - taper[0]) * u) * (1 + extraR);
        const a = phase + u * turns * Math.PI * 2 + strand * Math.PI + extraAngle;
        const s = Math.sin(a);
        return { x: cx + nx * s * r, y: cy + ny * s * r, z: Math.cos(a), r };
      };

      // Dust strands.
      const dustScale = Math.max(0.75, Math.min(1.25, baseR / 70));
      for (const d of dust) {
        const u = d.u + d.ja;
        if (u < 0 || u > 1) continue;
        const p = point(u, d.s, 0, d.jr);
        const rung = toneAt(u);
        let rgb: RGB;
        if (rung) {
          const base = pal[rung.tone];
          rgb = rung.lit === false ? mix(base, pal.idle, 0.6) : base;
          if (d.seed > 0.88) rgb = mix(rgb, d.s ? pal.b : pal.a, 0.5);
        } else {
          // Reference look: both strands carry teal and rose patches.
          const pink = 0.5 + 0.42 * Math.sin(u * 15 + d.s * 2.1 + 0.6);
          rgb = d.seed < pink ? pal.b : pal.a;
        }
        const depth = 0.3 + (p.z + 1) * 0.35;
        const dim = rung && rung.lit === false ? 0.55 : 1;
        const alpha = d.alpha * depth * dim * intensity * (d.halo ? 0.55 : light ? 0.8 : 0.9);
        const size = d.size * (0.75 + (p.z + 1) * 0.3) * dustScale;
        const spread = p.r * 0.11;
        ctx.fillStyle = `rgba(${rgb[0] | 0},${rgb[1] | 0},${rgb[2] | 0},${alpha.toFixed(3)})`;
        ctx.fillRect(p.x + d.ox * spread - size / 2, p.y + d.oy * spread - size / 2, size, size);
      }

      // Bridges: a few bright dots between the strands.
      const n = data && data.length ? data.length : bridges;
      for (let k = 0; k < n; k += 1) {
        const u = (k + 0.5) / n;
        const rung = data && data.length ? data[k] : null;
        const p1 = point(u, 0);
        const p2 = point(u, 1);
        const lit = rung ? rung.lit !== false : true;
        const strength = rung ? Math.max(0.25, Math.min(1, rung.strength ?? 1)) : 1;
        const sprite = rung && lit && rung.tone !== "flat" ? toneSprite(rung.tone) : sprites.bridge;
        const dots = Math.max(3, Math.min(7, Math.round(Math.hypot(p2.x - p1.x, p2.y - p1.y) / 22)));
        const avgDepth = 0.35 + ((p1.z + p2.z) / 2 + 1) * 0.3;
        for (let j = 1; j < dots; j += 1) {
          const v = j / dots;
          const x = p1.x + (p2.x - p1.x) * v;
          const y = p1.y + (p2.y - p1.y) * v;
          const s = (light ? 9 : 12) * (lit ? 0.8 + strength * 0.4 : 0.6);
          ctx.globalAlpha = Math.min(1, (lit ? 0.4 + 0.4 * strength : 0.16) * avgDepth * intensity);
          ctx.drawImage(sprite, x - s / 2, y - s / 2, s, s);
          if (!light && lit) {
            // white core
            ctx.globalAlpha = Math.min(1, 0.7 * avgDepth * intensity);
            ctx.drawImage(sprites.bridge, x - 2, y - 2, 4, 4);
          }
        }
        // Results with a large R get a knot on the strand.
        if (rung && lit && strength > 0.8 && rung.tone !== "flat") {
          const q = p1.z > p2.z ? p1 : p2;
          const s = 30 + 20 * Math.sin(t * 2 + k);
          ctx.globalAlpha = 0.45 * intensity;
          ctx.drawImage(toneSprite(rung.tone), q.x - s / 2, q.y - s / 2, s, s);
        }
      }

      // Decorative knots (bright clusters on the crests, as in the sample).
      knots.forEach((u, i) => {
        const strand = i % 2;
        const p = point(u, strand);
        const pulse = 0.75 + 0.25 * Math.sin(t * 1.6 + i * 1.7);
        const s = (light ? 34 : 46) * pulse * (0.7 + (p.z + 1) * 0.25);
        ctx.globalAlpha = (light ? 0.35 : 0.65) * intensity;
        ctx.drawImage(strand ? sprites.b : sprites.a, p.x - s / 2, p.y - s / 2, s, s);
        if (!light) {
          ctx.globalAlpha = 0.55 * intensity;
          ctx.drawImage(sprites.bridge, p.x - s / 6, p.y - s / 6, s / 3, s / 3);
        }
      });

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    };

    let frame = 0;
    let running = false;
    let visible = false;
    const loop = (now: number) => {
      draw(now);
      frame = requestAnimationFrame(loop);
    };
    const update = () => {
      const should = visible && !reduce && document.visibilityState === "visible";
      if (should && !running) {
        running = true;
        last = performance.now();
        frame = requestAnimationFrame(loop);
      } else if (!should && running) {
        running = false;
        cancelAnimationFrame(frame);
      }
    };

    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
    ro?.observe(canvas);
    resize();

    const io =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(
            (entries) => {
              visible = entries.some((e) => e.isIntersecting);
              if (visible && !running) draw(performance.now());
              update();
            },
            { rootMargin: "100px" },
          )
        : null;
    if (io) io.observe(canvas);
    else {
      visible = true;
      update();
    }
    document.addEventListener("visibilitychange", update);
    draw(performance.now());

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      ro?.disconnect();
      io?.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, rungKey, from[0], from[1], to[0], to[1], radius, taper[0], taper[1], turns, speed, density, bridges, knots.join(","), intensity, maxDpr, areaPerDust]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("block h-full w-full", className)}
      role={ariaLabel ? "img" : undefined}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
    />
  );
};

export default DnaHelix;
