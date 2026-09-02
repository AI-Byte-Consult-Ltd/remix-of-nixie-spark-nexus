import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HomeMarketTicker from "@/components/HomeMarketTicker";
import NicsEcosystemPreview from "@/components/NicsEcosystemPreview";
import About from "@/components/About";
import OurEcosystem from "@/components/OurEcosystem";
import OurWorkInAction from "@/components/OurWorkInAction";
import NicsTraderPlans from "@/components/NicsTraderPlans";
import VerifiedTrackRecord from "@/components/VerifiedTrackRecord";
import Team from "@/components/Team";
import Contact from "@/components/Contact";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import AIChatWidget from "@/components/AIChatWidget";
import SEO from "@/components/SEO";
import { useLanguage, getLocalizedSeoMeta } from "@/contexts/LanguageContext";

const Index = () => {
  const { t, language } = useLanguage();
  const localizedSeo = getLocalizedSeoMeta("/", language);
  const seoProps = {
    title: t("seo.home.title"),
    description: t("seo.home.description"),
    ...localizedSeo,
    ogImage: "https://aibyteconsult.com/android-chrome-512x512.png",
    imageAlt: "AI Byte Consult and the NICS AI Ecosystem",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": "https://aibyteconsult.com/#organization",
          name: "AI Byte Consult Ltd",
          url: "https://aibyteconsult.com/",
          logo: "https://aibyteconsult.com/android-chrome-512x512.png",
          email: "info@aibyteconsult.com",
          telephone: "+359988899109",
          foundingDate: "2011",
          areaServed: "Worldwide",
        },
        {
          "@type": "WebSite",
          "@id": "https://aibyteconsult.com/#website",
          url: "https://aibyteconsult.com/",
          name: "AI Byte Consult",
          publisher: { "@id": "https://aibyteconsult.com/#organization" },
        },
      ],
    },
  };

  return (
    <>
      <SEO {...seoProps} />
      <main className="min-h-screen">
        <Header />
        <Hero />
        <HomeMarketTicker />
        <VerifiedTrackRecord />
        <NicsEcosystemPreview />
        <About />
        <OurEcosystem />
        <OurWorkInAction />
        <NicsTraderPlans />
        <Team />
        <Contact />
        <Newsletter />
        <Footer />
        <AIChatWidget />
      </main>
    </>
  );
};

export default Index;
