/*
 * GitHub Pages serves every public page as <route>/index.html and answers
 * "/trading" with a 301 to "/trading/". Links without the slash make Google
 * crawl a redirect (Search Console: "Redirect error" / "Page with redirect")
 * and an address copied from the browser bar gets no preview card on X.
 * So every internal link and navigation uses the slash form, the same URL
 * as the canonical (urlFor() in scripts/generate-seo-pages.mjs).
 *
 * /cabinet is a pure SPA route (served by 404.html), left as is.
 */
export const withTrailingSlash = (to: string): string => {
  if (!to.startsWith("/") || to.startsWith("//")) return to;
  const match = to.match(/^([^?#]*)(.*)$/);
  const path = match?.[1] ?? to;
  const rest = match?.[2] ?? "";
  if (path === "" || path.endsWith("/")) return to;
  if (path === "/cabinet" || path.startsWith("/cabinet/")) return to;
  const last = path.slice(path.lastIndexOf("/") + 1);
  if (last.includes(".")) return to; // files: /downloads/x.exe, /og.jpg
  return `${path}/${rest}`;
};
