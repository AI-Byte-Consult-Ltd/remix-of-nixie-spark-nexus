// Halloween 2026 (Alexander, 2026-10-28): site theme + promo until Sat 31.10
// 23:59 Sofia time, then everything here switches itself off — no redeploy
// needed. The same deadline is hardcoded in n8n [21 REVOLUT] (Trader code),
// [24 VIDEO] (Video code) and [26]/[28 VIDEO] (bonus credits): keep in sync.
export const HALLOWEEN_END_MS = Date.parse("2026-10-31T22:00:00Z");

export const isHalloween = (now = Date.now()) => now < HALLOWEEN_END_MS;

export const HALLOWEEN_PROMO = {
  // Numbers approved by Alexander 2026-10-28 (+50% credits, BOO31 = −31%).
  enabled: true,
  code: "BOO31",
  discountPercent: 31,
  videoBonusPercent: 50,
};

export const isHalloweenPromo = (now = Date.now()) => HALLOWEEN_PROMO.enabled && isHalloween(now);
