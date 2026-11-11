/*
 * Texts of the NICS AI Trader Windows app page (/nics-windows-app).
 *
 * SEO rollout is phased (2026-11-11): this page exists in EN, RU, BG, DE and
 * ES only. Other site languages show the English text at the English URL.
 * Keep WINDOWS_APP_LANGS in sync with scripts/generate-seo-pages.mjs
 * (WINDOWS_APP_LANGS there) and the routes in src/App.tsx.
 *
 * Facts on this page must stay true: the app is a Tauri shell that opens the
 * web cabinet (so it always runs the current workspace version), the
 * installer is not code-signed yet (SmartScreen warning), Pro = a license key
 * that comes with any active paid NICS AI Trader subscription, 2 computers
 * per key, daily check, 7 days offline grace (src/features/cabinet/license.ts).
 */

export const WINDOWS_APP_LANGS = ["en", "ru", "bg", "de", "es"] as const;
export type WindowsAppLang = (typeof WINDOWS_APP_LANGS)[number];

export const WINDOWS_APP_DOWNLOAD = "/downloads/NICS-AI-Trader-Setup.exe";
// Microsoft Store listing is pending (Partner Center identity not set up yet).
// Put the Store URL here when it exists; the button turns live by itself.
export const WINDOWS_APP_STORE_URL = "";

export const windowsAppPath = (lang: string) =>
  lang !== "en" && (WINDOWS_APP_LANGS as readonly string[]).includes(lang)
    ? `/${lang}/nics-windows-app`
    : "/nics-windows-app";

export interface WindowsAppTexts {
  seoTitle: string;
  seoDescription: string;
  badge: string;
  title: string;
  subtitle: string;
  download: string;
  downloadNote: string;
  store: string;
  storeSoon: string;
  webAlt: string;
  featuresTitle: string;
  features: { title: string; desc: string }[];
  screensTitle: string;
  reqTitle: string;
  requirements: string[];
  installTitle: string;
  install: string[];
  licenseTitle: string;
  license: string[];
  licenseCta: string;
  compareTitle: string;
  compareFeature: string;
  compareFree: string;
  comparePro: string;
  compareRows: { label: string; free: boolean; pro: boolean }[];
  faqTitle: string;
  faq: { q: string; a: string }[];
  disclaimer: string;
  backToTrading: string;
}

