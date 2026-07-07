import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HomeMarketTicker from "@/components/HomeMarketTicker";
import NicsEcosystemPreview from "@/components/NicsEcosystemPreview";
import About from "@/components/About";
import Ecosystem from "@/components/Ecosystem";
import OurWorkInAction from "@/components/OurWorkInAction";
import SCIProducts from "@/components/SCIProducts";
import Testimonials from "@/components/Testimonials";
import Team from "@/components/Team";
import Contact from "@/components/Contact";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import AIChatWidget from "@/components/AIChatWidget";
import SEO from "@/components/SEO";

const Index = () => {
  const seoProps = {
    title: "AI Byte Consult — European AI Consulting",
    description: "European AI consulting company building intelligent AI systems, agents, Web3 platforms and blockchain solutions for real-world business and research use cases.",
    canonical: "https://aibyteconsult.com/",
    ogImage: "https://aibyteconsult.com/og-home.jpg",
  };

  return (
    <>
      <SEO {...seoProps} />
      <main className="min-h-screen">
      <Header />
      <Hero />
      <HomeMarketTicker />
      <NicsEcosystemPreview />
      <About />
      <Ecosystem />
      <OurWorkInAction />
      <SCIProducts />
      <Testimonials />
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
