/*
 * /trading first screen, platform block and market list (2026-11-11).
 *
 * The page presents NICS Trading Ecosystem as a platform: Windows app, web
 * dashboard, Telegram bot + Mini App, academy. Telegram is a secondary
 * channel here, not the product itself.
 *
 * MARKETS must match the instruments the engine actually covers:
 * [07 APP] "Enrich Workspace Response" MARKETS in n8n (and [01 CORE]
 * Signal Configuration). When an instrument is added or removed there,
 * update `markets` below in every language, plus `marketsLine`.
 */

type Market = { name: string; symbols: string; desc: string; hours: string };

export interface TradingPlatformTexts {
  heroBadge: string;
  heroTitle1: string;
  heroTitle2: string;
  heroDesc: string;
  ctaWindows: string;
  ctaPerformance: string;
  ctaPro: string;
  telegramLine: string;
  platformBadge: string;
  platformTitle: string;
  platformDesc: string;
  surfaces: { title: string; desc: string; cta: string }[];
  marketsLine: string;
  markets: Market[];
  telegramCta: string;
}

const SYM = {
  metals: "XAU/USD · XAG/USD",
  forex: "EUR/USD · GBP/USD · USD/JPY · AUD/USD · EUR/JPY · GBP/JPY · USD/CAD · USD/CHF · USD/CNH",
  oil: "UKOUSD",
  crypto: "BTC/USD · ETH/USD",
  stocks: "NVDA · TSLA",
  indices: "US100 · US500 · GER40",
};

const en: TradingPlatformTexts = {
  heroBadge: "Windows app · Web dashboard · Telegram · Academy",
  heroTitle1: "NICS Trading Ecosystem —",
  heroTitle2: "Autonomous AI Trading Platform",
  heroDesc:
    "The engine scans gold, forex, oil, crypto, stocks and indices around the clock and publishes ready setups with Entry, Stop Loss and TP1–TP4. Work with them in the Windows app or the web dashboard, get them in Telegram, learn in the academy, and check every result in the verified track record.",
  ctaWindows: "Explore Windows App",
  ctaPerformance: "View Verified Performance",
  ctaPro: "Get Pro Access",
  telegramLine: "Prefer Telegram? Signals and the Mini App are in @nics_ai_bot",
  platformBadge: "One account, four places",
  platformTitle: "Everything you need to trade with a plan",
  platformDesc: "The same signals, history and settings everywhere: start on one device and continue on another.",
  surfaces: [
    { title: "Windows app", desc: "A desktop workspace: live signals, order an analysis, calendar, track record and academy in one window.", cta: "About the Windows app" },
    { title: "Web dashboard", desc: "The full workspace in any browser on Mac, PC or tablet. Sign in with Telegram or an e-mail code.", cta: "Open the dashboard" },
    { title: "Telegram bot and Mini App", desc: "Instant signal cards, TP and SL updates and event reminders right in your messenger.", cta: "Open in Telegram" },
    { title: "Academy", desc: "Step-by-step lessons on risk, levels and trade management, with a named certificate for completed courses.", cta: "Start learning" },
  ],
  marketsLine: "Gold & silver · Forex · Brent oil · Crypto · US stocks · Indices",
  markets: [
    { name: "Gold & silver", symbols: SYM.metals, desc: "Intraday scenarios with a clear entry, defined risk and staged profit targets.", hours: "Sunday evening to Friday, plus a 24/7 gold feed" },
    { name: "Forex", symbols: SYM.forex, desc: "Nine major and cross pairs, each with its own session logic.", hours: "Sunday evening to Friday" },
    { name: "Brent crude oil (cash CFD)", symbols: SYM.oil, desc: "Oil scenarios built around active sessions and controlled trade duration.", hours: "During Brent trading sessions" },
    { name: "Crypto", symbols: SYM.crypto, desc: "Bitcoin and Ethereum scenarios, including weekends.", hours: "24 hours a day, 7 days a week" },
    { name: "US stocks", symbols: SYM.stocks, desc: "Selected US shares with earnings-date protection.", hours: "US extended session on weekdays" },
    { name: "Indices (cash CFD)", symbols: SYM.indices, desc: "Nasdaq 100, S&P 500 and DAX 40 setups.", hours: "Sunday evening to Friday, broker session" },
  ],
  telegramCta: "Open in Telegram",
};

