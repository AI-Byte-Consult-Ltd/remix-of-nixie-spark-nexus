import { useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, Loader2, MinusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AnalysisOutcome, AnalysisStage, StageTone } from "./analysisStages";
import { analysisTexts } from "./analysisStages";
import type { AppLanguage } from "./types";

/*
 * 2026-11-11 (Alexander): "DNA / RNA" animation of a running analysis.
 * A rotating double helix of glowing multi-coloured dots; every rung is
 * one real stage of the NICS engine (see analysisStages.ts). A rung lights
 * up and sends a pulse along the strands only when [07 APP] has returned
 * the real result of that stage. Plain canvas 2D (no WebGL library): runs
 * in the Telegram Mini App, the web cabinet and the Windows app alike.
 */

// NICS colours: amber, rose, violet, sky, emerald.
const PALETTE: Array<[number, number, number]> = [
  [245, 158, 11],
  [251, 113, 133],
  [167, 139, 250],
  [56, 189, 248],
  [52, 211, 153],
];

const TONE_RGB: Record<StageTone, [number, number, number]> = {
  up: [52, 211, 153],
  down: [251, 113, 133],
  flat: [148, 163, 184],
  warn: [251, 191, 36],
  good: [56, 189, 248],
  neutral: [167, 139, 250],
};

const mix = (a: [number, number, number], b: [number, number, number], t: number): [number, number, number] => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];

const paletteAt = (u: number): [number, number, number] => {
  const x = ((u % 1) + 1) % 1;
  const scaled = x * PALETTE.length;
  const i = Math.floor(scaled);
  return mix(PALETTE[i % PALETTE.length], PALETTE[(i + 1) % PALETTE.length], scaled - i);
};

const rgba = ([r, g, b]: [number, number, number], a: number) => `rgba(${r | 0},${g | 0},${b | 0},${Math.max(0, Math.min(1, a))})`;

interface Pulse {
  rung: number;
  born: number;
  rgb: [number, number, number];
  strength: number;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  rgb: [number, number, number];
}

interface HelixCanvasProps {
  stages: AnalysisStage[];
  outcome: AnalysisOutcome;
  height?: number;
}

