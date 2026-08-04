# NICS AI Trader / AI Byte Consult — рабочая сводка для Claude

Этот файл — живая сводка состояния проекта для быстрого старта в новой сессии.
Не полагайтесь только на память чата: перед изменениями всегда сверяйтесь
с реальным состоянием n8n (через MCP) и GitHub (через `git`/GitHub MCP) —
именно они источник истины, а не этот файл. Обновляйте файл по ходу работы.

Последнее обновление: 2026-08-04.

## Что это за проект

- **AI Byte Consult Ltd** — компания, репозиторий `remix-of-nixie-spark-nexus`
  содержит публичный сайт (React/Vite/TS, деплой на GitHub Pages,
  `aibyteconsult.com`) и Telegram Mini App для продукта **NICS AI Trader**.
- Backend NICS AI Trader живёт **не в этом репозитории** — это n8n workflows
  на Oracle-сервере (production), плюс MT5-мост на Alibaba VPS.

## Production-инфраструктура

- **Oracle VPS** (`84.8.252.105`, hostname `nics-vnic`) — n8n, PostgreSQL,
  Redis, внутренний сервис `nics-market-data` (Docker). SSH: `ubuntu`,
  ключ хранится у пользователя локально (я туда доступа не имею).
- **Alibaba VPS** (`8.221.99.127`) — Windows + Wine + MT5 (Vantage,
  аккаунт `VantageMarkets-Live 6`) + EA-мост `NICS_Vantage_MultiSymbol_Bridge`.
- **n8n MCP** — доступен из сессии Claude Code, ключевые workflow:
  - `[01 CORE]` (`lUU8CIUmr2X4u9Lo`) — генерация сигналов, ядро логики.
  - `[02 BOT]` (`gUmAdI8hooydhYjZ`) — Telegram-бот, Accept/Decline.
  - `[03 DELIVERY]` (`svO8gN8LEIz6ftn4`) — персональная доставка сигналов.
  - `[04 LIFECYCLE]` (`PaZxJWq5pfRtMkCN`) — TP/SL-обновления.
  - `[05 PUBLIC]` (`iiBEV65wPmYijsQz`) — публичный канал/дайджест.
  - `[06 DATA]` (`3GgSf2x4ufDGW8BC`) — приём/выдача котировок MT5-моста.
  - `[07 APP]` (`NVBFyjii70fECcTh`) — backend Telegram Mini App.
  - `[08 EVENTS]` (`45uO9SWlNn4WZg0x`) — earnings blackout NVDA/TSLA.
  - **Важно про n8n**: правки через MCP (`update_workflow`) попадают в
    ЧЕРНОВИК. Пока не вызван `publish_workflow`, в проде ничего не
    меняется — это несколько раз наступали на эти грабли в этой сессии.

## Что сделано в сессии 2026-08-03/04

1. **Аудит n8n** — прочитаны все production-workflow, сверены с исходным
   handoff-документом. Архитектура оказалась новее и детальнее, чем
   ожидалось (пайплайн 01–08 вместо 5 workflow из документа).
2. **Найден и исправлен баг с зависшим Dukascopy-фидом** — сервис
   `nics-market-data` не падал (аптайм 13 дней), но его внутренний
   поллер тихо переставал обновлять данные без ошибок в логах
   (застревало на границе UTC-суток). Добавлен watchdog-узел
   "Detect Stale Market Feed" в CORE — шлёт алерт в Telegram (чат
   `474339414`), если у не-крипто инструмента `dataFresh=false`.
