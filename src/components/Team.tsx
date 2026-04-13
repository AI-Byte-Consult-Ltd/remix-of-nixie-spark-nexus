import { Linkedin, Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import foundersImg from "@/assets/team-founders.jpg";

const teamDefs = [
  { nameKey: "team.alex.name", roleKey: "team.alex.role", bioKey: "team.alex.bio", link: { url: "https://www.linkedin.com/in/luntick", type: "linkedin" as const } },
  { nameKey: "team.nics.name", roleKey: "team.nics.role", bioKey: "team.nics.bio", link: { url: "https://nics.space", type: "website" as const } },
  { nameKey: "team.aleksandr.name", roleKey: "team.aleksandr.role", bioKey: "team.aleksandr.bio", link: { url: "https://www.linkedin.com/in/alekstoch", type: "linkedin" as const } },
];

const Team = () => {
  const { t } = useLanguage();

  return (
    <section className="py-24 relative overflow-hidden bg-background">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-4xl md:text-5xl font-semibold text-foreground">
            {t("team.title").split(" ").slice(0, -1).join(" ")} <span className="text-gradient-gold">{t("team.title").split(" ").pop()}</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("team.subtitle")}</p>
        </div>

        {/* Full-width founders image */}
        <div className="w-full mb-12 rounded-2xl overflow-hidden shadow-gold">
          <img
            src={foundersImg}
            alt={t("team.title")}
            className="w-full h-auto object-cover"
          />
        </div>

        {/* 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {teamDefs.map((member, index) => (
            <div key={index} className="text-center space-y-4">
              <h3 className="text-2xl font-semibold text-foreground">{t(member.nameKey)}</h3>
              <p className="text-primary font-medium text-lg">{t(member.roleKey)}</p>
              <p className="text-muted-foreground leading-relaxed">{t(member.bioKey)}</p>
              {member.link && (
                <div className="flex justify-center pt-2">
                  <a href={member.link.url} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-accent hover:bg-primary/10 transition-colors group/btn" aria-label={member.link.type}>
                    {member.link.type === "linkedin" ? (
                      <Linkedin className="w-5 h-5 text-primary group-hover/btn:scale-110 transition-transform" />
                    ) : (
                      <Globe className="w-5 h-5 text-primary group-hover/btn:scale-110 transition-transform" />
                    )}
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
