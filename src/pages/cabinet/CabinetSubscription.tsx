import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCabinetOutletContext } from "./CabinetLayout";
import { useCabinetQuery } from "@/features/cabinet/useCabinetQuery";
import type { SubscriptionResponseData } from "@/features/cabinet/types";

const BOT_URL = "https://t.me/nics_ai_bot";

const CabinetSubscription = () => {
  const { session, language, t, updateSession } = useCabinetOutletContext();

  const { data, isLoading, errorCode } = useCabinetQuery<SubscriptionResponseData>({
    action: "subscription",
    session,
    language,
    onRenewedToken: updateSession,
  });

  const isActive = data?.subscription?.status === "active";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold text-gradient-gold">{t("subscriptionPageTitle")}</h1>

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Loader2 className="h-4 w-4 animate-spin" /> {t("loading")}
        </div>
      )}

      {errorCode && (
        <p className="rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-300">{errorCode}</p>
      )}

      {data && (
        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-300">
              {t("subscriptionCurrentPlan")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Badge variant={isActive ? "default" : "secondary"}>
              {isActive ? t("subscriptionActive") : t("subscriptionNone")}
            </Badge>
            {isActive && data.subscription?.expiresAt && (
              <p className="text-xs text-slate-400">
                {t("subscriptionExpiresAt")}:{" "}
                {new Date(data.subscription.expiresAt).toLocaleDateString()}
              </p>
            )}
            <Button asChild variant="outline">
              <a href={BOT_URL} target="_blank" rel="noopener noreferrer">
                {t("subscriptionRenew")}
              </a>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CabinetSubscription;
