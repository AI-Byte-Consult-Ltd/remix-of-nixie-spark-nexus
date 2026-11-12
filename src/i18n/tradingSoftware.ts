/*
 * Texts of /nics-trading-software ("AI Trading Software", SEO level A,
 * Alexander's plan 2026-11-07). Phase 1 languages only (src/i18n/phasedSeo.ts).
 *
 * Every statement here must stay true for the live product:
 * - the engine publishes setups with an Entry zone, Stop Loss and TP1–TP4;
 * - "Strong Setup" = strong signal (counted in the public track record),
 *   "Watchlist Setup" = weak signal, only on request when no strong one
 *   exists, never auto-sent and never counted in any statistics;
 * - position sizing on the card uses the user's balance/risk and the broker's
 *   MT5 contract specification (src/features/nics/SignalCard.tsx);
 * - nothing is executed automatically: the user accepts or skips a signal;
 * - news: open positions are not closed automatically, the user gets a
 *   reminder about the event.
 * Market list must match src/i18n/tradingPlatform.ts (MARKETS).
 */
import type { Phase1Lang } from "./phasedSeo";

export interface TradingSoftwareTexts {
  seoTitle: string;
  seoDescription: string;
  badge: string;
  title: string;
  subtitle: string;
  ctaPlans: string;
  ctaWindows: string;
  ctaTrack: string;
  howTitle: string;
  how: { title: string; desc: string }[];
  featuresTitle: string;
  features: { title: string; desc: string }[];
  setupsTitle: string;
  strong: { title: string; desc: string };
  watchlist: { title: string; desc: string };
  surfacesTitle: string;
  surfaces: { title: string; desc: string; href: "windows" | "cabinet" | "telegram" | "trading" }[];
  marketsTitle: string;
  marketsLine: string;
  notTitle: string;
  not: string[];
  guidesTitle: string;
  guides: { slug: string; title: string }[];
  faqTitle: string;
  faq: { q: string; a: string }[];
  disclaimer: string;
}

const SLUGS = {
  signals: "how-ai-trading-signals-work",
  lot: "how-to-calculate-lot-size-forex",
  risk: "how-to-calculate-risk-per-trade",
  windows: "ai-trading-software-for-windows",
  management: "forex-risk-management",
  gold: "how-to-analyze-gold-market",
  rr: "risk-to-reward-ratio",
  auto: "trading-signals-vs-automated-trading",
};

