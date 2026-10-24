// NICS Studio agent: turns a plain-language request ("cut the pauses, add
// captions 3 words at a time, add zooms") into ordered edit steps. Parsing is
// rule-based and runs in the browser; the heavy steps (pauses, speech
// recognition) run on the user's device too.
import type { Aspect, CaptionStyle, FilterId } from "./model";

export type AgentStep =
  | { kind: "silence" }
  | { kind: "limit"; seconds: number }
  | { kind: "captions"; words: number; language: "ru" | "en" | null }
  | { kind: "captionStyle"; patch: Partial<CaptionStyle> }
  | { kind: "removeCaptions" }
  | { kind: "zooms"; amount: number }
  | { kind: "removeZooms" }
  | { kind: "text"; text: string; y: number }
  | { kind: "aspect"; aspect: Aspect }
  | { kind: "fit"; fit: "cover" | "contain" }
  | { kind: "transition"; on: boolean }
  | { kind: "filter"; filter: FilterId }
  | { kind: "musicVolume"; volume: number }
  | { kind: "muteClips" };

const NUMBERS: Record<string, number> = {
  one: 1, two: 2, three: 3, four: 4, five: 5,
  "один": 1, "одно": 1, "одному": 1, "одним": 1, "два": 2, "две": 2, "двум": 2, "три": 3, "трём": 3, "трем": 3,
  "четыре": 4, "четырём": 4, "четырем": 4, "пять": 5, "пяти": 5,
};

const COLORS: [RegExp, string][] = [
  [/(жёлт|желт|yellow)/, "#ffd400"],
  [/(бел|white)/, "#ffffff"],
  [/(красн|розов|red|pink)/, "#ff3b6b"],
  [/(зелён|зелен|green)/, "#2ee6a6"],
  [/(син|голуб|blue)/, "#3ab4ff"],
  [/(чёрн|черн|black)/, "#111111"],
];

const has = (s: string, re: RegExp) => re.test(s);

const wordsPerCaption = (s: string) => {
  const m = s.match(/(\d+|[a-zа-яё]+)\s*(слов|word)/);
  if (!m) return null;
  const n = /^\d+$/.test(m[1]) ? Number(m[1]) : NUMBERS[m[1]];
  return n && n >= 1 && n <= 8 ? n : null;
};

