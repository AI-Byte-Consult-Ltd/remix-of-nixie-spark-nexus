import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Linkedin } from "lucide-react";
import johnImg from "@/assets/team-aleks.jpg";
import alexImg from "@/assets/team-alex.jpg";

const team = [
  {
    name: "Alexander Lunin",
    role: "Co-Founder & AI Architect",
    bio: "Leads AI architecture and Web3 integrations across the NICS AI Ecosystem. Over 15 years of experience in cutting-edge technology.",
    image: alexImg,
    linkedin: "https://www.linkedin.com/in/luntick",
  },
  {
    name: "Aleksandr Tochilov",
    role: "Co-Founder & Product Director",
    bio: "Co-founder of AI Byte Consult | SaaS & MTS Engineer, Digital Project Manager, Graphic designer and more… | Charged with 60+ countries.",
    image: johnImg,
    linkedin: "https://www.linkedin.com/in/alekstoch",
  },
];

const Team = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-background">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-semibold text-foreground">
            Meet the <span className="text-gradient-gold">Founders</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            The visionaries behind AI Byte Consult Ltd.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {team.map((member, index) => (
            <Card 
              key={index}
              className="card-hover bg-card border-border/50 hover:border-primary/30"
            >
              <CardHeader className="text-center">
                <div className="mx-auto mb-6 relative">
                  <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-primary/20 shadow-gold">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <CardTitle className="text-2xl font-semibold text-foreground">{member.name}</CardTitle>
                <CardDescription className="text-primary font-medium text-lg">
                  {member.role}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-center leading-relaxed">
                  {member.bio}
                </p>
                {member.linkedin && (
                  <div className="flex justify-center pt-4">
                    <a 
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-full bg-accent hover:bg-primary/10 transition-colors group/btn"
                    >
                      <Linkedin className="w-5 h-5 text-primary group-hover/btn:scale-110 transition-transform" />
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
