import { Bot, Download, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WINDOWS_APP_DOWNLOAD_URL, openExternal } from "./externalLinks";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Translation } from "./i18n";
import type { AppLanguage, AppPayload } from "./types";

/*
 * "About and versions": the app's own release notes (newest first) plus
 * the signal engine updates the server sends, and the credits.
 * Append new app releases at the top of APP_RELEASES; never rewrite
 * published entries.
 */

type ReleaseText = Record<AppLanguage, { title: string; items: string[] }>;

export const APP_RELEASES: Array<{ version: string; date: string; text: ReleaseText }> = [
  {
    version: "2.15.0",
    date: "12.11.2026",
    text: {
      ru: {
        title: "Личный журнал сделок",
        items: [
          "Новый раздел «Журнал сделок»: ваши собственные сделки, итог, профит-фактор, просадка и кривая счёта.",
          "Сделки попадают в журнал сами через советник NICS Journal для MT5, из отчёта MT5/MT4 (HTML или xlsx) или вручную.",
          "Автоматический разбор ошибок (без стопа, отыгрыш после убытка, ранний выход и другие) и разбор недели: что получается и что исправить.",
          "Сигналы NICS, которые вы приняли, с проверкой D1/H4. Журнал личный и не входит в публичную статистику.",
        ],
      },
      bg: {
        title: "Личен дневник на сделките",
        items: [
          "Нов раздел «Дневник на сделките»: вашите сделки, резултат, профит фактор, просадка и крива на сметката.",
          "Сделките влизат сами чрез съветника NICS Journal за MT5, от отчет MT5/MT4 (HTML или xlsx) или ръчно.",
          "Автоматичен анализ на грешките и седмичен преглед: какво се получава и какво да поправите.",
          "Приетите сигнали на NICS с проверка D1/H4. Дневникът е личен и не влиза в публичната статистика.",
        ],
      },
      en: {
        title: "Personal trade journal",
        items: [
          "New «Trade journal» section: your own trades, net result, profit factor, drawdown and equity curve.",
          "Trades arrive automatically from the NICS Journal expert for MT5, from an MT5/MT4 report (HTML or xlsx) or by hand.",
          "Automatic mistake audit (no stop, revenge trading, early exit and more) and a weekly review: what works and what to fix.",
          "The NICS signals you accepted, with a D1/H4 check. The journal is private and is not part of the public statistics.",
        ],
      },
      es: {
        title: "Diario personal de operaciones",
        items: [
          "Nueva sección «Diario de operaciones»: tus operaciones, resultado, profit factor, drawdown y curva de capital.",
          "Las operaciones llegan solas con el experto NICS Journal para MT5, desde un informe MT5/MT4 (HTML o xlsx) o a mano.",
          "Análisis automático de errores y revisión semanal: lo que funciona y qué corregir.",
          "Las señales NICS que aceptaste, con comprobación D1/H4. El diario es privado y no entra en las estadísticas públicas.",
        ],
      },
      pt: {
        title: "Diário pessoal de operações",
        items: [
          "Nova seção «Diário de operações»: as suas operações, resultado, profit factor, drawdown e curva de capital.",
          "As operações chegam sozinhas pelo expert NICS Journal para MT5, por um relatório MT5/MT4 (HTML ou xlsx) ou manualmente.",
          "Análise automática de erros e revisão semanal: o que funciona e o que corrigir.",
          "Os sinais NICS que você aceitou, com verificação D1/H4. O diário é privado e não entra nas estatísticas públicas.",
        ],
      },
    },
  },
  {
    version: "2.14.0",
    date: "12.11.2026",
    text: {
      ru: {
        title: "Новое имя: NICS Trading Ecosystem",
        items: [
          "NICS AI Trader теперь называется NICS Trading Ecosystem: одно имя для приложения Windows, Mini App, кабинета, бота и сайта.",
          "Функции, тариф, ключ лицензии и ваша история не изменились.",
        ],
      },
      bg: {
        title: "Ново име: NICS Trading Ecosystem",
        items: [
          "NICS AI Trader вече се казва NICS Trading Ecosystem: едно име за приложението за Windows, Mini App, кабинета, бота и сайта.",
          "Функциите, тарифът, лицензионният ключ и историята ви не са променени.",
        ],
      },
      en: {
        title: "New name: NICS Trading Ecosystem",
        items: [
          "NICS AI Trader is now called NICS Trading Ecosystem: one name for the Windows app, Mini App, cabinet, bot and website.",
          "Features, plan, license key and your history stay the same.",
        ],
      },
      es: {
        title: "Nuevo nombre: NICS Trading Ecosystem",
        items: [
          "NICS AI Trader ahora se llama NICS Trading Ecosystem: un solo nombre para la app de Windows, la Mini App, el panel, el bot y el sitio web.",
          "Las funciones, el plan, la clave de licencia y su historial no cambian.",
        ],
      },
      pt: {
        title: "Novo nome: NICS Trading Ecosystem",
        items: [
          "O NICS AI Trader agora se chama NICS Trading Ecosystem: um só nome para o app do Windows, o Mini App, o painel, o bot e o site.",
          "Funções, plano, chave de licença e o seu histórico continuam iguais.",
        ],
      },
    },
  },
  {
    version: "2.13.0",
    date: "12.11.2026",
    text: {
      ru: {
        title: "Лестница входа NICS Ladder в тарифе Pro",
        items: [
          "В карточке сильного сигнала — план входа из 5 заявок от края зоны входа к стопу, с общим стопом и долями объёма 13/17/20/23/27%.",
          "После расчёта лота приложение показывает лот для каждого уровня при вашем обычном риске.",
          "Это инструмент снижения риска, а не дополнительной прибыли: на истории результат как у одного входа, максимальная просадка примерно вдвое меньше.",
        ],
      },
      bg: {
        title: "Стълба за вход NICS Ladder в тарифа Pro",
        items: [
          "В картата на силен сигнал — план за вход от 5 поръчки от ръба на зоната към стопа, с общ стоп и дялове от обема 13/17/20/23/27%.",
          "След изчисляване на лота приложението показва лот за всяко ниво при обичайния ви риск.",
          "Това е инструмент за по-нисък риск, не за допълнителна печалба: по историята резултатът е като при един вход, а максималният спад е около два пъти по-малък.",
        ],
      },
      en: {
        title: "NICS Ladder entry in the Pro plan",
        items: [
          "Strong signal cards show a 5-order entry plan from the edge of the entry zone towards the stop, with one common stop and volume shares 13/17/20/23/27%.",
          "After you calculate the lot, the app shows the lot for each level at your normal risk.",
          "This is a risk-reduction tool, not extra profit: on past signals the result matched a single entry, with about half the maximum drawdown.",
        ],
      },
      es: {
        title: "Entrada escalonada NICS Ladder en el plan Pro",
        items: [
          "Las tarjetas de señales fuertes muestran un plan de 5 órdenes desde el borde de la zona de entrada hacia el stop, con un stop común y partes de volumen 13/17/20/23/27%.",
          "Después de calcular el lote, la app muestra el lote de cada nivel con su riesgo habitual.",
          "Es una herramienta para reducir el riesgo, no para ganar más: en señales pasadas el resultado fue igual al de una sola entrada, con cerca de la mitad de la caída máxima.",
        ],
      },
      pt: {
        title: "Entrada escalonada NICS Ladder no plano Pro",
        items: [
          "Os cartões de sinais fortes mostram um plano de 5 ordens da borda da zona de entrada em direção ao stop, com um stop comum e partes de volume 13/17/20/23/27%.",
          "Depois de calcular o lote, a app mostra o lote de cada nível com o seu risco habitual.",
          "É uma ferramenta para reduzir o risco, não para ganhar mais: em sinais passados o resultado foi igual ao de uma única entrada, com cerca de metade da queda máxima.",
        ],
      },
    },
  },
  {
    version: "2.12.0",
    date: "12.11.2026",
    text: {
      ru: {
        title: "ДНК-спираль во всём приложении",
        items: [
          "«Моё ДНК» в разделе «Результаты»: большая спираль из вашей реальной истории сигналов. Зелёные мостики в плюс, красные в минус, серые в ноль.",
          "Спираль на главной странице приложения, построенная из ваших последних сигналов.",
          "«ДНК сигнала» в каждой карточке сигнала: стоп, вход и цели; цель загорается, только когда она реально достигнута.",
        ],
      },
      bg: {
        title: "ДНК спирала в цялото приложение",
        items: [
          "„Моето ДНК“ в „Резултати“: голяма спирала от вашата реална история на сигналите. Зелените мостове са печалба, червените загуба, сивите нула.",
          "Спирала на началния екран на приложението, изградена от последните ви сигнали.",
          "„ДНК на сигнала“ във всяка карта на сигнал: стоп, вход и цели; целта светва само когато е реално достигната.",
        ],
      },
      en: {
        title: "DNA spiral across the app",
        items: [
          "\"My DNA\" in Results: a large spiral built from your real signal history. Green bridges are profit, red are loss, grey are zero.",
          "A spiral on the app home screen, built from your latest signals.",
          "\"Signal DNA\" on every signal card: stop, entry and targets; a target lights up only when it was really hit.",
        ],
      },
      es: {
        title: "Espiral de ADN en toda la app",
        items: [
          "\"Mi ADN\" en Resultados: una gran espiral hecha con tu historial real de señales. Puentes verdes en ganancia, rojos en pérdida, grises en cero.",
          "Una espiral en la pantalla principal, hecha con tus últimas señales.",
          "\"ADN de la señal\" en cada tarjeta: stop, entrada y objetivos; un objetivo se ilumina solo cuando se alcanzó de verdad.",
        ],
      },
      pt: {
        title: "Espiral de DNA em todo o app",
        items: [
          "\"Meu DNA\" em Resultados: uma grande espiral feita com o seu histórico real de sinais. Pontes verdes no lucro, vermelhas na perda, cinzas no zero.",
          "Uma espiral na tela inicial, feita com os seus últimos sinais.",
          "\"DNA do sinal\" em cada cartão: stop, entrada e alvos; um alvo acende só quando foi realmente atingido.",
        ],
      },
    },
  },
  {
    version: "2.11.0",
    date: "11.11.2026",
    text: {
      ru: {
        title: "Приложение работает без Telegram",
        items: [
          "Новый сигнал виден в приложении сразу, как только движок его рассчитал, а не после того, как вы приняли его в Telegram.",
          "Принять или отклонить сигнал можно прямо в приложении. Решение одно на всех: в Telegram, Mini App и Windows-приложении статус одинаковый.",
          "Новый раздел «Запрошенные сигналы»: всё, что вы заказали за 30 дней, с текущим статусом и итогом.",
          "Ссылка на скачивание приложения для Windows теперь есть внутри приложения: в меню и в разделе «О программе».",
        ],
      },
      bg: {
        title: "Приложението работи без Telegram",
        items: [
          "Новият сигнал се вижда в приложението веднага щом двигателят го изчисли, а не след като го приемете в Telegram.",
          "Можете да приемете или откажете сигнала направо в приложението. Решението е едно навсякъде: в Telegram, Mini App и Windows приложението статусът е един и същ.",
          "Нов раздел „Поръчани сигнали“: всичко, което сте поръчали за 30 дни, с текущия статус и резултата.",
          "Връзката за изтегляне на приложението за Windows вече е вътре в приложението: в менюто и в „За програмата“.",
        ],
      },
      en: {
        title: "The app works without Telegram",
        items: [
          "A new signal shows in the app as soon as the engine has calculated it, not only after you accepted it in Telegram.",
          "Accept or decline a signal right in the app. It is one decision everywhere: Telegram, the Mini App and the Windows app show the same status.",
          "New \"Requested signals\" page: everything you ordered over 30 days, with its current status and outcome.",
          "The Windows app download link is now inside the app: in the menu and on the About page.",
        ],
      },
      es: {
        title: "La app funciona sin Telegram",
        items: [
          "Una señal nueva aparece en la app en cuanto el motor la calcula, no solo después de aceptarla en Telegram.",
          "Acepta o rechaza una señal directamente en la app. Es una sola decisión: Telegram, la Mini App y la app de Windows muestran el mismo estado.",
          "Nueva página «Señales solicitadas»: todo lo que pediste en 30 días, con su estado y resultado.",
          "El enlace de descarga de la app para Windows ya está dentro de la app: en el menú y en «Acerca de».",
        ],
      },
      pt: {
        title: "O app funciona sem Telegram",
        items: [
          "Um sinal novo aparece no app assim que o motor o calcula, e não só depois de aceitá-lo no Telegram.",
          "Aceite ou recuse um sinal diretamente no app. É uma única decisão: Telegram, Mini App e o app para Windows mostram o mesmo estado.",
          "Nova página «Sinais pedidos»: tudo o que pediu em 30 dias, com o estado atual e o resultado.",
          "O link para baixar o app para Windows agora está dentro do app: no menu e em «Sobre».",
        ],
      },
    },
  },
  {
    version: "2.10.0",
    date: "11.11.2026",
    text: {
      ru: {
        title: "Живая спираль анализа",
        items: [
          "Когда вы заказываете анализ инструмента или дополнительный скан, на экране вращается многоцветная спираль, похожая на ДНК.",
          "Каждая её перекладина загорается, когда движок NICS действительно прошёл этап: свежие данные, D1/H4, M15, M5, M1, новости и итог. Рядом видно, что именно он нашёл.",
          "Если сильного входа нет, приложение сразу честно об этом говорит, а не ждёт впустую.",
        ],
      },
      bg: {
        title: "Жива спирала на анализа",
        items: [
          "Когато поръчате анализ на инструмент или допълнително сканиране, на екрана се върти многоцветна спирала, подобна на ДНК.",
          "Всяко стъпало светва, когато двигателят NICS наистина е минал етапа: свежи данни, D1/H4, M15, M5, M1, новини и резултат. До него се вижда какво е открил.",
          "Ако няма силен вход, приложението веднага го казва честно, вместо да чака напразно.",
        ],
      },
      en: {
        title: "Live analysis helix",
        items: [
          "When you order an instrument analysis or an extra scan, a multi-coloured DNA-like helix spins on screen.",
          "Each rung lights up when the NICS engine has really completed that stage: fresh data, D1/H4, M15, M5, M1, news and result, with what it found next to it.",
          "If there is no strong entry, the app tells you right away instead of waiting in vain.",
        ],
      },
      es: {
        title: "Hélice de análisis en vivo",
        items: [
          "Al pedir el análisis de un instrumento o un escaneo extra, en pantalla gira una hélice multicolor parecida al ADN.",
          "Cada peldaño se ilumina cuando el motor NICS ha completado de verdad esa etapa: datos frescos, D1/H4, M15, M5, M1, noticias y resultado, con lo que encontró al lado.",
          "Si no hay una entrada fuerte, la app lo dice enseguida en lugar de esperar en vano.",
        ],
      },
      pt: {
        title: "Hélice de análise ao vivo",
        items: [
          "Ao pedir a análise de um instrumento ou uma varredura extra, uma hélice multicolorida parecida com DNA gira na tela.",
          "Cada degrau acende quando o motor NICS realmente concluiu a etapa: dados frescos, D1/H4, M15, M5, M1, notícias e resultado, com o que encontrou ao lado.",
          "Se não houver entrada forte, o app avisa na hora em vez de esperar à toa.",
        ],
      },
    },
  },
  {
    version: "2.9.0",
    date: "06.11.2026",
    text: {
      ru: {
        title: "Португальский язык и исправления",
        items: [
          "Приложение доступно на испанском и португальском: кнопки ES и PT добавлены в меню языков кабинета и приложения для Windows (раньше там были только EN, RU, BG).",
          "Дополнительный скан снова присылает сигналы по всем рынкам, а не один.",
          "Карточка доступа показывает названия рынков, а не служебные коды; на странице ключа число компьютеров больше не пропадает.",
        ],
      },
      bg: {
        title: "Португалски език и поправки",
        items: [
          "Приложението е достъпно на испански и португалски: бутоните ES и PT са добавени в менюто за езици на кабинета и приложението за Windows.",
          "Допълнителното сканиране отново изпраща сигнали за всички пазари, а не само един.",
          "Картата за достъп показва имената на пазарите, а не служебни кодове; броят компютри на страницата с ключа вече не изчезва.",
        ],
      },
      en: {
        title: "Portuguese and fixes",
        items: [
          "The app is available in Spanish and Portuguese: ES and PT buttons added to the language menu of the cabinet and the Windows app.",
          "The extra scan again sends signals for every market, not just one.",
          "The access card shows market names instead of internal codes; the computer count on the key page no longer goes missing.",
        ],
      },
      es: {
        title: "Portugués y correcciones",
        items: [
          "La app está disponible en español y portugués: botones ES y PT en el menú de idiomas del gabinete y de la app para Windows.",
          "El escaneo extra vuelve a enviar señales de todos los mercados, no solo de uno.",
          "La tarjeta de acceso muestra los nombres de los mercados, no códigos internos; el número de ordenadores en la página de la clave ya no desaparece.",
        ],
      },
      pt: {
        title: "Português e correções",
        items: [
          "O aplicativo está disponível em espanhol e português: botões ES e PT no menu de idiomas do painel e do aplicativo para Windows.",
          "A varredura extra volta a enviar sinais de todos os mercados, não só de um.",
          "O cartão de acesso mostra os nomes dos mercados, não códigos internos; o número de computadores na página da chave não some mais.",
        ],
      },
    },
  },
  {
    version: "2.8.0",
    date: "05.11.2026",
    text: {
      ru: {
        title: "Статистика использования",
        items: [
          "Приложение отмечает, какие экраны и функции используются (без текстов, сумм и ключей), чтобы мы улучшали самое нужное.",
          "Для администратора во вкладке «Система»: активные пользователи за день, 7 и 30 дней, популярные экраны, действия, версии и платформы.",
        ],
      },
      bg: {
        title: "Статистика на използването",
        items: [
          "Приложението отбелязва кои екрани и функции се използват (без текстове, суми и ключове), за да подобряваме най-нужното.",
          "За администратора в раздел „Система“: активни потребители за ден, 7 и 30 дни, популярни екрани, действия, версии и платформи.",
        ],
      },
      en: {
        title: "Usage statistics",
        items: [
          "The app records which screens and features are used (no texts, amounts or keys) so we improve what matters most.",
          "For the admin on the “System” tab: active users per day, 7 and 30 days, popular screens, actions, versions and platforms.",
        ],
      },
      es: {
        title: "Estadísticas de uso",
        items: [
          "La app registra qué pantallas y funciones se usan (sin textos, importes ni claves) para mejorar lo más necesario.",
          "Para el administrador en la pestaña «Sistema»: usuarios activos por día, 7 y 30 días, pantallas populares, acciones, versiones y plataformas.",
        ],
      },
      pt: {
        title: "Estatísticas de uso",
        items: [
          "O aplicativo registra quais telas e funções são usadas (sem textos, valores ou chaves) para melhorarmos o que mais importa.",
          "Para o administrador na aba “Sistema”: usuários ativos por dia, 7 e 30 dias, telas populares, ações, versões e plataformas.",
        ],
      },
    },
  },
  {
    version: "2.7.0",
    date: "05.11.2026",
    text: {
      ru: {
        title: "Светлая тема и без тупиков",
        items: [
          "Светлая и тёмная тема: кнопка с солнцем или луной вверху экрана.",
          "«Журнал о трейдинге» показывает 10 свежих постов нашего Telegram-канала.",
          "Форма обратной связи прямо в разделе «Поддержка»; со страниц сайта всегда есть кнопка «Вернуться в приложение».",
        ],
      },
      bg: {
        title: "Светла тема и без задънени улици",
        items: [
          "Светла и тъмна тема: бутон със слънце или луна в горната част на екрана.",
          "„Трейдинг дневник“ показва 10 свежи публикации от нашия Telegram канал.",
          "Формата за връзка е направо в „Поддръжка“; от страниците на сайта винаги има бутон „Обратно към приложението“.",
        ],
      },
      en: {
        title: "Light theme and no dead ends",
        items: [
          "Light and dark theme: the sun or moon button at the top of the screen.",
          "“Trading journal” shows the 10 latest posts of our Telegram channel.",
          "The contact form is right in “Support”; site pages always have a “Back to the app” button.",
        ],
      },
      es: {
        title: "Tema claro y sin callejones sin salida",
        items: [
          "Tema claro y oscuro: el botón de sol o luna en la parte superior.",
          "«Diario de trading» muestra las 10 publicaciones más recientes de nuestro canal de Telegram.",
          "El formulario de contacto está en «Soporte»; las páginas del sitio siempre tienen el botón «Volver a la aplicación».",
        ],
      },
      pt: {
        title: "Tema claro e sem becos sem saída",
        items: [
          "Tema claro e escuro: o botão de sol ou lua no topo da tela.",
          "“Diário de trading” mostra os 10 posts mais recentes do nosso canal no Telegram.",
          "O formulário de contato fica direto em “Suporte”; as páginas do site sempre têm o botão “Voltar ao aplicativo”.",
        ],
      },
    },
  },
  {
    version: "2.6.0",
    date: "05.11.2026",
    text: {
      ru: {
        title: "Лицензионный ключ, статьи и предупреждение о рисках",
        items: [
          "Windows-приложение работает по лицензионному ключу. Ключ выдаётся в кабинете при активной подписке Trader и подставляется сам; один ключ работает на 2 компьютерах.",
          "Подарочные ключи на месяц или бессрочно.",
          "Новый раздел «Статьи»: разборы рынков и экономический календарь Александра Лунина с Substack и Medium, обновляется сам.",
          "Предупреждение о рисках внизу каждого экрана.",
          "Кнопка «Открыть у брокера» у каждого инструмента: регистрация у брокера Vantage.",
          "Экономический календарь: все важные события недели, на что и как они могут повлиять.",
        ],
      },
      bg: {
        title: "Лицензионен ключ, статии и предупреждение за рисковете",
        items: [
          "Windows приложението работи с лицензионен ключ. Ключът се дава в кабинета при активен абонамент за Trader и се попълва сам; един ключ работи на 2 компютъра.",
          "Подаръчни ключове за един месец или безсрочно.",
          "Нов раздел „Статии“: пазарни анализи и икономически календар от Александър Лунин от Substack и Medium, обновява се сам.",
          "Предупреждение за рисковете под всеки екран.",
          "Бутон „Отвори при брокера“ при всеки инструмент: регистрация при брокера Vantage.",
          "Икономически календар: всички важни събития за седмицата и върху какво могат да повлияят.",
        ],
      },
      en: {
        title: "License key, articles and risk warning",
        items: [
          "The Windows app works with a license key. The key is issued in the cabinet with an active Trader subscription and fills in by itself; one key works on 2 computers.",
          "Gift keys for one month or with no expiry.",
          "New “Articles” section: market breakdowns and the economic calendar by Alexander Lunin from Substack and Medium, updated automatically.",
          "Risk warning under every screen.",
          "“Open at broker” button next to each instrument: sign-up with the Vantage broker.",
          "Economic calendar: the week's key events and what they may move.",
        ],
      },
      es: {
        title: "Clave de licencia, artículos y aviso de riesgo",
        items: [
          "La app de Windows funciona con una clave de licencia. La clave se emite en el panel con una suscripción activa a Trader y se rellena sola; una clave funciona en 2 ordenadores.",
          "Claves de regalo por un mes o sin caducidad.",
          "Nueva sección «Artículos»: análisis de mercado y calendario económico de Alexander Lunin desde Substack y Medium, se actualiza sola.",
          "Aviso de riesgo debajo de cada pantalla.",
          "Botón «Abrir en el bróker» junto a cada instrumento: registro en el bróker Vantage.",
          "Calendario económico: los eventos clave de la semana y qué pueden mover.",
        ],
      },
      pt: {
        title: "Chave de licença, artigos e aviso de risco",
        items: [
          "O aplicativo para Windows funciona com uma chave de licença. A chave é emitida no painel com uma assinatura Trader ativa e é preenchida sozinha; uma chave funciona em 2 computadores.",
          "Chaves de presente por um mês ou sem prazo.",
          "Nova seção “Artigos”: análises de mercado e o calendário econômico de Alexander Lunin no Substack e no Medium, atualizados automaticamente.",
          "Aviso de risco abaixo de cada tela.",
          "Botão “Abrir na corretora” ao lado de cada instrumento: cadastro na corretora Vantage.",
          "Calendário econômico: os eventos-chave da semana e o que eles podem mover.",
        ],
      },
    },
  },
  {
    version: "2.5.0",
    date: "04.11.2026",
    text: {
      ru: {
        title: "Рабочее место трейдера: заказ сигналов прямо из приложения",
        items: [
          "Новый раздел «Заказать сигнал»: анализ любого инструмента по кнопке и дополнительное сканирование всех рынков вашего доступа, не дожидаясь планового скана.",
          "Список рынков синхронизирован с движком: 19 инструментов, включая серебро, GER40, US100 и пары EUR/JPY, GBP/JPY, USD/CAD, USD/CHF, USD/CNH. Исправлен индикатор свежести данных.",
          "Фильтры по рынкам и горизонту сделки в сигналах, фильтры по рынкам и результату в истории.",
          "Страница «О программе» с историей версий.",
        ],
      },
      bg: {
        title: "Работно място на трейдъра: поръчка на сигнали директно от приложението",
        items: [
          "Нов раздел „Поръчай сигнал“: анализ на всеки инструмент с един бутон и допълнително сканиране на всички пазари от вашия достъп без чакане на планираното сканиране.",
          "Списъкът с пазари е синхронизиран с двигателя: 19 инструмента, включително сребро, GER40, US100 и двойките EUR/JPY, GBP/JPY, USD/CAD, USD/CHF, USD/CNH. Поправен е индикаторът за актуалност на данните.",
          "Филтри по пазари и хоризонт на сделката в сигналите, филтри по пазари и резултат в историята.",
          "Страница „За програмата“ с история на версиите.",
        ],
      },
      en: {
        title: "Trader workspace: order signals right from the app",
        items: [
          "New Order a signal section: analyse any instrument with one button, or run an extra scan of every market in your access without waiting for the scheduled scan.",
          "Market list synced with the engine: 19 instruments, including silver, GER40, US100 and EUR/JPY, GBP/JPY, USD/CAD, USD/CHF, USD/CNH. Data freshness indicator fixed.",
          "Filters by market and trade horizon in Signals, by market and result in History.",
          "About page with the version history.",
        ],
      },
      es: {
        title: "Puesto del trader: pide señales directamente desde la app",
        items: [
          "Nueva sección Pedir una señal: analiza cualquier instrumento con un botón o lanza un escaneo adicional de todos los mercados de tu acceso sin esperar al escaneo programado.",
          "Lista de mercados sincronizada con el motor: 19 instrumentos, incluidos plata, GER40, US100 y EUR/JPY, GBP/JPY, USD/CAD, USD/CHF, USD/CNH. Corregido el indicador de datos actualizados.",
          "Filtros por mercado y horizonte en Señales, por mercado y resultado en Historial.",
          "Página Acerca de con el historial de versiones.",
        ],
      },
      pt: {
        title: "Espaço do trader: peça sinais direto do aplicativo",
        items: [
          "Nova seção Pedir um sinal: analise qualquer instrumento com um botão ou faça uma varredura extra de todos os mercados do seu acesso sem esperar a varredura programada.",
          "Lista de mercados sincronizada com o motor: 19 instrumentos, incluindo prata, GER40, US100 e EUR/JPY, GBP/JPY, USD/CAD, USD/CHF, USD/CNH. Indicador de atualidade dos dados corrigido.",
          "Filtros por mercado e horizonte em Sinais, por mercado e resultado em Histórico.",
          "Página Sobre com o histórico de versões.",
        ],
      },
    },
  },
  {
    version: "2.4.0",
    date: "29.10.2026",
    text: {
      ru: {
        title: "Приложение для Windows и веб-кабинет",
        items: [
          "Все экраны Mini App доступны в веб-кабинете и в приложении для Windows.",
          "Вход через Telegram, Google или код на e-mail.",
          "Меню языков: английский, русский, болгарский.",
        ],
      },
      bg: {
        title: "Приложение за Windows и уеб кабинет",
        items: [
          "Всички екрани на Mini App са достъпни в уеб кабинета и в приложението за Windows.",
          "Вход с Telegram, Google или код по e-mail.",
          "Меню за езици: английски, руски, български.",
        ],
      },
      en: {
        title: "Windows app and web cabinet",
        items: [
          "Every Mini App screen is available in the web cabinet and the Windows app.",
          "Sign in with Telegram, Google or an e-mail code.",
          "Language menu: English, Russian, Bulgarian.",
        ],
      },
      es: {
        title: "App para Windows y gabinete web",
        items: [
          "Todas las pantallas de la Mini App están en el gabinete web y en la app para Windows.",
          "Acceso con Telegram, Google o un código por e-mail.",
          "Menú de idiomas: inglés, ruso, búlgaro.",
        ],
      },
      pt: {
        title: "Aplicativo para Windows e painel web",
        items: [
          "Todas as telas do Mini App estão disponíveis no painel web e no aplicativo para Windows.",
          "Entre com Telegram, Google ou um código por e-mail.",
          "Menu de idiomas: inglês, russo, búlgaro.",
        ],
      },
    },
  },
];

