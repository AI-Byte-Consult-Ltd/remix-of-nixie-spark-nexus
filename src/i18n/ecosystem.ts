/*
 * Texts of /nics-ecosystem ("Independent AI Platform", SEO level A,
 * Alexander's plan 2026-11-07). Phase 1 languages only (src/i18n/phasedSeo.ts).
 *
 * The lab facts must stay true to the public nics-ai-lab repository:
 * CPU-only training, Tiny Shakespeare v1 dataset, own BPE tokenizer, first
 * training run complete, no production inference service yet.
 */
import type { Phase1Lang } from "./phasedSeo";

export type EcosystemProduct = "trader" | "video" | "studio" | "forge" | "lab";

export interface EcosystemTexts {
  seoTitle: string;
  seoDescription: string;
  badge: string;
  title1: string;
  title2: string;
  subtitle: string;
  ctaProducts: string;
  ctaLab: string;
  productsTitle: string;
  productsDesc: string;
  products: { id: EcosystemProduct; title: string; status: string; desc: string; cta: string }[];
  principlesTitle: string;
  principles: { title: string; desc: string }[];
  labBadge: string;
  labTitle: string;
  labDesc: string;
  stack: { title: string; desc: string }[];
  infraTitle: string;
  infra: { title: string; desc: string }[];
  faqTitle: string;
  faq: { q: string; a: string }[];
}

const en: EcosystemTexts = {
  seoTitle: "NICS AI Ecosystem — Independent AI Platform by AI Byte Consult",
  seoDescription:
    "NICS AI Ecosystem is an independent AI platform from Bulgaria: NICS AI Trader for markets, NICS Video and NICS Studio for content, and an open lab training its own models from scratch.",
  badge: "Independent AI platform · Bulgaria",
  title1: "NICS AI",
  title2: "Ecosystem",
  subtitle:
    "One platform, several working products. Trading analysis, video editing and an open research lab, built by AI Byte Consult on its own infrastructure and shown with real numbers only.",
  ctaProducts: "See the products",
  ctaLab: "Training progress",
  productsTitle: "What runs on the platform today",
  productsDesc: "Each product has its own page with prices, limits and current status.",
  products: [
    { id: "trader", title: "NICS AI Trader", status: "Live", desc: "Autonomous AI trading platform: 24/7 market scanning, setups with Entry, Stop Loss and TP1–TP4, position sizing, public track record. Windows app, web dashboard and Telegram.", cta: "Open NICS AI Trader" },
    { id: "video", title: "NICS Video", status: "Live", desc: "Your raw clips in, a finished package out: a vertical Short, a horizontal video and covers in two languages, edited by an automatic script.", cta: "Open NICS Video" },
    { id: "studio", title: "NICS Studio", status: "In development", desc: "An editor in the browser for fine-tuning your own videos yourself.", cta: "Open NICS Studio" },
    { id: "forge", title: "Alessandro Studio", status: "Live", desc: "3D-printed products and a studio that turns a photo into a printable 3D model.", cta: "Open Alessandro Studio" },
    { id: "lab", title: "NICS AI Lab", status: "Research", desc: "Our own tokenizer and language models trained from random initialisation, documented in a public repository.", cta: "View the repository" },
  ],
  principlesTitle: "How we build",
  principles: [
    { title: "Real numbers only", desc: "If a process is not running, the page says offline. Trading results are public, losses included." },
    { title: "You stay in control", desc: "The platform analyses and prepares; decisions about your money and your content stay with you." },
    { title: "Own stack", desc: "Our own backend, our own automation and our own research models, so the products do not depend on one outside provider." },
  ],
  labBadge: "AI research lab",
  labTitle: "An independent AI stack, built in the open",
  labDesc:
    "Every component of the lab is built from the ground up: no pretrained vocabulary, no third-party model weights. It is early-stage work and we describe it as such.",
  stack: [
    { title: "Independent tokenizer", desc: "Byte-pair encoding tokenizer trained from scratch on our own corpus, no pretrained vocabulary." },
    { title: "Proprietary models", desc: "Transformer language models designed and trained in-house from random initialisation." },
    { title: "Training pipeline", desc: "Automated checkpointing, loss monitoring and structured telemetry, running today on CPU-only hardware." },
    { title: "Text generation (early)", desc: "Basic greedy and sampling generation for evaluation. A production inference service is not built yet." },
    { title: "Multilingual roadmap", desc: "English today, trained on public-domain text. Russian, Bulgarian and Spanish are planned, not yet trained." },
    { title: "Multimodal later", desc: "Vision and audio are on the roadmap, after the language model." },
  ],
  infraTitle: "Current setup",
  infra: [
    { title: "Training hardware", desc: "CPU only, no GPU: proof-of-pipeline scale" },
    { title: "Code and provenance", desc: "Public GitHub repository nics-ai-lab" },
    { title: "Checkpoint verification", desc: "SHA-256 checksums, step-0 random-init checkpoint kept" },
    { title: "Dataset", desc: "Tiny Shakespeare, public domain (v1)" },
    { title: "Status", desc: "First training run complete, vision model next" },
  ],
  faqTitle: "Questions",
  faq: [
    { q: "What is the NICS AI Ecosystem?", a: "The family of AI products built by AI Byte Consult Ltd in Bulgaria: NICS AI Trader, NICS Video, NICS Studio, Alessandro Studio and the NICS AI Lab, with one company and one account system behind them." },
    { q: "What does “independent AI platform” mean here?", a: "The products run on our own backend and automation, and the lab trains its own tokenizer and models from scratch instead of wrapping someone else's model." },
    { q: "Are the lab models used in the products today?", a: "Not yet. The lab is at an early research stage; the products use their own analysis engines and scripts. We will say so on this page when that changes." },
    { q: "Who is behind NICS?", a: "AI Byte Consult Ltd, a company registered in Bulgaria and an official Meta Tech Provider." },
  ],
};

