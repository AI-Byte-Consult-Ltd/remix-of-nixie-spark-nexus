import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCabinetOutletContext } from "./CabinetLayout";
import { useCabinetQuery } from "@/features/cabinet/useCabinetQuery";
import type { CoursesResponseData } from "@/features/cabinet/types";

const CabinetAcademy = () => {
  const { session, language, t, updateSession } = useCabinetOutletContext();

  const { data, isLoading, errorCode } = useCabinetQuery<CoursesResponseData>({
    action: "academy",
    session,
    language,
    onRenewedToken: updateSession,
  });

  const currentLesson = data?.lessons?.find((lesson) => lesson.current);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold text-gradient-gold">{t("academyTitle")}</h1>

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Loader2 className="h-4 w-4 animate-spin" /> {t("loading")}
        </div>
      )}

      {errorCode && (
        <p className="rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-300">{errorCode}</p>
      )}

      {currentLesson && (
        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-300">
              {t("currentLesson")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-slate-100">
              {t("lessonNumber")} {currentLesson.sortOrder}: {currentLesson.title}
            </p>
            <p className="mt-2 text-xs text-slate-400">{t("academyHint")}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CabinetAcademy;
