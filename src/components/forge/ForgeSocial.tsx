import { Instagram, Youtube, ExternalLink } from "lucide-react";
import { SOCIAL_LINKS } from "@/data/forgeCatalog";
import type { ForgeText } from "./forgeI18n";

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M19.6 6.7a4.8 4.8 0 0 1-3.8-4.2h-3.3v13.4a2.9 2.9 0 1 1-2-2.8V9.7a6.2 6.2 0 1 0 5.3 6.1V9.3a8 8 0 0 0 4.7 1.5V7.5a4.8 4.8 0 0 1-.9-.8Z" />
  </svg>
);

const TILES = [
  { key: "instagram" as const, label: "Instagram", Icon: Instagram },
  { key: "tiktok" as const, label: "TikTok", Icon: TikTokIcon },
  { key: "youtube" as const, label: "YouTube", Icon: Youtube },
];

const ForgeSocial = ({ t }: { t: ForgeText }) => (
  <section id="social" className="py-20 bg-background">
    <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto text-center space-y-10">
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground">{t.socialTitle}</h2>
          <p className="text-lg text-muted-foreground">{t.socialSubtitle}</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {TILES.map(({ key, label, Icon }) => {
            const href = SOCIAL_LINKS[key];
            const inner = (
              <div className="aspect-video rounded-2xl border border-border/50 bg-muted/40 flex flex-col items-center justify-center gap-3 p-6 transition-colors hover:border-primary/50">
                <Icon className="w-10 h-10 text-primary" />
                <span className="font-semibold text-foreground">{label}</span>
                {href ? (
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">{t.soon}</span>
                )}
              </div>
            );
            return href ? (
              <a key={key} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>{inner}</a>
            ) : (
              <div key={key}>{inner}</div>
            );
          })}
        </div>
      </div>
    </div>
  </section>
);

export default ForgeSocial;