const ru: EcosystemTexts = {
  seoTitle: "Экосистема NICS AI — независимая AI-платформа от AI Byte Consult",
  seoDescription:
    "NICS AI Ecosystem — независимая AI-платформа из Болгарии: NICS AI Trader для рынков, NICS Video и NICS Studio для контента и открытая лаборатория, которая обучает собственные модели с нуля.",
  badge: "Независимая AI-платформа · Болгария",
  title1: "Экосистема",
  title2: "NICS AI",
  subtitle:
    "Одна платформа — несколько работающих продуктов. Анализ рынков, монтаж видео и открытая исследовательская лаборатория: всё построено AI Byte Consult на собственной инфраструктуре и показано только на реальных цифрах.",
  ctaProducts: "Продукты",
  ctaLab: "Ход обучения",
  productsTitle: "Что уже работает на платформе",
  productsDesc: "У каждого продукта своя страница с ценами, ограничениями и текущим статусом.",
  products: [
    { id: "trader", title: "NICS AI Trader", status: "Работает", desc: "Автономная AI-платформа для трейдинга: круглосуточное сканирование рынков, сетапы со входом, стоп-лоссом и TP1–TP4, расчёт объёма, открытая статистика. Приложение для Windows, веб-кабинет и Telegram.", cta: "Открыть NICS AI Trader" },
    { id: "video", title: "NICS Video", status: "Работает", desc: "Загружаете исходные клипы — получаете готовый пакет: вертикальный ролик, горизонтальное видео и обложки на двух языках. Монтирует автоматический скрипт.", cta: "Открыть NICS Video" },
    { id: "studio", title: "NICS Studio", status: "В разработке", desc: "Редактор в браузере, чтобы самому доводить свои видео.", cta: "Открыть NICS Studio" },
    { id: "forge", title: "Alessandro Studio", status: "Работает", desc: "Изделия на 3D-принтере и студия, которая превращает фото в 3D-модель для печати.", cta: "Открыть Alessandro Studio" },
    { id: "lab", title: "NICS AI Lab", status: "Исследования", desc: "Собственный токенизатор и языковые модели, обученные со случайной инициализации; всё описано в открытом репозитории.", cta: "Открыть репозиторий" },
  ],
  principlesTitle: "Как мы строим",
  principles: [
    { title: "Только реальные цифры", desc: "Если процесс не идёт, страница пишет «offline». Результаты трейдинга открыты, включая убытки." },
    { title: "Решаете вы", desc: "Платформа анализирует и готовит, а решения о ваших деньгах и вашем контенте остаются за вами." },
    { title: "Свой стек", desc: "Свой бэкенд, своя автоматизация и свои исследовательские модели — продукты не зависят от одного внешнего поставщика." },
  ],
  labBadge: "Исследовательская лаборатория",
  labTitle: "Независимый AI-стек, который строится открыто",
  labDesc:
    "Каждый компонент лаборатории сделан с нуля: без готового словаря и без чужих весов моделей. Это ранняя стадия, и мы так её и называем.",
  stack: [
    { title: "Собственный токенизатор", desc: "BPE-токенизатор, обученный с нуля на нашем корпусе, без готового словаря." },
    { title: "Собственные модели", desc: "Трансформерные языковые модели, спроектированные и обученные у нас со случайной инициализации." },
    { title: "Конвейер обучения", desc: "Автоматические чекпоинты, мониторинг loss и структурированная телеметрия; сейчас обучение идёт только на CPU." },
    { title: "Генерация текста (ранняя)", desc: "Простая жадная генерация и сэмплирование для оценки модели. Боевого сервиса пока нет." },
    { title: "Языки", desc: "Сейчас английский, на текстах из общественного достояния. Русский, болгарский и испанский запланированы, но ещё не обучены." },
    { title: "Мультимодальность позже", desc: "Зрение и звук — в планах, после языковой модели." },
  ],
  infraTitle: "Текущая установка",
  infra: [
    { title: "Железо для обучения", desc: "Только CPU, без GPU: масштаб проверки конвейера" },
    { title: "Код и происхождение", desc: "Открытый репозиторий nics-ai-lab на GitHub" },
    { title: "Проверка чекпоинтов", desc: "Контрольные суммы SHA-256, сохранён чекпоинт шага 0" },
    { title: "Датасет", desc: "Tiny Shakespeare, общественное достояние (v1)" },
    { title: "Статус", desc: "Первый прогон обучения завершён, следующая — модель зрения" },
  ],
  faqTitle: "Вопросы",
  faq: [
    { q: "Что такое экосистема NICS AI?", a: "Семейство AI-продуктов AI Byte Consult Ltd из Болгарии: NICS AI Trader, NICS Video, NICS Studio, Alessandro Studio и NICS AI Lab — одна компания и одна система аккаунтов." },
    { q: "Что значит «независимая AI-платформа»?", a: "Продукты работают на нашем собственном бэкенде и автоматизации, а лаборатория обучает свой токенизатор и модели с нуля, а не оборачивает чужую модель." },
    { q: "Модели лаборатории уже используются в продуктах?", a: "Пока нет. Лаборатория на ранней стадии; продукты работают на своих аналитических движках и скриптах. Когда это изменится, мы напишем об этом здесь." },
    { q: "Кто стоит за NICS?", a: "AI Byte Consult Ltd — компания, зарегистрированная в Болгарии, официальный Meta Tech Provider." },
  ],
};

