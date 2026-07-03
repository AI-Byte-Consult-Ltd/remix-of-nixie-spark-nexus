import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Cpu, Globe2, Layers, Zap } from "lucide-react";
import NicsLiveDashboard from "./NicsLiveDashboard";

const NicsEcosystemPreview = () => {
  return (
    <section id="nics-ecosystem" className="py-24 relative bg-[#05080b] text-white overflow-hidden">
      <div className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, rgba(34,211,238,0.4), transparent 40%), radial-gradient(circle at 80% 70%, rgba(20,184,166,0.3), transparent 40%)",
        }}
      />
      <div className="container mx-auto px-4 relative">
        <div className="grid lg:grid-cols-2 gap-10 items-center max-w-6xl mx-auto">
          <div className="space-y-6">
            <Badge className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/15">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 mr-2 animate-pulse" />
              LIVE RESEARCH INTERFACE
            </Badge>
            <h2 className="text-4xl md:text-5xl font-semibold">
              NICS AI <span className="bg-gradient-to-r from-cyan-300 to-teal-300 bg-clip-text text-transparent">Ecosystem</span>
            </h2>
            <p className="text-lg text-white/70">
              A transparent AI laboratory where you can observe multilingual model training in real time — proprietary tokenizer, models, training pipeline and inference stack, built end-to-end.
            </p>

            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { Icon: Layers, label: "Independent AI Stack" },
                { Icon: Globe2, label: "EN / RU / BG / ES Multilingual" },
                { Icon: Cpu, label: "Azure F-series Runtime" },
                { Icon: Zap, label: "Live Training Active" },
              ].map(({ Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-sm text-white/80">
                  <Icon className="w-4 h-4 text-cyan-300" />
                  {label}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link to="/nics-ecosystem">
                <Button size="lg" className="bg-cyan-400 text-black hover:bg-cyan-300">
                  View Live Training <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
              <a href="https://nics.space" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="border-cyan-500/40 text-cyan-100 bg-transparent hover:bg-cyan-500/10">
                  Open nics.space
                </Button>
              </a>
            </div>
          </div>

          <div>
            <NicsLiveDashboard compact />
          </div>
        </div>
      </div>
    </section>
  );
};

export default NicsEcosystemPreview;