interface AboutPanelProps {
  t: Translation;
  language: AppLanguage;
  appVersion: string;
  updates: AppPayload["updates"];
}

export const AboutPanel = ({ t, language, appVersion, updates }: AboutPanelProps) => (
  <section className="space-y-4">
    <div className="rounded-[28px] border border-amber-300/20 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.2),transparent_42%),linear-gradient(145deg,#151923,#0b0d13)] p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-amber-300 to-orange-500">
            <Bot className="h-6 w-6 text-[#171006]" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">NICS Trading Ecosystem</h1>
            <p className="text-xs text-slate-400">
              {t.appVersion} {appVersion}
            </p>
          </div>
        </div>
        <Badge className="bg-amber-400 text-black hover:bg-amber-400">{appVersion}</Badge>
      </div>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300">{t.aboutLead}</p>
    </div>

    <Card className="border-white/10 bg-white/[0.045] text-white shadow-none">
      <CardContent className="p-5">
        <p className="text-xs uppercase tracking-[0.18em] text-amber-300/80">{t.createdBy}</p>
        <p className="mt-3 text-lg font-semibold">Александр Лунин · Alexander Lunin</p>
        <p className="mt-1 text-sm text-slate-300">NICS AI Ecosystem</p>
        <p className="mt-1 text-sm text-slate-400">by AI Byte Consult Ltd</p>
      </CardContent>
    </Card>

    {/* 2026-11-11: the installer link inside the app (Mini App, cabinet, Windows app). */}
    <Card className="border-white/10 bg-white/[0.045] text-white shadow-none">
      <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
        <div className="max-w-xl">
          <p className="font-semibold">{t.downloadApp}</p>
          <p className="mt-1 text-sm leading-6 text-slate-400">{t.downloadAppLead}</p>
        </div>
        <Button
          onClick={() => openExternal(WINDOWS_APP_DOWNLOAD_URL)}
          className="bg-amber-400 text-black hover:bg-amber-300"
        >
          <Download className="mr-1.5 h-4 w-4" />
          {t.downloadAppButton}
        </Button>
      </CardContent>
    </Card>

    <h2 className="pt-2 text-sm font-medium text-slate-300">{t.versionHistory}</h2>
    {APP_RELEASES.map((release, index) => {
      const text = release.text[language] ?? release.text.en;
      return (
        <Card key={release.version} className="border-white/10 bg-white/[0.045] text-white shadow-none">
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Badge className={index === 0 ? "bg-amber-400 text-black hover:bg-amber-400" : "bg-white/10 text-slate-300"}>
                  {release.version}
                </Badge>
                <h3 className="mt-3 font-semibold">{text.title}</h3>
              </div>
              <span className="text-xs text-slate-500">{release.date}</span>
            </div>
            <ul className="mt-4 space-y-2">
              {text.items.map((item) => (
                <li key={item} className="flex gap-2 text-sm leading-5 text-slate-400">
                  <span className="mt-1 text-amber-300">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      );
    })}

    {updates.length > 0 && (
      <>
        <h2 className="flex items-center gap-2 pt-2 text-sm font-medium text-slate-300">
          <Sparkles className="h-4 w-4 text-amber-300" />
          {t.serverUpdates}
        </h2>
        {updates.map((update) => (
          <Card key={`${update.version}-${update.date}`} className="border-white/10 bg-white/[0.03] text-white shadow-none">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <p className="text-sm font-medium">
                  <span className="mr-2 text-slate-500">{update.version}</span>
                  {update.title}
                </p>
                <span className="shrink-0 text-xs text-slate-500">{update.date}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </>
    )}
  </section>
);
