import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import restaurantImg from "@/assets/project-restaurant-new.jpg";
import logisticsImg from "@/assets/project-logistics-new.jpg";
import hotelImg from "@/assets/project-hotel-new.jpg";
import nftImg from "@/assets/project-nft-new.jpg";
import clinicImg from "@/assets/project-clinic-new.jpg";
import retailImg from "@/assets/project-retail-new.jpg";
import realestateAiImg from "@/assets/project-realestate-ai.jpg";
import architectureImg from "@/assets/project-architecture-3d.jpg";

const projectDefs = [
  { titleKey: "projects.estatereply.title", descKey: "projects.estatereply.desc", image: realestateAiImg, tags: ["AI Agent", "Email Automation", "Real Estate", "24/7"] },
  { titleKey: "projects.architecture.title", descKey: "projects.architecture.desc", image: architectureImg, tags: ["3D Design", "Architecture", "Visualization", "AI"] },
  { titleKey: "projects.restaurant.title", descKey: "projects.restaurant.desc", image: restaurantImg, tags: ["FastAPI", "React", "NLP", "Automation"] },
  { titleKey: "projects.logistics.title", descKey: "projects.logistics.desc", image: logisticsImg, tags: ["Python", "AI/ML", "Real-time", "Analytics"] },
  { titleKey: "projects.hotel.title", descKey: "projects.hotel.desc", image: hotelImg, tags: ["Node.js", "WhatsApp API", "Automation"] },
  { titleKey: "projects.nft.title", descKey: "projects.nft.desc", image: nftImg, tags: ["Web3", "Blockchain", "AI", "NFT"] },
  { titleKey: "projects.clinic.title", descKey: "projects.clinic.desc", image: clinicImg, tags: ["AI", "Healthcare", "Voice", "Automation"] },
  { titleKey: "projects.retail.title", descKey: "projects.retail.desc", image: retailImg, tags: ["Analytics", "AI/ML", "React", "Python"] },
];

const Projects = () => {
  const { t } = useLanguage();

  return (
    <section id="projects" className="py-24 relative overflow-hidden bg-muted/30">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-semibold text-foreground">
            {t("projects.title").replace(/Action|Aktion|Action|العمل|行动|Akcji|Eylem|Azione|Действии|Действие/g, (m) => `<SPLIT>${m}`).split("<SPLIT>").length > 1 
              ? <>{t("projects.title").substring(0, t("projects.title").lastIndexOf(" "))} <span className="text-gradient-gold">{t("projects.title").split(" ").pop()}</span></>
              : <>{t("projects.title")}</>
            }
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("projects.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projectDefs.map((project, index) => (
            <Card key={index} className="group card-hover overflow-hidden bg-card border-border/50 hover:border-primary/30">
              <div className="relative h-48 overflow-hidden">
                <img src={project.image} alt={t(project.titleKey)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent opacity-60" />
              </div>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {t(project.titleKey)}
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground leading-relaxed">
                  {t(project.descKey)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, tagIndex) => (
                    <Badge key={tagIndex} variant="secondary" className="bg-accent text-accent-foreground border-border/50">{tag}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
