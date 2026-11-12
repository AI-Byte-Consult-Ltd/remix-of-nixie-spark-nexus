import type { JournalSignal, JournalTrade } from "./journalApi";

/*
 * Pure functions behind the personal trade journal: totals, equity curve,
 * breakdowns, rule-based mistake audit and the weekly review. Everything is
 * computed in the browser from the user's own trades; times are the broker
 * times stored with the trade (MT5 server time), shown as they are.
 */

export const netResult = (t: JournalTrade) =>
  Number(t.profit ?? 0) + Number(t.commission ?? 0) + Number(t.swap ?? 0);

const time = (value?: string | null) => {
  if (!value) return NaN;
  const ms = Date.parse(value);
  return Number.isNaN(ms) ? NaN : ms;
};

export const tradeTime = (t: JournalTrade) => {
  const c = time(t.closeTime);
  return Number.isNaN(c) ? time(t.openTime) : c;
};

export const isClosed = (t: JournalTrade) =>
  t.profit !== null && t.profit !== undefined && !Number.isNaN(Number(t.profit));

/** Result in R when a stop loss is known: (exit - entry) / |entry - stop|, signed by side. */
export const tradeR = (t: JournalTrade): number | null => {
  const entry = Number(t.openPrice);
  const exit = Number(t.closePrice);
  const stop = Number(t.stopLoss);
  if (!entry || !exit || !stop) return null;
  const risk = Math.abs(entry - stop);
  if (!risk) return null;
  const move = t.side === "BUY" ? exit - entry : entry - exit;
  return move / risk;
};

export interface JournalSummary {
  trades: number;
  wins: number;
  losses: number;
  winRate: number;
  net: number;
  grossProfit: number;
  grossLoss: number;
  profitFactor: number | null;
  avgWin: number;
  avgLoss: number;
  expectancy: number;
  maxDrawdown: number;
  best: number;
  worst: number;
  totalR: number | null;
  currency: string;
}

export const summarize = (trades: JournalTrade[]): JournalSummary => {
  const closed = trades.filter(isClosed).sort((a, b) => tradeTime(a) - tradeTime(b));
  const results = closed.map(netResult);
  const wins = results.filter((r) => r > 0);
  const losses = results.filter((r) => r < 0);
  const grossProfit = wins.reduce((s, r) => s + r, 0);
  const grossLoss = Math.abs(losses.reduce((s, r) => s + r, 0));
  let equity = 0;
  let peak = 0;
  let maxDrawdown = 0;
  for (const r of results) {
    equity += r;
    peak = Math.max(peak, equity);
    maxDrawdown = Math.max(maxDrawdown, peak - equity);
  }
  const rs = closed.map(tradeR).filter((r): r is number => r !== null);
  const currencies = Array.from(new Set(closed.map((t) => t.currency).filter(Boolean)));
  return {
    trades: closed.length,
    wins: wins.length,
    losses: losses.length,
    winRate: closed.length ? (wins.length / closed.length) * 100 : 0,
    net: equity,
    grossProfit,
    grossLoss,
    profitFactor: grossLoss > 0 ? grossProfit / grossLoss : null,
    avgWin: wins.length ? grossProfit / wins.length : 0,
    avgLoss: losses.length ? -grossLoss / losses.length : 0,
    expectancy: closed.length ? equity / closed.length : 0,
    maxDrawdown,
    best: results.length ? Math.max(...results) : 0,
    worst: results.length ? Math.min(...results) : 0,
    totalR: rs.length ? rs.reduce((s, r) => s + r, 0) : null,
    currency: currencies.length === 1 ? String(currencies[0]) : "",
  };
};

export const equityCurve = (trades: JournalTrade[]) => {
  let equity = 0;
  return trades
    .filter(isClosed)
    .sort((a, b) => tradeTime(a) - tradeTime(b))
    .map((t, index) => {
      equity += netResult(t);
      return { n: index + 1, equity: Math.round(equity * 100) / 100, symbol: t.symbol };
    });
};

export interface Bucket {
  key: string;
  trades: number;
  net: number;
  winRate: number;
}

