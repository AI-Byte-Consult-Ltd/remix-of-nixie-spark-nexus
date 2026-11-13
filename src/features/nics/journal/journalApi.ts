/*
 * Personal trade journal API: n8n [44 TRADER] Trade Journal,
 * POST /webhook/nics-journal. Auth = Telegram initData (Mini App) or the
 * cabinet session (web cabinet and Windows app). The journal is private:
 * none of it feeds the public NICS track record.
 */

export const JOURNAL_API_URL = "https://n8n.aibyteconsult.com/webhook/nics-journal";

export interface JournalTrade {
  tradeKey: string;
  source: "manual" | "mt5_report" | "mt5_ea" | string;
  account?: string | null;
  symbol: string;
  side: "BUY" | "SELL";
  volume?: number | null;
  openTime?: string | null;
  closeTime?: string | null;
  openPrice?: number | null;
  closePrice?: number | null;
  stopLoss?: number | null;
  takeProfit?: number | null;
  profit?: number | null;
  commission?: number | null;
  swap?: number | null;
  currency?: string | null;
  signalId?: string | null;
  setup?: string | null;
  emotion?: string | null;
  note?: string | null;
}

/** A NICS signal the user pressed "Accept" on (signal_deliveries ACCEPTED). */
export interface JournalSignal {
  signalId: string;
  symbol: string;
  label?: string | null;
  direction: "LONG" | "SHORT" | string;
  entryLow?: number | null;
  entryHigh?: number | null;
  stopLoss?: number | null;
  tp1?: number | null;
  status?: string | null;
  realizedR?: number | null;
  createdAt?: string | null;
  closedAt?: string | null;
  exitPrice?: number | null;
  acceptedAt?: string | null;
  d1?: string | null;
  h4?: string | null;
  mtfAlignment?: string | null;
  m15Correction?: string | null;
  quality?: string | null;
}

export interface JournalData {
  trades: JournalTrade[];
  signals: JournalSignal[];
  journalKey: string | null;
  telegramLinked: boolean;
}

export type NewTrade = Omit<JournalTrade, "tradeKey"> & { tradeKey?: string; externalId?: string };

export interface JournalAuth {
  initData?: string;
  cabinetSession?: string;
}

export class JournalApiError extends Error {
  constructor(readonly code: string) {
    super(code);
    this.name = "JournalApiError";
  }
}

const call = async <T>(auth: JournalAuth, action: string, payload: Record<string, unknown> = {}): Promise<T> => {
  const response = await fetch(JOURNAL_API_URL, {
    method: "POST",
    // text/plain keeps it a "simple" request (no CORS preflight).
    headers: { "Content-Type": "text/plain;charset=UTF-8" },
    body: JSON.stringify({
      action,
      ...(auth.initData ? { initData: auth.initData } : { cabinetSession: auth.cabinetSession }),
      ...payload,
    }),
  });
  const result = (await response.json().catch(() => null)) as { ok?: boolean; code?: string; data?: T } | null;
  if (!response.ok || !result?.ok) throw new JournalApiError(result?.code || "REQUEST_FAILED");
  return result.data as T;
};

export const loadJournal = (auth: JournalAuth) => call<JournalData>(auth, "list");

export const saveTrades = (auth: JournalAuth, trades: NewTrade[]) =>
  call<{ saved: number; received: number }>(auth, "save", { trades });

export const deleteTrade = (auth: JournalAuth, tradeKey: string) =>
  call<{ deleted: number }>(auth, "delete", { tradeKey });

export const createJournalKey = (auth: JournalAuth) => call<{ journalKey: string }>(auth, "key");
