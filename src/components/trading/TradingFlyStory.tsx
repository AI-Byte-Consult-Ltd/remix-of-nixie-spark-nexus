import { ArrowRight, RefreshCw, Sparkles } from "lucide-react";
import type { Language } from "@/contexts/LanguageContext";
import { FlySvg } from "@/components/trading/HeroFly";

// /trading story block after Verified Track Record: the digital-fly trading
// experiment that inspired our nightly reward engine. Facts only: the reward
// engine runs as a parallel stream since 2026-09-17, no claim that it made the
// signals profitable (the real numbers are in the track record above it).

const SOURCE_URL = "https://bits.media/mozg-mukhi-smogli-zastavit-zanimatsya-kriptotreydingom/";

interface StoryStrings {
  badge: string;
  title: string;
  intro: string;
  idea: string;
  howTitle: string;
  how: string;
  honestTitle: string;
  honest: string;
  nextTitle: string;
  next: string;
  source: string;
  loopTitle: string;
  steps: [string, string, string, string, string];
}

const strings: Record<Language, StoryStrings> = {
  en: {
    badge: "Inspired by an experiment",
    title: "A fly that learns to trade, and what we took from it",
    intro:
      "In September 2026, Coinbase engineer Alex Wormuth showed an unusual experiment. He took a digital model of a fruit fly brain (166,700 neurons and 25.6 million connections) and showed it a Bitcoin chart. The price was turned into an image for the fly's \"eyes\", and its reactions were translated into buy, sell or wait. A profit gave the fly \"dopamine\", a loss switched on aversion neurons, a \"punishment\". It traded with a virtual $100. The author is honest that he has not yet proven the fly learned to trade profitably. It is research, not a ready-made strategy.",
    idea:
      "What caught our attention was the idea itself: a system that learns not only from the rules written for it, but also from the consequences of its own decisions. We brought this principle into NICS AI Trader.",
    howTitle: "How it works in our system",
    how:
      "The main analysis stays the same: technical analysis of gold, forex and crypto, an entry, a stop and four targets. Alongside it, a separate parallel stream runs every night: the reward engine. It takes all closed signals, groups them by setup type and calculates the real result in R. Setup types that ended in profit get \"dopamine\", and confidence in them rises slightly. Types that ended in a loss get a \"penalty\", and confidence goes down. The steps are small and capped, so one bad week cannot turn the system upside down. This stream has been running since 17 September 2026.",
    honestTitle: "Honest about results",
    honest:
      "It is too early to say this has made the signals more profitable. All real results, good and bad, are in the Verified Track Record above. If the approach does not pay off, we will say so here.",
    nextTitle: "What's next",
    next:
      "We keep developing this stream. The digital fly is already in our GitHub repository, and we are connecting it now. It will first run in a separate sandbox, with no client money, and we will show how it does.",
    source: "Source: bits.media",
    loopTitle: "The reward loop",
    steps: ["Signal", "Trade closes", "Result in R", "Dopamine or penalty", "New confidence"],
  },
  ru: {
    badge: "Вдохновлено экспериментом",
    title: "Муха, которая учится торговать, и что мы у неё переняли",
    intro:
      "В сентябре 2026 года программист Coinbase Алекс Вормут показал необычный эксперимент. Он взял цифровую модель мозга плодовой мушки дрозофилы (166 700 нейронов и 25,6 млн связей) и показал ей график биткоина. Цена превращалась в картинку для «глаз» мухи, а её реакции переводились в «купить», «продать» или «ждать». За прибыль муха получала «дофамин», за убыток включались нейроны отвращения, то есть «наказание». Торговала она виртуальными 100 долларов. Автор честно пишет, что пока не доказал, что муха научилась торговать в плюс. Это исследование, а не готовая стратегия.",
    idea:
      "Нас зацепила сама идея: система учится не только по правилам, которые ей написали, но и на последствиях собственных решений. Этот принцип мы перенесли в NICS AI Trader.",
    howTitle: "Как это устроено у нас",
    how:
      "Основной анализ остаётся прежним: технический разбор золота, валют и крипты, точка входа, стоп и четыре цели. Параллельно с ним каждую ночь работает отдельный поток, движок наград. Он берёт все закрытые сигналы, группирует их по типу сетапа и считает реальный итог в R. Типы сделок, которые принесли плюс, получают «дофамин», и уверенность в них немного растёт. Типы, которые дали минус, получают «штраф», и уверенность снижается. Шаги маленькие и ограниченные, чтобы одна неудачная неделя не перевернула систему. Поток работает с 17 сентября 2026 года.",
    honestTitle: "Честно о результатах",
    honest:
      "Пока рано говорить, что это сделало сигналы прибыльнее. Все реальные итоги, хорошие и плохие, вы видите в блоке Verified Track Record выше. Если подход себя не оправдает, мы так и напишем.",
    nextTitle: "Что дальше",
    next:
      "Мы продолжаем развивать этот поток. Цифровая муха уже лежит в нашем репозитории на GitHub, и сейчас мы её подключаем. Сначала она будет работать в отдельной песочнице, без денег клиентов, и мы покажем, как она справляется.",
    source: "Источник: bits.media",
    loopTitle: "Круг наград",
    steps: ["Сигнал", "Сделка закрыта", "Итог в R", "Дофамин или штраф", "Новая уверенность"],
  },
  de: {
    badge: "Inspiriert von einem Experiment",
    title: "Eine Fliege, die traden lernt, und was wir von ihr übernommen haben",
    intro:
      "Im September 2026 stellte der Coinbase-Entwickler Alex Wormuth ein ungewöhnliches Experiment vor. Er nahm ein digitales Modell des Gehirns einer Fruchtfliege (166.700 Neuronen und 25,6 Millionen Verbindungen) und zeigte ihm einen Bitcoin-Chart. Der Kurs wurde in ein Bild für die „Augen“ der Fliege umgewandelt, ihre Reaktionen in Kaufen, Verkaufen oder Warten übersetzt. Für Gewinn bekam die Fliege „Dopamin“, bei Verlust wurden Abneigungsneuronen aktiviert, eine „Strafe“. Gehandelt wurde mit virtuellen 100 Dollar. Der Autor schreibt offen, dass er noch nicht bewiesen hat, dass die Fliege profitabel traden gelernt hat. Es ist Forschung, keine fertige Strategie.",
    idea:
      "Uns hat die Idee selbst gepackt: Ein System lernt nicht nur aus den Regeln, die man ihm geschrieben hat, sondern auch aus den Folgen seiner eigenen Entscheidungen. Dieses Prinzip haben wir in NICS AI Trader übernommen.",
    howTitle: "So funktioniert es bei uns",
    how:
      "Die Hauptanalyse bleibt gleich: technische Analyse von Gold, Forex und Krypto, ein Einstieg, ein Stop und vier Ziele. Parallel dazu läuft jede Nacht ein eigener Strang: die Belohnungs-Engine. Sie nimmt alle geschlossenen Signale, gruppiert sie nach Setup-Typ und berechnet das reale Ergebnis in R. Setup-Typen mit Gewinn bekommen „Dopamin“, das Vertrauen in sie steigt leicht. Typen mit Verlust bekommen eine „Strafe“, das Vertrauen sinkt. Die Schritte sind klein und begrenzt, damit eine schlechte Woche das System nicht umwirft. Dieser Strang läuft seit dem 17. September 2026.",
    honestTitle: "Ehrlich zu den Ergebnissen",
    honest:
      "Es ist zu früh zu sagen, dass die Signale dadurch profitabler geworden sind. Alle realen Ergebnisse, gute wie schlechte, sehen Sie oben im Verified Track Record. Wenn sich der Ansatz nicht bewährt, schreiben wir das hier.",
    nextTitle: "Wie es weitergeht",
    next:
      "Wir entwickeln diesen Strang weiter. Die digitale Fliege liegt bereits in unserem GitHub-Repository, und wir binden sie gerade an. Zuerst läuft sie in einer separaten Sandbox, ohne Kundengeld, und wir zeigen, wie sie sich schlägt.",
    source: "Quelle: bits.media",
    loopTitle: "Der Belohnungskreislauf",
    steps: ["Signal", "Trade geschlossen", "Ergebnis in R", "Dopamin oder Strafe", "Neues Vertrauen"],
  },
  fr: {
    badge: "Inspiré d'une expérience",
    title: "Une mouche qui apprend à trader, et ce que nous en avons retenu",
    intro:
      "En septembre 2026, Alex Wormuth, ingénieur chez Coinbase, a présenté une expérience inhabituelle. Il a pris un modèle numérique du cerveau d'une drosophile (166 700 neurones et 25,6 millions de connexions) et lui a montré un graphique du bitcoin. Le prix était transformé en image pour les « yeux » de la mouche, et ses réactions traduites en acheter, vendre ou attendre. Un gain lui donnait de la « dopamine », une perte activait des neurones d'aversion, une « punition ». Elle tradait avec 100 dollars virtuels. L'auteur reconnaît honnêtement qu'il n'a pas encore prouvé que la mouche a appris à trader avec profit. C'est de la recherche, pas une stratégie prête à l'emploi.",
    idea:
      "C'est l'idée elle-même qui nous a accrochés : un système qui apprend non seulement des règles qu'on lui a écrites, mais aussi des conséquences de ses propres décisions. Nous avons intégré ce principe dans NICS AI Trader.",
    howTitle: "Comment cela fonctionne chez nous",
    how:
      "L'analyse principale reste la même : analyse technique de l'or, du forex et des cryptos, une entrée, un stop et quatre objectifs. En parallèle, un flux séparé tourne chaque nuit : le moteur de récompense. Il prend tous les signaux clôturés, les regroupe par type de configuration et calcule le résultat réel en R. Les types qui ont fini en gain reçoivent de la « dopamine », et la confiance en eux augmente légèrement. Ceux qui ont fini en perte reçoivent une « pénalité », et la confiance baisse. Les pas sont petits et plafonnés, pour qu'une mauvaise semaine ne bouleverse pas le système. Ce flux fonctionne depuis le 17 septembre 2026.",
    honestTitle: "En toute honnêteté sur les résultats",
    honest:
      "Il est trop tôt pour dire que cela a rendu les signaux plus rentables. Tous les résultats réels, bons et mauvais, figurent dans le Verified Track Record ci-dessus. Si l'approche ne fait pas ses preuves, nous l'écrirons ici.",
    nextTitle: "La suite",
    next:
      "Nous continuons à développer ce flux. La mouche numérique est déjà dans notre dépôt GitHub, et nous sommes en train de la connecter. Elle tournera d'abord dans un bac à sable séparé, sans l'argent des clients, et nous montrerons comment elle s'en sort.",
    source: "Source : bits.media",
    loopTitle: "La boucle de récompense",
    steps: ["Signal", "Trade clôturé", "Résultat en R", "Dopamine ou pénalité", "Nouvelle confiance"],
  },
  ar: {
    badge: "مستوحى من تجربة",
    title: "ذبابة تتعلم التداول، وما الذي أخذناه منها",
    intro:
      "في سبتمبر 2026 عرض أليكس وورموث، المبرمج في Coinbase، تجربة غير عادية. أخذ نموذجًا رقميًا لدماغ ذبابة الفاكهة (166,700 خلية عصبية و25.6 مليون اتصال) وعرض عليه مخطط البيتكوين. تحوّل السعر إلى صورة تراها «عينا» الذبابة، وتُرجمت ردود فعلها إلى شراء أو بيع أو انتظار. عند الربح تحصل الذبابة على «الدوبامين»، وعند الخسارة تنشط خلايا النفور، أي «العقاب». تداولت بمبلغ افتراضي قدره 100 دولار. ويكتب المؤلف بصراحة أنه لم يثبت بعد أن الذبابة تعلّمت التداول بربح. إنه بحث، وليس استراتيجية جاهزة.",
    idea:
      "ما جذبنا هو الفكرة نفسها: نظام لا يتعلم من القواعد المكتوبة له فقط، بل أيضًا من عواقب قراراته. وقد نقلنا هذا المبدأ إلى NICS AI Trader.",
    howTitle: "كيف يعمل ذلك لدينا",
    how:
      "يبقى التحليل الأساسي كما هو: تحليل فني للذهب والفوركس والعملات المشفرة، ونقطة دخول، ووقف خسارة، وأربعة أهداف. وبالتوازي معه يعمل كل ليلة مسار مستقل هو محرك المكافآت. يأخذ كل الإشارات المغلقة، ويجمعها حسب نوع الإعداد، ويحسب النتيجة الفعلية بوحدة R. أنواع الصفقات التي انتهت بربح تحصل على «الدوبامين» وترتفع الثقة بها قليلًا. والأنواع التي انتهت بخسارة تحصل على «غرامة» وتنخفض الثقة بها. الخطوات صغيرة ومحدودة حتى لا يقلب أسبوع سيئ واحد النظام رأسًا على عقب. يعمل هذا المسار منذ 17 سبتمبر 2026.",
    honestTitle: "بصراحة عن النتائج",
    honest:
      "من المبكر القول إن هذا جعل الإشارات أكثر ربحية. كل النتائج الحقيقية، الجيدة والسيئة، تجدونها في قسم Verified Track Record أعلاه. وإذا لم يثبت النهج جدواه فسنكتب ذلك هنا.",
    nextTitle: "ما التالي",
    next:
      "نواصل تطوير هذا المسار. الذبابة الرقمية موجودة بالفعل في مستودعنا على GitHub، ونعمل الآن على ربطها. ستعمل أولًا في بيئة تجريبية منفصلة، من دون أموال العملاء، وسنعرض كيف تؤدي.",
    source: "المصدر: bits.media",
    loopTitle: "دورة المكافأة",
    steps: ["إشارة", "إغلاق الصفقة", "النتيجة بوحدة R", "دوبامين أو غرامة", "ثقة جديدة"],
  },
  zh: {
    badge: "灵感来自一项实验",
    title: "一只学习交易的苍蝇，以及我们从中学到了什么",
    intro:
      "2026 年 9 月，Coinbase 程序员 Alex Wormuth 展示了一项不寻常的实验。他使用果蝇大脑的数字模型（166,700 个神经元、2560 万个连接），让它观看比特币走势图。价格被转换成果蝇“眼睛”能看到的图像，它的反应被翻译成买入、卖出或等待。盈利时果蝇获得“多巴胺”，亏损时激活厌恶神经元，即“惩罚”。它用虚拟的 100 美元进行交易。作者坦言，目前还没有证明果蝇学会了盈利交易。这是一项研究，而不是现成的策略。",
    idea:
      "吸引我们的是这个想法本身：系统不仅按照写给它的规则学习，也从自己决策的后果中学习。我们把这一原则带进了 NICS AI Trader。",
    howTitle: "在我们的系统中如何运作",
    how:
      "主分析保持不变：对黄金、外汇和加密货币进行技术分析，给出入场点、止损和四个目标。与此同时，每晚有一个独立的并行流程在运行：奖励引擎。它收集所有已平仓信号，按形态类型分组，并计算以 R 计的真实结果。盈利的形态类型获得“多巴胺”，对它们的信心略微提高；亏损的类型受到“惩罚”，信心下降。每一步都很小且有上限，一周的糟糕表现不会让系统大起大落。该流程自 2026 年 9 月 17 日起运行。",
    honestTitle: "如实说明结果",
    honest:
      "现在说这让信号更赚钱还为时过早。所有真实结果，无论好坏，都在上方的 Verified Track Record 中。如果这种方法不奏效，我们会在这里直说。",
    nextTitle: "下一步",
    next:
      "我们会继续完善这个流程。数字果蝇已经在我们的 GitHub 仓库中，我们正在接入它。它将先在独立的沙盒中运行，不使用客户资金，我们会公开它的表现。",
    source: "来源：bits.media",
    loopTitle: "奖励循环",
    steps: ["信号", "交易平仓", "以 R 计的结果", "多巴胺或惩罚", "新的信心"],
  },
  pl: {
    badge: "Zainspirowane eksperymentem",
    title: "Mucha, która uczy się tradingu, i czego się od niej nauczyliśmy",
    intro:
      "We wrześniu 2026 roku programista Coinbase Alex Wormuth pokazał nietypowy eksperyment. Wziął cyfrowy model mózgu muszki owocowej (166 700 neuronów i 25,6 mln połączeń) i pokazał mu wykres bitcoina. Cena była zamieniana na obraz dla „oczu” muchy, a jej reakcje tłumaczone na kup, sprzedaj lub czekaj. Za zysk mucha dostawała „dopaminę”, przy stracie włączały się neurony awersji, czyli „kara”. Handlowała wirtualnymi 100 dolarami. Autor uczciwie pisze, że nie udowodnił jeszcze, że mucha nauczyła się handlować z zyskiem. To badanie, a nie gotowa strategia.",
    idea:
      "Zaciekawił nas sam pomysł: system uczy się nie tylko z reguł, które mu napisano, ale też z konsekwencji własnych decyzji. Tę zasadę przenieśliśmy do NICS AI Trader.",
    howTitle: "Jak to działa u nas",
    how:
      "Główna analiza pozostaje bez zmian: analiza techniczna złota, forexu i kryptowalut, wejście, stop i cztery cele. Równolegle co noc działa osobny strumień: silnik nagród. Bierze wszystkie zamknięte sygnały, grupuje je według typu setupu i liczy realny wynik w R. Typy, które skończyły się zyskiem, dostają „dopaminę” i zaufanie do nich lekko rośnie. Typy ze stratą dostają „karę” i zaufanie spada. Kroki są małe i ograniczone, żeby jeden zły tydzień nie wywrócił systemu. Ten strumień działa od 17 września 2026 roku.",
    honestTitle: "Uczciwie o wynikach",
    honest:
      "Za wcześnie, by mówić, że sygnały stały się przez to bardziej zyskowne. Wszystkie realne wyniki, dobre i złe, widać w sekcji Verified Track Record powyżej. Jeśli podejście się nie sprawdzi, napiszemy o tym tutaj.",
    nextTitle: "Co dalej",
    next:
      "Rozwijamy ten strumień dalej. Cyfrowa mucha jest już w naszym repozytorium na GitHubie i właśnie ją podłączamy. Najpierw będzie działać w osobnej piaskownicy, bez pieniędzy klientów, a my pokażemy, jak sobie radzi.",
    source: "Źródło: bits.media",
    loopTitle: "Pętla nagród",
    steps: ["Sygnał", "Transakcja zamknięta", "Wynik w R", "Dopamina lub kara", "Nowe zaufanie"],
  },
  tr: {
    badge: "Bir deneyden ilham alındı",
    title: "İşlem yapmayı öğrenen bir sinek ve ondan ne aldık",
    intro:
      "Eylül 2026'da Coinbase programcısı Alex Wormuth sıra dışı bir deney gösterdi. Bir meyve sineği beyninin dijital modelini (166.700 nöron ve 25,6 milyon bağlantı) aldı ve ona bir Bitcoin grafiği gösterdi. Fiyat, sineğin \"gözleri\" için bir görüntüye dönüştürüldü; tepkileri ise al, sat veya bekle olarak çevrildi. Kârda sinek \"dopamin\" aldı, zararda ise tiksinti nöronları devreye girdi, yani \"ceza\". Sanal 100 dolarla işlem yaptı. Yazar, sineğin kârlı işlem yapmayı öğrendiğini henüz kanıtlamadığını dürüstçe yazıyor. Bu bir araştırma, hazır bir strateji değil.",
    idea:
      "Bizi asıl fikrin kendisi etkiledi: Sistem yalnızca kendisi için yazılan kurallardan değil, kendi kararlarının sonuçlarından da öğreniyor. Bu ilkeyi NICS AI Trader'a taşıdık.",
    howTitle: "Bizim sistemimizde nasıl çalışıyor",
    how:
      "Ana analiz aynı kalıyor: altın, forex ve kripto için teknik analiz, giriş noktası, stop ve dört hedef. Bununla paralel olarak her gece ayrı bir akış çalışıyor: ödül motoru. Kapanan tüm sinyalleri alıyor, kurulum türüne göre grupluyor ve R cinsinden gerçek sonucu hesaplıyor. Kârla biten kurulum türleri \"dopamin\" alıyor ve onlara duyulan güven biraz artıyor. Zararla biten türler \"ceza\" alıyor ve güven düşüyor. Adımlar küçük ve sınırlı, böylece tek bir kötü hafta sistemi altüst edemez. Bu akış 17 Eylül 2026'dan beri çalışıyor.",
    honestTitle: "Sonuçlar hakkında dürüstçe",
    honest:
      "Bunun sinyalleri daha kârlı hale getirdiğini söylemek için henüz erken. İyi ve kötü tüm gerçek sonuçlar yukarıdaki Verified Track Record bölümünde. Yaklaşım işe yaramazsa bunu burada yazacağız.",
    nextTitle: "Sırada ne var",
    next:
      "Bu akışı geliştirmeye devam ediyoruz. Dijital sinek zaten GitHub depomuzda ve şu anda onu bağlıyoruz. Önce müşteri parası olmadan ayrı bir test ortamında çalışacak ve nasıl performans gösterdiğini paylaşacağız.",
    source: "Kaynak: bits.media",
    loopTitle: "Ödül döngüsü",
    steps: ["Sinyal", "İşlem kapanır", "R cinsinden sonuç", "Dopamin veya ceza", "Yeni güven"],
  },
  it: {
    badge: "Ispirato da un esperimento",
    title: "Una mosca che impara a fare trading, e cosa abbiamo preso da lei",
    intro:
      "Nel settembre 2026 Alex Wormuth, programmatore di Coinbase, ha presentato un esperimento insolito. Ha preso un modello digitale del cervello di un moscerino della frutta (166.700 neuroni e 25,6 milioni di connessioni) e gli ha mostrato un grafico del bitcoin. Il prezzo veniva trasformato in un'immagine per gli \"occhi\" della mosca, e le sue reazioni tradotte in compra, vendi o aspetta. Con un profitto la mosca riceveva \"dopamina\", con una perdita si attivavano i neuroni dell'avversione, una \"punizione\". Operava con 100 dollari virtuali. L'autore scrive onestamente di non aver ancora dimostrato che la mosca abbia imparato a operare in profitto. È ricerca, non una strategia pronta.",
    idea:
      "Ci ha colpito l'idea in sé: un sistema che impara non solo dalle regole scritte per lui, ma anche dalle conseguenze delle proprie decisioni. Abbiamo portato questo principio in NICS AI Trader.",
    howTitle: "Come funziona nel nostro sistema",
    how:
      "L'analisi principale resta la stessa: analisi tecnica di oro, forex e cripto, un ingresso, uno stop e quattro target. In parallelo, ogni notte gira un flusso separato: il motore delle ricompense. Prende tutti i segnali chiusi, li raggruppa per tipo di setup e calcola il risultato reale in R. I tipi chiusi in profitto ricevono \"dopamina\" e la fiducia in loro sale leggermente. Quelli chiusi in perdita ricevono una \"penalità\" e la fiducia scende. I passi sono piccoli e limitati, così una settimana negativa non può stravolgere il sistema. Questo flusso è attivo dal 17 settembre 2026.",
    honestTitle: "Onestamente sui risultati",
    honest:
      "È presto per dire che questo abbia reso i segnali più redditizi. Tutti i risultati reali, buoni e cattivi, sono nel Verified Track Record qui sopra. Se l'approccio non funzionerà, lo scriveremo qui.",
    nextTitle: "I prossimi passi",
    next:
      "Continuiamo a sviluppare questo flusso. La mosca digitale è già nel nostro repository su GitHub e la stiamo collegando. Prima girerà in una sandbox separata, senza soldi dei clienti, e mostreremo come se la cava.",
    source: "Fonte: bits.media",
    loopTitle: "Il ciclo delle ricompense",
    steps: ["Segnale", "Trade chiuso", "Risultato in R", "Dopamina o penalità", "Nuova fiducia"],
  },
  bg: {
    badge: "Вдъхновено от експеримент",
    title: "Муха, която се учи да търгува, и какво взехме от нея",
    intro:
      "През септември 2026 г. програмистът от Coinbase Алекс Вормут показа необичаен експеримент. Той взе цифров модел на мозъка на плодова мушица (166 700 неврона и 25,6 млн връзки) и му показа графика на биткойна. Цената се превръщаше в картина за „очите“ на мухата, а реакциите ѝ се превеждаха в „купи“, „продай“ или „чакай“. При печалба мухата получаваше „допамин“, при загуба се включваха невроните на отвращението, тоест „наказание“. Търгуваше с виртуални 100 долара. Авторът честно пише, че още не е доказал, че мухата се е научила да търгува на печалба. Това е изследване, а не готова стратегия.",
    idea:
      "Привлече ни самата идея: системата се учи не само по правилата, които са ѝ написани, но и от последствията на собствените си решения. Този принцип пренесохме в NICS AI Trader.",
    howTitle: "Как работи това при нас",
    how:
      "Основният анализ остава същият: технически анализ на злато, валути и крипто, точка на вход, стоп и четири цели. Паралелно с него всяка нощ работи отделен поток, двигателят на наградите. Той взема всички затворени сигнали, групира ги по тип сетъп и изчислява реалния резултат в R. Типовете сделки, завършили на печалба, получават „допамин“ и увереността в тях леко расте. Типовете със загуба получават „глоба“ и увереността намалява. Стъпките са малки и ограничени, за да не може една лоша седмица да преобърне системата. Потокът работи от 17 септември 2026 г.",
    honestTitle: "Честно за резултатите",
    honest:
      "Още е рано да се каже, че това е направило сигналите по-печеливши. Всички реални резултати, добри и лоши, виждате в блока Verified Track Record по-горе. Ако подходът не се оправдае, ще го напишем тук.",
    nextTitle: "Какво следва",
    next:
      "Продължаваме да развиваме този поток. Цифровата муха вече е в нашето хранилище в GitHub и в момента я свързваме. Първо ще работи в отделна пясъчна среда, без пари на клиенти, и ще покажем как се справя.",
    source: "Източник: bits.media",
    loopTitle: "Кръгът на наградите",
    steps: ["Сигнал", "Сделката е затворена", "Резултат в R", "Допамин или глоба", "Нова увереност"],
  },
  es: {
    badge: "Inspirado en un experimento",
    title: "Una mosca que aprende a operar, y lo que tomamos de ella",
    intro:
      "En septiembre de 2026, el programador de Coinbase Alex Wormuth presentó un experimento poco común. Tomó un modelo digital del cerebro de una mosca de la fruta (166.700 neuronas y 25,6 millones de conexiones) y le mostró un gráfico de bitcoin. El precio se convertía en una imagen para los \"ojos\" de la mosca, y sus reacciones se traducían en comprar, vender o esperar. Con ganancias la mosca recibía \"dopamina\"; con pérdidas se activaban neuronas de aversión, un \"castigo\". Operaba con 100 dólares virtuales. El autor reconoce con honestidad que aún no ha demostrado que la mosca aprendiera a operar con beneficio. Es investigación, no una estrategia lista para usar.",
    idea:
      "Nos atrapó la idea en sí: un sistema que aprende no solo de las reglas que se le escribieron, sino también de las consecuencias de sus propias decisiones. Llevamos este principio a NICS AI Trader.",
    howTitle: "Cómo funciona en nuestro sistema",
    how:
      "El análisis principal sigue igual: análisis técnico de oro, forex y cripto, una entrada, un stop y cuatro objetivos. En paralelo, cada noche funciona un flujo aparte: el motor de recompensas. Toma todas las señales cerradas, las agrupa por tipo de setup y calcula el resultado real en R. Los tipos que terminaron en ganancia reciben \"dopamina\" y la confianza en ellos sube un poco. Los que terminaron en pérdida reciben una \"penalización\" y la confianza baja. Los pasos son pequeños y limitados, para que una mala semana no ponga el sistema patas arriba. Este flujo funciona desde el 17 de septiembre de 2026.",
    honestTitle: "Con honestidad sobre los resultados",
    honest:
      "Es pronto para decir que esto haya hecho más rentables las señales. Todos los resultados reales, buenos y malos, están en el Verified Track Record de arriba. Si el enfoque no funciona, lo diremos aquí.",
    nextTitle: "Qué sigue",
    next:
      "Seguimos desarrollando este flujo. La mosca digital ya está en nuestro repositorio de GitHub y la estamos conectando. Primero funcionará en un entorno de pruebas aparte, sin dinero de clientes, y mostraremos cómo le va.",
    source: "Fuente: bits.media",
    loopTitle: "El ciclo de recompensas",
    steps: ["Señal", "Operación cerrada", "Resultado en R", "Dopamina o penalización", "Nueva confianza"],
  },
  pt: {
    badge: "Inspirado num experimento",
    title: "Uma mosca que aprende a operar, e o que aprendemos com ela",
    intro:
      "Em setembro de 2026, o programador da Coinbase Alex Wormuth apresentou um experimento incomum. Ele pegou um modelo digital do cérebro de uma mosca-da-fruta (166.700 neurônios e 25,6 milhões de conexões) e mostrou a ele um gráfico do bitcoin. O preço era transformado numa imagem para os \"olhos\" da mosca, e as reações dela eram traduzidas em comprar, vender ou esperar. Com lucro, a mosca recebia \"dopamina\"; com prejuízo, ativavam-se neurônios de aversão, uma \"punição\". Ela operava com 100 dólares virtuais. O autor admite honestamente que ainda não provou que a mosca aprendeu a operar com lucro. É pesquisa, não uma estratégia pronta.",
    idea:
      "O que nos chamou a atenção foi a própria ideia: um sistema que aprende não só com as regras escritas para ele, mas também com as consequências das próprias decisões. Levamos esse princípio para o NICS AI Trader.",
    howTitle: "Como funciona no nosso sistema",
    how:
      "A análise principal continua a mesma: análise técnica de ouro, forex e cripto, uma entrada, um stop e quatro alvos. Em paralelo, todas as noites roda um fluxo separado: o motor de recompensas. Ele pega todos os sinais fechados, agrupa por tipo de setup e calcula o resultado real em R. Os tipos que terminaram com lucro recebem \"dopamina\", e a confiança neles sobe um pouco. Os que terminaram com prejuízo recebem uma \"penalidade\", e a confiança cai. Os passos são pequenos e limitados, para que uma semana ruim não vire o sistema de cabeça para baixo. Esse fluxo roda desde 17 de setembro de 2026.",
    honestTitle: "Com honestidade sobre os resultados",
    honest:
      "Ainda é cedo para dizer que isso tornou os sinais mais lucrativos. Todos os resultados reais, bons e ruins, estão no Verified Track Record acima. Se a abordagem não der certo, vamos dizer isso aqui.",
    nextTitle: "Próximos passos",
    next:
      "Seguimos desenvolvendo esse fluxo. A mosca digital já está no nosso repositório no GitHub e estamos conectando-a agora. Primeiro ela vai rodar num ambiente de testes separado, sem dinheiro de clientes, e vamos mostrar como ela se sai.",
    source: "Fonte: bits.media",
    loopTitle: "O ciclo de recompensas",
    steps: ["Sinal", "Operação fechada", "Resultado em R", "Dopamina ou penalidade", "Nova confiança"],
  },
};

