import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Languages, FileCheck, Scale, Globe, ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  {
    icon: Languages,
    title: "Document Translation",
    description: "AI-powered translation services for legal, medical, and business documents with certified accuracy.",
  },
  {
    icon: FileCheck,
    title: "Legalisation Services",
    description: "Apostille and authentication services for international document recognition and compliance.",
  },
  {
    icon: Scale,
    title: "Legal Translation",
    description: "Specialized translation for contracts, court documents, and legal correspondence.",
  },
  {
    icon: Globe,
    title: "Multilingual Support",
    description: "50+ languages supported with native-speaking experts and AI-enhanced quality assurance.",
  },
];

const languages = [
  "English", "German", "French", "Arabic", "Chinese", "Spanish",
  "Russian", "Portuguese", "Japanese", "Korean", "Italian", "Dutch"
];

const benefits = [
  "AI-enhanced translation accuracy",
  "Certified document processing",
  "Fast turnaround times",
  "Apostille and notarization",
  "Industry-specific expertise",
  "Secure document handling",
];

const Translation = () => {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-primary/20">
              <Languages className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">NICS Translation & Legalisation</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-foreground">
              Professional <span className="text-gradient-gold">Translation</span> Services
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Certified translation and legalisation services powered by AI technology and expert linguists for global business needs.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="bg-foreground hover:bg-foreground/90 text-background rounded-full px-8">
                Get a Quote
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Link to="/#contact">
                <Button size="lg" variant="outline" className="rounded-full px-8 border-2">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
              Our <span className="text-gradient-gold">Services</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive translation and legalisation solutions for all your needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {services.map((service, index) => (
              <Card key={index} className="card-hover bg-card border-border/50 hover:border-primary/30">
                <CardHeader>
                  <div className="w-12 h-12 rounded-2xl bg-gradient-gold flex items-center justify-center mb-4">
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg font-semibold">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Languages Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
              50+ <span className="text-gradient-gold">Languages</span> Supported
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {languages.map((lang, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-accent text-accent-foreground rounded-full text-sm font-medium"
                >
                  {lang}
                </span>
              ))}
              <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                + 40 more
              </span>
            </div>
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
                  Why Choose <span className="text-gradient-gold">NICS Translation</span>
                </h2>
                <p className="text-lg text-muted-foreground">
                  Combining AI technology with human expertise for the highest quality translations.
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
              Need a Translation?
            </h2>
            <p className="text-muted-foreground">
              Get a free quote for your translation and legalisation needs today.
            </p>
            <Link to="/#contact">
              <Button size="lg" className="bg-foreground hover:bg-foreground/90 text-background rounded-full px-8">
                Request Quote
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

export default Translation;
