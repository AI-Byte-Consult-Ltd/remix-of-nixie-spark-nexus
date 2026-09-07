export type CabinetLanguage =
  | "en"
  | "de"
  | "fr"
  | "ar"
  | "zh"
  | "pl"
  | "tr"
  | "it"
  | "bg"
  | "ru"
  | "es"
  | "pt";

export interface TelegramLoginPayload {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

export interface CabinetUser {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  photoUrl: string;
  language: CabinetLanguage;
}

export interface CabinetSubscription {
  status: string | null;
  expiresAt: string | null;
}

export interface CabinetAcademyProgress {
  passedCount: number;
  totalLessons: number;
  currentSortOrder: number;
}

export interface CabinetCertificate {
  verifySlug: string;
  issuedAt: string;
}

export interface CabinetDashboard {
  user?: { id: number; language: string };
  subscription: CabinetSubscription | null;
  academy: CabinetAcademyProgress;
  certificate: CabinetCertificate | null;
  cashbackAvailableXtr: number;
}

export interface CabinetLesson {
  id: string;
  title: string;
  sortOrder: number;
  passed: boolean;
  current: boolean;
}

export interface LoginResponseData {
  session: string;
  user: CabinetUser;
}

export interface DashboardResponseData {
  renewedToken?: string;
  dashboard: CabinetDashboard;
}

export interface CoursesResponseData {
  renewedToken?: string;
  lessons: CabinetLesson[];
}

export interface CabinetLessonFull {
  id: string;
  moduleNumber: number;
  lessonNumber: number;
  moduleTitle: string;
  title: string;
  bodyHtml: string;
  sortOrder: number;
  passed: boolean;
  prevId: string | null;
  nextId: string | null;
}

export interface AcademyLessonResponseData {
  renewedToken?: string;
  lesson: CabinetLessonFull | null;
}

export interface SubscriptionResponseData {
  renewedToken?: string;
  subscription: CabinetSubscription | null;
}

export interface ProStatsPeriod {
  closed: number;
  wins: number;
  winRate: number;
  totalR: number;
}

export interface ProStatsBySymbol {
  symbol: string;
  closed: number;
  winRate: number;
  totalR: number;
}

export interface ProStatsRecentTrade {
  symbol: string;
  direction: string;
  realizedR: number;
  closedAt: string;
}

export interface ProStats {
  summary: {
    d7: ProStatsPeriod;
    d30: ProStatsPeriod;
    allTime: ProStatsPeriod;
  };
  bySymbol: ProStatsBySymbol[];
  recentTrades: ProStatsRecentTrade[];
}

export interface ProStatsResponseData {
  renewedToken?: string;
  isActive: boolean;
  proStats: ProStats | null;
}

export interface ExportedSignal {
  symbol: string;
  direction: string;
  entryLow: number;
  entryHigh: number;
  stopLoss: number;
  tp1: number | null;
  tp2: number | null;
  tp3: number | null;
  tp4: number | null;
  status: string;
  realizedR: number;
  closedAt: string;
}

export interface ExportSignalsResponseData {
  renewedToken?: string;
  isActive: boolean;
  signals: ExportedSignal[] | null;
}

export interface CabinetApiResponse<T = unknown> {
  ok: boolean;
  code?: string;
  message?: string;
  data?: T;
}
