// NICS Forge catalog, pricing and payment configuration.
//
// Prices and ids here MUST stay in sync with the server-side list in the
// "[20 FORGE] Orders API" n8n workflow (node "Validate Order"). The server
// recomputes the total, so a mismatch shows up as a wrong order total.

export const FORGE_API_BASE = "https://n8n.aibyteconsult.com/webhook";

export const SHIPPING_EUR = 5;
// Catalog pieces are sold from EUR 36 (smaller prices are not economical).
export const MIN_CATALOG_PRICE_EUR = 36;
export const DAILY_TRIES = 3;
export const DELIVERY_DAYS = 21;

export const COLOR_IDS = ["white", "black", "red", "blue", "green", "yellow", "purple", "gold"] as const;
export type ColorId = (typeof COLOR_IDS)[number];

export const COLOR_HEX: Record<ColorId, string> = {
  white: "#f4f4f2",
  black: "#1c1c1e",
  red: "#d6322e",
  blue: "#2b6cdf",
  green: "#2f9e5b",
  yellow: "#f2c230",
  purple: "#7d4fd1",
  gold: "#c9a34e",
};

export const SIZE_OPTIONS = [
  { cm: 4, price: 49 },
  { cm: 6, price: 79 },
  { cm: 8, price: 149 },
] as const;

// Revolut payment links. Each link must be created for the TOTAL amount
// (price + shipping). Empty string = link not connected yet: the site then
// says so honestly instead of showing a dead button.
export const REVOLUT_SIZE_LINKS: Record<number, string> = {
  4: "", // TODO(Alessandro): Revolut link, EUR 54
  6: "", // TODO(Alessandro): Revolut link, EUR 84
  8: "", // TODO(Alessandro): Revolut link, EUR 154
};

export interface CatalogItem {
  id: string;
  price: number;
  /** Shows a "your text" field (name on a keychain, desk plate...). */
  hasText: boolean;
  /** Photo URL. Empty = SVG placeholder. TODO: swap in real photos. */
  image: string;
  /** Revolut link for price + shipping. Empty = not connected yet. */
  revolutUrl: string;
  tint: [string, string];
}

export const CATALOG: CatalogItem[] = [
  { id: "dragon", price: 59, hasText: false, image: "", revolutUrl: "", tint: ["#7d4fd1", "#2b6cdf"] },
  { id: "name-keychain", price: 36, hasText: true, image: "", revolutUrl: "", tint: ["#c9a34e", "#d6322e"] },
  { id: "geo-vase", price: 44, hasText: false, image: "", revolutUrl: "", tint: ["#2f9e5b", "#2b6cdf"] },
  { id: "phone-stand", price: 36, hasText: false, image: "", revolutUrl: "", tint: ["#1c1c1e", "#7d4fd1"] },
  { id: "lowpoly-fox", price: 39, hasText: false, image: "", revolutUrl: "", tint: ["#e8833a", "#c9a34e"] },
  { id: "planter", price: 38, hasText: false, image: "", revolutUrl: "", tint: ["#2f9e5b", "#f2c230"] },
  { id: "cable-organizer", price: 36, hasText: false, image: "", revolutUrl: "", tint: ["#2b6cdf", "#1c1c1e"] },
  { id: "name-plate", price: 42, hasText: true, image: "", revolutUrl: "", tint: ["#c9a34e", "#1c1c1e"] },
  { id: "chess-knight", price: 41, hasText: false, image: "", revolutUrl: "", tint: ["#1c1c1e", "#c9a34e"] },
];

export const SOCIAL_LINKS = {
  // TODO(Alessandro): real profile URLs. Empty = "coming soon" tile.
  instagram: "",
  tiktok: "",
  youtube: "",
};
