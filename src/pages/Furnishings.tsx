import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sofa, Home, Palette, Box, ArrowRight, Check, Eye } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: Home,
    title: "3D House Projects",
    description: "Complete 3D visualization of houses and apartments with detailed architectural rendering.",
  },
  {
    icon: Sofa,
    title: "Virtual Furnishing",
    description: "Furnish your space virtually with our extensive catalog of furniture and decor options.",
  },
  {
    icon: Palette,
    title: "Interior Design",
    description: "AI-powered interior design suggestions based on your style preferences and space requirements.",
  },
  {
    icon: Eye,
    title: "Virtual Tours",
    description: "Immersive 360° virtual tours of your furnished spaces before any purchase is made.",
  },
];

const process = [
  {
    step: "01",
    title: "Upload Floor Plan",
    description: "Share your floor plan or property details to get started.",
  },
  {
    step: "02",
    title: "3D Visualization",
    description: "We create a detailed 3D model of your space.",
  },
  {
    step: "03",
    title: "Virtual Furnishing",
    description: "Explore furniture options and place them virtually.",
  },
  {
    step: "04",
    title: "Final Design",
    description: "Get your complete design package and shopping list.",
  },
];

const benefits = [
  "Photorealistic 3D renderings",
  "Extensive furniture catalog",
  "Real-time design changes",
  "Budget-friendly recommendations",
  "Professional designer consultation",
  "Complete shopping lists",
];

const Furnishings = () => {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute top-40 left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-primary/20">
              <Box className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">NICS Furnishings</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-foreground">
              3D Interior <span className="text-gradient-gold">Design</span> Solutions
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Visualize your dream home with our 3D house projects and virtual furnishing platform. Design and furnish your space before making any decisions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="bg-foreground hover:bg-foreground/90 text-background rounded-full px-8">
                Start Your Project
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Link to="/#contact">
                <Button size="lg" variant="outline" className="rounded-full px-8 border-2">
                  View Portfolio
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
              What We <span className="text-gradient-gold">Offer</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Complete 3D visualization and virtual furnishing solutions
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

      {/* Process Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
              How It <span className="text-gradient-gold">Works</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Simple steps to visualize and furnish your dream space
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {process.map((item, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="text-5xl font-bold text-gradient-gold">{item.step}</div>
                <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
                  Why Choose <span className="text-gradient-gold">NICS Furnishings</span>
                </h2>
                <p className="text-lg text-muted-foreground">
                  Experience your space before you furnish it with our cutting-edge 3D visualization technology.
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
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center space-y-6 bg-card p-12 rounded-3xl border border-border/50 shadow-card">
            <h2 className="text-3xl font-semibold text-foreground">
              Ready to Visualize Your Dream Space?
            </h2>
            <p className="text-muted-foreground">
              Start your 3D interior design project today and see your vision come to life.
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

export default Furnishings;
