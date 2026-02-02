import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import heroImage from "@/assets/hero-microscheme.jpg";

const Hero = () => {
  const scrollToEcosystem = () => {
    document.getElementById("ecosystem")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-hero">
      {/* Subtle decorative elements */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-64 h-64 bg-primary/3 rounded-full blur-3xl" />
      
      <div className="container relative z-10 mx-auto px-6 md:px-12 lg:px-20 pt-28 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left side - Content */}
          <div className="animate-fade-in space-y-8 order-2 lg:order-1">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-primary/20">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-sm font-medium text-primary">A Global AI Technology Company</span>
            </div>

            {/* Main headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.1] text-foreground">
              Intelligent Systems{" "}
              <span className="text-gradient-gold">
                designed and built
              </span>{" "}
              for Business
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg">
              AI Byte Consult Ltd specializes in AI development and business automation. 
              We create scalable solutions for enterprises, hospitality, healthcare, 
              logistics, and research.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button
                size="lg"
                onClick={scrollToEcosystem}
                className="group bg-foreground hover:bg-foreground/90 text-background font-medium text-base px-8 py-6 rounded-full transition-all duration-300"
              >
                Explore Ecosystem
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                className="font-medium text-base px-8 py-6 rounded-full border-2 border-border hover:border-foreground/20 hover:bg-muted/50 transition-all duration-300"
              >
                Contact Us
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-6 pt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-primary" />
                <span>AI-Powered</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-primary" />
                <span>Blockchain Ready</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-primary" />
                <span>Enterprise Grade</span>
              </div>
            </div>
          </div>

          {/* Right side - Image */}
          <div className="relative animate-fade-in order-1 lg:order-2" style={{ animationDelay: "200ms" }}>
            {/* Main image container */}
            <div className="relative">
              <img
                src={heroImage}
                alt="AI Technology - Golden Microscheme"
                className="relative w-full h-auto rounded-3xl shadow-hover object-cover aspect-video"
              />

              {/* Floating stats card */}
              <div className="hidden sm:block absolute -bottom-4 -left-4 bg-background p-4 rounded-2xl shadow-card border border-border animate-float">
                <div className="text-2xl font-semibold text-gradient-gold">10+</div>
                <div className="text-sm text-muted-foreground">Years Experience</div>
              </div>

              {/* Floating tech card */}
              <div className="hidden sm:block absolute -top-4 -right-4 bg-background p-4 rounded-2xl shadow-card border border-border animate-float" style={{ animationDelay: "1s" }}>
                <div className="text-2xl font-semibold text-gradient-gold">AI</div>
                <div className="text-sm text-muted-foreground">Powered Solutions</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="hidden md:block absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-muted-foreground/30 rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
