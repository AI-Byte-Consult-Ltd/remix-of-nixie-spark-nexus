/*
 * Translations of the NICS AI Trader plan cards (site /trading and cabinet
 * subscription page). Prices and ids live in src/data/nicsTraderPlans.ts —
 * only words are here. Languages: en (base, in the data file), ru, bg, de,
 * es, pt. Other site languages fall back to English.
 */
import { plans, type Plan } from "@/data/nicsTraderPlans";

type PlanWords = Pick<Plan, "name" | "badge" | "subtitle" | "markets" | "trialNote" | "features" | "cta">;

export interface PlansUi {
  title1: string;
  title2: string;
  desc: string;
  chips: [string, string, string];
  periods: { "7d": string; "30d": string; "90d": string };
  periodFor: { "7d": string; "30d": string; "90d": string };
  trialLabel: string;
  choosePay: string;
  starsTitle: string;
  starsDesc: string;
  cardTitle: string;
  cardDescEur: string;
  cardDescUsd: string;
  explain: { title: string; body: string }[];
  disclaimer: string;
}

const enUi: PlansUi = {
  title1: "One price, every market.",
  title2: "Two ways to pay.",
  desc: "Both options give the same full access: every market, the Windows app, the web dashboard and Telegram. The only difference is how you pay.",
  chips: ["Fast Telegram access", "No setup fee", "Entry, SL and TP1–TP4"],
  periods: { "7d": "7 Days", "30d": "30 Days", "90d": "3 Months" },
  periodFor: { "7d": "for 7 days", "30d": "for 30 days", "90d": "for 3 months" },
  trialLabel: "7-day trial",
  choosePay: "choose how you'd like to pay.",
  starsTitle: "Pay with Telegram Stars",
  starsDesc: "Pay directly in @nics_ai_bot — fully automatic.",
  cardTitle: "Pay by card via Revolut",
  cardDescEur: "Log in to your account, then complete a secure Revolut checkout — access activates automatically.",
  cardDescUsd: "Charged in EUR on Revolut's checkout. Log in to your account to pay — access activates automatically.",
  explain: [
    { title: "€1.99 — trial week", body: "The first 7 days of the subscription. Your card is saved for the renewal; cancel before day 7 and you pay nothing more." },
    { title: "€19.99 / month — subscription", body: "Charged automatically every month after the trial. The lowest monthly price. Cancel in one tap, access stays to the end of the paid month." },
    { title: "€9 / €29 / €69 — one-time pass", body: "A single payment for 7, 30 or 90 days, without saving a card or auto-renewal. Costs more per month in exchange for no commitment." },
  ],
  disclaimer: "Prices are displayed directly in the selected currency. Trading involves substantial risk. NICS provides analytical trading scenarios and risk-management tools, not guaranteed returns or financial advice.",
};

