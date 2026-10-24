// Renders a NICS Studio project to a video file entirely in the browser
// (WebCodecs through mediabunny). Nothing is uploaded: frames are decoded
// from the user's own files, drawn with the same renderer as the preview,
// and encoded locally.
import {
  ALL_FORMATS,
  AudioBufferSource,
  BlobSource,
  BufferTarget,
  CanvasSink,
  CanvasSource,
  Input,
  Mp4OutputFormat,
  Output,
  QUALITY_HIGH,
  WebMOutputFormat,
  getFirstEncodableAudioCodec,
  getFirstEncodableVideoCodec,
} from "mediabunny";
import {
  EXPORT_SIZE,
  FPS,
  type Clip,
  type FrameSource,
  type Project,
  clipSpans,
  drawFrame,
  totalDuration,
} from "./model";
import { decodeClipAudio } from "./audio";

const SAMPLE_RATE = 48000;
const MUSIC_FADE_OUT = 1.5;

export class ExportError extends Error {
  constructor(public code: "no_encoder" | "decode" | "canceled", detail?: string) {
    super(detail ?? code);
  }
}

export interface ExportResult {
  blob: Blob;
  extension: string;
}

// The source picture is scaled down while decoding so a 4K clip does not
// cost 4K canvases for a 1080p output.
const sinkSize = (w: number, h: number) => {
  const scale = Math.min(1, 1920 / Math.max(w, h));
  return { width: Math.max(2, Math.round((w * scale) / 2) * 2), height: Math.max(2, Math.round((h * scale) / 2) * 2) };
};

const mixAudio = async (p: Project, total: number, isCanceled: () => boolean): Promise<AudioBuffer | null> => {
  const hasClipSound = p.clips.some((c) => c.kind === "video" && c.volume > 0);
  if (!hasClipSound && !(p.music && p.music.volume > 0)) return null;
  const ctx = new OfflineAudioContext(2, Math.ceil(total * SAMPLE_RATE), SAMPLE_RATE);
  for (const span of clipSpans(p)) {
    const { clip } = span;
    if (clip.kind !== "video" || clip.volume <= 0) continue;
    if (isCanceled()) throw new ExportError("canceled");
    const buf = await decodeClipAudio(clip);
    if (!buf) continue;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const gain = ctx.createGain();
    gain.gain.value = clip.volume;
    src.connect(gain).connect(ctx.destination);
    src.start(span.start);
  }
  if (p.music && p.music.volume > 0) {
    const data = await p.music.file.arrayBuffer();
    const buf = await ctx.decodeAudioData(data);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const gain = ctx.createGain();
    const fadeAt = Math.max(0, Math.min(total, buf.duration) - MUSIC_FADE_OUT);
    gain.gain.setValueAtTime(p.music.volume, 0);
    gain.gain.setValueAtTime(p.music.volume, fadeAt);
    gain.gain.linearRampToValueAtTime(0, Math.min(total, buf.duration));
    src.connect(gain).connect(ctx.destination);
    src.start(0);
  }
  return ctx.startRendering();
};

export const exportProject = async (
  p: Project,
  onProgress: (share: number) => void,
  isCanceled: () => boolean,
): Promise<ExportResult> => {
  const { w, h } = EXPORT_SIZE[p.aspect];
  const total = totalDuration(p);
  const spans = clipSpans(p);

  let format: Mp4OutputFormat | WebMOutputFormat = new Mp4OutputFormat({ fastStart: "in-memory" });
  let videoCodec = await getFirstEncodableVideoCodec(["avc"], { width: w, height: h });
  if (!videoCodec) {
    format = new WebMOutputFormat();
    videoCodec = await getFirstEncodableVideoCodec(["vp9", "vp8", "av1"], { width: w, height: h });
  }
  if (!videoCodec) throw new ExportError("no_encoder");
  const audioCodec = await getFirstEncodableAudioCodec(format.getSupportedAudioCodecs(), {
    numberOfChannels: 2,
    sampleRate: SAMPLE_RATE,
  });

  // Sound first: it is quick and tells us early if a file cannot be read.
  onProgress(0.01);
  const mixed = audioCodec ? await mixAudio(p, total, isCanceled) : null;

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) throw new ExportError("no_encoder", "canvas");

  const target = new BufferTarget();
  const output = new Output({ format, target });
  const videoSource = new CanvasSource(canvas, { codec: videoCodec, bitrate: QUALITY_HIGH, keyFrameInterval: 2 });
  output.addVideoTrack(videoSource, { frameRate: FPS });
  let audioSource: AudioBufferSource | null = null;
  if (mixed && audioCodec) {
    audioSource = new AudioBufferSource({ codec: audioCodec, bitrate: QUALITY_HIGH });
    output.addAudioTrack(audioSource);
  }
  await output.start();

  const totalFrames = Math.max(1, Math.round(total * FPS));
  let frameIndex = 0;

  const emit = async (frame: FrameSource | null, clip: Clip) => {
    const t = frameIndex / FPS;
    drawFrame(ctx, w, h, p, t, frame, clip.filter, spans, total);
    await videoSource.add(t, 1 / FPS);
    frameIndex++;
    if (frameIndex % 10 === 0) onProgress(0.05 + 0.9 * (frameIndex / totalFrames));
  };

  try {
    for (const span of spans) {
      const { clip } = span;
      const frames = Math.round(span.end * FPS) - Math.round(span.start * FPS);
      if (clip.kind === "image") {
        const bitmap = await createImageBitmap(clip.file);
        const src = { image: bitmap, width: bitmap.width, height: bitmap.height };
        for (let k = 0; k < frames; k++) {
          if (isCanceled()) throw new ExportError("canceled");
          await emit(src, clip);
        }
        bitmap.close();
        continue;
      }
      const input = new Input({ source: new BlobSource(clip.file), formats: ALL_FORMATS });
      try {
        const track = await input.getPrimaryVideoTrack();
        if (!track || !(await track.canDecode())) throw new ExportError("decode", clip.name);
        const first = await track.getFirstTimestamp();
        const sink = new CanvasSink(track, { ...sinkSize(track.displayWidth, track.displayHeight), fit: "fill", poolSize: 2 });
        const stamps = Array.from({ length: frames }, (_, k) => first + clip.in + k / FPS);
        let last: FrameSource | null = null;
        for await (const wrapped of sink.canvasesAtTimestamps(stamps)) {
          if (isCanceled()) throw new ExportError("canceled");
          if (wrapped) last = { image: wrapped.canvas, width: wrapped.canvas.width, height: wrapped.canvas.height };
          await emit(last, clip);
        }
      } finally {
        input.dispose();
      }
    }
    if (audioSource && mixed) {
      await audioSource.add(mixed);
      audioSource.close();
    }
    videoSource.close();
    onProgress(0.97);
    await output.finalize();
  } catch (err) {
    if (output.state !== "finalized" && output.state !== "canceled") await output.cancel().catch(() => {});
    throw err;
  }
  if (!target.buffer) throw new ExportError("no_encoder", "empty output");
  onProgress(1);
  return { blob: new Blob([target.buffer], { type: format.mimeType }), extension: format.fileExtension };
};

export const browserCanEdit = () => typeof window !== "undefined" && "VideoEncoder" in window && "VideoDecoder" in window;