const en: WindowsAppTexts = {
  seoTitle: "NICS AI Trader for Windows — Desktop Trading Workspace",
  seoDescription:
    "Download the NICS AI Trader Windows app: live trading signals with Entry, Stop Loss and TP1–TP4, on-demand market analysis, economic calendar and verified performance on your PC.",
  badge: "Windows 10 / 11 · Free download",
  title: "NICS AI Trader for Windows",
  subtitle:
    "Your trading workspace on the desktop: live signals, on-demand analysis of any supported instrument, the economic calendar and the verified track record in one window, without Telegram.",
  download: "Download for Windows",
  downloadNote: "Installer .exe, about 1.3 MB",
  store: "Microsoft Store",
  storeSoon: "Microsoft Store — coming soon",
  webAlt: "No Windows? Open the web dashboard",
  featuresTitle: "What the app does",
  features: [
    { title: "Live signals", desc: "Every new setup with Entry zone, Stop Loss and TP1–TP4, the direction basis and risk notes, as soon as the engine publishes it." },
    { title: "Order an analysis", desc: "Ask for a fresh analysis of one instrument or an extra scan of all markets at any time." },
    { title: "Signal lifecycle", desc: "Follow each signal through TP, SL and breakeven updates and see the result in your history." },
    { title: "Economic calendar", desc: "High-impact events for the week, so you know when news can move your positions." },
    { title: "Verified performance", desc: "The same public track record as on the site: every closed strong signal, no cherry-picking." },
    { title: "Academy and articles", desc: "Lessons, the trading journal and articles inside the app, in five languages, light or dark theme." },
  ],
  screensTitle: "Screenshots",
  reqTitle: "System requirements",
  requirements: [
    "Windows 10 or Windows 11, 64-bit",
    "Microsoft Edge WebView2 (already part of Windows 11 and most Windows 10 PCs; the installer adds it if missing)",
    "Internet connection",
    "A NICS account: sign in with Telegram or by e-mail code",
  ],
  installTitle: "How to install",
  install: [
    "Click “Download for Windows” and open NICS-AI-Trader-Setup.exe.",
    "The installer is not code-signed yet, so Windows may show “Windows protected your PC”. Click “More info”, then “Run anyway”.",
    "Finish the setup and start NICS AI Trader from the Start menu or the desktop shortcut.",
    "Sign in with Telegram or with an e-mail code. With an active subscription your Pro key is filled in automatically.",
  ],
  licenseTitle: "Pro license",
  license: [
    "Pro comes with any active paid NICS AI Trader subscription, including the €1.99 7-day trial. There is no separate price for the app.",
    "Your personal key (NICS-XXXX-XXXX-XXXX) is in your account and is filled in automatically after sign-in.",
    "One key works on two computers. The app checks it once a day and keeps working offline for up to 7 days.",
  ],
  licenseCta: "See plans",
  compareTitle: "Free vs Pro",
  compareFeature: "Feature",
  compareFree: "Free",
  comparePro: "Pro",
  compareRows: [
    { label: "Install the app and sign in", free: true, pro: true },
    { label: "Account, subscription and support pages", free: true, pro: true },
    { label: "Public verified track record on the site", free: true, pro: true },
    { label: "Live signals with Entry, SL and TP1–TP4", free: false, pro: true },
    { label: "Order an analysis or an extra scan", free: false, pro: true },
    { label: "Signal history, calendar, academy, journal", free: false, pro: true },
  ],
  faqTitle: "Questions",
  faq: [
    { q: "Is the app free?", a: "Downloading and signing in is free. The trading screens need Pro, which comes with any active paid NICS AI Trader subscription." },
    { q: "Does the app place trades for me?", a: "No. It delivers analysis and trading signals; you decide whether to open a position with your broker." },
    { q: "Why does Windows show a warning?", a: "The installer is not code-signed yet. The Microsoft Store version, signed by Microsoft, is being prepared." },
    { q: "Do I need to update the app?", a: "The workspace inside the app loads the current version every time it starts, so new features arrive without reinstalling." },
    { q: "Is there a Mac or mobile version?", a: "Not as a separate app yet. On Mac, phone or tablet use the web dashboard or the Telegram Mini App with the same account." },
    { q: "Can I use one subscription on several devices?", a: "Yes: the web dashboard and Telegram everywhere, and the Windows app on up to two computers per key." },
  ],
  disclaimer:
    "Trading involves substantial risk. NICS AI Trader provides analytical trading scenarios and risk tools, not financial advice or guaranteed returns.",
  backToTrading: "Back to NICS AI Trader",
};

