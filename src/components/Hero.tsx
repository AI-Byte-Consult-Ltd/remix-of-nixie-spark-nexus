import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import heroImage from "@/assets/hero-microscheme.jpg";

const Hero = () => {
  const scrollToEcosystem = () => {
    document.getElementById("ecosystem")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background/95 z-0" />
      
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--border)) 1px, transparent 1px),
                            linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Main content */}
      <div className="container relative z-10 mx-auto px-4 pt-32 pb-8">
        {/* Hero Banner - Full width rectangular image */}
        <div className="relative w-full mb-12 animate-fade-in">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            {/* Glow effect behind image */}
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 blur-3xl opacity-40" />
            
            {/* Main banner image - rectangular aspect ratio */}
            <img
              src={heroImage}
              alt="AI Technology - Golden Microscheme"
              className="relative w-full h-auto rounded-2xl border border-primary/20 object-cover aspect-[21/9]"
            />
            
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-transparent rounded-2xl" />
            
            {/* Content overlay on the left */}
            <div className="absolute inset-0 flex items-center">
              <div className="pl-8 md:pl-16 lg:pl-20 pr-4 max-w-2xl space-y-6">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/80 backdrop-blur-sm border border-primary/30">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-sm font-medium text-primary">A Global AI Technology Company</span>
                </div>

                {/* Main headline */}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight text-foreground">
                  Intelligent Systems{" "}
                  <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                    designed
                  </span>{" "}
                  <span className="bg-gradient-to-r from-secondary via-primary to-secondary bg-clip-text text-transparent">
                    and built
                  </span>{" "}
                  for Business
                </h1>

                {/* Description */}
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl">
                  AI Byte Consult Ltd specializes in AI development and business automation. 
                  We create scalable solutions for enterprises, hospitality, healthcare, 
                  logistics, and research.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-4">
                  <Button
                    size="lg"
                    onClick={scrollToEcosystem}
                    className="group bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-5 neon-glow transition-all duration-300"
                  >
                    Explore Ecosystem
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                    className="font-semibold px-6 py-5 border-border bg-background/50 backdrop-blur-sm hover:border-primary/50 hover:bg-primary/10 transition-all duration-300"
                  >
                    Contact Us
                  </Button>
                </div>

                {/* Trust badges */}
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2 bg-background/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <Check className="w-4 h-4 text-primary" />
                    <span>AI-Powered</span>
                  </div>
                  <div className="flex items-center gap-2 bg-background/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <Check className="w-4 h-4 text-primary" />
                    <span>Blockchain Ready</span>
                  </div>
                  <div className="flex items-center gap-2 bg-background/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <Check className="w-4 h-4 text-primary" />
                    <span>Enterprise Grade</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating stats card */}
            <div className="absolute bottom-6 right-6 glass-card p-4 rounded-xl border border-primary/20 animate-float hidden md:block">
              <div className="text-2xl font-bold text-primary">10+</div>
              <div className="text-sm text-muted-foreground">Years Experience</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-primary/50 rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
