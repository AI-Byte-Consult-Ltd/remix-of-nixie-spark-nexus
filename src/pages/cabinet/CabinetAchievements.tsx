import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCabinetOutletContext } from "./CabinetLayout";
import { useCabinetQuery } from "@/features/cabinet/useCabinetQuery";
import type { DashboardResponseData } from "@/features/cabinet/types";

const CabinetAchievements = () => {
  const { session, language, t, updateSession } = useCabinetOutletContext();

  const { data, isLoading, errorCode } = useCabinetQuery<DashboardResponseData>({
    action: "achievements",
    session,
    language,
    onRenewedToken: updateSession,
  });

  const dashboard = data?.dashboard;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <h1 className="text-2xl font-bold text-gradient-gold">{t("achievementsTitle")}</h1>

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
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t("achievementsLessonsPassed")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">
                {dashboard.academy.passedCount} / {dashboard.academy.totalLessons}
              </p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t("certificateReady")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dashboard.certificate ? (
                <a
                  href={`https://n8n.aibyteconsult.com/webhook/nics-certificate-view?id=${dashboard.certificate.verifySlug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary underline"
                >
                  {t("viewCertificate")}
                </a>
              ) : (
                <p className="text-xs text-muted-foreground">{t("certificateNotYet")}</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-border bg-card sm:col-span-2">
            <CardContent className="pt-6">
              <p className="text-xs text-muted-foreground">{t("achievementsSignalsNote")}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CabinetAchievements;
