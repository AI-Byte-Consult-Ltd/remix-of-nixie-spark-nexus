import { Bot, Globe, Hexagon, Users, UtensilsCrossed, Mountain, Heart, PawPrint, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

interface EcosystemItem {
  icon: typeof Bot;
  titleKey: string;
  descKey: string;
  link?: string;
  status: "alpha" | "soon" | "live";
}

const ecosystems: EcosystemItem[] = [
  { icon: Bot, titleKey: "ecosystem.nics.title", descKey: "ecosystem.nics.desc", link: "https://nics.space", status: "alpha" },
  { icon: UtensilsCrossed, titleKey: "ecosystem.horeca.title", descKey: "ecosystem.horeca.desc", link: "https://nics.space", status: "soon" },
  { icon: Mountain, titleKey: "ecosystem.geologist.title", descKey: "ecosystem.geologist.desc", link: "https://nics.space", status: "soon" },
  { icon: Globe, titleKey: "ecosystem.aquaterra.title", descKey: "ecosystem.aquaterra.desc", link: "https://aquaterra.world", status: "alpha" },
  { icon: Hexagon, titleKey: "ecosystem.pantheon.title", descKey: "ecosystem.pantheon.desc", link: "https://opensea.io/collection/nics-ai-eternals", status: "alpha" },
  { icon: Users, titleKey: "ecosystem.pride.title", descKey: "ecosystem.pride.desc", link: "https://pridesocial.org", status: "live" },
  { icon: Heart, titleKey: "ecosystem.pridelab.title", descKey: "ecosystem.pridelab.desc", link: "https://pridesocial.org", status: "alpha" },
  { icon: PawPrint, titleKey: "ecosystem.animals.title", descKey: "ecosystem.animals.desc", status: "soon" },
];

const Ecosystem = () => {
  const { t } = useLanguage();

  const getStatusBadge = (status: EcosystemItem["status"]) => {
    switch (status) {
      case "alpha":
        return <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">{t("ecosystem.status.alpha")}</Badge>;
      case "soon":
        return <Badge variant="secondary" className="bg-muted text-muted-foreground border-border">{t("ecosystem.status.soon")}</Badge>;
      case "live":
        return <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20">{t("ecosystem.status.live")}</Badge>;
    }
  };

  return (
    <section id="ecosystem" className="py-24 relative bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-semibold text-foreground">
            {t("ecosystem.title").split(" ").slice(0, -1).join(" ")} <span className="text-gradient-gold">{t("ecosystem.title").split(" ").pop()}</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("ecosystem.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {ecosystems.map((ecosystem, index) => {
            const Icon = ecosystem.icon;
            const CardWrapper = ecosystem.link ? "a" : "div";
            const cardProps = ecosystem.link
              ? { href: ecosystem.link, target: "_blank", rel: "noopener noreferrer" }
              : {};

            return (
              <CardWrapper key={index} {...cardProps} className="block">
                <Card className={`group card-hover bg-card border-border/50 hover:border-primary/30 h-full ${ecosystem.link ? "" : "cursor-default"}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-gold flex items-center justify-center mb-4 flex-shrink-0">
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(ecosystem.status)}
                        {ecosystem.link && (
                          <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </div>
                    </div>
                    <CardTitle className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                      {t(ecosystem.titleKey)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base text-muted-foreground leading-relaxed">
                      {t(ecosystem.descKey)}
                    </CardDescription>
                  </CardContent>
                </Card>
              </CardWrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Ecosystem;
