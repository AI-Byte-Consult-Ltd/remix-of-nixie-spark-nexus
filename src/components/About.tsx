import { useLanguage } from "@/contexts/LanguageContext";
import { Brain, Eye, Building2, Rocket } from "lucide-react";

const About = () => {
  const { t } = useLanguage();

  const highlights = [
    { icon: Brain, label: "NICS LLM", sub: "Gutenberg-trained" },
    { icon: Eye, label: "NICS Visual AI", sub: "NASA imagery" },
    { icon: Building2, label: "Architecture", sub: "AI & classic" },
    { icon: Rocket, label: "Space Research", sub: "Terraforming" },
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-muted/30">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-semibold mb-6 text-foreground">
              {t("about.title").split(" ").slice(0, -1).join(" ")}{" "}
              <span className="text-gradient-gold">{t("about.title").split(" ").pop()}</span>
            </h2>
            <p className="text-lg md:text-xl text-foreground/80 leading-relaxed">{t("about.p1")}</p>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">{t("about.p2")}</p>
          </div>

          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4">
            {highlights.map((h) => {
              const Icon = h.icon;
              return (
                <div
                  key={h.label}
                  className="group rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-5 text-center hover:border-primary/40 transition-colors"
                >
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-gold flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-sm font-semibold text-foreground">{h.label}</div>
                  <div className="text-xs text-muted-foreground mt-1">{h.sub}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
