import { Bot, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Translation } from "./i18n";
import type { AppLanguage, AppPayload } from "./types";

/*
 * "About and versions": the app's own release notes (newest first) plus
 * the signal engine updates the server sends, and the credits.
 * Append new app releases at the top of APP_RELEASES; never rewrite
 * published entries.
 */

type ReleaseText = Record<AppLanguage, { title: string; items: string[] }>;

export const APP_RELEASES: Array<{ version: string; date: string; text: ReleaseText }> = [
  {
    version: "2.7.0",
    date: "05.11.2026",
    text: {
      ru: {
        title: "Светлая тема и без тупиков",
        items: [
          "Светлая и тёмная тема: кнопка с солнцем или луной вверху экрана.",
          "«Журнал о трейдинге» показывает 10 свежих постов нашего Telegram-канала.",
          "Форма обратной связи прямо в разделе «Поддержка»; со страниц сайта всегда есть кнопка «Вернуться в приложение».",
        ],
      },
      bg: {
        title: "Светла тема и без задънени улици",
        items: [
          "Светла и тъмна тема: бутон със слънце или луна в горната част на екрана.",
          "„Трейдинг дневник“ показва 10 свежи публикации от нашия Telegram канал.",
          "Формата за връзка е направо в „Поддръжка“; от страниците на сайта винаги има бутон „Обратно към приложението“.",
        ],
      },
      en: {
        title: "Light theme and no dead ends",
        items: [
          "Light and dark theme: the sun or moon button at the top of the screen.",
          "“Trading journal” shows the 10 latest posts of our Telegram channel.",
          "The contact form is right in “Support”; site pages always have a “Back to the app” button.",
        ],
      },
      es: {
        title: "Tema claro y sin callejones sin salida",
        items: [
          "Tema claro y oscuro: el botón de sol o luna en la parte superior.",
          "«Diario de trading» muestra las 10 publicaciones más recientes de nuestro canal de Telegram.",
          "El formulario de contacto está en «Soporte»; las páginas del sitio siempre tienen el botón «Volver a la aplicación».",
        ],
      },
    },
  },
  {
    version: "2.6.0",
    date: "05.11.2026",
    text: {
      ru: {
        title: "Лицензионный ключ, статьи и предупреждение о рисках",
        items: [
          "Windows-приложение работает по лицензионному ключу. Ключ выдаётся в кабинете при активной подписке Trader и подставляется сам; один ключ работает на 2 компьютерах.",
          "Подарочные ключи на месяц или бессрочно.",
          "Новый раздел «Статьи»: разборы рынков и экономический календарь Александра Лунина с Substack и Medium, обновляется сам.",
          "Предупреждение о рисках внизу каждого экрана.",
          "Кнопка «Открыть у брокера» у каждого инструмента: регистрация у брокера Vantage.",
          "Экономический календарь: все важные события недели, на что и как они могут повлиять.",
        ],
      },
      bg: {
        title: "Лицензионен ключ, статии и предупреждение за рисковете",
        items: [
          "Windows приложението работи с лицензионен ключ. Ключът се дава в кабинета при активен абонамент за Trader и се попълва сам; един ключ работи на 2 компютъра.",
          "Подаръчни ключове за един месец или безсрочно.",
          "Нов раздел „Статии“: пазарни анализи и икономически календар от Александър Лунин от Substack и Medium, обновява се сам.",
          "Предупреждение за рисковете под всеки екран.",
          "Бутон „Отвори при брокера“ при всеки инструмент: регистрация при брокера Vantage.",
          "Икономически календар: всички важни събития за седмицата и върху какво могат да повлияят.",
        ],
      },
      en: {
        title: "License key, articles and risk warning",
        items: [
          "The Windows app works with a license key. The key is issued in the cabinet with an active Trader subscription and fills in by itself; one key works on 2 computers.",
          "Gift keys for one month or with no expiry.",
          "New “Articles” section: market breakdowns and the economic calendar by Alexander Lunin from Substack and Medium, updated automatically.",
          "Risk warning under every screen.",
          "“Open at broker” button next to each instrument: sign-up with the Vantage broker.",
          "Economic calendar: the week's key events and what they may move.",
        ],
      },
      es: {
        title: "Clave de licencia, artículos y aviso de riesgo",
        items: [
          "La app de Windows funciona con una clave de licencia. La clave se emite en el panel con una suscripción activa a Trader y se rellena sola; una clave funciona en 2 ordenadores.",
          "Claves de regalo por un mes o sin caducidad.",
          "Nueva sección «Artículos»: análisis de mercado y calendario económico de Alexander Lunin desde Substack y Medium, se actualiza sola.",
          "Aviso de riesgo debajo de cada pantalla.",
          "Botón «Abrir en el bróker» junto a cada instrumento: registro en el bróker Vantage.",
          "Calendario económico: los eventos clave de la semana y qué pueden mover.",
        ],
      },
    },
  },
  {
    version: "2.5.0",
    date: "04.11.2026",
    text: {
      ru: {
        title: "Рабочее место трейдера: заказ сигналов прямо из приложения",
        items: [
          "Новый раздел «Заказать сигнал»: анализ любого инструмента по кнопке и дополнительное сканирование всех рынков вашего доступа, не дожидаясь планового скана.",
          "Список рынков синхронизирован с движком: 19 инструментов, включая серебро, GER40, US100 и пары EUR/JPY, GBP/JPY, USD/CAD, USD/CHF, USD/CNH. Исправлен индикатор свежести данных.",
          "Фильтры по рынкам и горизонту сделки в сигналах, фильтры по рынкам и результату в истории.",
          "Страница «О программе» с историей версий.",
        ],
      },
      bg: {
        title: "Работно място на трейдъра: поръчка на сигнали директно от приложението",
        items: [
          "Нов раздел „Поръчай сигнал“: анализ на всеки инструмент с един бутон и допълнително сканиране на всички пазари от вашия достъп без чакане на планираното сканиране.",
          "Списъкът с пазари е синхронизиран с двигателя: 19 инструмента, включително сребро, GER40, US100 и двойките EUR/JPY, GBP/JPY, USD/CAD, USD/CHF, USD/CNH. Поправен е индикаторът за актуалност на данните.",
          "Филтри по пазари и хоризонт на сделката в сигналите, филтри по пазари и резултат в историята.",
          "Страница „За програмата“ с история на версиите.",
        ],
      },
      en: {
        title: "Trader workspace: order signals right from the app",
        items: [
          "New Order a signal section: analyse any instrument with one button, or run an extra scan of every market in your access without waiting for the scheduled scan.",
          "Market list synced with the engine: 19 instruments, including silver, GER40, US100 and EUR/JPY, GBP/JPY, USD/CAD, USD/CHF, USD/CNH. Data freshness indicator fixed.",
          "Filters by market and trade horizon in Signals, by market and result in History.",
          "About page with the version history.",
        ],
      },
      es: {
        title: "Puesto del trader: pide señales directamente desde la app",
        items: [
          "Nueva sección Pedir una señal: analiza cualquier instrumento con un botón o lanza un escaneo adicional de todos los mercados de tu acceso sin esperar al escaneo programado.",
          "Lista de mercados sincronizada con el motor: 19 instrumentos, incluidos plata, GER40, US100 y EUR/JPY, GBP/JPY, USD/CAD, USD/CHF, USD/CNH. Corregido el indicador de datos actualizados.",
          "Filtros por mercado y horizonte en Señales, por mercado y resultado en Historial.",
          "Página Acerca de con el historial de versiones.",
        ],
      },
    },
  },
  {
    version: "2.4.0",
    date: "29.10.2026",
    text: {
      ru: {
        title: "Приложение для Windows и веб-кабинет",
        items: [
          "Все экраны Mini App доступны в веб-кабинете и в приложении для Windows.",
          "Вход через Telegram, Google или код на e-mail.",
          "Меню языков: английский, русский, болгарский.",
        ],
      },
      bg: {
        title: "Приложение за Windows и уеб кабинет",
        items: [
          "Всички екрани на Mini App са достъпни в уеб кабинета и в приложението за Windows.",
          "Вход с Telegram, Google или код по e-mail.",
          "Меню за езици: английски, руски, български.",
        ],
      },
      en: {
        title: "Windows app and web cabinet",
        items: [
          "Every Mini App screen is available in the web cabinet and the Windows app.",
          "Sign in with Telegram, Google or an e-mail code.",
          "Language menu: English, Russian, Bulgarian.",
        ],
      },
      es: {
        title: "App para Windows y gabinete web",
        items: [
          "Todas las pantallas de la Mini App están en el gabinete web y en la app para Windows.",
          "Acceso con Telegram, Google o un código por e-mail.",
          "Menú de idiomas: inglés, ruso, búlgaro.",
        ],
      },
    },
  },
];

