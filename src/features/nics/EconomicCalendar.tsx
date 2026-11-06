import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Clock, Loader2, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { AppLanguage } from "./types";

/*
 * Economic calendar of the week (2026-11-04).
 * Data: n8n "[40 TRADER] Economic Calendar" -> public GET webhook, built from the
 * ForexFactory weekly export that the backend syncs hourly. The same data feeds the
 * Telegram bot (/calendar). Descriptions are rule-based facts about what an event
 * measures and which instruments it usually moves; no price forecasts.
 */

const CALENDAR_API =
  "https://n8n.aibyteconsult.com/webhook/nics-economic-calendar";

type Impact = "High" | "Medium" | "Low" | "Holiday";

interface CalendarEvent {
  time: string;
  day: string;
  currency: string;
  flag: string;
  country: string;
  impact: Impact;
  category: string;
  title: string;
  what: string;
  effect: string;
  instruments: string[];
  data: string[];
  score: number;
}

interface CalendarDay {
  date: string;
  label: string;
  mark: "key" | "important" | "";
  events: CalendarEvent[];
}

interface CalendarResponse {
  lang: AppLanguage;
  weekLabel: string;
  title: string;
  theme: string;
  whyTitle: string;
  why: string[];
  days: CalendarDay[];
  lowImpactCount: number;
  note: string;
  ui: {
    important: string;
    key: string;
    affects: string;
    impact: Partial<Record<Impact, string>>;
    empty: string;
    showLow: string;
    hideLow: string;
    coverage: string;
  };
  source: string;
  generatedAt: string;
}

const LOCAL_TEXT: Record<
  AppLanguage,
  { loading: string; error: string; retry: string; low: string; localTime: string; allDay: string }
> = {
  ru: {
    loading: "Загружаем календарь…",
    error: "Не удалось загрузить календарь.",
    retry: "Повторить",
    low: "низкая важность",
    localTime: "Время показано по вашему часовому поясу",
    allDay: "весь день",
  },
  bg: {
    loading: "Зареждаме календара…",
    error: "Календарът не можа да се зареди.",
    retry: "Опитай пак",
    low: "ниска важност",
    localTime: "Часът е по вашата часова зона",
    allDay: "цял ден",
  },
  en: {
    loading: "Loading the calendar…",
    error: "Could not load the calendar.",
    retry: "Retry",
    low: "low impact",
    localTime: "Times are shown in your time zone",
    allDay: "all day",
  },
  es: {
    loading: "Cargando el calendario…",
    error: "No se pudo cargar el calendario.",
    retry: "Reintentar",
    low: "importancia baja",
    localTime: "Las horas se muestran en tu zona horaria",
    allDay: "todo el día",
  },
  pt: {
    loading: "Carregando o calendário…",
    error: "Não foi possível carregar o calendário.",
    retry: "Tentar novamente",
    low: "baixa importância",
    localTime: "Os horários são mostrados no seu fuso horário",
    allDay: "dia inteiro",
  },
};

const LOCALE: Record<AppLanguage, string> = {
  ru: "ru-RU",
  bg: "bg-BG",
  en: "en-GB",
  es: "es-ES",
  pt: "pt-BR",
};

const IMPACT_STYLE: Record<Impact, string> = {
  High: "bg-rose-400/15 text-rose-300",
  Medium: "bg-amber-400/15 text-amber-300",
  Low: "bg-white/[0.06] text-slate-400",
  Holiday: "bg-sky-400/15 text-sky-300",
};

const IMPACT_DOT: Record<Impact, string> = {
  High: "bg-rose-400",
  Medium: "bg-amber-400",
  Low: "bg-slate-500",
  Holiday: "bg-sky-400",
};

const isAllDay = (iso: string) => {
  const d = new Date(iso);
  return d.getUTCHours() === 0 && d.getUTCMinutes() === 0;
};

interface EconomicCalendarProps {
  language: AppLanguage;
}

