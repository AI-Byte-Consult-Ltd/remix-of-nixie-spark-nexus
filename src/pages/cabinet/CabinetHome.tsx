import { Loader2, LineChart, ShieldCheck, Target, Bot as BotIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCabinetOutletContext } from "./CabinetLayout";
import { useCabinetQuery } from "@/features/cabinet/useCabinetQuery";
import type { DashboardResponseData } from "@/features/cabinet/types";

const BOT_URL = "https://t.me/nics_ai_bot";
const LIVE_STATS_URL = "https://n8n.aibyteconsult.com/webhook/nics-public-performance-view";

const CabinetHome = () => {
  const { session, user, language, t, updateSession } = useCabinetOutletContext();

  const { data, isLoading, errorCode } = useCabinetQuery<DashboardResponseData>({
    action: "dashboard",
    session,
    language,
    onRenewedToken: updateSession,
  });

  const dashboard = data?.dashboard;
  const isSubscriptionActive = dashboard?.subscription?.status === "active";

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gradient-gold">
          {t("welcomeBack")}, {user.firstName || user.username || `#${user.id}`}
        </h1>
      </div>

      <Card className="overflow-hidden border-border bg-gradient-to-br from-primary/10 via-card to-card">
        <CardContent className="grid gap-6 pt-6 md:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="text-lg font-semibold text-foreground">{t("homeIntroTitle")}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {t("homeIntroDesc")}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={LIVE_STATS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/15"
              >
                <LineChart className="h-3.5 w-3.5" />
                {t("homeLiveStatsLabel")}
              </a>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 md:grid-cols-1">
            {[
              { icon: Target, label: "Entry · SL · TP1–TP4" },
              { icon: BotIcon, label: "Telegram + Mini App" },
              { icon: ShieldCheck, label: "Gold · Oil · Forex · Crypto" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-background/60 p-3 text-center md:flex-row md:text-left"
              >
                <item.icon className="h-4 w-4 flex-shrink-0 text-primary" />
                <span className="text-[11px] leading-tight text-muted-foreground md:text-xs">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> {t("loading")}
        </div>
      )}

      {errorCode && (
        <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{errorCode}</p>
      )}

      {dashboard && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="border-primary/30 bg-primary/5 sm:col-span-2 lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-primary">
                {t("cashbackLabel")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">
                {dashboard.cashbackAvailableXtr} XTR
              </p>
              <p className="text-xs text-muted-foreground">{t("cashbackHint")}</p>
              <a
                href="https://t.me/nics_ai_bot"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-xs text-primary underline"
              >
                {t("cashbackGoReferral")}
              </a>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t("subscriptionLabel")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant={isSubscriptionActive ? "default" : "secondary"}>
                {isSubscriptionActive ? t("subscriptionActive") : t("subscriptionNone")}
              </Badge>
              {isSubscriptionActive && dashboard.subscription?.expiresAt && (
                <p className="mt-2 text-xs text-muted-foreground">
                  {t("subscriptionExpiresAt")}:{" "}
                  {new Date(dashboard.subscription.expiresAt).toLocaleDateString()}
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t("academyProgressLabel")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">
                {dashboard.academy.passedCount} / {dashboard.academy.totalLessons}
              </p>
              <p className="text-xs text-muted-foreground">{t("academyLessonsPassed")}</p>
            </CardContent>
          </Card>

          {dashboard.certificate && (
            <Card className="border-emerald-300 bg-emerald-50 sm:col-span-2 lg:col-span-3">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-emerald-700">
                  {t("certificateReady")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <a
                  href={`https://n8n.aibyteconsult.com/webhook/nics-certificate-view?id=${dashboard.certificate.verifySlug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary underline"
                >
                  {t("viewCertificate")}
                </a>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <Button asChild variant="outline">
        <a href={BOT_URL} target="_blank" rel="noopener noreferrer">
          {t("continueInBot")}
        </a>
      </Button>
    </div>
  );
};

export default CabinetHome;
