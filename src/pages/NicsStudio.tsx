import { Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import StudioEditor from "@/features/studio/StudioEditor";
import { studioStrings } from "@/features/studio/strings";

const NicsStudio = () => {
  const { language } = useLanguage();
  const s = studioStrings(language);

  return (
    <>
      <SEO
        title="NICS Studio — Online Video Editor for Shorts and YouTube"
        description="Edit your video yourself in the browser: cut and split clips, add text, music, filters and fades, and export a 9:16 or 16:9 MP4. Your files stay on your device."
        canonical="https://aibyteconsult.com/nics-studio"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "NICS Studio",
          applicationCategory: "MultimediaApplication",
          operatingSystem: "Web browser",
          url: "https://aibyteconsult.com/nics-studio",
          provider: { "@type": "Organization", name: "AI Byte Consult Ltd." },
        }}
      />
      <main className="min-h-screen bg-background">
        <Header />
        <section className="pt-28 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl md:text-4xl font-semibold text-foreground">
                    <span className="text-gradient-gold">{s.title}</span>
                  </h1>
                  <span className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                    {s.badge}
                  </span>
                </div>
                <p className="text-lg text-muted-foreground max-w-3xl">{s.subtitle}</p>
                <p className="text-sm text-muted-foreground max-w-3xl flex gap-2">
                  <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
                  <span>{s.devNote}</span>
                </p>
              </div>
              <StudioEditor lang={language} />
              <div>
                <Link to="/nics-video">
                  <Button variant="ghost" className="rounded-full">
                    <ArrowLeft className="mr-2 w-4 h-4" />
                    NICS Video
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

export default NicsStudio;