const bucketize = (trades: JournalTrade[], keyOf: (t: JournalTrade) => string | null): Bucket[] => {
  const map = new Map<string, { trades: number; net: number; wins: number }>();
  for (const t of trades.filter(isClosed)) {
    const key = keyOf(t);
    if (key === null) continue;
    const b = map.get(key) ?? { trades: 0, net: 0, wins: 0 };
    b.trades += 1;
    b.net += netResult(t);
    if (netResult(t) > 0) b.wins += 1;
    map.set(key, b);
  }
  return Array.from(map.entries()).map(([key, b]) => ({
    key,
    trades: b.trades,
    net: Math.round(b.net * 100) / 100,
    winRate: b.trades ? (b.wins / b.trades) * 100 : 0,
  }));
};

const openDate = (t: JournalTrade) => {
  const ms = time(t.openTime);
  return Number.isNaN(ms) ? null : new Date(ms);
};

/** Trading session by the opening hour (UTC of the stored time). */
export const sessionOf = (t: JournalTrade) => {
  const d = openDate(t);
  if (!d) return null;
  const h = d.getUTCHours();
  if (h < 7) return "asia";
  if (h < 12) return "london";
  if (h < 17) return "overlap";
  if (h < 21) return "newyork";
  return "late";
};

export const breakdowns = (trades: JournalTrade[]) => ({
  symbol: bucketize(trades, (t) => t.symbol).sort((a, b) => b.net - a.net),
  side: bucketize(trades, (t) => t.side),
  session: bucketize(trades, sessionOf),
  weekday: bucketize(trades, (t) => {
    const d = openDate(t);
    return d ? String(d.getUTCDay()) : null;
  }).sort((a, b) => Number(a.key) - Number(b.key)),
  hour: bucketize(trades, (t) => {
    const d = openDate(t);
    return d ? String(d.getUTCHours()).padStart(2, "0") : null;
  }).sort((a, b) => a.key.localeCompare(b.key)),
});

export type MistakeCode =
  | "noStop"
  | "stopBreached"
  | "earlyExit"
  | "revenge"
  | "oversize"
  | "againstSignal"
  | "holdingLosers";

export interface Mistake {
  code: MistakeCode;
  tradeKey: string;
  symbol: string;
  cost: number;
}

