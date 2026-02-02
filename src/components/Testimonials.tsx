import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "AI Byte Consult revolutionized our logistics operations. The real-time tracking system has saved us countless hours and improved our delivery accuracy by 95%.",
    author: "Maria Lopez",
    position: "CEO, CargoNova",
  },
  {
    quote: "Their automation system doubled our restaurant efficiency. We're now serving more customers with better accuracy and happier staff.",
    author: "David Chen",
    position: "Founder, TasteWave Bistro",
  },
  {
    quote: "Our NFT launch became truly intelligent thanks to their AI layer. The voice-enabled avatars created an entirely new level of engagement.",
    author: "Elena Rossi",
    position: "NFT Project Lead",
  },
];

const Testimonials = () => {
  return (
    <section className="py-24 relative bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-semibold text-foreground">
            Trusted by <span className="text-gradient-gold">Innovators</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See what our clients say about working with us
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index}
              className="card-hover bg-card border-border/50 hover:border-primary/30"
            >
              <CardContent className="pt-6 space-y-4">
                <Quote className="w-10 h-10 text-primary/30" />
                <p className="text-foreground/80 leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <div className="pt-4 border-t border-border">
                  <p className="font-semibold text-foreground">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.position}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
