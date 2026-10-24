// NICS Studio project model and the frame renderer shared by the live
// preview and the MP4 export, so what the user sees is what they get.

export type Aspect = "9:16" | "16:9" | "1:1";
export type Fit = "cover" | "contain";
export type FilterId = "none" | "vivid" | "warm" | "cool" | "bw" | "fade";
export type Transition = "none" | "fade";

export interface Clip {
  id: string;
  kind: "video" | "image";
  file: File;
  url: string;
  name: string;
  // Length of the source file; for images, the longest the photo may stay on screen.
  sourceDuration: number;
  in: number;
  out: number;
  volume: number;
  filter: FilterId;
}

export interface TextItem {
  id: string;
  text: string;
  start: number;
  end: number;
  // Vertical centre of the text block, 0 = top, 1 = bottom.
  y: number;
  // Font size as a share of the frame's shorter side.
  size: number;
  color: string;
  box: boolean;
}

export interface Music {
  file: File;
  url: string;
  name: string;
  duration: number;
  volume: number;
}

export interface Project {
  aspect: Aspect;
  fit: Fit;
  transition: Transition;
  clips: Clip[];
  texts: TextItem[];
  music: Music | null;
}

export const MAX_DURATION = 180;
export const IMAGE_DEFAULT = 3;
export const IMAGE_MAX = 30;
export const FADE = 0.4;
export const FPS = 30;

export const EXPORT_SIZE: Record<Aspect, { w: number; h: number }> = {
  "9:16": { w: 1080, h: 1920 },
  "16:9": { w: 1920, h: 1080 },
  "1:1": { w: 1080, h: 1080 },
};

export const FILTERS: Record<FilterId, string> = {
  none: "none",
  vivid: "saturate(1.45) contrast(1.08)",
  warm: "sepia(0.25) saturate(1.3) brightness(1.03)",
  cool: "saturate(1.1) hue-rotate(-12deg) brightness(1.02)",
  bw: "grayscale(1) contrast(1.1)",
  fade: "contrast(0.85) brightness(1.08) saturate(0.75)",
};

export const TEXT_COLORS = ["#ffffff", "#ffd400", "#ff3b6b", "#2ee6a6", "#3ab4ff", "#111111"];

export const uid = () => Math.random().toString(36).slice(2, 10);

export const clipLength = (c: Clip) => Math.max(0, c.out - c.in);

export const totalDuration = (p: Project) => p.clips.reduce((s, c) => s + clipLength(c), 0);

export interface ClipSpan {
  clip: Clip;
  index: number;
  start: number;
  end: number;
}

export const clipSpans = (p: Project): ClipSpan[] => {
  let t = 0;
  return p.clips.map((clip, index) => {
    const start = t;
    t += clipLength(clip);
    return { clip, index, start, end: t };
  });
};

export const spanAt = (spans: ClipSpan[], t: number): ClipSpan | null => {
  if (!spans.length) return null;
  for (const s of spans) if (t < s.end) return s;
  return spans[spans.length - 1];
};

// Black dip between clips: 1 at a cut, 0 mid-clip.
export const fadeAmount = (p: Project, spans: ClipSpan[], t: number) => {
  if (p.transition !== "fade" || spans.length < 2) return 0;
  let a = 0;
  for (let i = 1; i < spans.length; i++) {
    const d = Math.abs(t - spans[i].start);
    if (d < FADE) a = Math.max(a, 1 - d / FADE);
  }
  return a;
};

// Fade in on the first clip and out on the last, so every video starts and ends clean.
export const edgeFade = (p: Project, total: number, t: number) => {
  if (p.transition !== "fade" || total <= 0) return 0;
  if (t < FADE) return 1 - t / FADE;
  if (t > total - FADE) return Math.min(1, (t - (total - FADE)) / FADE);
  return 0;
};

let filterSupport: boolean | null = null;
export const canvasFilterSupported = () => {
  if (filterSupport === null) {
    const ctx = document.createElement("canvas").getContext("2d");
    filterSupport = !!ctx && "filter" in ctx;
  }
  return filterSupport;
};

