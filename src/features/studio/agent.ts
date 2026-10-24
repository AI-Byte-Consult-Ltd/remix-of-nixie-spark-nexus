// NICS Studio agent: turns a plain-language request ("cut the pauses, add
// captions 3 words at a time, add zooms") into ordered edit steps. Parsing is
// rule-based and runs in the browser; the heavy steps (pauses, speech
// recognition) run on the user's device too. It understands every site
// language: each intent below lists its words in en, ru, de, fr, es, it, pt,
// pl, tr, bg, ar and zh. Matching is by word stem on the lowercased request.
import type { Language } from "@/contexts/LanguageContext";
import type { Aspect, CaptionStyle, FilterId } from "./model";

// Speech language for captions: Whisper recognises all site languages.
export type CaptionLang = Language;

export type AgentStep =
  | { kind: "silence" }
  | { kind: "limit"; seconds: number }
  | { kind: "captions"; words: number; language: CaptionLang | null }
  | { kind: "captionStyle"; patch: Partial<CaptionStyle> }
  | { kind: "removeCaptions" }
  | { kind: "zooms"; amount: number }
  | { kind: "removeZooms" }
  | { kind: "text"; text: string; y: number }
  | { kind: "aspect"; aspect: Aspect }
  | { kind: "fit"; fit: "cover" | "contain" }
  | { kind: "transition"; on: boolean }
  | { kind: "filter"; filter: FilterId }
  | { kind: "musicVolume"; volume: number }
  | { kind: "muteClips" };

const NUMBERS: Record<string, number> = {
  one: 1, two: 2, three: 3, four: 4, five: 5,
  "один": 1, "одно": 1, "одному": 1, "одним": 1, "два": 2, "две": 2, "двум": 2, "три": 3, "трём": 3, "трем": 3,
  "четыре": 4, "четырём": 4, "четырем": 4, "пять": 5, "пяти": 5,
  zwei: 2, drei: 3, vier: 4, "fünf": 5, deux: 2, trois: 3, quatre: 4, cinq: 5,
  dos: 2, tres: 3, cuatro: 4, cinco: 5, due: 2, tre: 3, quattro: 4, cinque: 5,
  dois: 2, duas: 2, "três": 3, quatro: 4, dwa: 2, dwie: 2, trzy: 3, cztery: 4, "pięć": 5,
  iki: 2, "üç": 3, "dört": 4, "beş": 5, "четири": 4, "пет": 5,
  "اثنين": 2, "كلمتين": 2, "ثلاث": 3, "أربع": 4, "خمس": 5,
  "一": 1, "二": 2, "两": 2, "三": 3, "四": 4, "五": 5,
};

const COLORS: [RegExp, string][] = [
  [/(жёлт|желт|жълт|yellow|gelb|jaune|amarill|giall|amarel|żółt|zolt|sarı|\bsari\b|أصفر|اصفر|黄色)/, "#ffd400"],
  [/(бел|бял|white|weiß|weiss|blanc|bianc|branc|biał|bial|beyaz|أبيض|ابيض|白色)/, "#ffffff"],
  [/(красн|розов|червен|розов|red|pink|\brot\b|rouge|rojo|\bross[oa]\b|vermelh|czerwon|kırmızı|kirmizi|pembe|rosa|أحمر|احمر|وردي|红色|粉色)/, "#ff3b6b"],
  [/(зелён|зелен|green|grün|grun|\bvert[e]?\b|verde|zielon|yeşil|yesil|أخضر|اخضر|绿色)/, "#2ee6a6"],
  [/(син|голуб|blue|blau|bleu|azul|\bblu\b|niebiesk|mavi|أزرق|ازرق|蓝色)/, "#3ab4ff"],
  [/(чёрн|черн|black|schwarz|noir|negr|\bnero\b|\bpret[oa]\b|czarn|siyah|أسود|اسود|黑色)/, "#111111"],
];

