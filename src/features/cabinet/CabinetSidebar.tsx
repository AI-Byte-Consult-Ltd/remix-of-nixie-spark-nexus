import { NavLink } from "react-router-dom";
import {
  BadgeCheck,
  BookOpen,
  Crown,
  GraduationCap,
  Grid2x2,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Newspaper,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
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
  const items: Array<{ to: string; label: string; icon: typeof LayoutDashboard }> = [
    { to: "/cabinet", label: t("navHome"), icon: LayoutDashboard },
    { to: "/cabinet/academy", label: t("navAcademy"), icon: GraduationCap },
    { to: "/cabinet/achievements", label: t("navAchievements"), icon: BadgeCheck },
    { to: "/cabinet/courses", label: t("navCourses"), icon: Grid2x2 },
    { to: "/cabinet/subscription", label: t("navSubscription"), icon: BookOpen },
    { to: "/cabinet/services", label: t("navServices"), icon: Grid2x2 },
    { to: "/cabinet/journal", label: t("navJournal"), icon: Newspaper },
    { to: "/cabinet/pro", label: t("navPro"), icon: Crown },
    { to: "/cabinet/support", label: t("navSupport"), icon: LifeBuoy },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-4">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gradient-gold">NICS</span>
          <span className="text-sm text-muted-foreground">{t("appTitle")}</span>
        </div>
        {user && (
          <p className="mt-2 truncate text-xs text-muted-foreground">
            {user.firstName || user.username || `#${user.id}`}
          </p>
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.to}
                      end={item.to === "/cabinet"}
                      className={({ isActive }) =>
                        isActive ? "font-semibold text-foreground" : "text-muted-foreground"
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
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
