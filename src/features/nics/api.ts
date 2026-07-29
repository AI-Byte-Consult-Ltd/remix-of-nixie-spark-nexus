import type { ApiResponse, AppLanguage } from "./types";

export const NICS_API_URL =
  "https://n8n.aibyteconsult.com/webhook/nics-miniapp-api";

export class NicsApiError extends Error {
  readonly code: string;

  constructor(code: string, message?: string) {
    super(message || code);
    this.name = "NicsApiError";
    this.code = code;
  }
}

interface CallNicsApiOptions {
  action: string;
  initData: string;
  language: AppLanguage;
  payload?: Record<string, unknown>;
}

export const callNicsApi = async ({
  action,
  initData,
  language,
  payload = {},
}: CallNicsApiOptions): Promise<ApiResponse> => {
  if (!initData) {
    throw new NicsApiError("TELEGRAM_REQUIRED");
  }

  const response = await fetch(NICS_API_URL, {
    method: "POST",
    // A simple content type avoids a cross-origin preflight. Telegram initData
    // remains inside the authenticated JSON body and is never persisted by the UI.
    headers: { "Content-Type": "text/plain;charset=UTF-8" },
    body: JSON.stringify({
      action,
      initData,
      language,
      ...payload,
    }),
  });

  const result = (await response.json().catch(() => null)) as ApiResponse | null;

  if (!response.ok || !result?.ok) {
    throw new NicsApiError(
      result?.code || "REQUEST_FAILED",
      result?.message || "NICS request failed",
    );
  }

  return result;
};