const en: TradingSoftwareTexts = {
  seoTitle: "AI Trading Software — NICS AI Trader for Windows, Web and Telegram",
  seoDescription:
    "NICS AI Trader is AI trading software that scans gold, forex, oil, crypto, stocks and indices 24/7 and gives ready setups with Entry, Stop Loss, TP1–TP4 and position sizing for your account.",
  badge: "AI trading software · by AI Byte Consult, Bulgaria",
  title: "AI trading software that does the market scanning for you",
  subtitle:
    "NICS AI Trader watches 19 instruments around the clock, finds setups that pass its filters and hands you a complete plan: where to enter, where the stop is, four profit targets and the lot size for your balance. You make the final decision.",
  ctaPlans: "See plans",
  ctaWindows: "Windows app",
  ctaTrack: "Verified performance",
  howTitle: "How it works",
  how: [
    { title: "1. Scan", desc: "Every 15 minutes, day and night, the engine reads live broker prices for each market and checks trend, levels, volatility, session and upcoming news." },
    { title: "2. Setup", desc: "When a setup passes the filters, it is published with an Entry zone, Stop Loss, TP1–TP4, the reason for the direction and risk notes." },
    { title: "3. Your decision", desc: "You accept or skip it. The card already shows the lot size for your balance and risk, rounded to your broker's lot step." },
    { title: "4. Tracking", desc: "The engine follows each signal to TP, SL or breakeven, sends you updates and writes the result into the public track record." },
  ],
  featuresTitle: "What you get",
  features: [
    { title: "Complete trade plan", desc: "Entry zone, Stop Loss and four take-profit levels, plus a multi-timeframe block with the D1, H4, M15 and M5 highs and lows." },
    { title: "Position sizing", desc: "Risk amount, exact lot, lot rounded to the broker step, loss at the minimum lot and margin, from the broker's MT5 contract specification." },
    { title: "Analysis on request", desc: "Order a fresh analysis of one instrument or an extra scan of all markets whenever you want a second look." },
    { title: "News protection", desc: "An economic calendar inside the app and reminders about high-impact events while your position is open. Nothing is closed behind your back." },
    { title: "Verified track record", desc: "Every closed strong signal goes into public statistics in R: equity curve, drawdown, profit factor, results per instrument." },
    { title: "Academy", desc: "Step-by-step lessons on risk, levels and trade management, with a named certificate after a course is really completed." },
  ],
  setupsTitle: "Two kinds of setups, labelled honestly",
  strong: {
    title: "Strong Setup",
    desc: "All filters passed. Delivered automatically to subscribers and counted in the public track record, wins and losses alike.",
  },
  watchlist: {
    title: "Watchlist Setup",
    desc: "A weaker idea. Never sent automatically: you only see it when you ask for a signal on a market where no strong setup exists, and the card says so. It is not counted in any statistics.",
  },
  surfacesTitle: "One account, every device",
  surfaces: [
    { title: "Windows app", desc: "Desktop workspace for Windows 10 and 11, works without Telegram.", href: "windows" },
    { title: "Web dashboard", desc: "The same workspace in any browser on Mac, PC or tablet.", href: "cabinet" },
    { title: "Telegram bot and Mini App", desc: "Signal cards and TP/SL updates in your messenger.", href: "telegram" },
    { title: "Trading page", desc: "Markets, plans and the live track record.", href: "trading" },
  ],
  marketsTitle: "Markets covered",
  marketsLine:
    "Gold and silver (XAU/USD, XAG/USD) · 9 forex pairs · Brent oil · Bitcoin and Ethereum · NVDA and TSLA · US100, US500 and GER40",
  notTitle: "What the software does not do",
  not: [
    "It does not open or close trades on your account. You decide and you place the order with your broker.",
    "It does not promise profit. Losing signals happen and stay visible in the statistics.",
    "It is not personal financial advice. It is an analytical tool with risk calculations.",
  ],
  guidesTitle: "Guides",
  guides: [
    { slug: SLUGS.signals, title: "How AI trading signals work" },
    { slug: SLUGS.lot, title: "How to calculate lot size in forex" },
    { slug: SLUGS.risk, title: "How to calculate risk per trade" },
    { slug: SLUGS.rr, title: "What is the risk-to-reward ratio?" },
    { slug: SLUGS.management, title: "Forex risk management" },
    { slug: SLUGS.gold, title: "How to analyze the gold market" },
    { slug: SLUGS.windows, title: "AI trading software for Windows: what to check" },
    { slug: SLUGS.auto, title: "Trading signals vs automated trading" },
  ],
  faqTitle: "Questions",
  faq: [
    { q: "What is AI trading software?", a: "A program that analyses market data automatically and turns it into trade ideas or trades. NICS AI Trader produces complete trade plans and risk calculations; the decision to trade stays with you." },
    { q: "Does NICS AI Trader trade automatically?", a: "No. It scans the markets autonomously and publishes setups, but it never places orders on your account. You accept or skip each signal." },
    { q: "Which broker do I need?", a: "Prices come from a Vantage MT5 feed, and position sizing uses MT5 contract specifications. You can apply the levels with any broker that offers the same instruments, but check its contract sizes." },
    { q: "How much does it cost?", a: "A 7-day trial costs €1.99, then €19.99 a month, cancel any time. One-time passes for 7, 30 or 90 days without renewal are also available. The Windows app is included." },
    { q: "Can I check the results before paying?", a: "Yes. The verified track record on the trading page is public and shows every closed strong signal, including the losing ones." },
  ],
  disclaimer:
    "Trading involves substantial risk of loss. NICS AI Trader provides analytical trading scenarios and risk tools, not financial advice or guaranteed returns.",
};