// [x, body top, body bottom, up?] of a small rising candle chart.
const CANDLES: [number, number, number, boolean][] = [
  [20, 120, 136, true],
  [50, 100, 120, false],
  [80, 104, 112, true],
  [110, 86, 104, true],
  [140, 72, 96, false],
  [170, 80, 100, true],
  [200, 62, 78, true],
  [230, 54, 72, false],
  [260, 46, 64, true],
  [290, 28, 48, true],
];

// Illustration 1: our helmeted fly hovering in front of a little price chart.
const FlyAtChart = () => (
  <div className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-card/80 p-6 shadow-xl shadow-primary/5">
    <svg viewBox="0 0 320 180" className="h-auto w-full" aria-hidden="true">
      {[30, 70, 110, 150].map((y) => (
        <line key={y} x1="0" x2="320" y1={y} y2={y} stroke="currentColor" className="text-border" strokeDasharray="4 6" />
      ))}
      {CANDLES.map(([x, top, bottom, up]) => (
        <g key={x}>
          <line x1={x} x2={x} y1={top - 8} y2={bottom + 8} stroke={up ? "#16a34a" : "#dc2626"} strokeWidth="1.5" />
          <rect x={x - 7} y={top} width="14" height={bottom - top} rx="2" fill={up ? "#22c55e" : "#ef4444"} />
        </g>
      ))}
    </svg>
    <div className="trading-fly-bob absolute bottom-6 right-6">
      <FlySvg size={120} />
    </div>
  </div>
);

