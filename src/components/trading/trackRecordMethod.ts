// "How we calculate" block under the public track record (2026-11-21, Alexander,
// legal review): adds the methodology and the standard risk notice next to the
// numbers. It only explains; it does not change what is counted.

type Method = { title: string; points: string[]; terms: string };

const en: Method = {
  title: "How we calculate these results",
  points: [
    "Every strong setup that has closed is counted: both scheduled setups and setups sent on request. Closed trades are never removed afterwards.",
    "Results are in R. 1R is the distance from the entry to the stop-loss of that setup. A stop-loss hit is -1R; a take-profit is counted at its distance in R.",
    "The result is measured from the levels published in the analysis (entry zone, stop-loss, take-profits) on broker prices.",
    "Spreads, commissions, swaps and slippage are not deducted. Your own account will differ because of entry time, execution, costs and position size.",
    "Setups marked as not strong are sent only on request and are not included.",
    "The figures are calculated by our own systems from our records and are not audited by a third party.",
    "Past results do not guarantee future results. Trading CFDs, forex and crypto carries a high risk of losing money.",
  ],
  terms: "Full terms and risk disclosure",
};

const ru: Method = {
  title: "Как считаются эти результаты",
  points: [
    "Учитывается каждый закрытый сильный сетап: и плановый теханализ, и анализ по запросу. Закрытые сделки задним числом не удаляются.",
    "Результат в R. 1R — расстояние от входа до стоп-лосса этого сетапа. Стоп-лосс = -1R, тейк-профит считается по его расстоянию в R.",
    "Результат считается от уровней, опубликованных в анализе (зона входа, стоп-лосс, тейк-профиты), по ценам брокера.",
    "Спред, комиссия, своп и проскальзывание не вычитаются. На вашем счёте результат будет другим из-за времени входа, исполнения, издержек и размера позиции.",
    "Сетапы с пометкой «не сильный» отправляются только по запросу и не учитываются.",
    "Цифры считают наши собственные системы по нашим записям, независимый аудит не проводился.",
    "Прошлые результаты не гарантируют будущих. Торговля CFD, форекс и криптовалютой связана с высоким риском потери денег.",
  ],
  terms: "Полные условия и раскрытие рисков",
};

const bg: Method = {
  title: "Как се изчисляват тези резултати",
  points: [
    "Отчита се всеки затворен силен сетъп: както планираните, така и анализите по заявка. Затворените сделки не се премахват впоследствие.",
    "Резултатите са в R. 1R е разстоянието от входа до стоп-лоса на сетъпа. Стоп-лос = -1R, тейк-профитът се отчита по разстоянието си в R.",
    "Резултатът се измерва от нивата, публикувани в анализа (зона за вход, стоп-лос, тейк-профити), по цените на брокера.",
    "Спредът, комисионите, суаповете и приплъзването не се приспадат. Резултатът по вашата сметка ще е различен заради момента на входа, изпълнението, разходите и размера на позицията.",
    "Сетъпите, отбелязани като не силни, се изпращат само по заявка и не се включват.",
    "Данните се изчисляват от нашите собствени системи по нашите записи и не са одитирани от трета страна.",
    "Миналите резултати не гарантират бъдещи. Търговията с CFD, форекс и криптовалути носи висок риск от загуба на пари.",
  ],
  terms: "Пълни условия и разкриване на рисковете",
};

const es: Method = {
  title: "Cómo calculamos estos resultados",
  points: [
    "Se cuenta cada setup fuerte cerrado: tanto los programados como los enviados a petición. Las operaciones cerradas nunca se eliminan después.",
    "Los resultados están en R. 1R es la distancia de la entrada al stop-loss de ese setup. Un stop-loss es -1R; un take-profit se cuenta por su distancia en R.",
    "El resultado se mide desde los niveles publicados en el análisis (zona de entrada, stop-loss, take-profits) con precios del bróker.",
    "No se descuentan spreads, comisiones, swaps ni deslizamiento. Tu cuenta será distinta por el momento de entrada, la ejecución, los costes y el tamaño de la posición.",
    "Los setups marcados como no fuertes solo se envían a petición y no se incluyen.",
    "Las cifras las calculan nuestros propios sistemas a partir de nuestros registros y no están auditadas por terceros.",
    "Los resultados pasados no garantizan resultados futuros. Operar CFD, forex y cripto conlleva un alto riesgo de perder dinero.",
  ],
  terms: "Condiciones completas y aviso de riesgo",
};

