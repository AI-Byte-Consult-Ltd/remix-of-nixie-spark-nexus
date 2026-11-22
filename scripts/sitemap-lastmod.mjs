// Honest <lastmod> in dist/sitemap.xml for the app pages (articles already
// carry their own date from content/blog front matter).
//
// Before: every build stamped every page with the build date, so Google saw
// "all 118 pages changed today" on each deploy and learned to ignore lastmod.
// Now: the visible text of each page (from the built, prerendered HTML) is
// hashed and compared with content/sitemap-lastmod.json. The date moves to
// today only when the text really changed. The manifest is updated in place —
// commit it together with the change that altered the page.
//
// Runs last in "postbuild", after prerender.mjs.
import { readFile, writeFile, rm } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";

const distDir = path.resolve("dist");
const manifestPath = path.resolve("content/sitemap-lastmod.json");
const siteUrl = "https://aibyteconsult.com";
const today = new Date().toISOString().slice(0, 10);

// Page text captured by prerender.mjs (animated demos excluded); falls back
// to the text of the HTML file when prerender did not run.
// Keys are routes ("/trading"); sitemap URLs carry the trailing slash ("/trading/").
const rendered = Object.fromEntries(
  Object.entries(JSON.parse(await readFile(path.join(distDir, ".prerender-text.json"), "utf8").catch(() => "{}")))
    .map(([route, text]) => [route === "/" ? "/" : `${route}/`, text]),
);
const manifest = JSON.parse(await readFile(manifestPath, "utf8").catch(() => "{}"));

const visibleText = (html) => {
  const head = html.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? "";
  const description = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "";
  const body = (html.match(/<body[^>]*>([\s\S]*)<\/body>/)?.[1] ?? "")
    .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ");
  return `${head}\n${description}\n${body}`.replace(/\s+/g, " ").trim();
};

let sitemap = await readFile(path.join(distDir, "sitemap.xml"), "utf8");
let changed = 0;
const changedRoutes = [];
let total = 0;
const seen = new Set();
sitemap = sitemap.replace(/<url>([\s\S]*?)<\/url>/g, (block, inner) => {
  const loc = inner.match(/<loc>([^<]+)<\/loc>/)?.[1];
  if (!loc || !loc.startsWith(siteUrl)) return block;
  const route = loc.slice(siteUrl.length);
  if (/^\/(?:[a-z]{2}\/)?blog\//.test(route)) return block; // articles: date from front matter
  return block.replace(/<lastmod>[^<]*<\/lastmod>/, () => {
    seen.add(route);
    total += 1;
    const entry = manifest[route];
    const date = entry?.date ?? today;
    return `<lastmod>${date}</lastmod>`;
  });
});

// Hash pass (async file reads), then rewrite with the final dates.
for (const route of seen) {
  const file = path.join(distDir, route === "/" ? "" : route.slice(1), "index.html");
  const html = await readFile(file, "utf8").catch(() => null);
  if (html == null) continue;
  const head = visibleText(html.replace(/<body[\s\S]*<\/body>/, ""));
  const text = route in rendered ? `${head}\n${rendered[route]}` : visibleText(html);
  const hash = createHash("sha256").update(text).digest("hex").slice(0, 16);
  if (manifest[route]?.hash !== hash) {
    manifest[route] = { hash, date: today };
    changed += 1;
    changedRoutes.push(route);
  }
}
sitemap = sitemap.replace(/<url>([\s\S]*?)<\/url>/g, (block, inner) => {
  const route = inner.match(/<loc>([^<]+)<\/loc>/)?.[1]?.slice(siteUrl.length);
  if (!route || !seen.has(route) || !manifest[route]) return block;
  return block.replace(/<lastmod>[^<]*<\/lastmod>/, `<lastmod>${manifest[route].date}</lastmod>`);
});

const sorted = Object.fromEntries(Object.keys(manifest).filter((r) => seen.has(r)).sort().map((r) => [r, manifest[r]]));
await writeFile(manifestPath, `${JSON.stringify(sorted, null, 2)}\n`, "utf8");
await writeFile(path.join(distDir, "sitemap.xml"), sitemap, "utf8");
await rm(path.join(distDir, ".prerender-routes.json"), { force: true });
await rm(path.join(distDir, ".prerender-text.json"), { force: true });
console.log(`Sitemap lastmod: ${total} app pages, ${changed} with changed text dated ${today}, the rest keep their previous date.`);
if (changedRoutes.length && changedRoutes.length <= 20) console.log(`Sitemap lastmod: text changed on ${changedRoutes.join(", ")}`);
