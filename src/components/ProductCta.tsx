import { useState } from "react";
import { Calculator, Check, Gift, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";

// Free first step on /nics-video and /trading: the product itself instead of a
// checklist by email. Video opens the 10 free credits dialog; Trader gives a lot
// size calculator right on the page and the bot's free trial.
export type ProductCtaKind = "video" | "trader";
type Lang = "en" | "ru" | "bg";

const BOT_URL = "https://t.me/nics_ai_bot?start=src_site_cta";

const videoCopy: Record<Lang, { badge: string; title: string; text: string; bullets: string[]; button: string }> = {
  en: {
    badge: "Free",
    title: "Your first video is free",
    text: "Sign in with your email, get 10 credits and upload 3 to 10 clips from your phone right on this page. In a few minutes you get the finished package.",
    bullets: ["1 Short for Reels, TikTok and Shorts", "1 long video for YouTube", "4 covers in your language and in English"],
    button: "Get 10 free credits",
  },
  ru: {
    badge: "Бесплатно",
    title: "Первый ролик бесплатно",
    text: "Войдите по email, получите 10 кредитов и загрузите 3–10 клипов с телефона прямо на этой странице. Через несколько минут у вас готовый пакет.",
    bullets: ["1 Short для Reels, TikTok и Shorts", "1 длинное видео для YouTube", "4 обложки на вашем языке и на английском"],
    button: "Получить 10 кредитов бесплатно",
  },
  bg: {
    badge: "Безплатно",
    title: "Първото видео е безплатно",
    text: "Влезте с имейл, вземете 10 кредита и качете 3–10 клипа от телефона направо на тази страница. След няколко минути имате готовия пакет.",
    bullets: ["1 Short за Reels, TikTok и Shorts", "1 дълго видео за YouTube", "4 корици на вашия език и на английски"],
    button: "Вземете 10 кредита",
  },
};

const traderCopy: Record<Lang, {
  badge: string; title: string; text: string; calc: string; deposit: string; risk: string; entry: string; stop: string;
  instrument: string; result: (lot: string, money: string) => string; hint: string; bad: string; button: string; note: string;
}> = {
  en: {
    badge: "Free",
    title: "Lot size calculator and 3 days of signals",
    text: "Paste the entry and stop from any signal: the calculator shows the lot that risks exactly the share of the deposit you chose. Then try our signals in Telegram for 3 days free.",
    calc: "Lot size from your risk",
    deposit: "Deposit, USD",
    risk: "Risk per trade, %",
    entry: "Entry price",
    stop: "Stop price",
    instrument: "Instrument",
    result: (lot, money) => `Lot: ${lot}. If the stop is hit you lose about ${money}.`,
    hint: "For a USD account. Contract size can differ by broker, check it in your terminal.",
    bad: "Enter a deposit, a risk and two different prices.",
    button: "Start the free trial in Telegram",
    note: "Trading involves risk of loss. Signals are not investment advice.",
  },
  ru: {
    badge: "Бесплатно",
    title: "Калькулятор лота и 3 дня сигналов",
    text: "Вставьте вход и стоп из любого сигнала: калькулятор покажет лот, при котором вы рискуете ровно выбранной долей депозита. А сигналы попробуйте в Telegram 3 дня бесплатно.",
    calc: "Лот от вашего риска",
    deposit: "Депозит, USD",
    risk: "Риск на сделку, %",
    entry: "Цена входа",
    stop: "Цена стопа",
    instrument: "Инструмент",
    result: (lot, money) => `Лот: ${lot}. Если сработает стоп, потеря около ${money}.`,
    hint: "Для счёта в USD. Размер контракта у брокеров бывает разным, сверьте в терминале.",
    bad: "Введите депозит, риск и две разные цены.",
    button: "Начать бесплатный период в Telegram",
    note: "Торговля связана с риском потерь. Сигналы не являются инвестиционным советом.",
  },
  bg: {
    badge: "Безплатно",
    title: "Калкулатор на лота и 3 дни сигнали",
    text: "Поставете входа и стопа от всеки сигнал: калкулаторът показва лота, при който рискувате точно избрания дял от депозита. А сигналите пробвайте в Telegram 3 дни безплатно.",
    calc: "Лот според риска ви",
    deposit: "Депозит, USD",
    risk: "Риск на сделка, %",
    entry: "Цена на входа",
    stop: "Цена на стопа",
    instrument: "Инструмент",
    result: (lot, money) => `Лот: ${lot}. Ако стопът се задейства, загубата е около ${money}.`,
    hint: "За сметка в USD. Размерът на контракта зависи от брокера, проверете в терминала.",
    bad: "Въведете депозит, риск и две различни цени.",
    button: "Започнете безплатния период в Telegram",
    note: "Търговията е свързана с риск от загуби. Сигналите не са инвестиционен съвет.",
  },
};

// Only USD-quoted instruments: there one price unit of one lot is worth
// exactly contract size in USD, so the math needs no exchange rate.
const INSTRUMENTS = [
  { id: "XAUUSD", contract: 100 },
  { id: "EURUSD", contract: 100000 },
  { id: "GBPUSD", contract: 100000 },
  { id: "AUDUSD", contract: 100000 },
  { id: "NZDUSD", contract: 100000 },
];

const num = (v: string) => Number(v.replace(",", "."));

const LotCalculator = ({ c }: { c: (typeof traderCopy)[Lang] }) => {
  const [deposit, setDeposit] = useState("1000");
  const [risk, setRisk] = useState("1");
  const [instrument, setInstrument] = useState(INSTRUMENTS[0].id);
  const [entry, setEntry] = useState("");
  const [stop, setStop] = useState("");

  const contract = INSTRUMENTS.find((i) => i.id === instrument)?.contract ?? 100000;
  const riskMoney = (num(deposit) * num(risk)) / 100;
  const distance = Math.abs(num(entry) - num(stop));
  const ready = riskMoney > 0 && distance > 0 && Number.isFinite(riskMoney) && Number.isFinite(distance);
  // Brokers take lots in steps of 0.01: round down so the risk never exceeds the chosen one.
  const lot = ready ? Math.floor((riskMoney / (distance * contract)) * 100) / 100 : 0;
  const lost = lot * distance * contract;
  const usd = (v: number) => `$${v.toFixed(2)}`;

  const field = "h-11 bg-background border-border focus:border-primary rounded-xl";
  return (
    <div className="min-w-0 rounded-2xl border border-primary/30 bg-background/60 p-5 space-y-4">
      <div className="flex items-center gap-2 font-semibold text-foreground">
        <Calculator className="h-5 w-5 text-primary" />
        {c.calc}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <label className="space-y-1 text-xs text-muted-foreground">
          {c.deposit}
          <Input inputMode="decimal" value={deposit} onChange={(e) => setDeposit(e.target.value)} className={field} />
        </label>
        <label className="space-y-1 text-xs text-muted-foreground">
          {c.risk}
          <Input inputMode="decimal" value={risk} onChange={(e) => setRisk(e.target.value)} className={field} />
        </label>
        <label className="col-span-2 space-y-1 text-xs text-muted-foreground">
          {c.instrument}
          <select
            value={instrument}
            onChange={(e) => setInstrument(e.target.value)}
            className="flex h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground"
          >
            {INSTRUMENTS.map((i) => (
              <option key={i.id} value={i.id}>{i.id}</option>
            ))}
          </select>
        </label>
        <label className="space-y-1 text-xs text-muted-foreground">
          {c.entry}
          <Input inputMode="decimal" value={entry} onChange={(e) => setEntry(e.target.value)} placeholder={instrument === "XAUUSD" ? "2650.00" : "1.0850"} className={field} />
        </label>
        <label className="space-y-1 text-xs text-muted-foreground">
          {c.stop}
          <Input inputMode="decimal" value={stop} onChange={(e) => setStop(e.target.value)} placeholder={instrument === "XAUUSD" ? "2640.00" : "1.0820"} className={field} />
        </label>
      </div>
      <p role="status" className="text-sm font-medium text-foreground">
        {ready ? c.result(lot.toFixed(2), usd(lost)) : c.bad}
      </p>
      <p className="text-xs text-muted-foreground">{c.hint}</p>
    </div>
  );
};

const ProductCta = ({ kind, onStart }: { kind: ProductCtaKind; onStart?: () => void }) => {
  const { language } = useLanguage();
  const lang: Lang = language === "ru" || language === "bg" ? language : "en";

  if (kind === "video") {
    const c = videoCopy[lang];
    return (
      <section id="free" className="py-20 bg-background scroll-mt-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/10 via-card to-card p-6 sm:p-10 shadow-card">
            <div className="grid gap-8 md:grid-cols-2 md:items-center">
              <div className="min-w-0 space-y-4">
                <Badge variant="outline" className="border-primary/40 text-primary">
                  <Gift className="mr-2 h-3.5 w-3.5" />
                  {c.badge}
                </Badge>
                <h2 className="text-2xl sm:text-3xl font-semibold text-foreground leading-tight">{c.title}</h2>
                <p className="text-muted-foreground leading-relaxed">{c.text}</p>
              </div>
              <div className="min-w-0 space-y-5">
                <ul className="space-y-2">
                  {c.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-foreground">
                      <Check className="h-4 w-4 mt-1 shrink-0 text-primary" />
                      {b}
                    </li>
                  ))}
                </ul>
                <Button size="lg" onClick={onStart} className="w-full h-auto min-h-11 whitespace-normal py-3 rounded-full bg-gradient-gold text-white font-semibold">
                  {c.button}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const c = traderCopy[lang];
  return (
    <section id="free" className="py-20 bg-background scroll-mt-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/10 via-card to-card p-6 sm:p-10 shadow-card">
          <div className="grid gap-8 md:grid-cols-2 md:items-start">
            <div className="min-w-0 space-y-4">
              <Badge variant="outline" className="border-primary/40 text-primary">
                <Gift className="mr-2 h-3.5 w-3.5" />
                {c.badge}
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-semibold text-foreground leading-tight">{c.title}</h2>
              <p className="text-muted-foreground leading-relaxed">{c.text}</p>
              <a href={BOT_URL} target="_blank" rel="noopener noreferrer" className="block">
                <Button size="lg" className="w-full h-auto min-h-11 whitespace-normal py-3 rounded-full bg-gradient-gold text-white font-semibold">
                  <Send className="mr-2 h-4 w-4" />
                  {c.button}
                </Button>
              </a>
              <p className="text-xs text-muted-foreground">{c.note}</p>
            </div>
            <LotCalculator c={c} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductCta;
