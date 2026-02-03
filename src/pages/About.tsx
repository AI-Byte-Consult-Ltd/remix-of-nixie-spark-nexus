import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Building2, 
  Bot, 
  Briefcase, 
  Languages, 
  Scale, 
  Shield, 
  Home, 
  Palette, 
  Target, 
  Eye, 
  Heart,
  Globe,
  Users,
  Award,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import { Link } from "react-router-dom";

const businessDivisions = [
  {
    icon: Bot,
    title: "AI Development",
    description: "Cutting-edge artificial intelligence solutions including machine learning, natural language processing, computer vision, and intelligent automation systems for enterprise clients.",
  },
  {
    icon: Briefcase,
    title: "Business Automation",
    description: "End-to-end workflow automation, CRM integration, process optimization, and digital transformation consulting to streamline operations and boost productivity.",
  },
  {
    icon: Building2,
    title: "NICS Real Estate",
    description: "AI-powered property management, valuation services, investment analytics, and blockchain-secured transactions for residential and commercial real estate.",
    link: "/estate",
  },
  {
    icon: Languages,
    title: "NICS Translation & Legalisation",
    description: "Professional certified translation services in 50+ languages, document legalisation, apostille services, and notarized translations for official use.",
    link: "/translation",
  },
  {
    icon: Scale,
    title: "Law Consulting",
    description: "Corporate legal advisory, contract drafting and review, intellectual property protection, compliance consulting, and international business law expertise.",
  },
  {
    icon: Shield,
    title: "NICS Insurance",
    description: "Comprehensive insurance solutions including property, liability, health, and business insurance with AI-driven risk assessment and claims processing.",
    link: "/insurance",
  },
  {
    icon: Home,
    title: "Company & Trade Representative Registration",
    description: "Full-service business registration, trade representative setup, corporate structuring, and ongoing compliance management across multiple jurisdictions.",
  },
  {
    icon: Palette,
    title: "NICS Furnishings & 3D Design",
    description: "Innovative 3D visualization of houses and apartments, interior design projects, virtual staging, and complete furnishing solutions from concept to delivery.",
    link: "/furnishings",
  },
];

const companyValues = [
  {
    icon: Target,
    title: "Mission",
    description: "To empower businesses worldwide with innovative technology solutions and comprehensive professional services that drive growth, efficiency, and success.",
  },
  {
    icon: Eye,
    title: "Vision",
    description: "To become the leading multi-sector technology and consulting conglomerate, recognized globally for excellence, innovation, and client-centric solutions.",
  },
  {
    icon: Heart,
    title: "Values",
    description: "Integrity, innovation, excellence, and commitment to our clients' success guide every decision we make and every service we deliver.",
  },
];

const companyStats = [
  { value: "2011", label: "Founded" },
  { value: "8+", label: "Business Divisions" },
  { value: "50+", label: "Countries Served" },
  { value: "500+", label: "Projects Delivered" },
];

const milestones = [
  { year: "2011", event: "AI Byte Consult Ltd founded in the United Kingdom" },
  { year: "2013", event: "Expanded into business automation and consulting services" },
  { year: "2015", event: "Launched NICS Real Estate division" },
  { year: "2017", event: "Established translation and legalisation services" },
  { year: "2019", event: "Introduced AI-powered insurance solutions" },
  { year: "2021", event: "Launched 3D design and furnishings division" },
  { year: "2023", event: "Expanded law consulting and company registration services" },
  { year: "2024", event: "Integrated advanced AI across all business divisions" },
];