const drawFitted = (
  ctx: CanvasRenderingContext2D,
  src: CanvasImageSource,
  sw: number,
  sh: number,
  w: number,
  h: number,
  mode: Fit,
) => {
  const scale = mode === "cover" ? Math.max(w / sw, h / sh) : Math.min(w / sw, h / sh);
  const dw = sw * scale;
  const dh = sh * scale;
  ctx.drawImage(src, (w - dw) / 2, (h - dh) / 2, dw, dh);
};

const wrapLines = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number) => {
  const lines: string[] = [];
  for (const para of text.split("\n")) {
    const words = para.split(/\s+/).filter(Boolean);
    let line = "";
    for (const word of words) {
      const next = line ? `${line} ${word}` : word;
      if (line && ctx.measureText(next).width > maxWidth) {
        lines.push(line);
        line = word;
      } else {
        line = next;
      }
    }
    lines.push(line);
  }
  return lines;
};

export const drawText = (ctx: CanvasRenderingContext2D, item: TextItem, w: number, h: number) => {
  if (!item.text.trim()) return;
  const fontSize = Math.round(Math.min(w, h) * item.size);
  ctx.save();
  ctx.font = `800 ${fontSize}px Inter, "Segoe UI", Roboto, Arial, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const lines = wrapLines(ctx, item.text, w * 0.86);
  const lineH = fontSize * 1.2;
  const blockH = lineH * lines.length;
  const top = Math.min(Math.max(item.y * h - blockH / 2, h * 0.03), h * 0.97 - blockH);
  lines.forEach((line, i) => {
    const cy = top + lineH * (i + 0.5);
    if (item.box) {
      const tw = ctx.measureText(line).width;
      const padX = fontSize * 0.35;
      ctx.fillStyle = item.color === "#111111" ? "rgba(255,255,255,0.88)" : "rgba(0,0,0,0.62)";
      ctx.beginPath();
      const rx = w / 2 - tw / 2 - padX;
      const ry = cy - lineH / 2;
      if (typeof ctx.roundRect === "function") ctx.roundRect(rx, ry, tw + padX * 2, lineH, fontSize * 0.2);
      else ctx.rect(rx, ry, tw + padX * 2, lineH);
      ctx.fill();
    } else {
      ctx.lineJoin = "round";
      ctx.lineWidth = Math.max(2, fontSize * 0.12);
      ctx.strokeStyle = item.color === "#111111" ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.75)";
      ctx.strokeText(line, w / 2, cy);
    }
    ctx.fillStyle = item.color;
    ctx.fillText(line, w / 2, cy);
  });
  ctx.restore();
};

export interface FrameSource {
  image: CanvasImageSource;
  width: number;
  height: number;
}

// Draws one output frame at time t. `frame` is the picture of the active clip
// at that moment (a <video>, an <img> or a decoded canvas), or null for black.
export const drawFrame = (
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  p: Project,
  t: number,
  frame: FrameSource | null,
  filter: FilterId,
  spans: ClipSpan[],
  total: number,
) => {
  ctx.save();
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, w, h);
  if (frame && frame.width > 0 && frame.height > 0) {
    const useFilter = canvasFilterSupported();
    if (p.fit === "contain") {
      // Blurred, darkened copy behind the full picture, like the phone editors do.
      if (useFilter) {
        ctx.filter = `blur(${Math.round(Math.min(w, h) / 30)}px) brightness(0.55)`;
        drawFitted(ctx, frame.image, frame.width, frame.height, w, h, "cover");
        ctx.filter = "none";
      }
    }
    if (useFilter) ctx.filter = FILTERS[filter];
    drawFitted(ctx, frame.image, frame.width, frame.height, w, h, p.fit);
    if (useFilter) ctx.filter = "none";
  }
  for (const item of p.texts) if (t >= item.start && t < item.end) drawText(ctx, item, w, h);
  const dip = Math.max(fadeAmount(p, spans, t), edgeFade(p, total, t));
  if (dip > 0) {
    ctx.fillStyle = `rgba(0,0,0,${dip.toFixed(3)})`;
    ctx.fillRect(0, 0, w, h);
  }
  ctx.restore();
};

export const formatTime = (s: number) => {
  const v = Math.max(0, s);
  const m = Math.floor(v / 60);
  const sec = v - m * 60;
  return `${m}:${sec.toFixed(1).padStart(4, "0")}`;
};
