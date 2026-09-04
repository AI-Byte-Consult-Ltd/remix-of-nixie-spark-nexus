import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import SEO from "@/components/SEO";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { LanguageProvider, URL_LANGUAGES } from "@/contexts/LanguageContext";
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
const CabinetLogin = lazy(() => import("./pages/cabinet/CabinetLogin"));
const CabinetLayout = lazy(() => import("./pages/cabinet/CabinetLayout"));
const CabinetHome = lazy(() => import("./pages/cabinet/CabinetHome"));
const CabinetAcademy = lazy(() => import("./pages/cabinet/CabinetAcademy"));
const CabinetAchievements = lazy(() => import("./pages/cabinet/CabinetAchievements"));
const CabinetCourses = lazy(() => import("./pages/cabinet/CabinetCourses"));
const CabinetSubscription = lazy(() => import("./pages/cabinet/CabinetSubscription"));
const CabinetServices = lazy(() => import("./pages/cabinet/CabinetServices"));
const CabinetSupport = lazy(() => import("./pages/cabinet/CabinetSupport"));
const CabinetJournal = lazy(() => import("./pages/cabinet/CabinetJournal"));
const CabinetPro = lazy(() => import("./pages/cabinet/CabinetPro"));

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
            {/* Crawlable localized entry points for every non-English
                language — translated meta (title/description) and
                hreflang wiring, see src/contexts/LanguageContext.tsx's
                URL_LANGUAGES and getLocalizedSeoMeta(), and
                scripts/generate-seo-pages.mjs (which derives its own
                route list from the same language set, so the two can't
                drift apart). Index and Trading are fully translated via
                t() for every one of these languages, so these are
                genuine localized content pages, not just a translated
                meta tag over English copy. */}
            {URL_LANGUAGES.map((lang) => (
              <Route key={lang} path={`/${lang}`} element={<Index />} />
            ))}
            {URL_LANGUAGES.map((lang) => (
              <Route key={`${lang}-trading`} path={`/${lang}/trading`} element={<Trading />} />
            ))}
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
            <Route
              path="/cabinet/login"
              element={
                <Suspense fallback={<div className="min-h-screen bg-[#07090f]" />}>
                  <CabinetLogin />
                </Suspense>
              }
            />
            <Route
              path="/cabinet"
              element={
                <Suspense fallback={<div className="min-h-screen bg-[#07090f]" />}>
                  <CabinetLayout />
                </Suspense>
              }
            >
              <Route index element={<CabinetHome />} />
              <Route path="academy" element={<CabinetAcademy />} />
              <Route path="achievements" element={<CabinetAchievements />} />
              <Route path="courses" element={<CabinetCourses />} />
              <Route path="subscription" element={<CabinetSubscription />} />
              <Route path="services" element={<CabinetServices />} />
              <Route path="support" element={<CabinetSupport />} />
              <Route path="journal" element={<CabinetJournal />} />
              <Route path="pro" element={<CabinetPro />} />
            </Route>
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
