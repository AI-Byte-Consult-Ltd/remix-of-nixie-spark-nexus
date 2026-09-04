import { useEffect, useMemo, useRef, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import SEO from "@/components/SEO";
import { Checkbox } from "@/components/ui/checkbox";
import { createCabinetTranslator, type CabinetTranslationKey } from "@/features/cabinet/i18n";
import { useCabinetAuth } from "@/features/cabinet/useCabinetAuth";
import type { CabinetLanguage, TelegramLoginPayload } from "@/features/cabinet/types";

const TELEGRAM_BOT_USERNAME = "nics_ai_bot";
const SUPPORTED_CABINET_LANGUAGES: CabinetLanguage[] = ["ru", "bg", "en", "es"];

declare global {
  interface Window {
    onNicsCabinetTelegramAuth?: (user: TelegramLoginPayload) => void;
  }
}

const CabinetLogin = () => {
  const { language: siteLanguage } = useLanguage();
  const auth = useCabinetAuth();
  const widgetContainerRef = useRef<HTMLDivElement>(null);
  const [consentChecked, setConsentChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorCode, setErrorCode] = useState<string | null>(null);

  const cabinetLanguage: CabinetLanguage = useMemo(() => {
    return (SUPPORTED_CABINET_LANGUAGES as string[]).includes(siteLanguage)
      ? (siteLanguage as CabinetLanguage)
      : "en";
  }, [siteLanguage]);

  const t = useMemo(() => createCabinetTranslator(cabinetLanguage), [cabinetLanguage]);

  useEffect(() => {
    window.onNicsCabinetTelegramAuth = async (telegramUser) => {
      setIsSubmitting(true);
      setErrorCode(null);
      const ok = await auth.login(telegramUser, cabinetLanguage);
      setIsSubmitting(false);
      if (!ok) {
        setErrorCode(auth.loginError ?? "REQUEST_FAILED");
      }
    };
    return () => {
      window.onNicsCabinetTelegramAuth = undefined;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cabinetLanguage]);

  useEffect(() => {
    const container = widgetContainerRef.current;
    if (!container || !consentChecked) return;

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
    };
  }, [consentChecked]);

  if (auth.isAuthenticated) {
    return <Navigate to="/cabinet" replace />;
  }

  return (
    <>
      <SEO
        title="NICS AI Trader — Login"
        description="Log in to your NICS AI Trader personal cabinet."
        canonical="https://aibyteconsult.com/cabinet/login"
        noindex
      />
      <main className="grid min-h-screen place-items-center bg-[#07090f] px-4 text-slate-100">
        <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
          <h1 className="text-xl font-bold text-gradient-gold">{t("loginTitle")}</h1>
          <p className="mt-2 text-sm text-slate-400">{t("loginSubtitle")}</p>

          <label className="mt-6 flex items-start gap-2 text-left text-xs text-slate-400">
            <Checkbox
              checked={consentChecked}
              onCheckedChange={(value) => setConsentChecked(value === true)}
              className="mt-0.5"
            />
            <span>
              {t("loginConsentPrefix")}{" "}
              <Link to="/terms" className="text-amber-400 underline" target="_blank">
                {t("loginConsentTerms")}
              </Link>{" "}
              {t("loginConsentAnd")}{" "}
              <Link to="/privacy" className="text-amber-400 underline" target="_blank">
                {t("loginConsentPrivacy")}
              </Link>
              .
            </span>
          </label>

          <div className="mt-6 flex min-h-[52px] items-center justify-center">
            {isSubmitting ? (
              <Loader2 className="h-6 w-6 animate-spin text-amber-400" />
            ) : consentChecked ? (
              <div ref={widgetContainerRef} />
            ) : (
              <p className="text-xs text-slate-500">{t("loginWidgetBlocked")}</p>
            )}
          </div>

          {consentChecked && !isSubmitting && (
            <p className="mt-2 text-xs text-slate-500">{t("loginWidgetHint")}</p>
          )}

          {errorCode && (
            <p className="mt-4 rounded-lg bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
              {t(`error${errorCode}` as CabinetTranslationKey) || errorCode}
            </p>
          )}
        </div>
      </main>
    </>
  );
};

export default CabinetLogin;
