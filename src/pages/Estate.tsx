import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, MapPin, TrendingUp, Shield, ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: Building2,
    title: "Property Management",
    description: "AI-powered property valuation and management solutions for residential and commercial real estate.",
  },
  {
    icon: MapPin,
    title: "Location Intelligence",
    description: "Advanced analytics for optimal property locations based on market trends and demographic data.",
  },
  {
    icon: TrendingUp,
    title: "Market Analysis",
    description: "Real-time market insights and predictive analytics for investment decision-making.",
  },
  {
    icon: Shield,
    title: "Secure Transactions",
    description: "Blockchain-verified property transactions ensuring transparency and security.",
  },
];

const benefits = [
  "AI-driven property valuations",
  "Smart contract-based transactions",
  "Virtual property tours with 3D visualization",
  "Automated document processing",
  "Market trend predictions",
  "Investment portfolio optimization",
];

const Estate = () => {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-primary/20">
              <Building2 className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">NICS Real Estate</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-foreground">
              Intelligent <span className="text-gradient-gold">Real Estate</span> Solutions
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Transform your property business with AI-powered valuations, blockchain-secured transactions, and smart market analytics.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="bg-foreground hover:bg-foreground/90 text-background rounded-full px-8">
                Get Started
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Link to="/#contact">
                <Button size="lg" variant="outline" className="rounded-full px-8 border-2">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
              Powerful <span className="text-gradient-gold">Features</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to revolutionize your real estate operations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="card-hover bg-card border-border/50 hover:border-primary/30">
                <CardHeader>
                  <div className="w-12 h-12 rounded-2xl bg-gradient-gold flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg font-semibold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground">
                    {feature.description}
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
                  Why Choose <span className="text-gradient-gold">NICS Real Estate</span>
                </h2>
                <p className="text-lg text-muted-foreground">
                  Our AI-powered platform combines cutting-edge technology with deep market expertise to deliver exceptional results.
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
              Ready to Transform Your Real Estate Business?
            </h2>
            <p className="text-muted-foreground">
              Join leading property companies using NICS Real Estate solutions.
            </p>
            <Link to="/#contact">
              <Button size="lg" className="bg-foreground hover:bg-foreground/90 text-background rounded-full px-8">
                Get in Touch
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

export default Estate;