const ru: TradingPlatformTexts = {
  heroBadge: "Приложение для Windows · Веб-кабинет · Telegram · Академия",
  heroTitle1: "NICS Trading Ecosystem —",
  heroTitle2: "автономная AI-платформа для трейдинга",
  heroDesc:
    "Движок круглосуточно сканирует золото, форекс, нефть, крипту, акции и индексы и публикует готовые сетапы со входом, стоп-лоссом и TP1–TP4. Работайте с ними в приложении для Windows или веб-кабинете, получайте в Telegram, учитесь в академии и проверяйте каждый результат в открытой статистике.",
  ctaWindows: "Приложение для Windows",
  ctaPerformance: "Проверенная статистика",
  ctaPro: "Получить доступ Pro",
  telegramLine: "Удобнее в Telegram? Сигналы и Mini App — в @nics_ai_bot",
  platformBadge: "Один аккаунт — четыре места",
  platformTitle: "Всё, чтобы торговать по плану",
  platformDesc: "Одни и те же сигналы, история и настройки везде: начните на одном устройстве и продолжайте на другом.",
  surfaces: [
    { title: "Приложение для Windows", desc: "Рабочее место на компьютере: сигналы, заказ анализа, календарь, статистика и академия в одном окне.", cta: "О приложении" },
    { title: "Веб-кабинет", desc: "Полное рабочее место в любом браузере на Mac, ПК или планшете. Вход через Telegram или по коду на e-mail.", cta: "Открыть кабинет" },
    { title: "Telegram-бот и Mini App", desc: "Карточки сигналов, обновления по TP и SL и напоминания о событиях прямо в мессенджере.", cta: "Открыть в Telegram" },
    { title: "Академия", desc: "Пошаговые уроки о риске, уровнях и сопровождении сделки и именной сертификат за пройденный курс.", cta: "Начать обучение" },
  ],
  marketsLine: "Золото и серебро · Форекс · Нефть Brent · Криптовалюты · Акции США · Индексы",
  markets: [
    { name: "Золото и серебро", symbols: SYM.metals, desc: "Внутридневные сценарии с понятным входом, заданным риском и поэтапными целями.", hours: "С вечера воскресенья до пятницы, плюс круглосуточная котировка золота" },
    { name: "Форекс", symbols: SYM.forex, desc: "Девять основных и кросс-пар, у каждой своя логика сессий.", hours: "С вечера воскресенья до пятницы" },
    { name: "Нефть Brent (кэш CFD)", symbols: SYM.oil, desc: "Сценарии по нефти с учётом активных сессий и ограниченной длительностью сделки.", hours: "В торговые сессии Brent" },
    { name: "Криптовалюты", symbols: SYM.crypto, desc: "Сценарии по биткоину и эфиру, включая выходные.", hours: "Круглосуточно, 7 дней в неделю" },
    { name: "Акции США", symbols: SYM.stocks, desc: "Отдельные американские акции с защитой от дат отчётности.", hours: "Расширенная сессия США в будни" },
    { name: "Индексы (кэш CFD)", symbols: SYM.indices, desc: "Сетапы по Nasdaq 100, S&P 500 и DAX 40.", hours: "С вечера воскресенья до пятницы, по сессии брокера" },
  ],
  telegramCta: "Открыть в Telegram",
};

const bg: TradingPlatformTexts = {
  heroBadge: "Приложение за Windows · Уеб табло · Telegram · Академия",
  heroTitle1: "NICS Trading Ecosystem —",
  heroTitle2: "автономна AI платформа за търговия",
  heroDesc:
    "Двигателят сканира денонощно злато, форекс, петрол, крипто, акции и индекси и публикува готови сетъпи с вход, стоп загуба и TP1–TP4. Работете с тях в приложението за Windows или в уеб таблото, получавайте ги в Telegram, учете в академията и проверявайте всеки резултат в публичната статистика.",
  ctaWindows: "Приложение за Windows",
  ctaPerformance: "Проверени резултати",
  ctaPro: "Вземи Pro достъп",
  telegramLine: "Предпочитате Telegram? Сигналите и Mini App са в @nics_ai_bot",
  platformBadge: "Един акаунт — четири места",
  platformTitle: "Всичко, за да търгувате с план",
  platformDesc: "Едни и същи сигнали, история и настройки навсякъде: започнете на едно устройство и продължете на друго.",
  surfaces: [
    { title: "Приложение за Windows", desc: "Работно място на компютъра: сигнали, поръчка на анализ, календар, статистика и академия в един прозорец.", cta: "За приложението" },
    { title: "Уеб табло", desc: "Пълното работно място във всеки браузър на Mac, PC или таблет. Вход с Telegram или с код по e-mail.", cta: "Отвори таблото" },
    { title: "Telegram бот и Mini App", desc: "Карти на сигналите, актуализации за TP и SL и напомняния за събития направо в месинджъра.", cta: "Отвори в Telegram" },
    { title: "Академия", desc: "Уроци стъпка по стъпка за риска, нивата и управлението на сделката, с именен сертификат за завършен курс.", cta: "Започни обучение" },
  ],
  marketsLine: "Злато и сребро · Форекс · Петрол Brent · Крипто · Акции от САЩ · Индекси",
  markets: [
    { name: "Злато и сребро", symbols: SYM.metals, desc: "Вътрешнодневни сценарии с ясен вход, определен риск и поетапни цели.", hours: "От неделя вечер до петък, плюс денонощна котировка на златото" },
    { name: "Форекс", symbols: SYM.forex, desc: "Девет основни и кръстосани двойки, всяка със своя логика на сесиите.", hours: "От неделя вечер до петък" },
    { name: "Петрол Brent (кеш CFD)", symbols: SYM.oil, desc: "Сценарии за петрола според активните сесии и с ограничена продължителност на сделката.", hours: "По време на сесиите на Brent" },
    { name: "Крипто", symbols: SYM.crypto, desc: "Сценарии за биткойн и етер, включително през уикенда.", hours: "Денонощно, 7 дни в седмицата" },
    { name: "Акции от САЩ", symbols: SYM.stocks, desc: "Избрани американски акции със защита около датите на отчетите.", hours: "Разширена сесия в САЩ в работни дни" },
    { name: "Индекси (кеш CFD)", symbols: SYM.indices, desc: "Сетъпи за Nasdaq 100, S&P 500 и DAX 40.", hours: "От неделя вечер до петък, според сесията на брокера" },
  ],
  telegramCta: "Отвори в Telegram",
};

