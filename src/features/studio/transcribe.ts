// Turns the timeline's speech into timed words for captions, using the
// in-browser Whisper worker.
import type { CaptionWord, Project } from "./model";
import type { CaptionLang } from "./agent";
import { SPEECH_RATE, timelineSpeechAudio } from "./audio";

export type TranscribeProgress =
  | { stage: "audio"; share: number }
  | { stage: "model"; share: number }
  | { stage: "recognize" };

export class TranscribeError extends Error {
  constructor(public code: "no_speech" | "failed", detail?: string) {
    super(detail ?? code);
  }
}

// Whisper gives phrase timestamps; words inside a phrase are spread by length,
// which is close enough for 1-5 word captions.
const phraseWords = (text: string, start: number, end: number): CaptionWord[] => {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const weights = words.map((w) => Math.max(2, w.replace(/[^\p{L}\p{N}]/gu, "").length) + 1);
  const sum = weights.reduce((a, b) => a + b, 0) || 1;
  let t = start;
  return words.map((w, i) => {
    const len = ((end - start) * weights[i]) / sum;
    const word = { text: w, start: t, end: t + len };
    t += len;
    return word;
  });
};

// Whisper's names for the caption languages.
const WHISPER_LANGUAGES: Record<CaptionLang, string> = {
  en: "english", ru: "russian", de: "german", fr: "french", es: "spanish", it: "italian",
  pt: "portuguese", pl: "polish", tr: "turkish", bg: "bulgarian", ar: "arabic", zh: "chinese",
};

let worker: Worker | null = null;

export const transcribeProject = async (
  p: Project,
  language: CaptionLang,
  onProgress: (p: TranscribeProgress) => void,
): Promise<CaptionWord[]> => {
  const audio = await timelineSpeechAudio(p, (share) => onProgress({ stage: "audio", share }));
  if (!audio) throw new TranscribeError("no_speech");
  const total = audio.length / SPEECH_RATE;
  worker ??= new Worker(new URL("./whisper.worker.ts", import.meta.url), { type: "module" });
  const w = worker;
  const loaded = new Map<string, number>();
  const chunks = await new Promise<{ text: string; timestamp: [number, number | null] }[]>((resolve, reject) => {
    w.onmessage = (e) => {
      const m = e.data;
      if (m.type === "loading") {
        loaded.set(m.file, m.progress);
        const vals = Array.from(loaded.values());
        onProgress({ stage: "model", share: vals.reduce((a, b) => a + b, 0) / Math.max(2, vals.length) });
      } else if (m.type === "running") onProgress({ stage: "recognize" });
      else if (m.type === "done") resolve(m.chunks);
      else if (m.type === "error") reject(new TranscribeError("failed", m.message));
    };
    w.onerror = (e) => reject(new TranscribeError("failed", e.message));
    w.postMessage({ audio, language: WHISPER_LANGUAGES[language] });
  });
  const words = chunks.flatMap((c) => {
    const start = c.timestamp[0] ?? 0;
    const end = Math.min(total, c.timestamp[1] ?? Math.min(total, start + 5));
    return end > start ? phraseWords(c.text, start, end) : [];
  });
  if (!words.length) throw new TranscribeError("no_speech");
  return words;
};