const ru: TradingSoftwareTexts = {
  seoTitle: "Программа для трейдинга с ИИ — NICS AI Trader для Windows, веба и Telegram",
  seoDescription:
    "NICS AI Trader — программа для трейдинга с ИИ: круглосуточно сканирует золото, форекс, нефть, крипту, акции и индексы и даёт готовые сетапы со входом, стоп-лоссом, TP1–TP4 и расчётом лота под ваш счёт.",
  badge: "Программа для трейдинга с ИИ · AI Byte Consult, Болгария",
  title: "Программа для трейдинга, которая сканирует рынок за вас",
  subtitle:
    "NICS AI Trader круглосуточно следит за 19 инструментами, находит сетапы, прошедшие фильтры, и выдаёт готовый план: где входить, где стоп, четыре цели и объём лота под ваш баланс. Окончательное решение — за вами.",
  ctaPlans: "Тарифы",
  ctaWindows: "Приложение для Windows",
  ctaTrack: "Проверенная статистика",
  howTitle: "Как это работает",
  how: [
    { title: "1. Сканирование", desc: "Каждые 15 минут, днём и ночью, движок берёт живые цены брокера по каждому рынку и проверяет тренд, уровни, волатильность, сессию и ближайшие новости." },
    { title: "2. Сетап", desc: "Если сетап проходит фильтры, он публикуется с зоной входа, стоп-лоссом, TP1–TP4, основанием для направления и заметками о риске." },
    { title: "3. Ваше решение", desc: "Вы принимаете или пропускаете сигнал. В карточке уже посчитан лот под ваш баланс и риск, округлённый до шага лота вашего брокера." },
    { title: "4. Сопровождение", desc: "Движок ведёт каждый сигнал до TP, SL или безубытка, присылает обновления и записывает итог в открытую статистику." },
  ],
  featuresTitle: "Что вы получаете",
  features: [
    { title: "Готовый торговый план", desc: "Зона входа, стоп-лосс и четыре тейк-профита, плюс блок мульти-таймфрейма с максимумами и минимумами D1, H4, M15 и M5." },
    { title: "Расчёт объёма", desc: "Сумма риска, точный лот, лот по шагу брокера, убыток при минимальном лоте и маржа — по спецификации контракта MT5." },
    { title: "Анализ по запросу", desc: "Закажите свежий анализ одного инструмента или дополнительное сканирование всех рынков, когда нужен второй взгляд." },
    { title: "Защита от новостей", desc: "Экономический календарь в приложении и напоминания о важных событиях, пока позиция открыта. Ничего не закрывается без вашего ведома." },
    { title: "Проверенная статистика", desc: "Каждый закрытый сильный сигнал попадает в открытую статистику в R: кривая доходности, просадка, профит-фактор, итоги по инструментам." },
    { title: "Академия", desc: "Пошаговые уроки о риске, уровнях и сопровождении сделки, именной сертификат — только после реально пройденного курса." },
  ],
  setupsTitle: "Два вида сетапов — с честной пометкой",
  strong: {
    title: "Strong Setup",
    desc: "Все фильтры пройдены. Приходит подписчикам автоматически и входит в открытую статистику — и прибыльные, и убыточные.",
  },
  watchlist: {
    title: "Watchlist Setup",
    desc: "Более слабая идея. Автоматически не рассылается: вы видите её, только если сами запросили сигнал по рынку, где сильного сетапа нет, и карточка прямо об этом говорит. В статистику не входит.",
  },
  surfacesTitle: "Один аккаунт — на всех устройствах",
  surfaces: [
    { title: "Приложение для Windows", desc: "Рабочее место для Windows 10 и 11, работает без Telegram.", href: "windows" },
    { title: "Веб-кабинет", desc: "То же рабочее место в любом браузере на Mac, ПК или планшете.", href: "cabinet" },
    { title: "Telegram-бот и Mini App", desc: "Карточки сигналов и обновления по TP/SL в мессенджере.", href: "telegram" },
    { title: "Страница трейдинга", desc: "Рынки, тарифы и живая статистика.", href: "trading" },
  ],
  marketsTitle: "Рынки",
  marketsLine:
    "Золото и серебро (XAU/USD, XAG/USD) · 9 валютных пар · нефть Brent · Bitcoin и Ethereum · NVDA и TSLA · US100, US500 и GER40",
  notTitle: "Чего программа не делает",
  not: [
    "Не открывает и не закрывает сделки на вашем счёте. Решаете вы, и ордер у брокера ставите вы.",
    "Не обещает прибыль. Убыточные сигналы бывают, и они остаются видны в статистике.",
    "Не является персональной инвестиционной рекомендацией. Это аналитический инструмент с расчётом риска.",
  ],
  guidesTitle: "Статьи",
  guides: [
    { slug: SLUGS.signals, title: "Как работают торговые сигналы на основе ИИ" },
    { slug: SLUGS.lot, title: "Как рассчитать размер лота на форексе" },
    { slug: SLUGS.risk, title: "Как рассчитать риск на сделку" },
    { slug: SLUGS.rr, title: "Что такое соотношение риска и прибыли" },
    { slug: SLUGS.management, title: "Риск-менеджмент на форексе" },
    { slug: SLUGS.gold, title: "Как анализировать рынок золота" },
    { slug: SLUGS.windows, title: "Программа для трейдинга с ИИ для Windows: что проверить" },
    { slug: SLUGS.auto, title: "Торговые сигналы или автоматическая торговля" },
  ],
  faqTitle: "Вопросы",
  faq: [
    { q: "Что такое программа для трейдинга с ИИ?", a: "Программа, которая автоматически анализирует рыночные данные и превращает их в торговые идеи или сделки. NICS AI Trader выдаёт готовые торговые планы и расчёт риска, а решение о сделке остаётся за вами." },
    { q: "NICS AI Trader торгует автоматически?", a: "Нет. Он самостоятельно сканирует рынки и публикует сетапы, но никогда не ставит ордера на вашем счёте. Каждый сигнал вы принимаете или пропускаете." },
    { q: "Какой нужен брокер?", a: "Цены берутся из фида Vantage MT5, расчёт объёма — по спецификациям контрактов MT5. Уровни можно применять у любого брокера с теми же инструментами, но проверьте размер его контрактов." },
    { q: "Сколько это стоит?", a: "Пробные 7 дней — 1,99 €, затем 19,99 € в месяц, отменить можно в любой момент. Есть и разовые доступы на 7, 30 или 90 дней без продления. Приложение для Windows входит в подписку." },
    { q: "Можно проверить результаты до оплаты?", a: "Да. Проверенная статистика на странице трейдинга открыта и показывает каждый закрытый сильный сигнал, включая убыточные." },
  ],
  disclaimer:
    "Торговля связана с высоким риском потерь. NICS AI Trader даёт аналитические торговые сценарии и инструменты контроля риска, а не инвестиционные рекомендации и не гарантию дохода.",
};