const de: TradingPlatformTexts = {
  heroBadge: "Windows-App · Web-Dashboard · Telegram · Academy",
  heroTitle1: "NICS Trading Ecosystem —",
  heroTitle2: "autonome KI-Trading-Plattform",
  heroDesc:
    "Die Engine scannt rund um die Uhr Gold, Forex, Öl, Krypto, Aktien und Indizes und veröffentlicht fertige Setups mit Entry, Stop Loss und TP1–TP4. Arbeiten Sie damit in der Windows-App oder im Web-Dashboard, erhalten Sie sie in Telegram, lernen Sie in der Academy und prüfen Sie jedes Ergebnis im verifizierten Track Record.",
  ctaWindows: "Windows-App ansehen",
  ctaPerformance: "Verifizierte Performance",
  ctaPro: "Pro-Zugang holen",
  telegramLine: "Lieber Telegram? Signale und die Mini App gibt es in @nics_ai_bot",
  platformBadge: "Ein Konto, vier Orte",
  platformTitle: "Alles, um mit Plan zu handeln",
  platformDesc: "Dieselben Signale, Historie und Einstellungen überall: auf einem Gerät beginnen, auf einem anderen weitermachen.",
  surfaces: [
    { title: "Windows-App", desc: "Ein Desktop-Arbeitsplatz: Live-Signale, Analyse anfordern, Kalender, Track Record und Academy in einem Fenster.", cta: "Zur Windows-App" },
    { title: "Web-Dashboard", desc: "Der volle Arbeitsplatz in jedem Browser auf Mac, PC oder Tablet. Anmeldung mit Telegram oder E-Mail-Code.", cta: "Dashboard öffnen" },
    { title: "Telegram-Bot und Mini App", desc: "Signalkarten, TP- und SL-Updates und Termin-Erinnerungen direkt im Messenger.", cta: "In Telegram öffnen" },
    { title: "Academy", desc: "Schritt-für-Schritt-Lektionen zu Risiko, Levels und Trade-Management, mit Zertifikat auf Ihren Namen.", cta: "Jetzt lernen" },
  ],
  marketsLine: "Gold & Silber · Forex · Brent-Öl · Krypto · US-Aktien · Indizes",
  markets: [
    { name: "Gold & Silber", symbols: SYM.metals, desc: "Intraday-Szenarien mit klarem Einstieg, definiertem Risiko und gestaffelten Zielen.", hours: "Sonntagabend bis Freitag, dazu ein 24/7-Goldkurs" },
    { name: "Forex", symbols: SYM.forex, desc: "Neun Haupt- und Kreuzpaare, jedes mit eigener Sitzungslogik.", hours: "Sonntagabend bis Freitag" },
    { name: "Brent-Rohöl (Cash-CFD)", symbols: SYM.oil, desc: "Öl-Szenarien rund um aktive Sitzungen mit begrenzter Haltedauer.", hours: "Während der Brent-Handelszeiten" },
    { name: "Krypto", symbols: SYM.crypto, desc: "Bitcoin- und Ethereum-Szenarien, auch am Wochenende.", hours: "24 Stunden, 7 Tage die Woche" },
    { name: "US-Aktien", symbols: SYM.stocks, desc: "Ausgewählte US-Aktien mit Schutz rund um Quartalszahlen.", hours: "Erweiterte US-Sitzung an Werktagen" },
    { name: "Indizes (Cash-CFD)", symbols: SYM.indices, desc: "Setups für Nasdaq 100, S&P 500 und DAX 40.", hours: "Sonntagabend bis Freitag, nach Broker-Sitzung" },
  ],
  telegramCta: "In Telegram öffnen",
};

