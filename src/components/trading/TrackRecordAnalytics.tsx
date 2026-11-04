import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { cn } from "@/lib/utils";
import {
  MARKET_KEYS,
  PERIOD_KEYS,
  buildCurve,
  byInstrument,
  computeMetrics,
  filterByMarket,
  filterByPeriod,
  marketOf,
  toTrades,
  type InstrumentRow,
  type MarketKey,
  type PeriodKey,
  type TradeRow,
} from "@/lib/trackRecordMetrics";
import { trackRecordText } from "./trackRecordI18n";

// Full public track record: period and market filters, ten key metrics,
// equity curve, drawdown chart and a per-instrument table. Built entirely
// from the real closed-signal list of the public stats API.
//
// variant "site" follows the site theme (light and dark); "app" is the dark
// Telegram Mini App / web cabinet look.

type Props = {
  trades: TradeRow[];
  language?: string;
  variant?: "site" | "app";
  defaultPeriod?: PeriodKey;
};

const signed = (value: number, digits = 2) => `${value > 0 ? "+" : ""}${value.toFixed(digits)}`;
const toneOf = (value: number) => (value > 0 ? "pos" : value < 0 ? "neg" : "flat");

const POS = "#10b981";
const NEG = "#f43f5e";

const TrackRecordAnalytics = ({ trades: rows, language, variant = "site", defaultPeriod = "all" }: Props) => {
  const text = trackRecordText(language);
  const app = variant === "app";
  const [period, setPeriod] = useState<PeriodKey>(defaultPeriod);
  const [market, setMarket] = useState<MarketKey>("all");
  const [symbol, setSymbol] = useState<string>("");

  const trades = useMemo(() => toTrades(rows), [rows]);
  const availableMarkets = useMemo(() => {
    const present = new Set(trades.map(marketOf));
    return MARKET_KEYS.filter((key) => key === "all" || present.has(key));
  }, [trades]);

  const inPeriod = useMemo(() => filterByPeriod(trades, period), [trades, period]);
  const inMarket = useMemo(() => filterByMarket(inPeriod, market), [inPeriod, market]);
  const symbols = useMemo(
    () => [...new Set(filterByMarket(trades, market).map((t) => t.symbol))].sort(),
    [trades, market],
  );
  const selected = useMemo(() => (symbol ? inMarket.filter((t) => t.symbol === symbol) : inMarket), [inMarket, symbol]);

  const metrics = useMemo(() => computeMetrics(selected), [selected]);
  const curve = useMemo(() => buildCurve(selected), [selected]);
  const instruments = useMemo(() => byInstrument(inMarket), [inMarket]);
  const winners = instruments.filter((row) => row.totalR >= 0);
  const losers = instruments.filter((row) => row.totalR < 0);

  const dateFormat = useMemo(() => {
    const short = period === "today" || period === "yesterday";
    return new Intl.DateTimeFormat(language || "en", {
      timeZone: "Europe/Sofia",
      ...(short ? { hour: "2-digit", minute: "2-digit" } : { day: "numeric", month: "short" }),
      ...(period === "all" || period === "12m" ? { year: "2-digit" } : {}),
    });
  }, [language, period]);

  const ui = {
    chip: (active: boolean) =>
      cn(
        "px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors border whitespace-nowrap",
        app
          ? active
            ? "bg-amber-300 text-slate-950 border-amber-300"
            : "border-white/10 text-slate-400 hover:border-white/25"
          : active
            ? "bg-primary text-primary-foreground border-primary"
            : "bg-transparent text-muted-foreground border-border hover:border-primary/40",
      ),
    card: app
      ? "rounded-2xl border border-white/10 bg-white/[0.045] text-white"
      : "rounded-xl border border-border/50 bg-card",
    muted: app ? "text-slate-500" : "text-muted-foreground",
    strong: app ? "text-white" : "text-foreground",
    tone: (value: number) =>
      toneOf(value) === "pos"
        ? "text-emerald-500"
        : toneOf(value) === "neg"
          ? "text-rose-500"
          : app
            ? "text-white"
            : "text-foreground",
    grid: app ? "rgba(255,255,255,0.07)" : "hsl(var(--border))",
    axis: app ? "#64748b" : "hsl(var(--muted-foreground))",
    tooltipBg: app ? "#10141d" : "hsl(var(--card))",
    tooltipBorder: app ? "rgba(255,255,255,0.12)" : "hsl(var(--border))",
    select: app
      ? "rounded-full border border-white/10 bg-transparent px-3 py-1.5 text-xs text-slate-300"
      : "rounded-full border border-border bg-background px-3 py-1.5 text-xs sm:text-sm text-foreground",
  };

  const tiles: { label: string; value: string; hint?: string; tone?: number }[] = [
    { label: text.signals, value: String(metrics.signals) },
    { label: text.winRate, value: `${metrics.winRatePercent.toFixed(1)}%` },
    { label: text.totalR, value: `${signed(metrics.totalR, 1)}R`, tone: metrics.totalR },
    { label: text.expectancy, value: `${signed(metrics.expectancyR)}R`, tone: metrics.expectancyR },
    {
      label: text.profitFactor,
      value: metrics.profitFactor === null ? (metrics.wins ? "∞" : "—") : metrics.profitFactor.toFixed(2),
      hint: metrics.profitFactor === null && metrics.wins ? text.noLosses : text.hintProfitFactor,
      tone: metrics.profitFactor === null ? metrics.wins : metrics.profitFactor - 1,
    },
    {
      label: `${text.avgWin} / ${text.avgLoss}`,
      value: `${signed(metrics.averageWinR)}R / ${signed(metrics.averageLossR)}R`,
      hint: text.hintAvg,
    },
    {
      label: text.maxDrawdown,
      value: metrics.maxDrawdownR > 0 ? `−${metrics.maxDrawdownR.toFixed(2)}R` : "0R",
      hint: text.hintMaxDrawdown,
      tone: -metrics.maxDrawdownR,
    },
    {
      label: text.recoveryFactor,
      value: metrics.recoveryFactor === null ? "—" : metrics.recoveryFactor.toFixed(2),
      hint: text.hintRecovery,
      tone: metrics.recoveryFactor ?? 0,
    },
    { label: text.lossStreak, value: String(metrics.maxConsecutiveLosses), hint: text.hintStreak },
  ];

  const chartTooltip = (valueLabel: string) => (
    <Tooltip
      cursor={{ stroke: ui.axis, strokeDasharray: "3 3" }}
      contentStyle={{
        background: ui.tooltipBg,
        border: `1px solid ${ui.tooltipBorder}`,
        borderRadius: 12,
        fontSize: 12,
      }}
      labelFormatter={(value) => dateFormat.format(new Date(Number(value)))}
      formatter={(value: number) => [`${signed(Number(value))}R`, valueLabel]}
    />
  );

  // Explicit, evenly spaced date ticks: letting the chart pick ticks on a time
  // axis with hundreds of points piles the labels on top of each other.
  const xTicks = useMemo(() => {
    if (curve.length < 2) return curve.map((point) => point.closedAt);
    const first = curve[0].closedAt;
    const last = curve[curve.length - 1].closedAt;
    const count = typeof window !== "undefined" && window.innerWidth < 640 ? 3 : 5;
    return Array.from({ length: count }, (_, i) =>
      Math.round(first + (last - first) * (0.06 + (0.88 * i) / (count - 1))),
    );
  }, [curve]);

  const xAxis = (
    <XAxis
      dataKey="closedAt"
      type="number"
      scale="time"
      domain={["dataMin", "dataMax"]}
      tickFormatter={(value) => dateFormat.format(new Date(Number(value)))}
      tick={{ fill: ui.axis, fontSize: 11 }}
      axisLine={false}
      tickLine={false}
      ticks={xTicks}
      interval={0}
    />
  );

  const instrumentTable = (title: string, list: InstrumentRow[]) =>
    list.length ? (
      <div>
        <p className={cn("mb-2 text-xs font-medium uppercase tracking-wide", ui.muted)}>{title}</p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[460px] text-sm">
            <thead>
              <tr className={cn("text-left text-xs", ui.muted)}>
                <th className="py-2 pr-3 font-medium">{text.instrument}</th>
                <th className="py-2 pr-3 text-right font-medium">{text.signals}</th>
                <th className="py-2 pr-3 text-right font-medium">{text.winRate}</th>
                <th className="py-2 pr-3 text-right font-medium">{text.totalR}</th>
                <th className="py-2 pr-3 text-right font-medium">{text.expectancy}</th>
                <th className="py-2 text-right font-medium">{text.profitFactor}</th>
              </tr>
            </thead>
            <tbody>
              {list.map((row) => (
                <tr
                  key={row.symbol}
                  onClick={() => setSymbol(symbol === row.symbol ? "" : row.symbol)}
                  className={cn(
                    "cursor-pointer border-t",
                    app ? "border-white/5 hover:bg-white/[0.03]" : "border-border/40 hover:bg-muted/40",
                    symbol === row.symbol && (app ? "bg-white/[0.06]" : "bg-muted/60"),
                  )}
                >
                  <td className={cn("py-2 pr-3 font-medium", ui.strong)}>
                    {row.symbol}
                    <span className={cn("ml-2 text-[11px] font-normal", ui.muted)}>{text.markets[row.market]}</span>
                  </td>
                  <td className="py-2 pr-3 text-right tabular-nums">{row.signals}</td>
                  <td className="py-2 pr-3 text-right tabular-nums">{row.winRatePercent.toFixed(0)}%</td>
                  <td className={cn("py-2 pr-3 text-right font-semibold tabular-nums", ui.tone(row.totalR))}>
                    {signed(row.totalR, 1)}R
                  </td>
                  <td className={cn("py-2 pr-3 text-right tabular-nums", ui.tone(row.expectancyR))}>
                    {signed(row.expectancyR)}R
                  </td>
                  <td className="py-2 text-right tabular-nums">
                    {row.profitFactor === null ? (row.wins ? "∞" : "—") : row.profitFactor.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    ) : null;

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="space-y-3">
        <div className="flex flex-wrap justify-center gap-2">
          {PERIOD_KEYS.map((key) => (
            <button key={key} type="button" onClick={() => setPeriod(key)} className={ui.chip(period === key)}>
              {text.periods[key]}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {availableMarkets.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                setMarket(key);
                setSymbol("");
              }}
              className={ui.chip(market === key)}
            >
              {text.markets[key]}
            </button>
          ))}
          <select
            aria-label={text.instrument}
            value={symbol}
            onChange={(event) => setSymbol(event.target.value)}
            className={ui.select}
          >
            <option value="">{text.allInstruments}</option>
            {symbols.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {tiles.map((tile) => (
          <div key={tile.label} className={cn(ui.card, "p-4 text-center")}>
            <div
              className={cn(
                "text-lg font-semibold tabular-nums sm:text-xl",
                tile.tone === undefined ? ui.strong : ui.tone(tile.tone),
              )}
            >
              {tile.value}
            </div>
            <div className={cn("mt-1 text-xs", ui.muted)}>{tile.label}</div>
            {tile.hint && <div className={cn("mt-1 text-[10px] leading-tight opacity-80", ui.muted)}>{tile.hint}</div>}
          </div>
        ))}
      </div>

      {selected.length === 0 ? (
        <div className={cn(ui.card, "p-8 text-center text-sm", ui.muted)}>{text.noData}</div>
      ) : (
        <>
          {/* Equity curve */}
          <div className={cn(ui.card, "p-4 sm:p-5")}>
            <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
              <p className={cn("font-medium", ui.strong)}>
                {text.equityTitle}
                {symbol ? ` · ${symbol}` : market !== "all" ? ` · ${text.markets[market]}` : ""}
              </p>
              <p className={cn("text-sm font-semibold tabular-nums", ui.tone(metrics.totalR))}>
                {signed(metrics.totalR, 1)}R
              </p>
            </div>
            <div className="h-56 w-full sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={curve} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                  <defs>
                    <linearGradient id={`eq-${variant}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={POS} stopOpacity={0.35} />
                      <stop offset="100%" stopColor={POS} stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke={ui.grid} vertical={false} />
                  {xAxis}
                  <YAxis tick={{ fill: ui.axis, fontSize: 11 }} axisLine={false} tickLine={false} width={48} />
                  <ReferenceLine y={0} stroke={ui.axis} strokeOpacity={0.5} />
                  {chartTooltip(text.totalR)}
                  <Area
                    type="monotone"
                    dataKey="equity"
                    stroke={POS}
                    strokeWidth={2}
                    fill={`url(#eq-${variant})`}
                    isAnimationActive={false}
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className={cn("mt-2 text-xs", ui.muted)}>{text.equityNote}</p>
          </div>

          {/* Drawdown */}
          <div className={cn(ui.card, "p-4 sm:p-5")}>
            <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
              <p className={cn("font-medium", ui.strong)}>{text.drawdownTitle}</p>
              <p className={cn("text-sm font-semibold tabular-nums", ui.tone(-metrics.maxDrawdownR))}>
                {text.maxDrawdown}: {metrics.maxDrawdownR > 0 ? `−${metrics.maxDrawdownR.toFixed(2)}R` : "0R"}
              </p>
            </div>
            <div className="h-40 w-full sm:h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={curve} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                  <CartesianGrid stroke={ui.grid} vertical={false} />
                  {xAxis}
                  <YAxis tick={{ fill: ui.axis, fontSize: 11 }} axisLine={false} tickLine={false} width={48} />
                  {chartTooltip(text.drawdownTitle)}
                  <Area
                    type="stepAfter"
                    dataKey="drawdown"
                    stroke={NEG}
                    strokeWidth={1.5}
                    fill={NEG}
                    fillOpacity={0.25}
                    isAnimationActive={false}
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className={cn("mt-2 text-xs", ui.muted)}>{text.drawdownNote}</p>
          </div>

          {/* By instrument */}
          <div className={cn(ui.card, "space-y-5 p-4 sm:p-5")}>
            <p className={cn("font-medium", ui.strong)}>{text.byInstrument}</p>
            {instrumentTable(text.inProfit, winners)}
            {instrumentTable(text.inLoss, losers)}
          </div>
        </>
      )}

      <p className={cn("text-center text-xs", ui.muted)}>{text.footnote}</p>
    </div>
  );
};

export default TrackRecordAnalytics;