export const EconomicCalendar = ({ language }: EconomicCalendarProps) => {
  const local = LOCAL_TEXT[language] ?? LOCAL_TEXT.en;
  const [data, setData] = useState<CalendarResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [showLow, setShowLow] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setFailed(false);
    fetch(`${CALENDAR_API}?lang=${encodeURIComponent(language)}`, {
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error(String(response.status));
        return response.json() as Promise<CalendarResponse>;
      })
      .then((json) => setData(json))
      .catch((error: unknown) => {
        if ((error as { name?: string })?.name !== "AbortError") setFailed(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [language, reloadKey]);

  const timeFormat = useMemo(
    () =>
      new Intl.DateTimeFormat(LOCALE[language] ?? "en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    [language],
  );

  const days = useMemo(() => {
    if (!data) return [];
    return data.days
      .map((day) => ({
        ...day,
        events: showLow ? day.events : day.events.filter((event) => event.impact !== "Low"),
      }))
      .filter((day) => day.events.length > 0);
  }, [data, showLow]);

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-sm text-slate-400">
        <Loader2 className="h-4 w-4 animate-spin" />
        {local.loading}
      </div>
    );
  }

  if (failed && !data) {
    return (
      <Card className="border-white/10 bg-white/[0.045] text-white shadow-none">
        <CardContent className="flex flex-col items-center gap-3 py-10 text-sm text-slate-400">
          <p>{local.error}</p>
          <Button variant="outline" size="sm" onClick={() => setReloadKey((key) => key + 1)}>
            <RefreshCw className="mr-2 h-4 w-4" />
            {local.retry}
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  const impactLabel = (impact: Impact) =>
    impact === "Low" ? local.low : data.ui.impact[impact] ?? impact;

  return (
    <div className="space-y-4 text-white">
      <Card className="border-white/10 bg-white/[0.045] text-white shadow-none">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <CalendarDays className="h-4 w-4 text-sky-300" />
            <span>{data.title.replace(/^📅\s*/, "")}</span>
          </CardTitle>
          <p className="text-xs text-slate-500">{data.weekLabel}</p>
        </CardHeader>
        {data.theme ? (
          <CardContent className="pt-0">
            <p className="text-sm leading-relaxed text-slate-200">{data.theme}</p>
          </CardContent>
        ) : null}
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="flex items-center gap-1.5 text-xs text-slate-500">
          <Clock className="h-3.5 w-3.5" />
          {local.localTime}
        </p>
        {data.lowImpactCount > 0 ? (
          <Button
            variant="outline"
            size="sm"
            className="border-white/15 bg-transparent text-xs text-slate-200 hover:bg-white/10"
            onClick={() => setShowLow((value) => !value)}
          >
            {showLow ? data.ui.hideLow : `${data.ui.showLow} (+${data.lowImpactCount})`}
          </Button>
        ) : null}
      </div>

      {days.length === 0 ? (
        <Card className="border-white/10 bg-white/[0.045] text-white shadow-none">
          <CardContent className="py-10 text-center text-sm text-slate-400">{data.ui.empty}</CardContent>
        </Card>
      ) : (
        days.map((day) => (
          <Card
            key={day.date}
            className={cn(
              "border-white/10 bg-white/[0.045] text-white shadow-none",
              day.mark === "key" && "border-rose-400/40",
              day.mark === "important" && "border-amber-400/30",
            )}
          >
            <CardHeader className="pb-2">
              <CardTitle className="flex flex-wrap items-center gap-2 text-sm">
                <span className="capitalize">{day.label}</span>
                {day.mark ? (
                  <Badge
                    className={cn(
                      "border-0 text-[11px]",
                      day.mark === "key"
                        ? "bg-rose-400/15 text-rose-300"
                        : "bg-amber-400/15 text-amber-300",
                    )}
                  >
                    {day.mark === "key" ? data.ui.key : data.ui.important}
                  </Badge>
                ) : null}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {day.events.map((event, index) => (
                <div
                  key={`${event.time}-${event.currency}-${event.title}-${index}`}
                  className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3"
                >
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className={cn("h-2 w-2 shrink-0 rounded-full", IMPACT_DOT[event.impact])} />
                    <span className="font-mono text-slate-300">
                      {event.impact === "Holiday" && isAllDay(event.time) ? local.allDay : timeFormat.format(new Date(event.time))}
                    </span>
                    <span>
                      {event.flag} {event.currency}
                    </span>
                    <Badge className={cn("border-0 text-[10px] font-normal", IMPACT_STYLE[event.impact])}>
                      {impactLabel(event.impact)}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm font-medium text-slate-100">
                    {event.impact === "Holiday" ? "⚠ " : ""}
                    {event.what || event.title}
                  </p>
                  {event.what && event.what !== event.title ? (
                    <p className="text-[11px] text-slate-500">{event.title}</p>
                  ) : null}
                  {event.effect ? (
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-300">→ {event.effect}</p>
                  ) : null}
                  {event.data?.length ? (
                    <div className="mt-1.5 space-y-0.5">
                      {event.data.map((line) => (
                        <p key={line} className="text-[11px] text-slate-400">
                          📊 {line}
                        </p>
                      ))}
                    </div>
                  ) : null}
                  {event.instruments?.length ? (
                    <div className="mt-2 flex flex-wrap items-center gap-1">
                      <span className="text-[10px] uppercase tracking-wide text-slate-500">
                        {data.ui.affects}:
                      </span>
                      {event.instruments.map((symbol) => (
                        <span
                          key={symbol}
                          className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[10px] text-slate-300"
                        >
                          {symbol}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </CardContent>
          </Card>
        ))
      )}

      {data.why?.length ? (
        <Card className="border-white/10 bg-white/[0.045] text-white shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{data.whyTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1.5 pt-0">
            {data.why.map((line) => (
              <p key={line} className="text-xs leading-relaxed text-slate-300">
                • {line}
              </p>
            ))}
          </CardContent>
        </Card>
      ) : null}

      <p className="px-1 text-[11px] leading-relaxed text-slate-500">
        {data.ui.coverage} {data.note.replace(/^[^.]*UTC\.\s*/, "")}
      </p>
    </div>
  );
};

export default EconomicCalendar;
