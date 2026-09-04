import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useCabinetOutletContext } from "./CabinetLayout";
import { useCabinetQuery } from "@/features/cabinet/useCabinetQuery";
import type { SubscriptionResponseData } from "@/features/cabinet/types";

const CabinetPro = () => {
  const { session, language, t, updateSession } = useCabinetOutletContext();

  const { data, isLoading } = useCabinetQuery<SubscriptionResponseData>({
    action: "subscription",
    session,
    language,
    onRenewedToken: updateSession,
  });

  const isActive = data?.subscription?.status === "active";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold text-gradient-gold">{t("proTitle")}</h1>

      {isLoading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> {t("loading")}
        </div>
      ) : (
        <Card className="border-border bg-card">
          <CardContent className="space-y-3 pt-6">
            <p className="text-sm text-muted-foreground">
              {isActive ? t("proLeadActive") : t("proLeadInactive")}
            </p>
            {!isActive && (
              <Button asChild variant="outline">
                <Link to="/cabinet/subscription">{t("proGoSubscription")}</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CabinetPro;
