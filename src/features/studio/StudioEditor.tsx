import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Captions,
  Check,
  Coins,
  Copy,
  Download,
  Film,
  FolderOpen,
  ImagePlus,
  Layers,
  Loader2,
  Music2,
  Plus,
  Redo2,
  Settings2,
  Sparkles,
  Trash2,
  Type,
  Undo2,
  Volume2,
  VolumeX,
  Wand2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
  type ZoomEffect,
  BACKGROUND_COLORS,
  FILTERS,
  IMAGE_DEFAULT,
  IMAGE_MAX,
  MAX_DURATION,
  TEXT_COLORS,
  buildCaptions,
  canvasFilterSupported,
  captionWords,
  clipLength,
  clipSpans,
  drawFrame,
  formatTime,
  newProject,
  retimeCaption,
  spanAt,
  totalDuration,
  uid,
} from "./model";
import { ExportError, browserCanEdit, exportProject } from "./exportVideo";
import { removeSilence } from "./audio";
import { TranscribeError, transcribeProject } from "./transcribe";
import { type AgentStep, parseCommand } from "./agent";
import { studioStrings } from "./strings";
import Timeline, { type Selection } from "./Timeline";
import AgentPanel, { type AgentMessage, type StepStatus } from "./AgentPanel";
import { Field, RangeSlider, Segmented, Swatches } from "./ui";
import { type SavedSummary, deleteProject, listProjects, loadProject, newProjectId, requestPersistence, saveProject } from "./storage";
import { type CreditsError, type SpendReason, PRICES, fetchBalance, spendCredits } from "./credits";
import { checkSession, useAccount } from "@/features/account/account";
import AccountDialog from "@/features/account/AccountDialog";

const PREVIEW_SIZE: Record<Aspect, { w: number; h: number }> = {
  "9:16": { w: 540, h: 960 },
  "16:9": { w: 960, h: 540 },
  "1:1": { w: 720, h: 720 },
};

type Tool = "projects" | "media" | "sounds" | "captions" | "text" | "effects" | "transitions" | "background" | "settings";
type Media = HTMLVideoElement | HTMLImageElement;
type CaptionLang = "ru" | "en";

const TOOLS: { id: Tool; icon: typeof Film }[] = [
  { id: "projects", icon: FolderOpen },
  { id: "media", icon: Film },
  { id: "sounds", icon: Music2 },
  { id: "captions", icon: Captions },
  { id: "text", icon: Type },
  { id: "effects", icon: Sparkles },
  { id: "transitions", icon: Layers },
  { id: "background", icon: Wand2 },
  { id: "settings", icon: Settings2 },
];