const es: TradingPlatformTexts = {
  heroBadge: "App para Windows · Panel web · Telegram · Academia",
  heroTitle1: "NICS Trading Ecosystem —",
  heroTitle2: "plataforma autónoma de trading con IA",
  heroDesc:
    "El motor analiza oro, forex, petróleo, cripto, acciones e índices las 24 horas y publica setups listos con Entry, Stop Loss y TP1–TP4. Trabaja con ellos en la app para Windows o en el panel web, recíbelos en Telegram, aprende en la academia y comprueba cada resultado en el historial verificado.",
  ctaWindows: "Ver la app para Windows",
  ctaPerformance: "Rendimiento verificado",
  ctaPro: "Obtener acceso Pro",
  telegramLine: "¿Prefieres Telegram? Las señales y la Mini App están en @nics_ai_bot",
  platformBadge: "Una cuenta, cuatro lugares",
  platformTitle: "Todo para operar con un plan",
  platformDesc: "Las mismas señales, historial y ajustes en todas partes: empieza en un dispositivo y sigue en otro.",
  surfaces: [
    { title: "App para Windows", desc: "Un espacio de escritorio: señales, pedir un análisis, calendario, historial y academia en una ventana.", cta: "Sobre la app" },
    { title: "Panel web", desc: "El espacio completo en cualquier navegador en Mac, PC o tablet. Acceso con Telegram o código por e-mail.", cta: "Abrir el panel" },
    { title: "Bot de Telegram y Mini App", desc: "Tarjetas de señales, avisos de TP y SL y recordatorios de eventos en tu mensajería.", cta: "Abrir en Telegram" },
    { title: "Academia", desc: "Lecciones paso a paso sobre riesgo, niveles y gestión de operaciones, con certificado a tu nombre.", cta: "Empezar a aprender" },
  ],
  marketsLine: "Oro y plata · Forex · Petróleo Brent · Cripto · Acciones de EE. UU. · Índices",
  markets: [
    { name: "Oro y plata", symbols: SYM.metals, desc: "Escenarios intradía con entrada clara, riesgo definido y objetivos escalonados.", hours: "De domingo por la tarde a viernes, más un precio del oro 24/7" },
    { name: "Forex", symbols: SYM.forex, desc: "Nueve pares principales y cruzados, cada uno con su lógica de sesión.", hours: "De domingo por la tarde a viernes" },
    { name: "Petróleo Brent (CFD al contado)", symbols: SYM.oil, desc: "Escenarios de petróleo según las sesiones activas y con duración limitada.", hours: "Durante las sesiones de Brent" },
    { name: "Cripto", symbols: SYM.crypto, desc: "Escenarios de bitcoin y ethereum, también en fin de semana.", hours: "24 horas, 7 días a la semana" },
    { name: "Acciones de EE. UU.", symbols: SYM.stocks, desc: "Acciones seleccionadas con protección en fechas de resultados.", hours: "Sesión ampliada de EE. UU. en días laborables" },
    { name: "Índices (CFD al contado)", symbols: SYM.indices, desc: "Setups de Nasdaq 100, S&P 500 y DAX 40.", hours: "De domingo por la tarde a viernes, sesión del bróker" },
  ],
  telegramCta: "Abrir en Telegram",
};

const pt: TradingPlatformTexts = {
  heroBadge: "App para Windows · Painel web · Telegram · Academia",
  heroTitle1: "NICS Trading Ecosystem —",
  heroTitle2: "plataforma autônoma de trading com IA",
  heroDesc:
    "O motor analisa ouro, forex, petróleo, cripto, ações e índices 24 horas por dia e publica setups prontos com Entry, Stop Loss e TP1–TP4. Use-os no app para Windows ou no painel web, receba no Telegram, aprenda na academia e confira cada resultado no histórico verificado.",
  ctaWindows: "Ver o app para Windows",
  ctaPerformance: "Desempenho verificado",
  ctaPro: "Obter acesso Pro",
  telegramLine: "Prefere o Telegram? Sinais e Mini App estão em @nics_ai_bot",
  platformBadge: "Uma conta, quatro lugares",
  platformTitle: "Tudo para operar com um plano",
  platformDesc: "Os mesmos sinais, histórico e configurações em todo lugar: comece num dispositivo e continue em outro.",
  surfaces: [
    { title: "App para Windows", desc: "Um espaço no desktop: sinais, pedir análise, calendário, histórico e academia numa janela.", cta: "Sobre o app" },
    { title: "Painel web", desc: "O espaço completo em qualquer navegador no Mac, PC ou tablet. Entre com Telegram ou código por e-mail.", cta: "Abrir o painel" },
    { title: "Bot do Telegram e Mini App", desc: "Cartões de sinais, avisos de TP e SL e lembretes de eventos no seu mensageiro.", cta: "Abrir no Telegram" },
    { title: "Academia", desc: "Aulas passo a passo sobre risco, níveis e gestão de operações, com certificado no seu nome.", cta: "Começar a aprender" },
  ],
  marketsLine: "Ouro e prata · Forex · Petróleo Brent · Cripto · Ações dos EUA · Índices",
  markets: [
    { name: "Ouro e prata", symbols: SYM.metals, desc: "Cenários intradiários com entrada clara, risco definido e metas escalonadas.", hours: "De domingo à noite a sexta, mais cotação do ouro 24/7" },
    { name: "Forex", symbols: SYM.forex, desc: "Nove pares principais e cruzados, cada um com lógica de sessão própria.", hours: "De domingo à noite a sexta" },
    { name: "Petróleo Brent (CFD à vista)", symbols: SYM.oil, desc: "Cenários de petróleo conforme as sessões ativas, com duração limitada.", hours: "Durante as sessões do Brent" },
    { name: "Cripto", symbols: SYM.crypto, desc: "Cenários de bitcoin e ethereum, inclusive aos fins de semana.", hours: "24 horas, 7 dias por semana" },
    { name: "Ações dos EUA", symbols: SYM.stocks, desc: "Ações selecionadas com proteção nas datas de resultados.", hours: "Sessão estendida dos EUA em dias úteis" },
    { name: "Índices (CFD à vista)", symbols: SYM.indices, desc: "Setups de Nasdaq 100, S&P 500 e DAX 40.", hours: "De domingo à noite a sexta, sessão da corretora" },
  ],
  telegramCta: "Abrir no Telegram",
};

