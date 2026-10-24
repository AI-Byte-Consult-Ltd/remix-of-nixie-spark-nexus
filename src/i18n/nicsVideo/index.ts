import type { Language } from "@/contexts/LanguageContext";
import type { NicsVideoLocale } from "./types";
import de from "./de";
import fr from "./fr";
import ar from "./ar";
import zh from "./zh";
import pl from "./pl";
import tr from "./tr";
import it from "./it";
import bg from "./bg";
import es from "./es";
import pt from "./pt";

// NICS Video page, checkout, upload, sign-in and NICS Studio texts for the
// site languages other than English and Russian.
export const nicsVideoLocales: Partial<Record<Language, NicsVideoLocale>> = { de, fr, ar, zh, pl, tr, it, bg, es, pt };
