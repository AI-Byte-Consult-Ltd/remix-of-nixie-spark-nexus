import { Button } from "@/components/ui/button";
import Contact from "@/components/Contact";
import { useCabinetOutletContext } from "./CabinetLayout";

const BOT_URL = "https://t.me/nics_ai_bot";

// Support: the bot link and the site's contact form right here, so the
// cabinet (and the Windows app) never has to leave for the public site.
const CabinetSupport = () => {
  const { t } = useCabinetOutletContext();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gradient-gold">{t("supportTitle")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("supportLead")}</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild variant="outline">
          <a href={BOT_URL} target="_blank" rel="noopener noreferrer">
            {t("supportBotLink")}
          </a>
        </Button>
      </div>

      <div className="-mx-4 overflow-hidden rounded-3xl [&_section]:py-10">
        <Contact />
      </div>
    </div>
  );
};

export default CabinetSupport;
