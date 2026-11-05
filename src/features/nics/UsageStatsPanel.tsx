import { useCallback, useEffect, useState } from "react";
import { BarChart3, Monitor, RefreshCw, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { fetchUsageStats, type UsageBucket, type UsageStats } from "@/lib/usageAnalytics";
import type { AppLanguage } from "./types";

/*
 * Admin-only "How the app is used" block on the System tab (2026-11-05).
 * Aggregates only, from n8n [43 OPS] App Usage Analytics; the server
 * checks the admin flag again. Needs the cabinet session, so inside the
 * Telegram Mini App it points to the Windows app / web cabinet instead.
 */

const TEXT = {
  ru: {
    title: "Как пользуются приложением",
    subtitle: "Только суммарные цифры. Тексты, суммы и ключи не собираются.",
    today: "Сегодня",
    d7: "За 7 дней",
    d30: "За 30 дней",
    activeUsers: "активных пользователей",
    period: "Период",
    days: (n: number) => (n === 1 ? "24 часа" : `${n} дн.`),
    withAdmins: "Учитывать админов",
    events: "действий",
    users: "польз.",
    byDay: "По дням (30 дней)",
    platforms: "Где открывают",
    screens: "Популярные экраны",
    actions: "Действия",
    versions: "Версии приложения",
    languages: "Языки",
    orders: "Заказы сигналов",
    empty: "Пока нет данных за этот период.",
    refresh: "Обновить",
    loading: "Загрузка…",
    error: "Не удалось загрузить статистику.",
    telegramOnly:
      "Статистика использования открывается в Windows-приложении или в веб-кабинете aibyteconsult.com/cabinet.",
  },
  bg: {
    title: "Как се използва приложението",
    subtitle: "Само обобщени числа. Текстове, суми и ключове не се събират.",
    today: "Днес",
    d7: "За 7 дни",
    d30: "За 30 дни",
    activeUsers: "активни потребители",
    period: "Период",
    days: (n: number) => (n === 1 ? "24 часа" : `${n} дни`),
    withAdmins: "С администраторите",
    events: "действия",
    users: "потр.",
    byDay: "По дни (30 дни)",
    platforms: "Къде се отваря",
    screens: "Популярни екрани",
    actions: "Действия",
    versions: "Версии на приложението",
    languages: "Езици",
    orders: "Поръчани сигнали",
    empty: "Още няма данни за този период.",
    refresh: "Обнови",
    loading: "Зареждане…",
    error: "Статистиката не се зареди.",
    telegramOnly:
      "Статистиката се отваря в приложението за Windows или в уеб кабинета aibyteconsult.com/cabinet.",
  },
  en: {
    title: "How the app is used",
    subtitle: "Totals only. No texts, amounts or keys are collected.",
    today: "Today",
    d7: "Last 7 days",
    d30: "Last 30 days",
    activeUsers: "active users",
    period: "Period",
    days: (n: number) => (n === 1 ? "24 hours" : `${n} days`),
    withAdmins: "Include admins",
    events: "actions",
    users: "users",
    byDay: "By day (30 days)",
    platforms: "Where it is opened",
    screens: "Popular screens",
    actions: "Actions",
    versions: "App versions",
    languages: "Languages",
    orders: "Signal orders",
    empty: "No data for this period yet.",
    refresh: "Refresh",
    loading: "Loading…",
    error: "Could not load the statistics.",
    telegramOnly: "Usage statistics open in the Windows app or the web cabinet at aibyteconsult.com/cabinet.",
  },
  es: {
    title: "Cómo se usa la aplicación",
    subtitle: "Solo totales. No se recogen textos, importes ni claves.",
    today: "Hoy",
    d7: "Últimos 7 días",
    d30: "Últimos 30 días",
    activeUsers: "usuarios activos",
    period: "Periodo",
    days: (n: number) => (n === 1 ? "24 horas" : `${n} días`),
    withAdmins: "Incluir administradores",
    events: "acciones",
    users: "usuarios",
    byDay: "Por día (30 días)",
    platforms: "Dónde se abre",
    screens: "Pantallas populares",
    actions: "Acciones",
    versions: "Versiones de la app",
    languages: "Idiomas",
    orders: "Señales pedidas",
    empty: "Aún no hay datos para este periodo.",
    refresh: "Actualizar",
    loading: "Cargando…",
    error: "No se pudieron cargar las estadísticas.",
    telegramOnly: "Las estadísticas se abren en la app de Windows o en el gabinete web aibyteconsult.com/cabinet.",
  },
} as const;

// Readable names for event / screen keys (Russian and English are enough
// for the admin; other languages fall back to English).
const LABELS: Record<string, { ru: string; en: string }> = {
  telegram: { ru: "Telegram Mini App", en: "Telegram Mini App" },
  web: { ru: "Веб-кабинет", en: "Web cabinet" },
  desktop: { ru: "Windows-приложение", en: "Windows app" },
  app_opened: { ru: "Запуск приложения", en: "App opened" },
  mini_app_opened: { ru: "Открытие панели трейдера", en: "Trader panel opened" },
  performance_opened: { ru: "Открыта статистика", en: "Performance opened" },
  referral_opened: { ru: "Открыта рефералка", en: "Referral opened" },
  referral_link_copied: { ru: "Скопирована реф. ссылка", en: "Referral link copied" },
  referral_share_opened: { ru: "Поделились реф. ссылкой", en: "Referral shared" },
  referral_payout_opened: { ru: "Запрос выплаты", en: "Payout requested" },
  signal_opened: { ru: "Открыт сигнал", en: "Signal opened" },
  signal_accepted: { ru: "Сигнал принят", en: "Signal accepted" },
  signal_skipped: { ru: "Сигнал пропущен", en: "Signal skipped" },
  sizing_requested: { ru: "Расчёт лота", en: "Position sizing" },
  sizing_completed: { ru: "Лот рассчитан", en: "Sizing completed" },
  signal_order_sent: { ru: "Заказ сигнала", en: "Signal ordered" },
  broker_link_opened: { ru: "Переход к брокеру", en: "Broker link opened" },
  theme_changed: { ru: "Смена темы", en: "Theme changed" },
  language_changed: { ru: "Смена языка", en: "Language changed" },
  rewards_checkin: { ru: "Ежедневный check-in", en: "Daily check-in" },
  rewards_wheel_spin: { ru: "Колесо удачи", en: "Wheel spin" },
  rewards_redeem: { ru: "Обмен баллов", en: "Points redeemed" },
  support_requested: { ru: "Обращение в поддержку", en: "Support request" },
  dashboard: { ru: "Главная", en: "Dashboard" },
  signals: { ru: "Сигналы", en: "Signals" },
  history: { ru: "История", en: "History" },
  performance: { ru: "Статистика", en: "Performance" },
  risk: { ru: "Риск", en: "Risk" },
  referral: { ru: "Рефералы", en: "Referral" },
  rewards: { ru: "Награды", en: "Rewards" },
  admin: { ru: "Система", en: "System" },
  markets: { ru: "Рынки", en: "Markets" },
  settings: { ru: "Настройки", en: "Settings" },
  updates: { ru: "Обновления", en: "Updates" },
  request: { ru: "Заказать сигнал", en: "Order a signal" },
  about: { ru: "О приложении", en: "About" },
  articles: { ru: "Статьи", en: "Articles" },
  calendar: { ru: "Календарь", en: "Calendar" },
  journal: { ru: "Журнал", en: "Journal" },
  academy: { ru: "Академия", en: "Academy" },
  license: { ru: "Лицензия", en: "License" },
  subscription: { ru: "Подписка", en: "Subscription" },
  support: { ru: "Поддержка", en: "Support" },
  account: { ru: "Аккаунт", en: "Account" },
  overview: { ru: "Обзор кабинета", en: "Cabinet overview" },
  achievements: { ru: "Достижения", en: "Achievements" },
  courses: { ru: "Курсы", en: "Courses" },
  services: { ru: "Сервисы", en: "Services" },
  pro: { ru: "PRO", en: "PRO" },
  QUEUED: { ru: "Принят в работу", en: "Queued" },
  TOO_SOON: { ru: "Слишком часто", en: "Too soon" },
  NO_ACCESS: { ru: "Нет доступа", en: "No access" },
  MARKET_NOT_INCLUDED: { ru: "Рынок не в тарифе", en: "Market not included" },
  MARKET_CLOSED: { ru: "Рынок закрыт", en: "Market closed" },
  INVALID: { ru: "Ошибка запроса", en: "Invalid" },
};

const label = (key: string, language: AppLanguage) => {
  const entry = LABELS[key];
  if (!entry) return key;
  return language === "ru" ? entry.ru : entry.en;
};

const PERIODS = [1, 7, 30, 90];

const BucketList = ({
  title,
  rows,
  language,
  usersLabel,
  eventsLabel,
}: {
  title: string;
  rows: UsageBucket[];
  language: AppLanguage;
  usersLabel: string;
  eventsLabel: string;
}) => {
  const max = Math.max(1, ...rows.map((row) => row.events ?? row.users ?? 0));
  return (
    <Card className="border-white/10 bg-white/[0.045] text-white shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-xs">
        {rows.length === 0 && <p className="text-slate-500">—</p>}
        {rows.map((row) => {
          const value = row.events ?? row.users ?? 0;
          return (
            <div key={row.key} className="space-y-1">
              <div className="flex items-center justify-between gap-3">
                <span className="truncate text-slate-200">{label(row.key, language)}</span>
                <span className="shrink-0 text-slate-400">
                  {row.events !== undefined && `${row.events} ${eventsLabel}`}
                  {row.events !== undefined && row.users !== undefined && " · "}
                  {row.users !== undefined && `${row.users} ${usersLabel}`}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-white/5">
                <div className="h-1.5 rounded-full bg-sky-400/70" style={{ width: `${(value / max) * 100}%` }} />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export const UsageStatsPanel = ({ session, language }: { session: string | null; language: AppLanguage }) => {
  const text = TEXT[language] ?? TEXT.en;
  const [days, setDays] = useState(7);
  const [includeAdmins, setIncludeAdmins] = useState(false);
  const [stats, setStats] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  const load = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    setFailed(false);
    try {
      setStats(await fetchUsageStats(session, days, includeAdmins));
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }, [session, days, includeAdmins]);

  useEffect(() => {
    void load();
  }, [load]);

  if (!session) {
    return (
      <Card className="border-white/10 bg-white/[0.045] text-white shadow-none">
        <CardContent className="flex items-start gap-3 p-4 text-sm text-slate-300">
          <BarChart3 className="mt-0.5 h-4 w-4 shrink-0 text-sky-300" />
          <span>{text.telegramOnly}</span>
        </CardContent>
      </Card>
    );
  }

  const maxDaily = Math.max(1, ...(stats?.daily ?? []).map((d) => d.users));

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <BarChart3 className="h-5 w-5 text-sky-300" />
            {text.title}
          </h2>
          <p className="mt-1 text-xs text-slate-500">{text.subtitle}</p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs text-slate-300 hover:text-white"
        >
          <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
          {text.refresh}
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-500">{text.period}:</span>
        {PERIODS.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setDays(value)}
            className={cn(
              "rounded-full border px-3 py-1",
              days === value
                ? "border-sky-300/40 bg-sky-400/15 text-sky-200"
                : "border-white/10 text-slate-400 hover:text-white",
            )}
          >
            {text.days(value)}
          </button>
        ))}
        <label className="ml-auto inline-flex cursor-pointer items-center gap-2 text-slate-400">
          <input
            type="checkbox"
            checked={includeAdmins}
            onChange={(event) => setIncludeAdmins(event.target.checked)}
            className="h-3.5 w-3.5 accent-sky-400"
          />
          {text.withAdmins}
        </label>
      </div>

      {failed && <p className="text-sm text-rose-300">{text.error}</p>}
      {!stats && loading && <p className="text-sm text-slate-500">{text.loading}</p>}

      {stats && (
        <>
          <div className="grid grid-cols-3 gap-3">
            {[
              [text.today, stats.active.today],
              [text.d7, stats.active.d7],
              [text.d30, stats.active.d30],
            ].map(([title, value]) => (
              <Card key={String(title)} className="border-white/10 bg-white/[0.045] text-white shadow-none">
                <CardContent className="p-4">
                  <p className="text-[11px] uppercase tracking-wide text-slate-500">{title}</p>
                  <p className="mt-1 flex items-center gap-2 text-2xl font-semibold">
                    <Users className="h-4 w-4 text-sky-300" />
                    {value}
                  </p>
                  <p className="text-[11px] text-slate-500">{text.activeUsers}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <p className="text-xs text-slate-400">
            {text.days(stats.days)}: {stats.users} {text.users} · {stats.events} {text.events}
          </p>

          {stats.events === 0 && <p className="text-sm text-slate-500">{text.empty}</p>}

          <Card className="border-white/10 bg-white/[0.045] text-white shadow-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">{text.byDay}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex h-24 items-end gap-1">
                {stats.daily.map((day) => (
                  <div
                    key={day.day}
                    title={`${day.day}: ${day.users} ${text.users}, ${day.events} ${text.events}`}
                    className="flex-1 rounded-t bg-sky-400/70"
                    style={{ height: `${Math.max(6, (day.users / maxDaily) * 100)}%` }}
                  />
                ))}
              </div>
              {stats.daily.length > 0 && (
                <div className="mt-1 flex justify-between text-[10px] text-slate-500">
                  <span>{stats.daily[0].day}</span>
                  <span>{stats.daily[stats.daily.length - 1].day}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid gap-3 md:grid-cols-2">
            <BucketList title={text.platforms} rows={stats.platforms} language={language} usersLabel={text.users} eventsLabel={text.events} />
            <BucketList title={text.screens} rows={stats.screens} language={language} usersLabel={text.users} eventsLabel={text.events} />
            <BucketList title={text.actions} rows={stats.actions} language={language} usersLabel={text.users} eventsLabel={text.events} />
            <BucketList title={text.orders} rows={stats.signalOrders} language={language} usersLabel={text.users} eventsLabel={text.events} />
            <BucketList title={text.versions} rows={stats.versions} language={language} usersLabel={text.users} eventsLabel={text.events} />
            <BucketList title={text.languages} rows={stats.languages} language={language} usersLabel={text.users} eventsLabel={text.events} />
          </div>
          <p className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <Monitor className="h-3 w-3" />
            {new Date(stats.generatedAt).toLocaleString()}
          </p>
        </>
      )}
    </section>
  );
};
