import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCabinetOutletContext } from "./CabinetLayout";
import { useCabinetQuery } from "@/features/cabinet/useCabinetQuery";
import type { SubscriptionResponseData } from "@/features/cabinet/types";
import { formatPrice, plans, TELEGRAM_BOT_URL } from "@/data/nicsTraderPlans";

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
    <div className="mx-auto max-w-5xl space-y-8">
      <h1 className="text-2xl font-bold text-gradient-gold">{t("subscriptionPageTitle")}</h1>

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> {t("loading")}
        </div>
      )}

      {errorCode && (
        <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{errorCode}</p>
      )}

      {data && (
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("subscriptionCurrentPlan")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Badge variant={isActive ? "default" : "secondary"}>
              {isActive ? t("subscriptionActive") : t("subscriptionNone")}
            </Badge>
            {isActive && data.subscription?.expiresAt && (
              <p className="text-xs text-muted-foreground">
                {t("subscriptionExpiresAt")}:{" "}
                {new Date(data.subscription.expiresAt).toLocaleDateString()}
              </p>
            )}
            <Button asChild variant="outline">
              <a href={TELEGRAM_BOT_URL} target="_blank" rel="noopener noreferrer">
                {t("subscriptionRenew")}
              </a>
            </Button>
          </CardContent>
        </Card>
      )}

      <div>
        <h2 className="text-lg font-semibold text-foreground">{t("subscriptionPlansTitle")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("subscriptionPlansLead")}</p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {plans.map((plan) => {
            const price30d = plan.prices?.["30d"]?.EUR;

            return (
              <Card
                key={plan.id}
                className={`relative flex flex-col border-border bg-card ${
                  plan.featured ? "border-primary/50 shadow-sm shadow-primary/10" : ""
                }`}
              >
                {plan.badge && (
                  <span
                    className={`absolute right-4 top-4 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                      plan.free
                        ? "border border-border bg-muted text-muted-foreground"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    {plan.badge}
                  </span>
                )}
                <CardHeader className="pb-2">
                  <CardTitle className="pr-20 text-base font-semibold text-foreground">
                    {plan.name}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">{plan.subtitle}</p>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col gap-3">
                  <p className="text-xs text-primary">{plan.markets}</p>

                  <div className="border-b border-border pb-3">
                    {plan.free ? (
                      <span className="text-2xl font-bold text-foreground">FREE</span>
                    ) : price30d !== undefined ? (
                      <>
                        <span className="text-2xl font-bold text-foreground">
                          {formatPrice(price30d, "EUR")}
                        </span>
                        <span className="ml-1 text-xs text-muted-foreground">/ 30 days</span>
                      </>
                    ) : null}
                  </div>

                  <ul className="flex-1 space-y-1.5 text-xs text-muted-foreground">
                    {plan.features.slice(0, 4).map((feature) => (
                      <li key={feature}>· {feature}</li>
                    ))}
                  </ul>

                  <Button asChild variant={plan.featured ? "default" : "outline"} size="sm">
                    <a href={TELEGRAM_BOT_URL} target="_blank" rel="noopener noreferrer">
                      {plan.cta}
                    </a>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CabinetSubscription;
