import { ChangeEvent, FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  BookOpenCheck,
  Check,
  Copy,
  Download,
  KeyRound,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  ThumbsUp,
  Trash2,
  Upload,
  Wrench,
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { cn } from "@/lib/utils";
import type { AppLanguage } from "../types";
import {
  createJournalKey,
  deleteTrade,
  JournalApiError,
  loadJournal,
  saveTrades,
  type JournalAuth,
  type JournalData,
  type JournalSignal,
  type JournalTrade,
  type NewTrade,
} from "./journalApi";
import {
  auditTrades,
  breakdowns,
  equityCurve,
  isClosed,
  mistakeStats,
  netResult,
  signalSummary,
  summarize,
  tradeR,
  tradeTime,
  weeklyReview,
  type Bucket,
  type ReviewPoint,
} from "./journalAnalysis";
import { fill, journalTexts, type JournalText } from "./journalI18n";
import { parseReportFile } from "./mt5Report";
import { openExternal } from "../externalLinks";
import { isDesktopApp } from "@/features/cabinet/license";

/*
 * Personal trade journal (Alexander, 2026-11-12): the user's own trades from
 * MT5 (expert or report) or typed by hand, with automatic mistake audit,
 * weekly review and the NICS signals they accepted. Same screen in the
 * Windows app, web cabinet and Telegram Mini App; backend n8n [44 TRADER].
 */

type Tab = "overview" | "trades" | "review" | "connect";

const EA_DOWNLOAD_PATH = "/downloads/NICS-Journal.mq5";

const LOCALES: Record<AppLanguage, string> = { ru: "ru-RU", bg: "bg-BG", en: "en-GB", es: "es-ES", pt: "pt-BR" };

const emptyForm = {
  tradeKey: "",
  symbol: "",
  side: "BUY" as "BUY" | "SELL",
  volume: "",
  openTime: "",
  closeTime: "",
  openPrice: "",
  closePrice: "",
  stopLoss: "",
  takeProfit: "",
  profit: "",
  setup: "",
  emotion: "",
  note: "",
  signalId: "",
};
type TradeForm = typeof emptyForm;

const toLocalInput = (iso?: string | null) => (iso ? iso.slice(0, 16) : "");
const fromLocalInput = (value: string) => (value ? `${value}:00Z` : "");
const numOrNull = (value: string) => {
  const n = Number(value.replace(",", "."));
  return value.trim() && Number.isFinite(n) ? n : null;
};

const Card = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={cn("rounded-2xl border border-white/10 bg-white/[0.03] p-4", className)}>{children}</div>
);

const Stat = ({ label, value, tone }: { label: string; value: string; tone?: string }) => (
  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
    <div className="text-[11px] uppercase tracking-wide text-slate-500">{label}</div>
    <div className={cn("mt-1 text-lg font-semibold", tone ?? "text-slate-100")}>{value}</div>
  </div>
);

