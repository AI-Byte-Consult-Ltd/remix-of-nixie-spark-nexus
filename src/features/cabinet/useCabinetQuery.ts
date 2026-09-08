import { useEffect, useState } from "react";
import { CabinetApiError } from "./api";
import type { CabinetLanguage } from "./types";
import { callCabinetApi } from "./api";

interface UseCabinetQueryArgs {
  action: string;
  session: string;
  language: CabinetLanguage;
  onRenewedToken: (token: string) => void;
  payload?: Record<string, unknown>;
}

interface UseCabinetQueryResult<T> {
  data: T | undefined;
  isLoading: boolean;
  errorCode: string | null;
}

export function useCabinetQuery<T>({
  action,
  session,
  language,
  onRenewedToken,
  payload,
}: UseCabinetQueryArgs): UseCabinetQueryResult<T> {
  const [data, setData] = useState<T | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [errorCode, setErrorCode] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setErrorCode(null);
      try {
        const result = await callCabinetApi<T & { renewedToken?: string }>({
          action,
          session,
          language,
          payload,
        });
        if (cancelled) return;
        if (result.data?.renewedToken) {
          onRenewedToken(result.data.renewedToken);
        }
        setData(result.data as T);
      } catch (error) {
        if (cancelled) return;
        setErrorCode(error instanceof CabinetApiError ? error.code : "REQUEST_FAILED");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action, session, language, JSON.stringify(payload ?? {})]);

  return { data, isLoading, errorCode };
}
