import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import SEO from "@/components/SEO";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";

const queryClient = new QueryClient();
const NicsTraderApp = lazy(() => import("./pages/NicsTraderApp"));
const About = lazy(() => import("./pages/About"));
const Estate = lazy(() => import("./pages/Estate"));
const Trading = lazy(() => import("./pages/Trading"));
const NicsEcosystem = lazy(() => import("./pages/NicsEcosystem"));
const NicsMultimedia = lazy(() => import("./pages/NicsMultimedia"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const DataDeletion = lazy(() => import("./pages/DataDeletion"));
const NotFound = lazy(() => import("./pages/NotFound"));

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<div className="min-h-screen bg-background" />}>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* Crawlable localized entry points for the two languages with
                translated meta (title/description) and hreflang wiring —
                see src/contexts/LanguageContext.tsx's URL_LANGUAGES and
                scripts/generate-seo-pages.mjs. Homepage content is fully
                translated already (Hero/About/etc. all use t()), so this
                is genuine localized content, not just a translated meta
                tag over English copy. /trading is deliberately not
                included here yet — its body isn't wired to useLanguage()
                at all (100% hardcoded English), so a localized URL for it
                would show a Russian/Bulgarian title over English content —
                do that once the page itself is actually translated. Every
                other language stays client-side-only via the language
                switcher, same as before. */}
            <Route path="/ru" element={<Index />} />
            <Route path="/bg" element={<Index />} />
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
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/delete" element={<DataDeletion />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
