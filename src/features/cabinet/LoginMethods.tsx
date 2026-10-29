import { FormEvent, useEffect, useRef, useState } from "react";
import { Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sendCode, useAccount, validEmail, verifyCode } from "@/features/account/account";
import type { CabinetTranslation } from "./i18n";
import type { TelegramLoginPayload } from "./types";

export const TELEGRAM_BOT_USERNAME = "nics_ai_bot";

// Google Identity Services web client id (public by design: it is sent to
// every visitor's browser). Empty until the OAuth client exists in Google
// Cloud; the Google button stays hidden until then. The same value goes to
// app_secrets.google_oauth_client_id, which [16 CABINET] checks tokens against.
export const GOOGLE_CLIENT_ID = "";

declare global {
  interface Window {
    onNicsCabinetTelegramAuth?: (user: TelegramLoginPayload) => void;
    google?: {
      accounts: {
        id: {
          initialize: (options: {
            client_id: string;
            callback: (response: { credential?: string }) => void;
            ux_mode?: "popup" | "redirect";
          }) => void;
          renderButton: (element: HTMLElement, options: Record<string, unknown>) => void;
        };
      };
    };
  }
}

export const TelegramLoginButton = ({
  onAuth,
}: {
  onAuth: (user: TelegramLoginPayload) => void;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const onAuthRef = useRef(onAuth);
  onAuthRef.current = onAuth;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    window.onNicsCabinetTelegramAuth = (user) => onAuthRef.current(user);

    container.innerHTML = "";
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    script.setAttribute("data-telegram-login", TELEGRAM_BOT_USERNAME);
    script.setAttribute("data-size", "large");
    script.setAttribute("data-onauth", "onNicsCabinetTelegramAuth(user)");
    script.setAttribute("data-request-access", "write");
    container.appendChild(script);

    return () => {
      container.innerHTML = "";
      window.onNicsCabinetTelegramAuth = undefined;
    };
  }, []);

  return <div ref={containerRef} className="flex min-h-[40px] justify-center" />;
};

let googleScript: Promise<void> | null = null;
const loadGoogleScript = () => {
  googleScript ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      googleScript = null;
      reject(new Error("gsi"));
    };
    document.head.appendChild(script);
  });
  return googleScript;
};

export const GoogleLoginButton = ({
  onCredential,
  language,
}: {
  onCredential: (credential: string) => void;
  language: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const onCredentialRef = useRef(onCredential);
  onCredentialRef.current = onCredential;

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;
    let cancelled = false;
    loadGoogleScript()
      .then(() => {
        const container = containerRef.current;
        if (cancelled || !container || !window.google) return;
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response) => {
            if (response.credential) onCredentialRef.current(response.credential);
          },
        });
        window.google.accounts.id.renderButton(container, {
          theme: "filled_black",
          size: "large",
          shape: "pill",
          text: "signin_with",
          locale: language,
          width: 260,
        });
      })
      .catch(() => {
        // Script blocked (ad blocker, offline): the other methods remain.
      });
    return () => {
      cancelled = true;
    };
  }, [language]);

  if (!GOOGLE_CLIENT_ID) return null;
  return <div ref={containerRef} className="flex min-h-[44px] justify-center" />;
};

const EMAIL_ERRORS: Record<string, Parameters<CabinetTranslation>[0]> = {
  email: "errorEmail",
  code: "errorCode",
  wrong_code: "errorWrongCode",
  too_many: "errorTooMany",
  mail_unavailable: "errorMail",
  network: "errorNetwork",
  session: "errorEMAIL_SESSION_INVALID",
};

/*
 * E-mail code sign-in, the same one NICS Video and Studio use
 * (src/features/account). An address already signed in there on this
 * device is offered as a one-click continue.
 */
export const EmailLogin = ({
  t,
  language,
  onAccountSession,
}: {
  t: CabinetTranslation;
  language: string;
  onAccountSession: (accountSession: string) => Promise<void>;
}) => {
  const savedAccount = useAccount();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [codeSentTo, setCodeSentTo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const finish = async (accountSession: string) => {
    setBusy(true);
    await onAccountSession(accountSession);
    setBusy(false);
  };

  const requestCode = async (event: FormEvent) => {
    event.preventDefault();
    if (!validEmail(email)) {
      setError("email");
      return;
    }
    setBusy(true);
    setError(null);
    const result = await sendCode(email, language);
    setBusy(false);
    if (result.ok) setCodeSentTo(email.trim().toLowerCase());
    else setError(result.error ?? "network");
  };

  const confirmCode = async (event: FormEvent) => {
    event.preventDefault();
    const digits = code.replace(/\D/g, "");
    if (digits.length !== 6 || !codeSentTo) {
      setError("code");
      return;
    }
    setBusy(true);
    setError(null);
    const result = await verifyCode(codeSentTo, digits);
    if (result.ok && typeof result.data.session === "string") {
      await finish(result.data.session);
      return;
    }
    setBusy(false);
    setError(result.error ?? "network");
  };

  return (
    <div className="space-y-3 text-left">
      <p className="flex items-center gap-2 text-sm font-medium">
        <Mail className="h-4 w-4 text-primary" />
        {t("loginEmailTitle")}
      </p>

      {savedAccount && !codeSentTo && (
        <Button
          type="button"
          variant="outline"
          className="w-full justify-center"
          disabled={busy}
          onClick={() => void finish(savedAccount.session)}
        >
          {savedAccount.email}
        </Button>
      )}

      {!codeSentTo ? (
        <form onSubmit={(event) => void requestCode(event)} className="flex gap-2">
          <Input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={t("loginEmailPlaceholder")}
          />
          <Button type="submit" disabled={busy} className="shrink-0">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : t("loginSendCode")}
          </Button>
        </form>
      ) : (
        <form onSubmit={(event) => void confirmCode(event)} className="space-y-2">
          <p className="text-xs text-muted-foreground">
            {t("loginCodeSent").replace("{email}", codeSentTo)}
          </p>
          <div className="flex gap-2">
            <Input
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={code}
              onChange={(event) => setCode(event.target.value)}
              placeholder={t("loginCodePlaceholder")}
            />
            <Button type="submit" disabled={busy} className="shrink-0">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : t("loginVerify")}
            </Button>
          </div>
          <button
            type="button"
            className="text-xs text-primary underline"
            onClick={() => {
              setCodeSentTo(null);
              setCode("");
              setError(null);
            }}
          >
            {t("loginOtherEmail")}
          </button>
        </form>
      )}

      {error && (
        <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-700">
          {t(EMAIL_ERRORS[error] ?? "errorNetwork")}
        </p>
      )}
    </div>
  );
};
