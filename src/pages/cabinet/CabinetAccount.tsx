import { useState } from "react";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import type { CabinetTranslationKey } from "@/features/cabinet/i18n";
import {
  EmailLogin,
  GOOGLE_CLIENT_ID,
  GoogleLoginButton,
  TelegramLoginButton,
} from "@/features/cabinet/LoginMethods";
import { isTelegramLinked } from "@/features/cabinet/useCabinetAuth";
import { useCabinetOutletContext } from "./CabinetLayout";

// Sign-in methods of this account; adding one links it to the same user.
const CabinetAccount = () => {
  const { t, language, auth } = useCabinetOutletContext();
  const user = auth.user;
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const link = async (call: () => Promise<string | null>) => {
    setBusy(true);
    setMessage(null);
    const error = await call();
    setBusy(false);
    setMessage(
      error
        ? { ok: false, text: t(`error${error}` as CabinetTranslationKey) }
        : { ok: true, text: t("accountSaved") },
    );
  };

  const rows: Array<{ key: string; label: string; linked: boolean; detail?: string | null }> = [
    { key: "telegram", label: t("accountTelegram"), linked: isTelegramLinked(user), detail: user?.username ? `@${user.username}` : null },
    { key: "email", label: t("accountEmail"), linked: Boolean(user?.email), detail: user?.email },
    { key: "google", label: t("accountGoogle"), linked: Boolean(user?.googleLinked) },
  ];

  return (
    <section className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold">{t("accountTitle")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("accountLead")}</p>
      </div>

      <ul className="divide-y divide-border rounded-2xl border border-border bg-card">
        {rows.map((row) => (
          <li key={row.key} className="flex items-center justify-between gap-4 px-4 py-3">
            <div className="flex items-center gap-3">
              {row.linked ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground" />
              )}
              <div>
                <p className="text-sm font-medium">{row.label}</p>
                {row.linked && row.detail && (
                  <p className="text-xs text-muted-foreground">{row.detail}</p>
                )}
              </div>
            </div>
            <span className="text-xs text-muted-foreground">
              {row.linked ? t("accountLinked") : t("accountNotLinked")}
            </span>
          </li>
        ))}
      </ul>

      {busy ? (
        <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
      ) : (
        <div className="space-y-6">
          {!isTelegramLinked(user) && (
            <div className="space-y-2 rounded-2xl border border-border bg-card p-4 text-center">
              <p className="text-sm font-medium">{t("accountAddTelegram")}</p>
              <TelegramLoginButton onAuth={(tgUser) => void link(() => auth.login(tgUser, language))} />
            </div>
          )}
          {!user?.googleLinked && GOOGLE_CLIENT_ID && (
            <div className="space-y-2 rounded-2xl border border-border bg-card p-4 text-center">
              <p className="text-sm font-medium">{t("accountAddGoogle")}</p>
              <GoogleLoginButton
                language={language}
                onCredential={(credential) => void link(() => auth.loginGoogle(credential, language))}
              />
            </div>
          )}
          {!user?.email && (
            <div className="rounded-2xl border border-border bg-card p-4">
              <EmailLogin
                t={t}
                language={language}
                onAccountSession={(accountSession) => link(() => auth.loginEmail(accountSession, language))}
              />
            </div>
          )}
        </div>
      )}

      {message && (
        <p
          className={
            message.ok
              ? "rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700"
              : "rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-700"
          }
        >
          {message.text}
        </p>
      )}
    </section>
  );
};

export default CabinetAccount;
