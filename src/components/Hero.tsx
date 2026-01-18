import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import heroImage from "@/assets/hero-microscheme.jpg";

const Hero = () => {
  const scrollToEcosystem = () => {
    document.getElementById("ecosystem")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-background via-background to-muted/30">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />
      
      <div className="container relative z-10 mx-auto px-4 md:px-8 lg:px-16 pt-24 pb-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left side - Content */}
          <div className="animate-fade-in space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">A Global AI Technology Company</span>
            </div>

            {/* Main headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
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
            <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
              AI Byte Consult Ltd specializes in AI development and business automation. 
              We create scalable solutions for enterprises, hospitality, healthcare, 
              logistics, and research — empowering organizations worldwide.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Button
                size="lg"
                onClick={scrollToEcosystem}
                className="group bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base px-8 py-6 rounded-full neon-glow transition-all duration-300"
              >
                Explore Ecosystem
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                className="font-semibold text-base px-8 py-6 rounded-full border-2 border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
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

          {/* Right side - Image */}
          <div className="relative animate-fade-in lg:pl-8" style={{ animationDelay: "200ms" }}>
            {/* Glow effect behind image */}
            <div className="absolute -inset-8 bg-gradient-to-br from-primary/20 via-secondary/15 to-primary/10 blur-3xl opacity-60 rounded-3xl" />
            
            {/* Main image container */}
            <div className="relative">
              <img
                src={heroImage}
                alt="AI Technology - Golden Microscheme"
                className="relative w-full h-auto rounded-3xl shadow-2xl object-cover aspect-[4/5] border border-primary/10"
              />
              
              {/* Subtle overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent rounded-3xl" />

              {/* Floating stats card */}
              <div className="absolute -bottom-4 -left-4 glass-card p-4 rounded-xl border border-primary/20 animate-float shadow-lg">
                <div className="text-2xl font-bold text-primary">10+</div>
                <div className="text-sm text-muted-foreground">Years Experience</div>
              </div>

              {/* Floating tech card */}
              <div className="absolute -top-4 -right-4 glass-card p-4 rounded-xl border border-secondary/20 animate-float shadow-lg" style={{ animationDelay: "1s" }}>
                <div className="text-2xl font-bold text-secondary">AI</div>
                <div className="text-sm text-muted-foreground">Powered Solutions</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-primary/50 rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