const fr: TradingPlatformTexts = {
  heroBadge: "Application Windows · Tableau de bord web · Telegram · Académie",
  heroTitle1: "NICS Trading Ecosystem —",
  heroTitle2: "plateforme de trading IA autonome",
  heroDesc:
    "Le moteur analyse jour et nuit l'or, le forex, le pétrole, les cryptos, les actions et les indices et publie des setups prêts avec Entry, Stop Loss et TP1–TP4. Utilisez-les dans l'application Windows ou le tableau de bord web, recevez-les sur Telegram, apprenez à l'académie et vérifiez chaque résultat dans l'historique vérifié.",
  ctaWindows: "Découvrir l'app Windows",
  ctaPerformance: "Performance vérifiée",
  ctaPro: "Obtenir l'accès Pro",
  telegramLine: "Vous préférez Telegram ? Signaux et Mini App dans @nics_ai_bot",
  platformBadge: "Un compte, quatre endroits",
  platformTitle: "Tout pour trader avec un plan",
  platformDesc: "Les mêmes signaux, historique et réglages partout : commencez sur un appareil, continuez sur un autre.",
  surfaces: [
    { title: "Application Windows", desc: "Un espace de travail sur PC : signaux, analyse à la demande, calendrier, historique et académie dans une fenêtre.", cta: "L'application Windows" },
    { title: "Tableau de bord web", desc: "L'espace complet dans tout navigateur sur Mac, PC ou tablette. Connexion par Telegram ou code e-mail.", cta: "Ouvrir le tableau de bord" },
    { title: "Bot Telegram et Mini App", desc: "Fiches de signaux, mises à jour TP et SL et rappels d'événements dans votre messagerie.", cta: "Ouvrir dans Telegram" },
    { title: "Académie", desc: "Leçons pas à pas sur le risque, les niveaux et la gestion des positions, avec certificat nominatif.", cta: "Commencer" },
  ],
  marketsLine: "Or et argent · Forex · Pétrole Brent · Crypto · Actions US · Indices",
  markets: [
    { name: "Or et argent", symbols: SYM.metals, desc: "Scénarios intraday avec entrée claire, risque défini et objectifs échelonnés.", hours: "Du dimanche soir au vendredi, plus un cours de l'or 24/7" },
    { name: "Forex", symbols: SYM.forex, desc: "Neuf paires majeures et croisées, chacune avec sa logique de session.", hours: "Du dimanche soir au vendredi" },
    { name: "Pétrole Brent (CFD au comptant)", symbols: SYM.oil, desc: "Scénarios pétrole selon les sessions actives, durée de position limitée.", hours: "Pendant les sessions du Brent" },
    { name: "Crypto", symbols: SYM.crypto, desc: "Scénarios bitcoin et ethereum, y compris le week-end.", hours: "24 h/24, 7 j/7" },
    { name: "Actions US", symbols: SYM.stocks, desc: "Actions américaines sélectionnées, protégées autour des résultats.", hours: "Séance étendue US en semaine" },
    { name: "Indices (CFD au comptant)", symbols: SYM.indices, desc: "Setups sur Nasdaq 100, S&P 500 et DAX 40.", hours: "Du dimanche soir au vendredi, séance du courtier" },
  ],
  telegramCta: "Ouvrir dans Telegram",
};

const it: TradingPlatformTexts = {
  heroBadge: "App per Windows · Dashboard web · Telegram · Academy",
  heroTitle1: "NICS Trading Ecosystem —",
  heroTitle2: "piattaforma di trading IA autonoma",
  heroDesc:
    "Il motore analizza 24 ore su 24 oro, forex, petrolio, cripto, azioni e indici e pubblica setup pronti con Entry, Stop Loss e TP1–TP4. Usali nell'app per Windows o nella dashboard web, ricevili su Telegram, impara nell'academy e verifica ogni risultato nello storico verificato.",
  ctaWindows: "Scopri l'app Windows",
  ctaPerformance: "Performance verificata",
  ctaPro: "Ottieni l'accesso Pro",
  telegramLine: "Preferisci Telegram? Segnali e Mini App sono in @nics_ai_bot",
  platformBadge: "Un account, quattro luoghi",
  platformTitle: "Tutto per fare trading con un piano",
  platformDesc: "Gli stessi segnali, storico e impostazioni ovunque: inizia su un dispositivo e continua su un altro.",
  surfaces: [
    { title: "App per Windows", desc: "Uno spazio di lavoro desktop: segnali, analisi su richiesta, calendario, storico e academy in una finestra.", cta: "L'app per Windows" },
    { title: "Dashboard web", desc: "Lo spazio completo in qualsiasi browser su Mac, PC o tablet. Accesso con Telegram o codice e-mail.", cta: "Apri la dashboard" },
    { title: "Bot Telegram e Mini App", desc: "Schede dei segnali, aggiornamenti TP e SL e promemoria degli eventi nel tuo messenger.", cta: "Apri in Telegram" },
    { title: "Academy", desc: "Lezioni passo passo su rischio, livelli e gestione dei trade, con certificato nominativo.", cta: "Inizia a imparare" },
  ],
  marketsLine: "Oro e argento · Forex · Petrolio Brent · Cripto · Azioni USA · Indici",
  markets: [
    { name: "Oro e argento", symbols: SYM.metals, desc: "Scenari intraday con ingresso chiaro, rischio definito e target a scaglioni.", hours: "Da domenica sera a venerdì, più una quotazione dell'oro 24/7" },
    { name: "Forex", symbols: SYM.forex, desc: "Nove coppie principali e incrociate, ognuna con la propria logica di sessione.", hours: "Da domenica sera a venerdì" },
    { name: "Petrolio Brent (CFD cash)", symbols: SYM.oil, desc: "Scenari sul petrolio in base alle sessioni attive, con durata limitata.", hours: "Durante le sessioni del Brent" },
    { name: "Cripto", symbols: SYM.crypto, desc: "Scenari su bitcoin ed ethereum, anche nel fine settimana.", hours: "24 ore su 24, 7 giorni su 7" },
    { name: "Azioni USA", symbols: SYM.stocks, desc: "Azioni USA selezionate con protezione nelle date delle trimestrali.", hours: "Sessione estesa USA nei giorni feriali" },
    { name: "Indici (CFD cash)", symbols: SYM.indices, desc: "Setup su Nasdaq 100, S&P 500 e DAX 40.", hours: "Da domenica sera a venerdì, sessione del broker" },
  ],
  telegramCta: "Apri in Telegram",
};

