import type { ApiResponse, AppLanguage } from "./types";

export const NICS_API_URL =
  "https://n8n.aibyteconsult.com/webhook/nics-miniapp-api";

// [30 CABINET] Trader Bridge: checks the web cabinet session and forwards
// the same request to the Mini App API on behalf of that Telegram user.
export const NICS_CABINET_BRIDGE_URL =
  "https://n8n.aibyteconsult.com/webhook/nics-cabinet-trader";

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
  // Web cabinet session (aibyteconsult.com/cabinet), used instead of
  // Telegram initData when the dashboard runs outside Telegram.
  cabinetSession?: string;
  language: AppLanguage;
  payload?: Record<string, unknown>;
}

export const callNicsApi = async ({
  action,
  initData,
  cabinetSession,
  language,
  payload = {},
}: CallNicsApiOptions): Promise<ApiResponse> => {
  if (!initData && !cabinetSession) {
    throw new NicsApiError("TELEGRAM_REQUIRED");
  }

  const response = await fetch(initData ? NICS_API_URL : NICS_CABINET_BRIDGE_URL, {
    method: "POST",
    // A simple content type avoids a cross-origin preflight. Telegram initData
    // remains inside the authenticated JSON body and is never persisted by the UI.
    headers: { "Content-Type": "text/plain;charset=UTF-8" },
    body: JSON.stringify({
      action,
      ...(initData ? { initData } : { cabinetSession }),
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