const de: Method = {
  title: "So berechnen wir diese Ergebnisse",
  points: [
    "Jedes geschlossene starke Setup wird gezählt: geplante Setups und Setups auf Anfrage. Geschlossene Trades werden nachträglich nie entfernt.",
    "Ergebnisse in R. 1R ist der Abstand vom Einstieg zum Stop-Loss des Setups. Ein Stop-Loss ist -1R; ein Take-Profit zählt mit seinem Abstand in R.",
    "Gemessen wird ab den in der Analyse veröffentlichten Levels (Einstiegszone, Stop-Loss, Take-Profits) auf Brokerkursen.",
    "Spreads, Kommissionen, Swaps und Slippage werden nicht abgezogen. Ihr Konto weicht wegen Einstiegszeit, Ausführung, Kosten und Positionsgröße ab.",
    "Als nicht stark markierte Setups werden nur auf Anfrage gesendet und nicht einbezogen.",
    "Die Zahlen berechnen unsere eigenen Systeme aus unseren Aufzeichnungen; sie sind nicht von Dritten geprüft.",
    "Vergangene Ergebnisse garantieren keine zukünftigen. Der Handel mit CFDs, Forex und Krypto birgt ein hohes Verlustrisiko.",
  ],
  terms: "Vollständige Bedingungen und Risikohinweis",
};

const fr: Method = {
  title: "Comment nous calculons ces résultats",
  points: [
    "Chaque setup fort clôturé est compté : les setups planifiés comme ceux envoyés sur demande. Les trades clôturés ne sont jamais supprimés ensuite.",
    "Les résultats sont en R. 1R est la distance entre l'entrée et le stop-loss du setup. Un stop-loss vaut -1R ; un take-profit compte pour sa distance en R.",
    "Le résultat est mesuré à partir des niveaux publiés dans l'analyse (zone d'entrée, stop-loss, take-profits) sur les prix du courtier.",
    "Spreads, commissions, swaps et glissement ne sont pas déduits. Votre compte différera selon le moment d'entrée, l'exécution, les coûts et la taille de position.",
    "Les setups marqués comme non forts ne sont envoyés que sur demande et ne sont pas inclus.",
    "Les chiffres sont calculés par nos propres systèmes à partir de nos registres et ne sont pas audités par un tiers.",
    "Les performances passées ne garantissent pas les résultats futurs. Le trading de CFD, forex et crypto comporte un risque élevé de perte.",
  ],
  terms: "Conditions complètes et avertissement sur les risques",
};

const it: Method = {
  title: "Come calcoliamo questi risultati",
  points: [
    "Viene contato ogni setup forte chiuso: sia quelli programmati sia quelli inviati su richiesta. Le operazioni chiuse non vengono mai rimosse dopo.",
    "I risultati sono in R. 1R è la distanza tra ingresso e stop-loss del setup. Uno stop-loss vale -1R; un take-profit conta per la sua distanza in R.",
    "Il risultato è misurato dai livelli pubblicati nell'analisi (zona di ingresso, stop-loss, take-profit) sui prezzi del broker.",
    "Spread, commissioni, swap e slippage non sono detratti. Il tuo conto sarà diverso per momento di ingresso, esecuzione, costi e dimensione della posizione.",
    "I setup indicati come non forti sono inviati solo su richiesta e non sono inclusi.",
    "I dati sono calcolati dai nostri sistemi sui nostri registri e non sono verificati da terzi.",
    "I risultati passati non garantiscono quelli futuri. Il trading di CFD, forex e cripto comporta un alto rischio di perdita.",
  ],
  terms: "Termini completi e informativa sui rischi",
};

const pt: Method = {
  title: "Como calculamos estes resultados",
  points: [
    "Conta-se cada setup forte fechado: tanto os programados como os enviados a pedido. Operações fechadas nunca são removidas depois.",
    "Os resultados estão em R. 1R é a distância da entrada ao stop-loss do setup. Um stop-loss vale -1R; um take-profit conta pela sua distância em R.",
    "O resultado é medido a partir dos níveis publicados na análise (zona de entrada, stop-loss, take-profits) com preços da corretora.",
    "Spreads, comissões, swaps e slippage não são descontados. A sua conta será diferente pelo momento de entrada, execução, custos e tamanho da posição.",
    "Setups marcados como não fortes são enviados só a pedido e não são incluídos.",
    "Os números são calculados pelos nossos próprios sistemas a partir dos nossos registos e não são auditados por terceiros.",
    "Resultados passados não garantem resultados futuros. Negociar CFD, forex e cripto envolve alto risco de perda.",
  ],
  terms: "Termos completos e aviso de risco",
};