const ru: WindowsAppTexts = {
  seoTitle: "NICS AI Trader для Windows — торговое рабочее место на ПК",
  seoDescription:
    "Скачайте приложение NICS AI Trader для Windows: торговые сигналы с входом, стоп-лоссом и TP1–TP4, анализ инструмента по запросу, экономический календарь и проверенная статистика на вашем компьютере.",
  badge: "Windows 10 / 11 · Бесплатная загрузка",
  title: "NICS AI Trader для Windows",
  subtitle:
    "Торговое рабочее место на компьютере: сигналы в реальном времени, анализ любого инструмента по запросу, экономический календарь и проверенная статистика в одном окне, без Telegram.",
  download: "Скачать для Windows",
  downloadNote: "Установщик .exe, около 1,3 МБ",
  store: "Microsoft Store",
  storeSoon: "Microsoft Store — скоро",
  webAlt: "Нет Windows? Откройте веб-кабинет",
  featuresTitle: "Что умеет приложение",
  features: [
    { title: "Сигналы в реальном времени", desc: "Каждый новый сетап с зоной входа, стоп-лоссом и TP1–TP4, основанием для направления и заметками о риске — сразу после публикации." },
    { title: "Заказ анализа", desc: "Свежий анализ одного инструмента или дополнительное сканирование всех рынков в любой момент." },
    { title: "Сопровождение сигнала", desc: "Обновления по TP, SL и безубытку и итог каждого сигнала в истории." },
    { title: "Экономический календарь", desc: "Важные события недели, чтобы знать, когда новости могут двинуть ваши позиции." },
    { title: "Проверенная статистика", desc: "Тот же публичный трек-рекорд, что на сайте: все закрытые сильные сигналы, без отбора." },
    { title: "Академия и статьи", desc: "Уроки, торговый дневник и статьи прямо в приложении, на пяти языках, светлая и тёмная тема." },
  ],
  screensTitle: "Скриншоты",
  reqTitle: "Системные требования",
  requirements: [
    "Windows 10 или Windows 11, 64-бит",
    "Microsoft Edge WebView2 (уже есть в Windows 11 и в большинстве Windows 10; установщик добавит, если нет)",
    "Подключение к интернету",
    "Аккаунт NICS: вход через Telegram или по коду на e-mail",
  ],
  installTitle: "Как установить",
  install: [
    "Нажмите «Скачать для Windows» и откройте NICS-AI-Trader-Setup.exe.",
    "Установщик пока без цифровой подписи, поэтому Windows может показать «Система Windows защитила ваш компьютер». Нажмите «Подробнее», затем «Выполнить в любом случае».",
    "Завершите установку и запустите NICS AI Trader из меню «Пуск» или с ярлыка на рабочем столе.",
    "Войдите через Telegram или по коду на e-mail. При активной подписке ключ Pro подставится автоматически.",
  ],
  licenseTitle: "Лицензия Pro",
  license: [
    "Pro входит в любую активную платную подписку NICS AI Trader, включая пробную неделю за €1,99. Отдельно за приложение платить не нужно.",
    "Ваш личный ключ (NICS-XXXX-XXXX-XXXX) находится в кабинете и подставляется автоматически после входа.",
    "Один ключ работает на двух компьютерах. Приложение проверяет его раз в день и работает без интернета до 7 дней.",
  ],
  licenseCta: "Тарифы",
  compareTitle: "Бесплатно и Pro",
  compareFeature: "Возможность",
  compareFree: "Бесплатно",
  comparePro: "Pro",
  compareRows: [
    { label: "Установка приложения и вход", free: true, pro: true },
    { label: "Аккаунт, подписка и поддержка", free: true, pro: true },
    { label: "Публичная проверенная статистика на сайте", free: true, pro: true },
    { label: "Сигналы с входом, SL и TP1–TP4", free: false, pro: true },
    { label: "Заказ анализа и дополнительного сканирования", free: false, pro: true },
    { label: "История сигналов, календарь, академия, дневник", free: false, pro: true },
  ],
  faqTitle: "Вопросы",
  faq: [
    { q: "Приложение бесплатное?", a: "Скачать и войти можно бесплатно. Торговые экраны работают с Pro, который входит в любую активную платную подписку NICS AI Trader." },
    { q: "Приложение само открывает сделки?", a: "Нет. Оно даёт анализ и торговые сигналы, а решение открыть позицию у брокера принимаете вы." },
    { q: "Почему Windows показывает предупреждение?", a: "Установщик пока без цифровой подписи. Версия для Microsoft Store, подписанная Microsoft, готовится." },
    { q: "Нужно ли обновлять приложение?", a: "Рабочее место внутри приложения при каждом запуске загружает актуальную версию, новые функции появляются без переустановки." },
    { q: "Есть версия для Mac или телефона?", a: "Отдельного приложения пока нет. На Mac, телефоне или планшете используйте веб-кабинет или Mini App в Telegram с тем же аккаунтом." },
    { q: "Можно пользоваться одной подпиской на нескольких устройствах?", a: "Да: веб-кабинет и Telegram — везде, приложение для Windows — на двух компьютерах на один ключ." },
  ],
  disclaimer:
    "Торговля на финансовых рынках связана с высоким риском. NICS AI Trader даёт аналитические торговые сценарии и инструменты управления риском, а не финансовые рекомендации и не гарантию дохода.",
  backToTrading: "Назад к NICS AI Trader",
};

