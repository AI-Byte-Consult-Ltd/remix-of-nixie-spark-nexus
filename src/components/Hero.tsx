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
      
      <div className="container relative z-10 mx-auto px-6 md:px-12 lg:px-20 pt-28 pb-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left side - Content */}
          <div className="animate-fade-in space-y-6 lg:space-y-8 order-2 lg:order-1">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">A Global AI Technology Company</span>
            </div>

            {/* Main headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
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
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-lg">
              AI Byte Consult Ltd specializes in AI development and business automation. 
              We create scalable solutions for enterprises, hospitality, healthcare, 
              logistics, and research — empowering organizations worldwide.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
              <Button
                size="lg"
                onClick={scrollToEcosystem}
                className="group bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base px-6 sm:px-8 py-5 sm:py-6 rounded-full neon-glow transition-all duration-300"
              >
                Explore Ecosystem
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                className="font-semibold text-base px-6 sm:px-8 py-5 sm:py-6 rounded-full border-2 border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
              >
                Contact Us
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4 sm:gap-6 pt-2 sm:pt-4 text-sm text-muted-foreground">
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
          <div className="relative animate-fade-in order-1 lg:order-2" style={{ animationDelay: "200ms" }}>
            {/* Glow effect behind image */}
            <div className="absolute -inset-4 lg:-inset-6 bg-gradient-to-br from-primary/20 via-secondary/15 to-primary/10 blur-3xl opacity-60 rounded-2xl lg:rounded-3xl" />
            
            {/* Main image container */}
            <div className="relative">
              <img
                src={heroImage}
                alt="AI Technology - Golden Microscheme"
                className="relative w-full h-auto rounded-2xl lg:rounded-3xl shadow-2xl object-cover aspect-video border border-primary/10"
              />
              
              {/* Subtle overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent rounded-2xl lg:rounded-3xl" />

              {/* Floating stats card - hidden on mobile */}
              <div className="hidden sm:block absolute -bottom-3 -left-3 lg:-bottom-4 lg:-left-4 glass-card p-3 lg:p-4 rounded-xl border border-primary/20 animate-float shadow-lg">
                <div className="text-xl lg:text-2xl font-bold text-primary">10+</div>
                <div className="text-xs lg:text-sm text-muted-foreground">Years Experience</div>
              </div>

              {/* Floating tech card - hidden on mobile */}
              <div className="hidden sm:block absolute -top-3 -right-3 lg:-top-4 lg:-right-4 glass-card p-3 lg:p-4 rounded-xl border border-secondary/20 animate-float shadow-lg" style={{ animationDelay: "1s" }}>
                <div className="text-xl lg:text-2xl font-bold text-secondary">AI</div>
                <div className="text-xs lg:text-sm text-muted-foreground">Powered Solutions</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator - hidden on mobile */}
      <div className="hidden md:block absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-primary/50 rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