const pl: TradingPlatformTexts = {
  heroBadge: "Aplikacja Windows · Panel web · Telegram · Akademia",
  heroTitle1: "NICS Trading Ecosystem —",
  heroTitle2: "autonomiczna platforma tradingowa AI",
  heroDesc:
    "Silnik przez całą dobę analizuje złoto, forex, ropę, krypto, akcje i indeksy i publikuje gotowe setupy z Entry, Stop Loss i TP1–TP4. Korzystaj z nich w aplikacji Windows lub panelu web, otrzymuj je w Telegramie, ucz się w akademii i sprawdzaj każdy wynik w zweryfikowanej historii.",
  ctaWindows: "Aplikacja na Windows",
  ctaPerformance: "Zweryfikowane wyniki",
  ctaPro: "Uzyskaj dostęp Pro",
  telegramLine: "Wolisz Telegram? Sygnały i Mini App są w @nics_ai_bot",
  platformBadge: "Jedno konto, cztery miejsca",
  platformTitle: "Wszystko, by handlować z planem",
  platformDesc: "Te same sygnały, historia i ustawienia wszędzie: zacznij na jednym urządzeniu, kontynuuj na innym.",
  surfaces: [
    { title: "Aplikacja Windows", desc: "Stanowisko na komputerze: sygnały, zamawianie analizy, kalendarz, historia i akademia w jednym oknie.", cta: "O aplikacji" },
    { title: "Panel web", desc: "Pełne stanowisko w każdej przeglądarce na Mac, PC lub tablecie. Logowanie przez Telegram lub kod e-mail.", cta: "Otwórz panel" },
    { title: "Bot Telegram i Mini App", desc: "Karty sygnałów, aktualizacje TP i SL oraz przypomnienia o wydarzeniach w komunikatorze.", cta: "Otwórz w Telegramie" },
    { title: "Akademia", desc: "Lekcje krok po kroku o ryzyku, poziomach i zarządzaniu pozycją, z imiennym certyfikatem.", cta: "Zacznij naukę" },
  ],
  marketsLine: "Złoto i srebro · Forex · Ropa Brent · Krypto · Akcje USA · Indeksy",
  markets: [
    { name: "Złoto i srebro", symbols: SYM.metals, desc: "Scenariusze intraday z jasnym wejściem, określonym ryzykiem i stopniowymi celami.", hours: "Od niedzieli wieczorem do piątku, plus całodobowy kurs złota" },
    { name: "Forex", symbols: SYM.forex, desc: "Dziewięć głównych i krzyżowych par, każda z własną logiką sesji.", hours: "Od niedzieli wieczorem do piątku" },
    { name: "Ropa Brent (CFD kasowy)", symbols: SYM.oil, desc: "Scenariusze na ropie według aktywnych sesji, z ograniczonym czasem pozycji.", hours: "W sesjach handlowych Brent" },
    { name: "Krypto", symbols: SYM.crypto, desc: "Scenariusze na bitcoinie i ethereum, także w weekendy.", hours: "Całą dobę, 7 dni w tygodniu" },
    { name: "Akcje USA", symbols: SYM.stocks, desc: "Wybrane akcje z USA z ochroną wokół dat wyników.", hours: "Rozszerzona sesja USA w dni robocze" },
    { name: "Indeksy (CFD kasowy)", symbols: SYM.indices, desc: "Setupy na Nasdaq 100, S&P 500 i DAX 40.", hours: "Od niedzieli wieczorem do piątku, sesja brokera" },
  ],
  telegramCta: "Otwórz w Telegramie",
};

