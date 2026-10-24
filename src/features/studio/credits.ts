// NICS Studio credits: the same balance as NICS Video (free start or a paid
// plan on /nics-video). The server keeps the balance; the studio asks for it by
// account and reports what it spent.
import type { Account } from "@/features/account/account";

const ENDPOINT = "https://n8n.aibyteconsult.com/webhook/nics-studio-credits";

export type SpendReason = "export" | "agent" | "captions";

export const PRICES: Record<SpendReason, number> = { export: 2, agent: 1, captions: 1 };

export type CreditsError = "no_access" | "not_enough" | "email" | "session" | "network";

export interface CreditsResult {
  ok: boolean;
  credits: number;
  error: CreditsError | null;
}

const call = async (body: Record<string, string>): Promise<CreditsResult> => {
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => null);
    if (!data || typeof data !== "object") return { ok: false, credits: 0, error: "network" };
    return { ok: Boolean(data.ok), credits: Number(data.credits) || 0, error: data.ok ? null : (data.error as CreditsError) || "network" };
  } catch {
    return { ok: false, credits: 0, error: "network" };
  }
};

// A confirmed account sends its session; an email taken on trust (before
// email codes work) sends the email itself.
const who = (a: Account): Record<string, string> => (a.session ? { session: a.session } : { email: a.email });

export const fetchBalance = (a: Account) => call({ action: "balance", ...who(a) });

export const spendCredits = (a: Account, reason: SpendReason) => call({ action: "spend", reason, ...who(a) });
