/*
 * Phased international SEO (Alexander's plan, 2026-11-07).
 *
 * Phase 1 languages: EN, RU, BG, DE, ES. The level-A commercial pages below
 * exist only in these languages; for any other site language they show the
 * English text at the English URL, so no machine-quality page gets indexed.
 * Phase 2 (FR, IT, PL, PT, TR) and phase 3 (ZH, AR) are added here only
 * after the translation is checked by a person.
 *
 * Keep in sync with: src/App.tsx (routes), scripts/generate-seo-pages.mjs
 * (PHASE1_LANGS there) and localizedPathFor() in LanguageContext.
 */

export const PHASE1_LANGS = ["en", "ru", "bg", "de", "es"] as const;
export type Phase1Lang = (typeof PHASE1_LANGS)[number];

// Pages that exist in PHASE1_LANGS (en unprefixed, others /<lang>/<page>).
export const PHASED_BASE_PATHS = [
  "/nics-windows-app",
  "/nics-trading-software",
  "/nics-ecosystem",
  "/about",
];

const SITE_URL = "https://aibyteconsult.com";

export const isPhase1 = (lang: string): lang is Phase1Lang =>
  (PHASE1_LANGS as readonly string[]).includes(lang);

export const phasedLang = (lang: string): Phase1Lang => (isPhase1(lang) ? lang : "en");

export const phasedPath = (base: string, lang: string) =>
  lang !== "en" && isPhase1(lang) ? `/${lang}${base}` : base;

// hreflang group for a phased page: canonical URLs carry the trailing slash
// (GitHub Pages answers /page with a 301 to /page/).
export const phasedAlternates = (base: string) => [
  ...PHASE1_LANGS.map((lang) => ({ lang, href: `${SITE_URL}${phasedPath(base, lang)}/` })),
  { lang: "x-default", href: `${SITE_URL}${base}/` },
];

export const phasedCanonical = (base: string, lang: string) => `${SITE_URL}${phasedPath(base, phasedLang(lang))}/`;

// Articles (content/blog) exist in EN, RU and BG. DE/ES readers get English.
export const blogPath = (lang: string, slug?: string) => {
  const prefix = lang === "ru" || lang === "bg" ? `/${lang}/blog/` : "/blog/";
  return slug ? `${prefix}${slug}/` : prefix;
};
