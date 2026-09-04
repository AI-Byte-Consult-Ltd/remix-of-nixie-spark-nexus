import { Button } from "@/components/ui/button";
import { useCabinetOutletContext } from "./CabinetLayout";

const BOT_URL = "https://t.me/nics_ai_bot";

const CabinetSupport = () => {
  const { t } = useCabinetOutletContext();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gradient-gold">{t("supportTitle")}</h1>
        <p className="mt-1 text-sm text-slate-400">{t("supportLead")}</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild variant="outline">
          <a href={BOT_URL} target="_blank" rel="noopener noreferrer">
            {t("supportBotLink")}
          </a>
        </Button>
        <Button asChild variant="outline">
          <a href="/#contact">{t("supportSiteContact")}</a>
        </Button>
      </div>
    </div>
  );
};

export default CabinetSupport;