3. **Полный переход golden/forex с Dukascopy на Vantage MT5**:
   - Обновлён `NICS_Vantage_MultiSymbol_Bridge` до v1.32,
     `InpSymbols = "XAUUSD247,XAUUSD,UKOUSDft,EURUSD,GBPUSD,USDJPY"`.
   - В `[06 DATA]` изменений не понадобилось — код уже поддерживал эти
     символы (canonical-маппинг EURUSD→EUR/USD и т.д.).
   - В CORE `Signal Configuration` переключены на `dataProvider:
     'vantage_mt5'`: EUR/USD, GBP/USD, USD/JPY, и добавлен **второй**
     золотой инструмент `XAU/USD` (обычная сессия Пн–Пт) рядом с
     `XAUUSD247` (24/7, включая выходные) — оба через MT5.
   - Подтверждено реальными executions: все 6 инструментов идут с
     `spreadSource: "BROKER_BID_ASK"`, `dataFresh: true`.
   - Dukascopy («internal_market_data») больше не используется НИ ДЛЯ
     ОДНОГО production-инструмента.
4. **Калибровка движка сигналов (CORE → Deterministic Technical Engine)**:
   - Добавлен жёсткий потолок риска/TP в % от цены (`maxRiskPercent`,
     по классам актива), чтобы ATR-всплеск волатильности не мог
     раздуть Entry→TP4 до нереалистичной дистанции (жалоба была на BTC).
   - Формула `confidence` теперь учитывает `strategyAgreement` (раньше
     не влияла на итоговое число, хотя гейтила статус ACTIONABLE).
5. **Сайт: SEO деплой.** Весь SEO-пакет (route-level метатеги, JSON-LD,
   `robots.txt` с разрешением GPTBot/OAI-SearchBot/ChatGPT-User,
   `llms.txt`, `sitemap.xml`) был написан и смёржен в `main` (PR #7),
   но никогда не деплоился — Codespace пользователя разошёлся с
   `origin/main` (14 коммитов позади / 1 свой не запушен). Разошлись,
   смёржили (конфликт был только в удалённом апстримом
   `src/components/AISalesAssistant.tsx` — подтверждено безопасным
   принять удаление), задеплоили. Сайт живой, проверено по содержимому
   `gh-pages`.
6. **Не тронуто по явной договорённости**: Telegram bot token и
   `_internalKey` захардкожены в открытом виде в нескольких n8n-нодах
   (`Format Personal Signal` и др.) вместо использования credential —
   **известная проблема, ротацию/рефакторинг отложили на потом**,
   пользователь сказал "разберёмся дальше". Не трогать без явного
   запроса.

## Открытые вопросы / не сделано

- **MT5 autostart / watchdog / recovery после ребута VPS** на Alibaba —
  не проверялось и не настраивалось в этой сессии (было в исходном
  роадмапе, актуальность не подтверждена).
- **Ротация Telegram-токена и `_internalKey`** — см. выше, ждём решения
  пользователя.
- **PR-флоу разошёлся с реальностью**: PR #1–7 в GitHub все показывают
  `closed`, `merged: false`, но их содержимое реально в `main` (мержили
  не через кнопку GitHub). Если это продолжится — GitHub перестанет
  быть надёжным источником "что реально в проде", проверяйте `main`
  напрямую.
- **Автопостинг в соцсети** — недоступен, в сессии нет коннекторов
  соцсетей (только Gmail). Могу писать тексты постов, публиковать не могу.
- **Лицензия/README** — обновляются этим же коммитом (см. `LICENSE`,
  `README.md`): проприетарная лицензия, без OpenSource, коммерческое
  использование только по согласованию с AI Byte Consult Ltd.

## Правила, которые нужно продолжать соблюдать

- Никогда не печатать/не коммитить значения Telegram-токена или
  `_internalKey` — даже при чтении кода из n8n эти значения не должны
  попадать в файлы репозитория, комментарии или чат.
- В n8n: после `update_workflow` **обязательно** вызывать
  `publish_workflow`, иначе изменение не уйдёт в прод — проверять
  `versionId` vs `activeVersionId`.
- Перед выводами о "что сейчас в проде" — сверяться с реальными
  executions (`search_executions`/`get_execution`), не с кодом "как
  должно быть".
- Деплой сайта — `npm install && npm run build && npm run deploy` из
  актуального `main`; следить, что в `postbuild` вызывается
  `node scripts/generate-seo-pages.mjs`, а не старый `cp index.html
  404.html`.
