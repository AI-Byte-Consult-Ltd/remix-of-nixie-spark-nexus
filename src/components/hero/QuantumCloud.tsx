import { useEffect, useRef } from "react";
import { homeAxisPoint } from "./homeDna";

/*
 * 2026-11-12 (Alexander): a "quantum plasma" cloud on the home-page DNA
 * spiral. A sphere of glowing dust with a wavy luminous mesh inside that
 * slowly rotates and breathes (contracts and expands). Particles keep
 * breaking off the surface and drifting away like dust, partly streaming
 * along the spiral, so the cloud reads as part of the DNA, not a separate
 * picture. Same teal / rose palette as DnaHelix.
 *
 * Plain canvas 2D, decorative (aria-hidden, no pointer events). Runs only
 * while the hero is on screen and the tab is visible; phones get fewer
 * particles and a dimmer cloud; prefers-reduced-motion draws one frame.
 */

type RGB = [number, number, number];
const TEAL: RGB = [45, 212, 170];
const CYAN: RGB = [110, 240, 230];
const ROSE: RGB = [244, 114, 160];
const WHITE: RGB = [235, 255, 252];

// Where on the spiral the cloud sits (0..1 along the axis).
const AXIS_U = 0.62;

const sprite = (c: RGB) => {
  const size = 48;
  const el = document.createElement("canvas");
  el.width = size;
  el.height = size;
  const g = el.getContext("2d");
  if (g) {
    const gr = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gr.addColorStop(0, `rgba(${c.join(",")},1)`);
    gr.addColorStop(0.2, `rgba(${c.join(",")},0.6)`);
    gr.addColorStop(1, `rgba(${c.join(",")},0)`);
    g.fillStyle = gr;
    g.fillRect(0, 0, size, size);
  }
  return el;
};

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
    const sparkCyan = sprite(CYAN);
    const sparkRose = sprite(ROSE);

    // Shell: points on a sphere (golden spiral), unit radius.
    let shell: Array<{ x: number; y: number; z: number; th: number; ph: number; c: RGB; s: number }> = [];
    // Inner wavy mesh: a grid on the equatorial disc.
    let gridN = 0;
    let grid: Array<{ gx: number; gz: number; inside: boolean }> = [];
    // Net: pairs of shell points joined by faint lines.
    let net: Array<[number, number]> = [];
    // Dust breaking off the surface.
    let motes: Array<{ x: number; y: number; vx: number; vy: number; life: number; age: number; c: RGB; s: number }> = [];

    const build = () => {
      const k = narrow ? 0.4 : 1;
      const n = Math.round(2100 * k);
      shell = Array.from({ length: n }, (_, i) => {
        const y = 1 - (2 * (i + 0.5)) / n;
        const r = Math.sqrt(1 - y * y);
        const th = i * 2.399963;
        const roll = Math.random();
        return {
          x: Math.cos(th) * r,
          y,
          z: Math.sin(th) * r,
          th,
          ph: Math.acos(y),
          c: roll < 0.14 ? ROSE : roll < 0.55 ? CYAN : TEAL,
          s: 1 + Math.random() * 1.8,
        };
      });
      gridN = narrow ? 16 : 26;
      grid = [];
      for (let i = 0; i < gridN; i += 1)
        for (let j = 0; j < gridN; j += 1) {
          const gx = (i / (gridN - 1)) * 2 - 1;
          const gz = (j / (gridN - 1)) * 2 - 1;
          grid.push({ gx: gx * 0.82, gz: gz * 0.82, inside: gx * gx + gz * gz <= 1.02 });
        }
      net = [];
      const picks = narrow ? 50 : 140;
      for (let a = 0; a < picks; a += 1) {
        const i = Math.floor(Math.random() * shell.length);
        let best = -1;
        let bestD = Infinity;
        for (let tries = 0; tries < 60; tries += 1) {
          const j = Math.floor(Math.random() * shell.length);
          if (j === i) continue;
          const d = (shell[i].x - shell[j].x) ** 2 + (shell[i].y - shell[j].y) ** 2 + (shell[i].z - shell[j].z) ** 2;
          if (d > 0.02 && d < bestD) {
            bestD = d;
            best = j;
          }
        }
        if (best >= 0 && bestD < 0.25) net.push([i, best]);
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
      if (!shell.length || wasNarrow !== narrow) build();
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
      ctx.globalCompositeOperation = "lighter";

      const ax = homeAxisPoint(width, height, AXIS_U, t);
      const cx = ax.x;
      const cy = ax.y;
      const breathe = 1 + 0.13 * Math.sin(t * 0.9) + 0.04 * Math.sin(t * 2.3 + 1);
      const R = (narrow ? Math.min(width * 0.36, height * 0.22) : Math.min(height * 0.25, width * 0.17)) * breathe;

      const yaw = t * 0.22;
      const pitch = 0.42 + 0.08 * Math.sin(t * 0.31);
      const cyw = Math.cos(yaw);
      const syw = Math.sin(yaw);
      const cp = Math.cos(pitch);
      const sp = Math.sin(pitch);
      const proj = (x: number, y: number, z: number) => {
        const x1 = x * cyw - z * syw;
        const z1 = x * syw + z * cyw;
        const y2 = y * cp - z1 * sp;
        const z2 = y * sp + z1 * cp;
        return { x: cx + x1 * R, y: cy + y2 * R, z: z2 };
      };

      // Soft plasma glow behind everything.
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 1.5);
      glow.addColorStop(0, rgba(TEAL, 0.16 * power * breathe));
      glow.addColorStop(0.55, rgba(TEAL, 0.05 * power));
      glow.addColorStop(1, rgba(TEAL, 0));
      ctx.fillStyle = glow;
      ctx.fillRect(cx - R * 1.6, cy - R * 1.6, R * 3.2, R * 3.2);

      // Shell dust, rippled by a travelling wave.
      const pts: Array<{ x: number; y: number; z: number }> = new Array(shell.length);
      for (let i = 0; i < shell.length; i += 1) {
        const p = shell[i];
        const ripple = 1 + 0.07 * Math.sin(p.th * 0.5 + t * 1.3) * Math.cos(p.ph * 4 - t * 0.8);
        const q = proj(p.x * ripple, p.y * ripple, p.z * ripple);
        pts[i] = q;
        const depth = 0.25 + (q.z + 1) * 0.375;
        const flicker = 0.65 + 0.35 * Math.sin(t * 3 + i);
        ctx.fillStyle = rgba(p.c, Math.min(1, 1.1 * depth * flicker * power));
        const s = p.s * (0.7 + (q.z + 1) * 0.35);
        ctx.fillRect(q.x - s / 2, q.y - s / 2, s, s);
      }

      // Twinkling bright sparks on the surface.
      const step = Math.max(1, Math.floor(shell.length / (narrow ? 14 : 46)));
      for (let i = 0; i < shell.length; i += step) {
        const q = pts[i];
        if (q.z < -0.1) continue;
        const tw = Math.max(0, Math.sin(t * 1.7 + i * 0.37));
        const s = (10 + 14 * tw) * (0.6 + q.z * 0.4);
        ctx.globalAlpha = 0.75 * tw * power;
        ctx.drawImage(i % 3 === 0 ? sparkRose : sparkCyan, q.x - s / 2, q.y - s / 2, s, s);
      }
      ctx.globalAlpha = 1;

      // Faint net across the shell.
      ctx.lineWidth = 0.6;
      ctx.strokeStyle = rgba(CYAN, 0.2 * power);
      ctx.beginPath();
      for (const [i, j] of net) {
        if (pts[i].z < -0.2 && pts[j].z < -0.2) continue;
        ctx.moveTo(pts[i].x, pts[i].y);
        ctx.lineTo(pts[j].x, pts[j].y);
      }
      ctx.stroke();

      // Inner wavy mesh (the "plasma surface").
      const h3 = new Array(grid.length);
      for (let k = 0; k < grid.length; k += 1) {
        const g = grid[k];
        if (!g.inside) {
          h3[k] = null;
          continue;
        }
        const y =
          0.2 * Math.sin(g.gx * 3.2 + t * 0.9) * Math.cos(g.gz * 2.6 - t * 0.6) +
          0.08 * Math.sin(g.gx * 6 + g.gz * 4 + t * 1.7);
        h3[k] = proj(g.gx, y * breathe, g.gz);
      }
      ctx.lineWidth = 0.6;
      ctx.strokeStyle = rgba(CYAN, 0.15 * power);
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
      for (let k = 0; k < h3.length; k += 1) {
        const q = h3[k];
        if (!q) continue;
        ctx.fillStyle = rgba(k % 11 === 0 ? ROSE : WHITE, 0.55 * power * (0.4 + (q.z + 1) * 0.3));
        ctx.fillRect(q.x - 0.9, q.y - 0.9, 1.8, 1.8);
      }

      // Dust breaking off the surface; some of it streams along the spiral.
      if (!reduce) {
        const want = narrow ? 160 : 550;
        const spawn = Math.min(want - motes.length, narrow ? 4 : 14);
        for (let s = 0; s < spawn; s += 1) {
          const p = shell[Math.floor(Math.random() * shell.length)];
          const q = proj(p.x, p.y, p.z);
          const ox = (q.x - cx) / R;
          const oy = (q.y - cy) / R;
          const along = Math.random() < 0.45 ? (Math.random() < 0.5 ? -1 : 1) : 0;
          const sp2 = 18 + Math.random() * 40;
          motes.push({
            x: q.x,
            y: q.y,
            vx: ox * sp2 + along * ax.ex * (40 + Math.random() * 60) - oy * 14,
            vy: oy * sp2 + along * ax.ey * (40 + Math.random() * 60) + ox * 14,
            life: 2.5 + Math.random() * 3.5,
            age: 0,
            c: Math.random() < 0.2 ? ROSE : Math.random() < 0.5 ? WHITE : CYAN,
            s: 1 + Math.random() * 1.8,
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
          const a = (f < 0.15 ? f / 0.15 : 1 - (f - 0.15) / 0.85) * 0.95 * power;
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
