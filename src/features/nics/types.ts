export type AppLanguage = "ru" | "bg" | "en" | "es" | "pt";

export type Screen =
  | "dashboard"
  | "performance"
  | "signals"
  | "history"
  | "risk"
  | "referral"
  | "rewards"
  | "admin"
  | "markets"
  | "settings"
  | "updates"
  | "request"
  | "about"
  | "articles"
  | "calendar"
  | "requested"
  | "journal";

export interface TelegramWebApp {
  initData: string;
  colorScheme?: "light" | "dark";
  ready: () => void;
  expand: () => void;
  close: () => void;
  openTelegramLink?: (url: string) => void;
  openLink?: (url: string) => void;
  HapticFeedback?: {
    impactOccurred: (style: "light" | "medium" | "heavy") => void;
    notificationOccurred: (type: "error" | "success" | "warning") => void;
  };
  initDataUnsafe?: {
    start_param?: string;
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

export interface StrategyPerformanceBlock extends PerformanceBlock {
  averageHoldingMinutes: number;
  firstClosedAt?: string | null;
  lastClosedAt?: string | null;
}

export interface PerformanceAudit {
  verified: boolean;
  basis: "user_accepted_delivered_closed" | string;
  unit: "R" | string;
  sampleSize: number;
  firstClosedAt?: string | null;
  lastClosedAt?: string | null;
  strategyVersions: string[];
  includedStatuses: string[];
  excludes: string[];
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
  tradeExpiresAt?: string | null;
  maxHoldMinutes?: number | null;
  strategyVersion?: string | null;
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
  confidence?: number | null;
  userDecision?: "PENDING" | "ACCEPTED" | "DECLINED" | string;
  decisionReason?: string | null;
  // 2026-11-11: stored-for-user time, Telegram delivery state and origin.
  deliveredAt?: string | null;
  deliveryStatus?: "PENDING" | "SENT" | "FAILED" | string;
  originMode?: "SCHEDULED" | "TARGETED" | string;
  requestId?: string | null;
  setupQuality?: "STRONG" | "RELAXED" | "WEAK" | string;
  analysis?: {
    why?: string[];
    news?: string[];
    riskFlags?: string[];
    summary?: string;
  } | null;
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
  exitPrice?: string | number | null;
  tradeExpiresAt?: string | null;
  strategyVersion?: string | null;
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

export interface MarketInstrument {
  symbol: string;
  label: string;
  open: boolean;
  dataFresh?: boolean;
  // Exact name to search for in MT5 (e.g. NAS100.r), when [07 APP] sends it.
  brokerSymbol?: string | null;
}

export interface MarketRow {
  key: string;
  label: string;
  symbols: string[];
  instruments?: MarketInstrument[];
  selected: boolean;
  open: boolean;
  schedule: string;
  dataFresh?: boolean;
}

/*
 * 2026-11-11: real progress of an ordered analysis, from [07 APP]
 * "Load Analysis Progress". scan = the [01 CORE] audit row of this
 * request (null until the engine has read the market); delivered = the
 * signals stored for this request.
 */
export interface AnalysisCandidate {
  symbol: string;
  direction?: string | null;
  status?: string | null;
  htfTrend?: string | null;
  macroSlowBias?: string | null;
  setupType?: string | null;
  regime?: string | null;
  orderType?: string | null;
  d1?: string | null;
  h4?: string | null;
  alignment?: string | null;
  m15Correction?: string | null;
  eventBlackout?: boolean;
  relevantEvents?: number;
}

export interface AnalysedInstrument {
  symbol: string;
  fresh?: boolean | null;
  freshFrames?: number | null;
  tf?: Record<string, number | null> | null;
}

export interface AnalysisProgress {
  requestId: string;
  checkedAt: string;
  scan: {
    generatedAt: string;
    dataQuality?: { receivedSeries?: number; validSeries?: number; invalidSeries?: number } | null;
    highImpactSoon?: number;
    candidates: AnalysisCandidate[];
    analysed: AnalysedInstrument[];
  } | null;
  delivered: Array<{ signalId: string; symbol: string; direction: string; createdAt: string }>;
}

export interface SignalRequestResult {
  status:
    | "QUEUED"
    | "TOO_SOON"
    | "NO_ACCESS"
    | "MARKET_NOT_INCLUDED"
    | "MARKET_CLOSED"
    | "INVALID"
    | string;
  requestId?: string;
  scope: "instrument" | "scan";
  market?: string | null;
  symbol?: string | null;
  markets?: string[];
  requestedAt?: string;
}

export interface FeatureFlags {
  scenarioSizing: boolean;
  portfolioRisk: boolean;
  correlationRisk: boolean;
  history: boolean;
  adminHealth: boolean;
  stocks: boolean;
  autoExecution: boolean;
  rewards: boolean;
}

export type WheelRewardType = "EMPTY" | "POINTS" | "VOUCHER";

export interface WheelSpinResult {
  sectorIndex: number;
  rewardType: WheelRewardType;
  rewardValue: string | null;
}

export interface SignalVoucher {
  id: number;
  source: "WHEEL" | "POINTS_REDEEM" | string;
  market?: string | null;
  createdAt?: string | null;
}

export interface RewardsState {
  pointsBalance: number;
  checkedInToday: boolean;
  wheelAvailableToday: boolean;
  lastWheelSpin: WheelSpinResult | null;
  availableVouchers: SignalVoucher[];
  pointsPerCheckin: number;
  pointsToRedeemSignal: number;
}

export interface ReferralPlan {
  code: string;
  priceXtr: number;
  commissionXtr: number;
}

export interface ReferralUser {
  username?: string | null;
  firstName?: string | null;
  joinedAt?: string | null;
  hasPaid: boolean;
}

export interface ReferralPayoutRequest {
  id: number;
  amountXtr: number;
  status: string;
  requestedAt?: string | null;
  processedAt?: string | null;
}

export interface ReferralProgram {
  programActive: boolean;
  commissionRatePercent: number;
  code: string;
  link: string;
  referralCount: number;
  payingReferralCount: number;
  grossPaymentsXtr: number;
  earnedLifetimeXtr: number;
  availableXtr: number;
  pendingXtr: number;
  paidXtr: number;
  reversedXtr: number;
  latestPayoutRequest?: ReferralPayoutRequest | null;
  recentReferrals: ReferralUser[];
  plans: ReferralPlan[];
}

export interface AdminHealthSymbol {
  symbol: string;
  brokerSymbol?: string | null;
  lastReceivedAt?: string | null;
  ageSeconds?: number | null;
  complete?: boolean;
  updatedAt?: string | null;
}

export interface AdminHealth {
  checkedAt: string;
  overallStatus: "HEALTHY" | "DEGRADED" | "OFFLINE" | string;
  alibaba: {
    sourceInstance?: string | null;
    bridgeVersion?: string | null;
    accountServer?: string | null;
    lastReceivedAt?: string | null;
    ageSeconds?: number | null;
    online: boolean;
    symbolCount: number;
    symbols: AdminHealthSymbol[];
  };
  specifications: {
    total: number;
    complete: number;
    allComplete: boolean;
    latestUpdatedAt?: string | null;
    symbols: AdminHealthSymbol[];
  };
  core: {
    lastScanAt?: string | null;
    ageMinutes?: number | null;
    runId?: string | null;
    signalCount?: number | null;
    dataQuality?: Record<string, unknown> | null;
  };
  delivery: {
    lastSignalDeliveredAt?: string | null;
    lastLifecycleAt?: string | null;
    failures24h: number;
    lifecycleFailures24h: number;
  };
  channels: {
    lastSentAt?: string | null;
    sentToday: number;
    failuresToday: number;
    policy: string;
  };
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
    isAdmin?: boolean;
  };
  access: {
    mode: string;
    label: string;
    expiresAt?: string | null;
  };
  selectedMarkets: string[];
  activeSignals: SignalRow[];
  requestedSignals?: RequestedSignalRow[];
  history: SignalHistoryRow[];
  performance: {
    periods: Record<"7d" | "30d" | "90d" | "all", PerformanceBlock>;
    byMarket: Record<string, PerformanceBlock>;
    byStrategy: Record<string, StrategyPerformanceBlock>;
    audit: PerformanceAudit;
  };
  rewards: RewardsState;
  riskProfile: RiskProfile;
  riskSummary: RiskSummary;
  preferences: UserPreferences;
  referral: ReferralProgram;
  adminHealth?: AdminHealth | null;
  sizing?: SizingResult | null;
  markets: MarketRow[];
  signalRequest?: SignalRequestResult | null;
  analysisProgress?: AnalysisProgress | null;
  features: FeatureFlags;
  updates: Array<{
    version: string;
    date: string;
    title: string;
    items: string[];
  }>;
}

/*
 * 2026-11-11: a signal this user ordered (bot button or app), any state.
 * [07 APP] requestedSignals, last 30 days. Same rows as signal_deliveries,
 * so a decision made in Telegram shows here and the other way round.
 */
export interface RequestedSignalRow {
  signalId: string;
  symbol: string;
  label?: string;
  marketGroup?: string;
  direction: "LONG" | "SHORT" | string;
  entryLow?: string | number | null;
  entryHigh?: string | number | null;
  stopLoss?: string | number | null;
  tp1?: string | number | null;
  status: string;
  finalResult?: string | null;
  realizedR?: number | string | null;
  hitTargets?: number[] | null;
  createdAt?: string | null;
  validUntil?: string | null;
  closedAt?: string | null;
  requestId?: string | null;
  setupQuality?: string | null;
  deliveredAt?: string | null;
  deliveryStatus?: string | null;
  userDecision?: string | null;
  decisionReason?: string | null;
  decisionAt?: string | null;
}

export interface ApiResponse {
  ok: boolean;
  message?: string;
  code?: string;
  data?: AppPayload;
}
