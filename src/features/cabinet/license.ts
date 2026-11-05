import { useCallback, useEffect, useState } from "react";
import type { CabinetLanguage } from "./types";

/*
 * License keys for the NICS AI Trader Windows app (n8n [39 TRADER] License
 * Keys, POST nics-license).
 * - An active paid Trader subscription (or an admin) gets one key, shown in
 *   the cabinet; it stays valid while the subscription is active.
 * - An admin can gift a key for one month or forever.
 * - The Windows app opens the cabinet with ?source=desktop. There the
 *   cabinet asks for a valid key, checks it at start and once a day, and
 *   keeps working for a few days offline after the last good check.
 */

export const LICENSE_API_URL = "https://n8n.aibyteconsult.com/webhook/nics-license";

const DESKTOP_FLAG_KEY = "nics_desktop_app";
const DEVICE_KEY = "nics_desktop_device";
const LICENSE_KEY = "nics_desktop_license";
const RECHECK_MS = 24 * 60 * 60 * 1000;
const OFFLINE_GRACE_MS = 7 * 24 * 60 * 60 * 1000;

export class LicenseApiError extends Error {
  readonly code: string;
  constructor(code: string) {
    super(code);
    this.code = code;
  }
}

export const callLicenseApi = async <T>(
  action: string,
  payload: Record<string, unknown> = {},
  session?: string | null,
): Promise<T> => {
  const response = await fetch(LICENSE_API_URL, {
    method: "POST",
    // Simple content type: no cross-origin preflight (same as the cabinet API).
    headers: { "Content-Type": "text/plain;charset=UTF-8" },
    body: JSON.stringify({ action, cabinetSession: session || undefined, ...payload }),
  });
  const result = (await response.json().catch(() => null)) as { ok?: boolean; code?: string; data?: T } | null;
  if (!response.ok || !result?.ok) throw new LicenseApiError(result?.code || "REQUEST_FAILED");
  return result.data as T;
};

export interface MyKeyResult {
  eligible: boolean;
  isAdmin: boolean;
  validUntil: string | null;
  key: string | null;
  devices: number;
}

export interface VerifyResult {
  found: boolean;
  valid: boolean;
  reason: "KEY_INVALID" | "KEY_REVOKED" | "KEY_EXPIRED" | "DEVICE_LIMIT" | null;
  kind?: "SUBSCRIPTION" | "GIFT" | null;
  forever?: boolean;
  validUntil?: string | null;
}

export interface GiftKey {
  id: number;
  key: string;
  note?: string | null;
  forever: boolean;
  expiresAt?: string | null;
  createdAt?: string | null;
  revoked: boolean;
  redeemedAt?: string | null;
  redeemedBy?: string | null;
  devices: number;
}

const safeGet = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};
const safeSet = (key: string, value: string | null) => {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    // Storage blocked: the app asks for the key again next time.
  }
};

// The Windows app opens /cabinet?source=desktop; later navigation drops the
// query, so the flag is remembered on this device.
export const isDesktopApp = (): boolean => {
  if (typeof window === "undefined") return false;
  if (new URLSearchParams(window.location.search).get("source") === "desktop") {
    safeSet(DESKTOP_FLAG_KEY, "1");
    return true;
  }
  return safeGet(DESKTOP_FLAG_KEY) === "1";
};

const deviceId = (): string => {
  let id = safeGet(DEVICE_KEY);
  if (!id || id.length < 8) {
    id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
    safeSet(DEVICE_KEY, id);
  }
  return id;
};

interface StoredLicense {
  key: string;
  checkedAt: number;
  validUntil?: string | null;
  forever?: boolean;
}

const readStored = (): StoredLicense | null => {
  try {
    const parsed = JSON.parse(safeGet(LICENSE_KEY) || "null") as StoredLicense | null;
    return parsed?.key ? parsed : null;
  } catch {
    return null;
  }
};

export type DesktopLicenseState =
  | { status: "checking" }
  | { status: "ok"; key: string; validUntil?: string | null; forever?: boolean }
  | { status: "needed"; reason?: string | null };