const tr: TradingPlatformTexts = {
  heroBadge: "Windows uygulaması · Web paneli · Telegram · Akademi",
  heroTitle1: "NICS Trading Ecosystem —",
  heroTitle2: "otonom yapay zekâ trading platformu",
  heroDesc:
    "Motor altın, forex, petrol, kripto, hisse ve endeksleri günün her saati tarar ve Entry, Stop Loss ve TP1–TP4 içeren hazır kurulumlar yayınlar. Bunları Windows uygulamasında veya web panelinde kullanın, Telegram'da alın, akademide öğrenin ve her sonucu doğrulanmış geçmişte kontrol edin.",
  ctaWindows: "Windows uygulamasını incele",
  ctaPerformance: "Doğrulanmış performans",
  ctaPro: "Pro erişim al",
  telegramLine: "Telegram mı tercih edersiniz? Sinyaller ve Mini App @nics_ai_bot içinde",
  platformBadge: "Tek hesap, dört yer",
  platformTitle: "Planlı işlem için gereken her şey",
  platformDesc: "Aynı sinyaller, geçmiş ve ayarlar her yerde: bir cihazda başlayın, diğerinde devam edin.",
  surfaces: [
    { title: "Windows uygulaması", desc: "Masaüstü çalışma alanı: sinyaller, analiz talebi, takvim, geçmiş ve akademi tek pencerede.", cta: "Uygulama hakkında" },
    { title: "Web paneli", desc: "Mac, PC veya tablette her tarayıcıda tam çalışma alanı. Telegram veya e-posta koduyla giriş.", cta: "Paneli aç" },
    { title: "Telegram botu ve Mini App", desc: "Sinyal kartları, TP ve SL güncellemeleri ve etkinlik hatırlatmaları mesajlaşma uygulamanızda.", cta: "Telegram'da aç" },
    { title: "Akademi", desc: "Risk, seviyeler ve işlem yönetimi üzerine adım adım dersler ve adınıza sertifika.", cta: "Öğrenmeye başla" },
  ],
  marketsLine: "Altın ve gümüş · Forex · Brent petrol · Kripto · ABD hisseleri · Endeksler",
  markets: [
    { name: "Altın ve gümüş", symbols: SYM.metals, desc: "Net giriş, tanımlı risk ve kademeli hedeflerle gün içi senaryolar.", hours: "Pazar akşamından cumaya, ayrıca 7/24 altın fiyatı" },
    { name: "Forex", symbols: SYM.forex, desc: "Her biri kendi seans mantığına sahip dokuz ana ve çapraz parite.", hours: "Pazar akşamından cumaya" },
    { name: "Brent petrol (spot CFD)", symbols: SYM.oil, desc: "Aktif seanslara göre, sınırlı işlem süreli petrol senaryoları.", hours: "Brent işlem seanslarında" },
    { name: "Kripto", symbols: SYM.crypto, desc: "Hafta sonları dahil bitcoin ve ethereum senaryoları.", hours: "Günde 24 saat, haftada 7 gün" },
    { name: "ABD hisseleri", symbols: SYM.stocks, desc: "Bilanço tarihlerine karşı korumalı seçili ABD hisseleri.", hours: "Hafta içi ABD uzatılmış seansı" },
    { name: "Endeksler (spot CFD)", symbols: SYM.indices, desc: "Nasdaq 100, S&P 500 ve DAX 40 kurulumları.", hours: "Pazar akşamından cumaya, aracı kurum seansı" },
  ],
  telegramCta: "Telegram'da aç",
};

