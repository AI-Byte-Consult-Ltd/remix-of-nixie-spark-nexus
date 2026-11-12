/*
 * /about in the phase 1 SEO languages (src/i18n/phasedSeo.ts). The bulk of
 * the page text lives in subPageTranslations ("aboutpage.*"); this file holds
 * the SEO meta, the NICS AI block and the strings that used to be English-only.
 */
import type { Phase1Lang } from "./phasedSeo";

export interface AboutTexts {
  seoTitle: string;
  seoDescription: string;
  heading: string;
  learnAbout: string;
  nicsTitle: string;
  nicsDesc: string;
  nicsLinks: { trader: string; software: string; ecosystem: string };
  multimedia: string;
  social: string;
  aquaterra: string;
}

const en: AboutTexts = {
  seoTitle: "About AI Byte Consult — AI Company Behind NICS AI, Bulgaria",
  seoDescription:
    "AI Byte Consult Ltd is an AI company registered in Bulgaria and an official Meta Tech Provider. We build the NICS AI ecosystem: NICS AI Trader, NICS Video, NICS Studio and an open AI lab.",
  heading: "About",
  learnAbout: "Learn about",
  nicsTitle: "NICS AI — what we build",
  nicsDesc:
    "NICS AI is our own family of AI products: an autonomous AI trading platform, automatic video editing for creators and an open lab that trains its own models from scratch.",
  nicsLinks: { trader: "NICS AI Trader", software: "AI trading software", ecosystem: "NICS AI Ecosystem" },
  multimedia:
    "Original music — lyrics, musical idea and visual direction by Aleksandr Tochilov, technical production by NICS Multimedia — released on Spotify and other streaming platforms, starting with the track \"Just Live\".",
  social:
    "PRIDE Social Network (pridesocial.org) — a social platform we built in-house for the LGBTQ+ community. Live today, still basic, with a small first group of real users.",
  aquaterra:
    "Our metaverse project — 640,000 virtual land parcels designed as an interactive, AI-teaching environment. Development is currently paused while we focus on other priorities.",
};

const ru: AboutTexts = {
  seoTitle: "О компании AI Byte Consult — AI-компания, создатель NICS AI, Болгария",
  seoDescription:
    "AI Byte Consult Ltd — AI-компания, зарегистрированная в Болгарии, официальный Meta Tech Provider. Мы создаём экосистему NICS AI: NICS AI Trader, NICS Video, NICS Studio и открытую AI-лабораторию.",
  heading: "О компании",
  learnAbout: "Подробнее:",
  nicsTitle: "NICS AI — что мы создаём",
  nicsDesc:
    "NICS AI — наше собственное семейство AI-продуктов: автономная AI-платформа для трейдинга, автоматический монтаж видео для авторов и открытая лаборатория, которая обучает свои модели с нуля.",
  nicsLinks: { trader: "NICS AI Trader", software: "Программа для трейдинга с ИИ", ecosystem: "Экосистема NICS AI" },
  multimedia:
    "Авторская музыка: текст, музыкальная идея и визуальный образ — Александр Точилов, техническое производство — NICS Multimedia. Выходит на Spotify и других стриминговых площадках, начиная с трека «Just Live».",
  social:
    "PRIDE Social Network (pridesocial.org) — социальная платформа для ЛГБТК+ сообщества, которую мы сделали сами. Уже работает, пока в базовом виде, с небольшой первой группой реальных пользователей.",
  aquaterra:
    "Наш проект метавселенной — 640 000 виртуальных участков как интерактивная обучающая среда с ИИ. Разработка сейчас на паузе: мы сосредоточены на других приоритетах.",
};

