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

export interface SubscriptionResponseData {
  renewedToken?: string;
  subscription: CabinetSubscription | null;
}

export interface CabinetApiResponse<T = unknown> {
  ok: boolean;
  code?: string;
  message?: string;
  data?: T;
}
