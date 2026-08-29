import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Music2, PenLine, Sparkles, ExternalLink, ArrowRight, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";

const SPOTIFY_URL = "https://open.spotify.com/album/1Sj5W4WdKgCUOw0ziLSrDX";
const AMUSE_URL = "https://share.amuse.io/album/aleksandr-tochilov-just-live";

const credits = [
  {
    icon: PenLine,
    label: "Lyrics",
    value: "Written entirely by Aleksandr Tochilov.",
  },
  {
    icon: Sparkles,
    label: "Concept & visual",
    value: "Musical idea and visual direction by Aleksandr Tochilov.",
  },
  {
    icon: Music2,
    label: "Production",
    value: "Technical execution — composing, producing and engineering the track — by NICS Multimedia.",
  },
];

const NicsMultimedia = () => {
  const seoProps = {
    title: "NICS Multimedia — Original Music by Aleksandr Tochilov | AI Byte Consult",
    description:
      "NICS Multimedia is AI Byte Consult's in-house music-production system. \"Just Live\" is its first release — lyrics, musical idea and visual direction entirely by Aleksandr Tochilov, technical production by NICS Multimedia.",
    canonical: "https://aibyteconsult.com/nics-multimedia",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "MusicAlbum",
      name: "Just Live",
      byArtist: { "@type": "MusicGroup", name: "Aleksandr Tochilov" },
      url: "https://aibyteconsult.com/nics-multimedia",
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
                <Music2 className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">NICS Multimedia</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-foreground">
                <span className="text-gradient-gold">Just Live</span>
              </h1>

              <p className="text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
                The first release from NICS Multimedia — original music by Aleksandr Tochilov.
              </p>
            </div>

            <div className="max-w-xl mx-auto mt-10">
              <div className="bg-card rounded-3xl border border-border/50 shadow-card p-3">
                <iframe
                  title="Just Live — Spotify player"
                  data-testid="embed-iframe"
                  style={{ borderRadius: 16 }}
                  src="https://open.spotify.com/embed/album/1Sj5W4WdKgCUOw0ziLSrDX?utm_source=generator&si=7b1b89c7df784bf8"
                  width="100%"
                  height="152"
                  frameBorder="0"
                  allowFullScreen
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                <a href={SPOTIFY_URL} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="w-full sm:w-auto bg-foreground hover:bg-foreground/90 text-background rounded-full px-8">
                    Listen on Spotify
                    <ExternalLink className="ml-2 w-4 h-4" />
                  </Button>
                </a>
                <a href={AMUSE_URL} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full px-8 border-2">
                    Listen on Amuse
                    <ExternalLink className="ml-2 w-4 h-4" />
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* The Story */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto space-y-6">
              <h2 className="text-3xl md:text-4xl font-semibold text-foreground text-center">
                The <span className="text-gradient-gold">story</span>
              </h2>
              <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                <p>
                  NICS Multimedia is a music-creation system we built inside the NICS AI ecosystem —
                  not a product we sell, but a creative space the team uses for itself. It's the same
                  approach behind everything else we build: apply the technology to something real,
                  and see what it can actually do.
                </p>
                <p>
                  "Just Live" is its first release. The lyrics, the musical idea and the visual
                  direction are entirely Aleksandr Tochilov's. The technical side — composing,
                  producing and engineering the track — was handled by NICS Multimedia.
                </p>
                <p>
                  This is a first step, not a finished catalog. More releases will follow as the
                  system develops, and we'll keep this page honest about how each one was made.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Credits */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-semibold text-foreground text-center mb-12">
                Credits
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {credits.map((c) => (
                  <Card key={c.label} className="bg-card border-border/50">
                    <CardContent className="pt-6 space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-gold flex items-center justify-center">
                        <c.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-sm font-semibold uppercase tracking-wide text-primary">
                        {c.label}
                      </div>
                      <p className="text-muted-foreground leading-relaxed">{c.value}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
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
                NICS Multimedia is one part of a wider AI ecosystem — trading, real estate, and more.
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

export default NicsMultimedia;
