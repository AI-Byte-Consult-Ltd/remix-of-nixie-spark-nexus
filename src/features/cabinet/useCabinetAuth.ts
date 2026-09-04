import { useCallback, useEffect, useState } from "react";
import {
  CABINET_SESSION_STORAGE_KEY,
  CabinetApiError,
  loginWithTelegram,
} from "./api";
import type { CabinetLanguage, CabinetUser, TelegramLoginPayload } from "./types";

interface StoredSession {
  session: string;
  user: CabinetUser;
}

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

const writeStoredSession = (value: StoredSession | null) => {
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
};

export interface UseCabinetAuthResult {
  session: string | null;
  user: CabinetUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginError: string | null;
  login: (
    telegramAuth: TelegramLoginPayload,
    language: CabinetLanguage,
  ) => Promise<boolean>;
  logout: () => void;
  updateSession: (session: string) => void;
}

export const useCabinetAuth = (): UseCabinetAuthResult => {
  const [session, setSession] = useState<string | null>(null);
  const [user, setUser] = useState<CabinetUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    const stored = readStoredSession();
    if (stored) {
      setSession(stored.session);
      setUser(stored.user);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(
    async (telegramAuth: TelegramLoginPayload, language: CabinetLanguage) => {
      setLoginError(null);
      try {
        const result = await loginWithTelegram(telegramAuth, language);
        const data = result.data as { session: string; user: CabinetUser } | undefined;
        if (!data?.session || !data?.user) {
          setLoginError("REQUEST_FAILED");
          return false;
        }
        writeStoredSession({ session: data.session, user: data.user });
        setSession(data.session);
        setUser(data.user);
        return true;
      } catch (error) {
        setLoginError(
          error instanceof CabinetApiError ? error.code : "REQUEST_FAILED",
        );
        return false;
      }
    },
    [],
  );

  const logout = useCallback(() => {
    writeStoredSession(null);
    setSession(null);
    setUser(null);
  }, []);

  const updateSession = useCallback(
    (nextSession: string) => {
      setSession(nextSession);
      if (user) {
        writeStoredSession({ session: nextSession, user });
      }
    },
    [user],
  );

  return {
    session,
    user,
    isAuthenticated: Boolean(session && user),
    isLoading,
    loginError,
    login,
    logout,
    updateSession,
  };
};