export const useDesktopLicense = (enabled: boolean, session: string | null) => {
  const [state, setState] = useState<DesktopLicenseState>({ status: "checking" });

  const verify = useCallback(async (key: string): Promise<VerifyResult> => {
    const result = await callLicenseApi<VerifyResult>("verify", { key, deviceId: deviceId() }, session);
    if (result.valid) {
      safeSet(
        LICENSE_KEY,
        JSON.stringify({ key, checkedAt: Date.now(), validUntil: result.validUntil, forever: result.forever }),
      );
      setState({ status: "ok", key, validUntil: result.validUntil, forever: result.forever });
    }
    return result;
  }, [session]);

  const check = useCallback(async () => {
    const stored = readStored();
    try {
      if (stored) {
        const result = await verify(stored.key);
        if (result.valid) return;
        safeSet(LICENSE_KEY, null);
      }
      // No key on this computer yet: a subscriber's own key fills in by itself.
      if (session) {
        const mine = await callLicenseApi<MyKeyResult>("my_key", {}, session).catch(() => null);
        if (mine?.eligible && mine.key) {
          const result = await verify(mine.key);
          if (result.valid) return;
          setState({ status: "needed", reason: result.reason });
          return;
        }
      }
      setState({ status: "needed", reason: stored ? "KEY_EXPIRED" : null });
    } catch {
      // Server unreachable: keep working offline for a while after a good check.
      if (stored && Date.now() - stored.checkedAt < OFFLINE_GRACE_MS) {
        setState({ status: "ok", key: stored.key, validUntil: stored.validUntil, forever: stored.forever });
      } else {
        setState({ status: "needed", reason: "OFFLINE" });
      }
    }
  }, [session, verify]);

  useEffect(() => {
    if (!enabled) return;
    void check();
    const timer = window.setInterval(() => {
      const stored = readStored();
      if (!stored || Date.now() - stored.checkedAt >= RECHECK_MS) void check();
    }, 60 * 60 * 1000);
    return () => window.clearInterval(timer);
  }, [enabled, check]);

  const activate = useCallback(
    async (key: string): Promise<string | null> => {
      try {
        const result = await verify(key.trim().toUpperCase());
        return result.valid ? null : result.reason || "KEY_INVALID";
      } catch {
        return "OFFLINE";
      }
    },
    [verify],
  );

  return { state, activate };
};

// ---- strings (ru, bg, en, es; other cabinet languages use English) ----

const en = {
  title: "Windows app license",
  lead: "The NICS AI Trader app for Windows works with a license key. The key comes with an active Trader subscription.",
  yourKey: "Your license key",
  copy: "Copy",
  copied: "Copied",
  validUntil: "Valid until",
  validWhileSub: "Valid while your subscription is active",
  forever: "No expiry",
  devices: "Computers using the key",
  howTo: "In the Windows app the key fills in by itself when you sign in to this account. On another computer, enter it by hand. One key works on up to 2 computers.",
  notEligible: "There is no active Trader subscription on this account yet. Once it is paid, your key appears here.",
  buy: "Choose a plan",
  adminTitle: "Gift a key",
  adminLead: "Create a key for someone: for one month or with no expiry. Send them the key; they enter it in the Windows app.",
  note: "Note (who it is for)",
  giftMonth: "Gift for 1 month",
  giftForever: "Gift with no expiry",
  newKey: "New key",
  gifts: "Gifted keys",
  noGifts: "No gifted keys yet.",
  statusActive: "Not used yet",
  statusUsed: "Used by",
  statusRevoked: "Revoked",
  statusExpired: "Expired",
  monthUntil: "1 month, until",
  revoke: "Revoke",
  error: "Something went wrong. Please try again.",
  gateTitle: "Activate NICS AI Trader",
  gateLead: "Enter your license key. You find it in the cabinet under “Windows app license” after paying for a Trader subscription.",
  keyPlaceholder: "NICS-XXXX-XXXX-XXXX",
  activate: "Activate",
  checking: "Checking the license…",
  reasonKEY_INVALID: "This key was not found. Check the letters and dashes.",
  reasonKEY_REVOKED: "This key has been revoked.",
  reasonKEY_EXPIRED: "This key has expired or the subscription has ended.",
  reasonDEVICE_LIMIT: "This key is already used on 2 computers.",
  reasonOFFLINE: "No connection to the license server. Check the internet and try again.",
  openLicensePage: "My key",
};

