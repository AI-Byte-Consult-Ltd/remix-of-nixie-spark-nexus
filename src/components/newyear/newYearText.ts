import type { Language } from "@/contexts/LanguageContext";

// New Year 2027 copy for the gift easter egg, all 12 site languages. Theme
// only: no promo code or discount is promised here.
type NewYearText = {
  giftLabel: string;
  eggTitle: string;
  eggText: string;
  trader: string;
  video: string;
};

const text: Record<Language, NewYearText> = {
  en: {
    giftLabel: "New Year gift",
    eggTitle: "You found the gift! 🎁",
    eggText: "Happy holidays and a happy New Year 2027 from the AI Byte Consult team. May the new year bring you good trades and great videos.",
    trader: "NICS AI Trader",
    video: "NICS Video",
  },
  ru: {
    giftLabel: "Новогодний подарок",
    eggTitle: "Вы нашли подарок! 🎁",
    eggText: "С наступающим Новым 2027 годом от команды AI Byte Consult! Пусть новый год принесёт удачные сделки и отличные видео.",
    trader: "NICS AI Trader",
    video: "NICS Video",
  },
  bg: {
    giftLabel: "Новогодишен подарък",
    eggTitle: "Намерихте подаръка! 🎁",
    eggText: "Весели празници и честита Нова 2027 година от екипа на AI Byte Consult! Нека новата година донесе успешни сделки и страхотни видеа.",
    trader: "NICS AI Trader",
    video: "NICS Video",
  },
  de: {
    giftLabel: "Neujahrsgeschenk",
    eggTitle: "Du hast das Geschenk gefunden! 🎁",
    eggText: "Frohe Feiertage und ein gutes neues Jahr 2027 vom Team von AI Byte Consult! Möge das neue Jahr gute Trades und tolle Videos bringen.",
    trader: "NICS AI Trader",
    video: "NICS Video",
  },
  fr: {
    giftLabel: "Cadeau du Nouvel An",
    eggTitle: "Vous avez trouvé le cadeau ! 🎁",
    eggText: "Joyeuses fêtes et bonne année 2027 de la part de l'équipe AI Byte Consult ! Que la nouvelle année vous apporte de bons trades et de superbes vidéos.",
    trader: "NICS AI Trader",
    video: "NICS Video",
  },
  es: {
    giftLabel: "Regalo de Año Nuevo",
    eggTitle: "¡Has encontrado el regalo! 🎁",
    eggText: "¡Felices fiestas y feliz Año Nuevo 2027 de parte del equipo de AI Byte Consult! Que el nuevo año te traiga buenas operaciones y vídeos geniales.",
    trader: "NICS AI Trader",
    video: "NICS Video",
  },
  it: {
    giftLabel: "Regalo di Capodanno",
    eggTitle: "Hai trovato il regalo! 🎁",
    eggText: "Buone feste e felice Anno Nuovo 2027 dal team di AI Byte Consult! Che il nuovo anno ti porti buoni trade e video fantastici.",
    trader: "NICS AI Trader",
    video: "NICS Video",
  },
  pt: {
    giftLabel: "Presente de Ano Novo",
    eggTitle: "Você encontrou o presente! 🎁",
    eggText: "Boas festas e feliz Ano Novo de 2027 da equipe AI Byte Consult! Que o novo ano traga boas operações e ótimos vídeos.",
    trader: "NICS AI Trader",
    video: "NICS Video",
  },
  pl: {
    giftLabel: "Prezent noworoczny",
    eggTitle: "Znalazłeś prezent! 🎁",
    eggText: "Wesołych świąt i szczęśliwego Nowego Roku 2027 od zespołu AI Byte Consult! Niech nowy rok przyniesie udane transakcje i świetne filmy.",
    trader: "NICS AI Trader",
    video: "NICS Video",
  },
  tr: {
    giftLabel: "Yılbaşı hediyesi",
    eggTitle: "Hediyeyi buldunuz! 🎁",
    eggText: "AI Byte Consult ekibinden mutlu bayramlar ve mutlu yıllar 2027! Yeni yıl size başarılı işlemler ve harika videolar getirsin.",
    trader: "NICS AI Trader",
    video: "NICS Video",
  },
  ar: {
    giftLabel: "هدية رأس السنة",
    eggTitle: "لقد وجدت الهدية! 🎁",
    eggText: "أعياد سعيدة وسنة 2027 جديدة سعيدة من فريق AI Byte Consult! نتمنى أن تحمل لك السنة الجديدة صفقات ناجحة وفيديوهات رائعة.",
    trader: "NICS AI Trader",
    video: "NICS Video",
  },
  zh: {
    giftLabel: "新年礼物",
    eggTitle: "你找到了礼物！🎁",
    eggText: "AI Byte Consult 团队祝你节日快乐，2027 新年快乐！愿新的一年带来顺利的交易和精彩的视频。",
    trader: "NICS AI Trader",
    video: "NICS Video",
  },
};

export const newYearText = (lang: Language): NewYearText => text[lang] ?? text.en;
