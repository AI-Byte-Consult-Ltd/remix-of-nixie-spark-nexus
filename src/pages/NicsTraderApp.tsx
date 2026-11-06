import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  BarChart3,
  Bot,
  Calculator,
  CalendarDays,
  ChevronRight,
  Clock3,
  FileClock,
  Gauge,
  Gift,
  History,
  Info,
  LayoutDashboard,
  LineChart,
  ExternalLink,
  Newspaper,
  Loader2,
  Radar,
  RefreshCw,
  Settings2,
  ShieldCheck,
  Signal,
  Sparkles,
  Server,
  TrendingUp,
  Users,
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
import { AboutPanel } from "@/features/nics/AboutPanel";
import { ArticlesPanel } from "@/features/nics/ArticlesPanel";
import { EconomicCalendar } from "@/features/nics/EconomicCalendar";
import { BROKER_REFERRAL_URL, openExternal } from "@/features/nics/externalLinks";
import { RiskDisclaimer } from "@/features/nics/RiskDisclaimer";
import { useAppTheme } from "@/lib/appTheme";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AdminHealthDashboard } from "@/features/nics/AdminHealthDashboard";
import { UsageStatsPanel } from "@/features/nics/UsageStatsPanel";
import { TRADER_APP_VERSION, trackUsage } from "@/lib/usageAnalytics";
import { periodLabels, translations } from "@/features/nics/i18n";
import TrackRecordAnalytics from "@/components/trading/TrackRecordAnalytics";
import { usePublicPerformance } from "@/lib/publicPerformance";
import { ReferralCabinet } from "@/features/nics/ReferralCabinet";
import { RewardsCabinet } from "@/features/nics/RewardsCabinet";
import { RiskProfileForm } from "@/features/nics/RiskProfileForm";
import { RiskSummaryCard } from "@/features/nics/RiskSummaryCard";
import { SettingsForm } from "@/features/nics/SettingsForm";
import { SignalCard } from "@/features/nics/SignalCard";
import {
  RequestStatusBanner,
  SignalRequestPanel,
  type RequestState,
} from "@/features/nics/SignalRequestPanel";
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

const APP_VERSION = TRADER_APP_VERSION;

// Access card: show market names ("Gold", "Forex"), not internal keys.
const selectedMarketNames = (payload: AppPayload) =>
  payload.selectedMarkets.map(
    (key) => payload.markets?.find((market) => market.key === key)?.label ?? key,
  );

const APP_LANGUAGES: AppLanguage[] = ["ru", "bg", "en", "es", "pt"];
const toAppLanguage = (value?: string | null): AppLanguage =>
  APP_LANGUAGES.includes(value as AppLanguage) ? (value as AppLanguage) : "en";

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

const SCREENS: Screen[] = [
  "dashboard",
  "performance",
  "signals",
  "history",
  "risk",
  "referral",
  "rewards",
  "admin",
  "markets",
  "settings",
  "updates",
  "request",
  "about",
  "articles",
  "calendar",
];

// After a signal request the panel re-reads the dashboard this often, this
// many times (about 3 minutes), to show the new signal as soon as it lands.
const REQUEST_POLL_MS = 20_000;
const REQUEST_POLL_TIMES = 9;

type HorizonFilter = "all" | "short" | "mid" | "long";
type ResultFilter = "all" | "win" | "loss" | "flat";

const horizonOf = (minutes?: number | null): Exclude<HorizonFilter, "all"> => {
  const value = Number(minutes ?? 180);
  if (value <= 60) return "short";
  if (value <= 180) return "mid";
  return "long";
};

const FilterChips = <T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: Array<{ key: T; label: string }>;
  onChange: (next: T) => void;
}) => (
  <div className="flex flex-wrap items-center gap-1.5">
    <span className="mr-1 text-[11px] uppercase tracking-wide text-slate-500">{label}</span>
    {options.map((option) => (
      <button
        key={option.key}
        type="button"
        onClick={() => onChange(option.key)}
        className={cn(
          "rounded-full border px-3 py-1 text-xs transition",
          value === option.key
            ? "border-amber-300/50 bg-amber-300/15 text-amber-200"
            : "border-white/10 text-slate-400 hover:text-slate-200",
        )}
      >
        {option.label}
      </button>
    ))}
  </div>
);

