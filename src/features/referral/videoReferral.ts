// NICS Video referrals: +10 credits to whoever invited a friend who then pays
// for any plan. n8n [38 VIDEO] Referrals keeps the codes and grants the bonus;
// [26]/[28]/[33] count it in the credit balance.
// A visit with ?ref=<code> is remembered in this browser for 60 days and sent
// as a "claim" together with the email when the friend opens a paid checkout.
const ENDPOINT = "https://n8n.aibyteconsult.com/webhook/nics-video-referral";
const STORAGE_KEY = "nics-video-ref";
const KEEP_MS = 60 * 24 * 60 * 60 * 1000;
const CODE_RE = /^[a-f0-9]{10}$/;

const post = (body: Record<string, string>, keepalive = false) =>
  fetch(ENDPOINT, {
    method: "POST",
    // A simple content type avoids a cross-origin preflight, same as the checkout.
    headers: { "Content-Type": "text/plain;charset=UTF-8" },
    body: JSON.stringify(body),
    keepalive,
  });

export const captureReferral = () => {
  try {
    const code = (new URLSearchParams(window.location.search).get("ref") || "").toLowerCase();
    if (CODE_RE.test(code)) localStorage.setItem(STORAGE_KEY, JSON.stringify({ code, at: Date.now() }));
  } catch {
    /* storage blocked: no referral for this visit */
  }
};

const storedCode = (): string | null => {
  try {
    const v = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null") as { code?: string; at?: number } | null;
    if (!v?.code || !CODE_RE.test(v.code) || !v.at || Date.now() - v.at > KEEP_MS) return null;
    return v.code;
  } catch {
    return null;
  }
};

// Fire and forget: the server answers ok either way and the checkout never waits on it.
export const claimReferral = (email: string) => {
  const ref = storedCode();
  if (!ref || !email) return;
  post({ action: "claim", email: email.trim().toLowerCase(), ref }, true).catch(() => undefined);
};

export interface ReferralInfo {
  code: string;
  bonuses: number;
}

export const fetchReferral = async (session: string): Promise<ReferralInfo | null> => {
  try {
    const res = await post({ action: "link", session });
    const data = (await res.json().catch(() => null)) as { ok?: boolean; code?: string; bonuses?: number } | null;
    if (!res.ok || !data?.ok || !data.code || !CODE_RE.test(data.code)) return null;
    return { code: data.code, bonuses: Number(data.bonuses || 0) };
  } catch {
    return null;
  }
};