type LicenseStrings = typeof en;

const ru: LicenseStrings = {
  title: "Лицензия Windows-приложения",
  lead: "Приложение NICS AI Trader для Windows работает по лицензионному ключу. Ключ выдаётся при активной подписке Trader.",
  yourKey: "Ваш лицензионный ключ",
  copy: "Копировать",
  copied: "Скопировано",
  validUntil: "Действует до",
  validWhileSub: "Действует, пока активна подписка",
  forever: "Бессрочно",
  devices: "Компьютеров с этим ключом",
  howTo: "В Windows-приложении ключ подставится сам, когда вы войдёте в этот аккаунт. На другом компьютере введите его вручную. Один ключ работает максимум на 2 компьютерах.",
  notEligible: "На этом аккаунте пока нет активной подписки Trader. После оплаты ключ появится здесь.",
  buy: "Выбрать тариф",
  adminTitle: "Подарить ключ",
  adminLead: "Создайте ключ для человека: на месяц или бессрочно. Отправьте ему ключ, он введёт его в Windows-приложении.",
  note: "Заметка (для кого)",
  giftMonth: "Подарить на 1 месяц",
  giftForever: "Подарить бессрочно",
  newKey: "Новый ключ",
  gifts: "Подаренные ключи",
  noGifts: "Подаренных ключей пока нет.",
  statusActive: "Ещё не использован",
  statusUsed: "Использует",
  statusRevoked: "Отозван",
  statusExpired: "Истёк",
  monthUntil: "1 месяц, до",
  revoke: "Отозвать",
  error: "Что-то пошло не так. Попробуйте ещё раз.",
  gateTitle: "Активация NICS AI Trader",
  gateLead: "Введите лицензионный ключ. Он есть в кабинете в разделе «Лицензия Windows-приложения» после оплаты подписки Trader.",
  keyPlaceholder: "NICS-XXXX-XXXX-XXXX",
  activate: "Активировать",
  checking: "Проверяем лицензию…",
  reasonKEY_INVALID: "Такой ключ не найден. Проверьте буквы и дефисы.",
  reasonKEY_REVOKED: "Этот ключ отозван.",
  reasonKEY_EXPIRED: "Срок ключа истёк или подписка закончилась.",
  reasonDEVICE_LIMIT: "Ключ уже используется на 2 компьютерах.",
  reasonOFFLINE: "Нет связи с сервером лицензий. Проверьте интернет и попробуйте снова.",
  openLicensePage: "Мой ключ",
};

const bg: LicenseStrings = {
  title: "Лиценз за Windows приложението",
  lead: "Приложението NICS AI Trader за Windows работи с лицензионен ключ. Ключът се дава при активен абонамент за Trader.",
  yourKey: "Вашият лицензионен ключ",
  copy: "Копирай",
  copied: "Копирано",
  validUntil: "Валиден до",
  validWhileSub: "Валиден, докато абонаментът е активен",
  forever: "Безсрочно",
  devices: "Компютри с този ключ",
  howTo: "В Windows приложението ключът се попълва сам, когато влезете в този акаунт. На друг компютър го въведете ръчно. Един ключ работи на най-много 2 компютъра.",
  notEligible: "В този акаунт все още няма активен абонамент за Trader. След плащане ключът ще се появи тук.",
  buy: "Изберете план",
  adminTitle: "Подари ключ",
  adminLead: "Създайте ключ за някого: за един месец или безсрочно. Изпратете му ключа, той ще го въведе в Windows приложението.",
  note: "Бележка (за кого е)",
  giftMonth: "Подари за 1 месец",
  giftForever: "Подари безсрочно",
  newKey: "Нов ключ",
  gifts: "Подарени ключове",
  noGifts: "Все още няма подарени ключове.",
  statusActive: "Още не е използван",
  statusUsed: "Използва го",
  statusRevoked: "Отменен",
  statusExpired: "Изтекъл",
  monthUntil: "1 месец, до",
  revoke: "Отмени",
  error: "Нещо се обърка. Опитайте отново.",
  gateTitle: "Активиране на NICS AI Trader",
  gateLead: "Въведете лицензионния ключ. Ще го намерите в кабинета в раздел „Лиценз за Windows приложението“ след плащане на абонамент за Trader.",
  keyPlaceholder: "NICS-XXXX-XXXX-XXXX",
  activate: "Активирай",
  checking: "Проверяваме лиценза…",
  reasonKEY_INVALID: "Такъв ключ не е намерен. Проверете буквите и тиретата.",
  reasonKEY_REVOKED: "Този ключ е отменен.",
  reasonKEY_EXPIRED: "Ключът е изтекъл или абонаментът е приключил.",
  reasonDEVICE_LIMIT: "Ключът вече се използва на 2 компютъра.",
  reasonOFFLINE: "Няма връзка със сървъра за лицензи. Проверете интернета и опитайте отново.",
  openLicensePage: "Моят ключ",
};

