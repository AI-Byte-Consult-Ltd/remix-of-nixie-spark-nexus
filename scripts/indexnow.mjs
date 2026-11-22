// Tells Bing (and other IndexNow engines such as Yandex, Seznam, Naver) which
// pages exist right after a deploy, so new and changed pages are crawled in
// hours instead of weeks. The key is public by design: IndexNow verifies it by
// fetching https://aibyteconsult.com/<key>.txt, which lives in public/.
// Runs as "postdeploy"; a failure only prints a warning and never fails a deploy.
import { readFile } from "node:fs/promises";

const host = "aibyteconsult.com";
const key = "6651fda2bc416663d1c7f4a41c115399";

// GitHub Pages publishes a gh-pages push about a minute later. IndexNow checks
// the key file at submit time, so wait until the live site serves it (and
// serves the new sitemap) instead of submitting into a stale site.
const waitForLive = async () => {
  for (let i = 0; i < 30; i += 1) {
    const res = await fetch(`https://${host}/${key}.txt`, { cache: "no-store" }).catch(() => null);
    if (res?.ok && (await res.text()).trim() === key) return true;
    await new Promise((r) => setTimeout(r, 10000));
  }
  return false;
};

try {
  if (!(await waitForLive())) throw new Error(`key file https://${host}/${key}.txt is not live after 5 minutes`);
  const sitemap = await readFile("dist/sitemap.xml", "utf8");
  const urlList = [...new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim()))];
  if (!urlList.length) throw new Error("no URLs found in dist/sitemap.xml");
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host, key, keyLocation: `https://${host}/${key}.txt`, urlList }),
  });
  const body = res.ok ? "" : ` ${(await res.text()).slice(0, 300)}`;
  console.log(`IndexNow: sent ${urlList.length} URLs, HTTP ${res.status}${body}`);
} catch (error) {
  console.warn(`IndexNow: skipped (${error.message})`);
}
