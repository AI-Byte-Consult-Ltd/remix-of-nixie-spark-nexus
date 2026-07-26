import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  BarChart3,
  Bot,
  Calculator,
  ChevronRight,
  Clock3,
  Gauge,
  LayoutDashboard,
  LineChart,
  Loader2,
  RefreshCw,
  Settings2,
  ShieldCheck,
  Signal,
  Sparkles,
  TrendingDown,
  TrendingUp,
  WalletCards,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const API_URL =
  "https://n8n.aibyteconsult.com/webhook/nics-miniapp-api";

type AppLanguage = "ru" | "bg" | "en";
type Screen = "dashboard" | "performance" | "signals" | "risk" | "markets" | "updates";

interface TelegramWebApp {
  initData: string;
  colorScheme?: "light" | "dark";
  ready: () => void;
  expand: () => void;
  close: () => void;
  HapticFeedback?: {
    impactOccurred: (style: "light" | "medium" | "heavy") => void;
    notificationOccurred: (type: "error" | "success" | "warning") => void;
  };
  initDataUnsafe?: {
    user?: {
      language_code?: string;
    };
  };
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}

interface PerformanceBlock {
  closedSignals: number;
  wins: number;
  losses: number;
  breakeven: number;
  winRatePercent: number;
  totalR: number;
  expectancyR: number;
  averageMfeR: number;
  averageMaeR: number;
}

interface SignalRow {
  signalId: string;
  symbol: string;
  label?: string;
  marketGroup: string;
  direction: "LONG" | "SHORT";
  entryLow: string | number;
  entryHigh: string | number;
  stopLoss: string | number;
  tp1?: string | number | null;
  tp2?: string | number | null;
  tp3?: string | number | null;
  tp4?: string | number | null;
  lastPrice?: string | number | null;
  validUntil?: string | null;
  lastCheckedAt?: string | null;
  hitTargets?: number[];
  breakevenActivated?: boolean;
  liveStatus?: string;
  distanceFromEntry?: number | null;
  accessType?: string;
}

interface RiskProfile {
  accountCurrency: string;
  accountBalance: number | null;
  riskPercent: number;
  maxTotalRiskPercent: number;
  maxCorrelatedRiskPercent: number;
}

interface MarketRow {
  key: string;
  label: string;
  symbols: string[];
  selected: boolean;
  open: boolean;
  schedule: string;
  dataFresh?: boolean;
}

interface AppPayload {
  ok: boolean;
  generatedAt: string;
  user: {
    firstName?: string;
    username?: string;
    language: AppLanguage;
  };
  access: {
    mode: string;
    label: string;
    expiresAt?: string | null;
  };
  selectedMarkets: string[];
  activeSignals: SignalRow[];
  performance: {
    periods: Record<"7d" | "30d" | "90d" | "all", PerformanceBlock>;
    byMarket: Record<string, PerformanceBlock>;
  };
  riskProfile: RiskProfile;
  markets: MarketRow[];
  updates: Array<{
    version: string;
    date: string;
    title: string;
    items: string[];
  }>;
}

interface ApiResponse {
  ok: boolean;
  message?: string;
  data?: AppPayload;
}

