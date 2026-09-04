import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCabinetOutletContext } from "./CabinetLayout";
import { useCabinetQuery } from "@/features/cabinet/useCabinetQuery";
import type { DashboardResponseData } from "@/features/cabinet/types";

const BOT_URL = "https://t.me/nics_ai_bot";

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
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gradient-gold">
          {t("welcomeBack")}, {user.firstName || user.username || `#${user.id}`}
        </h1>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> {t("loading")}
        </div>
      )}

      {errorCode && (
        <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{errorCode}</p>
      )}

      {dashboard && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="border-primary/30 bg-primary/5 sm:col-span-2">
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
            <Card className="border-emerald-300 bg-emerald-50 sm:col-span-2">
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
