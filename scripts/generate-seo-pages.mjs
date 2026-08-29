import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const distDir = path.resolve("dist");
const basePath = path.join(distDir, "index.html");
const baseHtml = await readFile(basePath, "utf8");
const siteUrl = "https://aibyteconsult.com";
const defaultImage = `${siteUrl}/android-chrome-512x512.png`;

const pages = [
  {
    route: "/",
    title: "AI Byte Consult — AI Systems, Agents & NICS Ecosystem",
    description:
      "AI Byte Consult builds production AI systems, intelligent agents and the NICS ecosystem for trading, business automation, research and digital platforms.",
    type: "website",
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": `${siteUrl}/#organization`,
          name: "AI Byte Consult Ltd",
          url: `${siteUrl}/`,
          logo: defaultImage,
          email: "info@aibyteconsult.com",
          telephone: "+359988899109",
          foundingDate: "2011",
          areaServed: "Worldwide",
        },
        {
          "@type": "WebSite",
          "@id": `${siteUrl}/#website`,
          url: `${siteUrl}/`,
          name: "AI Byte Consult",
          publisher: { "@id": `${siteUrl}/#organization` },
        },
      ],
    },
  },
  {
    route: "/about",
    title: "About AI Byte Consult — Mission, Vision & NICS Divisions",
    description:
      "Learn about AI Byte Consult Ltd, its applied AI work, the NICS ecosystem, international services and product divisions.",
    type: "website",
    schemaType: "AboutPage",
  },
  {
    route: "/estate",
    title: "NICS Real Estate — AI Property Solutions | AI Byte Consult",
    description:
      "AI-powered real estate solutions for property analysis, digital workflows, market intelligence and secure transaction support.",
    type: "website",
    schemaType: "Service",
  },
  {
    route: "/trading",
    title: "NICS AI Trader — Telegram Trading Signals & Mini App",
    description:
      "NICS AI Trader delivers Entry, Stop Loss, TP1–TP4, personal risk controls and signal tracking for Gold, Forex, Brent Oil and Bitcoin.",
    type: "product",
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "SoftwareApplication",
          "@id": `${siteUrl}/trading#software`,
          name: "NICS AI Trader",
          applicationCategory: "FinanceApplication",
          operatingSystem: "Telegram Web App",
          url: `${siteUrl}/trading`,
          description:
            "A Telegram-first AI trading assistant with structured market scenarios, personal risk controls, signal history and lifecycle tracking.",
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
            {
              "@type": "Offer",
              name: "AI Trader Demo",
              price: "0",
              priceCurrency: "EUR",
              url: "https://t.me/nics_ai_bot",
            },
            {
              "@type": "Offer",
              name: "AI Trader Single Market — 30 days",
              price: "34.99",
              priceCurrency: "EUR",
              url: "https://t.me/nics_ai_bot",
            },
            {
              "@type": "Offer",
              name: "AI Trader Multi-Market — 30 days",
              price: "52.99",
              priceCurrency: "EUR",
              url: "https://t.me/nics_ai_bot",
            },
            {
              "@type": "Offer",
              name: "AI Trader Full Coverage — 30 days",
              price: "79.99",
              priceCurrency: "EUR",
              url: "https://t.me/nics_ai_bot",
            },
          ],
        },
      ],
    },
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
    route: "/nics-multimedia",
    title: "NICS Multimedia — Original Music by Aleksandr Tochilov | AI Byte Consult",
    description:
      "NICS Multimedia is AI Byte Consult's in-house music-creation system. \"Just Live\" is its first release — lyrics written with the system's creator, music composed with NICS Multimedia.",
    type: "music.album",
    schemaType: "MusicAlbum",
  },
];

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
    .replace(/\s*<link\s+rel=["']canonical["'][^>]*>/gi, "");

const pageSchema = (page, canonical) =>
  page.schema || {
    "@context": "https://schema.org",
    "@type": page.schemaType || "WebPage",
    name: page.title,
    description: page.description,
    url: canonical,
    isPartOf: { "@id": `${siteUrl}/#website` },
    publisher: { "@id": `${siteUrl}/#organization` },
  };

const renderPage = (page, noindex = false) => {
  const canonical = page.route === "/" ? `${siteUrl}/` : `${siteUrl}${page.route}`;
  const clean = removeManagedTags(baseHtml);
  const robots = noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large";
  const schema = JSON.stringify(pageSchema(page, canonical)).replaceAll("<", "\\u003c");

  const tags = `
    <title>${escapeAttribute(page.title)}</title>
    <meta name="description" content="${escapeAttribute(page.description)}" />
    <meta name="robots" content="${robots}" />
    <meta name="googlebot" content="${robots}" />
    <link rel="canonical" href="${canonical}" />
    <meta property="og:site_name" content="AI Byte Consult" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:type" content="${page.type}" />
    <meta property="og:title" content="${escapeAttribute(page.title)}" />
    <meta property="og:description" content="${escapeAttribute(page.description)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${defaultImage}" />
    <meta property="og:image:alt" content="AI Byte Consult and the NICS AI Ecosystem" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@aibyteconsult" />
    <meta name="twitter:title" content="${escapeAttribute(page.title)}" />
    <meta name="twitter:description" content="${escapeAttribute(page.description)}" />
    <meta name="twitter:image" content="${defaultImage}" />
    <script type="application/ld+json">${schema}</script>`;

  return clean.replace("</head>", `${tags}\n  </head>`);
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

console.log(`Generated static SEO metadata for ${pages.length} public routes.`);
