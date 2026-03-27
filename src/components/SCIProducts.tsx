import { MessageCircle, Bot, BrainCircuit, Sparkles, ArrowUpRight, Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const SCIProducts = () => {
  const { t } = useLanguage();

  const products = [
    {
      icon: MessageCircle,
      titleKey: "sci.lite.title", subtitleKey: "sci.lite.subtitle", taglineKey: "sci.lite.tagline",
      oneTimePrice: "€220", monthlyPrice: "€25",
      descKey: "sci.lite.desc",
      featureKeys: ["sci.lite.f1", "sci.lite.f2", "sci.lite.f3", "sci.lite.f4", "sci.lite.f5", "sci.lite.f6"],
      paymentLink: "https://checkout.revolut.com/pay/bfc39f6d-b7ab-40a3-a42a-b161d5515aa1",
    },
    {
      icon: Bot,
      titleKey: "sci.smart.title", subtitleKey: "sci.smart.subtitle", taglineKey: "sci.smart.tagline",
      oneTimePrice: "€380", monthlyPrice: "€35",
      descKey: "sci.smart.desc",
      featureKeys: ["sci.smart.f1", "sci.smart.f2", "sci.smart.f3", "sci.smart.f4", "sci.smart.f5", "sci.smart.f6", "sci.smart.f7", "sci.smart.f8"],
      popular: true,
      paymentLink: "https://checkout.revolut.com/pay/96646897-cc38-46b8-b127-4ff669334d68",
    },
    {
      icon: BrainCircuit,
      titleKey: "sci.pro.title", subtitleKey: "sci.pro.subtitle", taglineKey: "sci.pro.tagline",
      oneTimePrice: "€670", monthlyPrice: "€85",
      descKey: "sci.pro.desc",
      featureKeys: ["sci.pro.f1", "sci.pro.f2", "sci.pro.f3", "sci.pro.f4", "sci.pro.f5", "sci.pro.f6", "sci.pro.f7", "sci.pro.f8", "sci.pro.f9", "sci.pro.f10"],
      paymentLink: "https://checkout.revolut.com/pay/844029e5-8718-443a-82e4-d979f5a211a6",
    },
  ];

  return (
    <section id="sci-products" className="py-24 relative overflow-hidden bg-background">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-primary/20 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">{t("sci.badge")}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-semibold mb-6 text-foreground">
            {t("sci.title1")} <span className="text-gradient-gold">{t("sci.title2")}</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{t("sci.subtitle")}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {products.map((product, index) => (
            <div key={index} className="group relative animate-fade-in" style={{ animationDelay: `${index * 150}ms` }}>
              {product.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                  <div className="px-4 py-1 rounded-full bg-foreground text-background text-sm font-medium shadow-lg">{t("sci.popular")}</div>
                </div>
              )}

              <div className={`relative h-full bg-card rounded-3xl p-8 border ${product.popular ? 'border-primary/50 shadow-gold' : 'border-border/50'} card-hover overflow-hidden`}>
                <div className="w-14 h-14 rounded-2xl bg-gradient-gold flex items-center justify-center mb-6">
                  <product.icon className="w-7 h-7 text-white" />
                </div>

                <div className="relative">
                  <h3 className="text-2xl font-semibold mb-1 text-foreground">{t(product.titleKey)}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{t(product.subtitleKey)}</p>
                  <p className="text-sm font-medium text-primary mb-4">{t(product.taglineKey)}</p>
                  
                  <div className="mb-6 p-4 rounded-2xl bg-muted/50 border border-border/50">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-3xl font-semibold text-gradient-gold">{product.oneTimePrice}</span>
                      <span className="text-muted-foreground">{t("sci.onetime")}</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-medium text-foreground">+ {product.monthlyPrice}</span>
                      <span className="text-muted-foreground">{t("sci.month")}</span>
                    </div>
                  </div>

                  <p className="text-foreground/70 mb-6 leading-relaxed text-sm">{t(product.descKey)}</p>

                  <ul className="space-y-2 mb-8">
                    {product.featureKeys.map((fKey, fIndex) => (
                      <li key={fIndex} className="flex items-start gap-3 text-sm text-foreground/70">
                        <Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
                        <span>{t(fKey)}</span>
                      </li>
                    ))}
                  </ul>

                  <a href={product.paymentLink} target="_blank" rel="noopener noreferrer" className="group/btn relative w-full flex items-center justify-center gap-2 px-6 py-4 rounded-full font-medium text-lg bg-foreground text-background hover:bg-foreground/90 transition-all duration-300">
                    {t("sci.getstarted")}
                    <ArrowUpRight className="w-5 h-5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 animate-fade-in">
          <p className="text-muted-foreground">{t("sci.note")}</p>
        </div>
      </div>
    </section>
  );
};

export default SCIProducts;
