import { Wand2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { ForgeText } from "./forgeI18n";

const ForgeStudioSoon = ({ t }: { t: ForgeText }) => (
  <section id="studio" className="py-20 bg-muted/30">
    <div className="container mx-auto px-4">
      <div className="max-w-3xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-primary/20">
          <Wand2 className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">{t.studioBadge}</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-semibold text-foreground">{t.studioTitle}</h2>
        <p className="text-lg text-muted-foreground leading-relaxed">{t.studioSubtitle}</p>
        <Card className="bg-card border-border/50">
          <CardContent className="pt-6 space-y-3">
            <span className="inline-block px-3 py-1 rounded-full bg-gradient-gold text-white text-xs font-semibold uppercase tracking-wide">
              {t.soon}
            </span>
            <p className="text-muted-foreground leading-relaxed">{t.studioSoonText}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  </section>
);

export default ForgeStudioSoon;
