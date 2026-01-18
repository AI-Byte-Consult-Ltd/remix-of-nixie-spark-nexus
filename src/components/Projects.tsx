import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import restaurantImg from "@/assets/project-restaurant-new.jpg";
import logisticsImg from "@/assets/project-logistics-new.jpg";
import hotelImg from "@/assets/project-hotel-new.jpg";
import nftImg from "@/assets/project-nft-new.jpg";
import clinicImg from "@/assets/project-clinic-new.jpg";
import retailImg from "@/assets/project-retail-new.jpg";

const projects = [
  {
    title: "Restaurant Chain Automation",
    description: "Smart ordering and AI customer service for TasteWave Bistro. Increased efficiency by 150%.",
    image: restaurantImg,
    tags: ["FastAPI", "React", "NLP", "Automation"],
  },
  {
    title: "Logistics Parser AI",
    description: "Real-time supply chain tracking for CargoNova with predictive analytics.",
    image: logisticsImg,
    tags: ["Python", "AI/ML", "Real-time", "Analytics"],
  },
  {
    title: "Hotel Booking Automation",
    description: "WhatsApp chatbot integration for OceanView Resorts with seamless booking experience.",
    image: hotelImg,
    tags: ["Node.js", "WhatsApp API", "Automation"],
  },
  {
    title: "NFT Intelligence Framework",
    description: "AI-based artifact creation system for Eternals by Nixie with voice synthesis.",
    image: nftImg,
    tags: ["Web3", "Blockchain", "AI", "NFT"],
  },
  {
    title: "Voice Assistant for Clinics",
    description: "Appointment automation for MediCore Health with natural language processing.",
    image: clinicImg,
    tags: ["AI", "Healthcare", "Voice", "Automation"],
  },
  {
    title: "Retail Analytics Platform",
    description: "AI-driven sales prediction for UrbanMarket with inventory optimization.",
    image: retailImg,
    tags: ["Analytics", "AI/ML", "React", "Python"],
  },
];

const Projects = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-glow opacity-30" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
            Our Work in Action
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real solutions delivering measurable results for forward-thinking businesses
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <Card 
              key={index}
              className="glass-card group overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer border-primary/20 hover:border-secondary/50"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-60" />
              </div>
              <CardHeader>
                <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {project.title}
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground leading-relaxed">
                  {project.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, tagIndex) => (
                    <Badge 
                      key={tagIndex} 
                      variant="secondary"
                      className="bg-secondary/20 text-secondary-foreground border-secondary/30"
                    >
                      {tag}
                    </Badge>
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