const TradingFlyStory = ({ lang }: { lang: Language }) => {
  const s = strings[lang] ?? strings.en;
  const blocks: [string, string][] = [
    [s.howTitle, s.how],
    [s.honestTitle, s.honest],
    [s.nextTitle, s.next],
  ];

  return (
    <section id="fly-experiment" className="py-20 scroll-mt-24">
      <style>{`
        @keyframes trading-fly-bob { 0%, 100% { transform: translateY(0) rotate(-4deg); } 50% { transform: translateY(-10px) rotate(4deg); } }
        .trading-fly-bob { animation: trading-fly-bob 2.4s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .trading-fly-bob { animation: none; } }
      `}</style>
      <div className="container mx-auto px-4">
        <div className="grid items-start gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              {s.badge}
            </div>
            <h2 className="text-3xl font-semibold md:text-5xl">{s.title}</h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">{s.intro}</p>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">{s.idea}</p>
            <a href={SOURCE_URL} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm text-primary underline-offset-4 hover:underline">
              {s.source}
            </a>
          </div>

          <div className="space-y-6">
            <FlyAtChart />

            {/* Illustration 2: the nightly reward loop */}
            <div className="rounded-[2rem] border border-border/70 bg-card/80 p-6">
              <p className="mb-4 flex items-center gap-2 text-sm font-semibold">
                <RefreshCw className="h-4 w-4 text-primary" />
                {s.loopTitle}
              </p>
              <ol className="flex flex-wrap items-center gap-2 text-sm">
                {s.steps.map((step, i) => (
                  <li key={step} className="flex items-center gap-2">
                    <span
                      className={
                        i === 3
                          ? "rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 font-medium text-primary"
                          : "rounded-full border border-border/70 bg-background px-3 py-1.5"
                      }
                    >
                      {step}
                    </span>
                    {i < s.steps.length - 1 && <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground rtl:rotate-180" />}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {blocks.map(([title, text]) => (
            <div key={title} className="rounded-2xl border border-border/70 bg-card/60 p-6">
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="mt-3 leading-7 text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TradingFlyStory;
