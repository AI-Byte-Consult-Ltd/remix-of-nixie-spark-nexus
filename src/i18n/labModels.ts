/*
 * Homepage block "NICS AI Lab: our own models" (Alexander, 2026-11-18).
 * Shown right under the hero so a visitor sees first that we train our own
 * models from scratch.
 *
 * Facts must stay true to the nics-ai-lab repository (v0.2.0):
 * - NICS Language: Transformer + own BPE tokenizer, trained on Project Gutenberg
 *   (Alexander, 2026-11-18: earlier work, before the nics-ai-lab repo).
 * - NICS Vision: trained on Earth and NASA space imagery (same source).
 * - NICS Trading: in development and training (Alexander, 2026-11-21: nightly
 *   self-learning on our candles, signals and outcomes runs since 2026-11-19).
 * Names (Alexander 2026-11-18): NICS Language, NICS Vision, NICS Trading.
 * Status words follow implemented / prototype / experiment / plan.
 * All 12 site languages (fr, it, pl, pt, tr, zh, ar added 2026-11-22,
 * Alexander chose to translate them instead of hiding them from search).
 */
import { phasedLang } from "./phasedSeo";
import type { Phase1Lang } from "./phasedSeo";

export type LabModelId = "text" | "vision" | "trading";

export interface LabModel {
  id: LabModelId;
  name: string;
  status: string;
  stage: "trained" | "building";
  desc: string;
  facts: string[];
}

export interface LabModelsTexts {
  badge: string;
  title1: string;
  title2: string;
  desc: string;
  models: LabModel[];
  note: string;
  ctaLab: string;
  ctaRepo: string;
}

