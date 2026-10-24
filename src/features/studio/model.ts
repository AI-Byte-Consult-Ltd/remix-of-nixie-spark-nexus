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

export interface CaptionWord {
  text: string;
  start: number;
  end: number;
}

export interface Caption {
  id: string;
  start: number;
  end: number;
  words: CaptionWord[];
}

export interface CaptionStyle {
  size: number;
  y: number;
  color: string;
  // Colour of the word being spoken; same as `color` turns highlighting off.
  accent: string;
  box: boolean;
  upper: boolean;
  wordsPerCaption: number;
}

export interface ZoomEffect {
  id: string;
  kind: "zoom";
  start: number;
  end: number;
  // Extra scale at the peak, 0.15 = 115 %.
  amount: number;
}

export interface Music {
  file: File;
  url: string;
  name: string;
  duration: number;
  volume: number;
}

export interface Background {
  kind: "blur" | "color";
  color: string;
}

export interface Project {
  title: string;
  aspect: Aspect;
  fit: Fit;
  transition: Transition;
  background: Background;
  clips: Clip[];
  texts: TextItem[];
  captions: Caption[];
  captionStyle: CaptionStyle;
  effects: ZoomEffect[];
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
export const BACKGROUND_COLORS = ["#000000", "#ffffff", "#f5e6c8", "#1e293b", "#7c3aed", "#0ea5e9"];

export const DEFAULT_CAPTION_STYLE: CaptionStyle = {
  size: 0.075,
  y: 0.72,
  color: "#ffffff",
  accent: "#ffd400",
  box: false,
  upper: true,
  wordsPerCaption: 3,
};

export const newProject = (): Project => ({
  title: "",
  aspect: "9:16",
  fit: "cover",
  transition: "none",
  background: { kind: "blur", color: "#000000" },
  clips: [],
  texts: [],
  captions: [],
  captionStyle: { ...DEFAULT_CAPTION_STYLE },
  effects: [],
  music: null,
});

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

// Punch-in zoom: eases in over the first 30 % of the effect, holds, eases out over the last 30 %.
export const zoomAt = (effects: ZoomEffect[], t: number) => {
  let scale = 1;
  for (const e of effects) {
    if (t < e.start || t >= e.end) continue;
    const len = e.end - e.start;
    const ramp = Math.max(0.05, len * 0.3);
    const k = Math.min(1, (t - e.start) / ramp, (e.end - t) / ramp);
    const eased = k * k * (3 - 2 * k);
    scale = Math.max(scale, 1 + e.amount * eased);
  }
  return scale;
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
  zoom = 1,
) => {
  const scale = (mode === "cover" ? Math.max(w / sw, h / sh) : Math.min(w / sw, h / sh)) * zoom;
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

const FONT = 'Inter, "Segoe UI", Roboto, Arial, sans-serif';

const boxFill = (color: string) => (color === "#111111" ? "rgba(255,255,255,0.88)" : "rgba(0,0,0,0.62)");
const strokeFill = (color: string) => (color === "#111111" ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.75)");

const roundRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
  ctx.beginPath();
  if (typeof ctx.roundRect === "function") ctx.roundRect(x, y, w, h, r);
  else ctx.rect(x, y, w, h);
  ctx.fill();
};

export const drawText = (ctx: CanvasRenderingContext2D, item: TextItem, w: number, h: number) => {
  if (!item.text.trim()) return;
  const fontSize = Math.round(Math.min(w, h) * item.size);
  ctx.save();
  ctx.font = `800 ${fontSize}px ${FONT}`;
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
      ctx.fillStyle = boxFill(item.color);
      roundRect(ctx, w / 2 - tw / 2 - padX, cy - lineH / 2, tw + padX * 2, lineH, fontSize * 0.2);
    } else {
      ctx.lineJoin = "round";
      ctx.lineWidth = Math.max(2, fontSize * 0.12);
      ctx.strokeStyle = strokeFill(item.color);
      ctx.strokeText(line, w / 2, cy);
    }
    ctx.fillStyle = item.color;
    ctx.fillText(line, w / 2, cy);
  });
  ctx.restore();
};

