import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Linkedin, Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import aleksImg from "@/assets/team-aleks.jpg";
import alexImg from "@/assets/team-alex.jpg";
import nicsFounderImg from "@/assets/nicsFounderImg.jpeg";

const teamDefs = [
  { nameKey: "team.alex.name", roleKey: "team.alex.role", bioKey: "team.alex.bio", image: alexImg, link: { url: "https://www.linkedin.com/in/luntick", type: "linkedin" as const } },
  { nameKey: "team.aleksandr.name", roleKey: "team.aleksandr.role", bioKey: "team.aleksandr.bio", image: aleksImg, link: { url: "https://www.linkedin.com/in/alekstoch", type: "linkedin" as const } },
  { nameKey: "team.nics.name", roleKey: "team.nics.role", bioKey: "team.nics.bio", image: nicsFounderImg, link: { url: "https://nics.space", type: "website" as const } },
];

const Team = () => {
  const { t } = useLanguage();

  return (
    <section className="py-24 relative overflow-hidden bg-background">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-semibold text-foreground">
            {t("team.title").split(" ").slice(0, -1).join(" ")} <span className="text-gradient-gold">{t("team.title").split(" ").pop()}</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("team.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {teamDefs.map((member, index) => (
            <Card key={index} className="card-hover bg-card border-border/50 hover:border-primary/30">
              <CardHeader className="text-center">
                <div className="mx-auto mb-6 relative">
                  <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-primary/20 shadow-gold">
                    <img src={member.image} alt={t(member.nameKey)} className="w-full h-full object-cover" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-semibold text-foreground">{t(member.nameKey)}</CardTitle>
                <CardDescription className="text-primary font-medium text-lg">{t(member.roleKey)}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-center leading-relaxed">{t(member.bioKey)}</p>
                {member.link && (
                  <div className="flex justify-center pt-4">
                    <a href={member.link.url} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-accent hover:bg-primary/10 transition-colors group/btn" aria-label={member.link.type}>
                      {member.link.type === "linkedin" ? (
                        <Linkedin className="w-5 h-5 text-primary group-hover/btn:scale-110 transition-transform" />
                      ) : (
                        <Globe className="w-5 h-5 text-primary group-hover/btn:scale-110 transition-transform" />
                      )}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
