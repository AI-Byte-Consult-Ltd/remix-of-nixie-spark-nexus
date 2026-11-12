import Link from "@/components/SiteLink";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  WINDOWS_APP_DOWNLOAD,
  WINDOWS_APP_LANGS,
  WINDOWS_APP_STORE_URL,
  windowsAppPath,
  windowsAppTextsFor,
} from "@/i18n/windowsApp";
import {
  ArrowLeft,
  BarChart3,
  BellRing,
  BookOpen,
  CalendarDays,
  Check,
  ChevronDown,
  Download,
  History,
  KeyRound,
  Minus,
  Monitor,
  Search,
  Store,
} from "lucide-react";

const SITE_URL = "https://aibyteconsult.com";
const FEATURE_ICONS = [BellRing, Search, History, CalendarDays, BarChart3, BookOpen];

// Real screenshots of the Windows app go here (files in public/apps/windows/).
// The section stays hidden while the list is empty: no mock-ups on this page.
const SCREENSHOTS: { src: string; alt: string }[] = [
  { src: "/apps/windows/win-order-signal.webp", alt: "NICS AI Trader for Windows: signals list with an analysis request in progress" },
  { src: "/apps/windows/win-calendar.webp", alt: "NICS AI Trader for Windows: economic calendar for the week" },
];

const tradingPath = (lang: string) =>
  lang === "en" ? "/trading" : `/${lang}/trading`;

