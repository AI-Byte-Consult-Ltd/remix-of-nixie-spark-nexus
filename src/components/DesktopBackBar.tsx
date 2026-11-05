import { ArrowLeft } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { isDesktopApp } from "@/features/cabinet/license";

const LABELS: Record<string, string> = {
  ru: "Вернуться в приложение",
  bg: "Обратно към приложението",
  es: "Volver a la aplicación",
  de: "Zurück zur App",
  fr: "Retour à l'application",
  it: "Torna all'app",
  pt: "Voltar ao aplicativo",
  pl: "Wróć do aplikacji",
  tr: "Uygulamaya dön",
  zh: "返回应用",
  ar: "العودة إلى التطبيق",
  en: "Back to the app",
};

// The Windows app is the cabinet inside a window with no browser buttons.
// If any link lands on a public site page, this bar leads back, so no page
// is a dead end.
export const DesktopBackBar = () => {
  const { pathname } = useLocation();
  const { language } = useLanguage();
  if (pathname.startsWith("/cabinet") || !isDesktopApp()) return null;
  return (
    <Link
      to="/cabinet"
      className="fixed bottom-5 left-1/2 z-[100] flex -translate-x-1/2 items-center gap-2 rounded-full bg-[#07090f] px-5 py-3 text-sm font-medium text-amber-300 shadow-xl ring-1 ring-amber-300/30 hover:text-amber-200"
    >
      <ArrowLeft className="h-4 w-4" />
      {LABELS[language] ?? LABELS.en}
    </Link>
  );
};
