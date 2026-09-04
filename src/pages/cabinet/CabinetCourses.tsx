import { Loader2, Lock, CheckCircle2, Circle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useCabinetOutletContext } from "./CabinetLayout";
import { useCabinetQuery } from "@/features/cabinet/useCabinetQuery";
import type { CoursesResponseData } from "@/features/cabinet/types";

const CabinetCourses = () => {
  const { session, language, t, updateSession } = useCabinetOutletContext();

  const { data, isLoading, errorCode } = useCabinetQuery<CoursesResponseData>({
    action: "courses",
    session,
    language,
    onRenewedToken: updateSession,
  });

  const lessons = data?.lessons ?? [];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold text-gradient-gold">{t("coursesTitle")}</h1>

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> {t("loading")}
        </div>
      )}

      {errorCode && (
        <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{errorCode}</p>
      )}

      {!isLoading && lessons.length === 0 && !errorCode && (
        <p className="text-sm text-muted-foreground">{t("noCourses")}</p>
      )}

      <div className="space-y-2">
        {lessons.map((lesson) => (
          <Card key={lesson.id} className="border-border bg-card">
            <CardContent className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                {lesson.passed ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                ) : lesson.current ? (
                  <Circle className="h-5 w-5 text-primary" />
                ) : (
                  <Lock className="h-5 w-5 text-muted-foreground" />
                )}
                <span
                  className={cn(
                    "text-sm",
                    lesson.passed || lesson.current ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {lesson.sortOrder}. {lesson.title}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {lesson.passed
                  ? t("lessonPassed")
                  : lesson.current
                    ? t("lessonCurrent")
                    : t("lessonLocked")}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CabinetCourses;
