// Build-time prerender: opens every page that generate-seo-pages.mjs wrote
// (dist/<route>/index.html) in a headless browser, lets React render it, and
// stores the rendered markup of #root back into that file. The <head> written
// by generate-seo-pages.mjs (title, canonical, hreflang, schema) is kept as is.
//
// Why: search engines read the raw HTML first. Without this, ~55 pages had
// only 40–80 words in HTML (heading + one line + menu) and Bing / Google
// marked them as low-content. React still renders the page on load
// (createRoot replaces #root), so visitors see exactly the same site.
//
// Only requests to the local build are allowed while rendering: live data
// (track record, prices, accounts) is never frozen into HTML — those blocks
// stay empty in the file and load in the browser as before.
//
// Runs after generate-seo-pages.mjs in "postbuild". If no browser is
// available it prints a warning and leaves the files untouched (the plain
// static body from generate-seo-pages.mjs stays), so a build never fails on it.
// Set PRERENDER=0 to skip.
import { createServer } from "node:http";
import { readFile, writeFile, stat } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";

const distDir = path.resolve("dist");
const MIN_WORDS_GAIN = 1.0; // write only if the rendered text is not shorter than the static one

if (process.env.PRERENDER === "0") {
  console.log("Prerender: skipped (PRERENDER=0).");
  process.exit(0);
}

let chromium;
try {
  const require = createRequire(import.meta.url);
  ({ chromium } = require("playwright"));
} catch {
  try {
    ({ chromium } = await import("playwright"));
  } catch {
    console.warn("Prerender: skipped (playwright is not installed). Static bodies from generate-seo-pages.mjs are kept.");
    process.exit(0);
  }
}

const routes = JSON.parse(await readFile(path.join(distDir, ".prerender-routes.json"), "utf8"));

const MIME = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg", ".webp": "image/webp", ".ico": "image/x-icon", ".woff2": "font/woff2",
  ".woff": "font/woff", ".txt": "text/plain", ".xml": "application/xml", ".webmanifest": "application/manifest+json",
  ".mp4": "video/mp4", ".wasm": "application/wasm",
};

// Serves dist/ the way GitHub Pages does: /route/ -> /route/index.html.
// The pristine (not yet prerendered) HTML of each route is served from memory,
// so a page that was already rewritten never renders on top of its own snapshot.
const pristine = new Map();
const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, "http://localhost");
    let file = path.join(distDir, decodeURIComponent(url.pathname));
    if (!file.startsWith(distDir)) throw new Error("outside dist");
    if (url.pathname.endsWith("/")) file = path.join(file, "index.html");
    if (pristine.has(file)) {
      res.writeHead(200, { "Content-Type": MIME[".html"] });
      return res.end(pristine.get(file));
    }
    const info = await stat(file).catch(() => null);
    if (!info || !info.isFile()) {
      res.writeHead(404, { "Content-Type": MIME[".html"] });
      return res.end(await readFile(path.join(distDir, "404.html")));
    }
    res.writeHead(200, { "Content-Type": MIME[path.extname(file)] || "application/octet-stream" });
    res.end(await readFile(file));
  } catch {
    res.writeHead(500);
    res.end();
  }
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const origin = `http://127.0.0.1:${server.address().port}`;

const wordCount = (html) =>
  html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;

// Cleans the rendered #root markup before it goes into the file:
// - no <script>/<noscript> copies (React adds none, but third-party widgets might);
// - entrance animations leave "opacity: 0" / transforms on elements that were
//   not scrolled into view; the snapshot must show its text, so those inline
//   styles are dropped (React sets its own styles again on mount).
const cleanMarkup = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, "")
    .replace(/\sstyle="([^"]*)"/gi, (match, css) => {
      if (!/opacity:\s*0(?![.\d])|transform:/i.test(css)) return match;
      const kept = css
        .split(";")
        .map((rule) => rule.trim())
        .filter((rule) => rule && !/^(opacity|transform|will-change|filter)\s*:/i.test(rule))
        .join("; ");
      return kept ? ` style="${kept}"` : "";
    });

let browser;
try {
  browser = await chromium.launch();
} catch (error) {
  console.warn(`Prerender: skipped (browser did not start: ${error.message.split("\n")[0]}).`);
  server.close();
  process.exit(0);
}

const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, serviceWorkers: "block" });
// Block everything that is not the local build: live APIs, analytics, fonts, embeds.
await context.route("**/*", (route) => {
  const url = route.request().url();
  if (url.startsWith(origin) || url.startsWith("data:") || url.startsWith("blob:")) return route.continue();
  return route.abort();
});

const texts = {};
let written = 0;
const skipped = [];
for (const route of routes) {
  const file = path.join(distDir, route === "/" ? "" : route.slice(1), "index.html");
  const original = await readFile(file, "utf8");
  pristine.set(file, original);
  const page = await context.newPage();
  try {
    await page.goto(`${origin}${route === "/" ? "/" : `${route}/`}`, { waitUntil: "networkidle", timeout: 30000 });
    // Lazy sections: scroll to the bottom once so they mount, then wait for idle.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 800) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(300);
    // Text for the sitemap date check, without animated demos ([data-volatile])
    // whose text changes on a timer and would move the date on every build.
    texts[route] = await page.$eval("#root", (el) => {
      const copy = el.cloneNode(true);
      copy.querySelectorAll("[data-volatile], script, style, noscript").forEach((node) => node.remove());
      return copy.textContent.replace(/\s+/g, " ").trim();
    });
    const rendered = cleanMarkup(await page.$eval("#root", (el) => el.innerHTML));
    const staticBody = original.match(/<div id="root">([\s\S]*?)<\/div>\s*(?:<script|<\/body>)/)?.[1] ?? "";
    if (!rendered.trim() || wordCount(rendered) < wordCount(staticBody) * MIN_WORDS_GAIN) {
      skipped.push(`${route} (rendered ${wordCount(rendered)} words vs static ${wordCount(staticBody)})`);
      continue;
    }
    const start = original.indexOf('<div id="root">');
    const end = original.indexOf(staticBody, start) + staticBody.length;
    if (start < 0 || !staticBody || end < start) {
      skipped.push(`${route} (no #root in file)`);
      continue;
    }
    const html = `${original.slice(0, start)}<div id="root">${rendered}${original.slice(end)}`;
    await writeFile(file, html, "utf8");
    written += 1;
  } catch (error) {
    skipped.push(`${route} (${error.message.split("\n")[0]})`);
  } finally {
    await page.close();
  }
}

await browser.close();
server.close();
await writeFile(path.join(distDir, ".prerender-text.json"), JSON.stringify(texts), "utf8");
console.log(`Prerender: wrote full HTML for ${written} of ${routes.length} pages.`);
if (skipped.length) console.warn(`Prerender: kept the static body for ${skipped.length}: ${skipped.join("; ")}`);
