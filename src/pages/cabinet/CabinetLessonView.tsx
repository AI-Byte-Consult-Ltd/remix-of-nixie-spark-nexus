import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ArrowLeftCircle,
  CheckCircle2,
  Loader2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCabinetOutletContext } from "./CabinetLayout";
import { useCabinetQuery } from "@/features/cabinet/useCabinetQuery";
import { callCabinetApi, CabinetApiError } from "@/features/cabinet/api";
import type {
  AcademyLessonResponseData,
  QuizQuestion,
  QuizResultItem,
  QuizStartResponseData,
  QuizSubmitResponseData,
} from "@/features/cabinet/types";

type QuizPhase = "idle" | "loading" | "active" | "submitting" | "result" | "error";

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

  const [quizPhase, setQuizPhase] = useState<QuizPhase>("idle");
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [attemptId, setAttemptId] = useState<number | null>(null);
  const [selected, setSelected] = useState<Record<number, number>>({});
  const [quizPassed, setQuizPassed] = useState<boolean>(false);
  const [quizResults, setQuizResults] = useState<QuizResultItem[]>([]);
  const [quizErrorMessage, setQuizErrorMessage] = useState<string | null>(null);

  // A fresh lesson (via prev/next) starts its quiz section from scratch.
  useEffect(() => {
    setQuizPhase("idle");
    setQuizQuestions([]);
    setAttemptId(null);
    setSelected({});
    setQuizResults([]);
  }, [lessonId]);

  const startQuiz = async () => {
    setQuizPhase("loading");
    setQuizErrorMessage(null);
    try {
      const result = await callCabinetApi<QuizStartResponseData>({
        action: "academy_quiz",
        session,
        language,
        payload: { lessonId },
      });
      if (result.data?.renewedToken) updateSession(result.data.renewedToken);

      const quiz = result.data?.quiz;
      if (!quiz?.available || quiz.questions.length !== 3) {
        setQuizErrorMessage(t("quizUnavailable"));
        setQuizPhase("error");
        return;
      }

      setAttemptId(quiz.attemptId);
      setQuizQuestions(quiz.questions);
      setSelected({});
      setQuizPhase("active");
    } catch (error) {
      setQuizErrorMessage(error instanceof CabinetApiError ? error.message : t("quizError"));
      setQuizPhase("error");
    }
  };

  const submitQuiz = async () => {
    if (!attemptId || Object.keys(selected).length !== quizQuestions.length) return;

    setQuizPhase("submitting");
    setQuizErrorMessage(null);
    try {
      const answers = quizQuestions.map((_, index) => selected[index]);
      const result = await callCabinetApi<QuizSubmitResponseData>({
        action: "academy_quiz_submit",
        session,
        language,
        payload: { attemptId, answers },
      });
      if (result.data?.renewedToken) updateSession(result.data.renewedToken);

      setQuizPassed(result.data?.quizResult?.passed ?? false);
      setQuizResults(result.data?.quizResult?.results ?? []);
      setQuizPhase("result");
    } catch (error) {
      setQuizErrorMessage(error instanceof CabinetApiError ? error.message : t("quizError"));
      setQuizPhase("error");
    }
  };

  const allAnswered = Object.keys(selected).length === quizQuestions.length && quizQuestions.length > 0;

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

            {lesson.hasQuiz && (
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <h2 className="mb-3 text-base font-semibold text-foreground">
                  {t("quizSectionTitle")}
                </h2>

                {quizPhase === "idle" && (
                  <Button onClick={startQuiz}>{t("quizStart")}</Button>
                )}

                {quizPhase === "loading" && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" /> {t("quizStarting")}
                  </div>
                )}

                {quizPhase === "error" && (
                  <div className="space-y-2">
                    <p className="text-sm text-rose-600">{quizErrorMessage}</p>
                    <Button variant="outline" onClick={startQuiz}>
                      {t("quizStart")}
                    </Button>
                  </div>
                )}

                {(quizPhase === "active" || quizPhase === "submitting") && (
                  <div className="space-y-5">
                    {quizQuestions.map((question, index) => (
                      <div key={question.questionId} className="space-y-2">
                        <p className="text-sm font-medium text-foreground">
                          {t("quizQuestionLabel")} {index + 1}/3: {question.question}
                        </p>
                        <RadioGroup
                          value={selected[index]?.toString() ?? ""}
                          onValueChange={(value) =>
                            setSelected((prev) => ({ ...prev, [index]: Number(value) }))
                          }
                          disabled={quizPhase === "submitting"}
                        >
                          {question.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="flex items-center gap-2">
                              <RadioGroupItem
                                value={optionIndex.toString()}
                                id={`${question.questionId}-${optionIndex}`}
                              />
                              <Label
                                htmlFor={`${question.questionId}-${optionIndex}`}
                                className="text-sm font-normal text-foreground"
                              >
                                {option}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    ))}

                    {!allAnswered && (
                      <p className="text-xs text-muted-foreground">{t("quizAnswerAllPrompt")}</p>
                    )}

                    <Button onClick={submitQuiz} disabled={!allAnswered || quizPhase === "submitting"}>
                      {quizPhase === "submitting" ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t("quizSubmitting")}
                        </>
                      ) : (
                        t("quizSubmit")
                      )}
                    </Button>
                  </div>
                )}

                {quizPhase === "result" && (
                  <div className="space-y-4">
                    <p
                      className={
                        quizPassed
                          ? "text-sm font-medium text-emerald-600"
                          : "text-sm font-medium text-amber-600"
                      }
                    >
                      {quizPassed ? t("quizPassed") : t("quizFailed")}
                    </p>

                    <div className="space-y-3">
                      {quizResults.map((result, index) => (
                        <div key={result.questionId} className="rounded-md border border-border p-3">
                          <p className="flex items-start gap-2 text-sm font-medium text-foreground">
                            {result.correct ? (
                              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                            ) : (
                              <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
                            )}
                            {t("quizQuestionLabel")} {index + 1}: {result.question}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {t("quizYourAnswer")}: {quizQuestions[index]?.options[result.chosen] ?? ""}
                          </p>
                          {!result.correct && (
                            <p className="text-xs text-muted-foreground">
                              {t("quizCorrectAnswer")}: {quizQuestions[index]?.options[result.correctIndex] ?? ""}
                            </p>
                          )}
                          <p className="mt-1 text-xs text-muted-foreground">{result.explanation}</p>
                        </div>
                      ))}
                    </div>

                    <Button variant="outline" onClick={startQuiz}>
                      {t("quizRetry")}
                    </Button>
                  </div>
                )}
              </div>
            )}

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
