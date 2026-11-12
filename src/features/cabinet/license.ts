import { useCallback, useEffect, useState } from "react";
import type { CabinetLanguage } from "./types";

/*
 * License keys for the NICS Trading Ecosystem Windows app (n8n [39 TRADER] License
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
  lead: "The NICS Trading Ecosystem app for Windows works with a license key. The key comes with an active Trader subscription.",
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
  gateTitle: "Activate NICS Trading Ecosystem",
  gateLead: "Enter your license key. You find it in the cabinet under “Windows app license” after paying for a Trader subscription. A gift key from us works too.",
  keyPlaceholder: "NICS-XXXX-XXXX-XXXX",
  activate: "Activate",
  checking: "Checking the license…",
  reasonKEY_INVALID: "This key was not found. Check the letters and dashes.",
  reasonKEY_REVOKED: "This key has been revoked.",
  reasonKEY_EXPIRED: "This key has expired or the subscription has ended.",
  reasonDEVICE_LIMIT: "This key is already used on 2 computers.",
  reasonOFFLINE: "No connection to the license server. Check the internet and try again.",
  openLicensePage: "My key",
  download: "Download for Windows",
  downloadNote: "Installer for Windows 10 and 11. The Microsoft Store version is coming soon.",
  haveKeyTitle: "Got a license key (also a gift key)?",
  haveKeySteps: "1. Download the installer and install the app on Windows 10 or 11. 2. Open it and sign in (Telegram or e-mail). 3. Enter the key NICS-XXXX-XXXX-XXXX. A gift key works without a subscription.",
  copyInvite: "Copy message for the recipient",
  invite: "Your NICS Trading Ecosystem license key: {key} ({validity}).\n1. Download the Windows app: {url}\n2. Install it and sign in with Telegram or e-mail.\n3. Enter the key when the app asks for it.",
};

type LicenseStrings = typeof en;

const ru: LicenseStrings = {
  title: "Лицензия Windows-приложения",
  lead: "Приложение NICS Trading Ecosystem для Windows работает по лицензионному ключу. Ключ выдаётся при активной подписке Trader.",
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
  gateTitle: "Активация NICS Trading Ecosystem",
  gateLead: "Введите лицензионный ключ. Он есть в кабинете в разделе «Лицензия Windows-приложения» после оплаты подписки Trader. Подходит и подарочный ключ.",
  keyPlaceholder: "NICS-XXXX-XXXX-XXXX",
  activate: "Активировать",
  checking: "Проверяем лицензию…",
  reasonKEY_INVALID: "Такой ключ не найден. Проверьте буквы и дефисы.",
  reasonKEY_REVOKED: "Этот ключ отозван.",
  reasonKEY_EXPIRED: "Срок ключа истёк или подписка закончилась.",
  reasonDEVICE_LIMIT: "Ключ уже используется на 2 компьютерах.",
  reasonOFFLINE: "Нет связи с сервером лицензий. Проверьте интернет и попробуйте снова.",
  openLicensePage: "Мой ключ",
  download: "Скачать для Windows",
  downloadNote: "Установщик для Windows 10 и 11. Версия в Microsoft Store появится в ближайшее время.",
  haveKeyTitle: "Есть лицензионный ключ (в том числе подарочный)?",
  haveKeySteps: "1. Скачайте установщик и установите приложение на Windows 10 или 11. 2. Откройте его и войдите (Telegram или e-mail). 3. Введите ключ NICS-XXXX-XXXX-XXXX. Подарочный ключ работает без подписки.",
  copyInvite: "Копировать сообщение для получателя",
  invite: "Ваш лицензионный ключ NICS Trading Ecosystem: {key} ({validity}).\n1. Скачайте приложение для Windows: {url}\n2. Установите его и войдите через Telegram или e-mail.\n3. Введите ключ, когда приложение его попросит.",
};

const bg: LicenseStrings = {
  title: "Лиценз за Windows приложението",
  lead: "Приложението NICS Trading Ecosystem за Windows работи с лицензионен ключ. Ключът се дава при активен абонамент за Trader.",
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
  gateTitle: "Активиране на NICS Trading Ecosystem",
  gateLead: "Въведете лицензионния ключ. Ще го намерите в кабинета в раздел „Лиценз за Windows приложението“ след плащане на абонамент за Trader. Подаръчен ключ също работи.",
  keyPlaceholder: "NICS-XXXX-XXXX-XXXX",
  activate: "Активирай",
  checking: "Проверяваме лиценза…",
  reasonKEY_INVALID: "Такъв ключ не е намерен. Проверете буквите и тиретата.",
  reasonKEY_REVOKED: "Този ключ е отменен.",
  reasonKEY_EXPIRED: "Ключът е изтекъл или абонаментът е приключил.",
  reasonDEVICE_LIMIT: "Ключът вече се използва на 2 компютъра.",
  reasonOFFLINE: "Няма връзка със сървъра за лицензи. Проверете интернета и опитайте отново.",
  openLicensePage: "Моят ключ",
  download: "Изтегли за Windows",
  downloadNote: "Инсталатор за Windows 10 и 11. Версията в Microsoft Store идва скоро.",
  haveKeyTitle: "Имате лицензен ключ (включително подарен)?",
  haveKeySteps: "1. Изтеглете инсталатора и инсталирайте приложението на Windows 10 или 11. 2. Отворете го и влезте (Telegram или e-mail). 3. Въведете ключа NICS-XXXX-XXXX-XXXX. Подареният ключ работи без абонамент.",
  copyInvite: "Копирай съобщение за получателя",
  invite: "Вашият лицензен ключ за NICS Trading Ecosystem: {key} ({validity}).\n1. Изтеглете приложението за Windows: {url}\n2. Инсталирайте го и влезте с Telegram или e-mail.\n3. Въведете ключа, когато приложението го поиска.",
};

const es: LicenseStrings = {
  title: "Licencia de la app de Windows",
  lead: "La app NICS Trading Ecosystem para Windows funciona con una clave de licencia. La clave viene con una suscripción activa a Trader.",
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
  gateTitle: "Activar NICS Trading Ecosystem",
  gateLead: "Introduce tu clave de licencia. La encontrarás en el panel, en «Licencia de la app de Windows», tras pagar una suscripción a Trader. También sirve una clave de regalo.",
  keyPlaceholder: "NICS-XXXX-XXXX-XXXX",
  activate: "Activar",
  checking: "Comprobando la licencia…",
  reasonKEY_INVALID: "No se encontró esta clave. Revisa las letras y los guiones.",
  reasonKEY_REVOKED: "Esta clave ha sido revocada.",
  reasonKEY_EXPIRED: "La clave ha caducado o la suscripción ha terminado.",
  reasonDEVICE_LIMIT: "La clave ya se usa en 2 ordenadores.",
  reasonOFFLINE: "Sin conexión con el servidor de licencias. Revisa internet e inténtalo de nuevo.",
  openLicensePage: "Mi clave",
  download: "Descargar para Windows",
  downloadNote: "Instalador para Windows 10 y 11. La versión de Microsoft Store llegará pronto.",
  haveKeyTitle: "¿Tienes una clave de licencia (también de regalo)?",
  haveKeySteps: "1. Descarga el instalador e instala la app en Windows 10 u 11. 2. Ábrela e inicia sesión (Telegram o e-mail). 3. Introduce la clave NICS-XXXX-XXXX-XXXX. Una clave de regalo funciona sin suscripción.",
  copyInvite: "Copiar mensaje para el destinatario",
  invite: "Tu clave de licencia de NICS Trading Ecosystem: {key} ({validity}).\n1. Descarga la app para Windows: {url}\n2. Instálala e inicia sesión con Telegram o e-mail.\n3. Introduce la clave cuando la app la pida.",
};

const pt: LicenseStrings = {
  title: "Licença do aplicativo para Windows",
  lead: "O aplicativo NICS Trading Ecosystem para Windows funciona com uma chave de licença. A chave vem com uma assinatura Trader ativa.",
  yourKey: "Sua chave de licença",
  copy: "Copiar",
  copied: "Copiado",
  validUntil: "Válida até",
  validWhileSub: "Válida enquanto a assinatura estiver ativa",
  forever: "Sem prazo",
  devices: "Computadores com esta chave",
  howTo: "No aplicativo para Windows a chave é preenchida sozinha quando você entra nesta conta. Em outro computador, digite-a manualmente. Uma chave funciona em no máximo 2 computadores.",
  notEligible: "Esta conta ainda não tem uma assinatura Trader ativa. Depois do pagamento, a sua chave aparecerá aqui.",
  buy: "Escolher plano",
  adminTitle: "Presentear uma chave",
  adminLead: "Crie uma chave para alguém: por um mês ou sem prazo. Envie a chave; a pessoa a digita no aplicativo para Windows.",
  note: "Nota (para quem é)",
  giftMonth: "Presentear 1 mês",
  giftForever: "Presentear sem prazo",
  newKey: "Nova chave",
  gifts: "Chaves presenteadas",
  noGifts: "Ainda não há chaves presenteadas.",
  statusActive: "Não usada",
  statusUsed: "Usada por",
  statusRevoked: "Revogada",
  statusExpired: "Expirada",
  monthUntil: "1 mês, até",
  revoke: "Revogar",
  error: "Algo deu errado. Tente novamente.",
  gateTitle: "Ativar o NICS Trading Ecosystem",
  gateLead: "Digite a sua chave de licença. Ela fica no painel, em «Licença do aplicativo para Windows», depois de pagar uma assinatura Trader. Uma chave de presente também serve.",
  keyPlaceholder: "NICS-XXXX-XXXX-XXXX",
  activate: "Ativar",
  checking: "Verificando a licença…",
  reasonKEY_INVALID: "Esta chave não foi encontrada. Confira as letras e os hífens.",
  reasonKEY_REVOKED: "Esta chave foi revogada.",
  reasonKEY_EXPIRED: "A chave expirou ou a assinatura terminou.",
  reasonDEVICE_LIMIT: "A chave já está em uso em 2 computadores.",
  reasonOFFLINE: "Sem conexão com o servidor de licenças. Verifique a internet e tente novamente.",
  openLicensePage: "Minha chave",
  download: "Baixar para Windows",
  downloadNote: "Instalador para Windows 10 e 11. A versão da Microsoft Store chegará em breve.",
  haveKeyTitle: "Tem uma chave de licença (também de presente)?",
  haveKeySteps: "1. Baixe o instalador e instale o app no Windows 10 ou 11. 2. Abra-o e entre (Telegram ou e-mail). 3. Introduza a chave NICS-XXXX-XXXX-XXXX. Uma chave de presente funciona sem assinatura.",
  copyInvite: "Copiar mensagem para o destinatário",
  invite: "A sua chave de licença do NICS Trading Ecosystem: {key} ({validity}).\n1. Baixe o app para Windows: {url}\n2. Instale-o e entre com Telegram ou e-mail.\n3. Introduza a chave quando o app pedir.",
};

const STRINGS: Partial<Record<CabinetLanguage, LicenseStrings>> = { en, ru, bg, es, pt };

export const licenseStrings = (language: CabinetLanguage): LicenseStrings => STRINGS[language] ?? en;

export const reasonText = (s: LicenseStrings, reason?: string | null): string | null => {
  if (!reason) return null;
  const key = `reason${reason}` as keyof LicenseStrings;
  return s[key] ?? s.reasonKEY_INVALID;
};
