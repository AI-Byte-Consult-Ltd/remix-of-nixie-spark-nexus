// Sound analysis for NICS Studio, all on the user's device: decoding a clip's
// audio, finding pauses to cut, and building the 16 kHz mono track that speech
// recognition listens to.
import { ALL_FORMATS, AudioBufferSink, BlobSource, Input } from "mediabunny";
import { type Clip, type Project, clipLength, clipSpans, uid } from "./model";

// Collects the [from, to) source-time part of a clip's sound into one AudioBuffer.
export const decodeClipAudio = async (clip: Clip, from = clip.in, to = clip.out): Promise<AudioBuffer | null> => {
  if (clip.kind !== "video") return null;
  const input = new Input({ source: new BlobSource(clip.file), formats: ALL_FORMATS });
  try {
    const track = await input.getPrimaryAudioTrack();
    if (!track || !(await track.canDecode())) return null;
    const first = await track.getFirstTimestamp();
    const sink = new AudioBufferSink(track);
    const rate = track.sampleRate;
    const channels = Math.min(2, track.numberOfChannels);
    const length = Math.ceil((to - from) * rate);
    if (length <= 0) return null;
    const out = new AudioBuffer({ numberOfChannels: channels, length, sampleRate: rate });
    for await (const { buffer, timestamp } of sink.buffers(first + from, first + to)) {
      const offset = Math.round((timestamp - first - from) * rate);
      for (let ch = 0; ch < channels; ch++) {
        const data = buffer.getChannelData(Math.min(ch, buffer.numberOfChannels - 1));
        const dest = out.getChannelData(ch);
        const start = Math.max(0, -offset);
        const end = Math.min(data.length, length - offset);
        if (end > start) dest.set(data.subarray(start, end), offset + start);
      }
    }
    return out;
  } finally {
    input.dispose();
  }
};

const WINDOW = 0.03;
const MIN_PAUSE = 0.45;
const PAD = 0.12;
const MIN_KEEP = 0.25;

// Speech ranges of a clip in source time. A window counts as sound when it is
// within 32 dB of the clip's loud parts (and above -50 dBFS), so it adapts to
// quiet and loud recordings alike.
export const speechRanges = (buf: AudioBuffer, offset: number): [number, number][] => {
  const win = Math.max(1, Math.round(buf.sampleRate * WINDOW));
  const count = Math.floor(buf.length / win);
  if (count < 2) return [[offset, offset + buf.duration]];
  const db = new Float32Array(count);
  const chans = Array.from({ length: buf.numberOfChannels }, (_, c) => buf.getChannelData(c));
  for (let i = 0; i < count; i++) {
    let sum = 0;
    for (const ch of chans) for (let j = i * win; j < (i + 1) * win; j++) sum += ch[j] * ch[j];
    const rms = Math.sqrt(sum / (win * chans.length));
    db[i] = 20 * Math.log10(rms + 1e-9);
  }
  const sorted = Array.from(db).sort((a, b) => a - b);
  const loud = sorted[Math.floor(sorted.length * 0.95)];
  const threshold = Math.max(-50, loud - 32);
  const ranges: [number, number][] = [];
  let start = -1;
  for (let i = 0; i <= count; i++) {
    const on = i < count && db[i] > threshold;
    if (on && start < 0) start = i;
    if (!on && start >= 0) {
      ranges.push([start * WINDOW, i * WINDOW]);
      start = -1;
    }
  }
  // Merge short gaps, pad, and drop blips.
  const merged: [number, number][] = [];
  for (const r of ranges) {
    const last = merged[merged.length - 1];
    if (last && r[0] - last[1] < MIN_PAUSE) last[1] = r[1];
    else merged.push([r[0], r[1]]);
  }
  return merged
    .map(([a, b]) => [Math.max(0, a - PAD), Math.min(buf.duration, b + PAD)] as [number, number])
    .filter(([a, b]) => b - a >= MIN_KEEP)
    .map(([a, b]) => [offset + a, offset + b] as [number, number]);
};

// Moves timeline-timed items (texts, captions, zooms) along with a cut: the
// `removed` ranges are timeline intervals that disappear.
const remap = (removed: [number, number][]) => (t: number) => {
  let shift = 0;
  for (const [a, b] of removed) {
    if (t >= b) shift += b - a;
    else if (t > a) return a - shift;
  }
  return t - shift;
};

export interface SilenceResult {
  project: Project;
  removed: number;
}

export const removeSilence = async (p: Project, onProgress?: (share: number) => void): Promise<SilenceResult> => {
  const spans = clipSpans(p);
  const clips: Clip[] = [];
  const removedTimeline: [number, number][] = [];
  for (let i = 0; i < spans.length; i++) {
    onProgress?.(i / spans.length);
    const { clip, start } = spans[i];
    const buf = clip.kind === "video" && clip.volume > 0 ? await decodeClipAudio(clip) : null;
    if (!buf) {
      clips.push(clip);
      continue;
    }
    const keep = speechRanges(buf, clip.in);
    if (!keep.length) {
      clips.push(clip);
      continue;
    }
    let cursor = clip.in;
    keep.forEach(([a, b], k) => {
      if (a > cursor) removedTimeline.push([start + (cursor - clip.in), start + (a - clip.in)]);
      clips.push({ ...clip, id: k === 0 ? clip.id : uid(), in: a, out: b });
      cursor = b;
    });
    if (clip.out > cursor) removedTimeline.push([start + (cursor - clip.in), start + clipLength(clip)]);
  }
  onProgress?.(1);
  const removed = removedTimeline.reduce((s, [a, b]) => s + (b - a), 0);
  if (removed < 0.05) return { project: p, removed: 0 };
  const map = remap(removedTimeline);
  const keepSpan = <T extends { start: number; end: number }>(x: T) => ({ ...x, start: map(x.start), end: map(x.end) });
  return {
    removed,
    project: {
      ...p,
      clips,
      texts: p.texts.map(keepSpan).filter((x) => x.end - x.start > 0.1),
      effects: p.effects.map(keepSpan).filter((x) => x.end - x.start > 0.1),
      captions: p.captions
        .map((c) => ({ ...keepSpan(c), words: c.words.map(keepSpan).filter((w) => w.end > w.start) }))
        .filter((c) => c.words.length && c.end > c.start),
    },
  };
};

export const SPEECH_RATE = 16000;

// The whole timeline's clip sound as 16 kHz mono, which is what Whisper expects.
export const timelineSpeechAudio = async (p: Project, onProgress?: (share: number) => void): Promise<Float32Array | null> => {
  const spans = clipSpans(p);
  const total = spans.length ? spans[spans.length - 1].end : 0;
  if (total <= 0) return null;
  const out = new Float32Array(Math.ceil(total * SPEECH_RATE));
  let any = false;
  for (let i = 0; i < spans.length; i++) {
    onProgress?.(i / spans.length);
    const { clip, start } = spans[i];
    const buf = await decodeClipAudio(clip);
    if (!buf) continue;
    const ctx = new OfflineAudioContext(1, Math.max(1, Math.ceil(buf.duration * SPEECH_RATE)), SPEECH_RATE);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(ctx.destination);
    src.start();
    const mono = (await ctx.startRendering()).getChannelData(0);
    const at = Math.round(start * SPEECH_RATE);
    out.set(mono.subarray(0, Math.max(0, Math.min(mono.length, out.length - at))), at);
    any = true;
  }
  onProgress?.(1);
  return any ? out : null;
};
