import { useState } from "react";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import HeroFly from "@/components/trading/HeroFly";
import { useLanguage } from "@/contexts/LanguageContext";
import { HALLOWEEN_PROMO, isHalloween, isHalloweenPromo } from "@/lib/halloween";
import { fillHalloween, halloweenText } from "./halloweenText";

// Halloween layer for the home hero: the fly in a witch hat, two bats, a
// cobweb in the corner, the promo banner and the pumpkin easter egg. Renders
// nothing after the deadline in src/lib/halloween.ts. Decoration is
// aria-hidden and pointer-events none; only the pumpkin is clickable.

const Bat = ({ className, delay }: { className: string; delay: string }) => (
  <svg viewBox="0 0 64 32" className={`halloween-bat ${className}`} style={{ animationDelay: delay }}>
    <g className="halloween-bat-wings" style={{ animationDelay: delay }}>
      <path d="M32 14 C26 4 14 2 2 8 C8 10 10 14 9 18 C14 15 18 16 20 20 C23 16 27 16 32 18 Z" fill="#1c0b2b" />
      <path d="M32 14 C38 4 50 2 62 8 C56 10 54 14 55 18 C50 15 46 16 44 20 C41 16 37 16 32 18 Z" fill="#1c0b2b" />
    </g>
    <ellipse cx="32" cy="17" rx="4" ry="5" fill="#2e1045" />
    <circle cx="30.5" cy="15.5" r="0.9" fill="#fb923c" />
    <circle cx="33.5" cy="15.5" r="0.9" fill="#fb923c" />
  </svg>
);

const Cobweb = () => (
  <svg viewBox="0 0 120 120" className="pointer-events-none absolute right-0 top-16 z-[7] h-28 w-28 opacity-60 md:h-40 md:w-40" aria-hidden="true">
    <g stroke="rgba(255,255,255,0.55)" strokeWidth="0.8" fill="none">
      {[0, 22, 45, 68, 90].map((a) => {
        const r = (a * Math.PI) / 180;
        return <line key={a} x1="120" y1="0" x2={120 - Math.cos(r) * 120} y2={Math.sin(r) * 120} />;
      })}
      {[28, 52, 78, 104].map((d) => (
        <path
          key={d}
          d={`M${120 - d} 0 Q ${120 - d * 0.86} ${d * 0.2} ${120 - d * 0.92} ${d * 0.38} Q ${120 - d * 0.72} ${d * 0.55} ${120 - d * 0.7} ${d * 0.7} Q ${120 - d * 0.5} ${d * 0.78} ${120 - d * 0.38} ${d * 0.92} Q ${120 - d * 0.2} ${d * 0.86} 120 ${d}`}
        />
      ))}
    </g>
    <line x1="92" y1="30" x2="92" y2="58" stroke="rgba(255,255,255,0.5)" strokeWidth="0.6" />
    <circle cx="92" cy="61" r="3.5" fill="#111" />
    <circle cx="92" cy="57" r="2.3" fill="#111" />
  </svg>
);

export const PumpkinSvg = ({ size = 56 }: { size?: number }) => (
  <svg viewBox="0 0 64 64" width={size} height={size} className="drop-shadow-[0_0_14px_rgba(249,115,22,0.65)]">
    <path d="M32 14 q-1 -7 5 -9" stroke="#3f6212" strokeWidth="3.5" strokeLinecap="round" fill="none" />
    <ellipse cx="20" cy="38" rx="13" ry="18" fill="#ea580c" />
    <ellipse cx="44" cy="38" rx="13" ry="18" fill="#ea580c" />
    <ellipse cx="32" cy="38" rx="13" ry="20" fill="#f97316" />
    <path d="M22 32 l6 -5 l1 7 z M42 32 l-6 -5 l-1 7 z" fill="#fde047" />
    <path d="M20 44 q12 10 24 0 l-3 1 l-2 3 l-3 -2 l-4 3 l-4 -3 l-3 2 l-2 -3 z" fill="#fde047" />
  </svg>
);

const HalloweenHero = () => {
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  if (!isHalloween()) return null;

  const t = halloweenText(language);
  const promo = isHalloweenPromo();
  const vars = { b: HALLOWEEN_PROMO.videoBonusPercent, p: HALLOWEEN_PROMO.discountPercent, code: HALLOWEEN_PROMO.code };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(HALLOWEEN_PROMO.code);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes halloween-bat-fly {
          0% { transform: translate(-10vw, 0) scale(0.8); }
          25% { transform: translate(25vw, -4vh) scale(1); }
          50% { transform: translate(55vw, 3vh) scale(0.9); }
          75% { transform: translate(85vw, -3vh) scale(1); }
          100% { transform: translate(115vw, 1vh) scale(0.8); }
        }
        @keyframes halloween-bat-flap { 0%, 100% { transform: scaleY(1); } 50% { transform: scaleY(0.45); } }
        @keyframes halloween-pumpkin-bob { 0%, 100% { transform: translateY(0) rotate(-4deg); } 50% { transform: translateY(-6px) rotate(4deg); } }
        .halloween-bat { position: absolute; left: 0; width: 44px; height: 22px; animation: halloween-bat-fly 19s linear infinite; }
        .halloween-bat-wings { transform-origin: 32px 16px; animation: halloween-bat-flap 0.35s ease-in-out infinite; }
        .halloween-pumpkin { animation: halloween-pumpkin-bob 2.8s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .halloween-bat, .halloween-bat-wings, .halloween-pumpkin { animation: none; }
          .halloween-bat { left: auto; right: 12%; }
        }
      `}</style>

      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-[7] h-[60vh] overflow-hidden">
        <Bat className="top-[22%]" delay="0s" />
        <Bat className="top-[38%]" delay="-9s" />
      </div>
      <Cobweb />
      <HeroFly />

      {promo && (
        <div className="absolute inset-x-0 top-20 z-30 flex justify-center px-4">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="max-w-3xl rounded-full border border-orange-400/40 bg-gradient-to-r from-[#2e1045]/90 via-[#3b0764]/85 to-[#7c2d12]/90 px-4 py-2 text-center text-xs font-medium text-orange-100 shadow-[0_8px_30px_-10px_rgba(249,115,22,0.6)] backdrop-blur-md sm:text-sm"
          >
            🎃 {fillHalloween(t.banner, vars)}
          </button>
        </div>
      )}

      <button
        type="button"
        aria-label={t.pumpkinLabel}
        onClick={() => setOpen(true)}
        className="halloween-pumpkin absolute bottom-16 right-6 z-30 cursor-pointer rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 md:right-12"
      >
        <PumpkinSvg />
      </button>

      <Dialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) setCopied(false);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-2">
              <PumpkinSvg size={72} />
            </div>
            <DialogTitle className="text-center">{promo ? t.eggTitle : t.boo}</DialogTitle>
            {promo && <DialogDescription className="text-center">{fillHalloween(t.eggText, vars)}</DialogDescription>}
          </DialogHeader>
          {promo && (
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2">
                <code className="rounded-lg border-2 border-dashed border-orange-500 px-4 py-2 text-xl font-bold tracking-widest text-orange-600">
                  {HALLOWEEN_PROMO.code}
                </code>
                <Button variant="outline" onClick={copy}>
                  {copied ? t.copied : t.copy}
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button asChild className="rounded-full">
                  <Link to="/cabinet/subscription">{t.trader}</Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full">
                  <Link to="/nics-video">{t.video}</Link>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HalloweenHero;