const pl: Method = {
  title: "Jak liczymy te wyniki",
  points: [
    "Liczony jest każdy zamknięty silny setup: planowe i wysłane na żądanie. Zamkniętych transakcji nigdy nie usuwamy później.",
    "Wyniki są w R. 1R to odległość od wejścia do stop-lossa setupu. Stop-loss to -1R; take-profit liczy się według jego odległości w R.",
    "Wynik mierzony jest od poziomów opublikowanych w analizie (strefa wejścia, stop-loss, take-profity) na cenach brokera.",
    "Spready, prowizje, swapy i poślizg nie są odejmowane. Twoje konto będzie się różnić przez moment wejścia, realizację, koszty i wielkość pozycji.",
    "Setupy oznaczone jako niesilne są wysyłane tylko na żądanie i nie są wliczane.",
    "Liczby obliczają nasze własne systemy z naszych zapisów; nie są audytowane przez stronę trzecią.",
    "Wyniki historyczne nie gwarantują przyszłych. Handel CFD, forex i kryptowalutami wiąże się z wysokim ryzykiem straty.",
  ],
  terms: "Pełne warunki i ostrzeżenie o ryzyku",
};

const tr: Method = {
  title: "Bu sonuçları nasıl hesaplıyoruz",
  points: [
    "Kapanan her güçlü kurulum sayılır: planlı olanlar ve talep üzerine gönderilenler. Kapanan işlemler sonradan asla silinmez.",
    "Sonuçlar R cinsindendir. 1R, kurulumun girişi ile zarar durdur seviyesi arasındaki mesafedir. Zarar durdur -1R; kâr al, R cinsinden mesafesiyle sayılır.",
    "Sonuç, analizde yayımlanan seviyelerden (giriş bölgesi, zarar durdur, kâr al) aracı kurum fiyatlarıyla ölçülür.",
    "Spread, komisyon, swap ve kayma düşülmez. Hesabınız giriş zamanı, gerçekleşme, maliyetler ve pozisyon büyüklüğü nedeniyle farklı olur.",
    "Güçlü olmayan olarak işaretlenen kurulumlar yalnızca talep üzerine gönderilir ve dahil edilmez.",
    "Rakamlar kendi sistemlerimizce kayıtlarımızdan hesaplanır, üçüncü taraf denetimi yoktur.",
    "Geçmiş sonuçlar gelecekteki sonuçları garanti etmez. CFD, forex ve kripto işlemleri yüksek kayıp riski taşır.",
  ],
  terms: "Tüm koşullar ve risk bildirimi",
};

const zh: Method = {
  title: "这些结果如何计算",
  points: [
    "每个已平仓的强势形态都计入统计：包括定时分析和按需发送的分析。已平仓交易事后从不删除。",
    "结果以 R 表示。1R = 该分析入场价到止损的距离。止损为 -1R；止盈按其距离折算为 R。",
    "结果按分析中公布的价位（入场区间、止损、止盈）以经纪商价格计算。",
    "未扣除点差、佣金、隔夜利息和滑点。您的账户结果会因入场时间、执行、成本和仓位大小而不同。",
    "标记为非强势形态的分析仅按需发送，不计入统计。",
    "数据由我们自己的系统根据我们的记录计算，未经第三方审计。",
    "过往业绩不保证未来结果。交易差价合约、外汇和加密货币存在较高的亏损风险。",
  ],
  terms: "完整条款与风险披露",
};

const ar: Method = {
  title: "كيف نحسب هذه النتائج",
  points: [
    "تُحتسب كل صفقة قوية مغلقة: الصفقات المجدولة والصفقات المرسلة عند الطلب. لا تُحذف الصفقات المغلقة لاحقًا أبدًا.",
    "النتائج بوحدة R. ‏1R هي المسافة من الدخول إلى وقف الخسارة للصفقة. وقف الخسارة = ‎-1R، وجني الربح يُحتسب بمسافته بوحدة R.",
    "تُقاس النتيجة من المستويات المنشورة في الصفقة (منطقة الدخول، وقف الخسارة، جني الأرباح) بأسعار الوسيط.",
    "لا تُخصم فروق الأسعار والعمولات والمبادلات والانزلاق. ستختلف نتيجة حسابك بسبب وقت الدخول والتنفيذ والتكاليف وحجم المركز.",
    "الصفقات المصنفة غير قوية تُرسل عند الطلب فقط ولا تُحتسب.",
    "تُحسب الأرقام بواسطة أنظمتنا من سجلاتنا ولا تخضع لتدقيق طرف ثالث.",
    "الأداء السابق لا يضمن النتائج المستقبلية. تداول عقود الفروقات والفوركس والعملات المشفرة ينطوي على مخاطر عالية لخسارة المال.",
  ],
  terms: "الشروط الكاملة والإفصاح عن المخاطر",
};

const methods: Record<string, Method> = { en, ru, bg, es, de, fr, it, pt, pl, tr, zh, ar };

export const trackRecordMethod = (language: string | undefined): Method =>
  methods[(language ?? "en").slice(0, 2)] ?? en;
