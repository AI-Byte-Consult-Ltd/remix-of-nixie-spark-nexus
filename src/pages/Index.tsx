import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Ecosystem from "@/components/Ecosystem";
import Projects from "@/components/Projects";
import SCIProducts from "@/components/SCIProducts";
import Testimonials from "@/components/Testimonials";
import Team from "@/components/Team";
import Contact from "@/components/Contact";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import AIChatWidget from "@/components/AIChatWidget";
import useSEO from "@/hooks/useSEO";

const Index = () => {
  useSEO({
    title: "AI Byte Consult — European AI Consulting & Intelligent Systems",
    description: "European AI consulting company building intelligent AI systems, agents, Web3 platforms and blockchain solutions for real-world business and research use cases.",
    canonical: "https://aibyteconsult.com/",
    ogImage: "https://aibyteconsult.com/og-home.jpg",
  });

  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <About />
      <Ecosystem />
      <Projects />
      <SCIProducts />
      <Testimonials />
      <Team />
      <Contact />
      <Newsletter />
      <Footer />
      <AIChatWidget />
    </main>
  );
};

export default Index;
