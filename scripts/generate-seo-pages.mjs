import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { subPageTranslations } from "../src/contexts/subPageTranslations.ts";

const distDir = path.resolve("dist");
const basePath = path.join(distDir, "index.html");
const baseHtml = await readFile(basePath, "utf8");
const siteUrl = "https://aibyteconsult.com";
const defaultImage = `${siteUrl}/android-chrome-512x512.png`;

// Every language the site supports, sourced once here — everything below
// (routes, hreflang groups, sitemap entries, translated title/description
// and FAQ schema) is derived from this list and from
// src/contexts/subPageTranslations.ts, never hand-duplicated per language.
// See src/contexts/LanguageContext.tsx's Language type and URL_LANGUAGES.
const ALL_LANGUAGES = ["en", "de", "fr", "ar", "zh", "pl", "tr", "it", "bg", "ru", "es", "pt"];
const OG_LOCALE = {
  en: "en_US", de: "de_DE", fr: "fr_FR", ar: "ar_SA", zh: "zh_CN",
  pl: "pl_PL", tr: "tr_TR", it: "it_IT", bg: "bg_BG", ru: "ru_RU",
  es: "es_ES", pt: "pt_BR",
};

const t = (lang, key) => subPageTranslations[lang]?.[key] ?? subPageTranslations.en[key];

const localePath = (lang, base) => {
  if (lang === "en") return base;
  return base === "/" ? `/${lang}` : `/${lang}${base}`;
};

// Builds the hreflang group for a base route ("/" or "/trading"): every
// supported language pointing at its own path, plus x-default pointing at
// the English (unprefixed) one — Google's hreflang requirement is that
// each variant lists every variant, itself included.
const alternatesFor = (base) => [
  ...ALL_LANGUAGES.map((lang) => ({ lang, path: localePath(lang, base) })),
  { lang: "x-default", path: base },
];

const homeAlternates = alternatesFor("/");
const tradingAlternates = alternatesFor("/trading");
const videoAlternates = alternatesFor("/nics-video");
const studioAlternates = alternatesFor("/nics-studio");

// Public profiles of the company, listed as Organization.sameAs so search
// engines can tie them to the site.
const SAME_AS = [
  "https://t.me/TravelTradeBook",
  "https://t.me/nics_ai_bot",
  "https://www.youtube.com/channel/UCfC75nacgk2RLwaRm1Q0NIg",
];

const organizationNode = {
  "@type": "Organization",
  "@id": `${siteUrl}/#organization`,
  name: "AI Byte Consult Ltd",
  alternateName: "AI Byte Consult",
  url: `${siteUrl}/`,
  logo: defaultImage,
  email: "info@aibyteconsult.com",
  telephone: "+359988899109",
  foundingDate: "2011",
  address: { "@type": "PostalAddress", addressCountry: "BG" },
  areaServed: "Worldwide",
  sameAs: SAME_AS,
};

const websiteNode = {
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  url: `${siteUrl}/`,
  name: "AI Byte Consult",
  inLanguage: ALL_LANGUAGES,
  publisher: { "@id": `${siteUrl}/#organization` },
};

const homeSchema = {
  "@context": "https://schema.org",
  "@graph": [organizationNode, websiteNode],
};

// Every page carries the Organization and WebSite nodes in its own graph, so
// the publisher/isPartOf @id references below always resolve on that page.
const withSiteNodes = (nodes) => ({
  "@context": "https://schema.org",
  "@graph": [organizationNode, websiteNode, ...nodes],
});

const videoSchema = (canonical, lang) =>
  withSiteNodes([
    {
      "@type": "SoftwareApplication",
      "@id": `${siteUrl}/nics-video#software`,
      name: "NICS Video",
      applicationCategory: "MultimediaApplication",
      operatingSystem: "Web",
      url: canonical,
      inLanguage: lang,
      description: t(lang, "seo.nicsvideo.description"),
      provider: { "@id": `${siteUrl}/#organization` },
      offers: [
        { "@type": "Offer", name: "Free start — 10 credits", price: "0", priceCurrency: "EUR" },
        { "@type": "Offer", name: "Start — 60 credits / 30 days", price: "14.99", priceCurrency: "EUR" },
        { "@type": "Offer", name: "Creator — 250 credits / 30 days", price: "34.99", priceCurrency: "EUR" },
        { "@type": "Offer", name: "Pro — 700 credits / 30 days", price: "69.99", priceCurrency: "EUR" },
      ],
    },
  ]);

