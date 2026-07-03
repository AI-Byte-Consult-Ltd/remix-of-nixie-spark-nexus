import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NicsLiveDashboard from "@/components/NicsLiveDashboard";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Cpu, Layers, Languages, Server, Sparkles } from "lucide-react";
import useSEO from "@/hooks/useSEO";

const stackItems = [
  { Icon: Layers, title: "Independent Tokenizer", desc: "Custom byte-pair encoding tokenizer built from scratch, optimized for multilingual processing across Latin and Cyrillic scripts." },
  { Icon: Brain, title: "Proprietary Models", desc: "Transformer-based language models designed and trained entirely in-house with full architectural control." },
  { Icon: Cpu, title: "Training Pipeline", desc: "End-to-end training infrastructure with automated checkpointing, loss monitoring, and distributed batch processing." },
  { Icon: Sparkles, title: "Inference Engine", desc: "Optimized inference stack with dynamic batching, speculative decoding, and low-latency response generation." },
  { Icon: Languages, title: "Multilingual Architecture", desc: "Native support for English, Russian, Bulgarian, and Spanish with cross-lingual transfer capabilities." },
  { Icon: Server, title: "Future Multimodal Expansion", desc: "Roadmap includes vision, audio, and cross-modal reasoning capabilities for comprehensive AI understanding." },
];

const infra = [
  { title: "Local Training Environment", desc: "Hewlett-Packard workstation" },
  { title: "Azure VM Deployment", desc: "F-series compute instance" },
  { title: "Model Checkpoint Sync", desc: "Automated periodic persistence" },
  { title: "Active Runtime Node", desc: "Training + inference pipeline" },
  { title: "Multilingual Corpus", desc: "EN / RU / BG / ES aligned data" },
];

const NicsEcosystem = () => {
  useSEO({
    title: "NICS AI Ecosystem — Live Multilingual AI Research | AI Byte Consult",
    description: "A transparent AI laboratory: proprietary tokenizer, models, training pipeline and inference stack — with live multilingual training you can observe in real time.",
    canonical: "https://aibyteconsult.com/nics-ecosystem",
  });

  return (
    <main className="min-h-screen bg-background text-white">
      <Header />

      {/* Hero */}
      <section className="pt-28 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.12] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 15% 20%, rgba(34,211,238,0.5), transparent 40%), radial-gradient(circle at 85% 80%, rgba(20,184,166,0.35), transparent 45%)" }}
        />
        <div className="container mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-10 items-center max-w-6xl mx-auto">
            <div className="space-y-6">
              <Badge className="bg-primary/10 border border-primary/30 text-primary hover:bg-primary/15">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 mr-2 animate-pulse" />
                LIVE RESEARCH INTERFACE
              </Badge>
              <h1 className="text-5xl md:text-6xl font-semibold leading-tight">
                NICS AI{" "}
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Ecosystem</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                A transparent AI laboratory where you can observe multilingual model training in real time.
              </p>
              <p className="text-base text-muted-foreground">
                NICS AI Ecosystem is an independent AI platform built from scratch — with its own tokenizer, models, training pipeline, inference stack, and live research interface.
              </p>
              <div className="flex flex-wrap gap-2">
                {["Independent AI Stack", "Multilingual Core", "Live Training Active", "Azure Runtime Connected"].map((t) => (
                  <Badge key={t} variant="outline" className="border-primary/30 text-foreground bg-primary/5">{t}</Badge>
                ))}
              </div>
              <div className="flex flex-wrap gap-3 pt-2">
                <a href="#live"><Button size="lg" className="bg-primary text-black hover:bg-primary">View Live Training <ArrowRight className="w-4 h-4 ml-1" /></Button></a>
                <a href="#overview"><Button size="lg" variant="outline" className="border-primary/40 text-foreground bg-transparent hover:bg-primary/10">Project Overview</Button></a>
              </div>
            </div>
            <div id="live">
              <NicsLiveDashboard />
            </div>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section id="overview" className="py-20 border-t border-border/60">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12 space-y-3">
            <div className="text-xs tracking-widest text-primary">PROJECT OVERVIEW</div>
            <h2 className="text-3xl md:text-4xl font-semibold">A Complete Independent AI Stack</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Every component of NICS AI Ecosystem is built from the ground up — no third-party model dependencies, no API wrappers, no shortcuts.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stackItems.map(({ Icon, title, desc }) => (
              <Card key={title} className="bg-card border-border p-6 hover:border-primary/30 transition-colors">
                <Icon className="w-6 h-6 text-primary mb-3" />
                <h3 className="font-semibold mb-2 text-white">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Infrastructure */}
      <section className="py-20 border-t border-border/60">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-10 space-y-3">
            <div className="text-xs tracking-widest text-primary">INFRASTRUCTURE</div>
            <h2 className="text-3xl md:text-4xl font-semibold">System Status</h2>
          </div>
          <div className="rounded-2xl border border-border divide-y divide-border/60 overflow-hidden">
            {infra.map((row) => (
              <div key={row.title} className="flex items-center justify-between p-4 md:p-5 bg-card">
                <div>
                  <div className="text-foreground font-medium">{row.title}</div>
                  <div className="text-sm text-muted-foreground">{row.desc}</div>
                </div>
                <span className="flex items-center gap-2 text-xs text-green-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  Online
                </span>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <a href="https://nics.space" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-primary text-black hover:bg-primary">
                Explore Full Interface at nics.space <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default NicsEcosystem;