export const TradeJournal = ({
  language,
  auth,
  onSessionInvalid,
}: {
  language: AppLanguage;
  auth: JournalAuth;
  onSessionInvalid?: () => void;
}) => {
  const t: JournalText = journalTexts[language] ?? journalTexts.en;
  const [tab, setTab] = useState<Tab>("overview");
  const [data, setData] = useState<JournalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<TradeForm>(emptyForm);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [symbolFilter, setSymbolFilter] = useState("all");

  const handleError = useCallback(
    (error: unknown) => {
      const code = error instanceof JournalApiError ? error.code : "";
      if (code.startsWith("SESSION_")) onSessionInvalid?.();
    },
    [onSessionInvalid],
  );

  const reload = useCallback(async () => {
    setLoading(true);
    setFailed(false);
    try {
      setData(await loadJournal(auth));
    } catch (error) {
      handleError(error);
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }, [auth, handleError]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const trades = useMemo(
    () => [...(data?.trades ?? [])].sort((a, b) => (tradeTime(b) || 0) - (tradeTime(a) || 0)),
    [data],
  );
  const signals = data?.signals ?? [];
  const summary = useMemo(() => summarize(trades), [trades]);
  const curve = useMemo(() => equityCurve(trades), [trades]);
  const buckets = useMemo(() => breakdowns(trades), [trades]);
  const mistakes = useMemo(() => mistakeStats(auditTrades(trades, signals)), [trades, signals]);
  const week = useMemo(() => weeklyReview(trades, signals), [trades, signals]);
  const sigSummary = useMemo(() => signalSummary(signals), [signals]);

  const money = (value: number) => {
    const text = value.toLocaleString(LOCALES[language], { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const signed = value > 0 ? `+${text}` : text;
    return summary.currency ? `${signed} ${summary.currency}` : signed;
  };
  const formatDate = (value?: string | null) => {
    if (!value) return "—";
    const ms = Date.parse(value);
    if (Number.isNaN(ms)) return "—";
    // Broker time is stored as UTC-labelled; show it as is.
    return new Date(ms).toLocaleString(LOCALES[language], {
      timeZone: "UTC",
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  const sessionName = (key: string) => t.sessions[key] ?? key;
  const reviewText = (point: ReviewPoint) => {
    const template = t.review[point.kind] ?? "";
    if (point.kind === "mistake")
      return fill(template, { label: t.mistakes[point.code], count: point.count, cost: money(point.cost) });
    if (point.kind === "bestSession" || point.kind === "worstSession")
      return fill(template, { key: sessionName(point.key), net: money(point.net) });
    if (point.kind === "bestSymbol" || point.kind === "worstSymbol")
      return fill(template, { key: point.key, net: money(point.net) });
    if (point.kind === "winRate") return fill(template, { value: point.value.toFixed(0) });
    if (point.kind === "profitFactor" || point.kind === "riskReward") return fill(template, { value: point.value.toFixed(2) });
    return template;
  };

  const openForm = (trade?: JournalTrade) => {
    setMessage(null);
    setForm(
      trade
        ? {
            tradeKey: trade.tradeKey,
            symbol: trade.symbol,
            side: trade.side,
            volume: trade.volume?.toString() ?? "",
            openTime: toLocalInput(trade.openTime),
            closeTime: toLocalInput(trade.closeTime),
            openPrice: trade.openPrice?.toString() ?? "",
            closePrice: trade.closePrice?.toString() ?? "",
            stopLoss: trade.stopLoss?.toString() ?? "",
            takeProfit: trade.takeProfit?.toString() ?? "",
            profit: trade.profit?.toString() ?? "",
            setup: trade.setup ?? "",
            emotion: trade.emotion ?? "",
            note: trade.note ?? "",
            signalId: trade.signalId ?? "",
          }
        : { ...emptyForm, openTime: new Date().toISOString().slice(0, 16), closeTime: new Date().toISOString().slice(0, 16) },
    );
    setFormOpen(true);
    setTab("trades");
  };

  const submitForm = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.symbol.trim() || numOrNull(form.profit) === null) {
      setMessage({ tone: "error", text: t.required });
      return;
    }
    const existing = trades.find((trade) => trade.tradeKey === form.tradeKey);
    const trade: NewTrade = {
      ...(form.tradeKey ? { tradeKey: form.tradeKey } : {}),
      source: existing?.source ?? "manual",
      account: existing?.account ?? "",
      symbol: form.symbol.trim().toUpperCase(),
      side: form.side,
      volume: numOrNull(form.volume),
      openTime: fromLocalInput(form.openTime),
      closeTime: fromLocalInput(form.closeTime),
      openPrice: numOrNull(form.openPrice),
      closePrice: numOrNull(form.closePrice),
      stopLoss: numOrNull(form.stopLoss),
      takeProfit: numOrNull(form.takeProfit),
      profit: numOrNull(form.profit),
      commission: existing?.commission ?? null,
      swap: existing?.swap ?? null,
      currency: existing?.currency ?? summary.currency ?? "",
      setup: form.setup,
      emotion: form.emotion,
      note: form.note,
      signalId: form.signalId,
    };
    setBusy(true);
    try {
      await saveTrades(auth, [trade]);
      setFormOpen(false);
      setForm(emptyForm);
      setMessage({ tone: "ok", text: t.saved });
      await reload();
    } catch (error) {
      handleError(error);
      setMessage({ tone: "error", text: t.saveError });
    } finally {
      setBusy(false);
    }
  };

  const removeTrade = async (trade: JournalTrade) => {
    if (!window.confirm(t.confirmDelete)) return;
    setBusy(true);
    try {
      await deleteTrade(auth, trade.tradeKey);
      await reload();
    } catch (error) {
      handleError(error);
      setMessage({ tone: "error", text: t.saveError });
    } finally {
      setBusy(false);
    }
  };

  const importFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setBusy(true);
    setMessage({ tone: "ok", text: t.importing });
    try {
      const parsed = await parseReportFile(file);
      if (!parsed.length) {
        setMessage({ tone: "error", text: t.importNone });
        return;
      }
      let saved = 0;
      for (let i = 0; i < parsed.length; i += 500) {
        const result = await saveTrades(auth, parsed.slice(i, i + 500));
        saved += result.saved;
      }
      setMessage({ tone: "ok", text: fill(t.imported, { count: saved }) });
      await reload();
    } catch (error) {
      handleError(error);
      setMessage({ tone: "error", text: t.importError });
    } finally {
      setBusy(false);
    }
  };

  const makeKey = async () => {
    setBusy(true);
    try {
      const result = await createJournalKey(auth);
      setData((current) => (current ? { ...current, journalKey: result.journalKey } : current));
    } catch (error) {
      handleError(error);
      setMessage({ tone: "error", text: t.saveError });
    } finally {
      setBusy(false);
    }
  };

  const copyKey = async () => {
    if (!data?.journalKey) return;
    try {
      await navigator.clipboard.writeText(data.journalKey);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked in some webviews; the key stays visible to copy by hand.
    }
  };

  const tabs: Array<{ key: Tab; label: string }> = [
    { key: "overview", label: t.tabOverview },
    { key: "trades", label: t.tabTrades },
    { key: "review", label: t.tabReview },
    { key: "connect", label: t.tabConnect },
  ];

  const bucketTable = (title: string, rows: Bucket[], name: (key: string) => string = (k) => k) =>
    rows.length > 0 && (
      <Card>
        <div className="mb-2 text-sm font-semibold text-slate-200">{title}</div>
        <div className="space-y-1.5">
          {rows.map((row) => (
            <div key={row.key} className="flex items-center justify-between gap-3 text-sm">
              <span className="truncate text-slate-300">{name(row.key)}</span>
              <span className="shrink-0 text-xs text-slate-500">
                {row.trades} · {row.winRate.toFixed(0)}%
              </span>
              <span className={cn("w-28 shrink-0 text-right font-medium", row.net >= 0 ? "text-emerald-300" : "text-rose-300")}>
                {money(row.net)}
              </span>
            </div>
          ))}
        </div>
      </Card>
    );

  const trendBadge = (signal: JournalSignal) => {
    const dir = signal.direction === "LONG" ? "UP" : signal.direction === "SHORT" ? "DOWN" : "";
    if (!signal.d1 && !signal.h4) return <span className="text-slate-500">{t.noMtf}</span>;
    const with1 = signal.d1 === dir;
    const with4 = signal.h4 === dir;
    const against = (signal.d1 && signal.d1 !== "FLAT" && signal.d1 !== dir) || (signal.h4 && signal.h4 !== "FLAT" && signal.h4 !== dir);
    if (with1 && with4) return <span className="text-emerald-300">{t.withTrend}</span>;
    if (against && !with1 && !with4) return <span className="text-rose-300">{t.againstTrend}</span>;
    return <span className="text-amber-200">{t.mixedTrend}</span>;
  };

  const symbols = Array.from(new Set(trades.map((trade) => trade.symbol))).sort();
  const visibleTrades = trades.filter((trade) => symbolFilter === "all" || trade.symbol === symbolFilter);
  const input = "w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-slate-100 outline-none focus:border-amber-300/50";

  return (
    <section className="space-y-4">
      <div className="rounded-[28px] border border-amber-300/20 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.14),transparent_45%),linear-gradient(145deg,#151923,#0b0d13)] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-amber-300/10 text-amber-300">
              <BookOpenCheck className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-semibold">{t.title}</h1>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => void reload()}
              className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 text-slate-400 hover:text-slate-200"
              aria-label={t.retry}
            >
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            </button>
            <button
              type="button"
              onClick={() => openForm()}
              className="flex items-center gap-1.5 rounded-xl bg-amber-300 px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-amber-200"
            >
              <Plus className="h-4 w-4" />
              {t.addTrade}
            </button>
          </div>
        </div>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">{t.lead}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {tabs.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setTab(item.key)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs transition",
                tab === item.key
                  ? "border-amber-300/50 bg-amber-300/15 text-amber-200"
                  : "border-white/10 text-slate-400 hover:text-slate-200",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {message && (
        <p className={cn("text-sm", message.tone === "ok" ? "text-emerald-300" : "text-rose-300")}>{message.text}</p>
      )}

      {loading && !data && (
        <div className="flex items-center justify-center gap-2 py-8 text-slate-400">
          <Loader2 className="h-5 w-5 animate-spin" /> {t.loading}
        </div>
      )}
      {failed && !data && (
        <Card className="text-sm text-rose-200">
          {t.loadError}{" "}
          <button type="button" className="underline" onClick={() => void reload()}>
            {t.retry}
          </button>
        </Card>
      )}

      {data && tab === "overview" && (
        <div className="space-y-4">
          {trades.length === 0 && <Card className="text-sm text-slate-400">{t.empty}</Card>}
          {summary.trades > 0 && (
            <>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                <Stat label={t.trades} value={String(summary.trades)} />
                <Stat label={t.net} value={money(summary.net)} tone={summary.net >= 0 ? "text-emerald-300" : "text-rose-300"} />
                <Stat label={t.winRate} value={`${summary.winRate.toFixed(1)}%`} />
                <Stat label={t.profitFactor} value={summary.profitFactor === null ? "—" : summary.profitFactor.toFixed(2)} />
                <Stat label={t.avgWin} value={money(summary.avgWin)} tone="text-emerald-300" />
                <Stat label={t.avgLoss} value={money(summary.avgLoss)} tone="text-rose-300" />
                <Stat label={t.expectancy} value={money(summary.expectancy)} />
                <Stat label={t.maxDrawdown} value={money(-summary.maxDrawdown)} tone="text-rose-300" />
              </div>
              {curve.length > 1 && (
                <Card>
                  <div className="mb-2 text-sm font-semibold text-slate-200">{t.equity}</div>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={curve} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
                        <defs>
                          <linearGradient id="journalEquity" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#fbbf24" stopOpacity={0.35} />
                            <stop offset="100%" stopColor="#fbbf24" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                        <XAxis dataKey="n" tick={{ fill: "#64748b", fontSize: 11 }} tickLine={false} axisLine={false} />
                        <YAxis tick={{ fill: "#64748b", fontSize: 11 }} tickLine={false} axisLine={false} width={56} />
                        <Tooltip
                          contentStyle={{ background: "#0b0d13", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }}
                          formatter={(value: number) => [money(value), t.net]}
                          labelFormatter={(n) => `#${n}`}
                        />
                        <Area type="monotone" dataKey="equity" stroke="#fbbf24" strokeWidth={2} fill="url(#journalEquity)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              )}
              {bucketTable(t.bySymbol, buckets.symbol)}
            </>
          )}
          <Card>
            <div className="text-sm font-semibold text-slate-200">{t.signalsTitle}</div>
            <div className="mt-2 grid grid-cols-2 gap-2 md:grid-cols-4">
              <Stat label={t.accepted} value={String(sigSummary.accepted)} />
              <Stat label={t.closedSignals} value={String(sigSummary.closed)} />
              <Stat label={t.winRate} value={`${sigSummary.winRate.toFixed(0)}%`} />
              <Stat
                label={t.totalR}
                value={`${sigSummary.totalR >= 0 ? "+" : ""}${sigSummary.totalR.toFixed(2)}R`}
                tone={sigSummary.totalR >= 0 ? "text-emerald-300" : "text-rose-300"}
              />
            </div>
          </Card>
        </div>
      )}

      {data && tab === "trades" && (
        <div className="space-y-3">
          {formOpen && (
            <Card>
              <form onSubmit={(event) => void submitForm(event)} className="grid gap-3 md:grid-cols-4">
                <label className="text-xs text-slate-400 md:col-span-2">
                  {t.symbol}
                  <input className={input} value={form.symbol} onChange={(e) => setForm({ ...form, symbol: e.target.value })} placeholder="XAUUSD" />
                </label>
                <label className="text-xs text-slate-400">
                  {t.side}
                  <select className={input} value={form.side} onChange={(e) => setForm({ ...form, side: e.target.value as "BUY" | "SELL" })}>
                    <option value="BUY">{t.buy}</option>
                    <option value="SELL">{t.sell}</option>
                  </select>
                </label>
                <label className="text-xs text-slate-400">
                  {t.volume}
                  <input className={input} inputMode="decimal" value={form.volume} onChange={(e) => setForm({ ...form, volume: e.target.value })} />
                </label>
                <label className="text-xs text-slate-400 md:col-span-2">
                  {t.openTime}
                  <input type="datetime-local" className={input} value={form.openTime} onChange={(e) => setForm({ ...form, openTime: e.target.value })} />
                </label>
                <label className="text-xs text-slate-400 md:col-span-2">
                  {t.closeTime}
                  <input type="datetime-local" className={input} value={form.closeTime} onChange={(e) => setForm({ ...form, closeTime: e.target.value })} />
                </label>
                {(["openPrice", "closePrice", "stopLoss", "takeProfit"] as const).map((field) => (
                  <label key={field} className="text-xs text-slate-400">
                    {t[field]}
                    <input className={input} inputMode="decimal" value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} />
                  </label>
                ))}
                <label className="text-xs text-slate-400">
                  {t.profit}
                  <input className={input} inputMode="decimal" value={form.profit} onChange={(e) => setForm({ ...form, profit: e.target.value })} placeholder="-25.40" />
                </label>
                <label className="text-xs text-slate-400">
                  {t.emotion}
                  <select className={input} value={form.emotion} onChange={(e) => setForm({ ...form, emotion: e.target.value })}>
                    <option value="">—</option>
                    {Object.entries(t.emotions).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </label>
                <label className="text-xs text-slate-400 md:col-span-2">
                  {t.nicsSignal}
                  <select className={input} value={form.signalId} onChange={(e) => setForm({ ...form, signalId: e.target.value })}>
                    <option value="">{t.noSignal}</option>
                    {signals.slice(0, 50).map((signal) => (
                      <option key={signal.signalId} value={signal.signalId}>
                        {signal.label || signal.symbol} {signal.direction} · {formatDate(signal.acceptedAt)}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-xs text-slate-400 md:col-span-4">
                  {t.setup}
                  <input className={input} value={form.setup} onChange={(e) => setForm({ ...form, setup: e.target.value })} />
                </label>
                <label className="text-xs text-slate-400 md:col-span-4">
                  {t.note}
                  <textarea className={cn(input, "min-h-[72px]")} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
                </label>
                <div className="flex gap-2 md:col-span-4">
                  <button type="submit" disabled={busy} className="rounded-xl bg-amber-300 px-4 py-2 text-sm font-semibold text-slate-950 disabled:opacity-60">
                    {busy ? t.saving : t.save}
                  </button>
                  <button type="button" onClick={() => setFormOpen(false)} className="rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-300">
                    {t.cancel}
                  </button>
                </div>
              </form>
            </Card>
          )}
          {symbols.length > 1 && (
            <div className="flex flex-wrap gap-1.5">
              {["all", ...symbols].map((symbol) => (
                <button
                  key={symbol}
                  type="button"
                  onClick={() => setSymbolFilter(symbol)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs",
                    symbolFilter === symbol ? "border-amber-300/50 bg-amber-300/15 text-amber-200" : "border-white/10 text-slate-400",
                  )}
                >
                  {symbol === "all" ? t.all : symbol}
                </button>
              ))}
            </div>
          )}
          {visibleTrades.length === 0 && !formOpen && <Card className="text-sm text-slate-400">{t.empty}</Card>}
          {visibleTrades.map((trade) => {
            const result = netResult(trade);
            const r = tradeR(trade);
            return (
              <Card key={trade.tradeKey} className="space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-100">{trade.symbol}</span>
                    <span className={cn("rounded-full px-2 py-0.5 text-[11px]", trade.side === "BUY" ? "bg-emerald-400/10 text-emerald-300" : "bg-rose-400/10 text-rose-300")}>
                      {trade.side === "BUY" ? t.buy : t.sell}
                    </span>
                    {trade.volume ? <span className="text-xs text-slate-500">{trade.volume}</span> : null}
                    <span className="text-[11px] text-slate-500">{t.sources[trade.source] ?? trade.source}</span>
                  </div>
                  <div className={cn("font-semibold", !isClosed(trade) ? "text-slate-400" : result >= 0 ? "text-emerald-300" : "text-rose-300")}>
                    {isClosed(trade) ? money(result) : "—"}
                    {r !== null && <span className="ml-2 text-xs text-slate-400">{r >= 0 ? "+" : ""}{r.toFixed(2)}R</span>}
                  </div>
                </div>
                <div className="text-xs text-slate-500">
                  {formatDate(trade.openTime)} → {formatDate(trade.closeTime)}
                  {trade.openPrice ? ` · ${trade.openPrice} → ${trade.closePrice ?? "—"}` : ""}
                  {trade.stopLoss ? ` · SL ${trade.stopLoss}` : ""}
                  {trade.takeProfit ? ` · TP ${trade.takeProfit}` : ""}
                </div>
                {(trade.setup || trade.emotion || trade.note) && (
                  <div className="text-sm text-slate-300">
                    {trade.setup && <span className="mr-2 text-amber-200">{trade.setup}</span>}
                    {trade.emotion && <span className="mr-2 text-slate-400">{t.emotions[trade.emotion] ?? trade.emotion}</span>}
                    {trade.note}
                  </div>
                )}
                <div className="flex gap-3 pt-1 text-xs">
                  <button type="button" onClick={() => openForm(trade)} className="flex items-center gap-1 text-slate-400 hover:text-slate-200">
                    <Pencil className="h-3.5 w-3.5" /> {t.edit}
                  </button>
                  <button type="button" disabled={busy} onClick={() => void removeTrade(trade)} className="flex items-center gap-1 text-slate-500 hover:text-rose-300">
                    <Trash2 className="h-3.5 w-3.5" /> {t.delete}
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {data && tab === "review" && (
        <div className="space-y-4">
          <Card>
            <div className="text-sm font-semibold text-slate-200">{t.weekTitle}</div>
            <p className="text-xs text-slate-500">
              {t.weekLead} {week.trades > 0 && `${t.trades}: ${week.trades} · ${t.net}: ${money(week.net)}`}
            </p>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <div>
                <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-emerald-300">
                  <ThumbsUp className="h-3.5 w-3.5" /> {t.strengths}
                </div>
                <ul className="space-y-1 text-sm text-slate-300">
                  {week.strengths.length === 0 && <li className="text-slate-500">—</li>}
                  {week.strengths.map((point, index) => <li key={index}>• {reviewText(point)}</li>)}
                </ul>
              </div>
              <div>
                <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-amber-200">
                  <Wrench className="h-3.5 w-3.5" /> {t.fixes}
                </div>
                <ul className="space-y-1 text-sm text-slate-300">
                  {week.fixes.length === 0 && <li className="text-slate-500">—</li>}
                  {week.fixes.map((point, index) => <li key={index}>• {reviewText(point)}</li>)}
                </ul>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-200">
              <AlertTriangle className="h-4 w-4 text-amber-300" /> {t.mistakesTitle}
            </div>
            <p className="text-xs text-slate-500">{t.mistakesLead}</p>
            <div className="mt-2 space-y-1.5">
              {mistakes.length === 0 && <p className="text-sm text-emerald-300">{t.noMistakes}</p>}
              {mistakes.map((m) => (
                <div key={m.code} className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-slate-300">{t.mistakes[m.code]}</span>
                  <span className="shrink-0 text-xs text-slate-500">{m.count} {t.times}</span>
                  <span className="w-28 shrink-0 text-right text-rose-300">{money(m.cost)}</span>
                </div>
              ))}
            </div>
          </Card>
          <div className="grid gap-3 md:grid-cols-2">
            {bucketTable(t.bySession, buckets.session, sessionName)}
            {bucketTable(t.byWeekday, buckets.weekday, (key) => t.weekdays[Number(key)] ?? key)}
            {bucketTable(t.bySide, buckets.side, (key) => (key === "BUY" ? t.buy : t.sell))}
            {bucketTable(t.bySymbol, buckets.symbol)}
          </div>
          <Card>
            <div className="text-sm font-semibold text-slate-200">{t.signalsTitle}</div>
            <p className="text-xs text-slate-500">{t.signalsLead}</p>
            <div className="mt-2 space-y-1.5">
              {signals.length === 0 && <p className="text-sm text-slate-400">{t.signalsEmpty}</p>}
              {signals.slice(0, 50).map((signal) => (
                <div key={signal.signalId} className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-1.5 text-sm last:border-0">
                  <span className="text-slate-200">
                    {signal.label || signal.symbol}{" "}
                    <span className={signal.direction === "LONG" ? "text-emerald-300" : "text-rose-300"}>
                      {signal.direction === "LONG" ? t.buy : t.sell}
                    </span>
                  </span>
                  <span className="text-xs text-slate-500">{formatDate(signal.acceptedAt)}</span>
                  <span className="text-xs">{trendBadge(signal)}</span>
                  <span className={cn("w-20 text-right font-medium", signal.closedAt ? (Number(signal.realizedR) >= 0 ? "text-emerald-300" : "text-rose-300") : "text-slate-400")}>
                    {signal.closedAt && signal.realizedR !== null && signal.realizedR !== undefined
                      ? `${Number(signal.realizedR) >= 0 ? "+" : ""}${Number(signal.realizedR).toFixed(2)}R`
                      : t.openSignals}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {data && tab === "connect" && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
              <Upload className="h-4 w-4 text-amber-300" /> {t.importTitle}
            </div>
            <p className="text-sm leading-6 text-slate-400">{t.importLead}</p>
            <label className={cn("inline-flex cursor-pointer items-center gap-2 rounded-xl bg-amber-300 px-4 py-2 text-sm font-semibold text-slate-950", busy && "opacity-60")}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              {t.chooseFile}
              <input type="file" accept=".html,.htm,.csv,.xlsx,.txt" className="hidden" disabled={busy} onChange={(e) => void importFile(e)} />
            </label>
          </Card>
          <Card className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
              <KeyRound className="h-4 w-4 text-amber-300" /> {t.eaTitle}
            </div>
            <p className="text-sm leading-6 text-slate-400">{t.eaLead}</p>
            <ol className="list-decimal space-y-1 pl-5 text-sm text-slate-300">
              {t.eaSteps.map((step) => <li key={step}>{step}</li>)}
            </ol>
            <a
              href={EA_DOWNLOAD_PATH}
              download
              onClick={(event) => {
                // Telegram and the Windows app webview ignore "download": open it in the browser.
                if (!window.Telegram?.WebApp?.initData && !isDesktopApp()) return;
                event.preventDefault();
                openExternal(`https://aibyteconsult.com${EA_DOWNLOAD_PATH}`);
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-200 hover:border-amber-300/40"
            >
              <Download className="h-4 w-4" /> {t.download}
            </a>
            <div className="rounded-xl border border-white/10 bg-black/30 p-3">
              <div className="text-[11px] uppercase tracking-wide text-slate-500">{t.key}</div>
              {data.journalKey ? (
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <code className="break-all text-sm text-amber-200">{data.journalKey}</code>
                  <button type="button" onClick={() => void copyKey()} className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200">
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />} {copied ? t.copied : t.copy}
                  </button>
                </div>
              ) : null}
              <button type="button" disabled={busy} onClick={() => void makeKey()} className="mt-2 text-xs text-amber-300 underline disabled:opacity-60">
                {data.journalKey ? t.newKey : t.createKey}
              </button>
              <p className="mt-1 text-[11px] text-slate-500">{t.keyWarning}</p>
            </div>
          </Card>
        </div>
      )}
    </section>
  );
};

export default TradeJournal;