export const parseCommand = (input: string): AgentStep[] => {
  const s = input.toLowerCase().replace(/ё/g, "е");
  const steps: AgentStep[] = [];
  const removing = has(s, /(убери|удали|убрать|удалить|remove|delete)/);

  // 1. Timing
  if (has(s, /(пауз|тишин|молчан|dead ?space|silence|pauses|gaps|лишн)/)) steps.push({ kind: "silence" });
  const limit = s.match(/(?:до|не длиннее|максимум|max(?:imum)?|under|up to)\s*(\d{1,3})\s*(сек|с\b|s\b|sec)/);
  if (limit) steps.push({ kind: "limit", seconds: Number(limit[1]) });

  // 2. Captions
  const mentionsCaptions = has(s, /(субтитр|caption|subtitle|титр)/);
  if (mentionsCaptions && removing && !has(s, /(добав|сдела|add|make|generate)/)) {
    steps.push({ kind: "removeCaptions" });
  } else if (mentionsCaptions) {
    const language = has(s, /(англ|english|in en)/) ? "en" : has(s, /(русск|russian)/) ? "ru" : null;
    const words = wordsPerCaption(s) ?? 3;
    if (has(s, /(добав|сдела|созда|сгенер|add|make|generate|create|нужн)/) || !has(s, /(больше|меньше|bigger|smaller|larger|цвет|color|colour|выше|ниже|сверху|снизу)/)) {
      steps.push({ kind: "captions", words, language });
    }
    const patch: Partial<CaptionStyle> = { wordsPerCaption: words };
    if (has(s, /(немного больше|чуть больше|a little bigger|slightly bigger|little bigger)/)) patch.size = 0.085;
    else if (has(s, /(больше|крупн|bigger|larger)/)) patch.size = 0.095;
    else if (has(s, /(меньше|мельче|smaller)/)) patch.size = 0.06;
    if (has(s, /(сверху|вверху|наверх|at the top|top)/)) patch.y = 0.18;
    else if (has(s, /(по центру|посередин|center|middle)/)) patch.y = 0.5;
    else if (has(s, /(снизу|внизу|bottom)/)) patch.y = 0.8;
    const color = COLORS.find(([re]) => re.test(s));
    if (color) patch.color = color[1];
    if (has(s, /(подложк|фон под|background box|with a box)/)) patch.box = true;
    if (has(s, /(маленьк(ими|ие) букв|строчн|lowercase)/)) patch.upper = false;
    else if (has(s, /(заглавн|капс|uppercase|caps)/)) patch.upper = true;
    if (has(s, /(без подсветк|no highlight)/)) patch.accent = patch.color ?? "#ffffff";
    steps.push({ kind: "captionStyle", patch });
  }

  // 3. Effects and look
  if (has(s, /(зум|приближ|наезд|zoom|punch)/)) {
    if (removing && !has(s, /(добав|add)/)) steps.push({ kind: "removeZooms" });
    else steps.push({ kind: "zooms", amount: has(s, /(сильн|strong|dramatic|big zoom)/) ? 0.2 : has(s, /(лёгк|легк|слегка|subtle|slight|light)/) ? 0.08 : 0.12 });
  }
  if (has(s, /(без переход|убери переход|no transition|remove transition)/)) steps.push({ kind: "transition", on: false });
  else if (has(s, /(переход|затемн|transition|fade)/)) steps.push({ kind: "transition", on: true });
  if (has(s, /(ч\/б|черно-бел|чб\b|b&w|black and white|grayscale|monochrome)/)) steps.push({ kind: "filter", filter: "bw" });
  else if (has(s, /(ярч|сочн|насыщен|vivid|brighter|vibrant)/)) steps.push({ kind: "filter", filter: "vivid" });
  else if (has(s, /(тепл|warm)/)) steps.push({ kind: "filter", filter: "warm" });
  else if (has(s, /(холодн|cool|cold)/)) steps.push({ kind: "filter", filter: "cool" });
  else if (has(s, /(мягк|приглуш|soft|faded)/)) steps.push({ kind: "filter", filter: "fade" });
  else if (has(s, /(без фильтр|убери фильтр|no filter|remove filter|оригинал)/)) steps.push({ kind: "filter", filter: "none" });

  const quoted = input.match(/["«“„']([^"»”']{1,120})["»”']/);
  if (quoted && has(s, /(текст|надпис|заголов|title|text|напиши|write)/)) {
    const y = has(s, /(снизу|внизу|bottom)/) ? 0.85 : has(s, /(по центру|center|middle)/) ? 0.5 : 0.15;
    steps.push({ kind: "text", text: quoted[1], y });
  }

  // 4. Sound
  if (has(s, /(музык|music|трек|track)/)) {
    if (has(s, /(тише|потише|quieter|lower|softer|fainter)/)) steps.push({ kind: "musicVolume", volume: 0.3 });
    else if (has(s, /(громче|louder)/)) steps.push({ kind: "musicVolume", volume: 1 });
  }
  if (has(s, /(без звука|убери звук|выключи звук|отключи звук|mute|remove (the )?sound)/) && !has(s, /музык|music/)) {
    steps.push({ kind: "muteClips" });
  }

  // 5. Format
  if (has(s, /(9[:x/ ]16|вертикал|vertical|reels|shorts|tik ?tok|тик ?ток|рилс|сторис|stories)/)) steps.push({ kind: "aspect", aspect: "9:16" });
  else if (has(s, /(16[:x/ ]9|горизонт|horizontal|youtube|ютуб|landscape)/)) steps.push({ kind: "aspect", aspect: "16:9" });
  else if (has(s, /(1[:x/ ]1|квадрат|square)/)) steps.push({ kind: "aspect", aspect: "1:1" });
  if (has(s, /(целиком|без обрезк|whole picture|letterbox|не обрез)/)) steps.push({ kind: "fit", fit: "contain" });
  else if (has(s, /(на весь экран|заполн|fill the frame|full screen|crop to fill)/)) steps.push({ kind: "fit", fit: "cover" });

  return steps;
};
