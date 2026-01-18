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

      <div className="container relative z-10 mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div className="animate-fade-in space-y-8 max-w-xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">A Global AI Technology Company</span>
            </div>

            {/* Main headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
              Intelligent Systems{" "}
              <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                designed
              </span>{" "}
              <span className="bg-gradient-to-r from-secondary via-primary to-secondary bg-clip-text text-transparent">
                and
              </span>{" "}
              <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                built
              </span>{" "}
              for Business
            </h1>

            {/* Description */}
            <p className="text-lg text-muted-foreground leading-relaxed">
              AI Byte Consult Ltd specializes in AI development and business automation. 
              We create scalable solutions for enterprises, hospitality, healthcare, 
              logistics, and research — empowering organizations worldwide through innovation.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Button
                size="lg"
                onClick={scrollToEcosystem}
                className="group bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg px-8 py-6 neon-glow transition-all duration-300"
              >
                Explore Ecosystem
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                className="font-semibold text-lg px-8 py-6 border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
              >
                Contact Us
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-6 pt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                <span>AI-Powered</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                <span>Blockchain Ready</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                <span>Enterprise Grade</span>
              </div>
            </div>
          </div>

          {/* Right side - Banner Image */}
          <div className="relative animate-fade-in" style={{ animationDelay: "200ms" }}>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              {/* Glow effect behind image */}
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/30 via-secondary/30 to-primary/30 blur-3xl opacity-50" />
              
              {/* Main image */}
              <img
                src={heroImage}
                alt="AI Technology - Golden Microscheme"
                className="relative w-full h-auto rounded-2xl border border-primary/20 object-cover aspect-square"
              />
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent rounded-2xl" />
            </div>

            {/* Floating stats card */}
            <div className="absolute -bottom-4 -left-4 glass-card p-4 rounded-xl border border-primary/20 animate-float">
              <div className="text-2xl font-bold text-primary">10+</div>
              <div className="text-sm text-muted-foreground">Years Experience</div>
            </div>

            {/* Floating tech card */}
            <div className="absolute -top-4 -right-4 glass-card p-4 rounded-xl border border-secondary/20 animate-float" style={{ animationDelay: "1s" }}>
              <div className="text-2xl font-bold text-secondary">AI</div>
              <div className="text-sm text-muted-foreground">Powered Solutions</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-primary rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