interface AboutPanelProps {
  t: Translation;
  language: AppLanguage;
  appVersion: string;
  updates: AppPayload["updates"];
}

export const AboutPanel = ({ t, language, appVersion, updates }: AboutPanelProps) => (
  <section className="space-y-4">
    <div className="rounded-[28px] border border-amber-300/20 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.2),transparent_42%),linear-gradient(145deg,#151923,#0b0d13)] p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-amber-300 to-orange-500">
            <Bot className="h-6 w-6 text-[#171006]" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">NICS AI Trader</h1>
            <p className="text-xs text-slate-400">
              {t.appVersion} {appVersion}
            </p>
          </div>
        </div>
        <Badge className="bg-amber-400 text-black hover:bg-amber-400">{appVersion}</Badge>
      </div>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300">{t.aboutLead}</p>
    </div>

    <Card className="border-white/10 bg-white/[0.045] text-white shadow-none">
      <CardContent className="p-5">
        <p className="text-xs uppercase tracking-[0.18em] text-amber-300/80">{t.createdBy}</p>
        <p className="mt-3 text-lg font-semibold">Александр Лунин · Alexander Lunin</p>
        <p className="mt-1 text-sm text-slate-300">NICS AI Ecosystem</p>
        <p className="mt-1 text-sm text-slate-400">by AI Byte Consult Ltd</p>
      </CardContent>
    </Card>

    <h2 className="pt-2 text-sm font-medium text-slate-300">{t.versionHistory}</h2>
    {APP_RELEASES.map((release, index) => {
      const text = release.text[language] ?? release.text.en;
      return (
        <Card key={release.version} className="border-white/10 bg-white/[0.045] text-white shadow-none">
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Badge className={index === 0 ? "bg-amber-400 text-black hover:bg-amber-400" : "bg-white/10 text-slate-300"}>
                  {release.version}
                </Badge>
                <h3 className="mt-3 font-semibold">{text.title}</h3>
              </div>
              <span className="text-xs text-slate-500">{release.date}</span>
            </div>
            <ul className="mt-4 space-y-2">
              {text.items.map((item) => (
                <li key={item} className="flex gap-2 text-sm leading-5 text-slate-400">
                  <span className="mt-1 text-amber-300">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      );
    })}

    {updates.length > 0 && (
      <>
        <h2 className="flex items-center gap-2 pt-2 text-sm font-medium text-slate-300">
          <Sparkles className="h-4 w-4 text-amber-300" />
          {t.serverUpdates}
        </h2>
        {updates.map((update) => (
          <Card key={`${update.version}-${update.date}`} className="border-white/10 bg-white/[0.03] text-white shadow-none">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <p className="text-sm font-medium">
                  <span className="mr-2 text-slate-500">{update.version}</span>
                  {update.title}
                </p>
                <span className="shrink-0 text-xs text-slate-500">{update.date}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </>
    )}
  </section>
);
