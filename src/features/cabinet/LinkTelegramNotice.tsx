import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CabinetTranslation, CabinetTranslationKey } from "./i18n";
import { TELEGRAM_BOT_USERNAME, TelegramLoginButton } from "./LoginMethods";
import type { TelegramLoginPayload } from "./types";

/*
 * Shown instead of the Trader pages to an account signed in by e-mail or
 * Google that has no Telegram linked yet: signals, subscription and stats
 * all belong to the bot user, so linking once is what unlocks them.
 */
export const LinkTelegramNotice = ({
  t,
  onTelegramAuth,
}: {
  t: CabinetTranslation;
  onTelegramAuth: (user: TelegramLoginPayload) => Promise<string | null>;
}) => {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <section className="mx-auto max-w-xl rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
      <Send className="mx-auto h-8 w-8 text-primary" />
      <h1 className="mt-3 text-lg font-semibold">{t("linkTelegramTitle")}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{t("linkTelegramLead")}</p>
      <div className="mt-4 space-y-1 text-left text-sm text-muted-foreground">
        <p>{t("linkTelegramStep1")}</p>
        <p>{t("linkTelegramStep2")}</p>
      </div>
      <Button asChild variant="outline" className="mt-4">
        <a href={`https://t.me/${TELEGRAM_BOT_USERNAME}?start=cabinet`} target="_blank" rel="noopener noreferrer">
          {t("linkTelegramOpenBot")}
        </a>
      </Button>
      <div className="mt-5">
        {busy ? (
          <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
        ) : (
          <TelegramLoginButton
            onAuth={async (user) => {
              setBusy(true);
              setError(await onTelegramAuth(user));
              setBusy(false);
            }}
          />
        )}
      </div>
      {error && (
        <p className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-700">
          {t(`error${error}` as CabinetTranslationKey)}
        </p>
      )}
    </section>
  );
};
