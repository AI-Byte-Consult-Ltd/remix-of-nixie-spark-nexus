import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Box,
  Wand2,
  MessageSquare,
  Image as ImageIcon,
  CreditCard,
  Truck,
  ShoppingBag,
  ExternalLink,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";

// TODO(Alessandro): swap in the real NICS Forge Etsy shop URL — this is a
// placeholder so the button never links to a guessed/wrong shop.
const ETSY_SHOP_URL = "https://www.etsy.com";

const steps = [
  {
    icon: MessageSquare,
    title: "Describe it",
    text: "Type what you want, or just say it out loud — no design software needed.",
  },
  {
    icon: Wand2,
    title: "AI builds the brief",
    text: "Our AI turns your request into a proper design brief and a few concept directions.",
  },
  {
    icon: ImageIcon,
    title: "Pick your favorite",
    text: "You get several image concepts back and choose the one you actually want.",
  },
  {
    icon: CreditCard,
    title: "Pay",
    text: "Confirm and pay for the design you picked.",
  },
  {
    icon: Box,
    title: "AI models it, we print it",
    text: "Our AI turns the chosen concept into a real 3D model and sends it straight to our printers.",
  },
  {
    icon: Truck,
    title: "It ships to you",
    text: "The finished, physical piece is packed and shipped to the address you give us.",
  },
];

const NicsForge = () => {
  const seoProps = {
    title: "NICS Forge — AI-Designed, 3D-Printed Products",
    description:
      "NICS Forge is AI Byte Consult's 3D printing line — real printed products today on Etsy, with an AI-generated custom design and print-on-demand service in development.",
    canonical: "https://aibyteconsult.com/nics-forge",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "NICS Forge",
      url: "https://aibyteconsult.com/nics-forge",
      parentOrganization: { "@type": "Organization", name: "AI Byte Consult Ltd." },
    },
  };

  return (
    <>
      <SEO {...seoProps} />
      <main className="min-h-screen bg-background">
        <Header />

        {/* Hero */}
        <section className="pt-32 pb-16 relative overflow-hidden">
          <div className="absolute top-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-20 w-64 h-64 bg-primary/3 rounded-full blur-3xl" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-primary/20">
                <Box className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">NICS Forge</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-foreground">
                From idea to <span className="text-gradient-gold">object</span>
              </h1>

              <p className="text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
                AI Byte Consult's 3D printing line — real products, printed in-house, designed with AI.
              </p>

              <div className="flex flex-wrap gap-4 justify-center pt-2">
                <a href={ETSY_SHOP_URL} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="w-full sm:w-auto bg-foreground hover:bg-foreground/90 text-background rounded-full px-8">
                    <ShoppingBag className="mr-2 w-4 h-4" />
                    Shop on Etsy
                    <ExternalLink className="ml-2 w-4 h-4" />
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Live today */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto space-y-6">
              <h2 className="text-3xl md:text-4xl font-semibold text-foreground text-center">
                Already <span className="text-gradient-gold">real</span>
              </h2>
              <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                <p>
                  NICS Forge isn't a concept — it's our own 3D printers, running products we've
                  already designed and sold. The current lineup lives on our Etsy shop, and it grows
                  as we print new pieces.
                </p>
                <p>
                  This page is the second part: an AI-driven design service that turns a description
                  into a printed, shipped object. It's not live yet — here's exactly how it will work.
                </p>
              </div>
              <div className="flex justify-center pt-2">
                <a href={ETSY_SHOP_URL} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="outline" className="rounded-full px-8 border-2">
                    Browse the current lineup
                    <ExternalLink className="ml-2 w-4 h-4" />
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Coming next: AI custom prints */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center space-y-4 mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-primary/20">
                  <Wand2 className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Coming next — not live yet</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
                  Custom AI-designed prints
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Describe what you want by text or by voice, and let our AI take it from a concept
                  image all the way to a shipped, physical object.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {steps.map((s, i) => (
                  <Card key={s.title} className="bg-card border-border/50">
                    <CardContent className="pt-6 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-gold flex items-center justify-center shrink-0">
                          <s.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-sm font-semibold uppercase tracking-wide text-primary">
                          {i + 1}. {s.title}
                        </div>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">{s.text}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <p className="text-sm text-muted-foreground text-center max-w-2xl mx-auto pt-10 leading-relaxed">
                Checkout for this feature runs through Etsy today. Direct in-page checkout, including
                Revolut, is planned for a future update — it isn't wired up yet, and we won't collect
                any payment for it until it is.
              </p>
            </div>
          </div>
        </section>

        {/* Back */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center space-y-6 bg-card p-12 rounded-3xl border border-border/50 shadow-card">
              <h2 className="text-3xl font-semibold text-foreground">
                More from AI Byte Consult
              </h2>
              <p className="text-muted-foreground">
                NICS Forge is one part of a wider AI ecosystem — trading, real estate, and more.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/#projects">
                  <Button size="lg" className="w-full sm:w-auto bg-foreground hover:bg-foreground/90 text-background rounded-full px-8">
                    <ArrowLeft className="mr-2 w-4 h-4" />
                    Back to Our Work
                  </Button>
                </Link>
                <Link to="/nics-ecosystem">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full px-8 border-2">
                    Explore the Ecosystem
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default NicsForge;