const bg: WindowsAppTexts = {
  seoTitle: "NICS AI Trader за Windows — работно място за търговия на компютъра",
  seoDescription:
    "Изтеглете приложението NICS AI Trader за Windows: търговски сигнали с вход, стоп загуба и TP1–TP4, анализ на инструмент при поискване, икономически календар и проверени резултати на вашия компютър.",
  badge: "Windows 10 / 11 · Безплатно изтегляне",
  title: "NICS AI Trader за Windows",
  subtitle:
    "Работно място за търговия на компютъра: сигнали в реално време, анализ на всеки поддържан инструмент при поискване, икономически календар и проверени резултати в един прозорец, без Telegram.",
  download: "Изтегли за Windows",
  downloadNote: "Инсталатор .exe, около 1,3 MB",
  store: "Microsoft Store",
  storeSoon: "Microsoft Store — скоро",
  webAlt: "Нямате Windows? Отворете уеб таблото",
  featuresTitle: "Какво прави приложението",
  features: [
    { title: "Сигнали в реално време", desc: "Всеки нов сетъп със зона на вход, стоп загуба и TP1–TP4, основание за посоката и бележки за риска — веднага след публикуването му." },
    { title: "Поръчка на анализ", desc: "Свеж анализ на един инструмент или допълнително сканиране на всички пазари по всяко време." },
    { title: "Проследяване на сигнала", desc: "Актуализации за TP, SL и безубитък и резултатът на всеки сигнал в историята." },
    { title: "Икономически календар", desc: "Важните събития за седмицата, за да знаете кога новините могат да раздвижат позициите ви." },
    { title: "Проверени резултати", desc: "Същият публичен трак рекорд като на сайта: всички затворени силни сигнали, без подбор." },
    { title: "Академия и статии", desc: "Уроци, търговски дневник и статии в приложението, на пет езика, светла и тъмна тема." },
  ],
  screensTitle: "Екранни снимки",
  reqTitle: "Системни изисквания",
  requirements: [
    "Windows 10 или Windows 11, 64-битов",
    "Microsoft Edge WebView2 (вече е в Windows 11 и в повечето Windows 10; инсталаторът го добавя, ако липсва)",
    "Интернет връзка",
    "Акаунт в NICS: вход с Telegram или с код по e-mail",
  ],
  installTitle: "Как да инсталирате",
  install: [
    "Натиснете „Изтегли за Windows“ и отворете NICS-AI-Trader-Setup.exe.",
    "Инсталаторът все още няма цифров подпис, затова Windows може да покаже „Windows защити вашия компютър“. Натиснете „Повече информация“, след това „Изпълни въпреки това“.",
    "Завършете инсталацията и стартирайте NICS AI Trader от менюто „Старт“ или от прекия път на работния плот.",
    "Влезте с Telegram или с код по e-mail. При активен абонамент ключът Pro се попълва автоматично.",
  ],
  licenseTitle: "Лиценз Pro",
  license: [
    "Pro е включен във всеки активен платен абонамент за NICS AI Trader, включително пробната седмица за €1,99. Приложението няма отделна цена.",
    "Личният ви ключ (NICS-XXXX-XXXX-XXXX) е в акаунта ви и се попълва автоматично след вход.",
    "Един ключ работи на два компютъра. Приложението го проверява веднъж дневно и работи без интернет до 7 дни.",
  ],
  licenseCta: "Планове",
  compareTitle: "Безплатно и Pro",
  compareFeature: "Функция",
  compareFree: "Безплатно",
  comparePro: "Pro",
  compareRows: [
    { label: "Инсталиране на приложението и вход", free: true, pro: true },
    { label: "Акаунт, абонамент и поддръжка", free: true, pro: true },
    { label: "Публичен проверен трак рекорд на сайта", free: true, pro: true },
    { label: "Сигнали с вход, SL и TP1–TP4", free: false, pro: true },
    { label: "Поръчка на анализ или допълнително сканиране", free: false, pro: true },
    { label: "История на сигналите, календар, академия, дневник", free: false, pro: true },
  ],
  faqTitle: "Въпроси",
  faq: [
    { q: "Безплатно ли е приложението?", a: "Изтеглянето и входът са безплатни. Търговските екрани изискват Pro, който е включен във всеки активен платен абонамент за NICS AI Trader." },
    { q: "Приложението само ли отваря сделки?", a: "Не. То дава анализ и търговски сигнали, а решението да отворите позиция при брокера е ваше." },
    { q: "Защо Windows показва предупреждение?", a: "Инсталаторът все още няма цифров подпис. Подготвя се версия за Microsoft Store, подписана от Microsoft." },
    { q: "Трябва ли да обновявам приложението?", a: "Работното място в приложението зарежда актуалната версия при всяко стартиране, новите функции идват без преинсталиране." },
    { q: "Има ли версия за Mac или телефон?", a: "Все още няма отделно приложение. На Mac, телефон или таблет използвайте уеб таблото или Mini App в Telegram със същия акаунт." },
    { q: "Може ли един абонамент на няколко устройства?", a: "Да: уеб таблото и Telegram навсякъде, а приложението за Windows — на до два компютъра с един ключ." },
  ],
  disclaimer:
    "Търговията на финансовите пазари е свързана със значителен риск. NICS AI Trader предоставя аналитични търговски сценарии и инструменти за управление на риска, а не финансови съвети или гарантирана печалба.",
  backToTrading: "Обратно към NICS AI Trader",
};

