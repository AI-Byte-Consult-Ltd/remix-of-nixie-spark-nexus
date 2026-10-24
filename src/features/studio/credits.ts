// NICS Studio credits: the same balance as NICS Video (free start or a paid
// plan on /nics-video). The server keeps the balance; the studio asks for it by
// email and reports what it spent.
const ENDPOINT = "https://n8n.aibyteconsult.com/webhook/nics-studio-credits";
const EMAIL_KEY = "nics-studio-email";

export type SpendReason = "export" | "agent" | "captions";

export const PRICES: Record<SpendReason, number> = { export: 2, agent: 1, captions: 1 };

export type CreditsError = "no_access" | "not_enough" | "email" | "network";

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

export const fetchBalance = (email: string) => call({ action: "balance", email });

export const spendCredits = (email: string, reason: SpendReason) => call({ action: "spend", email, reason });

export const savedEmail = () => {
  try {
    return localStorage.getItem(EMAIL_KEY) || "";
  } catch {
    return "";
  }
};

export const rememberEmail = (email: string) => {
  try {
    if (email) localStorage.setItem(EMAIL_KEY, email);
    else localStorage.removeItem(EMAIL_KEY);
  } catch {
    /* storage blocked: the email is asked again next time */
  }
};

export const validEmail = (email: string) => /^[^\s@]{1,64}@[^\s@]{1,190}\.[a-z]{2,24}$/i.test(email.trim());