const translations = {
  ru: {
    hello: "Ваш торговый центр",
    loading: "NICS проверяет данные и готовит панель…",
    unavailable: "Панель временно обновляется. Ваши сигналы продолжают сопровождаться.",
    openTelegram: "Откройте эту панель кнопкой внутри NICS Telegram-бота.",
    retry: "Повторить",
    dashboard: "Главная",
    performance: "Результаты",
    signals: "Сигналы",
    risk: "Риск",
    markets: "Рынки",
    updates: "Версии",
    active: "Активные",
    totalR: "Итого R",
    expectancy: "Expectancy",
    winRate: "Win rate",
    closed: "Закрыто",
    noClosed: "Закрытых принятых сигналов пока нет.",
    noSignals: "Сейчас нет активных принятых сигналов.",
    lastPrice: "Цена",
    entry: "Entry",
    validUntil: "Вход до",
    refresh: "Обновить",
    status: "Статус",
    open: "Открыт",
    closedMarket: "Закрыт",
    subscribed: "Подписан",
    notSubscribed: "Не выбран",
    balance: "Баланс счёта",
    currency: "Валюта",
    riskPerTrade: "Риск на сделку, %",
    totalRisk: "Макс. суммарный риск, %",
    correlatedRisk: "Макс. коррелирующий риск, %",
    save: "Сохранить профиль",
    saved: "Профиль риска сохранён",
    riskNote: "Калькулятор использует реальную спецификацию инструмента MT5 и никогда не открывает сделку автоматически.",
    realOnly: "Только фактические закрытые сделки, измеренные в R",
    period: "Период",
    byMarket: "По рынкам",
    latest: "Что нового",
    access: "Доступ",
    secure: "Авторизация Telegram подтверждена",
    updated: "Обновлено",
  },
  bg: {
    hello: "Вашият търговски център",
    loading: "NICS проверява данните и подготвя панела…",
    unavailable: "Панелът се обновява. Вашите сигнали продължават да се проследяват.",
    openTelegram: "Отворете панела от бутона в NICS Telegram бота.",
    retry: "Опитай отново",
    dashboard: "Начало",
    performance: "Резултати",
    signals: "Сигнали",
    risk: "Риск",
    markets: "Пазари",
    updates: "Версии",
    active: "Активни",
    totalR: "Общо R",
    expectancy: "Expectancy",
    winRate: "Win rate",
    closed: "Затворени",
    noClosed: "Все още няма затворени приети сигнали.",
    noSignals: "В момента няма активни приети сигнали.",
    lastPrice: "Цена",
    entry: "Entry",
    validUntil: "Вход до",
    refresh: "Обнови",
    status: "Статус",
    open: "Отворен",
    closedMarket: "Затворен",
    subscribed: "Избран",
    notSubscribed: "Не е избран",
    balance: "Баланс на сметката",
    currency: "Валута",
    riskPerTrade: "Риск на сделка, %",
    totalRisk: "Макс. общ риск, %",
    correlatedRisk: "Макс. корелиран риск, %",
    save: "Запази профила",
    saved: "Рисковият профил е запазен",
    riskNote: "Калкулаторът използва реалната MT5 спецификация и никога не отваря сделка автоматично.",
    realOnly: "Само реално затворени сделки, измерени в R",
    period: "Период",
    byMarket: "По пазари",
    latest: "Какво е новото",
    access: "Достъп",
    secure: "Telegram авторизацията е потвърдена",
    updated: "Обновено",
  },
  en: {
    hello: "Your trading centre",
    loading: "NICS is checking data and preparing your dashboard…",
    unavailable: "The dashboard is being refreshed. Your signals continue to be tracked.",
    openTelegram: "Open this dashboard from the button inside the NICS Telegram bot.",
    retry: "Try again",
    dashboard: "Home",
    performance: "Results",
    signals: "Signals",
    risk: "Risk",
    markets: "Markets",
    updates: "Versions",
    active: "Active",
    totalR: "Total R",
    expectancy: "Expectancy",
    winRate: "Win rate",
    closed: "Closed",
    noClosed: "There are no closed accepted signals yet.",
    noSignals: "There are no accepted active signals right now.",
    lastPrice: "Price",
    entry: "Entry",
    validUntil: "Entry until",
    refresh: "Refresh",
    status: "Status",
    open: "Open",
    closedMarket: "Closed",
    subscribed: "Selected",
    notSubscribed: "Not selected",
    balance: "Account balance",
    currency: "Currency",
    riskPerTrade: "Risk per trade, %",
    totalRisk: "Max total risk, %",
    correlatedRisk: "Max correlated risk, %",
    save: "Save profile",
    saved: "Risk profile saved",
    riskNote: "The calculator uses the real MT5 instrument specification and never opens a trade automatically.",
    realOnly: "Only actual closed trades measured in R",
    period: "Period",
    byMarket: "By market",
    latest: "What’s new",
    access: "Access",
    secure: "Telegram authorization verified",
    updated: "Updated",
  },
} as const;