const bg: TradingSoftwareTexts = {
  seoTitle: "Софтуер за трейдинг с ИИ — NICS AI Trader за Windows, уеб и Telegram",
  seoDescription:
    "NICS AI Trader е софтуер за трейдинг с ИИ: денонощно сканира злато, форекс, петрол, крипто, акции и индекси и дава готови сетъпи с вход, стоп загуба, TP1–TP4 и размер на лота за вашата сметка.",
  badge: "Софтуер за трейдинг с ИИ · AI Byte Consult, България",
  title: "Софтуер за трейдинг, който сканира пазара вместо вас",
  subtitle:
    "NICS AI Trader следи 19 инструмента денонощно, намира сетъпи, които минават филтрите, и ви дава готов план: къде да влезете, къде е стопът, четири цели и размерът на лота за вашия баланс. Последната дума е ваша.",
  ctaPlans: "Планове",
  ctaWindows: "Приложение за Windows",
  ctaTrack: "Проверени резултати",
  howTitle: "Как работи",
  how: [
    { title: "1. Сканиране", desc: "На всеки 15 минути, денем и нощем, системата чете живите цени на брокера за всеки пазар и проверява тренд, нива, волатилност, сесия и предстоящи новини." },
    { title: "2. Сетъп", desc: "Когато сетъп премине филтрите, той се публикува със зона за вход, стоп загуба, TP1–TP4, причината за посоката и бележки за риска." },
    { title: "3. Вашето решение", desc: "Приемате го или го пропускате. Картата вече показва лота за вашия баланс и риск, закръглен до стъпката на вашия брокер." },
    { title: "4. Проследяване", desc: "Системата следи всеки сигнал до TP, SL или безубитък, изпраща ви обновления и записва резултата в публичната статистика." },
  ],
  featuresTitle: "Какво получавате",
  features: [
    { title: "Пълен план за сделката", desc: "Зона за вход, стоп загуба и четири нива за печалба, плюс блок с няколко таймфрейма: върхове и дъна на D1, H4, M15 и M5." },
    { title: "Размер на позицията", desc: "Сума на риска, точен лот, лот по стъпката на брокера, загуба при минимален лот и маржин — по MT5 спецификацията на договора." },
    { title: "Анализ при поискване", desc: "Поръчайте нов анализ на един инструмент или допълнително сканиране на всички пазари, когато искате втори поглед." },
    { title: "Защита от новини", desc: "Икономически календар в приложението и напомняния за важни събития, докато позицията е отворена. Нищо не се затваря без ваше знание." },
    { title: "Проверени резултати", desc: "Всеки затворен силен сигнал влиза в публичната статистика в R: крива на капитала, просадка, профит фактор, резултати по инструменти." },
    { title: "Академия", desc: "Уроци стъпка по стъпка за риска, нивата и управлението на сделката, със сертификат с вашето име след реално завършен курс." },
  ],
  setupsTitle: "Два вида сетъпи — с честен етикет",
  strong: {
    title: "Strong Setup",
    desc: "Всички филтри са минати. Изпраща се автоматично на абонатите и влиза в публичната статистика — и печелившите, и губещите.",
  },
  watchlist: {
    title: "Watchlist Setup",
    desc: "По-слаба идея. Никога не се изпраща автоматично: виждате я само ако сами поискате сигнал за пазар, където няма силен сетъп, и картата го казва ясно. Не влиза в никаква статистика.",
  },
  surfacesTitle: "Един акаунт на всяко устройство",
  surfaces: [
    { title: "Приложение за Windows", desc: "Работно място за Windows 10 и 11, работи без Telegram.", href: "windows" },
    { title: "Уеб табло", desc: "Същото работно място във всеки браузър на Mac, PC или таблет.", href: "cabinet" },
    { title: "Telegram бот и Mini App", desc: "Карти на сигналите и обновления за TP/SL в месинджъра.", href: "telegram" },
    { title: "Страница за трейдинг", desc: "Пазари, планове и статистика на живо.", href: "trading" },
  ],
  marketsTitle: "Пазари",
  marketsLine:
    "Злато и сребро (XAU/USD, XAG/USD) · 9 валутни двойки · петрол Brent · Bitcoin и Ethereum · NVDA и TSLA · US100, US500 и GER40",
  notTitle: "Какво софтуерът не прави",
  not: [
    "Не отваря и не затваря сделки по вашата сметка. Вие решавате и вие пускате поръчката при брокера си.",
    "Не обещава печалба. Губещи сигнали има и те остават видими в статистиката.",
    "Не е персонален финансов съвет. Това е аналитичен инструмент с изчисления на риска.",
  ],
  guidesTitle: "Статии",
  guides: [
    { slug: SLUGS.signals, title: "Как работят търговските сигнали с ИИ" },
    { slug: SLUGS.lot, title: "Как да изчислим размера на лота във форекс" },
    { slug: SLUGS.risk, title: "Как да изчислим риска на сделка" },
    { slug: SLUGS.rr, title: "Какво е съотношение риск/печалба" },
    { slug: SLUGS.management, title: "Управление на риска във форекс" },
    { slug: SLUGS.gold, title: "Как да анализираме пазара на злато" },
    { slug: SLUGS.windows, title: "Софтуер за трейдинг с ИИ за Windows: какво да проверите" },
    { slug: SLUGS.auto, title: "Търговски сигнали или автоматична търговия" },
  ],
  faqTitle: "Въпроси",
  faq: [
    { q: "Какво е софтуер за трейдинг с ИИ?", a: "Програма, която автоматично анализира пазарни данни и ги превръща в търговски идеи или сделки. NICS AI Trader дава готови планове за сделки и изчисления на риска; решението да търгувате остава ваше." },
    { q: "NICS AI Trader търгува ли автоматично?", a: "Не. Той сам сканира пазарите и публикува сетъпи, но никога не пуска поръчки по вашата сметка. Всеки сигнал вие приемате или пропускате." },
    { q: "Какъв брокер ми трябва?", a: "Цените идват от фийд на Vantage MT5, а размерът на позицията се изчислява по MT5 спецификации. Можете да използвате нивата при всеки брокер със същите инструменти, но проверете размера на договорите му." },
    { q: "Колко струва?", a: "7-дневен пробен период за 1,99 €, след това 19,99 € на месец, с отказ по всяко време. Има и еднократен достъп за 7, 30 или 90 дни без подновяване. Приложението за Windows е включено." },
    { q: "Мога ли да проверя резултатите преди да платя?", a: "Да. Проверената статистика на страницата за трейдинг е публична и показва всеки затворен силен сигнал, включително губещите." },
  ],
  disclaimer:
    "Търговията носи висок риск от загуби. NICS AI Trader предоставя аналитични сценарии и инструменти за риска, а не финансов съвет или гарантирана доходност.",
};

