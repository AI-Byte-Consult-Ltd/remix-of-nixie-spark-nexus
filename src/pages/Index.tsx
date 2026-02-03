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

const Index = () => {
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
