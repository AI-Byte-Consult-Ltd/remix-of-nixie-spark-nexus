import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

// Articles live in content/blog/<slug>/<lang>.md and are written out at build
// time as complete, self-contained HTML pages: /blog/<slug>/ for English and
// /<lang>/blog/<slug>/ for every other language. Unlike the SPA routes, the
// whole article text is in the HTML itself, so every crawler (Google, Bing,
// AI search) reads it without running JavaScript. The pages do not load the
// React bundle at all; links back into the site are plain <a href>.

const siteUrl = "https://aibyteconsult.com";
const contentDir = path.resolve("content/blog");

const urlFor = (route) => `${siteUrl}${route}`;
const blogBase = (lang) => (lang === "en" ? "/blog/" : `/${lang}/blog/`);
const articleRoute = (lang, slug) => `${blogBase(lang)}${slug}/`;
const servicePath = (lang, base) => (lang === "en" ? `${base}/` : `/${lang}${base}/`);

const UI = {
  en: {
    blog: "Articles",
    blogTitle: "Articles — AI Byte Consult",
    blogDescription: "Practical articles from AI Byte Consult: video editing for Shorts and YouTube, honest trading statistics, automation for small business.",
    home: "Home",
    published: "Published",
    readAlso: "Read in",
    all: "All articles",
    locale: "en_US",
  },
  ru: {
    blog: "Статьи",
    blogTitle: "Статьи — AI Byte Consult",
    blogDescription: "Практические статьи AI Byte Consult: монтаж видео для Shorts и YouTube, честная торговая статистика, автоматизация для малого бизнеса.",
    home: "Главная",
    published: "Опубликовано",
    readAlso: "Читать на языке",
    all: "Все статьи",
    locale: "ru_RU",
  },
  bg: {
    blog: "Статии",
    blogTitle: "Статии — AI Byte Consult",
    blogDescription: "Практически статии от AI Byte Consult: автоматизация за малкия бизнес, видео за Shorts и YouTube.",
    home: "Начало",
    published: "Публикувано",
    readAlso: "Прочетете на",
    all: "Всички статии",
    locale: "bg_BG",
  },
};
const LANG_NAME = { en: "English", ru: "Русский", bg: "Български" };

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

// Front matter: "key: value" lines between two "---" lines.
const parseArticle = (source) => {
  const match = source.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error("article is missing its --- front matter ---");
  const meta = {};
  for (const line of match[1].split("\n")) {
    const at = line.indexOf(":");
    if (at > 0) meta[line.slice(0, at).trim()] = line.slice(at + 1).trim().replace(/^"(.*)"$/, "$1");
  }
  return { meta, body: match[2] };
};

// Inline Markdown: **bold**, *italic*, [text](url). Text is escaped first.
const inline = (text) =>
  escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label, href) => {
      const external = /^https?:\/\//.test(href) && !href.startsWith(siteUrl);
      return `<a href="${href}"${external ? ' rel="noopener" target="_blank"' : ""}>${label}</a>`;
    });

