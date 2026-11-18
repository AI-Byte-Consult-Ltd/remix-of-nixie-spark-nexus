/*
 * Homepage block "NICS AI Lab: our own models" (Alexander, 2026-11-18).
 * Shown right under the hero so a visitor sees first that we train our own
 * models from scratch.
 *
 * Facts must stay true to the nics-ai-lab repository (v0.2.0):
 * - NICS Language: Transformer + own BPE tokenizer, trained on Project Gutenberg
 *   (Alexander, 2026-11-18: earlier work, before the nics-ai-lab repo).
 * - NICS Vision: trained on Earth and NASA space imagery (same source).
 * - NICS Trading: in development, NOT trained yet. Update the status
 *   here only when a real training run exists.
 * Names (Alexander 2026-11-18): NICS Language, NICS Vision, NICS Trading.
 * Status words follow implemented / prototype / experiment / plan.
 * Phase 1 languages; others fall back to English.
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

const TEXTS: Record<Phase1Lang, LabModelsTexts> = {
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
        desc: "Our trading model, built to learn from our own market data: candles from all timeframes, the scanner's signals and how each trade really ended.",
        facts: ["Data: our candles, signals and outcomes", "Not trained yet", "Goal: run our market analysis on our own model"],
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
        desc: "Наша торговая модель. Она будет учиться на наших рыночных данных: свечи всех таймфреймов, сигналы сканера и реальные итоги каждой сделки.",
        facts: ["Данные: наши свечи, сигналы и итоги", "Ещё не обучена", "Цель: анализ рынка на собственной модели"],
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
        desc: "Нашият търговски модел. Ще се учи на нашите пазарни данни: свещи от всички таймфрейми, сигналите на скенера и реалния резултат от всяка сделка.",
        facts: ["Данни: нашите свещи, сигнали и резултати", "Още не е обучен", "Цел: пазарен анализ със собствен модел"],
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
        desc: "Unser Trading-Modell. Es soll aus unseren eigenen Marktdaten lernen: Kerzen aller Zeitrahmen, die Signale des Scanners und das tatsächliche Ergebnis jedes Trades.",
        facts: ["Daten: unsere Kerzen, Signale und Ergebnisse", "Noch nicht trainiert", "Ziel: Marktanalyse mit eigenem Modell"],
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
        desc: "Nuestro modelo de trading. Aprenderá de nuestros propios datos de mercado: velas de todas las temporalidades, las señales del escáner y el resultado real de cada operación.",
        facts: ["Datos: nuestras velas, señales y resultados", "Aún sin entrenar", "Objetivo: análisis de mercado con modelo propio"],
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
  },
};

export const getLabModelsTexts = (lang: string): LabModelsTexts => TEXTS[phasedLang(lang)];
