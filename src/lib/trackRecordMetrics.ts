// Pure calculations for the public NICS AI Trader track record.
//
// Input is the `trades` list returned by the [10 PUBLIC STATS] endpoint:
// every closed signal that cleared the quality gate (WEAK signals are
// excluded server-side, owner's rule of 2026-10-28), oldest first, as
// [closedAtEpochSeconds, symbol, assetClass, realizedR].
//
// Everything here is computed from those real rows; nothing is estimated.

export type TradeRow = [number, string, string, number];

export type Trade = {
  closedAt: number; // ms
  symbol: string;
  assetClass: string;
  r: number;
};

export const toTrades = (rows: TradeRow[] | undefined | null): Trade[] =>
  (rows ?? [])
    .filter((row) => Array.isArray(row) && row.length >= 4)
    .map(([ts, symbol, assetClass, r]) => ({
      closedAt: Number(ts) * 1000,
      symbol: String(symbol ?? ""),
      assetClass: String(assetClass ?? ""),
      r: Number(r) || 0,
    }))
    .sort((a, b) => a.closedAt - b.closedAt);

// ---------------------------------------------------------------- periods

export const PERIOD_KEYS = ["today", "yesterday", "7d", "30d", "thisMonth", "prevMonth", "90d", "12m", "all"] as const;
export type PeriodKey = (typeof PERIOD_KEYS)[number];

// Calendar periods (today, yesterday, months) follow Sofia time, the same
// clock as the daily and weekly reports in the channels.
const TIME_ZONE = "Europe/Sofia";
const dayFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});
const dayKey = (ms: number) => dayFormatter.format(new Date(ms)); // YYYY-MM-DD

const shiftDay = (key: string, days: number) => {
  const [y, m, d] = key.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d + days));
  return date.toISOString().slice(0, 10);
};
const shiftMonth = (monthKey: string, months: number) => {
  const [y, m] = monthKey.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1 + months, 1));
  return date.toISOString().slice(0, 7);
};

const DAY_MS = 24 * 60 * 60 * 1000;

export const filterByPeriod = (trades: Trade[], period: PeriodKey, now = Date.now()): Trade[] => {
  const today = dayKey(now);
  switch (period) {
    case "today":
      return trades.filter((t) => dayKey(t.closedAt) === today);
    case "yesterday": {
      const yesterday = shiftDay(today, -1);
      return trades.filter((t) => dayKey(t.closedAt) === yesterday);
    }
    case "thisMonth": {
      const month = today.slice(0, 7);
      return trades.filter((t) => dayKey(t.closedAt).slice(0, 7) === month);
    }
    case "prevMonth": {
      const month = shiftMonth(today.slice(0, 7), -1);
      return trades.filter((t) => dayKey(t.closedAt).slice(0, 7) === month);
    }
    case "7d":
      return trades.filter((t) => t.closedAt >= now - 7 * DAY_MS);
    case "30d":
      return trades.filter((t) => t.closedAt >= now - 30 * DAY_MS);
    case "90d":
      return trades.filter((t) => t.closedAt >= now - 90 * DAY_MS);
    case "12m":
      return trades.filter((t) => t.closedAt >= now - 365 * DAY_MS);
    default:
      return trades;
  }
};

// ---------------------------------------------------------------- markets

export const MARKET_KEYS = ["all", "metals", "energy", "indices", "stocks", "forex", "crypto"] as const;
export type MarketKey = (typeof MARKET_KEYS)[number];

// asset_class comes from the signals table (commodity, forex, crypto, stock,
// index). Commodities are split into metals (gold, silver) and energy (oil)
// by symbol, so a new commodity symbol lands in "energy" until it is named
// here; it is never dropped from "all".
const isMetal = (symbol: string) => /^(XAU|XAG|XPT|XPD)/i.test(symbol);

export const marketOf = (trade: Trade): MarketKey => {
  switch (trade.assetClass.toLowerCase()) {
    case "commodity":
    case "commodities":
    case "metal":
    case "metals":
      return isMetal(trade.symbol) ? "metals" : "energy";
    case "index":
    case "indices":
      return "indices";
    case "stock":
    case "stocks":
      return "stocks";
    case "forex":
    case "fx":
      return "forex";
    case "crypto":
      return "crypto";
    default:
      return isMetal(trade.symbol) ? "metals" : "all";
  }
};

