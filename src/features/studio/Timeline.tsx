import { useCallback, useEffect, useRef, useState } from "react";
import { Captions, Film, Maximize2, Music2, Pause, Play, Scissors, Sparkles, Type, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type ClipSpan, type Project, MAX_DURATION, clipLength, formatTime } from "./model";
import type { StudioStrings } from "./strings";

export type Selection =
  | { type: "clip" | "text" | "caption" | "effect"; id: string }
  | { type: "music" }
  | null;

type ItemKind = "text" | "caption" | "effect";

interface Drag {
  kind: "clip" | ItemKind;
  id: string;
  mode: "move" | "start" | "end";
  x0: number;
  pps: number;
  start: number;
  end: number;
  in: number;
  out: number;
  moved: boolean;
}

interface Props {
  s: StudioStrings;
  project: Project;
  spans: ClipSpan[];
  total: number;
  time: number;
  playing: boolean;
  busy: boolean;
  selection: Selection;
  onSelect: (sel: Selection) => void;
  onSeek: (t: number) => void;
  onTogglePlay: () => void;
  onSplit: () => void;
  onClipRange: (id: string, a: number, b: number) => void;
  onItemRange: (kind: ItemKind, id: string, start: number, end: number) => void;
}

const TICK_STEPS = [0.5, 1, 2, 5, 10, 15, 30, 60];
const LABEL_W = 92;

