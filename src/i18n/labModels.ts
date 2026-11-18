/*
 * Homepage block "NICS AI Lab: our own models" (Alexander, 2026-11-18).
 * Shown right under the hero so a visitor sees first that we train our own
 * models from scratch.
 *
 * Facts must stay true to the nics-ai-lab repository (v0.2.0):
 * - nics-text-nano: 868,992 params, own BPE tokenizer, Tiny Shakespeare,
 *   val loss 3.99, CPU-trained, pipeline scale.
 * - nics-vision-nano: 33,658 params, Fashion-MNIST, val accuracy 87.1%.
 * - NICS Trading Club: in development, NOT trained yet. Update the status
 *   here only when a real training run exists.
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
        name: "NICS Trading Club",
        status: "In development",
        stage: "building",
        desc: "Our trading model, built to learn from our own market data: candles from all timeframes, the scanner's signals and how each trade really ended.",
        facts: ["Data: our candles, signals and outcomes", "Not trained yet", "Goal: run our market analysis on our own model"],
      },
      {
        id: "text",
        name: "NICS Text",
        status: "Trained, early",
        stage: "trained",
        desc: "A small Transformer language model with our own tokenizer, trained on public-domain text.",
        facts: ["869K parameters", "Own BPE tokenizer", "CPU training, pipeline scale"],
      },
      {
        id: "vision",
        name: "NICS Vision",
        status: "Trained, early",
        stage: "trained",
        desc: "A small image classifier trained from random weights on an openly licensed image set.",
        facts: ["34K parameters", "87.1% accuracy on Fashion-MNIST", "CPU training, pipeline scale"],
      },
    ],
    note: "Numbers come from real training runs recorded in our lab repository.",
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
        name: "NICS Trading Club",
        status: "В разработке",
        stage: "building",
        desc: "Наша торговая модель. Она будет учиться на наших рыночных данных: свечи всех таймфреймов, сигналы сканера и реальные итоги каждой сделки.",
        facts: ["Данные: наши свечи, сигналы и итоги", "Ещё не обучена", "Цель: анализ рынка на собственной модели"],
      },
      {
        id: "text",
        name: "NICS Text",
        status: "Обучена, ранняя",
        stage: "trained",
        desc: "Небольшая языковая модель-трансформер с собственным токенизатором, обученная на текстах из общественного достояния.",
        facts: ["869 тыс. параметров", "Свой BPE-токенизатор", "Обучение на CPU, масштаб проверки"],
      },
      {
        id: "vision",
        name: "NICS Vision",
        status: "Обучена, ранняя",
        stage: "trained",
        desc: "Небольшой классификатор изображений, обученный со случайных весов на открыто лицензированном наборе.",
        facts: ["34 тыс. параметров", "Точность 87,1% на Fashion-MNIST", "Обучение на CPU, масштаб проверки"],
      },
    ],
    note: "Цифры взяты из реальных запусков обучения, записанных в репозитории лаборатории.",
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
        name: "NICS Trading Club",
        status: "В разработка",
        stage: "building",
        desc: "Нашият търговски модел. Ще се учи на нашите пазарни данни: свещи от всички таймфрейми, сигналите на скенера и реалния резултат от всяка сделка.",
        facts: ["Данни: нашите свещи, сигнали и резултати", "Още не е обучен", "Цел: пазарен анализ със собствен модел"],
      },
      {
        id: "text",
        name: "NICS Text",
        status: "Обучен, ранен",
        stage: "trained",
        desc: "Малък езиков модел трансформър със собствен токенизатор, обучен на текстове от общественото достояние.",
        facts: ["869 хил. параметъра", "Собствен BPE токенизатор", "Обучение на CPU, мащаб за проверка"],
      },
      {
        id: "vision",
        name: "NICS Vision",
        status: "Обучен, ранен",
        stage: "trained",
        desc: "Малък класификатор на изображения, обучен от случайни тегла върху свободно лицензиран набор.",
        facts: ["34 хил. параметъра", "Точност 87,1% на Fashion-MNIST", "Обучение на CPU, мащаб за проверка"],
      },
    ],
    note: "Числата са от реални обучения, записани в хранилището на лабораторията.",
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
        name: "NICS Trading Club",
        status: "In Entwicklung",
        stage: "building",
        desc: "Unser Trading-Modell. Es soll aus unseren eigenen Marktdaten lernen: Kerzen aller Zeitrahmen, die Signale des Scanners und das tatsächliche Ergebnis jedes Trades.",
        facts: ["Daten: unsere Kerzen, Signale und Ergebnisse", "Noch nicht trainiert", "Ziel: Marktanalyse mit eigenem Modell"],
      },
      {
        id: "text",
        name: "NICS Text",
        status: "Trainiert, früh",
        stage: "trained",
        desc: "Ein kleines Transformer-Sprachmodell mit eigenem Tokenizer, trainiert auf gemeinfreien Texten.",
        facts: ["869.000 Parameter", "Eigener BPE-Tokenizer", "CPU-Training, Pipeline-Maßstab"],
      },
      {
        id: "vision",
        name: "NICS Vision",
        status: "Trainiert, früh",
        stage: "trained",
        desc: "Ein kleiner Bildklassifikator, ab zufälligen Gewichten auf einem offen lizenzierten Bildsatz trainiert.",
        facts: ["34.000 Parameter", "87,1 % Genauigkeit auf Fashion-MNIST", "CPU-Training, Pipeline-Maßstab"],
      },
    ],
    note: "Die Zahlen stammen aus echten Trainingsläufen, die im Repository des Labors dokumentiert sind.",
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
        name: "NICS Trading Club",
        status: "En desarrollo",
        stage: "building",
        desc: "Nuestro modelo de trading. Aprenderá de nuestros propios datos de mercado: velas de todas las temporalidades, las señales del escáner y el resultado real de cada operación.",
        facts: ["Datos: nuestras velas, señales y resultados", "Aún sin entrenar", "Objetivo: análisis de mercado con modelo propio"],
      },
      {
        id: "text",
        name: "NICS Text",
        status: "Entrenado, inicial",
        stage: "trained",
        desc: "Un pequeño modelo de lenguaje Transformer con tokenizador propio, entrenado con textos de dominio público.",
        facts: ["869.000 parámetros", "Tokenizador BPE propio", "Entrenamiento en CPU, escala de validación"],
      },
      {
        id: "vision",
        name: "NICS Vision",
        status: "Entrenado, inicial",
        stage: "trained",
        desc: "Un pequeño clasificador de imágenes entrenado desde pesos aleatorios con un conjunto de licencia abierta.",
        facts: ["34.000 parámetros", "87,1 % de precisión en Fashion-MNIST", "Entrenamiento en CPU, escala de validación"],
      },
    ],
    note: "Las cifras provienen de entrenamientos reales registrados en el repositorio del laboratorio.",
    ctaLab: "Cómo funciona el laboratorio",
    ctaRepo: "Repositorio del laboratorio",
  },
};

export const getLabModelsTexts = (lang: string): LabModelsTexts => TEXTS[phasedLang(lang)];