export const filterByMarket = (trades: Trade[], market: MarketKey, symbol?: string | null): Trade[] => {
  let out = market === "all" ? trades : trades.filter((t) => marketOf(t) === market);
  if (symbol) out = out.filter((t) => t.symbol === symbol);
  return out;
};

// ---------------------------------------------------------------- metrics

export type Metrics = {
  signals: number;
  wins: number;
  losses: number;
  breakeven: number;
  winRatePercent: number;
  totalR: number;
  expectancyR: number;
  grossWinR: number;
  grossLossR: number; // positive number
  profitFactor: number | null; // null = no losing trades
  averageWinR: number;
  averageLossR: number; // negative number
  maxDrawdownR: number; // positive number, peak-to-trough of cumulative R
  recoveryFactor: number | null; // null = no drawdown
  maxConsecutiveLosses: number;
};

export const computeMetrics = (trades: Trade[]): Metrics => {
  let wins = 0;
  let losses = 0;
  let breakeven = 0;
  let grossWin = 0;
  let grossLoss = 0;
  let equity = 0;
  let peak = 0;
  let maxDrawdown = 0;
  let streak = 0;
  let maxStreak = 0;

  for (const t of trades) {
    if (t.r > 0) {
      wins += 1;
      grossWin += t.r;
      streak = 0;
    } else if (t.r < 0) {
      losses += 1;
      grossLoss += -t.r;
      streak += 1;
      maxStreak = Math.max(maxStreak, streak);
    } else {
      // A breakeven exit is not a loss and ends a losing streak.
      breakeven += 1;
      streak = 0;
    }
    equity += t.r;
    peak = Math.max(peak, equity);
    maxDrawdown = Math.max(maxDrawdown, peak - equity);
  }

  const signals = trades.length;
  const totalR = grossWin - grossLoss;
  return {
    signals,
    wins,
    losses,
    breakeven,
    winRatePercent: signals ? (100 * wins) / signals : 0,
    totalR,
    expectancyR: signals ? totalR / signals : 0,
    grossWinR: grossWin,
    grossLossR: grossLoss,
    profitFactor: grossLoss > 0 ? grossWin / grossLoss : null,
    averageWinR: wins ? grossWin / wins : 0,
    averageLossR: losses ? -grossLoss / losses : 0,
    maxDrawdownR: maxDrawdown,
    recoveryFactor: maxDrawdown > 0 ? totalR / maxDrawdown : null,
    maxConsecutiveLosses: maxStreak,
  };
};

// ---------------------------------------------------------------- curves

export type CurvePoint = {
  closedAt: number;
  equity: number;
  drawdown: number; // <= 0, distance below the running peak
};

// One point per closed signal, starting from 0 at the beginning of the
// selected period, so losing stretches are visible, not only the end result.
export const buildCurve = (trades: Trade[]): CurvePoint[] => {
  let equity = 0;
  let peak = 0;
  const points: CurvePoint[] = [];
  if (trades.length) points.push({ closedAt: trades[0].closedAt, equity: 0, drawdown: 0 });
  for (const t of trades) {
    equity += t.r;
    peak = Math.max(peak, equity);
    points.push({
      closedAt: t.closedAt,
      equity: Math.round(equity * 100) / 100,
      drawdown: Math.round((equity - peak) * 100) / 100,
    });
  }
  return points;
};

// ---------------------------------------------------------------- instruments

export type InstrumentRow = Metrics & { symbol: string; market: MarketKey };

export const byInstrument = (trades: Trade[]): InstrumentRow[] => {
  const groups = new Map<string, Trade[]>();
  for (const t of trades) {
    const list = groups.get(t.symbol);
    if (list) list.push(t);
    else groups.set(t.symbol, [t]);
  }
  return [...groups.entries()]
    .map(([symbol, list]) => ({ symbol, market: marketOf(list[0]), ...computeMetrics(list) }))
    .sort((a, b) => b.totalR - a.totalR);
};
