import type { AnalysisCandidate, AnalysisProgress, AnalysedInstrument, AppLanguage } from "./types";

/*
 * 2026-11-11: the stages of an ordered analysis, shown as the rungs of the
 * DNA helix. A stage is "done" only when [07 APP] returned the real result
 * of that stage (the [01 CORE] audit row or the stored signal); its detail
 * text is built from those real values. Nothing here is simulated.
 */

export type StageState = "pending" | "active" | "done";
export type StageTone = "up" | "down" | "flat" | "warn" | "good" | "neutral";

export interface AnalysisStage {
  key: string;
  label: string;
  detail: string;
  state: StageState;
  tone: StageTone;
}

export type AnalysisOutcome = "running" | "signal" | "no_setup" | "no_result" | "failed";

type Texts = {
  title: string;
  lead: string;
  running: string;
  outcomeSignal: string;
  outcomeNoSetup: string;
  outcomeNoResult: string;
  outcomeFailed: string;
  stages: Record<string, string>;
  waiting: string;
  accepted: string;
  fresh: (fresh: number, total: number) => string;
  instruments: (count: number) => string;
  up: string;
  down: string;
  flat: string;
  correctionEnded: string;
  correctionRunning: string;
  noSetup: string;
  setup: Record<string, string>;
  market: string;
  limit: string;
  blackout: string;
  events: (count: number) => string;
  noEvents: string;
  finalCheck: string;
  signalReady: (text: string) => string;
  noEntry: string;
  long: string;
  short: string;
  trendCount: (up: number, down: number, flat: number) => string;
  candidates: (count: number) => string;
};