const es: LicenseStrings = {
  title: "Licencia de la app de Windows",
  lead: "La app NICS AI Trader para Windows funciona con una clave de licencia. La clave viene con una suscripción activa a Trader.",
  yourKey: "Tu clave de licencia",
  copy: "Copiar",
  copied: "Copiado",
  validUntil: "Válida hasta",
  validWhileSub: "Válida mientras la suscripción esté activa",
  forever: "Sin caducidad",
  devices: "Ordenadores con esta clave",
  howTo: "En la app de Windows la clave se rellena sola al iniciar sesión en esta cuenta. En otro ordenador, introdúcela a mano. Una clave funciona en 2 ordenadores como máximo.",
  notEligible: "Esta cuenta todavía no tiene una suscripción activa a Trader. Tras el pago, tu clave aparecerá aquí.",
  buy: "Elegir plan",
  adminTitle: "Regalar una clave",
  adminLead: "Crea una clave para alguien: por un mes o sin caducidad. Envíale la clave; la introducirá en la app de Windows.",
  note: "Nota (para quién es)",
  giftMonth: "Regalar 1 mes",
  giftForever: "Regalar sin caducidad",
  newKey: "Nueva clave",
  gifts: "Claves regaladas",
  noGifts: "Aún no hay claves regaladas.",
  statusActive: "Sin usar",
  statusUsed: "La usa",
  statusRevoked: "Revocada",
  statusExpired: "Caducada",
  monthUntil: "1 mes, hasta",
  revoke: "Revocar",
  error: "Algo salió mal. Inténtalo de nuevo.",
  gateTitle: "Activar NICS AI Trader",
  gateLead: "Introduce tu clave de licencia. La encontrarás en el panel, en «Licencia de la app de Windows», tras pagar una suscripción a Trader.",
  keyPlaceholder: "NICS-XXXX-XXXX-XXXX",
  activate: "Activar",
  checking: "Comprobando la licencia…",
  reasonKEY_INVALID: "No se encontró esta clave. Revisa las letras y los guiones.",
  reasonKEY_REVOKED: "Esta clave ha sido revocada.",
  reasonKEY_EXPIRED: "La clave ha caducado o la suscripción ha terminado.",
  reasonDEVICE_LIMIT: "La clave ya se usa en 2 ordenadores.",
  reasonOFFLINE: "Sin conexión con el servidor de licencias. Revisa internet e inténtalo de nuevo.",
  openLicensePage: "Mi clave",
};

const STRINGS: Partial<Record<CabinetLanguage, LicenseStrings>> = { en, ru, bg, es };

export const licenseStrings = (language: CabinetLanguage): LicenseStrings => STRINGS[language] ?? en;

export const reasonText = (s: LicenseStrings, reason?: string | null): string | null => {
  if (!reason) return null;
  const key = `reason${reason}` as keyof LicenseStrings;
  return s[key] ?? s.reasonKEY_INVALID;
};
