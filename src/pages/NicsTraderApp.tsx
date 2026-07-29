import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  BarChart3,
  Bot,
  Calculator,
  ChevronRight,
  Clock3,
  FileClock,
  Gauge,
  History,
  LayoutDashboard,
  LineChart,
  Loader2,
  RefreshCw,
  Settings2,
  ShieldCheck,
  Signal,
  Sparkles,
  TrendingUp,
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { callNicsApi, NicsApiError } from "@/features/nics/api";
import { periodLabels, translations } from "@/features/nics/i18n";
import { RiskProfileForm } from "@/features/nics/RiskProfileForm";
import { RiskSummaryCard } from "@/features/nics/RiskSummaryCard";
import { SettingsForm } from "@/features/nics/SettingsForm";
import { SignalCard } from "@/features/nics/SignalCard";
import type {
  AppLanguage,
  AppPayload,
  PerformanceBlock,
  RiskProfile,
  Screen,
  SizingResult,
  UserPreferences,
} from "@/features/nics/types";
import {
  formatDate,
  formatNumber,
  freshnessTone,
  signedR,
} from "@/features/nics/utils";

const APP_VERSION = "2.0.2";

const emptyPerformance: PerformanceBlock = {
  closedSignals: 0,
  wins: 0,
  losses: 0,
  breakeven: 0,
  winRatePercent: 0,
  totalR: 0,
  expectancyR: 0,
  averageMfeR: 0,
  averageMaeR: 0,
};

const defaultRiskProfile: RiskProfile = {
  accountCurrency: "EUR",
  accountBalance: null,
  rememberBalance: false,
  riskPercent: 1,
  maxTotalRiskPercent: 4,
  maxCorrelatedRiskPercent: 2,
};

