import type { CabinetApiResponse, CabinetLanguage, TelegramLoginPayload } from "./types";

export const CABINET_API_URL =
  "https://n8n.aibyteconsult.com/webhook/nics-cabinet-api";

export const CABINET_SESSION_STORAGE_KEY = "nics_cabinet_session";

export class CabinetApiError extends Error {
  readonly code: string;

  constructor(code: string, message?: string) {
    super(message || code);
    this.name = "CabinetApiError";
    this.code = code;
  }
}

interface CallCabinetApiOptions {
  action: string;
  session?: string | null;
  language: CabinetLanguage;
  payload?: Record<string, unknown>;
}

export const callCabinetApi = async <T = unknown>({
  action,
  session,
  language,
  payload = {},
}: CallCabinetApiOptions): Promise<CabinetApiResponse<T>> => {
  const response = await fetch(CABINET_API_URL, {
    method: "POST",
    // A simple content type avoids a cross-origin preflight, mirroring
    // src/features/nics/api.ts's callNicsApi.
    headers: { "Content-Type": "text/plain;charset=UTF-8" },
    body: JSON.stringify({
      action,
      session: session || undefined,
      language,
      ...payload,
    }),
  });

  const result = (await response
    .json()
    .catch(() => null)) as CabinetApiResponse<T> | null;

  if (!response.ok || !result?.ok) {
    throw new CabinetApiError(
      result?.code || "REQUEST_FAILED",
      result?.message || "Cabinet request failed",
    );
  }

  return result;
};

export const loginWithTelegram = (
  telegramAuth: TelegramLoginPayload,
  language: CabinetLanguage,
) =>
  callCabinetApi<{ session: string; user: unknown }>({
    action: "telegram_login",
    language,
    payload: { telegramAuth },
  });
