import { useCallback, useEffect, useState } from "react";
import {
  CABINET_SESSION_STORAGE_KEY,
  CabinetApiError,
  callCabinetApi,
  loginWithEmail,
  loginWithGoogle,
  loginWithTelegram,
} from "./api";
import type { CabinetApiResponse, CabinetLanguage, CabinetUser, TelegramLoginPayload } from "./types";

interface StoredSession {
  session: string;
  user: CabinetUser;
}

// Several components hold this hook at once (layout, login, sign-in
// methods page); this event keeps them in step after a login or link.
const SESSION_EVENT = "nics-cabinet-session-change";

const readStoredSession = (): StoredSession | null => {
  try {
    const raw = localStorage.getItem(CABINET_SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredSession;
    if (!parsed?.session || !parsed?.user) return null;
    return parsed;
  } catch {
    return null;
  }
};

const writeStoredSession = (value: StoredSession | null, notify = true) => {
  try {
    if (value) {
      localStorage.setItem(CABINET_SESSION_STORAGE_KEY, JSON.stringify(value));
    } else {
      localStorage.removeItem(CABINET_SESSION_STORAGE_KEY);
    }
  } catch {
    // localStorage unavailable (private mode, blocked storage) -- the
    // session simply won't persist across reloads, which is a reasonable
    // degradation rather than a hard failure.
  }
  if (notify) window.dispatchEvent(new Event(SESSION_EVENT));
};

export const isTelegramLinked = (user: CabinetUser | null) =>
  Boolean(user && user.telegramLinked !== false && user.id > 0);

export interface UseCabinetAuthResult {
  session: string | null;
  user: CabinetUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginError: string | null;
  // Each login resolves to an error code, or null when it worked.
  login: (
    telegramAuth: TelegramLoginPayload,
    language: CabinetLanguage,
  ) => Promise<string | null>;
  loginEmail: (accountSession: string, language: CabinetLanguage) => Promise<string | null>;
  loginGoogle: (credential: string, language: CabinetLanguage) => Promise<string | null>;
  refresh: (language: CabinetLanguage) => Promise<void>;
  logout: () => void;
  updateSession: (session: string) => void;
}

export const useCabinetAuth = (): UseCabinetAuthResult => {
  const [stored, setStored] = useState<StoredSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => setStored(readStoredSession());
    sync();
    setIsLoading(false);
    window.addEventListener(SESSION_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(SESSION_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  // Runs one login call; returns the error code, or null on success.
  const runLogin = useCallback(
    async (call: () => Promise<CabinetApiResponse<{ session: string; user: unknown }>>) => {
      setLoginError(null);
      try {
        const result = await call();
        const data = result.data as { session: string; user: CabinetUser } | undefined;
        if (!data?.session || !data?.user) {
          setLoginError("REQUEST_FAILED");
          return "REQUEST_FAILED";
        }
        writeStoredSession({ session: data.session, user: data.user });
        return null;
      } catch (error) {
        const code = error instanceof CabinetApiError ? error.code : "REQUEST_FAILED";
        setLoginError(code);
        return code;
      }
    },
    [],
  );

  const login = useCallback(
    (telegramAuth: TelegramLoginPayload, language: CabinetLanguage) =>
      runLogin(() => loginWithTelegram(telegramAuth, language, readStoredSession()?.session)),
    [runLogin],
  );

  const loginEmail = useCallback(
    (accountSession: string, language: CabinetLanguage) =>
      runLogin(() => loginWithEmail(accountSession, language, readStoredSession()?.session)),
    [runLogin],
  );

  const loginGoogle = useCallback(
    (credential: string, language: CabinetLanguage) =>
      runLogin(() => loginWithGoogle(credential, language, readStoredSession()?.session)),
    [runLogin],
  );

  // Renews the session and picks up methods linked on another device.
  const refresh = useCallback(async (language: CabinetLanguage) => {
    const current = readStoredSession();
    if (!current) return;
    try {
      const result = await callCabinetApi<{ renewedToken: string; user: CabinetUser }>({
        action: "me",
        session: current.session,
        language,
      });
      if (result.data?.renewedToken && result.data.user) {
        writeStoredSession({ session: result.data.renewedToken, user: result.data.user });
      }
    } catch (error) {
      if (error instanceof CabinetApiError && error.code.startsWith("SESSION_")) {
        writeStoredSession(null);
      }
    }
  }, []);

  const logout = useCallback(() => {
    writeStoredSession(null);
  }, []);

  // Saves a renewed token for the next visit without re-rendering: the
  // token in use stays valid, and swapping it live would refetch every
  // query, each of which renews the token again.
  const updateSession = useCallback((nextSession: string) => {
    const current = readStoredSession();
    if (current && current.session !== nextSession) {
      writeStoredSession({ session: nextSession, user: current.user }, false);
    }
  }, []);

  return {
    session: stored?.session ?? null,
    user: stored?.user ?? null,
    isAuthenticated: Boolean(stored?.session && stored?.user),
    isLoading,
    loginError,
    login,
    loginEmail,
    loginGoogle,
    refresh,
    logout,
    updateSession,
  };
};
