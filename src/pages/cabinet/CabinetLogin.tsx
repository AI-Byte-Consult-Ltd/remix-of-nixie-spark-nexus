import { useMemo, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import SEO from "@/components/SEO";
import { Checkbox } from "@/components/ui/checkbox";
import { CABINET_LANGUAGES, createCabinetTranslator, type CabinetTranslationKey } from "@/features/cabinet/i18n";
import { CabinetLanguageSwitch } from "@/features/cabinet/CabinetLanguageSwitch";
import { EmailLogin, GOOGLE_CLIENT_ID, GoogleLoginButton, TelegramLoginButton } from "@/features/cabinet/LoginMethods";
import { useCabinetAuth } from "@/features/cabinet/useCabinetAuth";
import type { CabinetLanguage } from "@/features/cabinet/types";
import { useInstallableApp } from "@/lib/installableApp";

const CabinetLogin = () => {
  const { language: siteLanguage } = useLanguage();
  const auth = useCabinetAuth();
  useInstallableApp("trading");
  const [consentChecked, setConsentChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorCode, setErrorCode] = useState<string | null>(null);

  const cabinetLanguage: CabinetLanguage = useMemo(() => {
    return (CABINET_LANGUAGES as string[]).includes(siteLanguage)
      ? (siteLanguage as CabinetLanguage)
      : "en";
  }, [siteLanguage]);

  const t = useMemo(() => createCabinetTranslator(cabinetLanguage), [cabinetLanguage]);

  const run = async (login: () => Promise<string | null>) => {
    setIsSubmitting(true);
    setErrorCode(null);
    const error = await login();
    setIsSubmitting(false);
    setErrorCode(error);
  };

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
      <main className="grid min-h-screen place-items-center bg-background px-4 py-10 text-foreground">
        <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
          <CabinetLanguageSwitch className="mb-4" />
          <h1 className="text-xl font-bold text-gradient-gold">{t("loginTitle")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t(GOOGLE_CLIENT_ID ? "loginSubtitleAll" : "loginSubtitleNoGoogle")}</p>

          <label className="mt-6 flex items-start gap-2 text-left text-xs text-muted-foreground">
            <Checkbox
              checked={consentChecked}
              onCheckedChange={(value) => setConsentChecked(value === true)}
              className="mt-0.5"
            />
            <span>
              {t("loginConsentPrefix")}{" "}
              <Link to="/terms" className="text-primary underline" target="_blank">
                {t("loginConsentTerms")}
              </Link>{" "}
              {t("loginConsentAnd")}{" "}
              <Link to="/privacy" className="text-primary underline" target="_blank">
                {t("loginConsentPrivacy")}
              </Link>
              .
            </span>
          </label>

          {!consentChecked ? (
            <p className="mt-6 text-xs text-muted-foreground">{t("loginWidgetBlocked")}</p>
          ) : isSubmitting ? (
            <div className="mt-6 flex min-h-[52px] items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              <TelegramLoginButton
                onAuth={(user) => void run(() => auth.login(user, cabinetLanguage))}
              />
              <GoogleLoginButton
                language={cabinetLanguage}
                onCredential={(credential) =>
                  void run(() => auth.loginGoogle(credential, cabinetLanguage))
                }
              />
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="h-px flex-1 bg-border" />
                {t("loginOr")}
                <span className="h-px flex-1 bg-border" />
              </div>
              <EmailLogin
                t={t}
                language={cabinetLanguage}
                onAccountSession={(accountSession) =>
                  run(() => auth.loginEmail(accountSession, cabinetLanguage))
                }
              />
            </div>
          )}

          {errorCode && (
            <p className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-700">
              {t(`error${errorCode}` as CabinetTranslationKey)}
            </p>
          )}
        </div>
      </main>
    </>
  );
};

export default CabinetLogin;