const de: TradingSoftwareTexts = {
  seoTitle: "KI-Trading-Software — NICS AI Trader für Windows, Web und Telegram",
  seoDescription:
    "NICS AI Trader ist eine KI-Trading-Software: Sie scannt Gold, Forex, Öl, Krypto, Aktien und Indizes rund um die Uhr und liefert fertige Setups mit Einstieg, Stop-Loss, TP1–TP4 und Positionsgröße für Ihr Konto.",
  badge: "KI-Trading-Software · AI Byte Consult, Bulgarien",
  title: "Trading-Software, die den Markt für Sie scannt",
  subtitle:
    "NICS AI Trader beobachtet 19 Instrumente rund um die Uhr, findet Setups, die alle Filter bestehen, und liefert einen fertigen Plan: Einstieg, Stop, vier Kursziele und die Lotgröße für Ihren Kontostand. Die Entscheidung treffen Sie.",
  ctaPlans: "Tarife ansehen",
  ctaWindows: "Windows-App",
  ctaTrack: "Geprüfte Ergebnisse",
  howTitle: "So funktioniert es",
  how: [
    { title: "1. Scan", desc: "Alle 15 Minuten, Tag und Nacht, liest die Engine Live-Kurse des Brokers für jeden Markt und prüft Trend, Niveaus, Volatilität, Handelssitzung und anstehende Nachrichten." },
    { title: "2. Setup", desc: "Besteht ein Setup die Filter, wird es mit Einstiegszone, Stop-Loss, TP1–TP4, Begründung der Richtung und Risikohinweisen veröffentlicht." },
    { title: "3. Ihre Entscheidung", desc: "Sie nehmen es an oder überspringen es. Die Karte zeigt bereits die Lotgröße für Ihren Kontostand und Ihr Risiko, gerundet auf den Lot-Schritt Ihres Brokers." },
    { title: "4. Verfolgung", desc: "Die Engine begleitet jedes Signal bis TP, SL oder Break-even, schickt Ihnen Updates und trägt das Ergebnis in die öffentliche Statistik ein." },
  ],
  featuresTitle: "Was Sie bekommen",
  features: [
    { title: "Vollständiger Handelsplan", desc: "Einstiegszone, Stop-Loss und vier Take-Profit-Ziele, dazu ein Multi-Timeframe-Block mit Hochs und Tiefs auf D1, H4, M15 und M5." },
    { title: "Positionsgröße", desc: "Risikobetrag, exaktes Lot, Lot nach Broker-Schritt, Verlust beim Mindestlot und Margin, berechnet aus der MT5-Kontraktspezifikation." },
    { title: "Analyse auf Abruf", desc: "Fordern Sie jederzeit eine frische Analyse eines Instruments oder einen zusätzlichen Scan aller Märkte an." },
    { title: "Schutz vor Nachrichten", desc: "Wirtschaftskalender in der App und Erinnerungen an wichtige Termine, solange Ihre Position offen ist. Nichts wird ohne Ihr Wissen geschlossen." },
    { title: "Geprüfte Statistik", desc: "Jedes geschlossene starke Signal fließt in die öffentliche Statistik in R ein: Kapitalkurve, Drawdown, Profitfaktor, Ergebnisse je Instrument." },
    { title: "Akademie", desc: "Lektionen Schritt für Schritt zu Risiko, Niveaus und Trade-Management, mit Zertifikat auf Ihren Namen nach wirklich abgeschlossenem Kurs." },
  ],
  setupsTitle: "Zwei Arten von Setups, ehrlich gekennzeichnet",
  strong: {
    title: "Strong Setup",
    desc: "Alle Filter bestanden. Wird Abonnenten automatisch zugestellt und in der öffentlichen Statistik gezählt, Gewinner wie Verlierer.",
  },
  watchlist: {
    title: "Watchlist Setup",
    desc: "Eine schwächere Idee. Wird nie automatisch versendet: Sie sehen sie nur, wenn Sie selbst ein Signal für einen Markt anfordern, auf dem es kein starkes Setup gibt, und die Karte sagt das klar. Sie zählt in keiner Statistik.",
  },
  surfacesTitle: "Ein Konto auf jedem Gerät",
  surfaces: [
    { title: "Windows-App", desc: "Desktop-Arbeitsplatz für Windows 10 und 11, funktioniert ohne Telegram.", href: "windows" },
    { title: "Web-Dashboard", desc: "Derselbe Arbeitsplatz in jedem Browser auf Mac, PC oder Tablet.", href: "cabinet" },
    { title: "Telegram-Bot und Mini App", desc: "Signalkarten und TP/SL-Updates im Messenger.", href: "telegram" },
    { title: "Trading-Seite", desc: "Märkte, Tarife und die Live-Statistik.", href: "trading" },
  ],
  marketsTitle: "Abgedeckte Märkte",
  marketsLine:
    "Gold und Silber (XAU/USD, XAG/USD) · 9 Forex-Paare · Brent-Öl · Bitcoin und Ethereum · NVDA und TSLA · US100, US500 und GER40",
  notTitle: "Was die Software nicht tut",
  not: [
    "Sie eröffnet oder schließt keine Trades auf Ihrem Konto. Sie entscheiden und platzieren die Order bei Ihrem Broker.",
    "Sie verspricht keinen Gewinn. Verlustsignale kommen vor und bleiben in der Statistik sichtbar.",
    "Sie ist keine persönliche Anlageberatung, sondern ein Analysewerkzeug mit Risikoberechnung.",
  ],
  guidesTitle: "Ratgeber (auf Englisch)",
  guides: [
    { slug: SLUGS.signals, title: "Wie KI-Trading-Signale funktionieren" },
    { slug: SLUGS.lot, title: "Lotgröße im Forex berechnen" },
    { slug: SLUGS.risk, title: "Risiko pro Trade berechnen" },
    { slug: SLUGS.rr, title: "Was ist das Chance-Risiko-Verhältnis?" },
    { slug: SLUGS.management, title: "Risikomanagement im Forex" },
    { slug: SLUGS.gold, title: "Den Goldmarkt analysieren" },
    { slug: SLUGS.windows, title: "KI-Trading-Software für Windows: worauf achten" },
    { slug: SLUGS.auto, title: "Trading-Signale oder automatisierter Handel" },
  ],
  faqTitle: "Fragen",
  faq: [
    { q: "Was ist KI-Trading-Software?", a: "Ein Programm, das Marktdaten automatisch auswertet und daraus Handelsideen oder Trades macht. NICS AI Trader liefert vollständige Handelspläne und Risikoberechnungen; die Entscheidung bleibt bei Ihnen." },
    { q: "Handelt NICS AI Trader automatisch?", a: "Nein. Er scannt die Märkte selbstständig und veröffentlicht Setups, platziert aber nie Orders auf Ihrem Konto. Jedes Signal nehmen Sie an oder überspringen es." },
    { q: "Welchen Broker brauche ich?", a: "Die Kurse stammen aus einem Vantage-MT5-Feed, die Positionsgröße basiert auf MT5-Kontraktspezifikationen. Sie können die Niveaus bei jedem Broker mit denselben Instrumenten nutzen, prüfen Sie aber dessen Kontraktgrößen." },
    { q: "Was kostet es?", a: "Die 7-tägige Testphase kostet 1,99 €, danach 19,99 € im Monat, jederzeit kündbar. Es gibt auch einmalige Zugänge für 7, 30 oder 90 Tage ohne Verlängerung. Die Windows-App ist inklusive." },
    { q: "Kann ich die Ergebnisse vor dem Kauf prüfen?", a: "Ja. Die geprüfte Statistik auf der Trading-Seite ist öffentlich und zeigt jedes geschlossene starke Signal, auch die Verlierer." },
  ],
  disclaimer:
    "Trading ist mit einem erheblichen Verlustrisiko verbunden. NICS AI Trader liefert analytische Handelsszenarien und Risikowerkzeuge, keine Anlageberatung und keine garantierten Renditen.",
};

