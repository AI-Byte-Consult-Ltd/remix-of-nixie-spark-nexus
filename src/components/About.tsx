import { useLanguage } from "@/contexts/LanguageContext";

const About = () => {
  const { t } = useLanguage();

  return (
    <section className="py-24 relative overflow-hidden bg-muted/30">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-semibold mb-6 text-foreground">
            {t("about.title").split(" ").slice(0, -1).join(" ")} <span className="text-gradient-gold">{t("about.title").split(" ").pop()}</span>
          </h2>
          <p className="text-lg md:text-xl text-foreground/80 leading-relaxed">{t("about.p1")}</p>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">{t("about.p2")}</p>
        </div>
      </div>
    </section>
  );
};

export default About;
