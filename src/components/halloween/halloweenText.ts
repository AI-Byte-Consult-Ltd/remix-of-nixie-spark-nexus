import type { Language } from "@/contexts/LanguageContext";

// Halloween 2026 copy, all 12 site languages. {b} = Video bonus %, {p} = code
// discount %, {code} = promo code. Never "AI does it for you" for NICS Video.
type HalloweenText = {
  banner: string;
  eggTitle: string;
  eggText: string;
  boo: string;
  copy: string;
  copied: string;
  trader: string;
  video: string;
  pumpkinLabel: string;
  promoLabel: string;
  videoBadge: string;
};

const text: Record<Language, HalloweenText> = {
  en: {
    banner: "Halloween until 31 Oct: +{b}% NICS Video credits on every plan. A pumpkin on this page hides a −{p}% code.",
    eggTitle: "You found the pumpkin!",
    eggText: "Code {code}: −{p}% on NICS AI Trader (pay in your cabinet) and on NICS Video plans. Valid until 31 Oct, 23:59 Sofia time.",
    boo: "Boo! Happy Halloween 🎃",
    copy: "Copy code",
    copied: "Copied",
    trader: "Trader cabinet",
    video: "NICS Video",
    pumpkinLabel: "Halloween pumpkin",
    promoLabel: "Promo code (optional)",
    videoBadge: "🎃 Halloween: {n} credits instead of {m} until 31 Oct, 23:59 Sofia time",
  },
  ru: {
    banner: "Хэллоуин до 31.10: +{b}% кредитов NICS Video на любой тариф. А в тыкве на этой странице спрятан код на −{p}%.",
    eggTitle: "Вы нашли тыкву!",
    eggText: "Код {code}: −{p}% на NICS AI Trader (оплата в кабинете) и на тарифы NICS Video. Действует до 31.10, 23:59 по Софии.",
    boo: "Бу! С Хэллоуином 🎃",
    copy: "Скопировать код",
    copied: "Скопировано",
    trader: "Кабинет Trader",
    video: "NICS Video",
    pumpkinLabel: "Хэллоуинская тыква",
    promoLabel: "Промокод (необязательно)",
    videoBadge: "🎃 Хэллоуин: {n} кредитов вместо {m} до 31.10, 23:59 по Софии",
  },
  bg: {
    banner: "Хелоуин до 31.10: +{b}% кредити за NICS Video на всеки план. В тиквата на тази страница е скрит код за −{p}%.",
    eggTitle: "Намерихте тиквата!",
    eggText: "Код {code}: −{p}% за NICS AI Trader (плащане в кабинета) и за плановете на NICS Video. Валиден до 31.10, 23:59 софийско време.",
    boo: "Бу! Честит Хелоуин 🎃",
    copy: "Копирай кода",
    copied: "Копирано",
    trader: "Кабинет Trader",
    video: "NICS Video",
    pumpkinLabel: "Хелоуинска тиква",
    promoLabel: "Промо код (по желание)",
    videoBadge: "🎃 Хелоуин: {n} кредита вместо {m} до 31.10, 23:59 софийско време",
  },
  de: {
    banner: "Halloween bis 31.10.: +{b}% NICS-Video-Credits auf jeden Tarif. Ein Kürbis auf dieser Seite versteckt einen −{p}%-Code.",
    eggTitle: "Du hast den Kürbis gefunden!",
    eggText: "Code {code}: −{p}% auf NICS AI Trader (Zahlung im Kabinett) und auf NICS-Video-Tarife. Gültig bis 31.10., 23:59 Uhr Sofia-Zeit.",
    boo: "Buh! Happy Halloween 🎃",
    copy: "Code kopieren",
    copied: "Kopiert",
    trader: "Trader-Kabinett",
    video: "NICS Video",
    pumpkinLabel: "Halloween-Kürbis",
    promoLabel: "Gutscheincode (optional)",
    videoBadge: "🎃 Halloween: {n} statt {m} Credits bis 31.10., 23:59 Uhr Sofia-Zeit",
  },
  fr: {
    banner: "Halloween jusqu'au 31/10 : +{b}% de crédits NICS Video sur chaque offre. Une citrouille sur cette page cache un code −{p}%.",
    eggTitle: "Vous avez trouvé la citrouille !",
    eggText: "Code {code} : −{p}% sur NICS AI Trader (paiement dans votre espace) et sur les offres NICS Video. Valable jusqu'au 31/10, 23h59 heure de Sofia.",
    boo: "Bouh ! Joyeux Halloween 🎃",
    copy: "Copier le code",
    copied: "Copié",
    trader: "Espace Trader",
    video: "NICS Video",
    pumpkinLabel: "Citrouille d'Halloween",
    promoLabel: "Code promo (facultatif)",
    videoBadge: "🎃 Halloween : {n} crédits au lieu de {m} jusqu'au 31/10, 23h59 heure de Sofia",
  },
  it: {
    banner: "Halloween fino al 31/10: +{b}% crediti NICS Video su ogni piano. Una zucca in questa pagina nasconde un codice −{p}%.",
    eggTitle: "Hai trovato la zucca!",
    eggText: "Codice {code}: −{p}% su NICS AI Trader (pagamento nell'area personale) e sui piani NICS Video. Valido fino al 31/10, 23:59 ora di Sofia.",
    boo: "Bu! Buon Halloween 🎃",
    copy: "Copia il codice",
    copied: "Copiato",
    trader: "Area Trader",
    video: "NICS Video",
    pumpkinLabel: "Zucca di Halloween",
    promoLabel: "Codice promo (facoltativo)",
    videoBadge: "🎃 Halloween: {n} crediti invece di {m} fino al 31/10, 23:59 ora di Sofia",
  },
  es: {
    banner: "Halloween hasta el 31/10: +{b}% de créditos NICS Video en cada plan. Una calabaza en esta página esconde un código de −{p}%.",
    eggTitle: "¡Encontraste la calabaza!",
    eggText: "Código {code}: −{p}% en NICS AI Trader (pago en tu panel) y en los planes de NICS Video. Válido hasta el 31/10, 23:59 hora de Sofía.",
    boo: "¡Bu! Feliz Halloween 🎃",
    copy: "Copiar código",
    copied: "Copiado",
    trader: "Panel Trader",
    video: "NICS Video",
    pumpkinLabel: "Calabaza de Halloween",
    promoLabel: "Código promocional (opcional)",
    videoBadge: "🎃 Halloween: {n} créditos en lugar de {m} hasta el 31/10, 23:59 hora de Sofía",
  },
  pt: {
    banner: "Halloween até 31/10: +{b}% de créditos NICS Video em qualquer plano. Uma abóbora nesta página esconde um código de −{p}%.",
    eggTitle: "Você achou a abóbora!",
    eggText: "Código {code}: −{p}% no NICS AI Trader (pagamento no seu painel) e nos planos NICS Video. Válido até 31/10, 23:59 horário de Sófia.",
    boo: "Bu! Feliz Halloween 🎃",
    copy: "Copiar código",
    copied: "Copiado",
    trader: "Painel Trader",
    video: "NICS Video",
    pumpkinLabel: "Abóbora de Halloween",
    promoLabel: "Código promocional (opcional)",
    videoBadge: "🎃 Halloween: {n} créditos em vez de {m} até 31/10, 23:59 horário de Sófia",
  },
  pl: {
    banner: "Halloween do 31.10: +{b}% kredytów NICS Video w każdym planie. Dynia na tej stronie skrywa kod −{p}%.",
    eggTitle: "Znalazłeś dynię!",
    eggText: "Kod {code}: −{p}% na NICS AI Trader (płatność w panelu) i na plany NICS Video. Ważny do 31.10, 23:59 czasu Sofii.",
    boo: "Buu! Wesołego Halloween 🎃",
    copy: "Kopiuj kod",
    copied: "Skopiowano",
    trader: "Panel Trader",
    video: "NICS Video",
    pumpkinLabel: "Dynia na Halloween",
    promoLabel: "Kod promocyjny (opcjonalnie)",
    videoBadge: "🎃 Halloween: {n} kredytów zamiast {m} do 31.10, 23:59 czasu Sofii",
  },
  tr: {
    banner: "31 Ekim'e kadar Cadılar Bayramı: her pakette +{b}% NICS Video kredisi. Bu sayfadaki bir balkabağında −{p}% kod saklı.",
    eggTitle: "Balkabağını buldun!",
    eggText: "Kod {code}: NICS AI Trader'da (ödeme panelinizde) ve NICS Video paketlerinde −{p}%. 31 Ekim 23:59'a (Sofya saati) kadar geçerli.",
    boo: "Böö! Mutlu Cadılar Bayramı 🎃",
    copy: "Kodu kopyala",
    copied: "Kopyalandı",
    trader: "Trader paneli",
    video: "NICS Video",
    pumpkinLabel: "Cadılar Bayramı balkabağı",
    promoLabel: "Promosyon kodu (isteğe bağlı)",
    videoBadge: "🎃 Cadılar Bayramı: 31 Ekim 23:59'a (Sofya saati) kadar {m} yerine {n} kredi",
  },
  ar: {
    banner: "الهالوين حتى 31 أكتوبر: ‎+{b}%‎ رصيد إضافي في NICS Video على كل باقة. في يقطينة على هذه الصفحة رمز خصم ‎{p}%‎.",
    eggTitle: "وجدت اليقطينة!",
    eggText: "الرمز {code}: خصم ‎{p}%‎ على NICS AI Trader (الدفع من لوحتك) وعلى باقات NICS Video. صالح حتى 31 أكتوبر، 23:59 بتوقيت صوفيا.",
    boo: "بوو! هالوين سعيد 🎃",
    copy: "نسخ الرمز",
    copied: "تم النسخ",
    trader: "لوحة Trader",
    video: "NICS Video",
    pumpkinLabel: "يقطينة الهالوين",
    promoLabel: "رمز الخصم (اختياري)",
    videoBadge: "🎃 الهالوين: {n} رصيد بدلاً من {m} حتى 31 أكتوبر، 23:59 بتوقيت صوفيا",
  },
  zh: {
    banner: "万圣节活动至 10 月 31 日：NICS Video 所有套餐额度 +{b}%。本页的南瓜里藏着一个 −{p}% 优惠码。",
    eggTitle: "你找到南瓜了！",
    eggText: "优惠码 {code}：NICS AI Trader（在个人中心付款）和 NICS Video 套餐立减 {p}%。有效期至 10 月 31 日 23:59（索非亚时间）。",
    boo: "嘘！万圣节快乐 🎃",
    copy: "复制优惠码",
    copied: "已复制",
    trader: "Trader 个人中心",
    video: "NICS Video",
    pumpkinLabel: "万圣节南瓜",
    promoLabel: "优惠码（可选）",
    videoBadge: "🎃 万圣节：至 10 月 31 日 23:59（索非亚时间）额度 {n}，原为 {m}",
  },
};

export const halloweenText = (language: Language) => text[language] ?? text.en;

export const fillHalloween = (s: string, vars: Record<string, string | number>) =>
  s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
