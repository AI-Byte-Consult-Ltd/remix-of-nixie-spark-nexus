import type { Language } from "@/contexts/LanguageContext";
import type { VideoGuide } from "./types";
import en from "./en";
import ru from "./ru";
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

export type { VideoGuide };

// "How to use" guide and FAQ for /nics-video in every site language.
export const videoGuides: Record<Language, VideoGuide> = { en, ru, de, fr, ar, zh, pl, tr, it, bg, es, pt };
