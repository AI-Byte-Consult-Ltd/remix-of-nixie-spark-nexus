import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Heart, Car, Home, ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";

const insuranceTypes = [
  {
    icon: Heart,
    title: "Health Insurance",
    description: "Comprehensive health coverage with AI-powered claims processing and personalized wellness programs.",
  },
  {
    icon: Home,
    title: "Property Insurance",
    description: "Smart property protection with real-time risk assessment and instant damage evaluation.",
  },
  {
    icon: Car,
    title: "Auto Insurance",
    description: "AI-driven auto coverage with telematics integration and usage-based premium optimization.",
  },
  {
    icon: Shield,
    title: "Business Insurance",
    description: "Tailored business protection with intelligent risk modeling and automated compliance.",
  },
];

const benefits = [
  "AI-powered risk assessment",
  "Instant claims processing",
  "Personalized coverage recommendations",
  "Blockchain-verified policies",
  "24/7 AI customer support",
  "Predictive fraud detection",
];

const Insurance = () => {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute top-20 left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-primary/20">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">NICS Insurance</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-foreground">
              Smart <span className="text-gradient-gold">Insurance</span> Solutions
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the future of insurance with AI-powered risk assessment, instant claims, and personalized coverage tailored to your needs.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="bg-foreground hover:bg-foreground/90 text-background rounded-full px-8">
                Get a Quote
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Link to="/#contact">
                <Button size="lg" variant="outline" className="rounded-full px-8 border-2">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Insurance Types */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
              Coverage <span className="text-gradient-gold">Options</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive insurance solutions powered by artificial intelligence
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {insuranceTypes.map((type, index) => (
              <Card key={index} className="card-hover bg-card border-border/50 hover:border-primary/30">
                <CardHeader>
                  <div className="w-12 h-12 rounded-2xl bg-gradient-gold flex items-center justify-center mb-4">
                    <type.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg font-semibold">{type.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground">
                    {type.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
                  Why Choose <span className="text-gradient-gold">NICS Insurance</span>
                </h2>
                <p className="text-lg text-muted-foreground">
                  Our intelligent platform revolutionizes insurance with faster claims, better coverage, and lower premiums.
                </p>
              </div>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center space-y-6 bg-card p-12 rounded-3xl border border-border/50 shadow-card">
            <h2 className="text-3xl font-semibold text-foreground">
              Protect What Matters Most
            </h2>
            <p className="text-muted-foreground">
              Get personalized insurance coverage powered by AI technology.
            </p>
            <Link to="/#contact">
              <Button size="lg" className="bg-foreground hover:bg-foreground/90 text-background rounded-full px-8">
                Get Started
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Insurance;
