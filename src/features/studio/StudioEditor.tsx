import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Copy,
  Download,
  Film,
  ImagePlus,
  Loader2,
  Music2,
  Pause,
  Play,
  Scissors,
  Trash2,
  Type,
  Undo2,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { Language } from "@/contexts/LanguageContext";
import {
  type Aspect,
  type Clip,
  type FilterId,
  type FrameSource,
  type Project,
  type TextItem,
  FILTERS,
  IMAGE_DEFAULT,
  IMAGE_MAX,
  MAX_DURATION,
  TEXT_COLORS,
  canvasFilterSupported,
  clipLength,
  clipSpans,
  drawFrame,
  formatTime,
  spanAt,
  totalDuration,
  uid,
} from "./model";
import { ExportError, browserCanEdit, exportProject } from "./exportVideo";
import { studioStrings } from "./strings";

const PREVIEW_SIZE: Record<Aspect, { w: number; h: number }> = {
  "9:16": { w: 540, h: 960 },
  "16:9": { w: 960, h: 540 },
  "1:1": { w: 720, h: 720 },
};

type Selection = { type: "clip" | "text"; id: string } | { type: "music" } | null;
type Media = HTMLVideoElement | HTMLImageElement;

const emptyProject: Project = { aspect: "9:16", fit: "cover", transition: "none", clips: [], texts: [], music: null };

const RangeSlider = ({
  value,
  min,
  max,
  step = 0.05,
  onChange,
}: {
  value: number[];
  min: number;
  max: number;
  step?: number;
  onChange: (v: number[]) => void;
}) => (
  <SliderPrimitive.Root
    className="relative flex w-full touch-none select-none items-center py-2"
    value={value}
    min={min}
    max={max}
    step={step}
    minStepsBetweenThumbs={1}
    onValueChange={onChange}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
      <SliderPrimitive.Range className="absolute h-full bg-primary" />
    </SliderPrimitive.Track>
    {value.map((_, i) => (
      <SliderPrimitive.Thumb
        key={i}
        className="block h-5 w-5 rounded-full border-2 border-primary bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
    ))}
  </SliderPrimitive.Root>
);

const Field = ({ label, extra, children }: { label: string; extra?: string; children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between text-sm">
      <span className="font-medium text-foreground">{label}</span>
      {extra && <span className="text-muted-foreground tabular-nums">{extra}</span>}
    </div>
    {children}
  </div>
);

const Segmented = <T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) => (
  <div className="inline-flex rounded-full border border-border p-0.5 bg-background">
    {options.map((o) => (
      <button
        key={o.value}
        type="button"
        onClick={() => onChange(o.value)}
        className={cn(
          "px-3 py-1 text-sm rounded-full transition-colors",
          value === o.value ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
        )}
      >
        {o.label}
      </button>
    ))}
  </div>
);

const loadVideoMeta = (url: string) =>
  new Promise<HTMLVideoElement>((resolve, reject) => {
    const v = document.createElement("video");
    v.preload = "auto";
    v.playsInline = true;
    v.crossOrigin = "anonymous";
    v.onloadedmetadata = () => resolve(v);
    v.onerror = () => reject(new Error("video"));
    v.src = url;
  });

const loadImage = (url: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("image"));
    img.src = url;
  });

const loadAudioDuration = (url: string) =>
  new Promise<number>((resolve, reject) => {
    const a = document.createElement("audio");
    a.preload = "metadata";
    a.onloadedmetadata = () => resolve(a.duration);
    a.onerror = () => reject(new Error("audio"));
    a.src = url;
  });