const About = () => {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-primary/3 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-primary/20">
              <Globe className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">About AI Byte Consult Ltd</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-foreground">
              One Company.{" "}
              <span className="text-gradient-gold">Infinite Possibilities.</span>
            </h1>

            <p className="text-xl md:text-2xl font-medium text-primary italic">
              "Empowering Tomorrow, Today"
            </p>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              AI Byte Consult Ltd is a diversified holding company headquartered in the United Kingdom, 
              operating across multiple industries with a unified mission: to deliver excellence through 
              innovation, technology, and unwavering commitment to our clients.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {companyStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-semibold text-gradient-gold mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
                  Who We <span className="text-gradient-gold">Are</span>
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Founded in 2011, AI Byte Consult Ltd has grown from a specialized AI development 
                    firm into a comprehensive multi-sector conglomerate serving clients across more 
                    than 50 countries worldwide.
                  </p>
                  <p>
                    Our unique approach combines cutting-edge technology with traditional business 
                    expertise, allowing us to offer integrated solutions that address the full 
                    spectrum of our clients' needs — from AI-powered automation to real estate 
                    investment, from legal consulting to creative 3D design.
                  </p>
                  <p>
                    Under the NICS (Next-generation Intelligent Corporate Solutions) umbrella, 
                    our specialized divisions work synergistically to deliver comprehensive 
                    solutions that drive business transformation and sustainable growth.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="bg-muted/50 p-6 rounded-2xl border border-border/50">
                    <Users className="w-8 h-8 text-primary mb-3" />
                    <h4 className="font-semibold text-foreground mb-1">Expert Team</h4>
                    <p className="text-sm text-muted-foreground">Industry professionals with decades of combined experience</p>
                  </div>
                  <div className="bg-muted/50 p-6 rounded-2xl border border-border/50">
                    <Award className="w-8 h-8 text-primary mb-3" />
                    <h4 className="font-semibold text-foreground mb-1">Proven Track Record</h4>
                    <p className="text-sm text-muted-foreground">500+ successful projects across all divisions</p>
                  </div>
                </div>
                <div className="space-y-4 mt-8">
                  <div className="bg-muted/50 p-6 rounded-2xl border border-border/50">
                    <Globe className="w-8 h-8 text-primary mb-3" />
                    <h4 className="font-semibold text-foreground mb-1">Global Presence</h4>
                    <p className="text-sm text-muted-foreground">Serving clients in 50+ countries worldwide</p>
                  </div>
                  <div className="bg-muted/50 p-6 rounded-2xl border border-border/50">
                    <Bot className="w-8 h-8 text-primary mb-3" />
                    <h4 className="font-semibold text-foreground mb-1">AI-First Approach</h4>
                    <p className="text-sm text-muted-foreground">Technology integration across all services</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
              Our <span className="text-gradient-gold">Purpose</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Guided by clear principles that define who we are and how we serve our clients
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {companyValues.map((value, index) => (
              <Card key={index} className="card-hover bg-card border-border/50 text-center">
                <CardHeader>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-gold flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-semibold">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Business Divisions */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
              Our <span className="text-gradient-gold">Business Divisions</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A comprehensive ecosystem of specialized services working together to serve your needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {businessDivisions.map((division, index) => (
              <Card 
                key={index} 
                className="card-hover bg-card border-border/50 hover:border-primary/30 group"
              >
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-xl bg-gradient-gold flex items-center justify-center mb-4">
                    <division.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
                    {division.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {division.description}
                  </p>
                  {division.link && (
                    <Link 
                      to={division.link}
                      className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                    >
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Company Timeline */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
              Our <span className="text-gradient-gold">Journey</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Key milestones in our path to becoming a global multi-sector leader
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-border md:-translate-x-0.5" />
              
              {milestones.map((milestone, index) => (
                <div 
                  key={index}
                  className={`relative flex items-center gap-6 mb-8 ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Dot */}
                  <div className="absolute left-4 md:left-1/2 w-3 h-3 bg-primary rounded-full md:-translate-x-1.5 z-10" />
                  
                  {/* Content */}
                  <div className={`ml-12 md:ml-0 md:w-1/2 ${
                    index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"
                  }`}>
                    <div className="bg-card p-4 rounded-xl border border-border/50 shadow-sm">
                      <div className="text-lg font-semibold text-gradient-gold mb-1">
                        {milestone.year}
                      </div>
                      <p className="text-muted-foreground text-sm">{milestone.event}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 space-y-4">
              <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
                Why Choose <span className="text-gradient-gold">AI Byte Consult</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                "Integrated multi-sector solutions under one roof",
                "AI-powered technology across all services",
                "14+ years of proven industry experience",
                "Global reach with local expertise",
                "Dedicated account management",
                "Transparent pricing and processes",
                "Cutting-edge security and compliance",
                "24/7 customer support availability",
              ].map((benefit, index) => (
                <div key={index} className="flex items-start gap-3 p-4 rounded-xl bg-muted/30 border border-border/50">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center space-y-6 bg-card p-12 rounded-3xl border border-border/50 shadow-card">
            <h2 className="text-3xl font-semibold text-foreground">
              Ready to Work With Us?
            </h2>
            <p className="text-muted-foreground">
              Discover how AI Byte Consult can help transform your business with our comprehensive solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/#contact">
                <Button size="lg" className="bg-foreground hover:bg-foreground/90 text-background rounded-full px-8">
                  Get in Touch
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link to="/#ecosystem">
                <Button size="lg" variant="outline" className="rounded-full px-8 border-2">
                  Explore Services
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default About;