const studioSchema = (canonical, lang) =>
  withSiteNodes([
    {
      "@type": "WebApplication",
      "@id": `${siteUrl}/nics-studio#software`,
      name: "NICS Studio",
      applicationCategory: "MultimediaApplication",
      operatingSystem: "Web",
      browserRequirements: "Requires a current Chrome, Edge or Safari with WebCodecs",
      url: canonical,
      inLanguage: lang,
      description: t(lang, "seo.nicsstudio.description"),
      provider: { "@id": `${siteUrl}/#organization` },
    },
  ]);

const tradingSchema = (canonical, lang) => withSiteNodes([
    {
      "@type": "SoftwareApplication",
      "@id": `${siteUrl}/trading#software`,
      name: "NICS AI Trader",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Telegram Web App",
      url: canonical,
      description: t(lang, "tradingpage.schema.description"),
      provider: { "@id": `${siteUrl}/#organization` },
      featureList: [
        "Entry, Stop Loss and TP1–TP4",
        "Gold, Forex, Brent Oil and Bitcoin coverage",
        "Personal risk profile",
        "Signal acceptance and lifecycle tracking",
        "Telegram and Mini App delivery",
      ],
    },
    {
      "@type": "OfferCatalog",
      name: "NICS AI Trader access plans",
      itemListElement: [
        { "@type": "Offer", name: "AI Trader Demo", price: "0", priceCurrency: "EUR", url: "https://t.me/nics_ai_bot" },
        { "@type": "Offer", name: "AI Trader Single Market — 30 days", price: "34.99", priceCurrency: "EUR", url: "https://t.me/nics_ai_bot" },
        { "@type": "Offer", name: "AI Trader Multi-Market — 30 days", price: "52.99", priceCurrency: "EUR", url: "https://t.me/nics_ai_bot" },
        { "@type": "Offer", name: "AI Trader Full Coverage — 30 days", price: "79.99", priceCurrency: "EUR", url: "https://t.me/nics_ai_bot" },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [1, 2, 3, 4, 5, 6].map((n) => ({
        "@type": "Question",
        name: t(lang, `tradingpage.faq${n}.q`),
        acceptedAnswer: { "@type": "Answer", text: t(lang, `tradingpage.faq${n}.a`) },
      })),
    },
]);

// Home (/), /trading, /nics-video and /nics-studio exist in every supported language — see
// src/App.tsx's routes and src/contexts/LanguageContext.tsx's
// getLocalizedSeoMeta(). Every other route below stays English-only.
const localizedPages = ALL_LANGUAGES.flatMap((lang) => {
  const homeRoute = localePath(lang, "/");
  const tradingRoute = localePath(lang, "/trading");
  const videoRoute = localePath(lang, "/nics-video");
  const studioRoute = localePath(lang, "/nics-studio");
  return [
    {
      route: homeRoute,
      title: t(lang, "seo.home.title"),
      description: t(lang, "seo.home.description"),
      type: "website",
      lang,
      locale: OG_LOCALE[lang],
      ogImage: `${siteUrl}/og-home.jpg`,
      alternates: homeAlternates,
      schema: homeSchema,
    },
    {
      route: tradingRoute,
      title: t(lang, "tradingpage.seo.title"),
      description: t(lang, "tradingpage.seo.description"),
      type: "product",
      lang,
      locale: OG_LOCALE[lang],
      // No dedicated og-trading.jpg exists yet — reuse the real home banner
      // rather than point social previews at a missing file.
      ogImage: `${siteUrl}/og-trading.jpg`,
      ogImageAlt: "NICS AI Trader — structured trading signals in Telegram",
      alternates: tradingAlternates,
      schema: tradingSchema(`${siteUrl}${tradingRoute}`, lang),
    },
    {
      route: videoRoute,
      title: t(lang, "seo.nicsvideo.title"),
      description: t(lang, "seo.nicsvideo.description"),
      type: "website",
      lang,
      locale: OG_LOCALE[lang],
      ogImage: `${siteUrl}/og-video.jpg`,
      ogImageAlt: "NICS Video — raw clips in, ready Shorts and YouTube videos out",
      alternates: videoAlternates,
      schema: videoSchema(`${siteUrl}${videoRoute}`, lang),
    },
    {
      route: studioRoute,
      title: t(lang, "seo.nicsstudio.title"),
      description: t(lang, "seo.nicsstudio.description"),
      type: "website",
      lang,
      locale: OG_LOCALE[lang],
      ogImage: `${siteUrl}/og-video.jpg`,
      ogImageAlt: "NICS Studio — online video editor",
      alternates: studioAlternates,
      schema: studioSchema(`${siteUrl}${studioRoute}`, lang),
    },
  ];
});

const pages = [
  ...localizedPages,
  {
    route: "/about",
    title: "About AI Byte Consult — Mission, Vision & NICS Divisions",
    description:
      "Learn about AI Byte Consult Ltd, its applied AI work, the NICS ecosystem, international services and product divisions.",
    type: "website",
    schemaType: "AboutPage",
    ogImage: `${siteUrl}/og-about.jpg`,
  },
  {
    route: "/estate",
    title: "NICS Real Estate — AI Property Solutions | AI Byte Consult",
    description:
      "AI-powered real estate solutions for property analysis, digital workflows, market intelligence and secure transaction support.",
    type: "website",
    schemaType: "Service",
    ogImage: `${siteUrl}/og-estate.jpg`,
  },
  {
    route: "/nics-ecosystem",
    title: "NICS AI Ecosystem — Independent Multilingual AI Platform",
    description:
      "Explore the NICS AI ecosystem, including proprietary language technology, intelligent agents, applied research and real-world platforms.",
    type: "website",
    schemaType: "SoftwareApplication",
  },
  {
    route: "/terms",
    title: "Terms of Service & Trading Risk Disclosures — AI Byte Consult",
    description:
      "Read the terms of service, AI limitations, trading risk disclosures, affiliate notices and legal information for AI Byte Consult.",
    type: "website",
    schemaType: "WebPage",
  },
  {
    route: "/privacy",
    title: "Privacy Policy — AI Byte Consult",
    description:
      "How AI Byte Consult Ltd. collects, uses, shares, and protects personal data across our website, Telegram bot, NICS AI Trader Mini App, and connected Meta/Threads account.",
    type: "website",
    schemaType: "WebPage",
  },
  {
    route: "/delete",
    title: "Data Deletion Instructions — AI Byte Consult",
    description:
      "How to request deletion of your data connected to AI Byte Consult Ltd. applications, including data received through Meta/Threads platform integrations.",
    type: "website",
    schemaType: "WebPage",
  },
  {
    route: "/nics-multimedia",
    title: "NICS Multimedia — Original Music by Aleksandr Tochilov",
    description:
      "NICS Multimedia is AI Byte Consult's in-house music system. \"Just Live\" — lyrics and visual direction by Aleksandr Tochilov, produced by NICS Multimedia.",
    type: "music.album",
    schemaType: "MusicAlbum",
  },
  {
    route: "/nics-forge",
    title: "Alessandro Studio — AI-Designed, 3D-Printed Products",
    description:
      "Alessandro Studio is part of the NICS AI ecosystem: ready-made 3D-printed pieces and a custom AI studio that turns your photo into a 3D model we print and ship to you.",
    type: "website",
    schemaType: "Organization",
  },
];

// Pixel sizes of the social preview images in public/, so og:image can carry
// width/height (lets Facebook/Telegram/LinkedIn render the card on first share).
const OG_IMAGE_SIZES = {
  "/og-home.jpg": [1200, 630],
  "/og-trading.jpg": [1200, 630],
  "/og-video.jpg": [1200, 630],
  "/og-about.jpg": [1200, 630],
  "/og-estate.jpg": [1200, 630],
  "/android-chrome-512x512.png": [512, 512],
};

const escapeAttribute = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

const removeManagedTags = (html) =>
  html
    .replace(/\s*<title>[\s\S]*?<\/title>/gi, "")
    .replace(/\s*<meta\s+(?:name|property)=["'](?:description|robots|googlebot|og:[^"']+|twitter:[^"']+)["'][^>]*>/gi, "")
    .replace(/\s*<link\s+rel=["']canonical["'][^>]*>/gi, "")
    .replace(/\s*<script\s+type=["']application\/ld\+json["']>[\s\S]*?<\/script>/gi, "");

const pageSchema = (page, canonical) =>
  page.schema ||
  withSiteNodes([
    {
      "@type": page.schemaType || "WebPage",
      name: page.title,
      description: page.description,
      url: canonical,
      isPartOf: { "@id": `${siteUrl}/#website` },
      publisher: { "@id": `${siteUrl}/#organization` },
    },
  ]);

// Plain-HTML first paint inside #root: the page's own heading, summary and
// links to the main sections. React replaces it on mount; until then (and for
// crawlers that do not run JavaScript: Bing, GPTBot and other AI crawlers,
// link previews) the page is not an empty <div>.
const NAV = [
  { base: "/", label: "AI Byte Consult" },
  { base: "/trading", label: "NICS AI Trader" },
  { base: "/nics-video", label: "NICS Video" },
  { base: "/nics-studio", label: "NICS Studio" },
  { base: "/nics-ecosystem", label: "NICS AI Ecosystem", enOnly: true },
  { base: "/about", label: "About", enOnly: true },
];
const staticBody = (page) => {
  const lang = page.lang || "en";
  const links = NAV.map(
    (item) => `<a href="${item.enOnly ? item.base : localePath(lang, item.base)}">${escapeAttribute(item.label)}</a>`,
  ).join(" · ");
  return `<div style="max-width:720px;margin:0 auto;padding:96px 16px;font-family:system-ui,sans-serif;color:#0f172a"><h1 style="font-size:28px;line-height:1.25">${escapeAttribute(page.title)}</h1><p style="font-size:16px;line-height:1.6;color:#475569">${escapeAttribute(page.description)}</p><nav style="font-size:14px;line-height:2">${links}</nav></div>`;
};

const renderPage = (page, noindex = false) => {
  const canonical = page.route === "/" ? `${siteUrl}/` : `${siteUrl}${page.route}`;
  const clean = removeManagedTags(baseHtml);
  const robots = noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large";
  const schema = JSON.stringify(pageSchema(page, canonical)).replaceAll("<", "\\u003c");
  // A noindex page (currently only the 404 page) must not declare a canonical:
  // Google treats "index this canonical URL" + "noindex me" as conflicting signals,
  // and every crawled not-found path pointing the same canonical at /404 produced
  // exactly that "multiple conflicting canonical URLs" warning in Search Console.
  const canonicalTag = noindex ? "" : `\n    <link rel="canonical" href="${canonical}" />`;
  const ogUrlTag = noindex ? "" : `\n    <meta property="og:url" content="${canonical}" />`;
  const alternateTags = noindex
    ? ""
    : (page.alternates || [])
        .map((alt) => `\n    <link rel="alternate" hreflang="${alt.lang}" href="${siteUrl}${alt.path}" />`)
        .join("");
  const image = page.ogImage || defaultImage;
  const size = OG_IMAGE_SIZES[image.replace(siteUrl, "")];
  const ogImageSize = size
    ? `\n    <meta property="og:image:width" content="${size[0]}" />\n    <meta property="og:image:height" content="${size[1]}" />`
    : "";

  const tags = `
    <title>${escapeAttribute(page.title)}</title>
    <meta name="description" content="${escapeAttribute(page.description)}" />
    <meta name="robots" content="${robots}" />
    <meta name="googlebot" content="${robots}" />${canonicalTag}${alternateTags}
    <meta property="og:site_name" content="AI Byte Consult" />
    <meta property="og:locale" content="${page.locale || "en_US"}" />
    <meta property="og:type" content="${page.type}" />
    <meta property="og:title" content="${escapeAttribute(page.title)}" />
    <meta property="og:description" content="${escapeAttribute(page.description)}" />${ogUrlTag}
    <meta property="og:image" content="${image}" />
    <meta property="og:image:alt" content="${escapeAttribute(page.ogImageAlt || "AI Byte Consult and the NICS AI Ecosystem")}" />${ogImageSize}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@aibyteconsult" />
    <meta name="twitter:title" content="${escapeAttribute(page.title)}" />
    <meta name="twitter:description" content="${escapeAttribute(page.description)}" />
    <meta name="twitter:image" content="${image}" />
    <script type="application/ld+json">${schema}</script>`;

  const htmlLang = page.lang || "en";
  return clean
    .replace('<html lang="en">', `<html lang="${htmlLang}"${htmlLang === "ar" ? ' dir="rtl"' : ""}>`)
    .replace("</head>", `${tags}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${staticBody(page)}</div>`);
};

for (const page of pages) {
  const html = renderPage(page);

  if (page.route === "/") {
    await writeFile(basePath, html, "utf8");
    continue;
  }

  const routeDirectory = path.join(distDir, page.route.slice(1));
  await mkdir(routeDirectory, { recursive: true });
  await writeFile(path.join(routeDirectory, "index.html"), html, "utf8");
}

const notFound = renderPage(
  {
    route: "/404",
    title: "Page Not Found — AI Byte Consult",
    description: "The requested page could not be found.",
    type: "website",
    schemaType: "WebPage",
  },
  true,
);
await writeFile(path.join(distDir, "404.html"), notFound, "utf8");

// Sitemap priority/changefreq per route. Anything not listed here (e.g. /privacy,
// /delete) still gets a sitemap entry with sensible low-priority defaults below —
// previously those pages existed but were missing from sitemap.xml entirely.
const sitemapMeta = {
  "/": { priority: "1.0", changefreq: "weekly" },
  "/trading": { priority: "0.95", changefreq: "weekly" },
  "/nics-ecosystem": { priority: "0.9", changefreq: "weekly" },
  "/about": { priority: "0.85", changefreq: "monthly" },
  "/estate": { priority: "0.8", changefreq: "monthly" },
  "/nics-multimedia": { priority: "0.5", changefreq: "monthly" },
  "/nics-forge": { priority: "0.5", changefreq: "monthly" },
  "/nics-video": { priority: "0.8", changefreq: "weekly" },
  "/nics-studio": { priority: "0.6", changefreq: "monthly" },
  "/terms": { priority: "0.4", changefreq: "yearly" },
  "/privacy": { priority: "0.3", changefreq: "yearly" },
  "/delete": { priority: "0.3", changefreq: "yearly" },
};
for (const lang of ALL_LANGUAGES) {
  if (lang === "en") continue;
  sitemapMeta[localePath(lang, "/")] = { priority: "0.9", changefreq: "weekly" };
  sitemapMeta[localePath(lang, "/trading")] = { priority: "0.85", changefreq: "weekly" };
  sitemapMeta[localePath(lang, "/nics-video")] = { priority: "0.6", changefreq: "monthly" };
  sitemapMeta[localePath(lang, "/nics-studio")] = { priority: "0.5", changefreq: "monthly" };
}
const today = new Date().toISOString().slice(0, 10);
const sitemapUrls = pages
  .map((page) => {
    const loc = page.route === "/" ? `${siteUrl}/` : `${siteUrl}${page.route}`;
    const { priority = "0.5", changefreq = "monthly" } = sitemapMeta[page.route] || {};
    // Language versions are listed in the sitemap too (Google reads hreflang
    // from either place; having both makes the grouping explicit).
    const links = (page.alternates || [])
      .map((alt) => `\n    <xhtml:link rel="alternate" hreflang="${alt.lang}" href="${siteUrl}${alt.path}" />`)
      .join("");
    return `  <url>\n    <loc>${loc}</loc>${links}\n    <lastmod>${today}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
  })
  .join("\n");
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${sitemapUrls}\n</urlset>\n`;
await writeFile(path.join(distDir, "sitemap.xml"), sitemap, "utf8");

console.log(`Generated static SEO metadata for ${pages.length} public routes and a fresh sitemap.xml.`);
