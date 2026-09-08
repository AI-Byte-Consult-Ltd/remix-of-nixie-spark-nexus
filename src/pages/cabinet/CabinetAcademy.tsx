import { Link } from "react-router-dom";
import { CheckCircle2, ChevronRight, Loader2, Lock } from "lucide-react";
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

  const lessons = data?.lessons ?? [];
  const currentLesson = lessons.find((lesson) => lesson.current);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <h1 className="text-2xl font-bold text-gradient-gold">{t("academyTitle")}</h1>

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> {t("loading")}
        </div>
      )}

      {errorCode && (
        <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{errorCode}</p>
      )}

      {currentLesson && (
        <Link to={`/cabinet/academy/${currentLesson.id}`}>
          <Card className="border-border bg-card transition-colors hover:border-primary/40">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t("currentLesson")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold text-foreground">
                {t("lessonNumber")} {currentLesson.sortOrder}: {currentLesson.title}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">{t("academyHint")}</p>
            </CardContent>
          </Card>
        </Link>
      )}

      {lessons.length > 0 && (
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("academyAllLessonsTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {lessons.map((lesson) => (
              <Link
                key={lesson.id}
                to={`/cabinet/academy/${lesson.id}`}
                className="flex items-center justify-between gap-2 rounded-md px-2 py-2 text-sm hover:bg-muted"
              >
                <span className="flex items-center gap-2">
                  {lesson.passed ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                  ) : lesson.current ? (
                    <ChevronRight className="h-4 w-4 shrink-0 text-primary" />
                  ) : (
                    <Lock className="h-4 w-4 shrink-0 text-muted-foreground/50" />
                  )}
                  <span className="text-foreground">
                    {lesson.sortOrder}. {lesson.title}
                  </span>
                </span>
              </Link>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CabinetAcademy;
