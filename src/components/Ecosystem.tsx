import { Bot, Globe, Hexagon, Users, UtensilsCrossed, Mountain, Heart, PawPrint, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface EcosystemItem {
  icon: typeof Bot;
  title: string;
  description: string;
  link?: string;
  status: "alpha" | "soon" | "live";
}

const ecosystems: EcosystemItem[] = [
  {
    icon: Bot,
    title: "NICS AI Ecosystem",
    description:
      "NICS AI Ecosystem is a unified artificial intelligence and blockchain infrastructure designed to connect industries, automate workflows, and enable cross-platform data synchronization. It combines decentralized logic, neural APIs, and tokenized access to deliver secure, scalable, and intelligent solutions for businesses, developers, and global communities.",
    link: "https://nics.space",
    status: "alpha",
  },
  {
    icon: UtensilsCrossed,
    title: "NICS AI HoReCa",
    description:
      "NICS AI HoReCa is an advanced AI automation platform for restaurants, bars, and cafés. It provides White Label solutions with voice-driven interaction, smart analytics, order automation, and adaptive AI agents. Integrated with POS, CRM, and payment systems, it streamlines hospitality operations and enhances customer experience through intelligent automation.",
    link: "https://nics.space",
    status: "soon",
  },
  {
    icon: Mountain,
    title: "NICS AI Geologist",
    description:
      "NICS AI Geologist is an analytical platform connecting geology, mining, and genealogy through intelligent data fusion. It processes exploration data, geological layers, and historical archives to identify resource potential and ancestral land correlations. The system supports sustainable exploration and digital heritage mapping with AI-powered insight.",
    link: "https://nics.space",
    status: "soon",
  },
  {
    icon: Globe,
    title: "AquaTerra World (Metaverse)",
    description:
      "AquaTerra World is an immersive AI-driven metaverse that unites virtual collaboration, entertainment, and business innovation. Within this 3D environment, users interact, learn, and trade using digital assets powered by AI and blockchain, creating a seamless connection between virtual experience and real-world economy.",
    link: "https://aquaterra.world",
    status: "alpha",
  },
  {
    icon: Hexagon,
    title: "Pantheon of Eternals AI",
    description:
      "Pantheon of Eternals AI is a revolutionary collection of interactive iNFT entities inspired by ancient mythology. Each Eternal—whether Zeus, Ra, or Odin—is reborn as an AI avatar with personality, dialogue, and adaptive learning. Merging divine archetypes with artificial intelligence, the Pantheon bridges storytelling, identity, and digital evolution.",
    link: "https://opensea.io/collection/nics-ai-eternals",
    status: "alpha",
  },
  {
    icon: Users,
    title: "PRIDE Social Network",
    description:
      "PRIDE Social Network is a decentralized Web3 community platform that rewards creativity and engagement with native tokens. It empowers users to share ideas, art, and experiences while earning from their social activity, building an inclusive and self-sustaining digital ecosystem for expression and collaboration.",
    link: "https://pridesocial.org",
    status: "live",
  },
  {
    icon: Heart,
    title: "PRIDE Lab Foundation",
    description:
      "PRIDE Lab Foundation is a humanitarian initiative dedicated to supporting vulnerable communities and promoting social equity. Through blockchain-verified donations and transparent fund allocation, the foundation provides educational programs, healthcare assistance, and crisis relief. Every contribution is tracked on-chain, ensuring accountability and maximizing impact for those in need.",
    link: "https://pridesocial.org",
    status: "alpha",
  },
  {
    icon: PawPrint,
    title: "Animals Foundation",
    description:
      "Animals Foundation is a global animal welfare organization leveraging AI and blockchain for wildlife conservation and pet rescue operations. The foundation operates rescue shelters, funds veterinary care, and uses AI-powered tracking for endangered species protection. NFT-based adoption certificates and tokenized donations create a sustainable model for animal care worldwide.",
    status: "soon",
  },
];

const getStatusBadge = (status: EcosystemItem["status"]) => {
  switch (status) {
    case "alpha":
      return (
        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
          Alpha
        </Badge>
      );
    case "soon":
      return (
        <Badge variant="secondary" className="bg-muted text-muted-foreground border-border">
          Coming Soon
        </Badge>
      );
    case "live":
      return (
        <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20">
          Live
        </Badge>
      );
  }
};

const Ecosystem = () => {
  return (
    <section id="ecosystem" className="py-24 relative bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-semibold text-foreground">
            Our <span className="text-gradient-gold">Ecosystem</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A comprehensive suite of AI-powered solutions for the modern digital economy
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {ecosystems.map((ecosystem, index) => {
            const Icon = ecosystem.icon;
            const CardWrapper = ecosystem.link ? "a" : "div";
            const cardProps = ecosystem.link
              ? {
                  href: ecosystem.link,
                  target: "_blank",
                  rel: "noopener noreferrer",
                }
              : {};

            return (
              <CardWrapper key={index} {...cardProps} className="block">
                <Card
                  className={`group card-hover bg-card border-border/50 hover:border-primary/30 h-full ${
                    ecosystem.link ? "" : "cursor-default"
                  }`}
                >
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
                      {ecosystem.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base text-muted-foreground leading-relaxed">
                      {ecosystem.description}
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