const TEXTS: Record<AppLanguage, Texts> = {
  ru: {
    title: "Анализ рынка",
    lead: "Каждая перекладина спирали загорается, когда движок NICS реально прошёл этот этап.",
    running: "Идёт анализ…",
    outcomeSignal: "Сигнал готов",
    outcomeNoSetup: "Анализ завершён: входа сейчас нет",
    outcomeNoResult: "Анализ ещё идёт. Итог придёт в Telegram.",
    outcomeFailed: "Не удалось получить ход анализа",
    stages: {
      request: "Заявка",
      data: "Свежие данные",
      htf: "D1 / H4: направление",
      m15: "M15: тренд и коррекция",
      m5: "M5: сетап",
      m1: "M1: точка входа",
      news: "Календарь и события",
      final: "Итог",
    },
    waiting: "ждём",
    accepted: "принята, движок запущен",
    fresh: (fresh, total) => `${fresh} из ${total} таймфреймов свежие`,
    instruments: (count) => `${count} инструм. проверено`,
    up: "вверх",
    down: "вниз",
    flat: "без явного тренда",
    correctionEnded: "коррекция завершилась",
    correctionRunning: "коррекция ещё идёт",
    noSetup: "сетапа нет",
    setup: { BREAKOUT: "пробой", MOMENTUM: "импульс", MEAN_REVERSION: "возврат к среднему", PULLBACK: "откат", RANGE: "диапазон" },
    market: "вход по рынку",
    limit: "лимитный вход",
    blackout: "рядом важная новость — осторожно",
    events: (count) => `важных новостей в ближайшие 4 ч: ${count}`,
    noEvents: "важных новостей в ближайшие 4 ч нет",
    finalCheck: "финальная проверка риска и новостей",
    signalReady: (text) => `сигнал готов: ${text}`,
    noEntry: "сильного входа сейчас нет",
    long: "покупка",
    short: "продажа",
    trendCount: (up, down, flat) => `H4: ↑${up} ↓${down} ↔${flat}`,
    candidates: (count) => `кандидатов: ${count}`,
  },
  bg: {
    title: "Анализ на пазара",
    lead: "Всяко стъпало на спиралата светва, когато двигателят NICS наистина е минал този етап.",
    running: "Анализът тече…",
    outcomeSignal: "Сигналът е готов",
    outcomeNoSetup: "Анализът приключи: сега няма вход",
    outcomeNoResult: "Анализът още тече. Резултатът ще дойде в Telegram.",
    outcomeFailed: "Не успяхме да получим хода на анализа",
    stages: {
      request: "Заявка",
      data: "Свежи данни",
      htf: "D1 / H4: посока",
      m15: "M15: тренд и корекция",
      m5: "M5: сетъп",
      m1: "M1: точка на вход",
      news: "Календар и събития",
      final: "Резултат",
    },
    waiting: "чакаме",
    accepted: "приета, двигателят е стартиран",
    fresh: (fresh, total) => `${fresh} от ${total} таймфрейма са свежи`,
    instruments: (count) => `проверени инструменти: ${count}`,
    up: "нагоре",
    down: "надолу",
    flat: "без ясен тренд",
    correctionEnded: "корекцията приключи",
    correctionRunning: "корекцията продължава",
    noSetup: "няма сетъп",
    setup: { BREAKOUT: "пробив", MOMENTUM: "импулс", MEAN_REVERSION: "връщане към средното", PULLBACK: "отдръпване", RANGE: "диапазон" },
    market: "вход по пазара",
    limit: "лимитен вход",
    blackout: "наблизо важна новина — внимание",
    events: (count) => `важни новини в следващите 4 ч: ${count}`,
    noEvents: "няма важни новини в следващите 4 ч",
    finalCheck: "финална проверка на риска и новините",
    signalReady: (text) => `сигналът е готов: ${text}`,
    noEntry: "сега няма силен вход",
    long: "покупка",
    short: "продажба",
    trendCount: (up, down, flat) => `H4: ↑${up} ↓${down} ↔${flat}`,
    candidates: (count) => `кандидати: ${count}`,
  },
  en: {
    title: "Market analysis",
    lead: "Each rung of the helix lights up when the NICS engine has really completed that stage.",
    running: "Analysing…",
    outcomeSignal: "Signal ready",
    outcomeNoSetup: "Analysis complete: no entry right now",
    outcomeNoResult: "The analysis is still running. The result will arrive in Telegram.",
    outcomeFailed: "Could not load the analysis progress",
    stages: {
      request: "Request",
      data: "Fresh data",
      htf: "D1 / H4: direction",
      m15: "M15: trend and pullback",
      m5: "M5: setup",
      m1: "M1: entry point",
      news: "Calendar and events",
      final: "Result",
    },
    waiting: "waiting",
    accepted: "accepted, engine started",
    fresh: (fresh, total) => `${fresh} of ${total} timeframes fresh`,
    instruments: (count) => `${count} instruments checked`,
    up: "up",
    down: "down",
    flat: "no clear trend",
    correctionEnded: "pullback ended",
    correctionRunning: "pullback still running",
    noSetup: "no setup",
    setup: { BREAKOUT: "breakout", MOMENTUM: "momentum", MEAN_REVERSION: "mean reversion", PULLBACK: "pullback", RANGE: "range" },
    market: "market entry",
    limit: "limit entry",
    blackout: "important news nearby — caution",
    events: (count) => `high-impact news in the next 4 h: ${count}`,
    noEvents: "no high-impact news in the next 4 h",
    finalCheck: "final risk and news check",
    signalReady: (text) => `signal ready: ${text}`,
    noEntry: "no strong entry right now",
    long: "buy",
    short: "sell",
    trendCount: (up, down, flat) => `H4: ↑${up} ↓${down} ↔${flat}`,
    candidates: (count) => `candidates: ${count}`,
  },
  es: {
    title: "Análisis del mercado",
    lead: "Cada peldaño de la hélice se ilumina cuando el motor NICS ha completado de verdad esa etapa.",
    running: "Analizando…",
    outcomeSignal: "Señal lista",
    outcomeNoSetup: "Análisis terminado: ahora no hay entrada",
    outcomeNoResult: "El análisis sigue en curso. El resultado llegará a Telegram.",
    outcomeFailed: "No se pudo cargar el progreso del análisis",
    stages: {
      request: "Solicitud",
      data: "Datos frescos",
      htf: "D1 / H4: dirección",
      m15: "M15: tendencia y corrección",
      m5: "M5: setup",
      m1: "M1: punto de entrada",
      news: "Calendario y eventos",
      final: "Resultado",
    },
    waiting: "esperando",
    accepted: "aceptada, motor en marcha",
    fresh: (fresh, total) => `${fresh} de ${total} marcos temporales frescos`,
    instruments: (count) => `${count} instrumentos revisados`,
    up: "al alza",
    down: "a la baja",
    flat: "sin tendencia clara",
    correctionEnded: "la corrección terminó",
    correctionRunning: "la corrección sigue",
    noSetup: "sin setup",
    setup: { BREAKOUT: "ruptura", MOMENTUM: "impulso", MEAN_REVERSION: "reversión a la media", PULLBACK: "retroceso", RANGE: "rango" },
    market: "entrada a mercado",
    limit: "entrada limitada",
    blackout: "noticia importante cerca — precaución",
    events: (count) => `noticias importantes en las próximas 4 h: ${count}`,
    noEvents: "sin noticias importantes en las próximas 4 h",
    finalCheck: "control final de riesgo y noticias",
    signalReady: (text) => `señal lista: ${text}`,
    noEntry: "ahora no hay una entrada fuerte",
    long: "compra",
    short: "venta",
    trendCount: (up, down, flat) => `H4: ↑${up} ↓${down} ↔${flat}`,
    candidates: (count) => `candidatos: ${count}`,
  },
  pt: {
    title: "Análise do mercado",
    lead: "Cada degrau da hélice acende quando o motor NICS realmente concluiu essa etapa.",
    running: "Analisando…",
    outcomeSignal: "Sinal pronto",
    outcomeNoSetup: "Análise concluída: sem entrada agora",
    outcomeNoResult: "A análise ainda está em andamento. O resultado chegará no Telegram.",
    outcomeFailed: "Não foi possível carregar o progresso da análise",
    stages: {
      request: "Pedido",
      data: "Dados frescos",
      htf: "D1 / H4: direção",
      m15: "M15: tendência e correção",
      m5: "M5: setup",
      m1: "M1: ponto de entrada",
      news: "Calendário e eventos",
      final: "Resultado",
    },
    waiting: "aguardando",
    accepted: "aceito, motor iniciado",
    fresh: (fresh, total) => `${fresh} de ${total} tempos gráficos frescos`,
    instruments: (count) => `${count} instrumentos verificados`,
    up: "alta",
    down: "baixa",
    flat: "sem tendência clara",
    correctionEnded: "a correção terminou",
    correctionRunning: "a correção continua",
    noSetup: "sem setup",
    setup: { BREAKOUT: "rompimento", MOMENTUM: "impulso", MEAN_REVERSION: "reversão à média", PULLBACK: "recuo", RANGE: "lateral" },
    market: "entrada a mercado",
    limit: "entrada limitada",
    blackout: "notícia importante próxima — cuidado",
    events: (count) => `notícias importantes nas próximas 4 h: ${count}`,
    noEvents: "sem notícias importantes nas próximas 4 h",
    finalCheck: "verificação final de risco e notícias",
    signalReady: (text) => `sinal pronto: ${text}`,
    noEntry: "sem entrada forte agora",
    long: "compra",
    short: "venda",
    trendCount: (up, down, flat) => `H4: ↑${up} ↓${down} ↔${flat}`,
    candidates: (count) => `candidatos: ${count}`,
  },
};

