import { useEffect, useRef } from "react";
import { HOME_BLOOM_U, homeAxisPoint, homeBloomAmount, homeBloomRadius } from "./homeDna";

/*
 * 2026-11-13 (Alexander): the inside of the "swarm" sphere on the home-page
 * DNA spiral. The sphere itself is no longer drawn here: it is the spiral's
 * own dust, blown open and pulled back by DnaHelix (`bloom`). This layer only
 * adds what shows while the sphere is open: a soft plasma glow, a faint wavy
 * mesh inside (the "thought") and a little dust breaking off and streaming
 * along the spiral. Everything fades to nothing when the swarm contracts back
 * into the plain double helix, so the two never pile up.
 *
 * Plain canvas 2D, decorative (aria-hidden, no pointer events). Runs only
 * while the hero is on screen and the tab is visible; phones get fewer
 * particles and a dimmer look; prefers-reduced-motion draws one frame.
 */

type RGB = [number, number, number];
const TEAL: RGB = [45, 212, 170];
const CYAN: RGB = [110, 240, 230];
const ROSE: RGB = [244, 114, 160];
const WHITE: RGB = [235, 255, 252];

const rgba = (c: RGB, a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a.toFixed(3)})`;

const QuantumCloud = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let narrow = false;

    // Inner wavy mesh: a grid on the equatorial disc.
    let gridN = 0;
    let grid: Array<{ gx: number; gz: number; inside: boolean }> = [];
    // Dust breaking off the surface.
    let motes: Array<{ x: number; y: number; vx: number; vy: number; life: number; age: number; c: RGB; s: number }> = [];

    const build = () => {
      gridN = narrow ? 14 : 22;
      grid = [];
      for (let i = 0; i < gridN; i += 1)
        for (let j = 0; j < gridN; j += 1) {
          const gx = (i / (gridN - 1)) * 2 - 1;
          const gz = (j / (gridN - 1)) * 2 - 1;
          grid.push({ gx: gx * 0.78, gz: gz * 0.78, inside: gx * gx + gz * gz <= 1.02 });
        }
      motes = [];
    };

    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) return;
      const wasNarrow = narrow;
      narrow = w < 768;
      dpr = Math.min(narrow ? 1.25 : 1.5, window.devicePixelRatio || 1);
      width = w;
      height = h;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      if (!grid.length || wasNarrow !== narrow) build();
      if (!running) draw(performance.now());
    };

    let last = performance.now();
    const draw = (now: number) => {
      if (!width || !height) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const t = now / 1000;
      const power = narrow ? 0.4 : 1;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      const open = homeBloomAmount(t);
      if (open < 0.01 && !motes.length) return;
      ctx.globalCompositeOperation = "lighter";

      const ax = homeAxisPoint(width, height, HOME_BLOOM_U, t);
      const cx = ax.x;
      const cy = ax.y;
      const R = homeBloomRadius(width, height, t);

      // Soft plasma glow, only as strong as the sphere is open.
      if (open > 0.01) {
        const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 1.45);
        glow.addColorStop(0, rgba(TEAL, 0.17 * power * open));
        glow.addColorStop(0.55, rgba(TEAL, 0.05 * power * open));
        glow.addColorStop(1, rgba(TEAL, 0));
        ctx.fillStyle = glow;
        ctx.fillRect(cx - R * 1.5, cy - R * 1.5, R * 3, R * 3);
      }

      // Inner wavy mesh, faint, shown only when the sphere is well open.
      const meshA = Math.max(0, (open - 0.45) / 0.55);
      if (meshA > 0.01) {
        const yaw = t * 0.22;
        const pitch = 0.42 + 0.08 * Math.sin(t * 0.31);
        const cyw = Math.cos(yaw);
        const syw = Math.sin(yaw);
        const cp = Math.cos(pitch);
        const sp = Math.sin(pitch);
        const Rm = R * (0.55 + 0.45 * open);
        const h3 = new Array<{ x: number; y: number; z: number } | null>(grid.length);
        for (let k = 0; k < grid.length; k += 1) {
          const g = grid[k];
          if (!g.inside) {
            h3[k] = null;
            continue;
          }
          const y =
            0.2 * Math.sin(g.gx * 3.2 + t * 0.9) * Math.cos(g.gz * 2.6 - t * 0.6) +
            0.08 * Math.sin(g.gx * 6 + g.gz * 4 + t * 1.7);
          const x1 = g.gx * cyw - g.gz * syw;
          const z1 = g.gx * syw + g.gz * cyw;
          h3[k] = { x: cx + x1 * Rm, y: cy + (y * cp - z1 * sp) * Rm, z: y * sp + z1 * cp };
        }
        ctx.lineWidth = 0.6;
        ctx.strokeStyle = rgba(CYAN, 0.13 * power * meshA);
        ctx.beginPath();
        for (let i = 0; i < gridN; i += 1)
          for (let j = 0; j < gridN; j += 1) {
            const a = h3[i * gridN + j];
            if (!a) continue;
            const right = j + 1 < gridN ? h3[i * gridN + j + 1] : null;
            const down = i + 1 < gridN ? h3[(i + 1) * gridN + j] : null;
            if (right) {
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(right.x, right.y);
            }
            if (down) {
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(down.x, down.y);
            }
          }
        ctx.stroke();
        for (let k = 0; k < h3.length; k += 3) {
          const q = h3[k];
          if (!q) continue;
          ctx.fillStyle = rgba(k % 11 === 0 ? ROSE : WHITE, 0.4 * power * meshA * (0.4 + (q.z + 1) * 0.3));
          ctx.fillRect(q.x - 0.8, q.y - 0.8, 1.6, 1.6);
        }
      }

      // A little dust breaking off the open sphere; part of it streams along
      // the spiral, so the swarm visibly feeds back into the DNA.
      if (!reduce) {
        const want = Math.round((narrow ? 50 : 170) * open);
        const spawn = Math.min(want - motes.length, narrow ? 2 : 5);
        for (let s = 0; s < spawn; s += 1) {
          const a = Math.random() * Math.PI * 2;
          const ox = Math.cos(a);
          const oy = Math.sin(a);
          const rr = R * (0.75 + Math.random() * 0.25);
          const along = Math.random() < 0.55 ? (Math.random() < 0.5 ? -1 : 1) : 0;
          const sp2 = 14 + Math.random() * 30;
          motes.push({
            x: cx + ox * rr,
            y: cy + oy * rr,
            vx: ox * sp2 + along * ax.ex * (40 + Math.random() * 60) - oy * 12,
            vy: oy * sp2 + along * ax.ey * (40 + Math.random() * 60) + ox * 12,
            life: 2 + Math.random() * 2.5,
            age: 0,
            c: Math.random() < 0.2 ? ROSE : Math.random() < 0.5 ? WHITE : CYAN,
            s: 1 + Math.random() * 1.6,
          });
        }
        let w = 0;
        for (const m of motes) {
          m.age += dt;
          if (m.age >= m.life) continue;
          m.x += m.vx * dt;
          m.y += m.vy * dt;
          m.vx *= 0.995;
          m.vy *= 0.995;
          const f = m.age / m.life;
          const a = (f < 0.15 ? f / 0.15 : 1 - (f - 0.15) / 0.85) * 0.85 * power;
          ctx.fillStyle = rgba(m.c, a);
          ctx.fillRect(m.x - m.s / 2, m.y - m.s / 2, m.s, m.s);
          motes[w++] = m;
        }
        motes.length = w;
      }

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
        ? new IntersectionObserver((entries) => {
            visible = entries.some((e) => e.isIntersecting);
            update();
          })
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
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-[1]" aria-hidden="true">
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
};

export default QuantumCloud;
