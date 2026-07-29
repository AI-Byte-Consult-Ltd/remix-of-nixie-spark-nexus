export type AppLanguage = "ru" | "bg" | "en";

export type Screen =
  | "dashboard"
  | "performance"
  | "signals"
  | "history"
  | "risk"
  | "markets"
  | "settings"
  | "updates";

export interface TelegramWebApp {
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

export interface PerformanceBlock {
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

export interface FreshnessInterval {
  latestCandleTime?: string | null;
  ageMinutes?: number | null;
  fresh: boolean;
}

export interface SignalFreshness {
  fiveMinute: FreshnessInterval;
  fifteenMinute: FreshnessInterval;
  bothFresh: boolean;
}

export interface SignalRow {
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
  priceAsOf?: string | null;
  priceSource?: string | null;
  sourceInstance?: string | null;
  brokerServer?: string | null;
  validUntil?: string | null;
  publishedAt?: string | null;
  acceptedAt?: string | null;
  lastCheckedAt?: string | null;
  hitTargets?: number[];
  breakevenActivated?: boolean;
  spreadAtSignal?: number | null;
  slippageAllowance?: number | null;
  initialRisk?: number | null;
  liveStatus?: string;
  distanceFromEntry?: number | null;
  freshness?: SignalFreshness;
  correlationGroup?: string;
  accessType?: string;
}

export interface SignalHistoryRow {
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
  hitTargets?: number[];
  breakevenActivated?: boolean;
  finalResult?: string | null;
  status: string;
  realizedR: number;
  mfeR: number;
  maeR: number;
  createdAt?: string | null;
  publishedAt?: string | null;
  acceptedAt?: string | null;
  closedAt?: string | null;
}

export interface RiskProfile {
  accountCurrency: string;
  accountBalance: number | null;
  rememberBalance: boolean;
  riskPercent: number;
  maxTotalRiskPercent: number;
  maxCorrelatedRiskPercent: number;
}

export interface CorrelationRiskBlock {
  scenarioCount: number;
  plannedRiskPercent: number;
}

export interface RiskSummary {
  activeScenarioCount: number;
  plannedTotalRiskPercent: number;
  maxTotalRiskPercent: number;
  totalLimitExceeded: boolean;
  largestCorrelatedRiskPercent: number;
  maxCorrelatedRiskPercent: number;
  correlationLimitExceeded: boolean;
  byCorrelationGroup: Record<string, CorrelationRiskBlock>;
  basis: "accepted_open_scenarios" | string;
}

export interface UserPreferences {
  experienceMode: "BEGINNER" | "PROFESSIONAL";
  signalFrequency: "ALL" | "IMPORTANT";
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  riskDisclosureAccepted: boolean;
  riskDisclosureAcceptedAt?: string | null;
}

export interface SizingResult {
  available: boolean;
  reason?: string;
  signalId?: string;
  symbol?: string;
  brokerSymbol?: string | null;
  accountCurrency?: string;
  accountBalance?: number;
  riskPercent?: number;
  riskAmount?: number;
  entryPrice?: number;
  stopLoss?: number;
  stopDistance?: number;
  lossPerLot?: number;
  mathematicalLot?: number;
  brokerStepLot?: number | null;
  volumeMin?: number;
  volumeMax?: number;
  volumeStep?: number;
  minimumLotWarning?: boolean;
  lossAtMinimumLot?: number;
  estimatedMargin?: number | null;
  marginCurrency?: string | null;
  specificationUpdatedAt?: string | null;
  methodologyVersion?: string;
}

export interface MarketRow {
  key: string;
  label: string;
  symbols: string[];
  selected: boolean;
  open: boolean;
  schedule: string;
  dataFresh?: boolean;
}

export interface FeatureFlags {
  scenarioSizing: boolean;
  portfolioRisk: boolean;
  correlationRisk: boolean;
  history: boolean;
  stocks: boolean;
  autoExecution: boolean;
}

export interface AppPayload {
  ok: boolean;
  apiVersion: string;
  methodologyVersion: string;
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
  history: SignalHistoryRow[];
  performance: {
    periods: Record<"7d" | "30d" | "90d" | "all", PerformanceBlock>;
    byMarket: Record<string, PerformanceBlock>;
  };
  riskProfile: RiskProfile;
  riskSummary: RiskSummary;
  preferences: UserPreferences;
  sizing?: SizingResult | null;
  markets: MarketRow[];
  features: FeatureFlags;
  updates: Array<{
    version: string;
    date: string;
    title: string;
    items: string[];
  }>;
}

export interface ApiResponse {
  ok: boolean;
  message?: string;
  code?: string;
  data?: AppPayload;
}
