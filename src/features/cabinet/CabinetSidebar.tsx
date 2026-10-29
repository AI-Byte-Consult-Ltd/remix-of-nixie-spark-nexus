import { NavLink } from "react-router-dom";
import {
  Activity,
  BadgeCheck,
  BarChart3,
  BookOpen,
  Calculator,
  Crown,
  Gift,
  GraduationCap,
  Grid2x2,
  History,
  KeyRound,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Newspaper,
  Settings2,
  Signal,
  UserRound,
  Users,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { CabinetTranslation } from "./i18n";
import type { CabinetUser } from "./types";

interface CabinetSidebarProps {
  t: CabinetTranslation;
  user: CabinetUser | null;
  onLogout: () => void;
}

export const CabinetSidebar = ({ t, user, onLogout }: CabinetSidebarProps) => {
  // The Telegram Mini App's screens (CabinetTrader), then the cabinet's own.
  const traderItems: Array<{ to: string; label: string; icon: typeof LayoutDashboard }> = [
    { to: "/cabinet/trader", label: t("navTraderDashboard"), icon: LayoutDashboard },
    { to: "/cabinet/trader/signals", label: t("navSignals"), icon: Signal },
    { to: "/cabinet/trader/performance", label: t("navPerformance"), icon: BarChart3 },
    { to: "/cabinet/trader/history", label: t("navHistory"), icon: History },
    { to: "/cabinet/trader/markets", label: t("navMarkets"), icon: Activity },
    { to: "/cabinet/trader/risk", label: t("navRisk"), icon: Calculator },
    { to: "/cabinet/trader/referral", label: t("navReferrals"), icon: Users },
    { to: "/cabinet/trader/rewards", label: t("navRewards"), icon: Gift },
    { to: "/cabinet/trader/settings", label: t("navTraderSettings"), icon: Settings2 },
  ];

  const items: Array<{ to: string; label: string; icon: typeof LayoutDashboard }> = [
    { to: "/cabinet/overview", label: t("navOverview"), icon: UserRound },
    { to: "/cabinet/academy", label: t("navAcademy"), icon: GraduationCap },
    { to: "/cabinet/achievements", label: t("navAchievements"), icon: BadgeCheck },
    { to: "/cabinet/courses", label: t("navCourses"), icon: Grid2x2 },
    { to: "/cabinet/subscription", label: t("navSubscription"), icon: BookOpen },
    { to: "/cabinet/services", label: t("navServices"), icon: Grid2x2 },
    { to: "/cabinet/journal", label: t("navJournal"), icon: Newspaper },
    { to: "/cabinet/pro", label: t("navPro"), icon: Crown },
    { to: "/cabinet/support", label: t("navSupport"), icon: LifeBuoy },
    { to: "/cabinet/account", label: t("navAccount"), icon: KeyRound },
  ];

  const renderItems = (list: typeof items) =>
    list.map((item) => (
      <SidebarMenuItem key={item.to}>
        <SidebarMenuButton asChild>
          <NavLink
            to={item.to}
            end={item.to === "/cabinet/trader"}
            className={({ isActive }) =>
              isActive ? "font-semibold text-foreground" : "text-muted-foreground"
            }
          >
            <item.icon className="h-4 w-4" />
            <span>{item.label}</span>
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    ));

  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-4">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gradient-gold">NICS</span>
          <span className="text-sm text-muted-foreground">{t("appTitle")}</span>
        </div>
        {user && (
          <p className="mt-2 truncate text-xs text-muted-foreground">
            {user.firstName || user.username || user.email || `#${user.id}`}
          </p>
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("navTraderGroup")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderItems(traderItems)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>{t("navCabinetGroup")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderItems(items)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="px-4 py-4">
        <SidebarMenuButton onClick={onLogout} className="text-muted-foreground">
          <LogOut className="h-4 w-4" />
          <span>{t("logout")}</span>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
};