const NicsWindowsApp = () => {
  const { language } = useLanguage();
  const tx = windowsAppTextsFor(language);
  const pageLang = (WINDOWS_APP_LANGS as readonly string[]).includes(language) ? language : "en";
  const canonical = `${SITE_URL}${windowsAppPath(pageLang)}/`;

  const seo = {
    title: tx.seoTitle,
    description: tx.seoDescription,
    canonical,
    htmlLang: pageLang,
    ogImage: `${SITE_URL}/og-trading.jpg`,
    alternates: [
      ...WINDOWS_APP_LANGS.map((lang) => ({ lang, href: `${SITE_URL}${windowsAppPath(lang)}/` })),
      { lang: "x-default", href: `${SITE_URL}/nics-windows-app/` },
    ],
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "NICS AI Trader for Windows",
        applicationCategory: "FinanceApplication",
        operatingSystem: "Windows 10, Windows 11",
        downloadUrl: `${SITE_URL}${WINDOWS_APP_DOWNLOAD}`,
        fileSize: "1.3MB",
        url: canonical,
        description: tx.seoDescription,
        publisher: { "@type": "Organization", name: "AI Byte Consult Ltd", url: `${SITE_URL}/` },
        offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: tx.faq.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  };

  return (
    <>
      <SEO {...seo} />
      <main className="min-h-screen bg-background text-foreground">
        <Header />

        <section className="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-24">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,hsl(var(--primary)/0.16),transparent_40%),radial-gradient(circle_at_85%_70%,rgba(59,130,246,0.12),transparent_40%)]" />
          <div className="container relative z-10 mx-auto px-4">
            <Link
              to={tradingPath(pageLang)}
              className="mb-8 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {tx.backToTrading}
            </Link>
            <div className="max-w-3xl">
              <Badge className="mb-6 border-primary/25 bg-primary/10 text-primary hover:bg-primary/10">
                <Monitor className="mr-2 h-3.5 w-3.5" />
                {tx.badge}
              </Badge>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">{tx.title}</h1>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground md:text-xl">{tx.subtitle}</p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a href={WINDOWS_APP_DOWNLOAD} download>
                  <Button size="lg" className="w-full rounded-full px-8 sm:w-auto">
                    <Download className="mr-2 h-4 w-4" />
                    {tx.download}
                  </Button>
                </a>
                {WINDOWS_APP_STORE_URL ? (
                  <a href={WINDOWS_APP_STORE_URL} target="_blank" rel="noopener noreferrer">
                    <Button size="lg" variant="outline" className="w-full rounded-full px-8 sm:w-auto">
                      <Store className="mr-2 h-4 w-4" />
                      {tx.store}
                    </Button>
                  </a>
                ) : (
                  <Button size="lg" variant="outline" disabled className="w-full rounded-full px-8 sm:w-auto">
                    <Store className="mr-2 h-4 w-4" />
                    {tx.storeSoon}
                  </Button>
                )}
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{tx.downloadNote}</p>
              <Link to="/cabinet" className="mt-2 inline-block text-sm text-primary underline-offset-4 hover:underline">
                {tx.webAlt}
              </Link>
            </div>
          </div>
        </section>

        <section className="border-y border-border/60 bg-muted/25 py-20">
          <div className="container mx-auto px-4">
            <h2 className="mb-10 text-3xl font-semibold md:text-4xl">{tx.featuresTitle}</h2>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {tx.features.map((feature, index) => {
                const Icon = FEATURE_ICONS[index] ?? Check;
                return (
                  <Card key={feature.title} className="h-full border-border/60 bg-card/70">
                    <CardHeader>
                      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm leading-relaxed text-muted-foreground">{feature.desc}</CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {SCREENSHOTS.length > 0 && (
          <section className="py-20">
            <div className="container mx-auto px-4">
              <h2 className="mb-10 text-3xl font-semibold md:text-4xl">{tx.screensTitle}</h2>
              <div className="grid gap-6 lg:grid-cols-2">
                {SCREENSHOTS.map((shot) => (
                  <img
                    key={shot.src}
                    src={shot.src}
                    alt={shot.alt}
                    loading="lazy"
                    width={1535}
                    height={722}
                    className="w-full rounded-2xl border border-border/60 shadow-lg"
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="py-20">
          <div className="container mx-auto grid gap-10 px-4 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-2xl font-semibold md:text-3xl">{tx.reqTitle}</h2>
              <ul className="space-y-3">
                {tx.requirements.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-muted-foreground">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-2xl font-semibold md:text-3xl">{tx.installTitle}</h2>
              <ol className="space-y-4">
                {tx.install.map((item, index) => (
                  <li key={item} className="flex items-start gap-4">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {index + 1}
                    </span>
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="border-y border-border/60 bg-muted/25 py-20">
          <div className="container mx-auto grid gap-10 px-4 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 flex items-center gap-3 text-2xl font-semibold md:text-3xl">
                <KeyRound className="h-6 w-6 text-primary" />
                {tx.licenseTitle}
              </h2>
              <div className="space-y-4 text-muted-foreground">
                {tx.license.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
              <Link to={`${tradingPath(pageLang)}#nics-trader-plans`} className="mt-8 inline-block">
                <Button size="lg" variant="secondary" className="rounded-full px-8">
                  {tx.licenseCta}
                </Button>
              </Link>
            </div>
            <div>
              <h2 className="mb-6 text-2xl font-semibold md:text-3xl">{tx.compareTitle}</h2>
              <div className="overflow-hidden rounded-2xl border border-border/60 bg-background/80">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/60 text-left">
                      <th className="p-3 font-medium">{tx.compareFeature}</th>
                      <th className="w-20 p-3 text-center font-medium">{tx.compareFree}</th>
                      <th className="w-20 p-3 text-center font-medium">{tx.comparePro}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tx.compareRows.map((row) => (
                      <tr key={row.label} className="border-b border-border/40 last:border-0">
                        <td className="p-3 text-muted-foreground">{row.label}</td>
                        {[row.free, row.pro].map((on, index) => (
                          <td key={index} className="p-3 text-center">
                            {on ? (
                              <Check className="mx-auto h-4 w-4 text-green-500" aria-label="yes" />
                            ) : (
                              <Minus className="mx-auto h-4 w-4 text-muted-foreground/60" aria-label="no" />
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto max-w-3xl px-4">
            <h2 className="mb-8 text-3xl font-semibold md:text-4xl">{tx.faqTitle}</h2>
            <div className="space-y-3">
              {tx.faq.map((item) => (
                <details key={item.q} className="group rounded-2xl border border-border/60 bg-card/70 p-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                    {item.q}
                    <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-3 leading-relaxed text-muted-foreground">{item.a}</p>
                </details>
              ))}
            </div>
            <div className="mt-10 text-center">
              <a href={WINDOWS_APP_DOWNLOAD} download>
                <Button size="lg" className="rounded-full px-8">
                  <Download className="mr-2 h-4 w-4" />
                  {tx.download}
                </Button>
              </a>
            </div>
            <p className="mt-10 text-center text-xs leading-relaxed text-muted-foreground">{tx.disclaimer}</p>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default NicsWindowsApp;
