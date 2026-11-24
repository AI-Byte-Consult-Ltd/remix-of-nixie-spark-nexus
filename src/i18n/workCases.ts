/*
 * Homepage "Our work in action" cards (src/components/OurWorkInAction.tsx):
 * the texts visible on the cards in the site languages other than English
 * (added 2026-11-22). Problem / result in the opened card stay English for
 * now. Keyed by case id; anything missing falls back to English.
 */
export interface WorkCaseWords { industry: string; solution: string; metric: string; cta: string }
export interface WorkCasesLang { caseWord: string; cases: Record<string, WorkCaseWords> }

export const workCases: Record<string, WorkCasesLang> = {
  ru: {
    caseWord: "Кейс",
    cases: {
      nicsvideo: { industry: "Контент · Автоматический монтаж", solution: "Загрузите исходные клипы, и NICS Video смонтирует их сам: вертикальный короткий ролик и горизонтальное длинное видео с обложками на русском и английском, а для точной доводки есть NICS Studio прямо в браузере.", metric: "Формата из одной загрузки: короткий + длинный", cta: "Попробовать NICS Video" },
      alessandrostudio: { industry: "Коллекционные вещи · 3D-печать", solution: "Готовые миниатюрные домики и коллекционные фигурки, напечатанные на 3D-принтере, плюс AI-студия, которая превращает ваше фото в 3D-модель: мы печатаем её, расписываем вручную и отправляем вам.", metric: "Готовые и индивидуальные заказы", cta: "Открыть Alessandro Studio" },
      nicstrading: { industry: "Трейдинг · Аналитика рынка", solution: "NICS Trading Ecosystem в реальном времени читает price action, Ichimoku, Фибоначчи и объёмы и присылает теханализ с оценкой уверенности, входом, стопом и тейками прямо в Telegram и MT5 через интеграцию с брокером Vantage.", metric: "Анализ рынка без перерыва", cta: "Узнать про AI-трейдинг" },
      propertypartner: { industry: "Недвижимость · Застройщики и агентства", solution: "Всё под ключ: профессиональный сайт недвижимости, AI-чат на сайте и AI-агент в WhatsApp/Telegram, который круглосуточно отвечает на вопросы, присылает объекты и записывает на просмотры.", metric: "Ответ клиентам круглосуточно", cta: "Собрать пакет для недвижимости" },
      aquaterra: { industry: "Метавселенная · Обучение ИИ", solution: "AquaTerra World — наш проект метавселенной: 640 000 виртуальных участков как интерактивная среда для обучения ИИ. Разработка сейчас на паузе, пока мы заняты другими приоритетами.", metric: "Виртуальных участков в плане", cta: "Посмотреть AquaTerra World" },
      multimedia: { industry: "Музыка · Мультимедиа", solution: "Текст, музыкальная идея и визуальная концепция полностью от Александра Точилова, техническое производство NICS Multimedia. Трек «Just Live» уже вышел на Spotify и других стриминговых платформах.", metric: "Трек вышел, следующие в работе", cta: "Читать историю" },
      pride: { industry: "Соцсеть · Сообщество", solution: "Мы сами спроектировали и построили PRIDE Social Network (pride.aibyteconsult.com) от начала до конца: профили, ленты и функции сообщества, без готовых шаблонов.", metric: "Собственная разработка, уже работает", cta: "Открыть PRIDE Social" },
    },
  },
  bg: {
    caseWord: "Казус",
    cases: {
      nicsvideo: { industry: "Съдържание · Автоматичен монтаж", solution: "Качете суровите клипове и NICS Video ги монтира сам: вертикално кратко видео и хоризонтално дълго видео с корици на руски и английски, а за фина настройка има NICS Studio направо в браузъра.", metric: "Формата от едно качване: кратко + дълго", cta: "Опитайте NICS Video" },
      alessandrostudio: { industry: "Колекционерски предмети · 3D печат", solution: "Готови миниатюрни къщички и колекционерски фигурки, отпечатани на 3D принтер, плюс AI студио, което превръща ваша снимка в 3D модел: отпечатваме го, оцветяваме на ръка и ви го изпращаме.", metric: "Готови и индивидуални поръчки", cta: "Към Alessandro Studio" },
      nicstrading: { industry: "Трейдинг · Пазарен анализ", solution: "NICS Trading Ecosystem чете в реално време price action, Ichimoku, Фибоначи и обеми и изпраща технически анализ с оценка на увереността, вход, стоп и тейкове направо в Telegram и MT5 чрез интеграцията с брокера Vantage.", metric: "Пазарен анализ без прекъсване", cta: "Вижте AI трейдинга" },
      propertypartner: { industry: "Недвижими имоти · Строители и агенции", solution: "Пълен пакет: професионален сайт за имоти, AI чат на сайта и AI агент в WhatsApp/Telegram, който денонощно отговаря на въпроси, изпраща оферти и записва огледи.", metric: "Отговор на клиентите денонощно", cta: "Съберете пакет за имоти" },
      aquaterra: { industry: "Метавселена · Обучение по ИИ", solution: "AquaTerra World е нашият проект за метавселена: 640 000 виртуални парцела като интерактивна среда за обучение по ИИ. Разработката е на пауза, докато сме заети с други приоритети.", metric: "Планирани виртуални парцела", cta: "Вижте AquaTerra World" },
      multimedia: { industry: "Музика · Мултимедия", solution: "Текст, музикална идея и визуална концепция изцяло от Александър Точилов, техническа продукция NICS Multimedia. Песента „Just Live“ вече е в Spotify и други стрийминг платформи.", metric: "Издадена песен, следващите са в работа", cta: "Прочетете историята" },
      pride: { industry: "Социална мрежа · Общност", solution: "Проектирахме и изградихме сами PRIDE Social Network (pride.aibyteconsult.com) от начало до край: профили, потоци и функции за общността, без готови шаблони.", metric: "Собствена разработка, вече работи", cta: "Към PRIDE Social" },
    },
  },
  de: {
    caseWord: "Fall",
    cases: {
      nicsvideo: { industry: "Content · Automatischer Videoschnitt", solution: "Laden Sie Ihr Rohmaterial hoch und NICS Video schneidet es automatisch: ein vertikales Kurzvideo und ein horizontales Langvideo mit Covern auf Russisch und Englisch, dazu NICS Studio für den Feinschliff im Browser.", metric: "Formate aus einem Upload: kurz + lang", cta: "NICS Video testen" },
      alessandrostudio: { industry: "Sammlerstücke · 3D-Druck-Miniaturen", solution: "Fertige 3D-gedruckte Miniaturhäuser und Sammlerstücke, dazu ein KI-Studio, das Ihr eigenes Foto in ein 3D-Modell verwandelt, das wir drucken, von Hand bemalen und Ihnen schicken.", metric: "Fertige und individuelle Bestellungen", cta: "Zu Alessandro Studio" },
      nicstrading: { industry: "Trading · Marktanalyse", solution: "NICS Trading Ecosystem liest Price Action, Ichimoku, Fibonacci und Volumen in Echtzeit und liefert technische Analysen mit Konfidenzwert, Einstieg, Stop und Take-Profit direkt in Telegram und MT5 über unsere Anbindung an den Broker Vantage.", metric: "Marktanalyse rund um die Uhr", cta: "KI-Trading entdecken" },
      propertypartner: { industry: "Immobilien · Bauträger und Agenturen", solution: "Das Komplettpaket: eine professionelle Immobilien-Website, ein KI-Chat auf der Seite und ein KI-Agent in WhatsApp/Telegram, der rund um die Uhr Fragen beantwortet, Angebote schickt und Besichtigungen bucht.", metric: "Antwort an Interessenten rund um die Uhr", cta: "Mein Immobilienpaket anfragen" },
      aquaterra: { industry: "Metaverse · KI-Bildung", solution: "AquaTerra World ist unser Metaverse-Projekt: 640.000 virtuelle Parzellen als interaktive Lernumgebung für KI. Die Entwicklung ruht derzeit, weil wir uns auf andere Prioritäten konzentrieren.", metric: "Geplante virtuelle Parzellen", cta: "AquaTerra World ansehen" },
      multimedia: { industry: "Musik · Multimedia", solution: "Text, musikalische Idee und visuelles Konzept vollständig von Aleksandr Tochilov, technische Produktion von NICS Multimedia. Auf Spotify und anderen Streaming-Plattformen veröffentlicht, angefangen mit dem Track „Just Live“.", metric: "Track veröffentlicht, weitere in Arbeit", cta: "Die Geschichte lesen" },
      pride: { industry: "Soziales Netzwerk · Community", solution: "Wir haben PRIDE Social Network (pride.aibyteconsult.com) komplett selbst entworfen und gebaut: Profile, Feeds und Community-Funktionen, ohne Vorlage.", metric: "Eigenentwicklung, bereits online", cta: "Zu PRIDE Social" },
    },
  },
  es: {
    caseWord: "Caso",
    cases: {
      nicsvideo: { industry: "Contenido · Edición automática de vídeo", solution: "Sube tus clips en bruto y NICS Video los edita solo: un vídeo corto vertical y uno largo horizontal con portadas en ruso e inglés, además de NICS Studio para retocar en el navegador.", metric: "Formatos con una sola subida: corto + largo", cta: "Probar NICS Video" },
      alessandrostudio: { industry: "Coleccionables · Miniaturas impresas en 3D", solution: "Casitas en miniatura y piezas de colección impresas en 3D, además de un estudio con IA que convierte tu propia foto en un modelo 3D que imprimimos, pintamos a mano y te enviamos.", metric: "Pedidos listos y personalizados", cta: "Ir a Alessandro Studio" },
      nicstrading: { industry: "Trading · Inteligencia de mercado", solution: "NICS Trading Ecosystem lee en tiempo real price action, Ichimoku, Fibonacci y volumen, y envía análisis técnico con nivel de confianza, entrada, stop y take profit directamente a Telegram y MT5 mediante nuestra integración con el bróker Vantage.", metric: "Análisis de mercado sin pausa", cta: "Descubrir el trading con IA" },
      propertypartner: { industry: "Inmobiliaria · Promotoras y agencias", solution: "El paquete completo: una web inmobiliaria profesional, un chat con IA en la web y un agente de IA en WhatsApp/Telegram que responde preguntas, envía inmuebles y agenda visitas a cualquier hora.", metric: "Respuesta a clientes las 24 horas", cta: "Crear mi paquete inmobiliario" },
      aquaterra: { industry: "Metaverso · Educación en IA", solution: "AquaTerra World es nuestro proyecto de metaverso: 640.000 parcelas virtuales pensadas como entorno interactivo para aprender IA. El desarrollo está en pausa mientras nos centramos en otras prioridades.", metric: "Parcelas virtuales previstas", cta: "Ver AquaTerra World" },
      multimedia: { industry: "Música · Multimedia", solution: "Letra, idea musical y dirección visual íntegramente de Aleksandr Tochilov; producción técnica de NICS Multimedia. Publicado en Spotify y otras plataformas, empezando por el tema «Just Live».", metric: "Tema publicado, más en camino", cta: "Leer la historia" },
      pride: { industry: "Red social · Comunidad", solution: "Diseñamos y construimos PRIDE Social Network (pride.aibyteconsult.com) de principio a fin: perfiles, feeds y funciones de comunidad, hechos por nosotros y no con una plantilla.", metric: "Desarrollo propio, ya en marcha", cta: "Ir a PRIDE Social" },
    },
  },
  fr: {
    caseWord: "Cas",
    cases: {
      nicsvideo: { industry: "Création de contenu · Montage vidéo automatique", solution: "Envoyez vos rushes et NICS Video les monte automatiquement : une vidéo courte verticale et une vidéo longue horizontale avec miniatures en russe et en anglais, plus NICS Studio pour les retouches dans le navigateur.", metric: "Formats à partir d'un envoi : court + long", cta: "Essayer NICS Video" },
      alessandrostudio: { industry: "Objets de collection · Miniatures imprimées en 3D", solution: "Des maisons miniatures et des objets de collection imprimés en 3D, plus un studio IA qui transforme votre photo en modèle 3D que nous imprimons, peignons à la main et vous expédions.", metric: "Commandes prêtes et sur mesure", cta: "Voir Alessandro Studio" },
      nicstrading: { industry: "Trading · Intelligence de marché", solution: "NICS Trading Ecosystem lit en temps réel le price action, l'Ichimoku, les Fibonacci et les volumes, puis envoie une analyse technique avec indice de confiance, entrée, stop et objectifs directement sur Telegram et MT5 via notre intégration avec le courtier Vantage.", metric: "Analyse de marché en continu", cta: "Découvrir le trading IA" },
      propertypartner: { industry: "Immobilier · Promoteurs et agences", solution: "La solution complète : un site immobilier professionnel, un chat IA sur le site et un agent IA dans WhatsApp/Telegram qui répond aux questions, envoie des annonces et planifie des visites jour et nuit.", metric: "Réponse aux prospects 24 h/24", cta: "Créer mon pack immobilier" },
      aquaterra: { industry: "Métavers · Éducation à l'IA", solution: "AquaTerra World est notre projet de métavers : 640 000 parcelles virtuelles conçues comme un environnement interactif pour apprendre l'IA. Le développement est en pause pendant que nous nous concentrons sur d'autres priorités.", metric: "Parcelles virtuelles prévues", cta: "Voir AquaTerra World" },
      multimedia: { industry: "Musique · Multimédia", solution: "Paroles, idée musicale et direction visuelle entièrement signées Aleksandr Tochilov ; production technique par NICS Multimedia. Sorti sur Spotify et d'autres plateformes, à commencer par le titre « Just Live ».", metric: "Titre sorti, d'autres en préparation", cta: "Lire l'histoire" },
      pride: { industry: "Réseau social · Communauté", solution: "Nous avons conçu et développé PRIDE Social Network (pride.aibyteconsult.com) de bout en bout : profils, fils d'actualité et fonctions communautaires, faits maison et non à partir d'un modèle.", metric: "Développé en interne, déjà en ligne", cta: "Voir PRIDE Social" },
    },
  },
  it: {
    caseWord: "Caso",
    cases: {
      nicsvideo: { industry: "Contenuti · Montaggio video automatico", solution: "Carica le tue clip grezze e NICS Video le monta in automatico: un video corto verticale e un video lungo orizzontale con copertine in russo e in inglese, più NICS Studio per le rifiniture nel browser.", metric: "Formati da un solo caricamento: corto + lungo", cta: "Prova NICS Video" },
      alessandrostudio: { industry: "Collezionismo · Miniature stampate in 3D", solution: "Casette in miniatura e pezzi da collezione stampati in 3D, più uno studio IA che trasforma una tua foto in un modello 3D che stampiamo, dipingiamo a mano e ti spediamo.", metric: "Ordini pronti e personalizzati", cta: "Visita Alessandro Studio" },
      nicstrading: { industry: "Trading · Analisi di mercato", solution: "NICS Trading Ecosystem legge in tempo reale price action, Ichimoku, Fibonacci e volumi e invia analisi tecniche con livello di fiducia, ingresso, stop e take profit direttamente su Telegram e MT5 tramite la nostra integrazione con il broker Vantage.", metric: "Analisi di mercato senza pause", cta: "Scopri il trading con IA" },
      propertypartner: { industry: "Immobiliare · Costruttori e agenzie", solution: "Il pacchetto completo: un sito immobiliare professionale, una chat IA sul sito e un agente IA su WhatsApp/Telegram che risponde alle domande, invia annunci e fissa visite a qualsiasi ora.", metric: "Risposta ai clienti 24 ore su 24", cta: "Crea il mio pacchetto immobiliare" },
      aquaterra: { industry: "Metaverso · Formazione sull'IA", solution: "AquaTerra World è il nostro progetto di metaverso: 640.000 lotti virtuali pensati come ambiente interattivo per imparare l'IA. Lo sviluppo è in pausa mentre ci concentriamo su altre priorità.", metric: "Lotti virtuali previsti", cta: "Guarda AquaTerra World" },
      multimedia: { industry: "Musica · Multimedia", solution: "Testo, idea musicale e direzione visiva interamente di Aleksandr Tochilov; produzione tecnica di NICS Multimedia. Pubblicato su Spotify e altre piattaforme di streaming, a partire dal brano «Just Live».", metric: "Brano pubblicato, altri in lavorazione", cta: "Leggi la storia" },
      pride: { industry: "Social network · Comunità", solution: "Abbiamo progettato e costruito PRIDE Social Network (pride.aibyteconsult.com) da cima a fondo: profili, feed e funzioni per la comunità, sviluppati da noi e non su un modello.", metric: "Sviluppo interno, già online", cta: "Visita PRIDE Social" },
    },
  },
  pl: {
    caseWord: "Projekt",
    cases: {
      nicsvideo: { industry: "Treści · Automatyczny montaż wideo", solution: "Wgraj surowe klipy, a NICS Video zmontuje je automatycznie: pionowy krótki film i poziomy długi film z okładkami po rosyjsku i angielsku, a do poprawek jest NICS Studio w przeglądarce.", metric: "Formaty z jednego wgrania: krótki + długi", cta: "Wypróbuj NICS Video" },
      alessandrostudio: { industry: "Kolekcjonerstwo · Miniatury z druku 3D", solution: "Gotowe miniaturowe domki i przedmioty kolekcjonerskie z druku 3D oraz studio AI, które zamienia Twoje zdjęcie w model 3D: drukujemy go, ręcznie malujemy i wysyłamy do Ciebie.", metric: "Zamówienia gotowe i na zamówienie", cta: "Odwiedź Alessandro Studio" },
      nicstrading: { industry: "Trading · Analiza rynku", solution: "NICS Trading Ecosystem w czasie rzeczywistym czyta price action, Ichimoku, Fibonacciego i wolumen, a potem wysyła analizę techniczną z oceną pewności, wejściem, stopem i take profitami prosto do Telegrama i MT5 dzięki integracji z brokerem Vantage.", metric: "Analiza rynku bez przerwy", cta: "Poznaj trading z AI" },
      propertypartner: { industry: "Nieruchomości · Deweloperzy i agencje", solution: "Kompletny pakiet: profesjonalna strona nieruchomości, czat AI na stronie i agent AI w WhatsApp/Telegramie, który przez całą dobę odpowiada na pytania, wysyła oferty i umawia oglądanie.", metric: "Odpowiedź klientom całą dobę", cta: "Zbuduj mój pakiet nieruchomości" },
      aquaterra: { industry: "Metawersum · Edukacja AI", solution: "AquaTerra World to nasz projekt metawersum: 640 000 wirtualnych działek pomyślanych jako interaktywne środowisko do nauki AI. Prace są wstrzymane, bo skupiamy się na innych priorytetach.", metric: "Planowanych wirtualnych działek", cta: "Zobacz AquaTerra World" },
      multimedia: { industry: "Muzyka · Multimedia", solution: "Tekst, pomysł muzyczny i koncepcja wizualna w całości autorstwa Aleksandra Tochilova; produkcja techniczna NICS Multimedia. Wydane na Spotify i innych platformach, zaczynając od utworu „Just Live”.", metric: "Utwór wydany, kolejne w przygotowaniu", cta: "Przeczytaj historię" },
      pride: { industry: "Sieć społecznościowa · Społeczność", solution: "Zaprojektowaliśmy i zbudowaliśmy PRIDE Social Network (pride.aibyteconsult.com) od początku do końca: profile, kanały i funkcje społeczności, własnymi siłami, a nie na gotowym szablonie.", metric: "Własna budowa, już działa", cta: "Odwiedź PRIDE Social" },
    },
  },
  pt: {
    caseWord: "Caso",
    cases: {
      nicsvideo: { industry: "Conteúdo · Edição automática de vídeo", solution: "Envie seus clipes brutos e o NICS Video edita tudo automaticamente: um vídeo curto vertical e um vídeo longo horizontal com capas em russo e inglês, além do NICS Studio para ajustes no navegador.", metric: "Formatos com um único envio: curto + longo", cta: "Experimentar o NICS Video" },
      alessandrostudio: { industry: "Colecionáveis · Miniaturas impressas em 3D", solution: "Casinhas em miniatura e peças colecionáveis impressas em 3D, além de um estúdio com IA que transforma sua foto em um modelo 3D que imprimimos, pintamos à mão e enviamos para você.", metric: "Pedidos prontos e personalizados", cta: "Visitar o Alessandro Studio" },
      nicstrading: { industry: "Trading · Inteligência de mercado", solution: "O NICS Trading Ecosystem lê em tempo real price action, Ichimoku, Fibonacci e volume e envia análise técnica com nível de confiança, entrada, stop e alvos direto para o Telegram e o MT5 pela nossa integração com a corretora Vantage.", metric: "Análise de mercado sem pausa", cta: "Conhecer o trading com IA" },
      propertypartner: { industry: "Imóveis · Incorporadoras e imobiliárias", solution: "O pacote completo: um site imobiliário profissional, um chat com IA no site e um agente de IA no WhatsApp/Telegram que responde dúvidas, envia imóveis e agenda visitas a qualquer hora.", metric: "Resposta a clientes 24 horas", cta: "Montar meu pacote imobiliário" },
      aquaterra: { industry: "Metaverso · Educação em IA", solution: "AquaTerra World é nosso projeto de metaverso: 640.000 lotes virtuais pensados como ambiente interativo para aprender IA. O desenvolvimento está pausado enquanto focamos em outras prioridades.", metric: "Lotes virtuais planejados", cta: "Ver o AquaTerra World" },
      multimedia: { industry: "Música · Multimídia", solution: "Letra, ideia musical e direção visual inteiramente de Aleksandr Tochilov; produção técnica da NICS Multimedia. Lançado no Spotify e em outras plataformas, começando pela faixa \"Just Live\".", metric: "Faixa lançada, outras a caminho", cta: "Ler a história" },
      pride: { industry: "Rede social · Comunidade", solution: "Projetamos e construímos a PRIDE Social Network (pride.aibyteconsult.com) de ponta a ponta: perfis, feeds e recursos de comunidade, feitos por nós e não a partir de um modelo pronto.", metric: "Desenvolvimento próprio, já no ar", cta: "Visitar o PRIDE Social" },
    },
  },
  tr: {
    caseWord: "Proje",
    cases: {
      nicsvideo: { industry: "İçerik · Otomatik video kurgu", solution: "Ham kliplerinizi yükleyin, NICS Video otomatik olarak kurgulasın: Rusça ve İngilizce kapaklı dikey bir kısa video ile yatay bir uzun video; ince ayar için de tarayıcıda NICS Studio.", metric: "Tek yüklemeden format: kısa + uzun", cta: "NICS Video'yu dene" },
      alessandrostudio: { industry: "Koleksiyon · 3D baskı minyatürler", solution: "3D yazıcıda basılmış hazır minyatür evler ve koleksiyon parçaları; ayrıca kendi fotoğrafınızı 3D modele dönüştüren bir yapay zekâ stüdyosu: modeli basıyor, elle boyuyor ve size gönderiyoruz.", metric: "Hazır ve kişiye özel siparişler", cta: "Alessandro Studio'ya git" },
      nicstrading: { industry: "Trading · Piyasa analizi", solution: "NICS Trading Ecosystem price action, Ichimoku, Fibonacci ve hacmi gerçek zamanlı okur; güven puanlı teknik analizi giriş, stop ve kâr al seviyeleriyle birlikte Vantage aracı kurum entegrasyonumuz üzerinden doğrudan Telegram'a ve MT5'e gönderir.", metric: "Kesintisiz piyasa analizi", cta: "Yapay zekâ ile trading'i keşfet" },
      propertypartner: { industry: "Gayrimenkul · Müteahhitler ve ofisler", solution: "Eksiksiz paket: profesyonel bir emlak sitesi, sitede yapay zekâ sohbeti ve WhatsApp/Telegram'da günün her saati soruları yanıtlayan, ilan gönderen ve gezme randevusu ayarlayan bir yapay zekâ ajanı.", metric: "Müşterilere 7/24 yanıt", cta: "Emlak paketimi oluştur" },
      aquaterra: { industry: "Metaverse · Yapay zekâ eğitimi", solution: "AquaTerra World metaverse projemiz: yapay zekâ öğrenimi için etkileşimli bir ortam olarak tasarlanmış 640.000 sanal arsa. Diğer önceliklere odaklandığımız için geliştirme şu an duraklatıldı.", metric: "Planlanan sanal arsa", cta: "AquaTerra World'ü gör" },
      multimedia: { industry: "Müzik · Multimedya", solution: "Söz, müzik fikri ve görsel yönetim tamamen Aleksandr Tochilov'a ait; teknik prodüksiyon NICS Multimedia. \"Just Live\" parçasıyla başlayarak Spotify ve diğer platformlarda yayında.", metric: "Parça yayında, yenileri yolda", cta: "Hikâyeyi oku" },
      pride: { industry: "Sosyal ağ · Topluluk", solution: "PRIDE Social Network'ü (pride.aibyteconsult.com) baştan sona kendimiz tasarlayıp geliştirdik: profiller, akışlar ve topluluk özellikleri, hazır şablon kullanmadan.", metric: "Kendi geliştirmemiz, şu an yayında", cta: "PRIDE Social'a git" },
    },
  },
  zh: {
    caseWord: "案例",
    cases: {
      nicsvideo: { industry: "内容创作 · 自动剪辑", solution: "上传原始素材，NICS Video 会自动剪辑：一条竖屏短视频和一条横屏长视频，附带俄语和英语封面；还可以在浏览器中用 NICS Studio 精修。", metric: "种格式，一次上传：短视频 + 长视频", cta: "试用 NICS Video" },
      alessandrostudio: { industry: "收藏品 · 3D 打印微缩模型", solution: "现成的 3D 打印微缩房屋和收藏品，另有 AI 工作室可把您的照片变成 3D 模型，由我们打印、手工上色并寄给您。", metric: "现货与定制订单", cta: "访问 Alessandro Studio" },
      nicstrading: { industry: "交易 · 市场分析", solution: "NICS Trading Ecosystem 实时解读价格行为、一目均衡表、斐波那契和成交量，并通过与经纪商 Vantage 的集成，把带置信度、入场、止损和止盈的技术分析直接推送到 Telegram 和 MT5。", metric: "全天候市场分析", cta: "了解 AI 交易" },
      propertypartner: { industry: "房地产 · 开发商与中介", solution: "一站式方案：专业的房产网站、网站上的 AI 聊天，以及 WhatsApp/Telegram 中的 AI 助手，全天候回答问题、发送房源并预约看房。", metric: "全天候回复客户", cta: "定制我的房产方案" },
      aquaterra: { industry: "元宇宙 · AI 教育", solution: "AquaTerra World 是我们的元宇宙项目：64 万块虚拟地块，设计为学习 AI 的互动环境。由于我们正专注于其他优先事项，开发目前暂停。", metric: "块规划中的虚拟地块", cta: "查看 AquaTerra World" },
      multimedia: { industry: "音乐 · 多媒体", solution: "歌词、音乐创意和视觉方向全部出自 Aleksandr Tochilov，技术制作由 NICS Multimedia 完成。首支单曲《Just Live》已在 Spotify 等流媒体平台发布。", metric: "首单曲已发布，更多在制作中", cta: "阅读故事" },
      pride: { industry: "社交网络 · 社群", solution: "我们从头到尾自主设计并开发了 PRIDE Social Network（pride.aibyteconsult.com）：个人资料、动态和社群功能，全部自研而非套用模板。", metric: "自主开发，已上线", cta: "访问 PRIDE Social" },
    },
  },
  ar: {
    caseWord: "مشروع",
    cases: {
      nicsvideo: { industry: "صناعة المحتوى · مونتاج فيديو تلقائي", solution: "ارفع مقاطعك الخام وسيقوم NICS Video بمونتاجها تلقائيًا: فيديو قصير عمودي وفيديو طويل أفقي مع أغلفة بالروسية والإنجليزية، إضافة إلى NICS Studio للتعديلات الدقيقة في المتصفح.", metric: "صيغتان من رفع واحد: قصير + طويل", cta: "جرّب NICS Video" },
      alessandrostudio: { industry: "مقتنيات · مجسّمات مطبوعة ثلاثية الأبعاد", solution: "منازل مصغّرة وقطع للهواة مطبوعة بتقنية ثلاثية الأبعاد، إضافة إلى استوديو بالذكاء الاصطناعي يحوّل صورتك إلى نموذج ثلاثي الأبعاد نطبعه ونلوّنه يدويًا ونرسله إليك.", metric: "طلبات جاهزة ومخصّصة", cta: "زيارة Alessandro Studio" },
      nicstrading: { industry: "التداول · تحليل السوق", solution: "يقرأ NICS Trading Ecosystem حركة السعر وإيشيموكو وفيبوناتشي والحجم في الوقت الفعلي، ثم يرسل تحليلًا فنيًا بدرجة ثقة مع الدخول ووقف الخسارة وأهداف الربح مباشرة إلى Telegram وMT5 عبر تكاملنا مع الوسيط Vantage.", metric: "تحليل للسوق دون توقف", cta: "اكتشف التداول بالذكاء الاصطناعي" },
      propertypartner: { industry: "العقارات · المطوّرون والوكالات", solution: "الحزمة الكاملة: موقع عقاري احترافي، ودردشة بالذكاء الاصطناعي على الموقع، ووكيل ذكاء اصطناعي في WhatsApp/Telegram يجيب عن الأسئلة ويرسل العقارات ويحجز المعاينات على مدار الساعة.", metric: "رد على العملاء على مدار الساعة", cta: "أنشئ حزمتي العقارية" },
      aquaterra: { industry: "ميتافيرس · تعليم الذكاء الاصطناعي", solution: "AquaTerra World هو مشروع الميتافيرس الخاص بنا: 640,000 قطعة أرض افتراضية صُمّمت كبيئة تفاعلية لتعلّم الذكاء الاصطناعي. التطوير متوقف حاليًا بينما نركّز على أولويات أخرى.", metric: "قطعة أرض افتراضية مخطط لها", cta: "شاهد AquaTerra World" },
      multimedia: { industry: "موسيقى · وسائط متعددة", solution: "الكلمات والفكرة الموسيقية والرؤية البصرية بالكامل من Aleksandr Tochilov، والإنتاج التقني من NICS Multimedia. صدرت على Spotify ومنصات بث أخرى، بدءًا بأغنية \"Just Live\".", metric: "أغنية صدرت، والمزيد قيد العمل", cta: "اقرأ القصة" },
      pride: { industry: "شبكة اجتماعية · مجتمع", solution: "صمّمنا وبنينا PRIDE Social Network ‏(pride.aibyteconsult.com) من البداية إلى النهاية: الملفات الشخصية والخلاصات وميزات المجتمع، بتطوير داخلي وليس على قالب جاهز.", metric: "تطوير داخلي، يعمل اليوم", cta: "زيارة PRIDE Social" },
    },
  },
};