const bg: EcosystemTexts = {
  seoTitle: "Екосистема NICS AI — независима AI платформа от AI Byte Consult",
  seoDescription:
    "NICS AI Ecosystem е независима AI платформа от България: NICS AI Trader за пазарите, NICS Video и NICS Studio за съдържание и отворена лаборатория, която обучава собствени модели от нулата.",
  badge: "Независима AI платформа · България",
  title1: "Екосистема",
  title2: "NICS AI",
  subtitle:
    "Една платформа, няколко работещи продукта. Анализ на пазарите, видео монтаж и отворена изследователска лаборатория, изградени от AI Byte Consult на собствена инфраструктура и показани само с реални числа.",
  ctaProducts: "Продуктите",
  ctaLab: "Напредък на обучението",
  productsTitle: "Какво работи на платформата днес",
  productsDesc: "Всеки продукт има своя страница с цени, ограничения и текущо състояние.",
  products: [
    { id: "trader", title: "NICS AI Trader", status: "Работи", desc: "Автономна AI платформа за трейдинг: денонощно сканиране на пазарите, сетъпи с вход, стоп загуба и TP1–TP4, размер на позицията, публична статистика. Приложение за Windows, уеб табло и Telegram.", cta: "Към NICS AI Trader" },
    { id: "video", title: "NICS Video", status: "Работи", desc: "Качвате суровите си клипове и получавате готов пакет: вертикално видео, хоризонтално видео и корици на два езика. Монтажът се прави от автоматичен скрипт.", cta: "Към NICS Video" },
    { id: "studio", title: "NICS Studio", status: "В разработка", desc: "Редактор в браузъра, за да довършвате сами своите видеа.", cta: "Към NICS Studio" },
    { id: "forge", title: "Alessandro Studio", status: "Работи", desc: "Изделия, отпечатани на 3D принтер, и студио, което превръща снимка в 3D модел за печат.", cta: "Към Alessandro Studio" },
    { id: "lab", title: "NICS AI Lab", status: "Изследвания", desc: "Собствен токенизатор и езикови модели, обучени от случайна инициализация и документирани в публично хранилище.", cta: "Към хранилището" },
  ],
  principlesTitle: "Как изграждаме",
  principles: [
    { title: "Само реални числа", desc: "Ако процес не работи, страницата казва offline. Резултатите от трейдинга са публични, включително загубите." },
    { title: "Вие решавате", desc: "Платформата анализира и подготвя; решенията за парите и съдържанието ви остават при вас." },
    { title: "Собствен стек", desc: "Собствен бекенд, собствена автоматизация и собствени изследователски модели, така че продуктите не зависят от един външен доставчик." },
  ],
  labBadge: "Изследователска лаборатория",
  labTitle: "Независим AI стек, изграждан открито",
  labDesc:
    "Всеки компонент на лабораторията е създаден от нулата: без готов речник и без чужди тегла на модели. Това е ранен етап и така го и описваме.",
  stack: [
    { title: "Собствен токенизатор", desc: "BPE токенизатор, обучен от нулата върху наш корпус, без готов речник." },
    { title: "Собствени модели", desc: "Трансформърни езикови модели, проектирани и обучени при нас от случайна инициализация." },
    { title: "Процес на обучение", desc: "Автоматични чекпойнти, наблюдение на загубата и структурирана телеметрия; днес обучението върви само на CPU." },
    { title: "Генериране на текст (ранно)", desc: "Базово генериране за оценка на модела. Продукционна услуга още няма." },
    { title: "Езици", desc: "Днес английски, върху текстове в публичното пространство. Руски, български и испански са планирани, още не са обучени." },
    { title: "Мултимодалност по-късно", desc: "Зрение и звук са в плана, след езиковия модел." },
  ],
  infraTitle: "Текуща конфигурация",
  infra: [
    { title: "Хардуер за обучение", desc: "Само CPU, без GPU: мащаб за проверка на процеса" },
    { title: "Код и произход", desc: "Публично GitHub хранилище nics-ai-lab" },
    { title: "Проверка на чекпойнтите", desc: "SHA-256 контролни суми, запазен чекпойнт на стъпка 0" },
    { title: "Набор от данни", desc: "Tiny Shakespeare, публично достояние (v1)" },
    { title: "Състояние", desc: "Първото обучение е завършено, следва модел за зрение" },
  ],
  faqTitle: "Въпроси",
  faq: [
    { q: "Какво е екосистемата NICS AI?", a: "Семейството AI продукти на AI Byte Consult Ltd от България: NICS AI Trader, NICS Video, NICS Studio, Alessandro Studio и NICS AI Lab — една компания и една система за акаунти." },
    { q: "Какво означава „независима AI платформа“?", a: "Продуктите работят на собствен бекенд и автоматизация, а лабораторията обучава свой токенизатор и модели от нулата, вместо да опакова чужд модел." },
    { q: "Използват ли се моделите на лабораторията в продуктите?", a: "Още не. Лабораторията е на ранен етап; продуктите използват собствени аналитични системи и скриптове. Когато това се промени, ще го напишем тук." },
    { q: "Кой стои зад NICS?", a: "AI Byte Consult Ltd — компания, регистрирана в България, официален Meta Tech Provider." },
  ],
};