export const isTraderScreen = (value: string | undefined): value is Screen =>
  Boolean(value && (SCREENS as string[]).includes(value));

/*
 * Outside Telegram (the web cabinet and the Windows app) the same dashboard
 * runs on the cabinet session instead of Telegram initData: the API calls go
 * through [30 CABINET] Trader Bridge, the screen lives in the URL and the
 * cabinet's own header and sidebar replace the Mini App chrome.
 */
export interface NicsTraderAppProps {
  cabinetSession?: string;
  cabinetLanguage?: string;
  cabinetScreen?: string;
  onCabinetNavigate?: (screen: Screen) => void;
  onCabinetSessionInvalid?: () => void;
}

const NicsTraderApp = ({
  cabinetSession,
  cabinetLanguage,
  cabinetScreen,
  onCabinetNavigate,
  onCabinetSessionInvalid,
}: NicsTraderAppProps = {}) => {
  const embedded = Boolean(cabinetSession);
  const telegram = embedded ? undefined : window.Telegram?.WebApp;
  const telegramLanguage = embedded
    ? cabinetLanguage?.slice(0, 2)
    : telegram?.initDataUnsafe?.user?.language_code?.slice(0, 2);
  const initialSignalId = useMemo(() => {
    const parameters = new URLSearchParams(window.location.search);
    const directSignalId = parameters.get("signalId");
    if (directSignalId) return directSignalId.slice(0, 160);

    const startParameter = telegram?.initDataUnsafe?.start_param ?? "";
    return startParameter.startsWith("signal_")
      ? startParameter.slice("signal_".length, "signal_".length + 160)
      : "";
  }, [telegram?.initDataUnsafe?.start_param]);
  const [language, setLanguage] = useState<AppLanguage>(toAppLanguage(telegramLanguage));
  const [screen, setScreen] = useState<Screen>(
    embedded
      ? isTraderScreen(cabinetScreen)
        ? cabinetScreen
        : "dashboard"
      : initialSignalId
      ? "signals"
      : (() => {
          // Deep links from the bot, e.g. /nics-app/?screen=articles.
          const requested = new URLSearchParams(window.location.search).get("screen") ?? undefined;
          return isTraderScreen(requested) && requested !== "admin" ? requested : "dashboard";
        })(),
  );

  useEffect(() => {
    if (embedded) setScreen(isTraderScreen(cabinetScreen) ? cabinetScreen : "dashboard");
  }, [embedded, cabinetScreen]);
  // In the cabinet the language menu decides, not the bot profile.
  useEffect(() => {
    if (!embedded) return;
    setLanguage(toAppLanguage(telegramLanguage));
  }, [embedded, telegramLanguage]);
  const { theme } = useAppTheme();
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
  const [decisionLoadingSignalId, setDecisionLoadingSignalId] = useState<string | null>(null);
  const [checkinLoading, setCheckinLoading] = useState(false);
  const [spinLoading, setSpinLoading] = useState(false);
  /*
   * Bumped on every completed spin so the wheel knows to animate.
   * The spin result itself cannot carry that signal: it has no
   * timestamp, so landing twice on the same sector is indistinguishable
   * from not having span at all.
   */
  const [spinNonce, setSpinNonce] = useState(0);
  const [redeemLoading, setRedeemLoading] = useState(false);
  const [requestState, setRequestState] = useState<RequestState | null>(null);
  const pollTimer = useRef<number | null>(null);
  const [signalMarket, setSignalMarket] = useState("all");
  const [signalHorizon, setSignalHorizon] = useState<HorizonFilter>("all");
  const [historyMarket, setHistoryMarket] = useState("all");
  const [historyResult, setHistoryResult] = useState<ResultFilter>("all");
  const t = translations[language];
  const { data: publicPerformance } = usePublicPerformance();

  useEffect(
    () => () => {
      if (pollTimer.current) window.clearTimeout(pollTimer.current);
    },
    [],
  );

  const callApi = useCallback(
    (action: string, payload: Record<string, unknown> = {}) =>
      callNicsApi({
        action,
        initData: cabinetSession ? "" : window.Telegram?.WebApp?.initData ?? "",
        cabinetSession,
        language,
        payload,
      }),
    [cabinetSession, language],
  );

  const applyPayload = useCallback((payload: AppPayload) => {
    setError(null);
    setData(payload);
    // The bot speaks ru/bg/en/es; a Portuguese Telegram profile keeps the
    // Portuguese app instead of the bot's English fallback.
    if (!embedded) {
      const botLanguage = toAppLanguage(payload.user.language);
      setLanguage(botLanguage === "en" && telegramLanguage === "pt" ? "pt" : botLanguage);
    }
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
  }, [embedded, telegramLanguage]);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await callApi(
        initialSignalId ? "signal_status" : "dashboard",
        initialSignalId ? { signalId: initialSignalId } : {},
      );
      if (!result.data) throw new NicsApiError("REQUEST_FAILED");
      applyPayload(result.data);
    } catch (requestError) {
      const code = requestError instanceof NicsApiError ? requestError.code : "";
      if (embedded && code.startsWith("SESSION_")) onCabinetSessionInvalid?.();
      setError(code === "TELEGRAM_REQUIRED" ? "telegram" : "network");
    } finally {
      setLoading(false);
    }
  }, [applyPayload, callApi, initialSignalId]); // eslint-disable-line react-hooks/exhaustive-deps

  const trackEvent = useCallback(
    async (eventName: string, metadata: Record<string, unknown> = {}) => {
      // Cabinet and Windows app: [43 OPS] App Usage Analytics (platform,
      // version, language). Telegram Mini App: [07 APP] track_event.
      if (embedded && cabinetSession) {
        trackUsage(
          eventName,
          {
            screen: typeof metadata.screen === "string" ? metadata.screen : undefined,
            signalId: typeof metadata.signalId === "string" ? metadata.signalId : undefined,
            language,
          },
          cabinetSession,
        );
        return;
      }
      try {
        await callApi("track_event", {
          eventName,
          metadata: {
            ...metadata,
            source: embedded ? "web_cabinet" : "mini_app",
            appVersion: APP_VERSION,
          },
        });
      } catch {
        // Analytics never blocks the product flow.
      }
    },
    [callApi, cabinetSession, embedded, language],
  );

  useEffect(() => {
    telegram?.ready();
    telegram?.expand();
    void loadDashboard();
  }, [loadDashboard, telegram]);

  useEffect(() => {
    if (embedded) return;
    document.title = "NICS AI Trader";
    const theme = document.querySelector('meta[name="theme-color"]');
    theme?.setAttribute("content", "#07090f");

  }, [embedded]);

  useEffect(() => {
    if (data) {
      void trackEvent("mini_app_opened", { screen });
      if (screen === "referral") void trackEvent("referral_opened", { screen });
    }
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

  const decideSignal = async (
    signalId: string,
    decision: "ACCEPTED" | "DECLINED",
  ) => {
    setDecisionLoadingSignalId(signalId);
    telegram?.HapticFeedback?.impactOccurred("medium");

    try {
      const result = await callApi("signal_decision", { signalId, decision });
      if (!result.data) throw new NicsApiError("REQUEST_FAILED");

      applyPayload(result.data);
      const updatedSignal = result.data.activeSignals.find(
        (signal) => signal.signalId === signalId,
      );
      const succeeded = updatedSignal?.userDecision === decision;

      if (succeeded) {
        telegram?.HapticFeedback?.notificationOccurred("success");
        void trackEvent(
          decision === "ACCEPTED" ? "signal_accepted" : "signal_skipped",
          { signalId, screen: "signals" },
        );
      } else {
        telegram?.HapticFeedback?.notificationOccurred("warning");
      }
    } catch {
      setError("network");
      telegram?.HapticFeedback?.notificationOccurred("error");
    } finally {
      setDecisionLoadingSignalId(null);
    }
  };

  const doCheckin = async () => {
    setCheckinLoading(true);
    telegram?.HapticFeedback?.impactOccurred("light");

    try {
      const result = await callApi("checkin");
      if (result.data) applyPayload(result.data);
      telegram?.HapticFeedback?.notificationOccurred("success");
      void trackEvent("rewards_checkin", { screen: "rewards" });
    } catch {
      setError("network");
      telegram?.HapticFeedback?.notificationOccurred("error");
    } finally {
      setCheckinLoading(false);
    }
  };

  const doSpin = async () => {
    setSpinLoading(true);
    telegram?.HapticFeedback?.impactOccurred("medium");

    try {
      const result = await callApi("spin_wheel");
      if (result.data) applyPayload(result.data);
      setSpinNonce((nonce) => nonce + 1);
      telegram?.HapticFeedback?.notificationOccurred("success");
      void trackEvent("rewards_wheel_spin", { screen: "rewards" });
    } catch {
      setError("network");
      telegram?.HapticFeedback?.notificationOccurred("error");
    } finally {
      setSpinLoading(false);
    }
  };

  const doRedeem = async () => {
    setRedeemLoading(true);
    telegram?.HapticFeedback?.impactOccurred("medium");

    try {
      const result = await callApi("redeem_points");
      if (result.data) applyPayload(result.data);
      telegram?.HapticFeedback?.notificationOccurred("success");
      void trackEvent("rewards_redeem", { screen: "rewards" });
    } catch {
      setError("network");
      telegram?.HapticFeedback?.notificationOccurred("error");
    } finally {
      setRedeemLoading(false);
    }
  };

  /*
   * Items 4 and 5: analysis of one instrument / extra scan. [07 APP] checks
   * access exactly like the bot's "Get signal" button and starts the
   * engine; the new signal then arrives here and in Telegram.
   */
  const orderSignal = async (
    scope: "instrument" | "scan",
    market?: string,
    symbol?: string,
    label?: string,
  ) => {
    if (pollTimer.current) window.clearTimeout(pollTimer.current);
    const key = scope === "scan" ? "scan" : `${market}:${symbol}`;
    const title = label || symbol || t.extraScan;
    const knownSignals = new Set((data?.activeSignals ?? []).map((signal) => signal.signalId));
    setRequestState({ key, label: title, phase: "sending" });
    telegram?.HapticFeedback?.impactOccurred("medium");

    try {
      const result = await callApi("dashboard", {
        signalRequest: { scope, market: market ?? null, symbol: symbol ?? null },
        source: embedded ? "web_cabinet" : "mini_app",
      });
      if (!result.data) throw new NicsApiError("REQUEST_FAILED");
      applyPayload(result.data);
      const status = result.data.signalRequest?.status ?? "INVALID";
      if (embedded && cabinetSession) {
        trackUsage("signal_order_sent", { scope, market: market ?? null, result: status, language }, cabinetSession);
      }
      if (status !== "QUEUED") {
        setRequestState({ key, label: title, phase: "rejected", status });
        telegram?.HapticFeedback?.notificationOccurred("warning");
        return;
      }
      setRequestState({ key, label: title, phase: "waiting", status });
      telegram?.HapticFeedback?.notificationOccurred("success");

      let attempts = 0;
      const poll = async () => {
        attempts += 1;
        try {
          const next = await callApi("dashboard");
          if (next.data) {
            applyPayload(next.data);
            const fresh = next.data.activeSignals.some((signal) => !knownSignals.has(signal.signalId));
            if (fresh) {
              setRequestState({ key, label: title, phase: "done", status });
              telegram?.HapticFeedback?.notificationOccurred("success");
              return;
            }
          }
        } catch {
          // A missed refresh is retried on the next tick.
        }
        if (attempts >= REQUEST_POLL_TIMES) {
          setRequestState({ key, label: title, phase: "no_result", status });
          return;
        }
        pollTimer.current = window.setTimeout(() => void poll(), REQUEST_POLL_MS);
      };
      pollTimer.current = window.setTimeout(() => void poll(), REQUEST_POLL_MS);
    } catch (requestError) {
      const code = requestError instanceof NicsApiError ? requestError.code : "";
      if (embedded && code.startsWith("SESSION_")) onCabinetSessionInvalid?.();
      setRequestState({ key, label: title, phase: "failed" });
      telegram?.HapticFeedback?.notificationOccurred("error");
    }
  };

  const openScreen = (next: Screen) => {
    setScreen(next);
    onCabinetNavigate?.(next);
    telegram?.HapticFeedback?.impactOccurred("light");
    const eventName =
      next === "performance"
        ? "performance_opened"
        : next === "referral"
          ? "referral_opened"
          : "screen_opened";
    void trackEvent(eventName, { screen: next });
  };

  const openTelegramUrl = (url: string) => {
    if (telegram?.openTelegramLink) {
      telegram.openTelegramLink(url);
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const shareReferral = () => {
    const url =
      "https://t.me/share/url?url=" +
      encodeURIComponent(data?.referral.link ?? "") +
      "&text=" +
      encodeURIComponent(t.referralLead);
    void trackEvent("referral_share_opened", { screen: "referral" });
    openTelegramUrl(url);
  };

  const requestReferralPayout = () => {
    void trackEvent("referral_payout_opened", { screen: "referral" });
    openTelegramUrl("https://t.me/nics_ai_bot?start=payout");
  };

  const shellClass = embedded
    ? "grid min-h-[60vh] place-items-center rounded-3xl bg-[#07090f] px-6 text-white"
    : "grid min-h-screen place-items-center bg-[#07090f] px-6 text-white";

  if (loading) {
    return (
      <main className={shellClass}>
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
      <main className={shellClass}>
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
    { key: "request", icon: Radar, label: t.request },
    { key: "signals", icon: Signal, label: t.signals },
    { key: "calendar", icon: CalendarDays, label: t.calendar },
    { key: "risk", icon: Calculator, label: t.risk },
    { key: "referral", icon: Users, label: t.referrals },
    { key: "rewards", icon: Gift, label: t.rewards },
    { key: "performance", icon: BarChart3, label: t.performance },
    { key: "history", icon: History, label: t.history },
    { key: "markets", icon: Activity, label: t.markets },
    { key: "articles", icon: Newspaper, label: t.articles },
    { key: "settings", icon: Settings2, label: t.settings },
    { key: "about", icon: Info, label: t.about },
    ...(data.user.isAdmin && data.adminHealth
      ? [{ key: "admin" as Screen, icon: Server, label: t.adminHealth }]
      : []),
  ];

  const metricCards = [
    { label: t.active, value: data.activeSignals.length, icon: Signal, tone: "text-amber-300" },
    { label: t.totalR, value: signedR(allTime.totalR), icon: TrendingUp, tone: "text-emerald-300" },
    { label: t.expectancy, value: signedR(allTime.expectancyR), icon: Gauge, tone: "text-sky-300" },
    {
      label: t.winRate,
      value: `${formatNumber(allTime.winRatePercent, 1)}%`,
      icon: BarChart3,
      tone: "text-rose-300",
    },
  ];

  const marketOptions: Array<{ key: string; label: string }> = [
    { key: "all", label: t.filterAll },
    ...data.markets.map((market) => ({ key: market.key, label: market.label })),
  ];
  const filteredSignals = data.activeSignals.filter(
    (signal) =>
      (signalMarket === "all" || signal.marketGroup === signalMarket) &&
      (signalHorizon === "all" || horizonOf(signal.maxHoldMinutes) === signalHorizon),
  );
  const filteredHistory = data.history.filter((row) => {
    if (historyMarket !== "all" && row.marketGroup !== historyMarket) return false;
    const r = Number(row.realizedR);
    if (historyResult === "win") return r > 0;
    if (historyResult === "loss") return r < 0;
    if (historyResult === "flat") return r === 0;
    return true;
  });

  const renderSignal = (signal: AppPayload["activeSignals"][number]) => (
    <SignalCard
      key={signal.signalId}
      signal={signal}
      language={language}
      t={t}
      sizing={sizingSignalId === signal.signalId ? sizing : null}
      sizingLoading={sizingLoading && sizingSignalId === signal.signalId}
      decisionLoading={decisionLoadingSignalId === signal.signalId}
      onCalculate={(signalId) => void calculateSizing(signalId)}
      onRefresh={(signalId) => void refreshSignal(signalId)}
      onDecision={(signalId, decision) => void decideSignal(signalId, decision)}
    />
  );

  const navButtons = navItems.map(({ key, icon: Icon, label }) => (
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
  ));

  return (
    <main
      className={cn(
        "bg-[#07090f] text-white",
        theme === "light" && "nics-light",
        embedded ? "overflow-hidden rounded-3xl pb-4" : "min-h-screen pb-24",
      )}
    >
      {embedded && (
        <nav className="border-b border-white/10 px-2 pt-2">
          <div className="flex gap-1 overflow-x-auto pb-2">{navButtons}</div>
        </nav>
      )}
      {!embedded && (
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
          <div className="flex items-center gap-3">
          <ThemeToggle language={language} className="border-white/10 text-slate-400 hover:text-white" />
          <div className="text-right">
            <Badge className="bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400/10">
              {data.access.label}
            </Badge>
            <p className="mt-1 text-[10px] text-slate-600">{t.secure}</p>
          </div>
          </div>
        </div>
      </header>
      )}

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
                    {selectedMarketNames(data).join(" · ") || "—"}
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

            <button
              type="button"
              onClick={() => openScreen("request")}
              className="flex w-full items-center justify-between gap-4 rounded-2xl border border-amber-300/25 bg-amber-300/[0.06] px-4 py-3 text-left transition hover:bg-amber-300/10"
            >
              <span className="flex items-center gap-3">
                <Radar className="h-5 w-5 text-amber-300" />
                <span>
                  <span className="block text-sm font-medium">{t.request}</span>
                  <span className="block text-xs text-slate-400">{t.extraScan}</span>
                </span>
              </span>
              <ChevronRight className="h-4 w-4 text-amber-300" />
            </button>

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
            {requestState && (
              <RequestStatusBanner state={requestState} t={t} onOpenSignals={() => openScreen("signals")} />
            )}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-2">
                <FilterChips label={t.filterMarket} value={signalMarket} options={marketOptions} onChange={setSignalMarket} />
                <FilterChips<HorizonFilter>
                  label={t.filterHorizon}
                  value={signalHorizon}
                  options={[
                    { key: "all", label: t.filterAll },
                    { key: "short", label: t.horizonShort },
                    { key: "mid", label: t.horizonMid },
                    { key: "long", label: t.horizonLong },
                  ]}
                  onChange={setSignalHorizon}
                />
              </div>
              <Button size="sm" onClick={() => openScreen("request")} className="bg-amber-400 text-black hover:bg-amber-300">
                <Radar className="mr-1.5 h-4 w-4" />
                {t.request}
              </Button>
            </div>
            {filteredSignals.length ? (
              filteredSignals.map(renderSignal)
            ) : (
              <Card className="border-dashed border-white/10 bg-white/[0.025] text-white">
                <CardContent className="p-8 text-center text-sm text-slate-500">
                  {data.activeSignals.length ? t.noMatches : t.noSignals}
                </CardContent>
              </Card>
            )}
          </section>
        )}

        {screen === "performance" && (
          <>
            <section className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-rose-400/10 text-rose-300">
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

            {/* 2026-11-04: equity curve, drawdown, profit factor, per-instrument
                table and calendar periods, from the same public track record
                the site shows (only strong signals). */}
            {publicPerformance?.trades?.length ? (
              <TrackRecordAnalytics
                trades={publicPerformance.trades}
                language={language}
                variant="app"
              />
            ) : null}

            <Card className="border-emerald-300/15 bg-emerald-400/[0.045] text-white shadow-none">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-emerald-300" />
                      <p className="font-medium">{t.verifiedPerformance}</p>
                    </div>
                    <p className="mt-3 max-w-2xl text-xs leading-5 text-slate-400">
                      {t.verifiedBasis}
                    </p>
                  </div>
                  <Badge className="border-0 bg-emerald-400/10 text-emerald-300">
                    {t.sampleSize}: {data.performance.audit?.sampleSize ?? 0}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <section className="space-y-3">
              <h2 className="text-sm font-medium text-slate-300">{t.byStrategy}</h2>
              {Object.entries(data.performance.byStrategy ?? {}).length ? (
                <div className="grid gap-3 md:grid-cols-2">
                  {Object.entries(data.performance.byStrategy).map(([version, block]) => (
                    <Card key={version} className="border-white/10 bg-white/[0.045] text-white shadow-none">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-medium">{version}</p>
                            <p className="mt-1 text-xs text-slate-500">
                              {t.sampleSize}: {block.closedSignals}
                            </p>
                          </div>
                          <Badge variant="outline" className="border-white/10 text-slate-300">
                            {signedR(block.expectancyR)}
                          </Badge>
                        </div>
                        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                          {[
                            [t.winRate, `${formatNumber(block.winRatePercent, 1)}%`],
                            [t.totalR, signedR(block.totalR)],
                            [t.averageHolding, `${formatNumber(block.averageHoldingMinutes, 0)} ${t.minutes}`],
                          ].map(([label, value]) => (
                            <div key={label} className="rounded-xl border border-white/10 bg-black/10 p-2.5">
                              <p className="text-[10px] text-slate-500">{label}</p>
                              <p className="mt-1 text-xs">{value}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="border-dashed border-white/10 bg-white/[0.025] text-white">
                  <CardContent className="p-6 text-center text-sm text-slate-500">
                    {t.noClosed}
                  </CardContent>
                </Card>
              )}
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
            <div className="space-y-2">
              <FilterChips label={t.filterMarket} value={historyMarket} options={marketOptions} onChange={setHistoryMarket} />
              <FilterChips<ResultFilter>
                label={t.filterResult}
                value={historyResult}
                options={[
                  { key: "all", label: t.filterAll },
                  { key: "win", label: t.resultWin },
                  { key: "loss", label: t.resultLoss },
                  { key: "flat", label: t.resultFlat },
                ]}
                onChange={setHistoryResult}
              />
            </div>
            {filteredHistory.length ? (
              filteredHistory.map((row) => (
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
                  {data.history.length ? t.noMatches : t.noHistory}
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

        {screen === "referral" && (
          <ReferralCabinet
            program={data.referral}
            language={language}
            t={t}
            onCopy={() => {
              telegram?.HapticFeedback?.notificationOccurred("success");
              void trackEvent("referral_link_copied", { screen: "referral" });
            }}
            onShare={shareReferral}
            onPayout={requestReferralPayout}
          />
        )}

        {screen === "rewards" && (
          <RewardsCabinet
            rewards={data.rewards}
            language={language}
            t={t}
            accessMode={data.access.mode}
            checkinLoading={checkinLoading}
            spinLoading={spinLoading}
            spinNonce={spinNonce}
            redeemLoading={redeemLoading}
            onCheckin={() => void doCheckin()}
            onSpin={() => void doSpin()}
            onRedeem={() => void doRedeem()}
          />
        )}

        {screen === "admin" && data.user.isAdmin && data.adminHealth && (
          <div className="space-y-6">
            <UsageStatsPanel session={embedded ? cabinetSession ?? null : null} language={language} />
            <AdminHealthDashboard
              health={data.adminHealth}
              language={language}
              t={t}
            />
          </div>
        )}

        {screen === "markets" && (
          <section className="space-y-3">
            <div className="mb-5">
              <h1 className="text-xl font-semibold">{t.markets}</h1>
              <p className="mt-1 text-xs text-slate-500">{selectedMarketNames(data).join(" · ")}</p>
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
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {(market.instruments ?? market.symbols.map((symbol) => ({ symbol, label: symbol, open: market.open }))).map((item) => (
                        <button
                          key={item.symbol}
                          type="button"
                          disabled={!item.open || requestState?.phase === "sending" || requestState?.phase === "waiting"}
                          onClick={() => {
                            openScreen("request");
                            void orderSignal("instrument", market.key, item.symbol, item.label);
                          }}
                          title={t.analyse}
                          className={cn(
                            "rounded-full border px-2.5 py-0.5 text-[11px] transition",
                            item.open
                              ? "border-amber-300/30 text-amber-100 hover:bg-amber-300/10"
                              : "border-white/10 text-slate-600",
                          )}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                    {BROKER_REFERRAL_URL && (
                      <button
                        type="button"
                        onClick={() => openExternal(BROKER_REFERRAL_URL)}
                        className="mt-2 inline-flex items-center gap-1 text-[11px] text-sky-300 hover:text-sky-200"
                      >
                        <ExternalLink className="h-3 w-3" />
                        {t.openAtBroker}
                      </button>
                    )}
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
                    onClick={() => openScreen("about")}
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

        {screen === "request" && (
          <SignalRequestPanel
            markets={data.markets}
            t={t}
            request={requestState}
            onRequest={(scope, market, symbol, label) => void orderSignal(scope, market, symbol, label)}
            onOpenSignals={() => openScreen("signals")}
          />
        )}

        {screen === "about" && (
          <AboutPanel t={t} language={language} appVersion={APP_VERSION} updates={data.updates} />
        )}

        {screen === "articles" && <ArticlesPanel t={t} language={language} />}

        {screen === "calendar" && <EconomicCalendar language={language} />}

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

        <RiskDisclaimer t={t} />
      </div>

      {!embedded && (
        <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#090b11]/95 pb-[max(env(safe-area-inset-bottom),8px)] pt-2 backdrop-blur-xl">
          <div className="mx-auto flex max-w-3xl gap-1 overflow-x-auto px-2">{navButtons}</div>
        </nav>
      )}
    </main>
  );
};

export default NicsTraderApp;