const ui: Record<string, PlansUi> = {
  en: enUi,
  ru: {
    title1: "Одна цена — все рынки.",
    title2: "Два способа оплаты.",
    desc: "Оба варианта дают одинаковый полный доступ: все рынки, приложение для Windows, веб-кабинет и Telegram. Разница только в том, как вы платите.",
    chips: ["Быстрый доступ в Telegram", "Без платы за подключение", "Вход, SL и TP1–TP4"],
    periods: { "7d": "7 дней", "30d": "30 дней", "90d": "3 месяца" },
    periodFor: { "7d": "на 7 дней", "30d": "на 30 дней", "90d": "на 3 месяца" },
    trialLabel: "пробная неделя",
    choosePay: "выберите способ оплаты.",
    starsTitle: "Оплата Telegram Stars",
    starsDesc: "Оплата прямо в @nics_ai_bot — полностью автоматически.",
    cardTitle: "Оплата картой через Revolut",
    cardDescEur: "Войдите в кабинет и оплатите на защищённой странице Revolut — доступ включится автоматически.",
    cardDescUsd: "Списание в евро на странице Revolut. Войдите в кабинет, чтобы оплатить, — доступ включится автоматически.",
    explain: [
      { title: "€1,99 — пробная неделя", body: "Первые 7 дней подписки. Карта сохраняется для продления; отмените до 7-го дня — и больше ничего не спишется." },
      { title: "€19,99 в месяц — подписка", body: "Списывается автоматически каждый месяц после пробной недели. Самая низкая цена за месяц. Отмена одной кнопкой, доступ остаётся до конца оплаченного месяца." },
      { title: "€9 / €29 / €69 — разовый доступ", body: "Один платёж за 7, 30 или 90 дней, без сохранения карты и без автопродления. Дороже в пересчёте на месяц — зато без обязательств." },
    ],
    disclaimer: "Цены показаны в выбранной валюте. Торговля связана с высоким риском. NICS даёт аналитические торговые сценарии и инструменты управления риском, а не гарантию дохода или финансовые рекомендации.",
  },
  bg: {
    title1: "Една цена — всички пазари.",
    title2: "Два начина на плащане.",
    desc: "И двата варианта дават еднакъв пълен достъп: всички пазари, приложението за Windows, уеб таблото и Telegram. Разликата е само в начина на плащане.",
    chips: ["Бърз достъп в Telegram", "Без такса за активиране", "Вход, SL и TP1–TP4"],
    periods: { "7d": "7 дни", "30d": "30 дни", "90d": "3 месеца" },
    periodFor: { "7d": "за 7 дни", "30d": "за 30 дни", "90d": "за 3 месеца" },
    trialLabel: "пробна седмица",
    choosePay: "изберете начин на плащане.",
    starsTitle: "Плащане с Telegram Stars",
    starsDesc: "Плащане директно в @nics_ai_bot — напълно автоматично.",
    cardTitle: "Плащане с карта чрез Revolut",
    cardDescEur: "Влезте в акаунта си и платете на защитената страница на Revolut — достъпът се активира автоматично.",
    cardDescUsd: "Таксува се в евро на страницата на Revolut. Влезте в акаунта си, за да платите — достъпът се активира автоматично.",
    explain: [
      { title: "€1,99 — пробна седмица", body: "Първите 7 дни от абонамента. Картата се запазва за подновяването; откажете преди 7-ия ден и няма да платите нищо повече." },
      { title: "€19,99 на месец — абонамент", body: "Таксува се автоматично всеки месец след пробната седмица. Най-ниската месечна цена. Отказ с един бутон, достъпът остава до края на платения месец." },
      { title: "€9 / €29 / €69 — еднократен достъп", body: "Едно плащане за 7, 30 или 90 дни, без запазване на карта и без автоматично подновяване. По-скъпо на месец, но без ангажимент." },
    ],
    disclaimer: "Цените са показани в избраната валута. Търговията е свързана със значителен риск. NICS предоставя аналитични търговски сценарии и инструменти за управление на риска, а не гарантирана печалба или финансов съвет.",
  },
  de: {
    title1: "Ein Preis, alle Märkte.",
    title2: "Zwei Zahlungswege.",
    desc: "Beide Optionen bieten denselben vollen Zugang: alle Märkte, die Windows-App, das Web-Dashboard und Telegram. Der einzige Unterschied ist die Zahlungsart.",
    chips: ["Schneller Zugang über Telegram", "Keine Einrichtungsgebühr", "Entry, SL und TP1–TP4"],
    periods: { "7d": "7 Tage", "30d": "30 Tage", "90d": "3 Monate" },
    periodFor: { "7d": "für 7 Tage", "30d": "für 30 Tage", "90d": "für 3 Monate" },
    trialLabel: "Testwoche",
    choosePay: "wählen Sie die Zahlungsart.",
    starsTitle: "Mit Telegram Stars bezahlen",
    starsDesc: "Direkt in @nics_ai_bot bezahlen — vollautomatisch.",
    cardTitle: "Mit Karte über Revolut bezahlen",
    cardDescEur: "Melden Sie sich im Konto an und bezahlen Sie im sicheren Revolut-Checkout — der Zugang wird automatisch aktiviert.",
    cardDescUsd: "Abrechnung in EUR im Revolut-Checkout. Melden Sie sich im Konto an, um zu bezahlen — der Zugang wird automatisch aktiviert.",
    explain: [
      { title: "€1,99 — Testwoche", body: "Die ersten 7 Tage des Abos. Ihre Karte wird für die Verlängerung gespeichert; kündigen Sie vor Tag 7, zahlen Sie nichts weiter." },
      { title: "€19,99 / Monat — Abo", body: "Wird nach der Testwoche monatlich automatisch abgebucht. Der günstigste Monatspreis. Kündigung mit einem Klick, Zugang bis zum Ende des bezahlten Monats." },
      { title: "€9 / €29 / €69 — Einmal-Pass", body: "Eine einzige Zahlung für 7, 30 oder 90 Tage, ohne gespeicherte Karte und ohne Verlängerung. Pro Monat teurer, dafür ohne Bindung." },
    ],
    disclaimer: "Preise werden in der gewählten Währung angezeigt. Trading ist mit erheblichen Risiken verbunden. NICS liefert analytische Handelsszenarien und Risikowerkzeuge, keine garantierten Renditen oder Finanzberatung.",
  },
  es: {
    title1: "Un precio, todos los mercados.",
    title2: "Dos formas de pago.",
    desc: "Ambas opciones dan el mismo acceso completo: todos los mercados, la app para Windows, el panel web y Telegram. Solo cambia la forma de pago.",
    chips: ["Acceso rápido en Telegram", "Sin cuota de alta", "Entry, SL y TP1–TP4"],
    periods: { "7d": "7 días", "30d": "30 días", "90d": "3 meses" },
    periodFor: { "7d": "por 7 días", "30d": "por 30 días", "90d": "por 3 meses" },
    trialLabel: "semana de prueba",
    choosePay: "elige cómo pagar.",
    starsTitle: "Pagar con Telegram Stars",
    starsDesc: "Paga directamente en @nics_ai_bot — totalmente automático.",
    cardTitle: "Pagar con tarjeta vía Revolut",
    cardDescEur: "Entra en tu cuenta y paga en el checkout seguro de Revolut — el acceso se activa automáticamente.",
    cardDescUsd: "Se cobra en EUR en el checkout de Revolut. Entra en tu cuenta para pagar — el acceso se activa automáticamente.",
    explain: [
      { title: "€1,99 — semana de prueba", body: "Los primeros 7 días de la suscripción. Tu tarjeta se guarda para la renovación; cancela antes del día 7 y no pagas nada más." },
      { title: "€19,99 / mes — suscripción", body: "Se cobra automáticamente cada mes tras la prueba. El precio mensual más bajo. Cancela con un toque, el acceso sigue hasta el final del mes pagado." },
      { title: "€9 / €29 / €69 — pase único", body: "Un solo pago por 7, 30 o 90 días, sin guardar tarjeta ni renovación automática. Más caro por mes a cambio de no tener compromiso." },
    ],
    disclaimer: "Los precios se muestran en la moneda elegida. El trading implica un riesgo considerable. NICS ofrece escenarios analíticos y herramientas de riesgo, no rentabilidad garantizada ni asesoramiento financiero.",
  },
  pt: {
    title1: "Um preço, todos os mercados.",
    title2: "Duas formas de pagar.",
    desc: "As duas opções dão o mesmo acesso completo: todos os mercados, o app para Windows, o painel web e o Telegram. Só muda a forma de pagamento.",
    chips: ["Acesso rápido no Telegram", "Sem taxa de adesão", "Entry, SL e TP1–TP4"],
    periods: { "7d": "7 dias", "30d": "30 dias", "90d": "3 meses" },
    periodFor: { "7d": "por 7 dias", "30d": "por 30 dias", "90d": "por 3 meses" },
    trialLabel: "semana de teste",
    choosePay: "escolha como pagar.",
    starsTitle: "Pagar com Telegram Stars",
    starsDesc: "Pague direto no @nics_ai_bot — totalmente automático.",
    cardTitle: "Pagar com cartão via Revolut",
    cardDescEur: "Entre na sua conta e pague no checkout seguro da Revolut — o acesso é ativado automaticamente.",
    cardDescUsd: "Cobrado em EUR no checkout da Revolut. Entre na sua conta para pagar — o acesso é ativado automaticamente.",
    explain: [
      { title: "€1,99 — semana de teste", body: "Os primeiros 7 dias da assinatura. O cartão fica salvo para a renovação; cancele antes do 7º dia e não paga mais nada." },
      { title: "€19,99 / mês — assinatura", body: "Cobrada automaticamente todo mês após o teste. O menor preço mensal. Cancele com um toque, o acesso fica até o fim do mês pago." },
      { title: "€9 / €29 / €69 — passe único", body: "Um único pagamento por 7, 30 ou 90 dias, sem salvar cartão nem renovação automática. Mais caro por mês em troca de nenhum compromisso." },
    ],
    disclaimer: "Os preços são mostrados na moeda escolhida. Trading envolve risco considerável. A NICS oferece cenários analíticos e ferramentas de risco, não retorno garantido nem aconselhamento financeiro.",
  },
};