const es: TradingSoftwareTexts = {
  seoTitle: "Software de trading con IA — NICS AI Trader para Windows, web y Telegram",
  seoDescription:
    "NICS AI Trader es un software de trading con IA: analiza oro, forex, petróleo, cripto, acciones e índices las 24 horas y entrega setups con entrada, stop loss, TP1–TP4 y tamaño de lote para tu cuenta.",
  badge: "Software de trading con IA · AI Byte Consult, Bulgaria",
  title: "Software de trading que analiza el mercado por ti",
  subtitle:
    "NICS AI Trader vigila 19 instrumentos día y noche, encuentra setups que superan sus filtros y te da un plan completo: dónde entrar, dónde va el stop, cuatro objetivos y el tamaño de lote para tu saldo. La decisión final es tuya.",
  ctaPlans: "Ver planes",
  ctaWindows: "App para Windows",
  ctaTrack: "Resultados verificados",
  howTitle: "Cómo funciona",
  how: [
    { title: "1. Análisis", desc: "Cada 15 minutos, de día y de noche, el motor lee precios en vivo del bróker para cada mercado y revisa tendencia, niveles, volatilidad, sesión y noticias próximas." },
    { title: "2. Setup", desc: "Cuando un setup supera los filtros, se publica con zona de entrada, stop loss, TP1–TP4, el motivo de la dirección y notas de riesgo." },
    { title: "3. Tu decisión", desc: "Lo aceptas o lo descartas. La tarjeta ya muestra el lote para tu saldo y tu riesgo, redondeado al paso de lote de tu bróker." },
    { title: "4. Seguimiento", desc: "El motor sigue cada señal hasta TP, SL o breakeven, te envía actualizaciones y registra el resultado en el historial público." },
  ],
  featuresTitle: "Qué obtienes",
  features: [
    { title: "Plan de operación completo", desc: "Zona de entrada, stop loss y cuatro take profit, más un bloque multi-temporalidad con máximos y mínimos de D1, H4, M15 y M5." },
    { title: "Tamaño de posición", desc: "Importe en riesgo, lote exacto, lote según el paso del bróker, pérdida con el lote mínimo y margen, según la especificación MT5 del contrato." },
    { title: "Análisis a pedido", desc: "Pide un análisis nuevo de un instrumento o un escaneo extra de todos los mercados cuando quieras una segunda opinión." },
    { title: "Protección ante noticias", desc: "Calendario económico en la app y recordatorios de eventos importantes mientras tu posición está abierta. Nada se cierra sin que lo sepas." },
    { title: "Historial verificado", desc: "Cada señal fuerte cerrada entra en la estadística pública en R: curva de capital, drawdown, factor de beneficio y resultados por instrumento." },
    { title: "Academia", desc: "Lecciones paso a paso sobre riesgo, niveles y gestión de la operación, con certificado a tu nombre tras completar de verdad un curso." },
  ],
  setupsTitle: "Dos tipos de setups, etiquetados con honestidad",
  strong: {
    title: "Strong Setup",
    desc: "Superó todos los filtros. Se envía automáticamente a los suscriptores y cuenta en el historial público, ganadoras y perdedoras.",
  },
  watchlist: {
    title: "Watchlist Setup",
    desc: "Una idea más débil. Nunca se envía automáticamente: solo la ves si pides una señal de un mercado sin setup fuerte, y la tarjeta lo indica. No cuenta en ninguna estadística.",
  },
  surfacesTitle: "Una cuenta en todos tus dispositivos",
  surfaces: [
    { title: "App para Windows", desc: "Espacio de trabajo para Windows 10 y 11, funciona sin Telegram.", href: "windows" },
    { title: "Panel web", desc: "El mismo espacio de trabajo en cualquier navegador en Mac, PC o tableta.", href: "cabinet" },
    { title: "Bot de Telegram y Mini App", desc: "Tarjetas de señales y avisos de TP/SL en tu mensajería.", href: "telegram" },
    { title: "Página de trading", desc: "Mercados, planes y el historial en vivo.", href: "trading" },
  ],
  marketsTitle: "Mercados",
  marketsLine:
    "Oro y plata (XAU/USD, XAG/USD) · 9 pares de forex · petróleo Brent · Bitcoin y Ethereum · NVDA y TSLA · US100, US500 y GER40",
  notTitle: "Lo que el software no hace",
  not: [
    "No abre ni cierra operaciones en tu cuenta. Tú decides y colocas la orden en tu bróker.",
    "No promete beneficios. Hay señales perdedoras y siguen visibles en la estadística.",
    "No es asesoramiento financiero personal. Es una herramienta de análisis con cálculos de riesgo.",
  ],
  guidesTitle: "Guías (en inglés)",
  guides: [
    { slug: SLUGS.signals, title: "Cómo funcionan las señales de trading con IA" },
    { slug: SLUGS.lot, title: "Cómo calcular el tamaño de lote en forex" },
    { slug: SLUGS.risk, title: "Cómo calcular el riesgo por operación" },
    { slug: SLUGS.rr, title: "Qué es la relación riesgo-beneficio" },
    { slug: SLUGS.management, title: "Gestión del riesgo en forex" },
    { slug: SLUGS.gold, title: "Cómo analizar el mercado del oro" },
    { slug: SLUGS.windows, title: "Software de trading con IA para Windows: qué revisar" },
    { slug: SLUGS.auto, title: "Señales de trading o trading automatizado" },
  ],
  faqTitle: "Preguntas",
  faq: [
    { q: "¿Qué es un software de trading con IA?", a: "Un programa que analiza datos de mercado de forma automática y los convierte en ideas de operación u operaciones. NICS AI Trader genera planes completos y cálculos de riesgo; la decisión de operar sigue siendo tuya." },
    { q: "¿NICS AI Trader opera automáticamente?", a: "No. Analiza los mercados de forma autónoma y publica setups, pero nunca coloca órdenes en tu cuenta. Cada señal la aceptas o la descartas tú." },
    { q: "¿Qué bróker necesito?", a: "Los precios vienen de un feed de Vantage MT5 y el tamaño de posición usa especificaciones de contratos MT5. Puedes aplicar los niveles en cualquier bróker con los mismos instrumentos, pero revisa el tamaño de sus contratos." },
    { q: "¿Cuánto cuesta?", a: "La prueba de 7 días cuesta 1,99 €, después 19,99 € al mes, cancelable en cualquier momento. También hay accesos únicos de 7, 30 o 90 días sin renovación. La app para Windows está incluida." },
    { q: "¿Puedo comprobar los resultados antes de pagar?", a: "Sí. El historial verificado de la página de trading es público y muestra cada señal fuerte cerrada, también las perdedoras." },
  ],
  disclaimer:
    "El trading conlleva un riesgo elevado de pérdidas. NICS AI Trader ofrece escenarios analíticos y herramientas de riesgo, no asesoramiento financiero ni rentabilidad garantizada.",
};

export const tradingSoftwareTexts: Record<Phase1Lang, TradingSoftwareTexts> = { en, ru, bg, de, es };