const de: EcosystemTexts = {
  seoTitle: "NICS AI Ecosystem — unabhängige KI-Plattform von AI Byte Consult",
  seoDescription:
    "NICS AI Ecosystem ist eine unabhängige KI-Plattform aus Bulgarien: NICS AI Trader für die Märkte, NICS Video und NICS Studio für Inhalte und ein offenes Labor, das eigene Modelle von Grund auf trainiert.",
  badge: "Unabhängige KI-Plattform · Bulgarien",
  title1: "NICS AI",
  title2: "Ecosystem",
  subtitle:
    "Eine Plattform, mehrere laufende Produkte. Marktanalyse, Videoschnitt und ein offenes Forschungslabor, gebaut von AI Byte Consult auf eigener Infrastruktur und nur mit echten Zahlen gezeigt.",
  ctaProducts: "Zu den Produkten",
  ctaLab: "Trainingsfortschritt",
  productsTitle: "Was heute auf der Plattform läuft",
  productsDesc: "Jedes Produkt hat eine eigene Seite mit Preisen, Grenzen und aktuellem Status.",
  products: [
    { id: "trader", title: "NICS AI Trader", status: "Live", desc: "Autonome KI-Trading-Plattform: Marktscan rund um die Uhr, Setups mit Einstieg, Stop-Loss und TP1–TP4, Positionsgröße, öffentliche Statistik. Windows-App, Web-Dashboard und Telegram.", cta: "Zu NICS AI Trader" },
    { id: "video", title: "NICS Video", status: "Live", desc: "Ihre Rohclips hinein, ein fertiges Paket heraus: ein vertikales Short, ein horizontales Video und Cover in zwei Sprachen, geschnitten von einem automatischen Skript.", cta: "Zu NICS Video" },
    { id: "studio", title: "NICS Studio", status: "In Entwicklung", desc: "Ein Editor im Browser, um eigene Videos selbst nachzubearbeiten.", cta: "Zu NICS Studio" },
    { id: "forge", title: "Alessandro Studio", status: "Live", desc: "3D-gedruckte Produkte und ein Studio, das ein Foto in ein druckbares 3D-Modell verwandelt.", cta: "Zu Alessandro Studio" },
    { id: "lab", title: "NICS AI Lab", status: "Forschung", desc: "Eigener Tokenizer und eigene Sprachmodelle, trainiert ab zufälliger Initialisierung und in einem öffentlichen Repository dokumentiert.", cta: "Zum Repository" },
  ],
  principlesTitle: "Wie wir bauen",
  principles: [
    { title: "Nur echte Zahlen", desc: "Läuft ein Prozess nicht, steht auf der Seite „offline“. Trading-Ergebnisse sind öffentlich, Verluste eingeschlossen." },
    { title: "Sie behalten die Kontrolle", desc: "Die Plattform analysiert und bereitet vor; Entscheidungen über Ihr Geld und Ihre Inhalte treffen Sie." },
    { title: "Eigener Stack", desc: "Eigenes Backend, eigene Automatisierung und eigene Forschungsmodelle, damit die Produkte nicht von einem einzigen externen Anbieter abhängen." },
  ],
  labBadge: "KI-Forschungslabor",
  labTitle: "Ein unabhängiger KI-Stack, offen entwickelt",
  labDesc:
    "Jede Komponente des Labors ist von Grund auf gebaut: kein vortrainiertes Vokabular, keine fremden Modellgewichte. Es ist ein frühes Stadium, und so beschreiben wir es auch.",
  stack: [
    { title: "Eigener Tokenizer", desc: "BPE-Tokenizer, von Grund auf auf unserem eigenen Korpus trainiert, ohne vortrainiertes Vokabular." },
    { title: "Eigene Modelle", desc: "Transformer-Sprachmodelle, intern entworfen und ab zufälliger Initialisierung trainiert." },
    { title: "Trainings-Pipeline", desc: "Automatische Checkpoints, Loss-Überwachung und strukturierte Telemetrie, derzeit nur auf CPU-Hardware." },
    { title: "Textgenerierung (früh)", desc: "Einfache Generierung zur Bewertung des Modells. Ein Produktivdienst existiert noch nicht." },
    { title: "Sprachen", desc: "Heute Englisch, trainiert auf gemeinfreien Texten. Russisch, Bulgarisch und Spanisch sind geplant, aber noch nicht trainiert." },
    { title: "Multimodal später", desc: "Bild und Audio stehen auf der Roadmap, nach dem Sprachmodell." },
  ],
  infraTitle: "Aktueller Aufbau",
  infra: [
    { title: "Trainings-Hardware", desc: "Nur CPU, keine GPU: Maßstab zum Nachweis der Pipeline" },
    { title: "Code und Herkunft", desc: "Öffentliches GitHub-Repository nics-ai-lab" },
    { title: "Checkpoint-Prüfung", desc: "SHA-256-Prüfsummen, Checkpoint von Schritt 0 aufbewahrt" },
    { title: "Datensatz", desc: "Tiny Shakespeare, gemeinfrei (v1)" },
    { title: "Status", desc: "Erster Trainingslauf abgeschlossen, als Nächstes ein Bildmodell" },
  ],
  faqTitle: "Fragen",
  faq: [
    { q: "Was ist das NICS AI Ecosystem?", a: "Die KI-Produktfamilie der AI Byte Consult Ltd aus Bulgarien: NICS AI Trader, NICS Video, NICS Studio, Alessandro Studio und das NICS AI Lab, mit einem Unternehmen und einem Kontosystem dahinter." },
    { q: "Was bedeutet hier „unabhängige KI-Plattform“?", a: "Die Produkte laufen auf unserem eigenen Backend und unserer eigenen Automatisierung, und das Labor trainiert eigenen Tokenizer und eigene Modelle von Grund auf, statt ein fremdes Modell zu verpacken." },
    { q: "Werden die Labormodelle schon in den Produkten genutzt?", a: "Noch nicht. Das Labor ist in einem frühen Forschungsstadium; die Produkte nutzen eigene Analyse-Engines und Skripte. Ändert sich das, steht es hier." },
    { q: "Wer steht hinter NICS?", a: "AI Byte Consult Ltd, ein in Bulgarien registriertes Unternehmen und offizieller Meta Tech Provider." },
  ],
};

