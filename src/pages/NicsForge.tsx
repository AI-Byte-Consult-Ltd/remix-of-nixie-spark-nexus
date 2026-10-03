import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Box, ShoppingBag, ExternalLink, ArrowRight } from "lucide-react";
import SEO from "@/components/SEO";
import { useLanguage } from "@/contexts/LanguageContext";
import { forgeText } from "@/components/forge/forgeI18n";
import ForgeCatalog from "@/components/forge/ForgeCatalog";
import ForgeStudio from "@/components/forge/ForgeStudio";
import ForgeStudioSoon from "@/components/forge/ForgeStudioSoon";
import { STUDIO_ENABLED } from "@/data/forgeCatalog";
import ForgeSocial from "@/components/forge/ForgeSocial";
import ForgeCheckout, { type PendingOrder } from "@/components/forge/ForgeCheckout";

// TODO(Alessandro): swap in the real Alessandro Studio Etsy shop URL — this is a
// placeholder so the button never links to a guessed/wrong shop.
const ETSY_SHOP_URL = "https://www.etsy.com";

const NicsForge = () => {
  const { language } = useLanguage();
  const t = forgeText[language] ?? forgeText.en;
  const [order, setOrder] = useState<PendingOrder | null>(null);

  const seoProps = {
    title: "Alessandro Studio — AI-Designed, 3D-Printed Products",
    description:
      "Alessandro Studio is part of the NICS AI ecosystem: ready-made 3D-printed pieces and a custom AI studio that turns your photo into a 3D model we print and ship to you.",
    canonical: "https://aibyteconsult.com/nics-forge",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Alessandro Studio",
      url: "https://aibyteconsult.com/nics-forge",
      parentOrganization: { "@type": "Organization", name: "AI Byte Consult Ltd." },
    },
  };

  return (
    <>
      <SEO {...seoProps} />
      <main className="min-h-screen bg-background">
        <Header />

        <section className="pt-32 pb-16 relative overflow-hidden">
          <div className="absolute top-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-20 w-64 h-64 bg-primary/3 rounded-full blur-3xl" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-primary/20">
                <Box className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">{t.badge}</span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-foreground">
                <span className="text-gradient-gold">{t.heroHeading}</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">{t.heroSubtitle}</p>
              <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">{t.ecosystemNote}</p>
              <div className="flex flex-wrap gap-4 justify-center pt-2">
                <a href="#studio">
                  <Button size="lg" className="w-full sm:w-auto bg-foreground hover:bg-foreground/90 text-background rounded-full px-8">
                    {t.studioTitle}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </a>
                <a href={ETSY_SHOP_URL} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full px-8 border-2">
                    <ShoppingBag className="mr-2 w-4 h-4" />
                    {t.etsy}
                    <ExternalLink className="ml-2 w-4 h-4" />
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>

        <ForgeCatalog t={t} onOrder={setOrder} />
        {STUDIO_ENABLED ? <ForgeStudio t={t} onOrder={setOrder} /> : <ForgeStudioSoon t={t} />}
        <ForgeSocial t={t} />

        <ForgeCheckout order={order} onClose={() => setOrder(null)} t={t} lang={language} />
        <Footer />
      </main>
    </>
  );
};

export default NicsForge;