const StudioEditor = ({ lang }: { lang: Language }) => {
  const s = studioStrings(lang);
  const [project, setProject] = useState<Project>(emptyProject);
  const [history, setHistory] = useState<Project[]>([]);
  const [selection, setSelection] = useState<Selection>(null);
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [exportState, setExportState] = useState<
    { phase: "running"; progress: number } | { phase: "done"; url: string; name: string } | { phase: "error"; message: string } | null
  >(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRef = useRef(new Map<string, Media>());
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const projectRef = useRef(project);
  const timeRef = useRef(0);
  const playingRef = useRef(false);
  const clockRef = useRef({ t: 0, wall: 0 });
  const lastPushRef = useRef(0);
  const cancelRef = useRef(false);
  const mediaInputRef = useRef<HTMLInputElement>(null);
  const musicInputRef = useRef<HTMLInputElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  projectRef.current = project;
  const canEncode = useMemo(() => browserCanEdit(), []);
  const filtersOk = useMemo(() => canvasFilterSupported(), []);
  const total = totalDuration(project);
  const spans = useMemo(() => clipSpans(project), [project]);

  // Every edit goes through here so it can be undone. Rapid edits (dragging a
  // slider) collapse into one undo step.
  const commit = useCallback((next: Project | ((p: Project) => Project)) => {
    const prev = projectRef.current;
    const value = typeof next === "function" ? next(prev) : next;
    if (value === prev) return;
    const now = Date.now();
    if (now - lastPushRef.current > 600) setHistory((h) => [...h.slice(-49), prev]);
    lastPushRef.current = now;
    projectRef.current = value;
    setProject(value);
  }, []);

  const undo = () => {
    if (!history.length) return;
    const prev = history[history.length - 1];
    projectRef.current = prev;
    setProject(prev);
    setHistory(history.slice(0, -1));
    lastPushRef.current = 0;
  };

  const seek = useCallback((t: number) => {
    const v = Math.max(0, Math.min(t, totalDuration(projectRef.current)));
    timeRef.current = v;
    clockRef.current = { t: v, wall: performance.now() };
    setTime(v);
  }, []);

  const stop = useCallback(() => {
    playingRef.current = false;
    setPlaying(false);
    mediaRef.current.forEach((m) => m instanceof HTMLVideoElement && m.pause());
    musicRef.current?.pause();
  }, []);

  const togglePlay = useCallback(() => {
    if (playingRef.current) return stop();
    const tot = totalDuration(projectRef.current);
    if (tot <= 0) return;
    const start = timeRef.current >= tot - 0.05 ? 0 : timeRef.current;
    seek(start);
    playingRef.current = true;
    setPlaying(true);
  }, [seek, stop]);

  // Preview loop: one canvas, drawn with the same renderer as the export.
  useEffect(() => {
    let raf = 0;
    let lastUi = 0;
    let lastFrame: FrameSource | null = null;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;
      const p = projectRef.current;
      const sp = clipSpans(p);
      const tot = totalDuration(p);
      let t = timeRef.current;
      if (playingRef.current) {
        t = clockRef.current.t + (now - clockRef.current.wall) / 1000;
        if (t >= tot) {
          t = tot;
          stop();
        }
        timeRef.current = t;
        if (now - lastUi > 80) {
          lastUi = now;
          setTime(t);
        }
      }
      const span = spanAt(sp, Math.min(t, tot - 0.001));
      const active = span ? mediaRef.current.get(span.clip.url) : undefined;
      mediaRef.current.forEach((m) => {
        if (m !== active && m instanceof HTMLVideoElement && !m.paused) m.pause();
      });
      let frame: FrameSource | null = null;
      if (span && active instanceof HTMLVideoElement) {
        const local = span.clip.in + (t - span.start);
        active.volume = Math.min(1, Math.max(0, span.clip.volume));
        active.muted = span.clip.volume === 0;
        if (playingRef.current) {
          if (active.paused) {
            active.currentTime = local;
            active.play().catch(() => {});
          } else if (Math.abs(active.currentTime - local) > 0.3) {
            active.currentTime = local;
          }
        } else {
          if (!active.paused) active.pause();
          if (!active.seeking && Math.abs(active.currentTime - local) > 0.04) active.currentTime = local;
        }
        if (active.readyState >= 2) frame = { image: active, width: active.videoWidth, height: active.videoHeight };
        else frame = lastFrame;
      } else if (span && active instanceof HTMLImageElement) {
        frame = { image: active, width: active.naturalWidth, height: active.naturalHeight };
      }
      lastFrame = frame;
      drawFrame(ctx, canvas.width, canvas.height, p, t, frame, span?.clip.filter ?? "none", sp, tot);

      const music = musicRef.current;
      if (music && p.music) {
        music.volume = Math.min(1, Math.max(0, p.music.volume));
        const inRange = t < p.music.duration;
        if (playingRef.current && inRange) {
          if (music.paused) {
            music.currentTime = t;
            music.play().catch(() => {});
          } else if (Math.abs(music.currentTime - t) > 0.3) music.currentTime = t;
        } else if (!music.paused) music.pause();
      }
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [stop]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [togglePlay]);

  // Release decoded media and object URLs when the editor goes away.
  useEffect(() => {
    const media = mediaRef.current;
    return () => {
      media.forEach((m, url) => {
        if (m instanceof HTMLVideoElement) {
          m.pause();
          m.removeAttribute("src");
          m.load();
        }
        URL.revokeObjectURL(url);
      });
      media.clear();
      musicRef.current?.pause();
    };
  }, []);

  // Drop media nobody uses any more (after delete or undo past an add).
  useEffect(() => {
    const used = new Set(project.clips.map((c) => c.url));
    mediaRef.current.forEach((m, url) => {
      if (used.has(url) || history.some((h) => h.clips.some((c) => c.url === url))) return;
      if (m instanceof HTMLVideoElement) m.pause();
      mediaRef.current.delete(url);
      URL.revokeObjectURL(url);
    });
    if (timeRef.current > total) seek(total);
  }, [project, history, total, seek]);

  const addMedia = async (files: FileList | null) => {
    if (!files?.length) return;
    setLoading(true);
    setNotice(null);
    const added: Clip[] = [];
    let room = MAX_DURATION - totalDuration(projectRef.current);
    let cut = false;
    for (const file of Array.from(files)) {
      if (room <= 0.1) {
        cut = true;
        break;
      }
      const url = URL.createObjectURL(file);
      const isImage = file.type.startsWith("image/");
      try {
        if (isImage) {
          const img = await loadImage(url);
          mediaRef.current.set(url, img);
          const len = Math.min(IMAGE_DEFAULT, room);
          added.push({ id: uid(), kind: "image", file, url, name: file.name, sourceDuration: IMAGE_MAX, in: 0, out: len, volume: 0, filter: "none" });
          room -= len;
        } else {
          const v = await loadVideoMeta(url);
          const d = Number.isFinite(v.duration) && v.duration > 0 ? v.duration : 0;
          if (!d) throw new Error("duration");
          mediaRef.current.set(url, v);
          const len = Math.min(d, room);
          if (len < d) cut = true;
          added.push({ id: uid(), kind: "video", file, url, name: file.name, sourceDuration: d, in: 0, out: len, volume: 1, filter: "none" });
          room -= len;
        }
      } catch {
        URL.revokeObjectURL(url);
        setNotice(s.cannotRead(file.name));
      }
    }
    if (cut) setNotice(s.limitReached);
    if (added.length) {
      commit((p) => ({ ...p, clips: [...p.clips, ...added] }));
      setSelection({ type: "clip", id: added[0].id });
    }
    setLoading(false);
  };

  const addMusic = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    try {
      const duration = await loadAudioDuration(url);
      musicRef.current?.pause();
      const audio = new Audio(url);
      audio.preload = "auto";
      musicRef.current = audio;
      commit((p) => ({ ...p, music: { file, url, name: file.name, duration, volume: 0.8 } }));
      setSelection({ type: "music" });
    } catch {
      URL.revokeObjectURL(url);
      setNotice(s.cannotRead(file.name));
    }
  };

  // Keep the <audio> element in step with undo/redo of the music track.
  useEffect(() => {
    if (!project.music) {
      musicRef.current?.pause();
      return;
    }
    if (!musicRef.current || musicRef.current.src !== project.music.url) {
      musicRef.current?.pause();
      musicRef.current = new Audio(project.music.url);
    }
  }, [project.music]);

  const addText = () => {
    if (total <= 0) return;
    const start = Math.min(timeRef.current, Math.max(0, total - 0.5));
    const item: TextItem = {
      id: uid(),
      text: s.newText,
      start,
      end: Math.min(total, start + 3),
      y: 0.2,
      size: 0.075,
      color: "#ffffff",
      box: false,
    };
    commit((p) => ({ ...p, texts: [...p.texts, item] }));
    setSelection({ type: "text", id: item.id });
  };

  const splitAtPlayhead = () => {
    const span = spanAt(spans, timeRef.current);
    if (!span) return;
    const local = span.clip.in + (timeRef.current - span.start);
    if (local - span.clip.in < 0.1 || span.clip.out - local < 0.1) return;
    const right: Clip = { ...span.clip, id: uid(), in: local };
    commit((p) => {
      const clips = [...p.clips];
      clips.splice(span.index, 1, { ...span.clip, out: local }, right);
      return { ...p, clips };
    });
    setSelection({ type: "clip", id: right.id });
  };

  const updateClip = (id: string, patch: Partial<Clip>) =>
    commit((p) => ({ ...p, clips: p.clips.map((c) => (c.id === id ? { ...c, ...patch } : c)) }));
  const updateText = (id: string, patch: Partial<TextItem>) =>
    commit((p) => ({ ...p, texts: p.texts.map((x) => (x.id === id ? { ...x, ...patch } : x)) }));

  const moveClip = (id: string, dir: -1 | 1) =>
    commit((p) => {
      const i = p.clips.findIndex((c) => c.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= p.clips.length) return p;
      const clips = [...p.clips];
      [clips[i], clips[j]] = [clips[j], clips[i]];
      return { ...p, clips };
    });

  const duplicateClip = (id: string) => {
    const c = project.clips.find((x) => x.id === id);
    if (!c) return;
    if (total + clipLength(c) > MAX_DURATION) return setNotice(s.limitReached);
    const copy = { ...c, id: uid() };
    commit((p) => {
      const i = p.clips.findIndex((x) => x.id === id);
      const clips = [...p.clips];
      clips.splice(i + 1, 0, copy);
      return { ...p, clips };
    });
    setSelection({ type: "clip", id: copy.id });
  };

  const removeSelected = () => {
    if (!selection) return;
    if (selection.type === "clip") commit((p) => ({ ...p, clips: p.clips.filter((c) => c.id !== selection.id) }));
    if (selection.type === "text") commit((p) => ({ ...p, texts: p.texts.filter((x) => x.id !== selection.id) }));
    if (selection.type === "music") commit((p) => ({ ...p, music: null }));
    setSelection(null);
  };

  const runExport = async () => {
    stop();
    cancelRef.current = false;
    setExportState({ phase: "running", progress: 0 });
    try {
      const result = await exportProject(
        projectRef.current,
        (progress) => setExportState({ phase: "running", progress }),
        () => cancelRef.current,
      );
      const url = URL.createObjectURL(result.blob);
      const name = `nics-studio-${projectRef.current.aspect.replace(":", "x")}.${result.extension.replace(/^\./, "")}`;
      setExportState({ phase: "done", url, name });
    } catch (err) {
      const code = err instanceof ExportError ? err.code : "unknown";
      console.error("NICS Studio export failed", err);
      setExportState(code === "canceled" ? null : { phase: "error", message: s.exportErrors[code] });
    }
  };

  const closeExport = () => {
    if (exportState?.phase === "done") URL.revokeObjectURL(exportState.url);
    setExportState(null);
  };

  const onTimelinePointer = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = timelineRef.current;
    if (!el || total <= 0) return;
    const rect = el.getBoundingClientRect();
    seek(((e.clientX - rect.left) / rect.width) * total);
  };

  const selectedClip = selection?.type === "clip" ? project.clips.find((c) => c.id === selection.id) : undefined;
  const selectedText = selection?.type === "text" ? project.texts.find((x) => x.id === selection.id) : undefined;
  const preview = PREVIEW_SIZE[project.aspect];
  const pct = (t: number) => (total > 0 ? `${(t / total) * 100}%` : "0%");
  const busy = exportState?.phase === "running";
  const tickStep = Math.max(1, Math.ceil(total / 8));
  const ticks = total > 0 ? Array.from({ length: Math.floor(total / tickStep) + 1 }, (_, i) => i * tickStep) : [];

  return (
    <div className="space-y-4">
      {!canEncode && (
        <div className="flex gap-3 rounded-xl border border-destructive/40 bg-destructive/5 p-4 text-sm text-foreground">
          <AlertCircle className="w-5 h-5 shrink-0 text-destructive" />
          <span>{s.unsupported}</span>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={mediaInputRef}
          type="file"
          accept="video/*,image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            addMedia(e.target.files);
            e.target.value = "";
          }}
        />
        <input
          ref={musicInputRef}
          type="file"
          accept="audio/*"
          className="hidden"
          onChange={(e) => {
            addMusic(e.target.files);
            e.target.value = "";
          }}
        />
        <Button onClick={() => mediaInputRef.current?.click()} disabled={busy || loading} className="rounded-full">
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ImagePlus className="w-4 h-4 mr-2" />}
          {s.addMedia}
        </Button>
        <Button variant="outline" onClick={addText} disabled={busy || total <= 0} className="rounded-full">
          <Type className="w-4 h-4 mr-2" />
          {s.addText}
        </Button>
        <Button variant="outline" onClick={() => musicInputRef.current?.click()} disabled={busy} className="rounded-full">
          <Music2 className="w-4 h-4 mr-2" />
          {s.addMusic}
        </Button>
        <div className="flex-1" />
        <Button variant="ghost" size="sm" onClick={undo} disabled={busy || !history.length}>
          <Undo2 className="w-4 h-4 mr-1" />
          {s.undo}
        </Button>
        <Button
          onClick={runExport}
          disabled={busy || total <= 0 || !canEncode}
          className="rounded-full bg-foreground hover:bg-foreground/90 text-background"
        >
          <Download className="w-4 h-4 mr-2" />
          {s.export}
        </Button>
      </div>

      {notice && (
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
          <span className="flex-1">{notice}</span>
          <button type="button" onClick={() => setNotice(null)} aria-label="close">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="grid lg:grid-cols-[minmax(0,1fr)_340px] gap-4">
        {/* Preview */}
        <Card className="bg-card border-border/50">
          <CardContent className="p-4 space-y-3">
            <div className="flex justify-center bg-black/90 rounded-lg overflow-hidden">
              <div
                className="relative"
                style={{ aspectRatio: `${preview.w} / ${preview.h}`, height: project.aspect === "16:9" ? "auto" : "min(62vh, 640px)", width: project.aspect === "16:9" ? "100%" : "auto" }}
              >
                <canvas ref={canvasRef} width={preview.w} height={preview.h} className="w-full h-full" />
                {total <= 0 && (
                  <button
                    type="button"
                    onClick={() => mediaInputRef.current?.click()}
                    className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center text-white/80 hover:text-white"
                  >
                    <Film className="w-10 h-10" />
                    <span className="text-sm max-w-[16rem]">{s.dropHint}</span>
                  </button>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button size="icon" variant="outline" className="rounded-full shrink-0" onClick={togglePlay} disabled={total <= 0 || busy} aria-label={playing ? s.pause : s.play}>
                {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <span className="text-sm tabular-nums text-muted-foreground">
                {formatTime(time)} / {formatTime(total)}
              </span>
              <div className="flex-1" />
              <Button size="sm" variant="outline" className="rounded-full" onClick={splitAtPlayhead} disabled={!spans.length || busy}>
                <Scissors className="w-4 h-4 mr-1" />
                {s.split}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Inspector */}
        <Card className="bg-card border-border/50">
          <CardContent className="p-4 space-y-5">
            <Field label={s.format}>
              <Segmented<Aspect>
                value={project.aspect}
                options={[
                  { value: "9:16", label: "9:16" },
                  { value: "16:9", label: "16:9" },
                  { value: "1:1", label: "1:1" },
                ]}
                onChange={(aspect) => commit((p) => ({ ...p, aspect }))}
              />
            </Field>
            <Field label={s.fit}>
              <Segmented
                value={project.fit}
                options={[
                  { value: "cover", label: s.fitCover },
                  { value: "contain", label: s.fitContain },
                ]}
                onChange={(fit) => commit((p) => ({ ...p, fit }))}
              />
            </Field>
            <Field label={s.transition}>
              <Segmented
                value={project.transition}
                options={[
                  { value: "none", label: s.transitionNone },
                  { value: "fade", label: s.transitionFade },
                ]}
                onChange={(transition) => commit((p) => ({ ...p, transition }))}
              />
            </Field>

            <div className="border-t border-border/50 pt-4 space-y-4">
              {selectedClip && (
                <>
                  <div className="text-sm font-semibold text-foreground truncate">
                    {selectedClip.kind === "image" ? s.photo : s.clip}: {selectedClip.name}
                  </div>
                  {selectedClip.kind === "video" ? (
                    <Field label={s.trim} extra={`${formatTime(selectedClip.in)} – ${formatTime(selectedClip.out)}`}>
                      <RangeSlider
                        value={[selectedClip.in, selectedClip.out]}
                        min={0}
                        max={selectedClip.sourceDuration}
                        onChange={([a, b]) => {
                          const room = MAX_DURATION - (total - clipLength(selectedClip));
                          updateClip(selectedClip.id, { in: a, out: Math.min(b, a + room) });
                        }}
                      />
                    </Field>
                  ) : (
                    <Field label={s.duration} extra={`${clipLength(selectedClip).toFixed(1)} s`}>
                      <RangeSlider
                        value={[selectedClip.out]}
                        min={0.5}
                        max={Math.min(IMAGE_MAX, MAX_DURATION - (total - clipLength(selectedClip)))}
                        step={0.1}
                        onChange={([b]) => updateClip(selectedClip.id, { out: b })}
                      />
                    </Field>
                  )}
                  {selectedClip.kind === "video" && (
                    <Field label={s.volume} extra={`${Math.round(selectedClip.volume * 100)}%`}>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          aria-label={s.mute}
                          onClick={() => updateClip(selectedClip.id, { volume: selectedClip.volume > 0 ? 0 : 1 })}
                        >
                          {selectedClip.volume > 0 ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-muted-foreground" />}
                        </button>
                        <RangeSlider
                          value={[selectedClip.volume]}
                          min={0}
                          max={1}
                          step={0.01}
                          onChange={([v]) => updateClip(selectedClip.id, { volume: v })}
                        />
                      </div>
                    </Field>
                  )}
                  <Field label={s.filter}>
                    <div className="flex flex-wrap gap-1.5">
                      {(Object.keys(FILTERS) as FilterId[]).map((f) => (
                        <button
                          key={f}
                          type="button"
                          onClick={() => updateClip(selectedClip.id, { filter: f })}
                          className={cn(
                            "px-2.5 py-1 text-xs rounded-full border",
                            selectedClip.filter === f ? "border-primary bg-primary/10 text-foreground" : "border-border text-muted-foreground",
                          )}
                        >
                          {s.filters[f]}
                        </button>
                      ))}
                    </div>
                    {!filtersOk && <p className="text-xs text-muted-foreground">{s.filtersUnsupported}</p>}
                  </Field>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={() => moveClip(selectedClip.id, -1)}>
                      <ArrowLeft className="w-4 h-4 mr-1" />
                      {s.moveLeft}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => moveClip(selectedClip.id, 1)}>
                      {s.moveRight}
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => duplicateClip(selectedClip.id)}>
                      <Copy className="w-4 h-4 mr-1" />
                      {s.duplicate}
                    </Button>
                    <Button size="sm" variant="outline" className="text-destructive" onClick={removeSelected}>
                      <Trash2 className="w-4 h-4 mr-1" />
                      {s.remove}
                    </Button>
                  </div>
                </>
              )}

              {selectedText && (
                <>
                  <Field label={s.text}>
                    <Textarea
                      value={selectedText.text}
                      placeholder={s.textPlaceholder}
                      rows={2}
                      onChange={(e) => updateText(selectedText.id, { text: e.target.value })}
                    />
                  </Field>
                  <Field label={s.timing} extra={`${formatTime(selectedText.start)} – ${formatTime(selectedText.end)}`}>
                    <RangeSlider
                      value={[Math.min(selectedText.start, total), Math.min(selectedText.end, total)]}
                      min={0}
                      max={Math.max(total, 0.1)}
                      onChange={([a, b]) => updateText(selectedText.id, { start: a, end: b })}
                    />
                  </Field>
                  <Field label={s.position}>
                    <RangeSlider value={[selectedText.y]} min={0.05} max={0.95} step={0.01} onChange={([y]) => updateText(selectedText.id, { y })} />
                  </Field>
                  <Field label={s.size}>
                    <RangeSlider value={[selectedText.size]} min={0.035} max={0.15} step={0.005} onChange={([size]) => updateText(selectedText.id, { size })} />
                  </Field>
                  <Field label={s.color}>
                    <div className="flex items-center gap-2">
                      {TEXT_COLORS.map((c) => (
                        <button
                          key={c}
                          type="button"
                          aria-label={c}
                          onClick={() => updateText(selectedText.id, { color: c })}
                          className={cn("w-7 h-7 rounded-full border-2", selectedText.color === c ? "border-primary" : "border-border")}
                          style={{ background: c }}
                        />
                      ))}
                    </div>
                  </Field>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{s.box}</span>
                    <Switch checked={selectedText.box} onCheckedChange={(box) => updateText(selectedText.id, { box })} />
                  </div>
                  <Button size="sm" variant="outline" className="text-destructive" onClick={removeSelected}>
                    <Trash2 className="w-4 h-4 mr-1" />
                    {s.remove}
                  </Button>
                </>
              )}

              {selection?.type === "music" && project.music && (
                <>
                  <div className="text-sm font-semibold text-foreground truncate">
                    {s.music}: {project.music.name}
                  </div>
                  <Field label={s.volume} extra={`${Math.round(project.music.volume * 100)}%`}>
                    <RangeSlider
                      value={[project.music.volume]}
                      min={0}
                      max={1}
                      step={0.01}
                      onChange={([v]) => commit((p) => (p.music ? { ...p, music: { ...p.music, volume: v } } : p))}
                    />
                  </Field>
                  <Button size="sm" variant="outline" className="text-destructive" onClick={removeSelected}>
                    <Trash2 className="w-4 h-4 mr-1" />
                    {s.remove}
                  </Button>
                </>
              )}

              {!selectedClip && !selectedText && selection?.type !== "music" && (
                <p className="text-sm text-muted-foreground">{s.selectHint}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timeline */}
      <Card className="bg-card border-border/50">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <div className="w-14 shrink-0 space-y-2 pt-7 text-xs text-muted-foreground">
              <div className="h-14 flex items-center">{s.timelineVideo}</div>
              <div className="h-8 flex items-center">{s.timelineText}</div>
              <div className="h-8 flex items-center">{s.timelineMusic}</div>
            </div>
            <div className="relative flex-1 min-w-0 space-y-2">
              <div
                ref={timelineRef}
                className="relative h-5 cursor-pointer select-none touch-none"
                onPointerDown={(e) => {
                  e.currentTarget.setPointerCapture(e.pointerId);
                  onTimelinePointer(e);
                }}
                onPointerMove={(e) => e.buttons && onTimelinePointer(e)}
              >
                {ticks.map((sec) => (
                  <span
                    key={sec}
                    className="absolute top-0 text-[10px] text-muted-foreground -translate-x-1/2 tabular-nums first:translate-x-0"
                    style={{ left: pct(sec) }}
                  >
                    {formatTime(sec).replace(/\.\d$/, "")}
                  </span>
                ))}
              </div>

              <div className="relative h-14 rounded-md bg-muted/50 overflow-hidden">
                {spans.map(({ clip, start, end }) => (
                  <button
                    key={clip.id}
                    type="button"
                    onClick={() => setSelection({ type: "clip", id: clip.id })}
                    className={cn(
                      "absolute top-0 bottom-0 border-r-2 border-background px-1.5 text-left text-[11px] leading-tight overflow-hidden",
                      clip.kind === "image" ? "bg-sky-500/25" : "bg-primary/25",
                      selection?.type === "clip" && selection.id === clip.id && "ring-2 ring-inset ring-primary",
                    )}
                    style={{ left: pct(start), width: pct(end - start) }}
                    title={clip.name}
                  >
                    <span className="block truncate font-medium text-foreground">{clip.name}</span>
                    <span className="text-muted-foreground tabular-nums">{(end - start).toFixed(1)}s</span>
                  </button>
                ))}
              </div>

              <div className="relative h-8 rounded-md bg-muted/50 overflow-hidden">
                {project.texts.map((x) => (
                  <button
                    key={x.id}
                    type="button"
                    onClick={() => setSelection({ type: "text", id: x.id })}
                    className={cn(
                      "absolute top-1 bottom-1 rounded bg-amber-500/30 px-1.5 text-[11px] text-left truncate",
                      selection?.type === "text" && selection.id === x.id && "ring-2 ring-primary",
                    )}
                    style={{ left: pct(Math.min(x.start, total)), width: pct(Math.max(0, Math.min(x.end, total) - Math.min(x.start, total))) }}
                  >
                    {x.text || "…"}
                  </button>
                ))}
              </div>

              <div className="relative h-8 rounded-md bg-muted/50 overflow-hidden">
                {project.music && (
                  <button
                    type="button"
                    onClick={() => setSelection({ type: "music" })}
                    className={cn(
                      "absolute top-1 bottom-1 left-0 rounded bg-emerald-500/30 px-1.5 text-[11px] text-left truncate",
                      selection?.type === "music" && "ring-2 ring-primary",
                    )}
                    style={{ width: total > 0 ? pct(Math.min(project.music.duration, total)) : "100%" }}
                  >
                    {project.music.name}
                  </button>
                )}
              </div>

              {total > 0 && (
                <div className="absolute top-5 bottom-0 w-0.5 bg-red-500 pointer-events-none" style={{ left: pct(time) }} />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export */}
      {exportState && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 space-y-4">
              {exportState.phase === "running" && (
                <>
                  <div className="flex items-center gap-2 font-semibold">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    {s.exporting} {Math.round(exportState.progress * 100)}%
                  </div>
                  <Progress value={exportState.progress * 100} />
                  <p className="text-sm text-muted-foreground">{s.exportKeepOpen}</p>
                  <Button variant="outline" onClick={() => (cancelRef.current = true)}>
                    {s.cancel}
                  </Button>
                </>
              )}
              {exportState.phase === "done" && (
                <>
                  <div className="font-semibold">{s.exportDone}</div>
                  <video src={exportState.url} controls playsInline className="w-full max-h-[50vh] rounded-lg bg-black" />
                  <div className="flex gap-2">
                    <Button asChild className="rounded-full">
                      <a href={exportState.url} download={exportState.name}>
                        <Download className="w-4 h-4 mr-2" />
                        {s.download}
                      </a>
                    </Button>
                    <Button variant="outline" className="rounded-full" onClick={closeExport}>
                      {s.newExport}
                    </Button>
                  </div>
                </>
              )}
              {exportState.phase === "error" && (
                <>
                  <div className="flex gap-2 text-sm">
                    <AlertCircle className="w-5 h-5 shrink-0 text-destructive" />
                    {exportState.message}
                  </div>
                  <Button variant="outline" onClick={closeExport}>
                    {s.newExport}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default StudioEditor;