const loadVideoMeta = (url: string) =>
  new Promise<HTMLVideoElement>((resolve, reject) => {
    const v = document.createElement("video");
    v.preload = "auto";
    v.playsInline = true;
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

// Zooms spread through the video: one every ~4.5 s, each ~1.8 s long.
const autoZooms = (total: number, amount: number): ZoomEffect[] => {
  const out: ZoomEffect[] = [];
  for (let t = 0.6; t + 1 < total; t += 4.5) {
    out.push({ id: uid(), kind: "zoom", start: t, end: Math.min(total, t + 1.8), amount });
  }
  return out;
};

// A small JPEG of the current preview frame for the projects list.
const thumbnail = (canvas: HTMLCanvasElement | null) => {
  if (!canvas || !canvas.width) return null;
  try {
    const h = 120;
    const w = Math.round((canvas.width / canvas.height) * h);
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    c.getContext("2d")?.drawImage(canvas, 0, 0, w, h);
    return c.toDataURL("image/jpeg", 0.6);
  } catch {
    return null;
  }
};

const StudioEditor = ({ lang }: { lang: Language }) => {
  const s = studioStrings(lang);
  const [project, setProject] = useState<Project>(newProject);
  const [history, setHistory] = useState<Project[]>([]);
  const [future, setFuture] = useState<Project[]>([]);
  const [selection, setSelection] = useState<Selection>(null);
  const [tool, setTool] = useState<Tool>("media");
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [agentBusy, setAgentBusy] = useState(false);
  const [captionLang, setCaptionLang] = useState<CaptionLang>(lang === "ru" ? "ru" : "en");
  const [captionStatus, setCaptionStatus] = useState<string | null>(null);
  const [messages, setMessages] = useState<AgentMessage[]>([{ id: "hello", role: "agent", text: s.agent.hello }]);
  const [saved, setSaved] = useState<SavedSummary[]>([]);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "failed">("idle");
  const [currentId, setCurrentId] = useState<string | null>(null);
  const account = useAccount();
  const [balance, setBalance] = useState<number | null>(null);
  const [signIn, setSignIn] = useState<string | null | false>(false);
  const [creditsIssue, setCreditsIssue] = useState<string | null>(null);
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
  const projectIdRef = useRef<string | null>(null);
  const restoredRef = useRef(false);
  const mediaInputRef = useRef<HTMLInputElement>(null);
  const musicInputRef = useRef<HTMLInputElement>(null);

  projectRef.current = project;
  const canEncode = useMemo(() => browserCanEdit(), []);
  const filtersOk = useMemo(() => canvasFilterSupported(), []);
  const total = totalDuration(project);
  const spans = useMemo(() => clipSpans(project), [project]);
  const busy = exportState?.phase === "running" || agentBusy;

  // Every edit goes through here so it can be undone. Rapid edits (dragging a
  // slider or a timeline block) collapse into one undo step.
  const commit = useCallback((next: Project | ((p: Project) => Project), coalesce = true) => {
    const prev = projectRef.current;
    const value = typeof next === "function" ? next(prev) : next;
    if (value === prev) return;
    const now = Date.now();
    if (!coalesce || now - lastPushRef.current > 600) setHistory((h) => [...h.slice(-79), prev]);
    lastPushRef.current = coalesce ? now : 0;
    setFuture([]);
    projectRef.current = value;
    setProject(value);
  }, []);

  const undo = () => {
    if (!history.length) return;
    const prev = history[history.length - 1];
    setFuture((f) => [projectRef.current, ...f]);
    projectRef.current = prev;
    setProject(prev);
    setHistory(history.slice(0, -1));
    lastPushRef.current = 0;
  };

  const redo = () => {
    if (!future.length) return;
    const next = future[0];
    setHistory((h) => [...h, projectRef.current]);
    projectRef.current = next;
    setProject(next);
    setFuture(future.slice(1));
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
        if (playingRef.current && t < p.music.duration) {
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

  useEffect(() => {
    if (timeRef.current > total) seek(total);
  }, [total, seek]);

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

  // --- Saved projects ---------------------------------------------------------

  const refreshSaved = useCallback(() => {
    listProjects()
      .then(setSaved)
      .catch(() => setSaved([]));
  }, []);

  const releaseMedia = () => {
    mediaRef.current.forEach((m, url) => {
      if (m instanceof HTMLVideoElement) {
        m.pause();
        m.removeAttribute("src");
        m.load();
      }
      URL.revokeObjectURL(url);
    });
    mediaRef.current.clear();
    musicRef.current?.pause();
    musicRef.current = null;
    if (projectRef.current.music) URL.revokeObjectURL(projectRef.current.music.url);
  };

  const resetEditor = (p: Project, msgs: AgentMessage[], id: string | null) => {
    projectRef.current = p;
    projectIdRef.current = id;
    setCurrentId(id);
    setProject(p);
    setHistory([]);
    setFuture([]);
    setSelection(null);
    setMessages(msgs.length ? msgs : [{ id: "hello", role: "agent", text: s.agent.hello }]);
    setCaptionStatus(null);
    setSaveState(id ? "saved" : "idle");
    lastPushRef.current = 0;
    seek(0);
  };

  const openSaved = async (id: string) => {
    stop();
    setLoading(true);
    setNotice(null);
    try {
      const loaded = await loadProject(id);
      if (!loaded) throw new Error("missing");
      releaseMedia();
      const clips: Clip[] = [];
      for (const c of loaded.project.clips) {
        try {
          const m = c.kind === "image" ? await loadImage(c.url) : await loadVideoMeta(c.url);
          mediaRef.current.set(c.url, m);
          clips.push(c);
        } catch {
          setNotice(s.cannotRead(c.name));
        }
      }
      resetEditor({ ...loaded.project, clips }, loaded.messages, id);
    } catch (err) {
      console.error("NICS Studio open failed", err);
      setNotice(s.projects.openFailed);
    } finally {
      setLoading(false);
    }
  };

  const startNew = () => {
    stop();
    releaseMedia();
    resetEditor(newProject(), [], null);
    setTool("media");
  };

  const removeSaved = async (id: string) => {
    if (!window.confirm(s.projects.confirmRemove)) return;
    try {
      await deleteProject(id);
    } catch (err) {
      console.error("NICS Studio delete failed", err);
    }
    if (id === projectIdRef.current) startNew();
    refreshSaved();
  };

  // Reopen the latest project when the studio loads, so work survives a
  // closed tab or a reload.
  useEffect(() => {
    if (restoredRef.current) return;
    restoredRef.current = true;
    requestPersistence();
    listProjects()
      .then((list) => {
        setSaved(list);
        if (list.length && !projectRef.current.clips.length) openSaved(list[0].id);
      })
      .catch(() => setSaved([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Autosave a moment after the last change. Not while the agent or the export
  // is running, so a half-made edit is never what gets saved.
  useEffect(() => {
    if (busy || loading) return;
    if (!project.clips.length && !projectIdRef.current) return;
    const timer = window.setTimeout(async () => {
      const id = projectIdRef.current ?? newProjectId();
      projectIdRef.current = id;
      setCurrentId(id);
      setSaveState("saving");
      try {
        await saveProject(id, projectRef.current, messages, { duration: totalDuration(projectRef.current), thumb: thumbnail(canvasRef.current) });
        setSaveState("saved");
        refreshSaved();
      } catch (err) {
        console.error("NICS Studio save failed", err);
        setSaveState("failed");
      }
    }, 700);
    return () => window.clearTimeout(timer);
  }, [project, messages, busy, loading, refreshSaved]);

  // --- Credits ----------------------------------------------------------------

  useEffect(() => {
    checkSession();
  }, []);

  useEffect(() => {
    setBalance(null);
    if (!account) return;
    fetchBalance(account).then((r) => {
      if (r.ok || r.error === "no_access") setBalance(r.credits);
    });
  }, [account]);

  const creditsText = (error: CreditsError | null, cost: number, left: number) =>
    error === "no_access"
      ? s.credits.noAccess
      : error === "network"
        ? s.credits.network
        : error === "session" || error === "email"
          ? s.credits.needSignIn
          : s.credits.notEnough(cost, left);

  // Checks there is enough for `reason` before the work starts; the credits are
  // taken only after it worked, so a failed export or recognition costs nothing.
  const ensureCredits = async (reason: SpendReason): Promise<boolean> => {
    setCreditsIssue(null);
    if (!account) {
      setSignIn(s.credits.needSignIn);
      return false;
    }
    const cost = PRICES[reason];
    const r = await fetchBalance(account);
    if (r.ok || r.error === "no_access") setBalance(r.credits);
    if (r.ok && r.credits >= cost) return true;
    setCreditsIssue(creditsText(r.ok ? "not_enough" : r.error, cost, r.credits));
    return false;
  };

  const charge = async (reason: SpendReason) => {
    if (!account) return;
    const r = await spendCredits(account, reason);
    if (r.ok || r.error === "not_enough") setBalance(r.credits);
  };

  const select = (sel: Selection) => {
    setSelection(sel);
    if (!sel) return;
    const map: Record<string, Tool> = { clip: "media", text: "text", caption: "captions", effect: "effects", music: "sounds" };
    setTool(map[sel.type]);
  };

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
      try {
        if (file.type.startsWith("image/")) {
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
      commit((p) => ({ ...p, clips: [...p.clips, ...added], title: p.title || added[0].name.replace(/\.[^.]+$/, "") }), false);
      select({ type: "clip", id: added[0].id });
    }
    setLoading(false);
  };

  const addMusic = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    try {
      const duration = await loadAudioDuration(url);
      commit((p) => ({ ...p, music: { file, url, name: file.name, duration, volume: 0.8 } }), false);
      select({ type: "music" });
    } catch {
      URL.revokeObjectURL(url);
      setNotice(s.cannotRead(file.name));
    }
  };

  const addText = () => {
    if (total <= 0) return;
    const start = Math.min(timeRef.current, Math.max(0, total - 0.5));
    const item: TextItem = { id: uid(), text: s.newText, start, end: Math.min(total, start + 3), y: 0.2, size: 0.075, color: "#ffffff", box: false };
    commit((p) => ({ ...p, texts: [...p.texts, item] }), false);
    select({ type: "text", id: item.id });
  };

  const addZoom = () => {
    if (total <= 0) return;
    const start = Math.min(timeRef.current, Math.max(0, total - 1));
    const ef: ZoomEffect = { id: uid(), kind: "zoom", start, end: Math.min(total, start + 2), amount: 0.15 };
    commit((p) => ({ ...p, effects: [...p.effects, ef] }), false);
    select({ type: "effect", id: ef.id });
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
    }, false);
    select({ type: "clip", id: right.id });
  };

  const updateClip = (id: string, patch: Partial<Clip>) =>
    commit((p) => ({ ...p, clips: p.clips.map((c) => (c.id === id ? { ...c, ...patch } : c)) }));
  const updateText = (id: string, patch: Partial<TextItem>) =>
    commit((p) => ({ ...p, texts: p.texts.map((x) => (x.id === id ? { ...x, ...patch } : x)) }));
  const updateEffect = (id: string, patch: Partial<ZoomEffect>) =>
    commit((p) => ({ ...p, effects: p.effects.map((x) => (x.id === id ? { ...x, ...patch } : x)) }));

  const onItemRange = useCallback(
    (kind: "text" | "caption" | "effect", id: string, start: number, end: number) =>
      commit((p) => {
        if (kind === "text") return { ...p, texts: p.texts.map((x) => (x.id === id ? { ...x, start, end } : x)) };
        if (kind === "effect") return { ...p, effects: p.effects.map((x) => (x.id === id ? { ...x, start, end } : x)) };
        return {
          ...p,
          captions: p.captions.map((c) => {
            if (c.id !== id) return c;
            // Stretch the word timings with the caption.
            const k = (end - start) / Math.max(0.01, c.end - c.start);
            return { ...c, start, end, words: c.words.map((w) => ({ ...w, start: start + (w.start - c.start) * k, end: start + (w.end - c.start) * k })) };
          }),
        };
      }),
    [commit],
  );

  const onClipRange = useCallback(
    (id: string, a: number, b: number) => commit((p) => ({ ...p, clips: p.clips.map((c) => (c.id === id ? { ...c, in: a, out: b } : c)) })),
    [commit],
  );

  const moveClip = (id: string, dir: -1 | 1) =>
    commit((p) => {
      const i = p.clips.findIndex((c) => c.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= p.clips.length) return p;
      const clips = [...p.clips];
      [clips[i], clips[j]] = [clips[j], clips[i]];
      return { ...p, clips };
    }, false);

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
    }, false);
    select({ type: "clip", id: copy.id });
  };

  const removeSelected = () => {
    if (!selection) return;
    if (selection.type === "clip") commit((p) => ({ ...p, clips: p.clips.filter((c) => c.id !== selection.id) }), false);
    if (selection.type === "text") commit((p) => ({ ...p, texts: p.texts.filter((x) => x.id !== selection.id) }), false);
    if (selection.type === "caption") commit((p) => ({ ...p, captions: p.captions.filter((x) => x.id !== selection.id) }), false);
    if (selection.type === "effect") commit((p) => ({ ...p, effects: p.effects.filter((x) => x.id !== selection.id) }), false);
    if (selection.type === "music") commit((p) => ({ ...p, music: null }), false);
    setSelection(null);
  };

  // --- Captions ---------------------------------------------------------------

  const generateCaptions = async (words: number, language: CaptionLang, report: (note: string) => void) => {
    const recognised = await transcribeProject(projectRef.current, language, (pr) => {
      if (pr.stage === "audio") report(s.stepNotes.readingAudio);
      else if (pr.stage === "model") report(s.stepNotes.modelLoading(Math.round(pr.share * 100)));
      else report(s.stepNotes.recognizing);
    });
    const captions = buildCaptions(recognised, words);
    commit((p) => ({ ...p, captions, captionStyle: { ...p.captionStyle, wordsPerCaption: words } }), false);
    return captions.length;
  };

  const captionError = (err: unknown) =>
    err instanceof TranscribeError ? s.captionErrors[err.code] : s.captionErrors.failed;

  const runCaptionsPanel = async () => {
    stop();
    setAgentBusy(true);
    try {
      if (!(await ensureCredits("captions"))) return;
      const n = await generateCaptions(project.captionStyle.wordsPerCaption, captionLang, setCaptionStatus);
      setCaptionStatus(s.stepNotes.captionsMade(n));
      if (n > 0) await charge("captions");
    } catch (err) {
      console.error("NICS Studio captions failed", err);
      setCaptionStatus(captionError(err));
    } finally {
      setAgentBusy(false);
    }
  };

  // --- Agent ------------------------------------------------------------------

  const execStep = async (step: AgentStep, writtenIn: CaptionLang, report: (note: string) => void): Promise<string | undefined> => {
    const p = projectRef.current;
    const tot = totalDuration(p);
    switch (step.kind) {
      case "silence": {
        if (!p.clips.some((c) => c.kind === "video" && c.volume > 0)) return s.stepNotes.noSound;
        const res = await removeSilence(p);
        if (res.removed <= 0) return s.stepNotes.silenceNone;
        commit(res.project, false);
        return s.stepNotes.silenceRemoved(res.removed.toFixed(1));
      }
      case "limit": {
        let room = step.seconds;
        const clips: Clip[] = [];
        for (const c of p.clips) {
          if (room <= 0.05) break;
          const len = Math.min(clipLength(c), room);
          clips.push({ ...c, out: c.in + len });
          room -= len;
        }
        commit({ ...p, clips }, false);
        return formatTime(Math.min(step.seconds, tot));
      }
      case "captions": {
        const n = await generateCaptions(step.words, step.language ?? writtenIn, report);
        return s.stepNotes.captionsMade(n);
      }
      case "captionStyle": {
        const style = { ...p.captionStyle, ...step.patch };
        if (step.patch.color && step.patch.color === style.accent) style.accent = step.patch.color === "#ffffff" ? "#ffd400" : "#ffffff";
        const rebuild = step.patch.wordsPerCaption && step.patch.wordsPerCaption !== p.captionStyle.wordsPerCaption && p.captions.length;
        commit({ ...p, captionStyle: style, captions: rebuild ? buildCaptions(captionWords(p.captions), style.wordsPerCaption) : p.captions }, false);
        return undefined;
      }
      case "removeCaptions":
        commit({ ...p, captions: [] }, false);
        return undefined;
      case "zooms": {
        const effects = autoZooms(tot, step.amount);
        commit({ ...p, effects }, false);
        return s.stepNotes.zoomsMade(effects.length);
      }
      case "removeZooms":
        commit({ ...p, effects: [] }, false);
        return undefined;
      case "text":
        commit({ ...p, texts: [...p.texts, { id: uid(), text: step.text, start: 0, end: Math.min(tot, 3), y: step.y, size: 0.075, color: "#ffffff", box: false }] }, false);
        return undefined;
      case "aspect":
        commit({ ...p, aspect: step.aspect }, false);
        return undefined;
      case "fit":
        commit({ ...p, fit: step.fit }, false);
        return undefined;
      case "transition":
        commit({ ...p, transition: step.on ? "fade" : "none" }, false);
        return undefined;
      case "filter":
        commit({ ...p, clips: p.clips.map((c) => ({ ...c, filter: step.filter })) }, false);
        return s.filters[step.filter];
      case "musicVolume":
        if (!p.music) return s.stepNotes.noMusic;
        commit({ ...p, music: { ...p.music, volume: step.volume } }, false);
        return `${Math.round(step.volume * 100)}%`;
      case "muteClips":
        commit({ ...p, clips: p.clips.map((c) => ({ ...c, volume: 0 })) }, false);
        return undefined;
    }
  };

  const runAgent = async (text: string) => {
    // Speech language for captions: what the user asked for, else the language they write in.
    const writtenIn: CaptionLang = /[а-яё]/i.test(text) ? "ru" : "en";
    const userMsg: AgentMessage = { id: uid(), role: "user", text };
    if (!projectRef.current.clips.length) {
      setMessages((m) => [...m, userMsg, { id: uid(), role: "agent", text: s.agent.noClips }]);
      return;
    }
    const steps = parseCommand(text);
    if (!steps.length) {
      setMessages((m) => [...m, userMsg, { id: uid(), role: "agent", text: s.agent.unknown }]);
      return;
    }
    setAgentBusy(true);
    const allowed = await ensureCredits("agent");
    if (!allowed) {
      setAgentBusy(false);
      setMessages((m) => [...m, userMsg, { id: uid(), role: "agent", text: account ? s.agent.noCredits : s.credits.needSignIn }]);
      return;
    }
    const id = uid();
    const view = steps.map((st) => ({ label: s.stepLabel(st), status: "pending" as StepStatus, note: undefined as string | undefined }));
    const publish = (footer?: string) =>
      setMessages((m) => m.map((x) => (x.id === id ? { id, role: "agent", steps: view.map((v) => ({ ...v })), footer } : x)));
    setMessages((m) => [...m, userMsg, { id, role: "agent", steps: view.map((v) => ({ ...v })) }]);
    stop();
    setAgentBusy(true);
    let failed = false;
    for (let i = 0; i < steps.length; i++) {
      view[i].status = "running";
      publish();
      try {
        view[i].note = await execStep(steps[i], writtenIn, (note) => {
          view[i].note = note;
          publish();
        });
        view[i].status = "done";
      } catch (err) {
        console.error("NICS Studio agent step failed", err);
        view[i].status = "failed";
        view[i].note = steps[i].kind === "captions" ? captionError(err) : s.agent.failed;
        failed = true;
      }
      publish();
    }
    publish(failed ? undefined : s.agent.finished);
    if (view.some((v) => v.status === "done")) await charge("agent");
    setAgentBusy(false);
  };

  // --- Export -----------------------------------------------------------------

  const runExport = async () => {
    stop();
    cancelRef.current = false;
    setExportState({ phase: "running", progress: 0 });
    if (!(await ensureCredits("export"))) return setExportState(null);
    try {
      const result = await exportProject(projectRef.current, (progress) => setExportState({ phase: "running", progress }), () => cancelRef.current);
      await charge("export");
      const url = URL.createObjectURL(result.blob);
      const base = (projectRef.current.title || "nics-studio").replace(/[^\p{L}\p{N}_-]+/gu, "-").slice(0, 40);
      setExportState({ phase: "done", url, name: `${base}-${projectRef.current.aspect.replace(":", "x")}.${result.extension.replace(/^\./, "")}` });
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

  // --- Panels -----------------------------------------------------------------

  const selectedClip = selection?.type === "clip" ? project.clips.find((c) => c.id === selection.id) : undefined;
  const selectedText = selection?.type === "text" ? project.texts.find((x) => x.id === selection.id) : undefined;
  const selectedCaption = selection?.type === "caption" ? project.captions.find((x) => x.id === selection.id) : undefined;
  const selectedEffect = selection?.type === "effect" ? project.effects.find((x) => x.id === selection.id) : undefined;
  const preview = PREVIEW_SIZE[project.aspect];
  const cs = project.captionStyle;
  const setCaptionStyle = (patch: Partial<typeof cs>) => commit((p) => ({ ...p, captionStyle: { ...p.captionStyle, ...patch } }));

  const aspectOptions = [
    { value: "9:16" as Aspect, label: "9:16" },
    { value: "1:1" as Aspect, label: "1:1" },
    { value: "16:9" as Aspect, label: "16:9" },
  ];

  const deleteButton = (
    <Button size="sm" variant="outline" className="text-destructive" onClick={removeSelected}>
      <Trash2 className="w-4 h-4 mr-1" />
      {s.remove}
    </Button>
  );

  const panel = (() => {
    switch (tool) {
      case "projects":
        return (
          <div className="space-y-3">
            <Button onClick={startNew} disabled={busy || loading} variant="outline" className="w-full rounded-full">
              <Plus className="w-4 h-4 mr-2" />
              {s.projects.newProject}
            </Button>
            <p className="text-xs text-muted-foreground">{s.projects.hint}</p>
            {!saved.length && <p className="text-xs text-muted-foreground">{s.projects.empty}</p>}
            {saved.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "flex gap-2 rounded-lg border p-2",
                  item.id === currentId ? "border-primary/60 bg-primary/5" : "border-border/60",
                )}
              >
                <button
                  type="button"
                  disabled={busy || loading || item.id === currentId}
                  onClick={() => openSaved(item.id)}
                  className="flex min-w-0 flex-1 gap-2 text-left"
                >
                  <div className="h-14 w-10 shrink-0 overflow-hidden rounded bg-black">
                    {item.thumb && <img src={item.thumb} alt="" className="h-full w-full object-cover" />}
                  </div>
                  <div className="min-w-0 text-xs">
                    <div className="truncate font-semibold text-foreground">{item.title || s.projects.untitled}</div>
                    <div className="text-muted-foreground">{s.projects.duration(formatTime(item.duration))}</div>
                    <div className="text-muted-foreground">
                      {item.id === currentId ? s.projects.current : new Date(item.updatedAt).toLocaleString(lang === "en" ? "en-GB" : lang, { dateStyle: "short", timeStyle: "short" })}
                    </div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => removeSaved(item.id)}
                  disabled={busy}
                  aria-label={s.projects.remove}
                  title={s.projects.remove}
                  className="self-start text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        );
      case "media":
        return (
          <div className="space-y-4">
            <Button onClick={() => mediaInputRef.current?.click()} disabled={busy || loading} className="w-full rounded-full">
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ImagePlus className="w-4 h-4 mr-2" />}
              {s.addMedia}
            </Button>
            {selectedClip ? (
              <div className="space-y-4">
                <div className="text-sm font-semibold truncate">
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
                      <button type="button" aria-label={s.mute} onClick={() => updateClip(selectedClip.id, { volume: selectedClip.volume > 0 ? 0 : 1 })}>
                        {selectedClip.volume > 0 ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-muted-foreground" />}
                      </button>
                      <RangeSlider value={[selectedClip.volume]} min={0} max={1} step={0.01} onChange={([v]) => updateClip(selectedClip.id, { volume: v })} />
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
                  {deleteButton}
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                {project.clips.length > 0 && <div className="text-xs font-medium">{s.clips}</div>}
                {project.clips.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => select({ type: "clip", id: c.id })}
                    className="w-full flex justify-between gap-2 rounded-lg border border-border/60 px-2.5 py-1.5 text-left text-xs hover:border-primary/50"
                  >
                    <span className="truncate">{c.name}</span>
                    <span className="text-muted-foreground tabular-nums shrink-0">{clipLength(c).toFixed(1)}s</span>
                  </button>
                ))}
                {!project.clips.length && <p className="text-xs text-muted-foreground">{s.dropHint}</p>}
              </div>
            )}
          </div>
        );
      case "sounds":
        return (
          <div className="space-y-4">
            <Button variant="outline" onClick={() => musicInputRef.current?.click()} disabled={busy} className="w-full rounded-full">
              <Music2 className="w-4 h-4 mr-2" />
              {project.music ? s.replaceMusic : s.addMusic}
            </Button>
            {project.music ? (
              <>
                <div className="text-sm font-semibold truncate">
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
                <Button size="sm" variant="outline" className="text-destructive" onClick={() => commit((p) => ({ ...p, music: null }), false)}>
                  <Trash2 className="w-4 h-4 mr-1" />
                  {s.remove}
                </Button>
              </>
            ) : (
              <p className="text-xs text-muted-foreground">{s.noMusic}</p>
            )}
            {project.clips.some((c) => c.kind === "video") && (
              <Button size="sm" variant="ghost" onClick={() => commit((p) => ({ ...p, clips: p.clips.map((c) => ({ ...c, volume: 0 })) }), false)}>
                <VolumeX className="w-4 h-4 mr-1" />
                {s.muteAll}
              </Button>
            )}
          </div>
        );
      case "captions":
        return (
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground">{s.captionsIntro}</p>
            <Field label={s.wordsPerCaption} extra={String(cs.wordsPerCaption)}>
              <RangeSlider
                value={[cs.wordsPerCaption]}
                min={1}
                max={6}
                step={1}
                onChange={([n]) =>
                  commit((p) => ({
                    ...p,
                    captionStyle: { ...p.captionStyle, wordsPerCaption: n },
                    captions: p.captions.length ? buildCaptions(captionWords(p.captions), n) : p.captions,
                  }))
                }
              />
            </Field>
            <Field label={s.captionLanguage}>
              <Segmented<CaptionLang>
                size="sm"
                value={captionLang}
                onChange={setCaptionLang}
                options={[
                  { value: "ru", label: s.langRu },
                  { value: "en", label: s.langEn },
                ]}
              />
            </Field>
            <Button onClick={runCaptionsPanel} disabled={busy || total <= 0} className="w-full rounded-full">
              {agentBusy ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Captions className="w-4 h-4 mr-2" />}
              {project.captions.length ? s.regenerate : s.generateCaptions}
            </Button>
            {captionStatus && <p className="text-xs text-muted-foreground">{captionStatus}</p>}
            {selectedCaption && (
              <div className="space-y-2 rounded-lg border border-primary/40 p-2.5">
                <Field label={s.captionText}>
                  <Textarea
                    rows={2}
                    value={selectedCaption.words.map((w) => w.text).join(" ")}
                    onChange={(e) =>
                      commit((p) => ({ ...p, captions: p.captions.map((c) => (c.id === selectedCaption.id ? retimeCaption(c, e.target.value) : c)) }))
                    }
                  />
                </Field>
                {deleteButton}
              </div>
            )}
            <Field label={s.size}>
              <RangeSlider value={[cs.size]} min={0.035} max={0.14} step={0.005} onChange={([size]) => setCaptionStyle({ size })} />
            </Field>
            <Field label={s.position}>
              <RangeSlider value={[cs.y]} min={0.08} max={0.92} step={0.01} onChange={([y]) => setCaptionStyle({ y })} />
            </Field>
            <Field label={s.color}>
              <Swatches colors={TEXT_COLORS} value={cs.color} onChange={(color) => setCaptionStyle({ color })} />
            </Field>
            <Field label={s.accent}>
              <Swatches colors={TEXT_COLORS} value={cs.accent} onChange={(accent) => setCaptionStyle({ accent })} />
            </Field>
            <div className="flex items-center justify-between text-xs font-medium">
              {s.upper}
              <Switch checked={cs.upper} onCheckedChange={(upper) => setCaptionStyle({ upper })} />
            </div>
            <div className="flex items-center justify-between text-xs font-medium">
              {s.box}
              <Switch checked={cs.box} onCheckedChange={(box) => setCaptionStyle({ box })} />
            </div>
            {project.captions.length > 0 && (
              <Button size="sm" variant="ghost" className="text-destructive" onClick={() => commit((p) => ({ ...p, captions: [] }), false)}>
                <Trash2 className="w-4 h-4 mr-1" />
                {s.removeCaptions}
              </Button>
            )}
          </div>
        );
      case "text":
        return (
          <div className="space-y-4">
            <Button onClick={addText} disabled={busy || total <= 0} className="w-full rounded-full">
              <Type className="w-4 h-4 mr-2" />
              {s.addText}
            </Button>
            {selectedText ? (
              <div className="space-y-4">
                <Field label={s.text}>
                  <Textarea value={selectedText.text} placeholder={s.textPlaceholder} rows={2} onChange={(e) => updateText(selectedText.id, { text: e.target.value })} />
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
                  <Swatches colors={TEXT_COLORS} value={selectedText.color} onChange={(color) => updateText(selectedText.id, { color })} />
                </Field>
                <div className="flex items-center justify-between text-xs font-medium">
                  {s.box}
                  <Switch checked={selectedText.box} onCheckedChange={(box) => updateText(selectedText.id, { box })} />
                </div>
                {deleteButton}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">{s.selectHint}</p>
            )}
          </div>
        );
      case "effects":
        return (
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground">{s.zoomHint}</p>
            <Button onClick={addZoom} disabled={busy || total <= 0} className="w-full rounded-full">
              <Sparkles className="w-4 h-4 mr-2" />
              {s.addZoom}
            </Button>
            <Button variant="outline" onClick={() => commit((p) => ({ ...p, effects: autoZooms(total, 0.12) }), false)} disabled={busy || total <= 0} className="w-full rounded-full">
              <Wand2 className="w-4 h-4 mr-2" />
              {s.autoZooms}
            </Button>
            {selectedEffect && (
              <div className="space-y-3 rounded-lg border border-primary/40 p-2.5">
                <Field label={s.zoomAmount} extra={`${Math.round(selectedEffect.amount * 100)}%`}>
                  <RangeSlider value={[selectedEffect.amount]} min={0.03} max={0.5} step={0.01} onChange={([amount]) => updateEffect(selectedEffect.id, { amount })} />
                </Field>
                <Field label={s.timing} extra={`${formatTime(selectedEffect.start)} – ${formatTime(selectedEffect.end)}`}>
                  <RangeSlider
                    value={[Math.min(selectedEffect.start, total), Math.min(selectedEffect.end, total)]}
                    min={0}
                    max={Math.max(total, 0.1)}
                    onChange={([a, b]) => updateEffect(selectedEffect.id, { start: a, end: b })}
                  />
                </Field>
                {deleteButton}
              </div>
            )}
            {project.effects.length > 0 && (
              <Button size="sm" variant="ghost" className="text-destructive" onClick={() => commit((p) => ({ ...p, effects: [] }), false)}>
                <Trash2 className="w-4 h-4 mr-1" />
                {s.removeZooms}
              </Button>
            )}
          </div>
        );
      case "transitions":
        return (
          <Field label={s.transition}>
            <Segmented
              value={project.transition}
              options={[
                { value: "none", label: s.transitionNone },
                { value: "fade", label: s.transitionFade },
              ]}
              onChange={(transition) => commit((p) => ({ ...p, transition }), false)}
            />
          </Field>
        );
      case "background":
        return (
          <div className="space-y-4">
            <Field label={s.fit}>
              <Segmented
                value={project.fit}
                options={[
                  { value: "cover", label: s.fitCover },
                  { value: "contain", label: s.fitContain },
                ]}
                onChange={(fit) => commit((p) => ({ ...p, fit }), false)}
              />
            </Field>
            <Field label={s.background}>
              <p className="text-xs text-muted-foreground">{s.backgroundHint}</p>
              <Segmented
                size="sm"
                value={project.background.kind}
                options={[
                  { value: "blur", label: s.bgBlur },
                  { value: "color", label: s.bgColor },
                ]}
                onChange={(kind) => commit((p) => ({ ...p, fit: "contain", background: { ...p.background, kind } }), false)}
              />
            </Field>
            {project.background.kind === "color" && (
              <Swatches
                colors={BACKGROUND_COLORS}
                value={project.background.color}
                onChange={(color) => commit((p) => ({ ...p, fit: "contain", background: { kind: "color", color } }))}
              />
            )}
          </div>
        );
      case "settings":
        return (
          <div className="space-y-4">
            <Field label={s.format}>
              <Segmented value={project.aspect} options={aspectOptions} onChange={(aspect) => commit((p) => ({ ...p, aspect }), false)} />
            </Field>
            <p className="text-xs text-muted-foreground">{s.devNote}</p>
          </div>
        );
    }
  })();

  return (
    <div className="space-y-3">
      {!canEncode && (
        <div className="flex gap-3 rounded-xl border border-destructive/40 bg-destructive/5 p-3 text-sm text-foreground">
          <AlertCircle className="w-5 h-5 shrink-0 text-destructive" />
          <span>{s.unsupported}</span>
        </div>
      )}
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

      {/* Top bar */}
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border/60 bg-card px-3 py-2">
        <input
          value={project.title}
          onChange={(e) => commit((p) => ({ ...p, title: e.target.value }))}
          placeholder={s.untitled}
          className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-muted-foreground"
          aria-label={s.untitled}
        />
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={undo} disabled={busy || !history.length} aria-label={s.undo} title={s.undo}>
          <Undo2 className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={redo} disabled={busy || !future.length} aria-label={s.redo} title={s.redo}>
          <Redo2 className="w-4 h-4" />
        </Button>
        {saveState !== "idle" && (
          <span className={cn("hidden sm:flex items-center gap-1 text-[11px]", saveState === "failed" ? "text-destructive" : "text-muted-foreground")}>
            {saveState === "saving" ? <Loader2 className="w-3 h-3 animate-spin" /> : saveState === "saved" ? <Check className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
            {saveState === "saving" ? s.projects.saving : saveState === "saved" ? s.projects.saved : s.projects.saveFailed.split(":")[0]}
          </span>
        )}
        <Button
          variant="outline"
          size="sm"
          className="rounded-full h-9"
          onClick={() => setSignIn(null)}
          title={account?.email || s.credits.signIn}
        >
          <Coins className="w-4 h-4 mr-1.5 text-primary" />
          {account ? (balance === null ? "…" : s.credits.balance(balance)) : s.credits.signIn}
        </Button>
        <Button onClick={runExport} disabled={busy || total <= 0 || !canEncode} className="rounded-full h-9">
          <Download className="w-4 h-4 mr-2" />
          {s.export}
        </Button>
      </div>

      {saveState === "failed" && <p className="text-xs text-destructive">{s.projects.saveFailed}</p>}

      {creditsIssue && (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-primary/40 bg-primary/5 p-3 text-sm">
          <Coins className="w-4 h-4 shrink-0 text-primary" />
          <span className="flex-1 min-w-[12rem]">{creditsIssue}</span>
          <Button asChild size="sm" className="rounded-full">
            <a href="/nics-video#pricing">{s.credits.getCredits}</a>
          </Button>
          <button type="button" onClick={() => setCreditsIssue(null)} aria-label={s.close}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {notice && (
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
          <span className="flex-1">{notice}</span>
          <button type="button" onClick={() => setNotice(null)} aria-label={s.close}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[64px_280px_minmax(0,1fr)_340px]">
        {/* Tool rail */}
        <nav className="min-w-0 order-2 lg:order-none flex lg:flex-col gap-1 overflow-x-auto rounded-xl border border-border/60 bg-card p-1.5">
          {TOOLS.map(({ id, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTool(id)}
              className={cn(
                "flex shrink-0 flex-col items-center gap-1 rounded-lg px-2 py-2 text-[10px] min-w-[56px]",
                tool === id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="w-4 h-4" />
              {s.tools[id]}
            </button>
          ))}
        </nav>

        {/* Tool panel */}
        <div className="min-w-0 order-3 lg:order-none rounded-xl border border-border/60 bg-card p-3 lg:h-[600px] lg:overflow-y-auto">
          <div className="mb-3 text-sm font-semibold">{s.tools[tool]}</div>
          {panel}
        </div>

        {/* Preview */}
        <div className="min-w-0 order-1 lg:order-none relative flex items-center justify-center rounded-xl border border-border/60 bg-muted/40 p-3 pt-12 lg:h-[600px]">
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10">
            <Segmented size="sm" value={project.aspect} options={aspectOptions} onChange={(aspect) => commit((p) => ({ ...p, aspect }), false)} />
          </div>
          <div
            className="relative max-w-full overflow-hidden rounded-lg bg-black shadow-lg"
            style={{
              aspectRatio: `${preview.w} / ${preview.h}`,
              height: project.aspect === "16:9" ? "auto" : "min(58vh, 530px)",
              width: project.aspect === "16:9" ? "100%" : "auto",
            }}
          >
            <canvas ref={canvasRef} width={preview.w} height={preview.h} className="w-full h-full" onClick={togglePlay} />
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

        {/* Agent */}
        <div className="min-w-0 order-5 lg:order-none lg:row-span-2 lg:h-[calc(600px+12px+250px)]">
          <AgentPanel s={s} messages={messages} busy={busy} onSend={runAgent} />
        </div>

        {/* Timeline */}
        <div className="min-w-0 order-4 lg:order-none lg:col-span-3">
          <Timeline
            s={s}
            project={project}
            spans={spans}
            total={total}
            time={time}
            playing={playing}
            busy={busy}
            selection={selection}
            onSelect={select}
            onSeek={seek}
            onTogglePlay={togglePlay}
            onSplit={splitAtPlayhead}
            onClipRange={onClipRange}
            onItemRange={onItemRange}
          />
        </div>
      </div>

      {/* Sign in for credits */}
      <AccountDialog open={signIn !== false} onOpenChange={(o) => setSignIn(o ? null : false)} lang={lang} onSignedIn={() => setSignIn(false)}>
        <div className="space-y-1.5 text-sm">
          {signIn && <p className="text-destructive">{signIn}</p>}
          {account && balance !== null && <p className="font-medium">{s.credits.balance(balance)}</p>}
          <p className="text-xs text-muted-foreground">{s.credits.prices}</p>
          <a href="/nics-video#pricing" className="text-xs text-primary underline underline-offset-2">
            {s.credits.getCredits}
          </a>
        </div>
      </AccountDialog>

      {/* Export */}
      {exportState && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 space-y-4">
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
                    {s.close}
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
                  {s.close}
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudioEditor;
