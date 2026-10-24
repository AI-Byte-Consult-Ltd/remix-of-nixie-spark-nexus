// NICS Video / NICS Studio account: sign in with a one-time code sent to the
// email, then a session (180 days) kept in this browser. The server keeps
// only a hash of the session ([29 VIDEO] Account Login in n8n).
import { useEffect, useState } from "react";

const ENDPOINT = "https://n8n.aibyteconsult.com/webhook/nics-account";
const STORAGE_KEY = "nics-account";
const LEGACY_EMAIL_KEY = "nics-studio-email";
const EVENT = "nics-account-change";

export interface Account {
  email: string;
  // Empty while email codes cannot be sent yet: the email is then taken on
  // trust, the way NICS Video worked before sign-in existed.
  session: string;
}

export type AccountError = "email" | "code" | "wrong_code" | "too_many" | "mail_unavailable" | "session" | "network";

const call = async (body: Record<string, string>): Promise<{ ok: boolean; error: AccountError | null; data: Record<string, unknown> }> => {
  try {
    const res = await fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = await res.json().catch(() => null);
    if (!data || typeof data !== "object") return { ok: false, error: "network", data: {} };
    return { ok: Boolean(data.ok), error: data.ok ? null : ((data.error as AccountError) || "network"), data };
  } catch {
    return { ok: false, error: "network", data: {} };
  }
};

export const readAccount = (): Account | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const a = JSON.parse(raw) as Account;
      if (a?.email) return { email: a.email, session: a.session || "" };
    }
    const legacy = localStorage.getItem(LEGACY_EMAIL_KEY);
    return legacy ? { email: legacy, session: "" } : null;
  } catch {
    return null;
  }
};

const writeAccount = (a: Account | null) => {
  try {
    if (a) localStorage.setItem(STORAGE_KEY, JSON.stringify(a));
    else localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LEGACY_EMAIL_KEY);
  } catch {
    /* storage blocked: the user signs in again next visit */
  }
  window.dispatchEvent(new Event(EVENT));
};

export const validEmail = (email: string) => /^[^\s@]{1,64}@[^\s@]{1,190}\.[a-z]{2,24}$/i.test(email.trim());

export const sendCode = (email: string, lang: string) => call({ action: "send_code", email: email.trim().toLowerCase(), lang });

export const verifyCode = async (email: string, code: string) => {
  const r = await call({ action: "verify", email: email.trim().toLowerCase(), code });
  if (r.ok && typeof r.data.session === "string") writeAccount({ email: String(r.data.email), session: r.data.session });
  return r;
};

// Used only while the server cannot send codes yet.
export const trustEmail = (email: string) => writeAccount({ email: email.trim().toLowerCase(), session: "" });

export const signOut = () => {
  const a = readAccount();
  if (a?.session) call({ action: "logout", session: a.session });
  writeAccount(null);
};

// Drops a session the server no longer knows (expired or signed out elsewhere).
export const checkSession = async () => {
  const a = readAccount();
  if (!a?.session) return;
  const r = await call({ action: "me", session: a.session });
  if (!r.ok && r.error === "session") writeAccount(null);
};

export const useAccount = () => {
  const [account, setAccount] = useState<Account | null>(readAccount);
  useEffect(() => {
    const sync = () => setAccount(readAccount());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return account;
};
