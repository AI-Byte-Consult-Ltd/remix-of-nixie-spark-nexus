// Shared geometry of the home-page DNA spiral, so the product nodes and the
// quantum cloud sit exactly on it. DnaHelix bends its axis with
// sin(u * PI * 1.2 + t * 0.15) * len * 0.025, where t = performance.now()/1000;
// homeAxisPoint repeats that formula so overlays follow the same bend.

export const HOME_DNA = {
  from: [0.36, 1.04] as [number, number],
  to: [1.04, 0.02] as [number, number],
};

export const homeAxisPoint = (width: number, height: number, u: number, t: number) => {
  const x0 = HOME_DNA.from[0] * width;
  const y0 = HOME_DNA.from[1] * height;
  const dx = HOME_DNA.to[0] * width - x0;
  const dy = HOME_DNA.to[1] * height - y0;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const bend = Math.sin(u * Math.PI * 1.2 + t * 0.15) * len * 0.025;
  return { x: x0 + dx * u + nx * bend, y: y0 + dy * u + ny * bend, ex: dx / len, ey: dy / len, len };
};

export type HeroProduct = { label: string; href: string; external?: boolean; color: string };

// The NICS products shown in the home hero. If a product is added to the
// Header services menu, add it here too.
export const HERO_PRODUCTS: HeroProduct[] = [
  { label: "NICS Trading Ecosystem", href: "/trading", color: "#f5b83d" },
  { label: "NICS Video", href: "/nics-video", color: "#f472b6" },
  { label: "NICS Real Estate", href: "https://estate.aibyteconsult.com", external: true, color: "#4ade80" },
  { label: "NICS Multimedia", href: "/nics-multimedia", color: "#a78bfa" },
  { label: "NICS AI Lab", href: "https://github.com/AI-Byte-Consult-Ltd/nics-ai-lab", external: true, color: "#6cc6ff" },
];
