import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, ArrowLeftCircle, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useCabinetOutletContext } from "./CabinetLayout";
import { useCabinetQuery } from "@/features/cabinet/useCabinetQuery";
import type { AcademyLessonResponseData } from "@/features/cabinet/types";

const CabinetLessonView = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const { session, language, t, updateSession } = useCabinetOutletContext();

  const { data, isLoading, errorCode } = useCabinetQuery<AcademyLessonResponseData>({
    action: "academy_lesson",
    session,
    language,
    onRenewedToken: updateSession,
    payload: { lessonId },
  });

  const lesson = data?.lesson;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        to="/cabinet/academy"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeftCircle className="h-4 w-4" />
        {t("lessonBack")}
      </Link>

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> {t("loading")}
        </div>
      )}

      {errorCode && (
        <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{errorCode}</p>
      )}

      {!isLoading && !errorCode && !lesson && (
        <p className="text-sm text-muted-foreground">{t("lessonNotFound")}</p>
      )}

      {lesson && (
        <Card className="border-border bg-card">
          <CardContent className="space-y-6 pt-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {t("lessonModuleLabel")} {lesson.moduleNumber}: {lesson.moduleTitle}
              </p>
              <h1 className="mt-1 text-2xl font-bold text-gradient-gold">
                {t("lessonNumber")} {lesson.sortOrder}: {lesson.title}
              </h1>
            </div>

            <div
              className="lesson-body max-w-none text-sm leading-relaxed text-foreground [&_h2]:mt-6 [&_h2]:mb-2 [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:mt-4 [&_h3]:mb-1.5 [&_h3]:text-base [&_h3]:font-semibold [&_p]:mb-3 [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1 [&_svg]:my-4 [&_svg]:max-w-full [&_blockquote]:my-3 [&_blockquote]:border-l-2 [&_blockquote]:border-primary/40 [&_blockquote]:pl-3 [&_blockquote]:text-muted-foreground"
              // Content is authored server-side by us (academy_lessons_full), not user
              // input -- same trust boundary as the compact Telegram body already
              // rendered as HTML by the bot.
              dangerouslySetInnerHTML={{ __html: lesson.bodyHtml }}
            />

            <div className="flex items-center justify-between border-t border-border pt-4">
              {lesson.prevId ? (
                <Link
                  to={`/cabinet/academy/${lesson.prevId}`}
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {t("lessonPrev")}
                </Link>
              ) : (
                <span />
              )}
              {lesson.nextId && (
                <Link
                  to={`/cabinet/academy/${lesson.nextId}`}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80"
                >
                  {t("lessonNext")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CabinetLessonView;