const Timeline = ({
  s,
  project,
  spans,
  total,
  time,
  playing,
  busy,
  selection,
  onSelect,
  onSeek,
  onTogglePlay,
  onSplit,
  onClipRange,
  onItemRange,
}: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(600);
  const [zoom, setZoom] = useState(1);
  const dragRef = useRef<Drag | null>(null);
  const [dragging, setDragging] = useState<Drag | null>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setWidth(el.clientWidth));
    ro.observe(el);
    setWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  // While dragging, the scale stays what it was at pointer-down so trimmed
  // blocks don't shift under the finger.
  const fitPps = (width - 16) / Math.max(total, 5);
  const pps = dragging ? dragging.pps : fitPps * zoom;
  const contentW = Math.max(width - 16, total * pps);
  const x = (t: number) => t * pps;

  const tickStep = TICK_STEPS.find((st) => st * pps >= 64) ?? 120;
  const ticks = Array.from({ length: Math.floor(Math.max(total, 5) / tickStep) + 1 }, (_, i) => i * tickStep);

  // Keep the playhead in view while playing.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !playing) return;
    const px = x(time);
    if (px < el.scrollLeft || px > el.scrollLeft + el.clientWidth - 40) el.scrollLeft = Math.max(0, px - 40);
  });

  const seekFromEvent = (e: React.PointerEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    onSeek((e.clientX - rect.left + el.scrollLeft - 8) / pps);
  };

  const onMove = useCallback(
    (e: PointerEvent) => {
      const d = dragRef.current;
      if (!d) return;
      const dt = (e.clientX - d.x0) / d.pps;
      if (Math.abs(e.clientX - d.x0) > 3) d.moved = true;
      if (!d.moved) return;
      if (d.kind === "clip") {
        const clip = project.clips.find((c) => c.id === d.id);
        if (!clip) return;
        const room = MAX_DURATION - (total - clipLength(clip));
        if (d.mode === "start" && clip.kind === "video") {
          const a = Math.min(Math.max(0, d.in + dt), d.out - 0.1);
          onClipRange(d.id, a, d.out);
        } else if (d.mode === "end") {
          const max = Math.min(clip.sourceDuration, d.in + room);
          onClipRange(d.id, d.in, Math.min(Math.max(d.in + 0.1, d.out + dt), max));
        }
        return;
      }
      const len = d.end - d.start;
      if (d.mode === "move") {
        const start = Math.min(Math.max(0, d.start + dt), Math.max(0, total - len));
        onItemRange(d.kind, d.id, start, start + len);
      } else if (d.mode === "start") {
        onItemRange(d.kind, d.id, Math.min(Math.max(0, d.start + dt), d.end - 0.1), d.end);
      } else {
        onItemRange(d.kind, d.id, d.start, Math.max(d.start + 0.1, Math.min(total, d.end + dt)));
      }
    },
    [project.clips, total, onClipRange, onItemRange],
  );

  useEffect(() => {
    const up = () => {
      dragRef.current = null;
      setDragging(null);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [onMove]);

  const startDrag = (e: React.PointerEvent, d: Omit<Drag, "x0" | "pps" | "moved">) => {
    if (busy) return;
    e.stopPropagation();
    const drag = { ...d, x0: e.clientX, pps, moved: false };
    dragRef.current = drag;
    setDragging(drag);
  };

  const isSel = (type: string, id: string) => selection?.type === type && "id" in selection && selection.id === id;

  const handles = (onDown: (mode: "start" | "end") => (e: React.PointerEvent) => void, showStart = true) => (
    <>
      {showStart && (
        <span
          onPointerDown={onDown("start")}
          className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize bg-primary/70 opacity-0 group-hover:opacity-100 rounded-l"
        />
      )}
      <span
        onPointerDown={onDown("end")}
        className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize bg-primary/70 opacity-0 group-hover:opacity-100 rounded-r"
      />
    </>
  );

  const itemTrack = (kind: ItemKind, items: { id: string; start: number; end: number; label: string }[], color: string) =>
    items.map((it) => {
      const start = Math.min(it.start, total);
      const end = Math.min(it.end, total);
      const sel = isSel(kind, it.id);
      return (
        <div
          key={it.id}
          onPointerDown={(e) => {
            onSelect({ type: kind, id: it.id });
            startDrag(e, { kind, id: it.id, mode: "move", start: it.start, end: it.end, in: 0, out: 0 });
          }}
          className={cn(
            "group absolute top-1 bottom-1 rounded px-1.5 text-[10px] leading-5 truncate cursor-grab select-none touch-none",
            color,
            sel && "ring-2 ring-primary z-10",
          )}
          style={{ left: x(start), width: Math.max(4, x(end - start)) }}
          title={it.label}
        >
          {it.label}
          {handles((mode) => (e) => startDrag(e, { kind, id: it.id, mode, start: it.start, end: it.end, in: 0, out: 0 }))}
        </div>
      );
    });

  const rows: { key: string; icon: React.ReactNode; label: string; h: string; content: React.ReactNode }[] = [
    {
      key: "captions",
      icon: <Captions className="w-3.5 h-3.5" />,
      label: s.tracks.captions,
      h: "h-7",
      content: itemTrack(
        "caption",
        project.captions.map((c) => ({ id: c.id, start: c.start, end: c.end, label: c.words.map((w) => w.text).join(" ") })),
        "bg-violet-500/30",
      ),
    },
    {
      key: "text",
      icon: <Type className="w-3.5 h-3.5" />,
      label: s.tracks.text,
      h: "h-7",
      content: itemTrack(
        "text",
        project.texts.map((t) => ({ id: t.id, start: t.start, end: t.end, label: t.text || "…" })),
        "bg-amber-500/30",
      ),
    },
    {
      key: "effects",
      icon: <Sparkles className="w-3.5 h-3.5" />,
      label: s.tracks.effects,
      h: "h-7",
      content: itemTrack(
        "effect",
        project.effects.map((ef) => ({ id: ef.id, start: ef.start, end: ef.end, label: `${s.zoom} ${Math.round(ef.amount * 100)}%` })),
        "bg-pink-500/30",
      ),
    },
    {
      key: "video",
      icon: <Film className="w-3.5 h-3.5" />,
      label: s.tracks.video,
      h: "h-12",
      content: spans.map(({ clip, start, end }) => (
        <div
          key={clip.id}
          onPointerDown={(e) => {
            e.stopPropagation();
            onSelect({ type: "clip", id: clip.id });
          }}
          className={cn(
            "group absolute top-0 bottom-0 border-r-2 border-background px-1.5 text-[10px] leading-tight overflow-hidden select-none touch-none rounded-sm",
            clip.kind === "image" ? "bg-sky-500/30" : "bg-slate-700/80 text-white",
            isSel("clip", clip.id) && "ring-2 ring-inset ring-primary",
          )}
          style={{ left: x(start), width: Math.max(4, x(end - start)) }}
          title={clip.name}
        >
          <span className="block truncate font-medium pt-1">{clip.name}</span>
          <span className="opacity-70 tabular-nums">
            {formatTime(clip.in)}–{formatTime(clip.out)}
          </span>
          {handles(
            (mode) => (e) => startDrag(e, { kind: "clip", id: clip.id, mode, start, end, in: clip.in, out: clip.out }),
            clip.kind === "video",
          )}
        </div>
      )),
    },
    {
      key: "audio",
      icon: <Music2 className="w-3.5 h-3.5" />,
      label: s.tracks.audio,
      h: "h-8",
      content: project.music && (
        <div
          onPointerDown={(e) => {
            e.stopPropagation();
            onSelect({ type: "music" });
          }}
          className={cn(
            "absolute top-1 bottom-1 left-0 rounded bg-emerald-500/30 px-1.5 text-[10px] leading-6 truncate",
            selection?.type === "music" && "ring-2 ring-primary",
          )}
          style={{ width: x(Math.min(project.music.duration, Math.max(total, 0.1))) }}
        >
          {project.music.name}
        </div>
      ),
    },
  ];

  return (
    <div className="rounded-xl border border-border/60 bg-card">
      <div className="flex flex-wrap items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 border-b border-border/50">
        <Button size="icon" variant="outline" className="h-8 w-8 rounded-full" onClick={onTogglePlay} disabled={total <= 0 || busy} aria-label={playing ? s.pause : s.play}>
          {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </Button>
        <span className="text-xs tabular-nums text-muted-foreground min-w-[96px]">
          {formatTime(time)} / {formatTime(total)}
        </span>
        <Button size="sm" variant="ghost" className="h-8" onClick={onSplit} disabled={!spans.length || busy}>
          <Scissors className="w-4 h-4 mr-1" />
          {s.split}
        </Button>
        <div className="flex-1" />
        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setZoom((z) => Math.max(1, z / 1.5))} aria-label={s.zoomOut}>
          <ZoomOut className="w-4 h-4" />
        </Button>
        <input
          type="range"
          min={1}
          max={12}
          step={0.1}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="w-24 accent-[hsl(var(--primary))] hidden sm:block"
          aria-label={s.zoomIn}
        />
        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setZoom((z) => Math.min(12, z * 1.5))} aria-label={s.zoomIn}>
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button size="sm" variant="ghost" className="h-8" onClick={() => setZoom(1)}>
          <Maximize2 className="w-3.5 h-3.5 mr-1" />
          {s.fitTimeline}
        </Button>
      </div>
      <div className="flex">
        <div className="shrink-0 border-r border-border/50 py-1" style={{ width: LABEL_W }}>
          <div className="h-6" />
          {rows.map((r) => (
            <div key={r.key} className={cn("flex items-center gap-1.5 px-2 text-[11px] text-muted-foreground my-1", r.h)}>
              {r.icon}
              <span className="truncate">{r.label}</span>
            </div>
          ))}
        </div>
        <div ref={scrollRef} className="relative flex-1 min-w-0 overflow-x-auto py-1">
          <div className="relative px-2" style={{ width: contentW + 16 }}>
            <div
              className="relative h-6 cursor-pointer select-none touch-none border-b border-border/40"
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                seekFromEvent(e);
              }}
              onPointerMove={(e) => e.buttons && seekFromEvent(e)}
            >
              {ticks.map((sec) => (
                <span key={sec} className="absolute top-1 text-[10px] text-muted-foreground tabular-nums" style={{ left: x(sec) + 2 }}>
                  <span className="absolute -left-[2px] top-0 h-4 border-l border-border/70" />
                  {formatTime(sec).replace(/\.\d$/, "")}
                </span>
              ))}
            </div>
            {rows.map((r) => (
              <div
                key={r.key}
                className={cn("relative rounded-md bg-muted/40 my-1", r.h)}
                onPointerDown={(e) => {
                  if (e.target === e.currentTarget) {
                    onSelect(null);
                    seekFromEvent(e);
                  }
                }}
              >
                {r.content}
              </div>
            ))}
            {total > 0 && (
              <div className="absolute top-0 bottom-0 pointer-events-none" style={{ left: x(Math.min(time, total)) + 8 }}>
                <div className="absolute -left-[5px] top-0 w-[11px] h-[11px] rounded-full bg-primary" />
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