// Speech languages by name, in English, Russian and the language itself.
const LANGUAGE_NAMES: [CaptionLang, RegExp][] = [
  ["en", /(англ|english|englisch|anglais|inglés|ingles|inglês|angielsk|ingilizce|английск|انجليز|إنجليز|英语|英文|in en\b)/],
  ["ru", /(русск|russian|russisch|russe|ruso|russo|rosyjsk|rusça|rusca|руски|الروسية|俄语)/],
  ["de", /(немец|немецк|german|deutsch|allemand|alemán|aleman|tedesco|alemão|alemao|niemieck|almanca|немски|الألمانية|德语)/],
  ["fr", /(француз|french|französisch|franzosisch|français|francais|francés|frances|francese|francês|francusk|fransızca|fransizca|френски|الفرنسية|法语)/],
  ["es", /(испан|spanish|spanisch|espagnol|español|espanol|spagnolo|espanhol|hiszpańsk|hiszpansk|ispanyolca|испански|الإسبانية|الاسبانية|西班牙语)/],
  ["it", /(итальян|italian|italienisch|italien|italiano|włosk|wlosk|italyanca|италиански|الإيطالية|意大利语)/],
  ["pt", /(португал|portuguese|portugiesisch|portugais|portugués|portugues|portoghese|português|portugalsk|portekizce|португалски|البرتغالية|葡萄牙语)/],
  ["pl", /(польск|polish|polnisch|polonais|polaco|polacco|polonês|polones|polsk|lehçe|lehce|полски|البولندية|波兰语)/],
  ["tr", /(турец|turkish|türkisch|turkisch|\bturc|turco|turca|turecki|türkçe|turkce|турски|التركية|土耳其语)/],
  ["bg", /(болгар|bulgarian|bulgarisch|bulgare|búlgaro|bulgaro|bułgarsk|bulgarsk|bulgarca|български|البلغارية|保加利亚语)/],
  ["ar", /(араб|arabic|arabisch|arabe|árabe|arabo|arabsk|arapça|arapca|арабски|العربية|阿拉伯语)/],
  ["zh", /(китай|chinese|chinesisch|chinois|chino|cinese|chinês|chines|chińsk|chinsk|çince|cince|китайски|الصينية|中文|汉语|普通话)/],
];