const ar: TradingPlatformTexts = {
  heroBadge: "تطبيق Windows · لوحة ويب · تيليجرام · الأكاديمية",
  heroTitle1: "NICS Trading Ecosystem —",
  heroTitle2: "منصة تداول مستقلة بالذكاء الاصطناعي",
  heroDesc:
    "يفحص المحرك الذهب والفوركس والنفط والعملات المشفرة والأسهم والمؤشرات على مدار الساعة وينشر إعدادات جاهزة مع نقطة الدخول وStop Loss وTP1–TP4. استخدمها في تطبيق Windows أو لوحة الويب، واستلمها في تيليجرام، وتعلّم في الأكاديمية، وتحقق من كل نتيجة في السجل الموثق.",
  ctaWindows: "تطبيق Windows",
  ctaPerformance: "الأداء الموثق",
  ctaPro: "احصل على وصول Pro",
  telegramLine: "تفضّل تيليجرام؟ الإشارات والتطبيق المصغر في @nics_ai_bot",
  platformBadge: "حساب واحد، أربعة أماكن",
  platformTitle: "كل ما تحتاجه للتداول بخطة",
  platformDesc: "نفس الإشارات والسجل والإعدادات في كل مكان: ابدأ على جهاز وتابع على آخر.",
  surfaces: [
    { title: "تطبيق Windows", desc: "مساحة عمل على الحاسوب: الإشارات وطلب التحليل والتقويم والسجل والأكاديمية في نافذة واحدة.", cta: "عن التطبيق" },
    { title: "لوحة الويب", desc: "مساحة العمل الكاملة في أي متصفح على Mac أو PC أو جهاز لوحي. الدخول عبر تيليجرام أو رمز البريد.", cta: "افتح اللوحة" },
    { title: "بوت تيليجرام والتطبيق المصغر", desc: "بطاقات الإشارات وتحديثات TP وSL وتذكيرات الأحداث في تطبيق المراسلة.", cta: "افتح في تيليجرام" },
    { title: "الأكاديمية", desc: "دروس خطوة بخطوة عن المخاطر والمستويات وإدارة الصفقة، مع شهادة باسمك.", cta: "ابدأ التعلم" },
  ],
  marketsLine: "الذهب والفضة · الفوركس · نفط برنت · العملات المشفرة · الأسهم الأمريكية · المؤشرات",
  markets: [
    { name: "الذهب والفضة", symbols: SYM.metals, desc: "سيناريوهات يومية بدخول واضح ومخاطرة محددة وأهداف متدرجة.", hours: "من مساء الأحد إلى الجمعة، مع سعر ذهب على مدار الساعة" },
    { name: "الفوركس", symbols: SYM.forex, desc: "تسعة أزواج رئيسية وتقاطعية، لكل منها منطق جلسات خاص.", hours: "من مساء الأحد إلى الجمعة" },
    { name: "نفط برنت (CFD نقدي)", symbols: SYM.oil, desc: "سيناريوهات النفط وفق الجلسات النشطة ومع مدة صفقة محدودة.", hours: "خلال جلسات تداول برنت" },
    { name: "العملات المشفرة", symbols: SYM.crypto, desc: "سيناريوهات البيتكوين والإيثيريوم، بما في ذلك عطلات نهاية الأسبوع.", hours: "24 ساعة، 7 أيام في الأسبوع" },
    { name: "الأسهم الأمريكية", symbols: SYM.stocks, desc: "أسهم أمريكية مختارة مع حماية حول مواعيد النتائج.", hours: "الجلسة الأمريكية الممتدة في أيام العمل" },
    { name: "المؤشرات (CFD نقدي)", symbols: SYM.indices, desc: "إعدادات على Nasdaq 100 وS&P 500 وDAX 40.", hours: "من مساء الأحد إلى الجمعة، حسب جلسة الوسيط" },
  ],
  telegramCta: "افتح في تيليجرام",
};

const zh: TradingPlatformTexts = {
  heroBadge: "Windows 应用 · 网页面板 · Telegram · 学院",
  heroTitle1: "NICS Trading Ecosystem —",
  heroTitle2: "自主 AI 交易平台",
  heroDesc:
    "引擎全天候扫描黄金、外汇、原油、加密货币、股票和指数，发布包含入场、止损和 TP1–TP4 的现成交易方案。在 Windows 应用或网页面板中使用，在 Telegram 接收，在学院学习，并在经过验证的业绩记录中核对每个结果。",
  ctaWindows: "了解 Windows 应用",
  ctaPerformance: "查看验证业绩",
  ctaPro: "获取 Pro 权限",
  telegramLine: "更喜欢 Telegram？信号和迷你应用在 @nics_ai_bot",
  platformBadge: "一个账户，四个入口",
  platformTitle: "按计划交易所需的一切",
  platformDesc: "各处同样的信号、历史和设置：在一台设备上开始，在另一台上继续。",
  surfaces: [
    { title: "Windows 应用", desc: "桌面工作台：信号、按需分析、日历、业绩记录和学院都在一个窗口。", cta: "了解应用" },
    { title: "网页面板", desc: "在 Mac、PC 或平板的任何浏览器中使用完整工作台。通过 Telegram 或邮箱验证码登录。", cta: "打开面板" },
    { title: "Telegram 机器人和迷你应用", desc: "信号卡片、TP 和 SL 更新以及事件提醒直接发到您的聊天工具。", cta: "在 Telegram 打开" },
    { title: "学院", desc: "关于风险、关键位和交易管理的分步课程，完成后获得署名证书。", cta: "开始学习" },
  ],
  marketsLine: "黄金和白银 · 外汇 · 布伦特原油 · 加密货币 · 美股 · 指数",
  markets: [
    { name: "黄金和白银", symbols: SYM.metals, desc: "日内方案：入场清晰、风险明确、分阶段止盈。", hours: "周日晚至周五，另有 24/7 黄金报价" },
    { name: "外汇", symbols: SYM.forex, desc: "九个主要及交叉货币对，各有独立的时段逻辑。", hours: "周日晚至周五" },
    { name: "布伦特原油（现货 CFD）", symbols: SYM.oil, desc: "围绕活跃时段的原油方案，持仓时间受控。", hours: "布伦特交易时段内" },
    { name: "加密货币", symbols: SYM.crypto, desc: "比特币和以太坊方案，周末也有。", hours: "全天 24 小时，每周 7 天" },
    { name: "美股", symbols: SYM.stocks, desc: "精选美股，财报日期附近有保护。", hours: "工作日美股延长时段" },
    { name: "指数（现货 CFD）", symbols: SYM.indices, desc: "纳斯达克 100、标普 500 和 DAX 40 方案。", hours: "周日晚至周五，按经纪商时段" },
  ],
  telegramCta: "在 Telegram 打开",
};

const ALL: Record<string, TradingPlatformTexts> = { en, ru, bg, de, es, pt, fr, it, pl, tr, ar, zh };

export const tradingPlatformTexts = (lang: string): TradingPlatformTexts => ALL[lang] ?? en;