// Captions are drawn word by word so the word being spoken can take the accent colour.
export const drawCaption = (
  ctx: CanvasRenderingContext2D,
  cap: Caption,
  style: CaptionStyle,
  w: number,
  h: number,
  t: number,
) => {
  const words = cap.words.map((wd) => ({ ...wd, text: style.upper ? wd.text.toUpperCase() : wd.text }));
  if (!words.length) return;
  const fontSize = Math.round(Math.min(w, h) * style.size);
  ctx.save();
  ctx.font = `900 ${fontSize}px ${FONT}`;
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  const space = ctx.measureText(" ").width;
  const maxW = w * 0.86;
  const lines: { words: typeof words; width: number }[] = [];
  let cur: typeof words = [];
  let curW = 0;
  for (const wd of words) {
    const ww = ctx.measureText(wd.text).width;
    const next = cur.length ? curW + space + ww : ww;
    if (cur.length && next > maxW) {
      lines.push({ words: cur, width: curW });
      cur = [wd];
      curW = ww;
    } else {
      cur.push(wd);
      curW = next;
    }
  }
  if (cur.length) lines.push({ words: cur, width: curW });
  const lineH = fontSize * 1.2;
  const blockH = lineH * lines.length;
  const top = Math.min(Math.max(style.y * h - blockH / 2, h * 0.03), h * 0.97 - blockH);
  lines.forEach((line, i) => {
    const cy = top + lineH * (i + 0.5);
    let x = w / 2 - line.width / 2;
    if (style.box) {
      const padX = fontSize * 0.35;
      ctx.fillStyle = boxFill(style.color);
      roundRect(ctx, x - padX, cy - lineH / 2, line.width + padX * 2, lineH, fontSize * 0.2);
    }
    for (const wd of line.words) {
      const active = t >= wd.start && t < wd.end;
      if (!style.box) {
        ctx.lineJoin = "round";
        ctx.lineWidth = Math.max(2, fontSize * 0.14);
        ctx.strokeStyle = strokeFill(style.color);
        ctx.strokeText(wd.text, x, cy);
      }
      ctx.fillStyle = active ? style.accent : style.color;
      ctx.fillText(wd.text, x, cy);
      x += ctx.measureText(wd.text).width + space;
    }
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
  ctx.fillStyle = p.fit === "contain" && p.background.kind === "color" ? p.background.color : "#000";
  ctx.fillRect(0, 0, w, h);
  if (frame && frame.width > 0 && frame.height > 0) {
    const useFilter = canvasFilterSupported();
    const zoom = zoomAt(p.effects, t);
    if (p.fit === "contain" && p.background.kind === "blur" && useFilter) {
      // Blurred, darkened copy behind the full picture, like the phone editors do.
      ctx.filter = `blur(${Math.round(Math.min(w, h) / 30)}px) brightness(0.55)`;
      drawFitted(ctx, frame.image, frame.width, frame.height, w, h, "cover");
      ctx.filter = "none";
    }
    if (useFilter) ctx.filter = FILTERS[filter];
    drawFitted(ctx, frame.image, frame.width, frame.height, w, h, p.fit, zoom);
    if (useFilter) ctx.filter = "none";
  }
  for (const item of p.texts) if (t >= item.start && t < item.end) drawText(ctx, item, w, h);
  for (const cap of p.captions) if (t >= cap.start && t < cap.end) drawCaption(ctx, cap, p.captionStyle, w, h, t);
  const dip = Math.max(fadeAmount(p, spans, t), edgeFade(p, total, t));
  if (dip > 0) {
    ctx.fillStyle = `rgba(0,0,0,${dip.toFixed(3)})`;
    ctx.fillRect(0, 0, w, h);
  }
  ctx.restore();
};

// Groups recognised words into captions of `perCaption` words, also breaking at
// pauses and sentence ends so a caption never spans silence.
export const buildCaptions = (words: CaptionWord[], perCaption: number): Caption[] => {
  const out: Caption[] = [];
  let cur: CaptionWord[] = [];
  const flush = () => {
    if (!cur.length) return;
    out.push({ id: uid(), start: cur[0].start, end: cur[cur.length - 1].end, words: cur });
    cur = [];
  };
  for (const wd of words) {
    const prev = cur[cur.length - 1];
    if (prev && (wd.start - prev.end > 0.6 || /[.!?…]$/.test(prev.text))) flush();
    cur.push(wd);
    if (cur.length >= perCaption) flush();
  }
  flush();
  // Keep each caption up until the next one starts, unless there is a real pause.
  for (let i = 0; i < out.length - 1; i++) {
    const gap = out[i + 1].start - out[i].end;
    if (gap > 0 && gap < 0.6) out[i].end = out[i + 1].start;
  }
  return out;
};

export const captionWords = (captions: Caption[]) => captions.flatMap((c) => c.words);

// Re-times edited caption text evenly across the caption's span.
export const retimeCaption = (cap: Caption, text: string): Caption => {
  const parts = text.split(/\s+/).filter(Boolean);
  const len = (cap.end - cap.start) / Math.max(1, parts.length);
  return {
    ...cap,
    words: parts.map((p, i) => ({ text: p, start: cap.start + i * len, end: cap.start + (i + 1) * len })),
  };
};

export const formatTime = (s: number) => {
  const v = Math.max(0, s);
  const m = Math.floor(v / 60);
  const sec = v - m * 60;
  return `${m}:${sec.toFixed(1).padStart(4, "0")}`;
};