export const analysisTexts = (language: AppLanguage): Texts => TEXTS[language] ?? TEXTS.en;

export const STAGE_KEYS = ["request", "data", "htf", "m15", "m5", "m1", "news", "final"] as const;

// Engine timeframe scores (signed); same sign convention as the engine.
const bias = (score: number | null | undefined): "UP" | "DOWN" | "FLAT" | null => {
  if (typeof score !== "number" || !Number.isFinite(score)) return null;
  if (score >= 2) return "UP";
  if (score <= -2) return "DOWN";
  return "FLAT";
};

const normaliseTrend = (value: string | null | undefined): "UP" | "DOWN" | "FLAT" | null => {
  const text = String(value ?? "").toUpperCase();
  if (!text) return null;
  if (text.includes("UP") || text.includes("BULL") || text === "LONG") return "UP";
  if (text.includes("DOWN") || text.includes("BEAR") || text === "SHORT") return "DOWN";
  return "FLAT";
};

const toneOf = (trend: "UP" | "DOWN" | "FLAT" | null): StageTone =>
  trend === "UP" ? "up" : trend === "DOWN" ? "down" : trend === "FLAT" ? "flat" : "neutral";

const symbolKey = (value: string | null | undefined) => String(value ?? "").replace(/[^a-z0-9]/gi, "").toUpperCase();