const REMOVE = /(убери|удали|убрать|удалить|remove|delete|entfern|lösch|losch|supprim|enlève|enleve|retire|elimin|quita|borra|rimuov|togli|remov|apag|usuń|usun|kaldır|kaldir|\bsil\b|премахни|махни|изтрий|احذف|أزل|ازل|删除|去掉|移除|去除|不要)/;
const ADD = /(добав|сдела|созда|сгенер|add|make|generate|create|нужн|hinzu|füge|fuge|erstell|generier|\bmach|ajout|mets|crée|cree|génère|genere|añad|anad|agrega|\bpon\b|\bcrea|genera|aggiung|metti|adicion|coloq|ponha|\bgera|\bcria|dodaj|zrób|zrob|utwórz|utworz|wygeneruj|ekle|oluştur|olustur|\byap|добави|направи|създай|أضف|اضف|أنشئ|انشئ|اصنع|添加|加上|生成|做)/;
const PAUSES = /(пауз|тишин|молчан|dead ?space|silence|paus|pauz|gaps|лишн|stille|lücke|lucke|silencio|silêncio|silenzi|cisz|sessiz|duraklama|boşluk|bosluk|صمت|سكت|توقف|停顿|沉默|空白)/;
const CAPTIONS = /(субтитр|caption|subtitle|титр|untertitel|sous-titre|soustitre|subtítulo|subtitulo|sottotitol|legenda|napis|altyazı|altyazi|ترجمة|تعليق|字幕)/;
const BIGGER_A_LITTLE = /(немного больше|чуть больше|a little bigger|slightly bigger|little bigger|etwas größer|etwas grosser|un peu plus grand|un poco más grande|un poco mas grande|un po' più grand|un po più grand|um pouco maior|trochę większ|troche wieksz|biraz büyük|biraz daha büyük|малко по-голям|أكبر قليلا|اكبر قليلا|大一点|稍大)/;
const BIGGER = /(больше|крупн|bigger|larger|größer|grosser|plus grand|más grande|mas grande|più grand|piu grand|maior|większ|wieksz|büyük|buyuk|по-голям|أكبر|اكبر|更大)/;
const SMALLER = /(меньше|мельче|smaller|kleiner|plus petit|más pequeñ|mas pequen|più piccol|piu piccol|menor|mniejsz|küçük|kucuk|по-малк|أصغر|اصغر|更小|小一点)/;
const TOP = /(сверху|вверху|наверх|at the top|\btop\b|oben|en haut|arriba|in alto|em cima|no topo|na górze|na gorze|üstte|ustte|(?<!\p{L})üst|горе|الأعلى|أعلى|اعلى|顶部|上方|上面)/u;
const CENTER = /(по центру|посередин|center|middle|mitte|zentr|centre|centro|milieu|medio|środ|srod|ortada|\borta|центъра|среда|منتصف|وسط|中间|居中)/;
const BOTTOM = /(снизу|внизу|bottom|unten|en bas|abajo|in basso|embaixo|em baixo|na dole|altta|aşağı|asagi|долу|أسفل|اسفل|底部|下方|下面)/;
const BOX = /(подложк|фон под|background box|with a box|\bbox\b|hintergrund|\bfond\b|fondo|sfondo|caixa|fundo|tło|tlo|arka plan|kutu|подложка|خلفية|背景框|底框)/;
const LOWER = /(маленьк(ими|ие) букв|строчн|lowercase|kleinbuchstab|minuscul|minúscul|małe liter|male liter|küçük harf|kucuk harf|малки букви|أحرف صغيرة|小写)/;
const UPPER = /(заглавн|капс|uppercase|caps|großbuchstab|grossbuchstab|majuscul|mayúscul|mayuscul|maiuscol|maiúscul|maiuscul|wielkie liter|büyük harf|buyuk harf|главни букви|أحرف كبيرة|大写)/;
const NO_HIGHLIGHT = /(без подсветк|no highlight|ohne hervorheb|sans surbrillance|sin resaltado|senza evidenzia|sem destaque|bez podświetl|bez podswietl|vurgusuz|без открояване|بدون تمييز|不要高亮|无高亮)/;
const ZOOM = /(зум|зуум|приближ|наезд|zoom|punch|przybliż|przybliz|yakınlaştır|yakinlastir|acercamiento|aproxim|تكبير|زوم|缩放|放大|推近)/;
const STRONG = /(сильн|силн|strong|dramatic|big zoom|stark|\bfort|fuerte|forte|mocn|güçlü|guclu|قوي|强)/;
const SUBTLE = /(лёгк|легк|слегка|(?<!\p{L})лек|subtle|slight|light|leicht|léger|leger|ligero|suave|leggero|\bleve|lekk|hafif|خفيف|轻)/u;
const NO_TRANSITION = /(без переход|убери переход|no transition|remove transition|ohne übergang|keine übergäng|sans transition|sin transici|senza transizion|sem transiç|sem transic|bez przejść|bez przejsc|geçişsiz|gecissiz|без преход|بدون انتقال|无转场|不要转场)/;
const TRANSITION = /(переход|затемн|transition|fade|übergang|übergäng|ubergang|überblend|blende|fondu|transici|fundido|dissolv|transiz|transiç|transic|przejś|przejsc|geçiş|gecis|преход|затъмн|انتقال|تلاش|转场|过渡|淡入|淡出)/;
const BW = /(ч\/б|черно-бел|чб(?!\p{L})|b&w|black and white|grayscale|monochrome|schwarz-?weiß|schwarz-?weiss|noir et blanc|blanco y negro|bianco e nero|preto e branco|czarno-?biał|czarno-?bial|siyah-? ?beyaz|черно-бял|أبيض وأسود|ابيض واسود|黑白)/u;
const VIVID = /(ярч|ярк|сочн|насыщен|наситен|vivid|brighter|vibrant|kräftig|lebendig|\bvif|éclatant|\bvivo|vivace|vívido|żyw|zyw|canlı|canli|زاه|حيوي|鲜艳)/;
const WARM = /(тепл|топъл|топл|warm|chaud|cálid|calid|\bcald|quent|ciepł|ciepl|sıcak|sicak|دافئ|暖)/;
const COOL = /(холодн|студен|cool|cold|kühl|kuhl|kalt|froid|frío|frio|fredd|chłod|chlod|zimn|soğuk|soguk|بارد|冷)/;
const SOFT = /(мягк|приглуш|(?<!\p{L})мек|soft|faded|weich|doux|douce|suave|morbid|miękk|miekk|yumuşak|yumusak|ناعم|柔和)/u;
const NO_FILTER = /(без фильтр|убери фильтр|без филтър|no filter|remove filter|оригинал|original|ohne filter|sans filtre|sin filtro|senza filtro|sem filtro|bez filtr|filtresiz|بدون فلتر|原图|无滤镜|去掉滤镜)/;
const TEXT = /(текст|надпис|заголов|заглавие|title|text|напиши|write|schreib|titel|titre|écri|ecri|texto|escrib|título|titulo|testo|titolo|scriv|escrev|tekst|napisz|metin|metn|başlık|baslik|\byaz|نص|عنوان|اكتب|文字|标题|写)/;
const MUSIC = /(музык|музик|music|трек|track|musik|musique|música|musica|muzyk|müzik|muzik|موسيقى|音乐|配乐)/;
const QUIETER = /(тише|потише|по-тихо|намали|quieter|lower|softer|fainter|leiser|moins fort|plus bas|baisse|más bajo|mas bajo|\bbaja|più bass|piu bass|abbassa|mais baixo|abaix|ciszej|ścisz|scisz|sesini kıs|müziği kıs|muzigi kis|azalt|أخفض|اخفض|خفض|小声|调低|降低|轻一点)/;
const LOUDER = /(громче|по-силно|усили|louder|lauter|plus fort|\bmonte|más alto|mas alto|\bsube|più alt|piu alt|\balza|mais alto|aument|głośniej|glosniej|yükselt|yukselt|sesini aç|sesini ac|ارفع|大声|调高|提高)/;
const MUTE = /(без звука|убери звук|выключи звук|отключи звук|без звук|заглуши|изключи звука|mute|remove (the )?sound|stumm|ohne ton|ton aus|sans son|coupe le son|\bmuet|sin sonido|silencia|quita el sonido|senza audio|\bmuto|togli l'audio|sem som|silenciar|\bmudo|wycisz|bez dźwięku|bez dzwieku|sessize al|sesi kapat|sesini kapat|كتم|بدون صوت|静音|去掉声音|关掉声音)/;
const VERTICAL = /(9[:x/ ]16|вертикал|vertical|vertikal|pionow|dikey|reels|shorts|tik ?tok|тик ?ток|рилс|сторис|stories|عمودي|竖)/;
const HORIZONTAL = /(16[:x/ ]9|горизонт|хоризонт|horizontal|orizzontal|poziom|yatay|youtube|ютуб|landscape|أفقي|افقي|横)/;
const SQUARE = /(1[:x/ ]1|квадрат|square|quadrat|carré|carre|cuadrad|quadrad|kwadrat|kare format|kare video|kare yap|مربع|方形|正方)/;
const CONTAIN = /(целиком|без обрезк|не обрез|цялата картина|без изрязване|whole picture|letterbox|ganzes bild|ohne zuschneiden|image entière|image entiere|sans recadr|imagen completa|sin recortar|immagine intera|senza ritagli|imagem inteira|sem cortar|cały obraz|caly obraz|bez przycinania|tüm görüntü|tum goruntu|kırpmadan|kirpmadan|الصورة كاملة|بدون قص|完整画面|不裁剪)/;
const COVER = /(на весь экран|заполн|запълни|цял екран|fill the frame|full screen|crop to fill|bild füllen|vollbild|remplir|plein écran|plein ecran|llenar|pantalla completa|riempi|schermo intero|preencher|tela cheia|wypełnij|wypelnij|pełny ekran|pelny ekran|kareyi doldur|tam ekran|ملء|填满|全屏)/;

const LIMIT_PATTERNS = [
  /(?:до|не длиннее|максимум|max(?:imum)?|under|up to|bis(?: zu)?|höchstens|maximal|jusqu'à|jusqu’à|moins de|hasta|máximo|maximo|fino a|massimo|até|\bate\b|\bdo\b|maks(?:ymalnie)?|en fazla|en çok|حتى|最多|不超过)\s*(\d{1,3})\s*(?:сек|с(?!\p{L})|s\b|sec|seg|segund|secon|sekund|saniye|sn\b|ثانية|ثوان|秒)/u,
  /(\d{1,3})\s*(?:saniye\w*|sn)\s*(?:ye |ya )?(?:kadar|max)/,
  /(\d{1,3})\s*秒\s*(?:以内|以下|内)/,
];

const has = (s: string, re: RegExp) => re.test(s);

const wordsPerCaption = (s: string) => {
  const m = s.match(/(\d+|\p{L}+)\s*(?:слов|word|wort|wört|\bmot|palabra|parol|palavra|słow|slow|słów|kelime|дум|كلم|个词|个字|词)/u);
  if (!m) return null;
  const token = m[1];
  // Chinese has no spaces, so "每条三个词" captures "每条三": the number is its last character.
  const n = /^\d+$/.test(token) ? Number(token) : NUMBERS[token] ?? NUMBERS[token.slice(-1)];
  return n && n >= 1 && n <= 8 ? n : null;
};

export const parseCommand = (input: string): AgentStep[] => {
  const s = input.toLowerCase().replace(/ё/g, "е");
  const steps: AgentStep[] = [];
  const removing = has(s, REMOVE);
  const adding = has(s, ADD);

  // 1. Timing
  if (has(s, PAUSES)) steps.push({ kind: "silence" });
  for (const re of LIMIT_PATTERNS) {
    const limit = s.match(re);
    if (limit) {
      steps.push({ kind: "limit", seconds: Number(limit[1]) });
      break;
    }
  }

  // 2. Captions
  const mentionsCaptions = has(s, CAPTIONS);
  if (mentionsCaptions && removing && !adding) {
    steps.push({ kind: "removeCaptions" });
  } else if (mentionsCaptions) {
    const language = LANGUAGE_NAMES.find(([, re]) => re.test(s))?.[0] ?? null;
    const words = wordsPerCaption(s) ?? 3;
    const restyleOnly = has(s, BIGGER) || has(s, SMALLER) || has(s, TOP) || has(s, CENTER) || has(s, BOTTOM) || COLORS.some(([re]) => re.test(s));
    if (adding || !restyleOnly) steps.push({ kind: "captions", words, language });
    const patch: Partial<CaptionStyle> = { wordsPerCaption: words };
    if (has(s, BIGGER_A_LITTLE)) patch.size = 0.085;
    else if (has(s, BIGGER)) patch.size = 0.095;
    else if (has(s, SMALLER)) patch.size = 0.06;
    if (has(s, TOP)) patch.y = 0.18;
    else if (has(s, CENTER)) patch.y = 0.5;
    else if (has(s, BOTTOM)) patch.y = 0.8;
    const color = BW.test(s) ? undefined : COLORS.find(([re]) => re.test(s));
    if (color) patch.color = color[1];
    if (has(s, BOX)) patch.box = true;
    if (has(s, LOWER)) patch.upper = false;
    else if (has(s, UPPER)) patch.upper = true;
    if (has(s, NO_HIGHLIGHT)) patch.accent = patch.color ?? "#ffffff";
    steps.push({ kind: "captionStyle", patch });
  }

  // 3. Effects and look
  if (has(s, ZOOM)) {
    if (removing && !adding) steps.push({ kind: "removeZooms" });
    else steps.push({ kind: "zooms", amount: has(s, STRONG) ? 0.2 : has(s, SUBTLE) ? 0.08 : 0.12 });
  }
  if (has(s, NO_TRANSITION)) steps.push({ kind: "transition", on: false });
  else if (has(s, TRANSITION)) steps.push({ kind: "transition", on: !(removing && !adding) });
  if (has(s, BW)) steps.push({ kind: "filter", filter: "bw" });
  else if (has(s, VIVID)) steps.push({ kind: "filter", filter: "vivid" });
  else if (has(s, WARM)) steps.push({ kind: "filter", filter: "warm" });
  else if (has(s, COOL)) steps.push({ kind: "filter", filter: "cool" });
  else if (has(s, SOFT)) steps.push({ kind: "filter", filter: "fade" });
  else if (has(s, NO_FILTER)) steps.push({ kind: "filter", filter: "none" });

  const quoted = input.match(/["«“„'「『]([^"«»“”„'「」『』]{1,120})["»”“'」』]/);
  if (quoted && has(s, TEXT)) {
    const y = has(s, BOTTOM) ? 0.85 : has(s, CENTER) ? 0.5 : 0.15;
    const text = quoted[1].trim();
    if (text) steps.push({ kind: "text", text, y });
  }

  // 4. Sound
  const mentionsMusic = has(s, MUSIC);
  if (mentionsMusic) {
    if (has(s, QUIETER)) steps.push({ kind: "musicVolume", volume: 0.3 });
    else if (has(s, LOUDER)) steps.push({ kind: "musicVolume", volume: 1 });
  }
  if (has(s, MUTE) && !mentionsMusic) steps.push({ kind: "muteClips" });

  // 5. Format
  if (has(s, VERTICAL)) steps.push({ kind: "aspect", aspect: "9:16" });
  else if (has(s, HORIZONTAL)) steps.push({ kind: "aspect", aspect: "16:9" });
  else if (has(s, SQUARE)) steps.push({ kind: "aspect", aspect: "1:1" });
  if (has(s, CONTAIN)) steps.push({ kind: "fit", fit: "contain" });
  else if (has(s, COVER)) steps.push({ kind: "fit", fit: "cover" });

  return steps;
};

// The language a request is written in, for captions when it names none:
// the script decides Arabic, Chinese and Cyrillic; Latin-script requests use
// the site language when that is a Latin-script one, else English.
export const requestLanguage = (text: string, siteLang: Language): CaptionLang => {
  if (/[؀-ۿ]/.test(text)) return "ar";
  if (/[一-鿿]/.test(text)) return "zh";
  if (/[а-яё]/i.test(text)) return siteLang === "bg" ? "bg" : "ru";
  return ["ar", "zh", "ru", "bg"].includes(siteLang) ? "en" : siteLang;
};