const de: WindowsAppTexts = {
  seoTitle: "NICS AI Trader für Windows — Trading-Arbeitsplatz am PC",
  seoDescription:
    "Laden Sie die NICS AI Trader Windows-App herunter: Handelssignale mit Entry, Stop Loss und TP1–TP4, Marktanalyse auf Abruf, Wirtschaftskalender und verifizierte Performance auf Ihrem PC.",
  badge: "Windows 10 / 11 · Kostenloser Download",
  title: "NICS AI Trader für Windows",
  subtitle:
    "Ihr Trading-Arbeitsplatz auf dem Desktop: Live-Signale, Analyse jedes unterstützten Instruments auf Abruf, Wirtschaftskalender und verifizierte Performance in einem Fenster, ohne Telegram.",
  download: "Für Windows herunterladen",
  downloadNote: "Installer .exe, ca. 1,3 MB",
  store: "Microsoft Store",
  storeSoon: "Microsoft Store — demnächst",
  webAlt: "Kein Windows? Web-Dashboard öffnen",
  featuresTitle: "Was die App kann",
  features: [
    { title: "Live-Signale", desc: "Jedes neue Setup mit Einstiegszone, Stop Loss und TP1–TP4, Begründung der Richtung und Risikohinweisen, sobald es veröffentlicht wird." },
    { title: "Analyse anfordern", desc: "Jederzeit eine frische Analyse eines Instruments oder einen zusätzlichen Scan aller Märkte anfordern." },
    { title: "Signalverlauf", desc: "TP-, SL- und Breakeven-Updates zu jedem Signal und das Ergebnis in Ihrer Historie." },
    { title: "Wirtschaftskalender", desc: "Die wichtigen Termine der Woche, damit Sie wissen, wann Nachrichten Ihre Positionen bewegen können." },
    { title: "Verifizierte Performance", desc: "Derselbe öffentliche Track Record wie auf der Website: alle geschlossenen starken Signale, ohne Auswahl." },
    { title: "Academy und Artikel", desc: "Lektionen, Trading-Journal und Artikel in der App, in fünf Sprachen, helles oder dunkles Design." },
  ],
  screensTitle: "Screenshots",
  reqTitle: "Systemanforderungen",
  requirements: [
    "Windows 10 oder Windows 11, 64-Bit",
    "Microsoft Edge WebView2 (in Windows 11 und den meisten Windows-10-PCs bereits vorhanden; der Installer ergänzt es bei Bedarf)",
    "Internetverbindung",
    "Ein NICS-Konto: Anmeldung mit Telegram oder per E-Mail-Code",
  ],
  installTitle: "Installation",
  install: [
    "Klicken Sie auf „Für Windows herunterladen“ und öffnen Sie NICS-AI-Trader-Setup.exe.",
    "Der Installer ist noch nicht digital signiert, daher kann Windows „Der Computer wurde durch Windows geschützt“ anzeigen. Klicken Sie auf „Weitere Informationen“ und dann auf „Trotzdem ausführen“.",
    "Schließen Sie die Installation ab und starten Sie NICS AI Trader über das Startmenü oder die Desktop-Verknüpfung.",
    "Melden Sie sich mit Telegram oder per E-Mail-Code an. Mit aktivem Abo wird Ihr Pro-Schlüssel automatisch eingetragen.",
  ],
  licenseTitle: "Pro-Lizenz",
  license: [
    "Pro ist in jedem aktiven bezahlten NICS AI Trader Abo enthalten, auch in der 7-Tage-Testphase für €1,99. Die App kostet nichts extra.",
    "Ihr persönlicher Schlüssel (NICS-XXXX-XXXX-XXXX) liegt in Ihrem Konto und wird nach der Anmeldung automatisch eingetragen.",
    "Ein Schlüssel gilt für zwei Computer. Die App prüft ihn einmal täglich und funktioniert bis zu 7 Tage offline.",
  ],
  licenseCta: "Tarife ansehen",
  compareTitle: "Free und Pro",
  compareFeature: "Funktion",
  compareFree: "Free",
  comparePro: "Pro",
  compareRows: [
    { label: "App installieren und anmelden", free: true, pro: true },
    { label: "Konto, Abo und Support", free: true, pro: true },
    { label: "Öffentlicher verifizierter Track Record auf der Website", free: true, pro: true },
    { label: "Live-Signale mit Entry, SL und TP1–TP4", free: false, pro: true },
    { label: "Analyse oder zusätzlichen Scan anfordern", free: false, pro: true },
    { label: "Signalhistorie, Kalender, Academy, Journal", free: false, pro: true },
  ],
  faqTitle: "Fragen",
  faq: [
    { q: "Ist die App kostenlos?", a: "Download und Anmeldung sind kostenlos. Die Trading-Bereiche benötigen Pro, das in jedem aktiven bezahlten NICS AI Trader Abo enthalten ist." },
    { q: "Eröffnet die App Trades für mich?", a: "Nein. Sie liefert Analysen und Handelssignale; ob Sie bei Ihrem Broker eine Position eröffnen, entscheiden Sie." },
    { q: "Warum zeigt Windows eine Warnung?", a: "Der Installer ist noch nicht digital signiert. Eine von Microsoft signierte Version für den Microsoft Store wird vorbereitet." },
    { q: "Muss ich die App aktualisieren?", a: "Der Arbeitsplatz in der App lädt bei jedem Start die aktuelle Version, neue Funktionen kommen ohne Neuinstallation." },
    { q: "Gibt es eine Mac- oder Handy-Version?", a: "Noch nicht als eigene App. Auf Mac, Handy oder Tablet nutzen Sie das Web-Dashboard oder die Telegram Mini App mit demselben Konto." },
    { q: "Kann ich ein Abo auf mehreren Geräten nutzen?", a: "Ja: Web-Dashboard und Telegram überall, die Windows-App auf bis zu zwei Computern pro Schlüssel." },
  ],
  disclaimer:
    "Trading ist mit erheblichen Risiken verbunden. NICS AI Trader liefert analytische Handelsszenarien und Risikowerkzeuge, keine Finanzberatung und keine garantierten Renditen.",
  backToTrading: "Zurück zu NICS AI Trader",
};