export const buildAnalysisStages = ({
  language,
  scope,
  symbol,
  accepted,
  progress,
  outcome,
}: {
  language: AppLanguage;
  scope: "instrument" | "scan";
  symbol?: string | null;
  accepted: boolean;
  progress: AnalysisProgress | null;
  outcome: AnalysisOutcome;
}): AnalysisStage[] => {
  const tx = analysisTexts(language);
  const trendWord = (trend: "UP" | "DOWN" | "FLAT" | null) =>
    trend === "UP" ? `↑ ${tx.up}` : trend === "DOWN" ? `↓ ${tx.down}` : trend === "FLAT" ? `↔ ${tx.flat}` : "—";

  const scan = progress?.scan ?? null;
  const delivered = progress?.delivered ?? [];
  const want = symbolKey(symbol);
  const pick = <T extends { symbol: string }>(list: T[]): T | null =>
    list.find((item) => want && symbolKey(item.symbol) === want) ?? (scope === "instrument" ? list[0] ?? null : null);

  const candidate: AnalysisCandidate | null = scan ? pick(scan.candidates ?? []) : null;
  const analysed: AnalysedInstrument | null = scan ? pick(scan.analysed ?? []) : null;

  const stage = (key: string, done: boolean, detail: string, tone: StageTone = "neutral"): AnalysisStage => ({
    key,
    label: tx.stages[key],
    detail: done ? detail : tx.waiting,
    state: done ? "done" : "pending",
    tone: done ? tone : "neutral",
  });

  const stages: AnalysisStage[] = [stage("request", accepted, tx.accepted, "good")];
  const haveScan = Boolean(scan);

  if (scope === "scan") {
    const list = scan?.analysed ?? [];
    const freshCount = list.filter((item) => item.fresh === true).length;
    const h4 = list.map((item) => bias(item.tf?.["4h"]));
    const m15 = list.map((item) => bias(item.tf?.["15min"]));
    const count = (arr: Array<string | null>, v: string) => arr.filter((x) => x === v).length;
    const candidates = scan?.candidates ?? [];
    const blackout = candidates.filter((item) => item.eventBlackout).length;
    stages.push(stage("data", haveScan, `${tx.instruments(list.length)} · ${tx.fresh(freshCount, list.length)}`, "good"));
    stages.push(stage("htf", haveScan, tx.trendCount(count(h4, "UP"), count(h4, "DOWN"), count(h4, "FLAT"))));
    stages.push(stage("m15", haveScan, `M15: ↑${count(m15, "UP")} ↓${count(m15, "DOWN")} ↔${count(m15, "FLAT")}`));
    stages.push(stage("m5", haveScan, candidates.length ? tx.candidates(candidates.length) : tx.noSetup, candidates.length ? "good" : "flat"));
    stages.push(stage("m1", haveScan, candidates.length ? tx.candidates(candidates.length) : tx.noSetup, candidates.length ? "good" : "flat"));
    stages.push(
      stage(
        "news",
        haveScan,
        blackout ? tx.blackout : (scan?.highImpactSoon ?? 0) > 0 ? tx.events(scan?.highImpactSoon ?? 0) : tx.noEvents,
        blackout || (scan?.highImpactSoon ?? 0) > 0 ? "warn" : "good",
      ),
    );
  } else {
    const tf = analysed?.tf ?? {};
    const freshFrames = Number(analysed?.freshFrames ?? 0);
    const totalFrames = Object.keys(tf).length || 5;
    stages.push(stage("data", haveScan, analysed ? tx.fresh(freshFrames, totalFrames) : tx.instruments(scan?.analysed?.length ?? 0), "good"));

    const d1 = normaliseTrend(candidate?.d1);
    const h4 = candidate ? normaliseTrend(candidate.h4) : bias(tf["4h"]);
    const htfText = candidate && d1 ? `D1 ${trendWord(d1)} · H4 ${trendWord(h4)}` : `H4 ${trendWord(h4)}`;
    stages.push(stage("htf", haveScan, htfText, toneOf(h4)));

    const m15 = candidate ? normaliseTrend(candidate.htfTrend) : bias(tf["15min"]);
    const corr = String(candidate?.m15Correction ?? "").toUpperCase();
    const corrText = corr === "ENDED" ? ` · ${tx.correctionEnded}` : corr === "IN_PROGRESS" ? ` · ${tx.correctionRunning}` : "";
    stages.push(stage("m15", haveScan, `${trendWord(m15)}${corrText}`, toneOf(m15)));

    const setup = String(candidate?.setupType ?? "").toUpperCase();
    stages.push(
      stage(
        "m5",
        haveScan,
        candidate ? tx.setup[setup] ?? (setup.toLowerCase().replace(/_/g, " ") || "—") : `${trendWord(bias(tf["5min"]))} · ${tx.noSetup}`,
        candidate ? "good" : "flat",
      ),
    );

    const direction = normaliseTrend(candidate?.direction);
    const order = String(candidate?.orderType ?? "").toUpperCase();
    stages.push(
      stage(
        "m1",
        haveScan,
        candidate
          ? `${direction === "UP" ? tx.long : direction === "DOWN" ? tx.short : "—"} · ${order === "LIMIT" ? tx.limit : tx.market}`
          : `${trendWord(bias(tf["1min"]))} · ${tx.noSetup}`,
        candidate ? toneOf(direction) : "flat",
      ),
    );

    const events = Number(scan?.highImpactSoon ?? 0);
    stages.push(
      stage(
        "news",
        haveScan,
        candidate?.eventBlackout ? tx.blackout : events > 0 ? tx.events(events) : tx.noEvents,
        candidate?.eventBlackout || events > 0 ? "warn" : "good",
      ),
    );
  }

  // Final rung: a signal stored for this request, or a finished scan with
  // no candidate at all. Otherwise it stays "final check" while running.
  const finalDone = delivered.length > 0 || outcome === "signal" || outcome === "no_setup";
  let finalText = tx.finalCheck;
  let finalTone: StageTone = "neutral";
  if (delivered.length > 0) {
    finalText = tx.signalReady(
      delivered
        .slice(0, 3)
        .map((item) => `${item.symbol} ${normaliseTrend(item.direction) === "UP" ? tx.long : tx.short}`)
        .join(", ") + (delivered.length > 3 ? ` +${delivered.length - 3}` : ""),
    );
    finalTone = delivered.length === 1 ? toneOf(normaliseTrend(delivered[0].direction)) : "good";
  } else if (outcome === "signal") {
    finalText = tx.outcomeSignal;
    finalTone = "good";
  } else if (outcome === "no_setup") {
    finalText = tx.noEntry;
    finalTone = "flat";
  }
  stages.push({
    key: "final",
    label: tx.stages.final,
    detail: finalDone ? finalText : haveScan ? tx.finalCheck : tx.waiting,
    state: finalDone ? "done" : "pending",
    tone: finalDone ? finalTone : "neutral",
  });

  // While running, the first unfinished stage is the active one.
  if (outcome === "running") {
    const first = stages.find((item) => item.state === "pending");
    if (first) first.state = "active";
  }
  return stages;
};
