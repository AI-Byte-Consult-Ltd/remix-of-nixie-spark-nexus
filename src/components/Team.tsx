import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Linkedin } from "lucide-react";
import johnImg from "@/assets/team-john.jpg";
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
    bio: "Focuses on automation systems, client solutions, and creative ecosystem design. Passionate about turning complex tech into simple solutions.",
    image: johnImg,
    linkedin: "https://www.linkedin.com/in/alekstoch",
  },
];

const Team = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-purple-glow opacity-30" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
            Meet the Founders
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            The visionaries behind AI Byte Consult Ltd.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {team.map((member, index) => (
            <Card 
              key={index}
              className="glass-card group hover:scale-105 transition-all duration-300 border-primary/20 hover:border-secondary/50"
            >
              <CardHeader className="text-center">
                <div className="mx-auto mb-6 relative">
                  <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-primary/30 group-hover:border-primary transition-all duration-300 neon-glow">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-foreground">{member.name}</CardTitle>
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
                      className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors group/btn"
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