const periodLabels: Record<AppLanguage, Record<string, string>> = {
  ru: { "7d": "7 дней", "30d": "30 дней", "90d": "90 дней", all: "Всё время" },
  bg: { "7d": "7 дни", "30d": "30 дни", "90d": "90 дни", all: "Всички" },
  en: { "7d": "7 days", "30d": "30 days", "90d": "90 days", all: "All time" },
};

const statusLabels: Record<AppLanguage, Record<string, string>> = {
  ru: {
    IN_ENTRY: "Цена в Entry",
    WAITING_ENTRY: "Ожидаем Entry",
    PRICE_MOVED: "Цена ушла",
    TP1_REACHED: "TP1 достигнут",
    EXPIRED: "Вход истёк",
    ACTIVE: "Сопровождается",
    UNAVAILABLE: "Обновляется",
  },
  bg: {
    IN_ENTRY: "Цена в Entry",
    WAITING_ENTRY: "Изчакваме Entry",
    PRICE_MOVED: "Цената се отдалечи",
    TP1_REACHED: "TP1 е достигнат",
    EXPIRED: "Входът изтече",
    ACTIVE: "Проследява се",
    UNAVAILABLE: "Обновява се",
  },
  en: {
    IN_ENTRY: "Price in Entry",
    WAITING_ENTRY: "Waiting for Entry",
    PRICE_MOVED: "Price moved",
    TP1_REACHED: "TP1 reached",
    EXPIRED: "Entry expired",
    ACTIVE: "Lifecycle active",
    UNAVAILABLE: "Refreshing",
  },
};

const number = (value: unknown, digits = 2) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed.toFixed(digits).replace(/\.?0+$/, "") : "—";
};

const signedR = (value: unknown) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return "—";
  return `${parsed > 0 ? "+" : ""}${number(parsed, 2)}R`;
};

