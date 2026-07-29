import type { AppLanguage } from "./types";

export const formatNumber = (value: unknown, digits = 2) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed.toFixed(digits).replace(/\.?0+$/, "") : "—";
};

export const signedR = (value: unknown) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return "—";
  return `${parsed > 0 ? "+" : ""}${formatNumber(parsed, 2)}R`;
};

export const formatDate = (
  value: string | null | undefined,
  language: AppLanguage,
  includeYear = false,
) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat(language === "en" ? "en-GB" : language, {
    timeZone: "Europe/Sofia",
    day: "2-digit",
    month: "2-digit",
    ...(includeYear ? { year: "numeric" as const } : {}),
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
};

export const formatMoney = (
  value: unknown,
  currency: string | null | undefined,
  language: AppLanguage,
) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || !currency) return "—";

  try {
    return new Intl.NumberFormat(language === "en" ? "en-GB" : language, {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(parsed);
  } catch {
    return `${formatNumber(parsed, 2)} ${currency}`;
  }
};

export const freshnessTone = (fresh?: boolean) =>
  fresh
    ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-300"
    : "border-rose-400/25 bg-rose-400/10 text-rose-300";
