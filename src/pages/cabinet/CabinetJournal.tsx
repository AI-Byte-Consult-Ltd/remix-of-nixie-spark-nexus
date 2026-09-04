import { Button } from "@/components/ui/button";
import { useCabinetOutletContext } from "./CabinetLayout";

const CHANNEL_URL = "https://t.me/TravelTradeBook";

const CabinetJournal = () => {
  const { t } = useCabinetOutletContext();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gradient-gold">{t("journalTitle")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("journalLead")}</p>
      </div>

      <Button asChild variant="outline">
        <a href={CHANNEL_URL} target="_blank" rel="noopener noreferrer">
          {t("journalOpenChannel")}
        </a>
      </Button>
    </div>
  );
};

export default CabinetJournal;
