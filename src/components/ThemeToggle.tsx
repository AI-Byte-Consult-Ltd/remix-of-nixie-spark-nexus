import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppTheme } from "@/lib/appTheme";

const LABELS: Record<string, { light: string; dark: string }> = {
  ru: { light: "Светлая тема", dark: "Тёмная тема" },
  bg: { light: "Светла тема", dark: "Тъмна тема" },
  es: { light: "Tema claro", dark: "Tema oscuro" },
  en: { light: "Light theme", dark: "Dark theme" },
};

// One button: shows the theme it switches to.
export const ThemeToggle = ({ language = "en", className }: { language?: string; className?: string }) => {
  const { theme, toggle } = useAppTheme();
  const labels = LABELS[language] ?? LABELS.en;
  const label = theme === "dark" ? labels.light : labels.dark;
  return (
    <button
      type="button"
      onClick={toggle}
      title={label}
      aria-label={label}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition hover:text-foreground",
        className,
      )}
    >
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
};