const bg: AboutTexts = {
  seoTitle: "За AI Byte Consult — AI компанията зад NICS AI, България",
  seoDescription:
    "AI Byte Consult Ltd е AI компания, регистрирана в България, официален Meta Tech Provider. Създаваме екосистемата NICS AI: NICS AI Trader, NICS Video, NICS Studio и отворена AI лаборатория.",
  heading: "За",
  learnAbout: "Научете повече:",
  nicsTitle: "NICS AI — какво създаваме",
  nicsDesc:
    "NICS AI е нашето собствено семейство AI продукти: автономна AI платформа за трейдинг, автоматичен видео монтаж за автори и отворена лаборатория, която обучава собствени модели от нулата.",
  nicsLinks: { trader: "NICS AI Trader", software: "Софтуер за трейдинг с ИИ", ecosystem: "Екосистема NICS AI" },
  multimedia:
    "Авторска музика: текст, музикална идея и визия — Александър Точилов, техническа продукция — NICS Multimedia. Излиза в Spotify и други стрийминг платформи, започвайки с песента „Just Live“.",
  social:
    "PRIDE Social Network (pridesocial.org) — социална платформа за ЛГБТК+ общността, която изградихме сами. Работи днес, все още в базов вид, с малка първа група реални потребители.",
  aquaterra:
    "Нашият проект за метавселена — 640 000 виртуални парцела като интерактивна обучителна среда с ИИ. Разработката в момента е на пауза, докато сме съсредоточени върху други приоритети.",
};

const de: AboutTexts = {
  seoTitle: "Über AI Byte Consult — das KI-Unternehmen hinter NICS AI, Bulgarien",
  seoDescription:
    "AI Byte Consult Ltd ist ein in Bulgarien registriertes KI-Unternehmen und offizieller Meta Tech Provider. Wir bauen das NICS AI Ecosystem: NICS AI Trader, NICS Video, NICS Studio und ein offenes KI-Labor.",
  heading: "Über",
  learnAbout: "Mehr über",
  nicsTitle: "NICS AI — was wir bauen",
  nicsDesc:
    "NICS AI ist unsere eigene KI-Produktfamilie: eine autonome KI-Trading-Plattform, automatischer Videoschnitt für Creator und ein offenes Labor, das eigene Modelle von Grund auf trainiert.",
  nicsLinks: { trader: "NICS AI Trader", software: "KI-Trading-Software", ecosystem: "NICS AI Ecosystem" },
  multimedia:
    "Eigene Musik: Text, musikalische Idee und visuelle Gestaltung von Aleksandr Tochilov, technische Produktion von NICS Multimedia. Erscheint auf Spotify und anderen Streaming-Plattformen, beginnend mit dem Titel „Just Live“.",
  social:
    "PRIDE Social Network (pridesocial.org) — eine selbst entwickelte soziale Plattform für die LGBTQ+-Community. Heute online, noch einfach gehalten, mit einer kleinen ersten Gruppe echter Nutzer.",
  aquaterra:
    "Unser Metaverse-Projekt — 640.000 virtuelle Grundstücke als interaktive, KI-gestützte Lernumgebung. Die Entwicklung pausiert derzeit, während wir uns auf andere Prioritäten konzentrieren.",
};

const es: AboutTexts = {
  seoTitle: "Sobre AI Byte Consult — la empresa de IA detrás de NICS AI, Bulgaria",
  seoDescription:
    "AI Byte Consult Ltd es una empresa de IA registrada en Bulgaria y Meta Tech Provider oficial. Creamos el ecosistema NICS AI: NICS AI Trader, NICS Video, NICS Studio y un laboratorio de IA abierto.",
  heading: "Sobre",
  learnAbout: "Más sobre",
  nicsTitle: "NICS AI — lo que construimos",
  nicsDesc:
    "NICS AI es nuestra propia familia de productos de IA: una plataforma autónoma de trading con IA, edición automática de vídeo para creadores y un laboratorio abierto que entrena sus propios modelos desde cero.",
  nicsLinks: { trader: "NICS AI Trader", software: "Software de trading con IA", ecosystem: "Ecosistema NICS AI" },
  multimedia:
    "Música original: letra, idea musical y dirección visual de Aleksandr Tochilov, producción técnica de NICS Multimedia. Publicada en Spotify y otras plataformas, empezando por el tema «Just Live».",
  social:
    "PRIDE Social Network (pridesocial.org) — una plataforma social creada por nosotros para la comunidad LGBTQ+. Ya funciona, todavía básica, con un pequeño primer grupo de usuarios reales.",
  aquaterra:
    "Nuestro proyecto de metaverso — 640.000 parcelas virtuales como entorno interactivo de aprendizaje con IA. El desarrollo está en pausa mientras nos centramos en otras prioridades.",
};

export const aboutTexts: Record<Phase1Lang, AboutTexts> = { en, ru, bg, de, es };
