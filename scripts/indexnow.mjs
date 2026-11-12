// Tells Bing (and other IndexNow engines such as Yandex, Seznam, Naver) which
// pages exist right after a deploy, so new and changed pages are crawled in
// hours instead of weeks. The key is public by design: IndexNow verifies it by
// fetching https://aibyteconsult.com/<key>.txt, which lives in public/.
// Runs as "postdeploy"; a failure only prints a warning and never fails a deploy.
import { readFile } from "node:fs/promises";

const host = "aibyteconsult.com";
const key = "b709799994094efc034c60cecbc984ed";

try {
  const sitemap = await readFile("dist/sitemap.xml", "utf8");
  const urlList = [...new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim()))];
  if (!urlList.length) throw new Error("no URLs found in dist/sitemap.xml");
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host, key, keyLocation: `https://${host}/${key}.txt`, urlList }),
  });
  console.log(`IndexNow: sent ${urlList.length} URLs, HTTP ${res.status}`);
} catch (error) {
  console.warn(`IndexNow: skipped (${error.message})`);
}
