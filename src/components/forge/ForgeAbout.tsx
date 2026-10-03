import { Heart } from "lucide-react";
import type { ForgeText } from "./forgeI18n";

/** Short story of the studio: origin, plans, bioplastic, hand-made and hand-painted. */
const ForgeAbout = ({ t }: { t: ForgeText }) => (
  <section id="about" className="py-20 bg-muted/30">
    <div className="container mx-auto px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-center gap-2 text-primary">
          <Heart className="w-5 h-5" />
        </div>
        <h2 className="text-3xl md:text-4xl font-semibold text-foreground text-center">{t.aboutTitle}</h2>
        <div className="space-y-4">
          {t.about.map((para, i) => (
            <p key={i} className="text-base md:text-lg text-muted-foreground leading-relaxed">
              {para}
            </p>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default ForgeAbout;