const words: Record<string, Record<string, PlanWords>> = {
  ru: {
    demo: {
      name: "Ежемесячная подписка",
      badge: "СТАРТ ЗА €1,99",
      subtitle: "€1,99 за первые 7 дней, затем €19,99 каждый месяц. Продлевается автоматически с карты, отменить можно в любой момент.",
      markets: "Золото и серебро · Форекс · Нефть Brent · Крипта · Акции США · Индексы",
      trialNote: "первые 7 дней, затем €19,99 в месяц до отмены. Ключ Pro для приложения Windows включён.",
      features: [
        "Полный доступ ко всем рынкам",
        "Ключ Pro для Windows, веб-кабинет и Telegram",
        "Сигналы по запросу в любое время",
        "Зона входа, стоп-лосс и TP1–TP4",
        "Объяснение от AI и заметки о риске",
        "Напоминание в боте и на e-mail за день до первого списания €19,99",
        "Отмена одной кнопкой в боте, доступ остаётся до конца оплаченного периода",
      ],
      cta: "Начать за €1,99",
    },
    full: {
      name: "Разовый доступ",
      badge: "БЕЗ АВТОПРОДЛЕНИЯ",
      subtitle: "Один платёж за 7, 30 или 90 дней. Карта не сохраняется, ничего не продлевается: доступ просто заканчивается.",
      markets: "Золото и серебро · Форекс · Нефть Brent · Крипта · Акции США · Индексы",
      features: [
        "Доступ ко всем рынкам",
        "Без лимита запросов, пока доступ активен",
        "Автоматическое сканирование круглосуточно",
        "Сигнал по запросу",
        "Вход, SL и TP1–TP4",
        "Объяснение от AI и анализ риска",
        "Обновления по TP, SL и безубытку",
        "Ключ Pro для Windows, веб-кабинет и Telegram",
      ],
      cta: "Купить доступ",
    },
  },
  bg: {
    demo: {
      name: "Месечен абонамент",
      badge: "СТАРТ ЗА €1,99",
      subtitle: "€1,99 за първите 7 дни, след това €19,99 всеки месец. Подновява се автоматично от картата, отказ по всяко време.",
      markets: "Злато и сребро · Форекс · Петрол Brent · Крипто · Акции от САЩ · Индекси",
      trialNote: "първите 7 дни, след това €19,99 на месец до отказ. Включен е Pro ключ за приложението за Windows.",
      features: [
        "Пълен достъп до всички пазари",
        "Pro ключ за Windows, уеб табло и Telegram",
        "Сигнали при поискване по всяко време",
        "Зона на вход, стоп загуба и TP1–TP4",
        "Обяснение от AI и бележки за риска",
        "Напомняне в бота и по e-mail ден преди първото таксуване от €19,99",
        "Отказ с един бутон в бота, достъпът остава до края на платения период",
      ],
      cta: "Започни за €1,99",
    },
    full: {
      name: "Еднократен достъп",
      badge: "БЕЗ ПОДНОВЯВАНЕ",
      subtitle: "Едно плащане за 7, 30 или 90 дни. Картата не се запазва, нищо не се подновява: достъпът просто приключва.",
      markets: "Злато и сребро · Форекс · Петрол Brent · Крипто · Акции от САЩ · Индекси",
      features: [
        "Достъп до всички пазари",
        "Без лимит на заявките, докато достъпът е активен",
        "Автоматично денонощно сканиране",
        "Сигнал при поискване",
        "Вход, SL и TP1–TP4",
        "Обяснение от AI и анализ на риска",
        "Актуализации за TP, SL и безубитък",
        "Pro ключ за Windows, уеб табло и Telegram",
      ],
      cta: "Купи достъп",
    },
  },
  de: {
    demo: {
      name: "Monatsabo",
      badge: "START FÜR €1,99",
      subtitle: "€1,99 für die ersten 7 Tage, danach €19,99 pro Monat. Verlängert sich automatisch per Karte, jederzeit kündbar.",
      markets: "Gold & Silber · Forex · Brent-Öl · Krypto · US-Aktien · Indizes",
      trialNote: "die ersten 7 Tage, danach €19,99/Monat bis zur Kündigung. Inklusive Pro-Schlüssel für die Windows-App.",
      features: [
        "Voller Zugang zu allen Märkten",
        "Pro-Schlüssel für Windows, Web-Dashboard und Telegram",
        "Signale jederzeit auf Abruf",
        "Einstiegszone, Stop Loss und TP1–TP4",
        "KI-Erklärung und Risikohinweise",
        "Erinnerung im Bot und per E-Mail einen Tag vor der ersten Abbuchung von €19,99",
        "Kündigung per Knopfdruck im Bot, Zugang bis zum Ende des bezahlten Zeitraums",
      ],
      cta: "Für €1,99 starten",
    },
    full: {
      name: "Einmal-Pass",
      badge: "OHNE VERLÄNGERUNG",
      subtitle: "Einmal zahlen für 7, 30 oder 90 Tage. Keine gespeicherte Karte, keine Verlängerung: der Zugang endet einfach.",
      markets: "Gold & Silber · Forex · Brent-Öl · Krypto · US-Aktien · Indizes",
      features: [
        "Zugang zu allen Märkten",
        "Kein Anfragelimit, solange der Zugang aktiv ist",
        "Automatische Scans rund um die Uhr",
        "Signal auf Abruf",
        "Entry, SL und TP1–TP4",
        "KI-Erklärung und Risikoanalyse",
        "TP-, SL- und Breakeven-Updates",
        "Pro-Schlüssel für Windows, Web-Dashboard und Telegram",
      ],
      cta: "Pass kaufen",
    },
  },
  es: {
    demo: {
      name: "Suscripción mensual",
      badge: "DESDE €1,99",
      subtitle: "€1,99 los primeros 7 días, luego €19,99 al mes. Se renueva automáticamente con tarjeta, cancela cuando quieras.",
      markets: "Oro y plata · Forex · Petróleo Brent · Cripto · Acciones de EE. UU. · Índices",
      trialNote: "primeros 7 días, luego €19,99/mes hasta que canceles. Incluye la clave Pro de la app para Windows.",
      features: [
        "Acceso completo a todos los mercados",
        "Clave Pro para Windows, panel web y Telegram",
        "Señales bajo pedido en cualquier momento",
        "Zona de entrada, Stop Loss y TP1–TP4",
        "Explicación de IA y notas de riesgo",
        "Aviso en el bot y por e-mail un día antes del primer cobro de €19,99",
        "Cancela con un botón en el bot, el acceso sigue hasta el final del periodo pagado",
      ],
      cta: "Empezar por €1,99",
    },
    full: {
      name: "Pase único",
      badge: "SIN RENOVACIÓN",
      subtitle: "Paga una vez por 7, 30 o 90 días. No se guarda la tarjeta y nada se renueva: el acceso simplemente termina.",
      markets: "Oro y plata · Forex · Petróleo Brent · Cripto · Acciones de EE. UU. · Índices",
      features: [
        "Acceso a todos los mercados",
        "Sin límite de solicitudes mientras el acceso esté activo",
        "Escaneos automáticos las 24 horas",
        "Señal bajo pedido",
        "Entry, SL y TP1–TP4",
        "Explicación de IA y análisis de riesgo",
        "Avisos de TP, SL y breakeven",
        "Clave Pro para Windows, panel web y Telegram",
      ],
      cta: "Comprar pase",
    },
  },
  pt: {
    demo: {
      name: "Assinatura mensal",
      badge: "A PARTIR DE €1,99",
      subtitle: "€1,99 nos primeiros 7 dias, depois €19,99 por mês. Renova automaticamente no cartão, cancele quando quiser.",
      markets: "Ouro e prata · Forex · Petróleo Brent · Cripto · Ações dos EUA · Índices",
      trialNote: "primeiros 7 dias, depois €19,99/mês até cancelar. Inclui a chave Pro do app para Windows.",
      features: [
        "Acesso completo a todos os mercados",
        "Chave Pro para Windows, painel web e Telegram",
        "Sinais sob pedido a qualquer hora",
        "Zona de entrada, Stop Loss e TP1–TP4",
        "Explicação da IA e notas de risco",
        "Lembrete no bot e por e-mail um dia antes da primeira cobrança de €19,99",
        "Cancele com um botão no bot, o acesso fica até o fim do período pago",
      ],
      cta: "Começar por €1,99",
    },
    full: {
      name: "Passe único",
      badge: "SEM RENOVAÇÃO",
      subtitle: "Pague uma vez por 7, 30 ou 90 dias. O cartão não fica salvo e nada renova: o acesso simplesmente termina.",
      markets: "Ouro e prata · Forex · Petróleo Brent · Cripto · Ações dos EUA · Índices",
      features: [
        "Acesso a todos os mercados",
        "Sem limite de pedidos enquanto o acesso estiver ativo",
        "Varreduras automáticas 24 horas",
        "Sinal sob pedido",
        "Entry, SL e TP1–TP4",
        "Explicação da IA e análise de risco",
        "Avisos de TP, SL e breakeven",
        "Chave Pro para Windows, painel web e Telegram",
      ],
      cta: "Comprar passe",
    },
  },
};

const base = (lang: string) => (lang || "en").slice(0, 2).toLowerCase();

export const plansUi = (lang: string): PlansUi => ui[base(lang)] ?? enUi;

export const localizedPlans = (lang: string): Plan[] => {
  const dict = words[base(lang)];
  if (!dict) return plans;
  return plans.map((plan) => (dict[plan.id] ? { ...plan, ...dict[plan.id] } : plan));
};
