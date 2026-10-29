import { useLanguage, type Language } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

// The cabinet's own language menu. English is the default (LanguageContext
// falls back to "en" when nothing was chosen); the choice is remembered.
const OPTIONS: Array<{ value: Language; label: string; title: string }> = [
  { value: "en", label: "EN", title: "English" },
  { value: "ru", label: "RU", title: "Русский" },
  { value: "bg", label: "BG", title: "Български" },
];

export const CabinetLanguageSwitch = ({ className }: { className?: string }) => {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      role="group"
      aria-label="Language"
      className={cn("inline-flex rounded-lg border border-border p-0.5", className)}
    >
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          title={option.title}
          aria-pressed={language === option.value}
          onClick={() => setLanguage(option.value)}
          className={cn(
            "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
            language === option.value
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};