const median = (values: number[]) => {
  if (!values.length) return 0;
  const s = [...values].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

/** Rule-based audit of each closed trade. "cost" = the trade's loss, 0 for a win. */
export const auditTrades = (trades: JournalTrade[], signals: JournalSignal[] = []): Mistake[] => {
  const closed = trades.filter(isClosed).sort((a, b) => time(a.openTime) - time(b.openTime));
  const volumes = closed.map((t) => Number(t.volume)).filter((v) => v > 0);
  const typicalVolume = median(volumes);
  const signalById = new Map(signals.map((s) => [s.signalId, s]));
  const winDurations = closed
    .filter((t) => netResult(t) > 0)
    .map((t) => time(t.closeTime) - time(t.openTime))
    .filter((d) => d > 0);
  const typicalWinHold = median(winDurations);
  const out: Mistake[] = [];
  const push = (code: MistakeCode, t: JournalTrade) =>
    out.push({ code, tradeKey: t.tradeKey, symbol: t.symbol, cost: Math.min(0, netResult(t)) });

  closed.forEach((t, index) => {
    const result = netResult(t);
    const stop = Number(t.stopLoss);
    const r = tradeR(t);
    if (!stop) push("noStop", t);
    // Lost more than the planned stop: the stop was moved away or not set in the terminal.
    if (r !== null && r < -1.15) push("stopBreached", t);
    // A winner closed before even half of the take-profit distance.
    const tp = Number(t.takeProfit);
    const entry = Number(t.openPrice);
    const exit = Number(t.closePrice);
    if (result > 0 && tp && entry && exit) {
      const target = Math.abs(tp - entry);
      const got = t.side === "BUY" ? exit - entry : entry - exit;
      if (target > 0 && got < target * 0.5) push("earlyExit", t);
    }
    // Re-entered within 30 minutes of a losing trade with a bigger size.
    const previous = closed[index - 1];
    if (previous && netResult(previous) < 0) {
      const gap = time(t.openTime) - time(previous.closeTime);
      if (gap >= 0 && gap <= 30 * 60 * 1000 && Number(t.volume) > Number(previous.volume) * 1.2) push("revenge", t);
    }
    if (typicalVolume > 0 && Number(t.volume) > typicalVolume * 2 && volumes.length >= 5) push("oversize", t);
    const signal = t.signalId ? signalById.get(t.signalId) : undefined;
    if (signal) {
      const signalSide = signal.direction === "LONG" ? "BUY" : signal.direction === "SHORT" ? "SELL" : null;
      if (signalSide && signalSide !== t.side) push("againstSignal", t);
    }
    // Losers held three times longer than a typical winner.
    const held = time(t.closeTime) - time(t.openTime);
    if (result < 0 && typicalWinHold > 0 && held > typicalWinHold * 3 && winDurations.length >= 3) push("holdingLosers", t);
  });
  return out;
};

export interface MistakeStat {
  code: MistakeCode;
  count: number;
  cost: number;
}

export const mistakeStats = (mistakes: Mistake[]): MistakeStat[] => {
  const map = new Map<MistakeCode, MistakeStat>();
  for (const m of mistakes) {
    const s = map.get(m.code) ?? { code: m.code, count: 0, cost: 0 };
    s.count += 1;
    s.cost += m.cost;
    map.set(m.code, s);
  }
  return Array.from(map.values()).sort((a, b) => a.cost - b.cost || b.count - a.count);
};

export type ReviewPoint =
  | { kind: "bestSymbol" | "worstSymbol" | "bestSession" | "worstSession"; key: string; net: number }
  | { kind: "winRate"; value: number }
  | { kind: "profitFactor"; value: number }
  | { kind: "riskReward"; value: number }
  | { kind: "discipline" }
  | { kind: "mistake"; code: MistakeCode; count: number; cost: number }
  | { kind: "noTrades" };

/** Weekly review: up to 3 strengths and 3 things to fix for trades closed in the last 7 days. */
export const weeklyReview = (trades: JournalTrade[], signals: JournalSignal[], now = Date.now()) => {
  const week = trades.filter((t) => isClosed(t) && now - tradeTime(t) <= 7 * 24 * 3600 * 1000);
  if (!week.length) return { trades: 0, net: 0, strengths: [] as ReviewPoint[], fixes: [{ kind: "noTrades" } as ReviewPoint] };
  const s = summarize(week);
  const b = breakdowns(week);
  const mistakes = mistakeStats(auditTrades(week, signals));
  const strengths: ReviewPoint[] = [];
  const fixes: ReviewPoint[] = [];
  const bestSymbol = b.symbol[0];
  const worstSymbol = b.symbol[b.symbol.length - 1];
  const sessions = [...b.session].sort((x, y) => y.net - x.net);
  if (bestSymbol && bestSymbol.net > 0) strengths.push({ kind: "bestSymbol", key: bestSymbol.key, net: bestSymbol.net });
  if (s.profitFactor !== null && s.profitFactor >= 1.2) strengths.push({ kind: "profitFactor", value: s.profitFactor });
  if (s.winRate >= 55) strengths.push({ kind: "winRate", value: s.winRate });
  if (s.avgLoss < 0 && s.avgWin / Math.abs(s.avgLoss) >= 1.3) strengths.push({ kind: "riskReward", value: s.avgWin / Math.abs(s.avgLoss) });
  if (sessions[0] && sessions[0].net > 0) strengths.push({ kind: "bestSession", key: sessions[0].key, net: sessions[0].net });
  if (!mistakes.length) strengths.push({ kind: "discipline" });
  for (const m of mistakes.slice(0, 2)) fixes.push({ kind: "mistake", code: m.code, count: m.count, cost: m.cost });
  if (worstSymbol && worstSymbol.net < 0 && worstSymbol.key !== bestSymbol?.key) fixes.push({ kind: "worstSymbol", key: worstSymbol.key, net: worstSymbol.net });
  const worstSession = sessions[sessions.length - 1];
  if (fixes.length < 3 && worstSession && worstSession.net < 0) fixes.push({ kind: "worstSession", key: worstSession.key, net: worstSession.net });
  if (fixes.length < 3 && s.winRate < 40) fixes.push({ kind: "winRate", value: s.winRate });
  return { trades: s.trades, net: s.net, strengths: strengths.slice(0, 3), fixes: fixes.slice(0, 3) };
};

/** Accepted NICS signals: how many, total R, and how many went with the D1/H4 trend. */
export const signalSummary = (signals: JournalSignal[]) => {
  const closed = signals.filter((s) => s.closedAt && s.realizedR !== null && s.realizedR !== undefined);
  const totalR = closed.reduce((sum, s) => sum + Number(s.realizedR ?? 0), 0);
  const wins = closed.filter((s) => Number(s.realizedR) > 0).length;
  return {
    accepted: signals.length,
    closed: closed.length,
    open: signals.length - closed.length,
    totalR,
    winRate: closed.length ? (wins / closed.length) * 100 : 0,
  };
};