const defaultPreferences: UserPreferences = {
  experienceMode: "BEGINNER",
  signalFrequency: "ALL",
  quietHoursEnabled: false,
  quietHoursStart: "22:00",
  quietHoursEnd: "07:00",
  riskDisclosureAccepted: false,
  riskDisclosureAcceptedAt: null,
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
  const [riskForm, setRiskForm] = useState<RiskProfile>(defaultRiskProfile);
  const [preferencesForm, setPreferencesForm] =
    useState<UserPreferences>(defaultPreferences);
  const [savingRisk, setSavingRisk] = useState(false);
  const [riskSaved, setRiskSaved] = useState(false);
  const [savingPreferences, setSavingPreferences] = useState(false);
  const [preferencesSaved, setPreferencesSaved] = useState(false);
  const [sizing, setSizing] = useState<SizingResult | null>(null);
  const [sizingSignalId, setSizingSignalId] = useState<string | null>(null);
  const [sizingLoading, setSizingLoading] = useState(false);
  const t = translations[language];

  const callApi = useCallback(
    (action: string, payload: Record<string, unknown> = {}) =>
      callNicsApi({
        action,
        initData: window.Telegram?.WebApp?.initData ?? "",
        language,
        payload,
      }),
    [language],
  );

  const applyPayload = useCallback((payload: AppPayload) => {
    setError(null);
    setData(payload);
    setLanguage(payload.user.language);
    setRiskForm((current) => {
      const serverProfile = { ...defaultRiskProfile, ...payload.riskProfile };
      return {
        ...serverProfile,
        accountBalance: serverProfile.rememberBalance
          ? serverProfile.accountBalance
          : current.accountBalance,
      };
    });
    setPreferencesForm({ ...defaultPreferences, ...payload.preferences });
    if (payload.sizing) setSizing(payload.sizing);
  }, []);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await callApi("dashboard");
      if (!result.data) throw new NicsApiError("REQUEST_FAILED");
      applyPayload(result.data);
    } catch (requestError) {
      const code = requestError instanceof NicsApiError ? requestError.code : "";
      setError(code === "TELEGRAM_REQUIRED" ? "telegram" : "network");
    } finally {
      setLoading(false);
    }
  }, [applyPayload, callApi]);

  const trackEvent = useCallback(
    async (eventName: string, metadata: Record<string, unknown> = {}) => {
      try {
        await callApi("track_event", {
          eventName,
          metadata: {
            ...metadata,
            source: "mini_app",
            appVersion: APP_VERSION,
          },
        });
      } catch {
        // Analytics never blocks the product flow.
      }
    },
    [callApi],
  );

  useEffect(() => {
    telegram?.ready();
    telegram?.expand();
    void loadDashboard();
  }, [loadDashboard, telegram]);

  useEffect(() => {
    document.title = "NICS AI Trader";
    const theme = document.querySelector('meta[name="theme-color"]');
    theme?.setAttribute("content", "#07090f");

  }, []);

  useEffect(() => {
    if (data) void trackEvent("mini_app_opened", { screen: "dashboard" });
  }, [data?.apiVersion]); // eslint-disable-line react-hooks/exhaustive-deps

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
    setSavingRisk(true);
    setRiskSaved(false);

    try {
      const result = await callApi("save_risk", { riskProfile: riskForm });
      if (result.data) applyPayload(result.data);
      setRiskSaved(true);
      telegram?.HapticFeedback?.notificationOccurred("success");
    } catch {
      setError("network");
      telegram?.HapticFeedback?.notificationOccurred("error");
    } finally {
      setSavingRisk(false);
    }
  };

  const savePreferences = async (event: FormEvent) => {
    event.preventDefault();
    setSavingPreferences(true);
    setPreferencesSaved(false);

    try {
      const result = await callApi("save_preferences", {
        preferences: preferencesForm,
      });
      if (result.data) applyPayload(result.data);
      setPreferencesSaved(true);
      telegram?.HapticFeedback?.notificationOccurred("success");
    } catch {
      setError("network");
      telegram?.HapticFeedback?.notificationOccurred("error");
    } finally {
      setSavingPreferences(false);
    }
  };

  const refreshSignal = async (signalId: string) => {
    telegram?.HapticFeedback?.impactOccurred("light");
    try {
      const result = await callApi("signal_status", { signalId });
      if (result.data) applyPayload(result.data);
    } catch {
      setError("network");
    }
  };

  const calculateSizing = async (signalId: string) => {
    setSizingSignalId(signalId);
    setSizingLoading(true);
    setSizing(null);
    telegram?.HapticFeedback?.impactOccurred("medium");
    void trackEvent("sizing_requested", { signalId, screen });

    if (!riskForm.accountBalance || riskForm.accountBalance < 1) {
      setSizing({ available: false, reason: "BALANCE_REQUIRED" });
      setSizingLoading(false);
      telegram?.HapticFeedback?.notificationOccurred("warning");
      return;
    }

    try {
      const result = await callApi("calculate_sizing", {
        signalId,
        sizing: {
          accountBalance: riskForm.accountBalance,
          accountCurrency: riskForm.accountCurrency,
          riskPercent: riskForm.riskPercent,
        },
      });
      if (result.data) {
        applyPayload(result.data);
        setSizing(result.data.sizing ?? null);
      }
      void trackEvent("sizing_completed", { signalId, screen });
    } catch {
      setSizing({ available: false, reason: "REQUEST_FAILED" });
      telegram?.HapticFeedback?.notificationOccurred("error");
    } finally {
      setSizingLoading(false);
    }
  };

  const openScreen = (next: Screen) => {
    setScreen(next);
    telegram?.HapticFeedback?.impactOccurred("light");
    void trackEvent(
      next === "performance" ? "performance_opened" : "screen_opened",
      { screen: next },
    );
  };

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#07090f] px-6 text-white">
        <div className="space-y-4 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-amber-300 to-orange-500 shadow-[0_20px_60px_rgba(245,158,11,0.25)]">
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
      <main className="grid min-h-screen place-items-center bg-[#07090f] px-6 text-white">
        <Card className="max-w-sm border-white/10 bg-white/[0.04] text-white">
          <CardContent className="space-y-5 p-7 text-center">
            <ShieldCheck className="mx-auto h-10 w-10 text-amber-300" />
            <p className="text-sm leading-6 text-slate-300">
              {error === "telegram" ? t.openTelegram : t.unavailable}
            </p>
            <Button
              onClick={() => void loadDashboard()}
              className="w-full bg-amber-400 text-black hover:bg-amber-300"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              {t.retry}
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  const allTime = data.performance.periods.all ?? emptyPerformance;
  const navItems: Array<{ key: Screen; icon: typeof LayoutDashboard; label: string }> = [
    { key: "dashboard", icon: LayoutDashboard, label: t.dashboard },
    { key: "signals", icon: Signal, label: t.signals },
    { key: "risk", icon: Calculator, label: t.risk },
    { key: "performance", icon: BarChart3, label: t.performance },
    { key: "history", icon: History, label: t.history },
    { key: "markets", icon: Activity, label: t.markets },
    { key: "settings", icon: Settings2, label: t.settings },
  ];

  const metricCards = [
    { label: t.active, value: data.activeSignals.length, icon: Signal, tone: "text-amber-300" },
    { label: t.totalR, value: signedR(allTime.totalR), icon: TrendingUp, tone: "text-emerald-300" },
    { label: t.expectancy, value: signedR(allTime.expectancyR), icon: Gauge, tone: "text-sky-300" },
    {
      label: t.winRate,
      value: `${formatNumber(allTime.winRatePercent, 1)}%`,
      icon: BarChart3,
      tone: "text-violet-300",
    },
  ];

  const renderSignal = (signal: AppPayload["activeSignals"][number]) => (
    <SignalCard
      key={signal.signalId}
      signal={signal}
      language={language}
      t={t}
      sizing={sizingSignalId === signal.signalId ? sizing : null}
      sizingLoading={sizingLoading && sizingSignalId === signal.signalId}
      onCalculate={(signalId) => void calculateSizing(signalId)}
      onRefresh={(signalId) => void refreshSignal(signalId)}
    />
  );

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
        {error === "network" && (
          <div className="flex items-center justify-between gap-4 rounded-2xl border border-rose-400/20 bg-rose-400/[0.07] px-4 py-3">
            <p className="text-xs leading-5 text-rose-100">{t.unavailable}</p>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => void loadDashboard()}
              className="shrink-0 text-rose-100 hover:bg-rose-400/10 hover:text-white"
            >
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
              {t.retry}
            </Button>
          </div>
        )}

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

            <RiskSummaryCard summary={data.riskSummary} t={t} />

            <section>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-semibold">{t.signals}</h2>
                <button onClick={() => openScreen("signals")} className="text-xs text-amber-300">
                  {t.active} <ChevronRight className="inline h-3.5 w-3.5" />
                </button>
              </div>
              <div className="space-y-3">
                {data.activeSignals.length ? (
                  data.activeSignals.slice(0, 2).map(renderSignal)
                ) : (
                  <Card className="border-dashed border-white/10 bg-white/[0.025] text-white">
                    <CardContent className="p-6 text-center text-sm text-slate-500">
                      {t.noSignals}
                    </CardContent>
                  </Card>
                )}
              </div>
            </section>
          </>
        )}

        {screen === "signals" && (
          <section className="space-y-3">
            <div className="mb-5">
              <h1 className="text-xl font-semibold">{t.signals}</h1>
              <p className="mt-1 text-xs text-slate-500">
                {data.activeSignals.length} {t.active.toLowerCase()}
              </p>
            </div>
            {data.activeSignals.length ? (
              data.activeSignals.map(renderSignal)
            ) : (
              <Card className="border-dashed border-white/10 bg-white/[0.025] text-white">
                <CardContent className="p-8 text-center text-sm text-slate-500">
                  {t.noSignals}
                </CardContent>
              </Card>
            )}
          </section>
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
                  <p className="text-xs text-slate-500">{t.scenarioResults}</p>
                </div>
              </div>
            </section>

            <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {(["7d", "30d", "90d", "all"] as const).map((period) => {
                const block = data.performance.periods[period] ?? emptyPerformance;
                return (
                  <Card key={period} className="border-white/10 bg-white/[0.045] text-white shadow-none">
                    <CardContent className="p-4">
                      <p className="text-xs text-slate-500">{periodLabels[language][period]}</p>
                      <p className="mt-3 text-xl font-semibold">{signedR(block.totalR)}</p>
                      <p className="mt-2 text-xs text-slate-400">
                        {block.closedSignals} · {formatNumber(block.winRatePercent, 1)}%
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

            <Card className="border-white/10 bg-white/[0.045] text-white shadow-none">
              <CardContent className="p-5">
                <div className="flex items-center gap-2">
                  <FileClock className="h-4 w-4 text-amber-300" />
                  <p className="font-medium">{t.methodology}</p>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-400">{t.methodologyNote}</p>
                <Badge variant="outline" className="mt-4 border-white/10 text-slate-400">
                  {data.methodologyVersion}
                </Badge>
              </CardContent>
            </Card>
          </>
        )}

        {screen === "history" && (
          <section className="space-y-3">
            <div className="mb-5">
              <h1 className="text-xl font-semibold">{t.history}</h1>
              <p className="mt-1 text-xs text-slate-500">{t.scenarioResults}</p>
            </div>
            {data.history.length ? (
              data.history.map((row) => (
                <Card key={row.signalId} className="border-white/10 bg-white/[0.045] text-white shadow-none">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium">{row.label || row.symbol}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {row.direction} · {row.marketGroup}
                        </p>
                      </div>
                      <Badge
                        className={cn(
                          "border-0",
                          Number(row.realizedR) > 0
                            ? "bg-emerald-400/10 text-emerald-300"
                            : Number(row.realizedR) < 0
                              ? "bg-rose-400/10 text-rose-300"
                              : "bg-slate-400/10 text-slate-300",
                        )}
                      >
                        {signedR(row.realizedR)}
                      </Badge>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      {[
                        [t.finalResult, row.finalResult || row.status],
                        [t.mfe, signedR(row.mfeR)],
                        [t.mae, signedR(row.maeR)],
                      ].map(([label, value]) => (
                        <div key={label} className="rounded-xl border border-white/10 bg-black/10 p-2.5">
                          <p className="text-[10px] text-slate-500">{label}</p>
                          <p className="mt-1 text-xs">{value}</p>
                        </div>
                      ))}
                    </div>
                    <p className="mt-3 flex items-center gap-2 text-[11px] text-slate-500">
                      <Clock3 className="h-3 w-3" />
                      {t.closedAt}: {formatDate(row.closedAt, language, true)}
                    </p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="border-dashed border-white/10 bg-white/[0.025] text-white">
                <CardContent className="p-8 text-center text-sm text-slate-500">
                  {t.noHistory}
                </CardContent>
              </Card>
            )}
          </section>
        )}

        {screen === "risk" && (
          <>
            <RiskSummaryCard summary={data.riskSummary} t={t} />
            <RiskProfileForm
              value={riskForm}
              t={t}
              saving={savingRisk}
              saved={riskSaved}
              onChange={setRiskForm}
              onSubmit={(event) => void saveRisk(event)}
            />
          </>
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
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium">{market.label}</p>
                      <span className={cn("h-2 w-2 rounded-full", market.open ? "bg-emerald-400" : "bg-slate-600")} />
                      <Badge variant="outline" className={freshnessTone(market.dataFresh)}>
                        {market.dataFresh ? t.dataFresh : t.dataStale}
                      </Badge>
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

        {screen === "settings" && (
          <>
            <SettingsForm
              value={preferencesForm}
              t={t}
              saving={savingPreferences}
              saved={preferencesSaved}
              onChange={setPreferencesForm}
              onSubmit={(event) => void savePreferences(event)}
            />

            <Card className="border-white/10 bg-white/[0.045] text-white shadow-none">
              <CardContent className="p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium">{t.methodology}</p>
                    <p className="mt-1 text-xs text-slate-500">{data.methodologyVersion}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => openScreen("updates")}
                    className="text-amber-200 hover:bg-amber-300/10 hover:text-amber-100"
                  >
                    <Sparkles className="mr-1.5 h-4 w-4" />
                    {t.updates}
                  </Button>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-400">{t.methodologyNote}</p>
              </CardContent>
            </Card>
          </>
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

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#090b11]/95 pb-[max(env(safe-area-inset-bottom),8px)] pt-2 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl gap-1 overflow-x-auto px-2">
          {navItems.map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => openScreen(key)}
              className={cn(
                "flex min-w-[68px] flex-1 flex-col items-center gap-1 rounded-xl px-2 py-2 text-[9px] transition",
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