// Block Markdown: ## / ### headings, paragraphs, "- " and "1. " lists,
// "> " callouts and "| a | b |" tables. That is all the articles use.
const markdownToHtml = (markdown) => {
  const html = [];
  const blocks = markdown.trim().split(/\n{2,}/);
  for (const block of blocks) {
    const lines = block.split("\n");
    const heading = block.match(/^(#{2,3}) (.+)$/);
    if (heading) {
      const level = heading[1].length;
      html.push(`<h${level}>${inline(heading[2])}</h${level}>`);
    } else if (lines.every((line) => /^- /.test(line))) {
      html.push(`<ul>${lines.map((line) => `<li>${inline(line.slice(2))}</li>`).join("")}</ul>`);
    } else if (lines.every((line) => /^\d+\. /.test(line))) {
      html.push(`<ol>${lines.map((line) => `<li>${inline(line.replace(/^\d+\. /, ""))}</li>`).join("")}</ol>`);
    } else if (lines.every((line) => line.startsWith(">"))) {
      html.push(`<aside>${lines.map((line) => inline(line.replace(/^> ?/, ""))).join(" ")}</aside>`);
    } else if (lines.every((line) => line.startsWith("|"))) {
      const cells = (line) => line.split("|").slice(1, -1).map((cell) => cell.trim());
      const [head, , ...rows] = lines;
      html.push(
        `<div class="table"><table><thead><tr>${cells(head).map((c) => `<th>${inline(c)}</th>`).join("")}</tr></thead><tbody>${rows
          .map((row) => `<tr>${cells(row).map((c) => `<td>${inline(c)}</td>`).join("")}</tr>`)
          .join("")}</tbody></table></div>`,
      );
    } else {
      html.push(`<p>${inline(lines.join(" "))}</p>`);
    }
  }
  return html.join("\n");
};

const STYLE = `
:root{--bg:#ffffff;--fg:#0f172a;--muted:#475569;--line:#e2e8f0;--accent:#2563eb;--soft:#f1f5f9}
@media (prefers-color-scheme:dark){:root{--bg:#0b1120;--fg:#e2e8f0;--muted:#94a3b8;--line:#1e293b;--accent:#60a5fa;--soft:#111a2e}}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--fg);font:17px/1.7 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
a{color:var(--accent)}
header,footer{border-bottom:1px solid var(--line)}
footer{border-top:1px solid var(--line);border-bottom:0;margin-top:64px;color:var(--muted);font-size:14px}
.bar{max-width:760px;margin:0 auto;padding:16px;display:flex;flex-wrap:wrap;gap:8px 20px;align-items:center}
.bar .brand{font-weight:700;color:var(--fg);text-decoration:none;margin-right:auto}
.bar a{text-decoration:none;font-size:15px}
main{max-width:760px;margin:0 auto;padding:24px 16px}
.crumbs{font-size:14px;color:var(--muted)}
.crumbs a{color:var(--muted)}
h1{font-size:clamp(28px,5vw,38px);line-height:1.2;margin:16px 0 8px}
h2{font-size:24px;line-height:1.3;margin:40px 0 8px}
h3{font-size:19px;margin:28px 0 4px}
.meta{color:var(--muted);font-size:14px;margin-bottom:24px}
.lead{font-size:19px;color:var(--muted)}
aside{background:var(--soft);border-left:4px solid var(--accent);padding:12px 16px;border-radius:6px;margin:20px 0}
.table{overflow-x:auto}
table{border-collapse:collapse;width:100%;font-size:15px}
th,td{border-bottom:1px solid var(--line);padding:8px;text-align:left;vertical-align:top}
.cta{margin:40px 0;padding:20px;border:1px solid var(--line);border-radius:12px;background:var(--soft)}
.cta a.button{display:inline-block;margin-top:8px;padding:10px 18px;border-radius:8px;background:var(--accent);color:#fff;text-decoration:none;font-weight:600}
.list article{padding:20px 0;border-bottom:1px solid var(--line)}
.list h2{margin:0 0 4px;font-size:21px}
.list p{margin:4px 0;color:var(--muted)}
`;

const organization = {
  "@type": "Organization",
  "@id": `${siteUrl}/#organization`,
  name: "AI Byte Consult Ltd",
  url: `${siteUrl}/`,
  logo: `${siteUrl}/android-chrome-512x512.png`,
};

const pageShell = ({ lang, title, description, canonical, alternates, ogType, ogImage, schema, body }) => {
  const ui = UI[lang];
  const alternateTags = alternates
    .map((alt) => `\n<link rel="alternate" hreflang="${alt.lang}" href="${alt.href}" />`)
    .join("");
  const json = JSON.stringify({ "@context": "https://schema.org", "@graph": schema }).replaceAll("<", "\\u003c");
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}" />
<meta name="robots" content="index, follow, max-image-preview:large" />
<link rel="canonical" href="${canonical}" />${alternateTags}
<meta property="og:site_name" content="AI Byte Consult" />
<meta property="og:locale" content="${ui.locale}" />
<meta property="og:type" content="${ogType}" />
<meta property="og:title" content="${escapeHtml(title)}" />
<meta property="og:description" content="${escapeHtml(description)}" />
<meta property="og:url" content="${canonical}" />
<meta property="og:image" content="${ogImage}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="@aibyteconsult" />
<meta name="theme-color" content="#0f172a" />
<link rel="icon" href="/favicon.ico" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
<script type="application/ld+json">${json}</script>
<style>${STYLE}</style>
</head>
<body>
<header><nav class="bar">
<a class="brand" href="${servicePath(lang, "") || "/"}">AI Byte Consult</a>
<a href="${servicePath(lang, "/nics-video")}">NICS Video</a>
<a href="${servicePath(lang, "/trading")}">NICS AI Trader</a>
<a href="${blogBase(lang)}">${ui.blog}</a>
</nav></header>
<main>
${body}
</main>
<footer><div class="bar">© ${new Date().getFullYear()} AI Byte Consult Ltd · <a href="mailto:info@aibyteconsult.com">info@aibyteconsult.com</a> · <a href="/privacy/">Privacy</a> · <a href="/terms/">Terms</a></div></footer>
</body>
</html>
`;
};

// Returns sitemap entries ({ loc, alternates: [{ lang, href }] }) for every
// page it writes, so generate-seo-pages.mjs can list them in sitemap.xml.
export const buildBlog = async (distDir) => {
  const slugs = (await readdir(contentDir, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  const articles = [];
  for (const slug of slugs) {
    const files = (await readdir(path.join(contentDir, slug))).filter((file) => file.endsWith(".md"));
    for (const file of files) {
      const lang = file.replace(/\.md$/, "");
      if (!UI[lang]) throw new Error(`content/blog/${slug}/${file}: no UI strings for language "${lang}"`);
      const { meta, body } = parseArticle(await readFile(path.join(contentDir, slug, file), "utf8"));
      for (const key of ["title", "description", "date", "service", "cta"]) {
        if (!meta[key]) throw new Error(`content/blog/${slug}/${file}: front matter needs "${key}"`);
      }
      articles.push({ slug, lang, meta, body });
    }
  }

  const sitemap = [];
  const indexGroup = [...new Set(articles.map((a) => a.lang))].map((lang) => ({ lang, href: urlFor(blogBase(lang)) }));
  if (indexGroup.some((alt) => alt.lang === "en")) indexGroup.push({ lang: "x-default", href: urlFor(blogBase("en")) });

  for (const article of articles) {
    const { slug, lang, meta, body } = article;
    const ui = UI[lang];
    const canonical = urlFor(articleRoute(lang, slug));
    const siblings = articles.filter((other) => other.slug === slug);
    const alternates = siblings.map((other) => ({ lang: other.lang, href: urlFor(articleRoute(other.lang, slug)) }));
    if (siblings.length > 1) {
      const fallback = siblings.find((other) => other.lang === "en") || siblings[0];
      alternates.push({ lang: "x-default", href: urlFor(articleRoute(fallback.lang, slug)) });
    }
    const otherLanguages = siblings
      .filter((other) => other.lang !== lang)
      .map((other) => `<a href="${articleRoute(other.lang, slug)}" hreflang="${other.lang}">${LANG_NAME[other.lang]}</a>`)
      .join(" · ");
    const ogImage = `${siteUrl}${meta.image || "/og-home.jpg"}`;
    // "service" is a site path such as "/nics-video" or "/#contact": it is
    // localized the same way as the rest of the site (/ru/nics-video/).
    const [servicePathPart, serviceHash] = meta.service.split("#");
    const serviceUrl = meta.service.startsWith("/")
      ? `${servicePath(lang, servicePathPart.replace(/\/$/, ""))}${serviceHash ? `#${serviceHash}` : ""}`
      : meta.service;

    const html = pageShell({
      lang,
      title: `${meta.title} | AI Byte Consult`,
      description: meta.description,
      canonical,
      alternates: siblings.length > 1 ? alternates : [],
      ogType: "article",
      ogImage,
      schema: [
        organization,
        {
          "@type": "Article",
          headline: meta.title,
          description: meta.description,
          inLanguage: lang,
          datePublished: meta.date,
          dateModified: meta.updated || meta.date,
          image: ogImage,
          mainEntityOfPage: canonical,
          author: { "@id": `${siteUrl}/#organization` },
          publisher: { "@id": `${siteUrl}/#organization` },
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: ui.home, item: urlFor(servicePath(lang, "") || "/") },
            { "@type": "ListItem", position: 2, name: ui.blog, item: urlFor(blogBase(lang)) },
            { "@type": "ListItem", position: 3, name: meta.title, item: canonical },
          ],
        },
      ],
      body: `<div class="crumbs"><a href="${servicePath(lang, "") || "/"}">${ui.home}</a> › <a href="${blogBase(lang)}">${ui.blog}</a></div>
<article>
<h1>${escapeHtml(meta.title)}</h1>
<div class="meta">${ui.published}: <time datetime="${meta.date}">${meta.date}</time> · AI Byte Consult${otherLanguages ? ` · ${ui.readAlso}: ${otherLanguages}` : ""}</div>
<p class="lead">${inline(meta.description)}</p>
${markdownToHtml(body)}
<div class="cta">${inline(meta.cta)}<br /><a class="button" href="${serviceUrl}">${escapeHtml(meta.ctaButton || meta.title)}</a></div>
</article>
<p><a href="${blogBase(lang)}">← ${ui.all}</a></p>`,
    });

    const directory = path.join(distDir, articleRoute(lang, slug).slice(1));
    await mkdir(directory, { recursive: true });
    await writeFile(path.join(directory, "index.html"), html, "utf8");
    sitemap.push({ loc: canonical, alternates: siblings.length > 1 ? alternates : [], lastmod: meta.updated || meta.date });
  }

  // One index page per language that has articles, newest first.
  for (const { lang } of indexGroup.filter((alt) => alt.lang !== "x-default")) {
    const ui = UI[lang];
    const own = articles.filter((a) => a.lang === lang).sort((a, b) => b.meta.date.localeCompare(a.meta.date));
    const canonical = urlFor(blogBase(lang));
    const html = pageShell({
      lang,
      title: ui.blogTitle,
      description: ui.blogDescription,
      canonical,
      alternates: indexGroup.length > 1 ? indexGroup : [],
      ogType: "website",
      ogImage: `${siteUrl}/og-home.jpg`,
      schema: [
        organization,
        {
          "@type": "CollectionPage",
          name: ui.blogTitle,
          url: canonical,
          inLanguage: lang,
          hasPart: own.map((a) => ({ "@type": "Article", headline: a.meta.title, url: urlFor(articleRoute(lang, a.slug)) })),
        },
      ],
      body: `<h1>${ui.blog}</h1>
<p class="lead">${escapeHtml(ui.blogDescription)}</p>
<div class="list">${own
        .map(
          (a) =>
            `<article><h2><a href="${articleRoute(lang, a.slug)}">${escapeHtml(a.meta.title)}</a></h2><p>${escapeHtml(a.meta.description)}</p><p><time datetime="${a.meta.date}">${a.meta.date}</time></p></article>`,
        )
        .join("")}</div>`,
    });
    const directory = path.join(distDir, blogBase(lang).slice(1));
    await mkdir(directory, { recursive: true });
    await writeFile(path.join(directory, "index.html"), html, "utf8");
    const newest = own[0]?.meta.updated || own[0]?.meta.date;
    sitemap.push({ loc: canonical, alternates: indexGroup.length > 1 ? indexGroup : [], lastmod: newest });
  }

  return sitemap;
};
