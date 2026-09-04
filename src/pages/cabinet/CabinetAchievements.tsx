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
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold text-gradient-gold">{t("achievementsTitle")}</h1>

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Loader2 className="h-4 w-4 animate-spin" /> {t("loading")}
        </div>
      )}

      {errorCode && (
        <p className="rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-300">{errorCode}</p>
      )}

      {dashboard && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="border-white/10 bg-white/5">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-slate-300">
                {t("achievementsLessonsPassed")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-slate-100">
                {dashboard.academy.passedCount} / {dashboard.academy.totalLessons}
              </p>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-slate-300">
                {t("certificateReady")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dashboard.certificate ? (
                <a
                  href={`https://n8n.aibyteconsult.com/webhook/nics-certificate-view?id=${dashboard.certificate.verifySlug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-amber-400 underline"
                >
                  {t("viewCertificate")}
                </a>
              ) : (
                <p className="text-xs text-slate-400">{t("certificateNotYet")}</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5 sm:col-span-2">
            <CardContent className="pt-6">
              <p className="text-xs text-slate-500">{t("achievementsSignalsNote")}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CabinetAchievements;
