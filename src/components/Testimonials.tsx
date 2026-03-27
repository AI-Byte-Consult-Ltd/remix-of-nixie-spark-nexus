import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const testimonialKeys = [
  { quoteKey: "testimonials.1.quote", authorKey: "testimonials.1.author", positionKey: "testimonials.1.position" },
  { quoteKey: "testimonials.2.quote", authorKey: "testimonials.2.author", positionKey: "testimonials.2.position" },
  { quoteKey: "testimonials.3.quote", authorKey: "testimonials.3.author", positionKey: "testimonials.3.position" },
];

const Testimonials = () => {
  const { t } = useLanguage();

  return (
    <section className="py-24 relative bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-semibold text-foreground">
            {t("testimonials.title").split(" ").slice(0, -1).join(" ")} <span className="text-gradient-gold">{t("testimonials.title").split(" ").pop()}</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("testimonials.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonialKeys.map((item, index) => (
            <Card key={index} className="card-hover bg-card border-border/50 hover:border-primary/30">
              <CardContent className="pt-6 space-y-4">
                <Quote className="w-10 h-10 text-primary/30" />
                <p className="text-foreground/80 leading-relaxed">"{t(item.quoteKey)}"</p>
                <div className="pt-4 border-t border-border">
                  <p className="font-semibold text-foreground">{t(item.authorKey)}</p>
                  <p className="text-sm text-muted-foreground">{t(item.positionKey)}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
