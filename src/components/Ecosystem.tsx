import { Bot, Globe, Users, UtensilsCrossed, Mountain, PawPrint, ExternalLink, Brain, Cpu, Activity, Server, Building2, TrendingUp } from "lucide-react";
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
  { icon: Globe, titleKey: "ecosystem.aquaterra.title", descKey: "ecosystem.aquaterra.desc", link: "https://aquaterra.world", status: "alpha" },
  { icon: Building2, titleKey: "ecosystem.architect.title", descKey: "ecosystem.architect.desc", status: "soon" },
  { icon: Mountain, titleKey: "ecosystem.geologist.title", descKey: "ecosystem.geologist.desc", link: "https://nics.space", status: "soon" },
  { icon: UtensilsCrossed, titleKey: "ecosystem.horeca.title", descKey: "ecosystem.horeca.desc", link: "https://nics.space", status: "soon" },
  { icon: PawPrint, titleKey: "ecosystem.animals.title", descKey: "ecosystem.animals.desc", link: "https://yorkie.aibyteconsult.com/", status: "soon" },
  { icon: Users, titleKey: "ecosystem.pride.title", descKey: "ecosystem.pride.desc", link: "https://pridesocial.org", status: "live" },
];

const nicsDetails = [
  { icon: Brain, key: "ecosystem.nics.detail1" },
  { icon: Cpu, key: "ecosystem.nics.detail2" },
  { icon: Activity, key: "ecosystem.nics.detail3" },
  { icon: Server, key: "ecosystem.nics.detail4" },
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

        {/* NICS AI Featured Card */}
        <a href="https://nics.space" target="_blank" rel="noopener noreferrer" className="block max-w-6xl mx-auto mb-8">
          <Card className="group card-hover bg-gradient-to-br from-card via-card to-primary/5 border-primary/30 hover:border-primary/50 overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-gold flex items-center justify-center flex-shrink-0">
                    <Bot className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-primary/70 uppercase tracking-wider mb-1">
                      {t("ecosystem.nics.research")}
                    </p>
                    <CardTitle className="text-2xl md:text-3xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {t("ecosystem.nics.title")}
                    </CardTitle>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">{t("ecosystem.status.alpha")}</Badge>
                  <ExternalLink className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <CardDescription className="text-base text-muted-foreground leading-relaxed max-w-4xl">
                {t("ecosystem.nics.desc")}
              </CardDescription>

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                {["ecosystem.nics.badge1", "ecosystem.nics.badge2", "ecosystem.nics.badge3", "ecosystem.nics.badge4"].map((key) => (
                  <Badge key={key} variant="outline" className="border-primary/20 text-primary/80 bg-primary/5 text-xs">
                    {t(key)}
                  </Badge>
                ))}
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {nicsDetails.map((detail) => {
                  const Icon = detail.icon;
                  return (
                    <div key={detail.key} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                      <Icon className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{t(detail.key)}</span>
                    </div>
                  );
                })}
              </div>

              {/* Founders */}
              <p className="text-xs text-muted-foreground/70 pt-2 border-t border-border/50">
                {t("ecosystem.nics.founders")} · AI Byte Consult Ltd.
              </p>
            </CardContent>
          </Card>
        </a>

        {/* Other Ecosystem Cards */}
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

        {/* NICS Trading Featured Mini-Block */}
        <div className="max-w-6xl mx-auto mt-8">
          <Card className="group card-hover bg-gradient-to-br from-card via-card to-green-500/5 border-green-500/30 hover:border-green-500/50 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 p-6 items-center">
              <a
                href="https://affs.click/2i4pn"
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="block space-y-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl md:text-2xl font-semibold text-foreground group-hover:text-primary transition-colors">
                        {t("ecosystem.trading.title")}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20">
                          {t("ecosystem.status.live")}
                        </Badge>
                        <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </div>
                </div>
                <CardDescription className="text-base text-muted-foreground leading-relaxed">
                  {t("ecosystem.trading.desc")}
                </CardDescription>
              </a>
              <div className="flex justify-center md:justify-end">
                <iframe
                  src="https://images.pipaffiliates.com/f/b?g=1013&c=1217182"
                  width="300"
                  height="250"
                  style={{ border: 0 }}
                  referrerPolicy="no-referrer-when-downgrade"
                  title="NICS Trading"
                  loading="lazy"
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Ecosystem;