const formatDate = (value: string | null | undefined, language: AppLanguage) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(language === "en" ? "en-GB" : language, {
    timeZone: "Europe/Sofia",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
};

const NicsTraderApp = () => {
  const telegram = window.Telegram?.WebApp;
  const telegramLanguage = telegram?.initDataUnsafe?.user?.language_code?.slice(0, 2);
  const [language, setLanguage] = useState<AppLanguage>(
    telegramLanguage === "ru" || telegramLanguage === "bg" ? telegramLanguage : "en",
  );
  const [screen, setScreen] = useState<Screen>("dashboard");
  const [data, setData] = useState<AppPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<"telegram" | "network" | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [riskForm, setRiskForm] = useState<RiskProfile>({
    accountCurrency: "EUR",
    accountBalance: null,
    riskPercent: 1,
    maxTotalRiskPercent: 4,
    maxCorrelatedRiskPercent: 2,
  });

  const t = translations[language];

  const callApi = useCallback(
    async (action: string, payload: Record<string, unknown> = {}) => {
      const initData = window.Telegram?.WebApp?.initData ?? "";
      if (!initData) {
        throw new Error("TELEGRAM_REQUIRED");
      }

      const response = await fetch(API_URL, {
        method: "POST",
        // text/plain keeps the cross-domain request CORS-simple; the
        // authenticated payload itself remains JSON.
        headers: { "Content-Type": "text/plain;charset=UTF-8" },
        body: JSON.stringify({
          action,
          initData,
          language,
          ...payload,
        }),
      });

      if (!response.ok) {
        throw new Error("REQUEST_FAILED");
      }

      const result = (await response.json()) as ApiResponse;
      if (!result.ok) {
        throw new Error("REQUEST_FAILED");
      }

      return result;
    },
    [language],
  );

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await callApi("dashboard");
      if (!result.data) throw new Error("REQUEST_FAILED");
      setData(result.data);
      setLanguage(result.data.user.language);
      setRiskForm(result.data.riskProfile);
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "";
      setError(message === "TELEGRAM_REQUIRED" ? "telegram" : "network");
    } finally {
      setLoading(false);
    }
  }, [callApi]);

  useEffect(() => {
    telegram?.ready();
    telegram?.expand();
    void loadDashboard();
  }, [loadDashboard, telegram]);

  const performanceChart = useMemo(
    () =>
      Object.entries(data?.performance.byMarket ?? {}).map(([market, block]) => ({
        market,
        totalR: Number(block.totalR ?? 0),
        expectancyR: Number(block.expectancyR ?? 0),
      })),
    [data],
  );

  const saveRisk = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setSaved(false);

    try {
      const result = await callApi("save_risk", { riskProfile: riskForm });
      if (result.data) {
        setData(result.data);
        setRiskForm(result.data.riskProfile);
      }
      setSaved(true);
      telegram?.HapticFeedback?.notificationOccurred("success");
    } catch {
      setError("network");
      telegram?.HapticFeedback?.notificationOccurred("error");
    } finally {
      setSaving(false);
    }
  };

  const refreshSignal = async (signalId: string) => {
    telegram?.HapticFeedback?.impactOccurred("light");
    try {
      const result = await callApi("signal_status", { signalId });
      if (result.data) setData(result.data);
    } catch {
      setError("network");
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#07090f] text-white grid place-items-center px-6">
        <div className="text-center space-y-4">
          <div className="mx-auto h-16 w-16 rounded-3xl bg-gradient-to-br from-amber-300 to-orange-500 grid place-items-center shadow-[0_20px_60px_rgba(245,158,11,0.25)]">
            <Bot className="h-8 w-8 text-[#14100a]" />
          </div>
          <Loader2 className="mx-auto h-5 w-5 animate-spin text-amber-300" />
          <p className="max-w-xs text-sm text-slate-400">{t.loading}</p>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-[#07090f] text-white grid place-items-center px-6">
        <Card className="max-w-sm border-white/10 bg-white/[0.04] text-white">
          <CardContent className="p-7 text-center space-y-5">
            <ShieldCheck className="mx-auto h-10 w-10 text-amber-300" />
            <p className="text-sm leading-6 text-slate-300">
              {error === "telegram" ? t.openTelegram : t.unavailable}
            </p>
            <Button onClick={() => void loadDashboard()} className="w-full bg-amber-400 text-black hover:bg-amber-300">
              <RefreshCw className="mr-2 h-4 w-4" />
              {t.retry}
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  const allTime = data.performance.periods.all;

  const navItems: Array<{ key: Screen; icon: typeof LayoutDashboard; label: string }> = [
    { key: "dashboard", icon: LayoutDashboard, label: t.dashboard },
    { key: "performance", icon: BarChart3, label: t.performance },
    { key: "signals", icon: Signal, label: t.signals },
    { key: "risk", icon: Calculator, label: t.risk },
    { key: "markets", icon: Activity, label: t.markets },
    { key: "updates", icon: Sparkles, label: t.updates },
  ];

  const SignalCard = ({ signal }: { signal: SignalRow }) => {
    const long = signal.direction === "LONG";
    const status = statusLabels[language][signal.liveStatus ?? "ACTIVE"] ?? signal.liveStatus ?? "—";

    return (
      <Card className="overflow-hidden border-white/10 bg-white/[0.045] text-white shadow-none">
        <CardContent className="p-0">
          <div className="flex items-start justify-between gap-3 border-b border-white/10 p-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{signal.symbol}</span>
                <Badge
                  className={cn(
                    "border-0",
                    long ? "bg-emerald-400/15 text-emerald-300" : "bg-rose-400/15 text-rose-300",
                  )}
                >
                  {long ? <TrendingUp className="mr-1 h-3 w-3" /> : <TrendingDown className="mr-1 h-3 w-3" />}
                  {signal.direction}
                </Badge>
              </div>
              <p className="mt-1 text-xs text-slate-400">{signal.marketGroup}</p>
            </div>
            <Badge variant="outline" className="border-amber-300/30 text-amber-200">
              {status}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-px bg-white/10">
            <div className="bg-[#0e1119] p-4">
              <p className="text-[11px] uppercase tracking-wider text-slate-500">{t.lastPrice}</p>
              <p className="mt-1 font-mono text-lg">{number(signal.lastPrice, 6)}</p>
            </div>
            <div className="bg-[#0e1119] p-4">
              <p className="text-[11px] uppercase tracking-wider text-slate-500">{t.entry}</p>
              <p className="mt-1 font-mono text-sm">
                {number(signal.entryLow, 6)} – {number(signal.entryHigh, 6)}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 p-4">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Clock3 className="h-3.5 w-3.5" />
              {t.validUntil}: {formatDate(signal.validUntil, language)}
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => void refreshSignal(signal.signalId)}
              className="text-amber-200 hover:bg-amber-300/10 hover:text-amber-100"
            >
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
              {t.refresh}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const metricCards = [
    { label: t.active, value: data.activeSignals.length, icon: Signal, tone: "text-amber-300" },
    { label: t.totalR, value: signedR(allTime.totalR), icon: TrendingUp, tone: "text-emerald-300" },
    { label: t.expectancy, value: signedR(allTime.expectancyR), icon: Gauge, tone: "text-sky-300" },
    { label: t.winRate, value: `${number(allTime.winRatePercent, 1)}%`, icon: BarChart3, tone: "text-violet-300" },
  ];

  return (
    <main className="min-h-screen bg-[#07090f] pb-24 text-white">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#07090f]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-amber-300 to-orange-500">
              <Bot className="h-5 w-5 text-[#171006]" />
            </div>
            <div>
              <p className="text-sm font-semibold">NICS AI Trader</p>
              <p className="text-[11px] text-slate-500">{t.hello}</p>
            </div>
          </div>
          <div className="text-right">
            <Badge className="bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400/10">
              {data.access.label}
            </Badge>
            <p className="mt-1 text-[10px] text-slate-600">{t.secure}</p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl space-y-5 px-4 py-5">
        {screen === "dashboard" && (
          <>
            <section className="overflow-hidden rounded-[28px] border border-amber-300/20 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.22),transparent_42%),linear-gradient(145deg,#151923,#0b0d13)] p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-amber-300/80">{t.access}</p>
                  <h1 className="mt-2 text-2xl font-semibold">
                    {data.user.firstName || data.user.username || "NICS Trader"}
                  </h1>
                  <p className="mt-2 text-sm text-slate-400">
                    {data.selectedMarkets.join(" · ") || "—"}
                  </p>
                </div>
                <ShieldCheck className="h-8 w-8 text-amber-300" />
              </div>
              <div className="mt-6 flex items-center justify-between text-xs text-slate-500">
                <span>{t.updated}</span>
                <span>{formatDate(data.generatedAt, language)}</span>
              </div>
            </section>

            <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {metricCards.map(({ label, value, icon: Icon, tone }) => (
                <Card key={label} className="border-white/10 bg-white/[0.045] text-white shadow-none">
                  <CardContent className="p-4">
                    <Icon className={cn("h-4 w-4", tone)} />
                    <p className="mt-4 text-xl font-semibold">{value}</p>
                    <p className="mt-1 text-xs text-slate-500">{label}</p>
                  </CardContent>
                </Card>
              ))}
            </section>

            <section>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-semibold">{t.signals}</h2>
                <button onClick={() => setScreen("signals")} className="text-xs text-amber-300">
                  {t.active} <ChevronRight className="inline h-3.5 w-3.5" />
                </button>
              </div>
              <div className="space-y-3">
                {data.activeSignals.length ? (
                  data.activeSignals.slice(0, 2).map((signal) => (
                    <SignalCard key={signal.signalId} signal={signal} />
                  ))
                ) : (
                  <Card className="border-dashed border-white/10 bg-white/[0.025] text-white">
                    <CardContent className="p-6 text-center text-sm text-slate-500">{t.noSignals}</CardContent>
                  </Card>
                )}
              </div>
            </section>
          </>
        )}

        {screen === "performance" && (
          <>
            <section className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-violet-400/10 text-violet-300">
                  <LineChart className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold">{t.performance}</h1>
                  <p className="text-xs text-slate-500">{t.realOnly}</p>
                </div>
              </div>
            </section>

            <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {(["7d", "30d", "90d", "all"] as const).map((period) => {
                const block = data.performance.periods[period];
                return (
                  <Card key={period} className="border-white/10 bg-white/[0.045] text-white shadow-none">
                    <CardContent className="p-4">
                      <p className="text-xs text-slate-500">{periodLabels[language][period]}</p>
                      <p className="mt-3 text-xl font-semibold">{signedR(block.totalR)}</p>
                      <p className="mt-2 text-xs text-slate-400">
                        {block.closedSignals} · {number(block.winRatePercent, 1)}%
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </section>

            <Card className="border-white/10 bg-white/[0.045] text-white shadow-none">
              <CardHeader>
                <CardTitle className="text-base">{t.byMarket}</CardTitle>
              </CardHeader>
              <CardContent>
                {performanceChart.length ? (
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={performanceChart}>
                        <CartesianGrid stroke="rgba(255,255,255,0.07)" vertical={false} />
                        <XAxis dataKey="market" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} />
                        <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} />
                        <Tooltip
                          cursor={{ fill: "rgba(255,255,255,0.04)" }}
                          contentStyle={{
                            background: "#10141d",
                            border: "1px solid rgba(255,255,255,0.12)",
                            borderRadius: 12,
                          }}
                        />
                        <Bar dataKey="totalR" fill="#fbbf24" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <p className="py-16 text-center text-sm text-slate-500">{t.noClosed}</p>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {screen === "signals" && (
          <section className="space-y-3">
            <div className="mb-5">
              <h1 className="text-xl font-semibold">{t.signals}</h1>
              <p className="mt-1 text-xs text-slate-500">{data.activeSignals.length} {t.active.toLowerCase()}</p>
            </div>
            {data.activeSignals.length ? (
              data.activeSignals.map((signal) => <SignalCard key={signal.signalId} signal={signal} />)
            ) : (
              <Card className="border-dashed border-white/10 bg-white/[0.025] text-white">
                <CardContent className="p-8 text-center text-sm text-slate-500">{t.noSignals}</CardContent>
              </Card>
            )}
          </section>
        )}

        {screen === "risk" && (
          <form onSubmit={saveRisk} className="space-y-4">
            <section className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-amber-400/10 text-amber-300">
                  <WalletCards className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold">{t.risk}</h1>
                  <p className="text-xs text-slate-500">{t.riskNote}</p>
                </div>
              </div>
            </section>

            <Card className="border-white/10 bg-white/[0.045] text-white shadow-none">
              <CardContent className="space-y-5 p-5">
                <div className="grid grid-cols-[1fr_110px] gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="balance" className="text-xs text-slate-400">{t.balance}</Label>
                    <Input
                      id="balance"
                      type="number"
                      min={100}
                      step="0.01"
                      value={riskForm.accountBalance ?? ""}
                      onChange={(event) =>
                        setRiskForm((current) => ({
                          ...current,
                          accountBalance: event.target.value ? Number(event.target.value) : null,
                        }))
                      }
                      className="border-white/10 bg-black/20 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-slate-400">{t.currency}</Label>
                    <Select
                      value={riskForm.accountCurrency}
                      onValueChange={(value) =>
                        setRiskForm((current) => ({ ...current, accountCurrency: value }))
                      }
                    >
                      <SelectTrigger className="border-white/10 bg-black/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["EUR", "USD", "GBP", "BGN"].map((currency) => (
                          <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {[
                  { key: "riskPercent", label: t.riskPerTrade, min: 0.1, max: 5, step: 0.05 },
                  { key: "maxTotalRiskPercent", label: t.totalRisk, min: 0.5, max: 20, step: 0.25 },
                  { key: "maxCorrelatedRiskPercent", label: t.correlatedRisk, min: 0.25, max: 10, step: 0.25 },
                ].map(({ key, label, min, max, step }) => (
                  <div key={key} className="space-y-2">
                    <Label htmlFor={key} className="text-xs text-slate-400">{label}</Label>
                    <Input
                      id={key}
                      type="number"
                      min={min}
                      max={max}
                      step={step}
                      value={riskForm[key as keyof RiskProfile] as number}
                      onChange={(event) =>
                        setRiskForm((current) => ({
                          ...current,
                          [key]: Number(event.target.value),
                        }))
                      }
                      className="border-white/10 bg-black/20 text-white"
                    />
                  </div>
                ))}

                <Button
                  type="submit"
                  disabled={saving || !riskForm.accountBalance}
                  className="w-full bg-amber-400 text-black hover:bg-amber-300"
                >
                  {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Settings2 className="mr-2 h-4 w-4" />}
                  {t.save}
                </Button>
                {saved && <p className="text-center text-xs text-emerald-300">✓ {t.saved}</p>}
              </CardContent>
            </Card>
          </form>
        )}

        {screen === "markets" && (
          <section className="space-y-3">
            <div className="mb-5">
              <h1 className="text-xl font-semibold">{t.markets}</h1>
              <p className="mt-1 text-xs text-slate-500">{data.selectedMarkets.join(" · ")}</p>
            </div>
            {data.markets.map((market) => (
              <Card key={market.key} className="border-white/10 bg-white/[0.045] text-white shadow-none">
                <CardContent className="flex items-center justify-between gap-4 p-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{market.label}</p>
                      <span className={cn("h-2 w-2 rounded-full", market.open ? "bg-emerald-400" : "bg-slate-600")} />
                    </div>
                    <p className="mt-1 text-xs text-slate-500">{market.symbols.join(" · ")}</p>
                    <p className="mt-2 text-xs text-slate-400">{market.schedule}</p>
                  </div>
                  <div className="text-right">
                    <Badge className={market.open ? "bg-emerald-400/10 text-emerald-300" : "bg-slate-400/10 text-slate-400"}>
                      {market.open ? t.open : t.closedMarket}
                    </Badge>
                    <p className={cn("mt-2 text-[11px]", market.selected ? "text-amber-300" : "text-slate-600")}>
                      {market.selected ? t.subscribed : t.notSubscribed}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </section>
        )}

        {screen === "updates" && (
          <section className="space-y-4">
            <div className="mb-5">
              <h1 className="text-xl font-semibold">{t.latest}</h1>
              <p className="mt-1 text-xs text-slate-500">NICS AI Trader</p>
            </div>
            {data.updates.map((update, index) => (
              <Card key={`${update.version}-${update.date}`} className="border-white/10 bg-white/[0.045] text-white shadow-none">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Badge className={index === 0 ? "bg-amber-400 text-black" : "bg-white/10 text-slate-300"}>
                        {update.version}
                      </Badge>
                      <h2 className="mt-3 font-semibold">{update.title}</h2>
                    </div>
                    <span className="text-xs text-slate-500">{update.date}</span>
                  </div>
                  <ul className="mt-4 space-y-2">
                    {update.items.map((item) => (
                      <li key={item} className="flex gap-2 text-sm leading-5 text-slate-400">
                        <span className="mt-1 text-amber-300">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </section>
        )}
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#090b11]/95 px-2 pb-[max(env(safe-area-inset-bottom),8px)] pt-2 backdrop-blur-xl">
        <div className="mx-auto grid max-w-3xl grid-cols-6">
          {navItems.map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => {
                setScreen(key);
                telegram?.HapticFeedback?.impactOccurred("light");
              }}
              className={cn(
                "flex min-w-0 flex-col items-center gap-1 rounded-xl px-1 py-2 text-[9px] transition",
                screen === key ? "bg-amber-300/10 text-amber-300" : "text-slate-500",
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="max-w-full truncate">{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </main>
  );
};

export default NicsTraderApp;