const TEXTS: Record<Phase1Lang | "fr" | "it" | "pl" | "pt" | "tr" | "zh" | "ar", LabModelsTexts> = {
  en: {
    badge: "NICS AI Lab",
    title1: "Three models of our own,",
    title2: "trained from scratch",
    desc: "No borrowed weights and no wrapper around someone else's model. Every model starts from random initialisation and learns on data we chose. It is early-stage work, and we say so.",
    models: [
      {
        id: "trading",
        name: "NICS Trading",
        status: "In development",
        stage: "building",
        desc: "Our trading model, learning from our own market data: candles from all timeframes, the scanner's setups and how each trade really ended.",
        facts: ["Data: our candles, setups and outcomes", "In training", "Goal: run our market analysis on our own model"],
      },
      {
        id: "text",
        name: "NICS Language",
        status: "Experiment",
        stage: "trained",
        desc: "A Transformer language model with our own tokenizer, trained from random weights on the Project Gutenberg corpus.",
        facts: ["Project Gutenberg corpus", "Own BPE tokenizer", "Trained from random weights"],
      },
      {
        id: "vision",
        name: "NICS Vision",
        status: "Experiment",
        stage: "trained",
        desc: "An image model trained from random weights on Earth and NASA space imagery.",
        facts: ["Earth and NASA space imagery", "Minerals and materials recognition", "Trained from random weights"],
      },
    ],
    note: "A model's status changes only after a real training run.",
    ctaLab: "How the lab works",
    ctaRepo: "Lab repository",
  },
  ru: {
    badge: "NICS AI Lab",
    title1: "Три собственные модели,",
    title2: "обученные с нуля",
    desc: "Без чужих весов и без обёртки над чужой моделью. Каждая модель начинается со случайной инициализации и учится на данных, которые выбрали мы. Это ранняя стадия, и мы так её и называем.",
    models: [
      {
        id: "trading",
        name: "NICS Trading",
        status: "В разработке",
        stage: "building",
        desc: "Наша торговая модель. Она учится на наших рыночных данных: свечи всех таймфреймов, сетапы сканера и реальные итоги каждой сделки.",
        facts: ["Данные: наши свечи, сетапы и итоги", "Обучается", "Цель: анализ рынка на собственной модели"],
      },
      {
        id: "text",
        name: "NICS Language",
        status: "Эксперимент",
        stage: "trained",
        desc: "Языковая модель-трансформер с собственным токенизатором, обученная со случайных весов на корпусе Project Gutenberg.",
        facts: ["Корпус Project Gutenberg", "Свой BPE-токенизатор", "Обучена со случайных весов"],
      },
      {
        id: "vision",
        name: "NICS Vision",
        status: "Эксперимент",
        stage: "trained",
        desc: "Модель зрения, обученная со случайных весов на снимках Земли и космоса NASA.",
        facts: ["Снимки Земли и космоса NASA", "Распознавание минералов и материалов", "Обучена со случайных весов"],
      },
    ],
    note: "Статус модели меняется только после реального запуска обучения.",
    ctaLab: "Как устроена лаборатория",
    ctaRepo: "Репозиторий лаборатории",
  },
  bg: {
    badge: "NICS AI Lab",
    title1: "Три собствени модела,",
    title2: "обучени от нулата",
    desc: "Без чужди тегла и без обвивка около чужд модел. Всеки модел започва от случайна инициализация и се учи на данни, които сме избрали ние. Това е ранен етап и така го наричаме.",
    models: [
      {
        id: "trading",
        name: "NICS Trading",
        status: "В разработка",
        stage: "building",
        desc: "Нашият търговски модел. Учи се от нашите пазарни данни: свещи от всички таймфрейми, сетъпите на скенера и реалния резултат от всяка сделка.",
        facts: ["Данни: нашите свещи, сетъпи и резултати", "Обучава се", "Цел: пазарен анализ със собствен модел"],
      },
      {
        id: "text",
        name: "NICS Language",
        status: "Експеримент",
        stage: "trained",
        desc: "Езиков модел трансформър със собствен токенизатор, обучен от случайни тегла върху корпуса Project Gutenberg.",
        facts: ["Корпус Project Gutenberg", "Собствен BPE токенизатор", "Обучен от случайни тегла"],
      },
      {
        id: "vision",
        name: "NICS Vision",
        status: "Експеримент",
        stage: "trained",
        desc: "Модел за зрение, обучен от случайни тегла върху изображения на Земята и космоса от НАСА.",
        facts: ["Изображения на Земята и космоса от НАСА", "Разпознаване на минерали и материали", "Обучен от случайни тегла"],
      },
    ],
    note: "Статусът на модела се сменя само след реално обучение.",
    ctaLab: "Как работи лабораторията",
    ctaRepo: "Хранилище на лабораторията",
  },
  de: {
    badge: "NICS AI Lab",
    title1: "Drei eigene Modelle,",
    title2: "von Grund auf trainiert",
    desc: "Keine fremden Gewichte und keine Hülle um ein fremdes Modell. Jedes Modell startet bei zufälliger Initialisierung und lernt auf Daten, die wir ausgewählt haben. Es ist ein frühes Stadium, und so nennen wir es auch.",
    models: [
      {
        id: "trading",
        name: "NICS Trading",
        status: "In Entwicklung",
        stage: "building",
        desc: "Unser Trading-Modell. Es lernt aus unseren eigenen Marktdaten: Kerzen aller Zeitrahmen, die Setups des Scanners und das tatsächliche Ergebnis jedes Trades.",
        facts: ["Daten: unsere Kerzen, Setups und Ergebnisse", "Wird trainiert", "Ziel: Marktanalyse mit eigenem Modell"],
      },
      {
        id: "text",
        name: "NICS Language",
        status: "Experiment",
        stage: "trained",
        desc: "Ein Transformer-Sprachmodell mit eigenem Tokenizer, ab zufälligen Gewichten trainiert auf dem Project-Gutenberg-Korpus.",
        facts: ["Project-Gutenberg-Korpus", "Eigener BPE-Tokenizer", "Ab zufälligen Gewichten trainiert"],
      },
      {
        id: "vision",
        name: "NICS Vision",
        status: "Experiment",
        stage: "trained",
        desc: "Ein Bildmodell, ab zufälligen Gewichten trainiert auf Erd- und NASA-Weltraumbildern.",
        facts: ["Erd- und NASA-Weltraumbilder", "Erkennung von Mineralien und Materialien", "Ab zufälligen Gewichten trainiert"],
      },
    ],
    note: "Der Status eines Modells ändert sich erst nach einem echten Trainingslauf.",
    ctaLab: "So arbeitet das Labor",
    ctaRepo: "Repository des Labors",
  },
  es: {
    badge: "NICS AI Lab",
    title1: "Tres modelos propios,",
    title2: "entrenados desde cero",
    desc: "Sin pesos ajenos y sin envolver el modelo de otro. Cada modelo parte de una inicialización aleatoria y aprende con datos que elegimos nosotros. Es una etapa temprana y así lo decimos.",
    models: [
      {
        id: "trading",
        name: "NICS Trading",
        status: "En desarrollo",
        stage: "building",
        desc: "Nuestro modelo de trading. Aprende de nuestros propios datos de mercado: velas de todas las temporalidades, los setups del escáner y el resultado real de cada operación.",
        facts: ["Datos: nuestras velas, setups y resultados", "En entrenamiento", "Objetivo: análisis de mercado con modelo propio"],
      },
      {
        id: "text",
        name: "NICS Language",
        status: "Experimento",
        stage: "trained",
        desc: "Un modelo de lenguaje Transformer con tokenizador propio, entrenado desde pesos aleatorios con el corpus de Project Gutenberg.",
        facts: ["Corpus de Project Gutenberg", "Tokenizador BPE propio", "Entrenado desde pesos aleatorios"],
      },
      {
        id: "vision",
        name: "NICS Vision",
        status: "Experimento",
        stage: "trained",
        desc: "Un modelo de visión entrenado desde pesos aleatorios con imágenes de la Tierra y del espacio de la NASA.",
        facts: ["Imágenes de la Tierra y de la NASA", "Reconocimiento de minerales y materiales", "Entrenado desde pesos aleatorios"],
      },
    ],
    note: "El estado de un modelo cambia solo tras un entrenamiento real.",
    ctaLab: "Cómo funciona el laboratorio",
    ctaRepo: "Repositorio del laboratorio",
  },  fr: {
    badge: "NICS AI Lab",
    title1: "Trois modèles à nous,",
    title2: "entraînés de zéro",
    desc: "Aucun poids emprunté, aucune surcouche sur le modèle de quelqu'un d'autre. Chaque modèle part d'une initialisation aléatoire et apprend sur des données que nous avons choisies. C'est un travail à un stade précoce, et nous le disons.",
    models: [
      {
        id: "trading",
        name: "NICS Trading",
        status: "En développement",
        stage: "building",
        desc: "Notre modèle de trading, qui apprend sur nos propres données de marché : bougies de toutes les unités de temps, setups du scanner et issue réelle de chaque trade.",
        facts: ["Données : nos bougies, setups et résultats", "En entraînement", "Objectif : analyser le marché avec notre propre modèle"],
      },
      {
        id: "text",
        name: "NICS Language",
        status: "Expérience",
        stage: "trained",
        desc: "Un modèle de langage Transformer avec notre propre tokenizer, entraîné à partir de poids aléatoires sur le corpus du Project Gutenberg.",
        facts: ["Corpus du Project Gutenberg", "Tokenizer BPE maison", "Entraîné à partir de poids aléatoires"],
      },
      {
        id: "vision",
        name: "NICS Vision",
        status: "Expérience",
        stage: "trained",
        desc: "Un modèle d'images entraîné à partir de poids aléatoires sur des images de la Terre et de l'espace de la NASA.",
        facts: ["Images de la Terre et de la NASA", "Reconnaissance de minéraux et de matériaux", "Entraîné à partir de poids aléatoires"],
      },
    ],
    note: "Le statut d'un modèle ne change qu'après un véritable entraînement.",
    ctaLab: "Comment fonctionne le labo",
    ctaRepo: "Dépôt du labo",
  },
  it: {
    badge: "NICS AI Lab",
    title1: "Tre modelli nostri,",
    title2: "addestrati da zero",
    desc: "Nessun peso preso in prestito e nessun involucro attorno al modello di qualcun altro. Ogni modello parte da un'inizializzazione casuale e impara su dati scelti da noi. È un lavoro in fase iniziale, e lo diciamo chiaramente.",
    models: [
      {
        id: "trading",
        name: "NICS Trading",
        status: "In sviluppo",
        stage: "building",
        desc: "Il nostro modello di trading, che impara dai nostri dati di mercato: candele di tutti i timeframe, i setup dello scanner e il vero esito di ogni operazione.",
        facts: ["Dati: le nostre candele, setup e risultati", "In addestramento", "Obiettivo: analisi di mercato con un modello nostro"],
      },
      {
        id: "text",
        name: "NICS Language",
        status: "Esperimento",
        stage: "trained",
        desc: "Un modello linguistico Transformer con un tokenizer nostro, addestrato da pesi casuali sul corpus del Project Gutenberg.",
        facts: ["Corpus del Project Gutenberg", "Tokenizer BPE proprietario", "Addestrato da pesi casuali"],
      },
      {
        id: "vision",
        name: "NICS Vision",
        status: "Esperimento",
        stage: "trained",
        desc: "Un modello di immagini addestrato da pesi casuali su immagini della Terra e dello spazio della NASA.",
        facts: ["Immagini della Terra e della NASA", "Riconoscimento di minerali e materiali", "Addestrato da pesi casuali"],
      },
    ],
    note: "Lo stato di un modello cambia solo dopo un vero ciclo di addestramento.",
    ctaLab: "Come funziona il laboratorio",
    ctaRepo: "Repository del laboratorio",
  },
  pl: {
    badge: "NICS AI Lab",
    title1: "Trzy własne modele,",
    title2: "trenowane od zera",
    desc: "Żadnych pożyczonych wag i żadnej nakładki na cudzy model. Każdy model startuje z losowej inicjalizacji i uczy się na danych, które sami wybraliśmy. To wczesny etap prac i mówimy o tym otwarcie.",
    models: [
      {
        id: "trading",
        name: "NICS Trading",
        status: "W rozwoju",
        stage: "building",
        desc: "Nasz model tradingowy, który uczy się na naszych własnych danych rynkowych: świecach ze wszystkich interwałów, setupach skanera i rzeczywistym wyniku każdej transakcji.",
        facts: ["Dane: nasze świece, setupy i wyniki", "W trakcie treningu", "Cel: analiza rynku na własnym modelu"],
      },
      {
        id: "text",
        name: "NICS Language",
        status: "Eksperyment",
        stage: "trained",
        desc: "Model językowy typu Transformer z własnym tokenizerem, trenowany od losowych wag na korpusie Project Gutenberg.",
        facts: ["Korpus Project Gutenberg", "Własny tokenizer BPE", "Trenowany od losowych wag"],
      },
      {
        id: "vision",
        name: "NICS Vision",
        status: "Eksperyment",
        stage: "trained",
        desc: "Model obrazu trenowany od losowych wag na zdjęciach Ziemi i kosmosu z NASA.",
        facts: ["Zdjęcia Ziemi i kosmosu z NASA", "Rozpoznawanie minerałów i materiałów", "Trenowany od losowych wag"],
      },
    ],
    note: "Status modelu zmienia się dopiero po prawdziwym treningu.",
    ctaLab: "Jak działa laboratorium",
    ctaRepo: "Repozytorium laboratorium",
  },
  pt: {
    badge: "NICS AI Lab",
    title1: "Três modelos próprios,",
    title2: "treinados do zero",
    desc: "Sem pesos emprestados e sem embrulhar o modelo de outra empresa. Cada modelo começa de uma inicialização aleatória e aprende com dados escolhidos por nós. É um trabalho em fase inicial, e dizemos isso abertamente.",
    models: [
      {
        id: "trading",
        name: "NICS Trading",
        status: "Em desenvolvimento",
        stage: "building",
        desc: "Nosso modelo de trading, que aprende com nossos próprios dados de mercado: candles de todos os timeframes, os setups do scanner e o resultado real de cada operação.",
        facts: ["Dados: nossos candles, setups e resultados", "Em treinamento", "Objetivo: análise de mercado com modelo próprio"],
      },
      {
        id: "text",
        name: "NICS Language",
        status: "Experimento",
        stage: "trained",
        desc: "Um modelo de linguagem Transformer com tokenizador próprio, treinado a partir de pesos aleatórios no corpus do Project Gutenberg.",
        facts: ["Corpus do Project Gutenberg", "Tokenizador BPE próprio", "Treinado a partir de pesos aleatórios"],
      },
      {
        id: "vision",
        name: "NICS Vision",
        status: "Experimento",
        stage: "trained",
        desc: "Um modelo de imagem treinado a partir de pesos aleatórios com imagens da Terra e do espaço da NASA.",
        facts: ["Imagens da Terra e da NASA", "Reconhecimento de minerais e materiais", "Treinado a partir de pesos aleatórios"],
      },
    ],
    note: "O status de um modelo só muda depois de um treinamento real.",
    ctaLab: "Como o laboratório funciona",
    ctaRepo: "Repositório do laboratório",
  },
  tr: {
    badge: "NICS AI Lab",
    title1: "Kendi üç modelimiz,",
    title2: "sıfırdan eğitildi",
    desc: "Ödünç alınmış ağırlık yok, başkasının modelinin üzerine giydirilmiş bir arayüz de yok. Her model rastgele başlatmayla başlar ve bizim seçtiğimiz verilerle öğrenir. Bu erken aşamadaki bir çalışma ve bunu açıkça söylüyoruz.",
    models: [
      {
        id: "trading",
        name: "NICS Trading",
        status: "Geliştiriliyor",
        stage: "building",
        desc: "Kendi piyasa verilerimizle öğrenen trading modelimiz: tüm zaman dilimlerinden mumlar, tarayıcının setup'ları ve her işlemin gerçek sonucu.",
        facts: ["Veri: kendi mumlarımız, setup'larımız ve sonuçlarımız", "Eğitimde", "Hedef: piyasa analizini kendi modelimizle yapmak"],
      },
      {
        id: "text",
        name: "NICS Language",
        status: "Deney",
        stage: "trained",
        desc: "Kendi tokenizer'ımızla çalışan, Project Gutenberg külliyatı üzerinde rastgele ağırlıklardan eğitilmiş bir Transformer dil modeli.",
        facts: ["Project Gutenberg külliyatı", "Kendi BPE tokenizer'ımız", "Rastgele ağırlıklardan eğitildi"],
      },
      {
        id: "vision",
        name: "NICS Vision",
        status: "Deney",
        stage: "trained",
        desc: "Dünya ve NASA uzay görüntüleri üzerinde rastgele ağırlıklardan eğitilmiş bir görüntü modeli.",
        facts: ["Dünya ve NASA uzay görüntüleri", "Mineral ve malzeme tanıma", "Rastgele ağırlıklardan eğitildi"],
      },
    ],
    note: "Bir modelin durumu yalnızca gerçek bir eğitim çalışmasından sonra değişir.",
    ctaLab: "Laboratuvar nasıl çalışır",
    ctaRepo: "Laboratuvar deposu",
  },
  zh: {
    badge: "NICS AI Lab",
    title1: "三个自有模型，",
    title2: "从零开始训练",
    desc: "不借用他人的权重，也不是套在别人模型外面的一层壳。每个模型都从随机初始化开始，用我们自己挑选的数据学习。这仍是早期阶段的工作，我们如实说明。",
    models: [
      {
        id: "trading",
        name: "NICS Trading",
        status: "开发中",
        stage: "building",
        desc: "我们的交易模型，用自己的市场数据学习：各个周期的K线、扫描器给出的交易设置，以及每笔交易的真实结果。",
        facts: ["数据：我们的K线、交易设置和结果", "训练中", "目标：用自有模型完成市场分析"],
      },
      {
        id: "text",
        name: "NICS Language",
        status: "实验",
        stage: "trained",
        desc: "一个使用自有分词器的 Transformer 语言模型，在 Project Gutenberg 语料上从随机权重开始训练。",
        facts: ["Project Gutenberg 语料", "自有 BPE 分词器", "从随机权重开始训练"],
      },
      {
        id: "vision",
        name: "NICS Vision",
        status: "实验",
        stage: "trained",
        desc: "一个图像模型，在地球影像和 NASA 太空影像上从随机权重开始训练。",
        facts: ["地球与 NASA 太空影像", "矿物与材料识别", "从随机权重开始训练"],
      },
    ],
    note: "只有完成一次真实训练后，模型状态才会改变。",
    ctaLab: "实验室如何运作",
    ctaRepo: "实验室代码库",
  },
  ar: {
    badge: "NICS AI Lab",
    title1: "ثلاثة نماذج خاصة بنا،",
    title2: "مدرَّبة من الصفر",
    desc: "لا أوزان مستعارة ولا واجهة فوق نموذج شخص آخر. يبدأ كل نموذج من تهيئة عشوائية ويتعلّم من بيانات اخترناها بأنفسنا. إنه عمل في مرحلة مبكرة، ونقول ذلك بوضوح.",
    models: [
      {
        id: "trading",
        name: "NICS Trading",
        status: "قيد التطوير",
        stage: "building",
        desc: "نموذج التداول الخاص بنا، يتعلّم من بيانات السوق الخاصة بنا: الشموع من جميع الأطر الزمنية، وإعدادات الماسح، والنتيجة الفعلية لكل صفقة.",
        facts: ["البيانات: شموعنا وإعداداتنا ونتائجنا", "قيد التدريب", "الهدف: تحليل السوق بنموذجنا الخاص"],
      },
      {
        id: "text",
        name: "NICS Language",
        status: "تجربة",
        stage: "trained",
        desc: "نموذج لغوي من نوع Transformer بمُرمِّز (tokenizer) خاص بنا، دُرِّب من أوزان عشوائية على مجموعة نصوص Project Gutenberg.",
        facts: ["مجموعة نصوص Project Gutenberg", "مُرمِّز BPE خاص بنا", "مدرَّب من أوزان عشوائية"],
      },
      {
        id: "vision",
        name: "NICS Vision",
        status: "تجربة",
        stage: "trained",
        desc: "نموذج صور دُرِّب من أوزان عشوائية على صور الأرض وصور الفضاء من ناسا.",
        facts: ["صور الأرض وصور الفضاء من ناسا", "التعرّف على المعادن والمواد", "مدرَّب من أوزان عشوائية"],
      },
    ],
    note: "لا تتغيّر حالة النموذج إلا بعد عملية تدريب حقيقية.",
    ctaLab: "كيف يعمل المختبر",
    ctaRepo: "مستودع المختبر",
  },
};

export const getLabModelsTexts = (lang: string): LabModelsTexts =>
  TEXTS[lang as keyof typeof TEXTS] ?? TEXTS[phasedLang(lang)];
