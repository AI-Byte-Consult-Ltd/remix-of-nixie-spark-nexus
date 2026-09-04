import { useMemo } from "react";
import { Navigate, Outlet, useOutletContext } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import SEO from "@/components/SEO";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { CabinetSidebar } from "@/features/cabinet/CabinetSidebar";
import { createCabinetTranslator } from "@/features/cabinet/i18n";
import { callCabinetApi, CabinetApiError } from "@/features/cabinet/api";
import { useCabinetAuth } from "@/features/cabinet/useCabinetAuth";
import { useCabinetQuery } from "@/features/cabinet/useCabinetQuery";
import type { CabinetLanguage, DashboardResponseData } from "@/features/cabinet/types";
import { Wallet } from "lucide-react";

export interface CabinetOutletContext {
  session: string;
  user: NonNullable<ReturnType<typeof useCabinetAuth>["user"]>;
  language: CabinetLanguage;
  t: ReturnType<typeof createCabinetTranslator>;
  updateSession: (session: string) => void;
  callApi: typeof callCabinetApi;
  logout: () => void;
}

const SUPPORTED_CABINET_LANGUAGES: CabinetLanguage[] = ["ru", "bg", "en", "es"];

export const useCabinetOutletContext = () => useOutletContext<CabinetOutletContext>();

const CabinetLayout = () => {
  const { language: siteLanguage } = useLanguage();
  const auth = useCabinetAuth();

  const cabinetLanguage: CabinetLanguage = useMemo(() => {
    return (SUPPORTED_CABINET_LANGUAGES as string[]).includes(siteLanguage)
      ? (siteLanguage as CabinetLanguage)
      : "en";
  }, [siteLanguage]);

  const t = useMemo(() => createCabinetTranslator(cabinetLanguage), [cabinetLanguage]);

  if (auth.isLoading) {
    return (
      <main className="grid min-h-screen place-items-center bg-background text-sm text-muted-foreground">
        {t("loading")}
      </main>
    );
  }

  if (!auth.isAuthenticated || !auth.session || !auth.user) {
    return <Navigate to="/cabinet/login" replace />;
  }

  const context: CabinetOutletContext = {
    session: auth.session,
    user: auth.user,
    language: cabinetLanguage,
    t,
    updateSession: auth.updateSession,
    callApi: callCabinetApi,
    logout: auth.logout,
  };

  return (
    <>
      <SEO
        title="NICS AI Trader — Cabinet"
        description="Personal cabinet for NICS AI Trader subscribers."
        canonical="https://aibyteconsult.com/cabinet"
        noindex
      />
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-background text-foreground">
          <CabinetSidebar t={t} user={auth.user} onLogout={auth.logout} />
          <SidebarInset className="bg-transparent">
            <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <SidebarTrigger className="md:hidden" />
                <span className="text-sm font-medium md:hidden">{t("appTitle")}</span>
              </div>
              <CashbackBadge
                session={auth.session}
                language={cabinetLanguage}
                onRenewedToken={auth.updateSession}
                label={t("cashbackLabel")}
              />
            </div>
            <div className="flex-1 px-4 py-6 md:px-8 md:py-8">
              <Outlet context={context} />
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </>
  );
};

interface CashbackBadgeProps {
  session: string;
  language: CabinetLanguage;
  onRenewedToken: (token: string) => void;
  label: string;
}

const CashbackBadge = ({ session, language, onRenewedToken, label }: CashbackBadgeProps) => {
  const { data } = useCabinetQuery<DashboardResponseData>({
    action: "dashboard",
    session,
    language,
    onRenewedToken,
  });

  const amount = data?.dashboard?.cashbackAvailableXtr ?? 0;

  return (
    <div className="flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5">
      <Wallet className="h-4 w-4 text-primary" />
      <span className="text-xs font-medium text-primary/80">{label}</span>
      <span className="text-sm font-semibold text-foreground">{amount} XTR</span>
    </div>
  );
};

export default CabinetLayout;

export { CabinetApiError };