const es: EcosystemTexts = {
  seoTitle: "Ecosistema NICS AI — plataforma de IA independiente de AI Byte Consult",
  seoDescription:
    "NICS AI Ecosystem es una plataforma de IA independiente de Bulgaria: NICS AI Trader para los mercados, NICS Video y NICS Studio para contenido y un laboratorio abierto que entrena sus propios modelos desde cero.",
  badge: "Plataforma de IA independiente · Bulgaria",
  title1: "Ecosistema",
  title2: "NICS AI",
  subtitle:
    "Una plataforma, varios productos en funcionamiento. Análisis de mercados, edición de vídeo y un laboratorio de investigación abierto, construidos por AI Byte Consult sobre infraestructura propia y mostrados solo con cifras reales.",
  ctaProducts: "Ver los productos",
  ctaLab: "Progreso del entrenamiento",
  productsTitle: "Qué funciona hoy en la plataforma",
  productsDesc: "Cada producto tiene su propia página con precios, límites y estado actual.",
  products: [
    { id: "trader", title: "NICS AI Trader", status: "Activo", desc: "Plataforma autónoma de trading con IA: análisis de mercados 24/7, setups con entrada, stop loss y TP1–TP4, tamaño de posición e historial público. App para Windows, panel web y Telegram.", cta: "Ir a NICS AI Trader" },
    { id: "video", title: "NICS Video", status: "Activo", desc: "Subes tus clips en bruto y recibes un paquete terminado: un vídeo vertical, uno horizontal y portadas en dos idiomas, montados por un script automático.", cta: "Ir a NICS Video" },
    { id: "studio", title: "NICS Studio", status: "En desarrollo", desc: "Un editor en el navegador para ajustar tú mismo tus vídeos.", cta: "Ir a NICS Studio" },
    { id: "forge", title: "Alessandro Studio", status: "Activo", desc: "Productos impresos en 3D y un estudio que convierte una foto en un modelo 3D imprimible.", cta: "Ir a Alessandro Studio" },
    { id: "lab", title: "NICS AI Lab", status: "Investigación", desc: "Tokenizador y modelos de lenguaje propios, entrenados desde inicialización aleatoria y documentados en un repositorio público.", cta: "Ver el repositorio" },
  ],
  principlesTitle: "Cómo construimos",
  principles: [
    { title: "Solo cifras reales", desc: "Si un proceso no está activo, la página dice offline. Los resultados de trading son públicos, pérdidas incluidas." },
    { title: "Tú decides", desc: "La plataforma analiza y prepara; las decisiones sobre tu dinero y tu contenido son tuyas." },
    { title: "Stack propio", desc: "Backend propio, automatización propia y modelos de investigación propios, para no depender de un único proveedor externo." },
  ],
  labBadge: "Laboratorio de investigación de IA",
  labTitle: "Un stack de IA independiente, construido en abierto",
  labDesc:
    "Cada componente del laboratorio está hecho desde cero: sin vocabulario preentrenado ni pesos de modelos ajenos. Es una etapa temprana y así lo contamos.",
  stack: [
    { title: "Tokenizador propio", desc: "Tokenizador BPE entrenado desde cero con nuestro propio corpus, sin vocabulario preentrenado." },
    { title: "Modelos propios", desc: "Modelos de lenguaje Transformer diseñados y entrenados internamente desde inicialización aleatoria." },
    { title: "Pipeline de entrenamiento", desc: "Checkpoints automáticos, seguimiento de la pérdida y telemetría estructurada; hoy funciona solo con CPU." },
    { title: "Generación de texto (temprana)", desc: "Generación básica para evaluar el modelo. Aún no existe un servicio en producción." },
    { title: "Idiomas", desc: "Hoy inglés, con textos de dominio público. Ruso, búlgaro y español están previstos, aún sin entrenar." },
    { title: "Multimodal más adelante", desc: "Visión y audio están en la hoja de ruta, después del modelo de lenguaje." },
  ],
  infraTitle: "Configuración actual",
  infra: [
    { title: "Hardware de entrenamiento", desc: "Solo CPU, sin GPU: escala de prueba del pipeline" },
    { title: "Código y procedencia", desc: "Repositorio público nics-ai-lab en GitHub" },
    { title: "Verificación de checkpoints", desc: "Sumas SHA-256, checkpoint del paso 0 conservado" },
    { title: "Dataset", desc: "Tiny Shakespeare, dominio público (v1)" },
    { title: "Estado", desc: "Primer entrenamiento completado, el siguiente es un modelo de visión" },
  ],
  faqTitle: "Preguntas",
  faq: [
    { q: "¿Qué es el ecosistema NICS AI?", a: "La familia de productos de IA de AI Byte Consult Ltd, con sede en Bulgaria: NICS AI Trader, NICS Video, NICS Studio, Alessandro Studio y NICS AI Lab, con una sola empresa y un solo sistema de cuentas." },
    { q: "¿Qué significa aquí «plataforma de IA independiente»?", a: "Los productos funcionan con nuestro propio backend y automatización, y el laboratorio entrena su propio tokenizador y sus modelos desde cero en lugar de envolver un modelo ajeno." },
    { q: "¿Los modelos del laboratorio ya se usan en los productos?", a: "Todavía no. El laboratorio está en una fase temprana; los productos usan sus propios motores de análisis y scripts. Cuando eso cambie, lo diremos aquí." },
    { q: "¿Quién está detrás de NICS?", a: "AI Byte Consult Ltd, empresa registrada en Bulgaria y Meta Tech Provider oficial." },
  ],
};

export const ecosystemTexts: Record<Phase1Lang, EcosystemTexts> = { en, ru, bg, de, es };