const HelixCanvas = ({ stages, outcome, height = 300 }: HelixCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateRef = useRef({ stages, outcome });
  const pulsesRef = useRef<Pulse[]>([]);
  const sparksRef = useRef<Spark[]>([]);
  const litRef = useRef<Set<number>>(new Set());
  const outcomeRef = useRef<AnalysisOutcome>("running");

  // New real results -> pulses (the "heartbeat" Alexander asked for).
  useEffect(() => {
    stateRef.current = { stages, outcome };
    const now = performance.now();
    stages.forEach((stage, index) => {
      if (stage.state === "done" && !litRef.current.has(index)) {
        litRef.current.add(index);
        pulsesRef.current.push({ rung: index, born: now, rgb: TONE_RGB[stage.tone], strength: 1 });
      }
    });
    if (outcome !== outcomeRef.current) {
      outcomeRef.current = outcome;
      if (outcome === "signal") {
        const tone = stages[stages.length - 1]?.tone ?? "good";
        for (let i = 0; i < stages.length; i += 1) {
          pulsesRef.current.push({ rung: i, born: now + i * 90, rgb: TONE_RGB[tone], strength: 1.4 });
        }
      }
    }
  }, [stages, outcome]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let width = 0;
    let dpr = 1;

    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      width = canvas.clientWidth;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
    };
    resize();
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
    observer?.observe(canvas);

    // Fixed random cloud, generated once per mount.
    const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
    const dust = Array.from({ length: reduce ? 900 : 2000 }, (_, i) => ({
      s: i % 2,
      v: Math.random(),
      jr: gauss() * 11,
      ja: gauss() * 0.12,
      size: 0.9 + Math.random() * 1.5,
      alpha: 0.45 + Math.random() * 0.55,
      hue: Math.random(),
    }));

    const start = performance.now();
    const draw = (now: number) => {
      const { stages: list, outcome: result } = stateRef.current;
      const rungs = list.length;
      const t = (now - start) / 1000;
      const running = result === "running";
      const speed = reduce ? 0.15 : running ? 1.1 : result === "signal" ? 0.7 : 0.35;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";

      const cx = width / 2;
      const top = 22;
      const bottom = height - 22;
      const span = bottom - top;
      const breath = 1 + Math.sin(t * (running ? 2.2 : 1.2)) * 0.05;
      const radius = Math.min(96, width * 0.3) * breath;
      const turns = 2;
      const phase = t * speed;

      // Pulses travelling from a rung along both strands.
      const pulses = pulsesRef.current.filter((p) => now - p.born < 2200);
      pulsesRef.current = pulses;

      const rungY = (i: number) => top + (span * (i + 0.5)) / rungs;
      const angleAt = (y: number) => phase + ((y - top) / span) * turns * Math.PI * 2;

      const pulseBoost = (y: number) => {
        let boost = 0;
        let rgb: [number, number, number] | null = null;
        for (const p of pulses) {
          const age = (now - p.born) / 1000;
          if (age < 0) continue;
          const front = age * 260;
          const d = Math.abs(Math.abs(y - rungY(p.rung)) - front);
          const k = Math.max(0, 1 - d / 26) * Math.max(0, 1 - age / 2.2) * p.strength;
          if (k > boost) {
            boost = k;
            rgb = p.rgb;
          }
        }
        return { boost, rgb };
      };

      /*
       * Strands as clouds of fine "dust" (~520 particles each) scattered
       * around the helix curve; base pairs (rungs) as bright white bridges.
       * A strand section takes the colour of its stage once that stage has
       * a real result; before that it shimmers in the NICS palette.
       */
      const stageAt = (y: number) => Math.max(0, Math.min(rungs - 1, Math.floor(((y - top) / span) * rungs)));
      for (const d of dust) {
        const y = top + span * d.v;
        const a = angleAt(y) + d.s * Math.PI + d.ja;
        const z = Math.cos(a);
        const r = radius + d.jr;
        const x = cx + Math.sin(a) * r;
        const stage = list[stageAt(y)];
        const lit = stage?.state === "done";
        const active = stage?.state === "active";
        const base = lit
          ? mix(TONE_RGB[stage.tone], paletteAt(d.hue), 0.25)
          : paletteAt(d.hue + t * 0.05 + d.s * 0.5);
        const { boost, rgb } = pulseBoost(y);
        const color = rgb ? mix(base, rgb, Math.min(1, boost)) : base;
        const depth = 0.35 + (z + 1) * 0.32;
        const shimmer = active ? 0.75 + 0.25 * Math.sin(t * 7 + d.v * 40) : 1;
        const alpha = (lit ? 1 : 0.8) * depth * shimmer * d.alpha + boost * 0.5;
        const size = d.size * (0.7 + (z + 1) * 0.25) * (1 + boost * 0.8);
        ctx.fillStyle = rgba(color, alpha);
        ctx.fillRect(x - size / 2, y - size / 2, size, size);
      }

      // Rungs = stages: white bridge dots between the strands.
      list.forEach((stage, index) => {
        const y = rungY(index);
        const a = angleAt(y);
        const x1 = cx + Math.sin(a) * radius;
        const x2 = cx + Math.sin(a + Math.PI) * radius;
        const lit = stage.state === "done";
        const active = stage.state === "active";
        const tone = TONE_RGB[stage.tone];
        const glowA = lit ? 0.85 : active ? 0.3 + 0.4 * (0.5 + 0.5 * Math.sin(t * 6)) : 0.1;
        const segments = 9;
        for (let k = 1; k < segments; k += 1) {
          const u = k / segments;
          const x = x1 + (x2 - x1) * u;
          const rgb = lit ? mix([255, 255, 255], tone, 0.35) : ([226, 232, 240] as [number, number, number]);
          const r = lit ? 1.6 : 1.1;
          const g = ctx.createRadialGradient(x, y, 0, x, y, r * 4);
          g.addColorStop(0, rgba(rgb, glowA));
          g.addColorStop(0.3, rgba(rgb, glowA * 0.35));
          g.addColorStop(1, rgba(rgb, 0));
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(x, y, r * 4, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Sparks: born at a rung when it lights, drifting like free RNA bases.
      for (const p of pulses) {
        if (now - p.born < 40 && now - p.born >= 0) {
          const y = rungY(p.rung);
          for (let k = 0; k < (reduce ? 4 : 14); k += 1) {
            const ang = Math.random() * Math.PI * 2;
            const v = 0.6 + Math.random() * 1.6;
            sparksRef.current.push({ x: cx, y, vx: Math.cos(ang) * v, vy: Math.sin(ang) * v - 0.3, life: 1, rgb: p.rgb });
          }
        }
      }
      // Ambient free bases while analysing.
      if (running && !reduce && Math.random() < 0.18) {
        sparksRef.current.push({
          x: cx + (Math.random() - 0.5) * radius * 2.6,
          y: bottom,
          vx: (Math.random() - 0.5) * 0.2,
          vy: -0.35 - Math.random() * 0.5,
          life: 1,
          rgb: paletteAt(Math.random()),
        });
      }
      sparksRef.current = sparksRef.current.filter((s) => s.life > 0).slice(-160);
      for (const s of sparksRef.current) {
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.985;
        s.vy *= 0.985;
        s.life -= 0.012;
        ctx.fillStyle = rgba(s.rgb, s.life * 0.7);
        ctx.beginPath();
        ctx.arc(s.x, s.y, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = "source-over";
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, [height]);

  return <canvas ref={canvasRef} className="block w-full" style={{ height }} aria-hidden="true" />;
};

const TONE_TEXT: Record<StageTone, string> = {
  up: "text-emerald-300",
  down: "text-rose-300",
  flat: "text-slate-300",
  warn: "text-amber-300",
  good: "text-sky-300",
  neutral: "text-slate-400",
};

/*
 * Real results arrive in one or two answers from the server; reveal them
 * one rung at a time (~0.45 s apart) so each one is visible. Every rung
 * shown as done is already confirmed by the server.
 */
const useStaggered = (stages: AnalysisStage[]) => {
  const target = stages.filter((stage) => stage.state === "done").length;
  const [shown, setShown] = useState(target);
  useEffect(() => {
    if (shown >= target) {
      if (shown !== target) setShown(target);
      return;
    }
    const timer = window.setTimeout(() => setShown((value) => value + 1), 450);
    return () => window.clearTimeout(timer);
  }, [shown, target]);
  return useMemo(() => {
    let count = 0;
    let activeSet = false;
    return stages.map((stage) => {
      if (stage.state === "done") {
        count += 1;
        if (count > shown) {
          if (!activeSet) {
            activeSet = true;
            return { ...stage, state: "active" as const, detail: "" };
          }
          return { ...stage, state: "pending" as const, detail: "" };
        }
        return stage;
      }
      if (stage.state === "active" && activeSet) return { ...stage, state: "pending" as const };
      return stage;
    });
  }, [stages, shown]);
};

export const AnalysisHelix = ({
  stages,
  outcome,
  language,
  label,
}: {
  stages: AnalysisStage[];
  outcome: AnalysisOutcome;
  language: AppLanguage;
  label: string;
}) => {
  const tx = analysisTexts(language);
  const visible = useStaggered(stages);
  const allShown = visible.every((stage, i) => stage.state === stages[i].state);
  const shownOutcome: AnalysisOutcome = allShown ? outcome : "running";
  const headline =
    shownOutcome === "signal"
      ? tx.outcomeSignal
      : shownOutcome === "no_setup"
        ? tx.outcomeNoSetup
        : shownOutcome === "no_result"
          ? tx.outcomeNoResult
          : shownOutcome === "failed"
            ? tx.outcomeFailed
            : tx.running;

  return (
    <div className="overflow-hidden rounded-[24px] border border-violet-300/15 bg-[radial-gradient(circle_at_50%_30%,rgba(167,139,250,0.14),transparent_55%),radial-gradient(circle_at_80%_90%,rgba(56,189,248,0.10),transparent_50%),linear-gradient(160deg,#10131c,#07080d)] text-white">
      <div className="flex items-start justify-between gap-3 px-4 pt-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-violet-200/70">{tx.title}</p>
          <p className="mt-1 text-base font-semibold">{label}</p>
          <p
            className={cn(
              "mt-0.5 text-xs",
              shownOutcome === "signal" ? "text-emerald-300" : shownOutcome === "running" ? "text-amber-200" : "text-slate-300",
            )}
          >
            {headline}
          </p>
        </div>
      </div>
      <div className="grid gap-2 p-3 sm:grid-cols-[minmax(150px,220px)_1fr] sm:items-center">
        <HelixCanvas stages={visible} outcome={shownOutcome} height={300} />
        <ol className="space-y-1.5 px-1 pb-1">
          {visible.map((stage) => (
            <li key={stage.key} className="flex items-start gap-2.5">
              <span className="mt-0.5 shrink-0">
                {stage.state === "done" ? (
                  stage.tone === "flat" ? (
                    <MinusCircle className="h-4 w-4 text-slate-400" />
                  ) : (
                    <CheckCircle2 className={cn("h-4 w-4", TONE_TEXT[stage.tone])} />
                  )
                ) : stage.state === "active" ? (
                  <Loader2 className="h-4 w-4 animate-spin text-amber-300" />
                ) : (
                  <span className="block h-4 w-4 rounded-full border border-slate-600" />
                )}
              </span>
              <span className="min-w-0">
                <span className={cn("block text-sm leading-5", stage.state === "pending" ? "text-slate-500" : "text-slate-100")}>
                  {stage.label}
                </span>
                {stage.state === "done" && stage.detail && (
                  <span className={cn("block text-xs leading-4", TONE_TEXT[stage.tone])}>{stage.detail}</span>
                )}
              </span>
            </li>
          ))}
        </ol>
      </div>
      <p className="px-4 pb-4 text-[11px] leading-4 text-slate-500">{tx.lead}</p>
    </div>
  );
};