const es: WindowsAppTexts = {
  seoTitle: "NICS AI Trader para Windows — espacio de trading en tu PC",
  seoDescription:
    "Descarga la app NICS AI Trader para Windows: señales de trading con Entry, Stop Loss y TP1–TP4, análisis de mercado bajo pedido, calendario económico y rendimiento verificado en tu PC.",
  badge: "Windows 10 / 11 · Descarga gratuita",
  title: "NICS AI Trader para Windows",
  subtitle:
    "Tu espacio de trading en el escritorio: señales en tiempo real, análisis de cualquier instrumento compatible bajo pedido, calendario económico y rendimiento verificado en una sola ventana, sin Telegram.",
  download: "Descargar para Windows",
  downloadNote: "Instalador .exe, unos 1,3 MB",
  store: "Microsoft Store",
  storeSoon: "Microsoft Store — próximamente",
  webAlt: "¿Sin Windows? Abre el panel web",
  featuresTitle: "Qué hace la app",
  features: [
    { title: "Señales en tiempo real", desc: "Cada nuevo setup con zona de entrada, Stop Loss y TP1–TP4, la base de la dirección y notas de riesgo, en cuanto se publica." },
    { title: "Pedir un análisis", desc: "Pide en cualquier momento un análisis nuevo de un instrumento o un escaneo extra de todos los mercados." },
    { title: "Seguimiento de la señal", desc: "Actualizaciones de TP, SL y breakeven y el resultado de cada señal en tu historial." },
    { title: "Calendario económico", desc: "Los eventos importantes de la semana, para saber cuándo las noticias pueden mover tus posiciones." },
    { title: "Rendimiento verificado", desc: "El mismo historial público que en la web: todas las señales fuertes cerradas, sin selección." },
    { title: "Academia y artículos", desc: "Lecciones, diario de trading y artículos dentro de la app, en cinco idiomas, tema claro u oscuro." },
  ],
  screensTitle: "Capturas de pantalla",
  reqTitle: "Requisitos del sistema",
  requirements: [
    "Windows 10 o Windows 11, 64 bits",
    "Microsoft Edge WebView2 (ya incluido en Windows 11 y en la mayoría de PCs con Windows 10; el instalador lo añade si falta)",
    "Conexión a internet",
    "Una cuenta NICS: acceso con Telegram o con código por e-mail",
  ],
  installTitle: "Cómo instalar",
  install: [
    "Pulsa «Descargar para Windows» y abre NICS-AI-Trader-Setup.exe.",
    "El instalador aún no tiene firma digital, así que Windows puede mostrar «Windows protegió su PC». Pulsa «Más información» y luego «Ejecutar de todas formas».",
    "Termina la instalación y abre NICS AI Trader desde el menú Inicio o el acceso directo del escritorio.",
    "Accede con Telegram o con un código por e-mail. Con una suscripción activa tu clave Pro se rellena sola.",
  ],
  licenseTitle: "Licencia Pro",
  license: [
    "Pro viene con cualquier suscripción de pago activa de NICS AI Trader, incluida la prueba de 7 días por €1,99. La app no tiene precio aparte.",
    "Tu clave personal (NICS-XXXX-XXXX-XXXX) está en tu cuenta y se rellena automáticamente al acceder.",
    "Una clave funciona en dos ordenadores. La app la comprueba una vez al día y funciona sin conexión hasta 7 días.",
  ],
  licenseCta: "Ver planes",
  compareTitle: "Gratis y Pro",
  compareFeature: "Función",
  compareFree: "Gratis",
  comparePro: "Pro",
  compareRows: [
    { label: "Instalar la app y acceder", free: true, pro: true },
    { label: "Cuenta, suscripción y soporte", free: true, pro: true },
    { label: "Historial público verificado en la web", free: true, pro: true },
    { label: "Señales con Entry, SL y TP1–TP4", free: false, pro: true },
    { label: "Pedir un análisis o un escaneo extra", free: false, pro: true },
    { label: "Historial de señales, calendario, academia, diario", free: false, pro: true },
  ],
  faqTitle: "Preguntas",
  faq: [
    { q: "¿La app es gratis?", a: "Descargarla y acceder es gratis. Las pantallas de trading necesitan Pro, que viene con cualquier suscripción de pago activa de NICS AI Trader." },
    { q: "¿La app abre operaciones por mí?", a: "No. Ofrece análisis y señales de trading; tú decides si abrir una posición con tu bróker." },
    { q: "¿Por qué Windows muestra un aviso?", a: "El instalador aún no tiene firma digital. Se está preparando la versión de Microsoft Store, firmada por Microsoft." },
    { q: "¿Tengo que actualizar la app?", a: "El espacio de trabajo dentro de la app carga la versión actual en cada inicio, así que las novedades llegan sin reinstalar." },
    { q: "¿Hay versión para Mac o móvil?", a: "Todavía no como app aparte. En Mac, móvil o tablet usa el panel web o la Mini App de Telegram con la misma cuenta." },
    { q: "¿Puedo usar una suscripción en varios dispositivos?", a: "Sí: el panel web y Telegram en todas partes, y la app de Windows en hasta dos ordenadores por clave." },
  ],
  disclaimer:
    "El trading implica un riesgo considerable. NICS AI Trader ofrece escenarios analíticos de trading y herramientas de riesgo, no asesoramiento financiero ni rentabilidad garantizada.",
  backToTrading: "Volver a NICS AI Trader",
};

export const windowsAppTexts: Record<WindowsAppLang, WindowsAppTexts> = { en, ru, bg, de, es };

export const windowsAppTextsFor = (lang: string): WindowsAppTexts =>
  windowsAppTexts[(WINDOWS_APP_LANGS as readonly string[]).includes(lang) ? (lang as WindowsAppLang) : "en"];
