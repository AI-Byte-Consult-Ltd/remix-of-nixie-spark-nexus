import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import SEO from "@/components/SEO";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import About from "./pages/About";
import Estate from "./pages/Estate";
import Trading from "./pages/Trading";
import NicsEcosystem from "./pages/NicsEcosystem";
import NicsMultimedia from "./pages/NicsMultimedia";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();
const NicsTraderApp = lazy(() => import("./pages/NicsTraderApp"));

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/estate" element={<Estate />} />
            <Route path="/trading" element={<Trading />} />
            <Route
              path="/nics-app"
              element={
                <>
                  <SEO
                    title="NICS AI Trader Mini App"
                    description="Authenticated NICS AI Trader user application."
                    canonical="https://aibyteconsult.com/nics-app"
                    noindex
                  />
                  <Suspense
                    fallback={
                      <main className="grid min-h-screen place-items-center bg-[#07090f] text-sm text-slate-400">
                        NICS AI Trader…
                      </main>
                    }
                  >
                    <NicsTraderApp />
                  </Suspense>
                </>
              }
            />
            <Route path="/nics-ecosystem" element={<NicsEcosystem />} />
            <Route path="/nics-multimedia" element={<NicsMultimedia />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
