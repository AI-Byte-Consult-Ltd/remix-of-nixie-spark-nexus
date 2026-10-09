import { useState } from "react";
import { ArrowRight, Bot, CreditCard, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCabinetOutletContext } from "./CabinetLayout";
import { useCabinetQuery } from "@/features/cabinet/useCabinetQuery";
import { callCabinetApi } from "@/features/cabinet/api";
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

  const [payingPlanId, setPayingPlanId] = useState<string | null>(null);
  const [payErrorPlanId, setPayErrorPlanId] = useState<string | null>(null);
  const [marketPickerPlanId, setMarketPickerPlanId] = useState<string | null>(null);
  const [pickedMarkets, setPickedMarkets] = useState<string[]>([]);

  const ALL_MARKETS = ["gold", "oil", "forex", "crypto", "stocks", "metals", "indices"] as const;
  const PRODUCT_MARKET_CAP: Record<string, number> = { single: 1, multi: 2, full: 7 };
  const MARKET_T_KEY: Record<string, string> = {
    gold: "marketGold",
    oil: "marketOil",
    forex: "marketForex",
    crypto: "marketCrypto",
    stocks: "marketStocks",
    metals: "marketMetals",
    indices: "marketIndices",
  };

  const handleRevolutPay = async (planId: string, markets: string[]) => {
    setPayErrorPlanId(null);
    setPayingPlanId(planId);
    try {
      const result = await callCabinetApi<{ checkoutUrl?: string; renewedToken?: string }>({
        action: "create_payment_order",
        session,
        language,
        payload: { plan: planId, period: "30d", markets },
      });
      if (result.data?.renewedToken) updateSession(result.data.renewedToken);
      if (result.data?.checkoutUrl) {
        window.open(result.data.checkoutUrl, "_blank", "noopener,noreferrer");
      } else {
        setPayErrorPlanId(planId);
      }
    } catch {
      setPayErrorPlanId(planId);
    } finally {
      setPayingPlanId(null);
    }
  };

  const startRevolutPay = (planId: string) => {
    const cap = PRODUCT_MARKET_CAP[planId] ?? 0;
    if (planId === "full" || cap >= ALL_MARKETS.length) {
      handleRevolutPay(planId, [...ALL_MARKETS]);
      return;
    }
    setMarketPickerPlanId(planId);
    setPickedMarkets([]);
  };

  const toggleMarket = (planId: string, market: string) => {
    const cap = PRODUCT_MARKET_CAP[planId] ?? 0;
    setPickedMarkets((prev) => {
      if (prev.includes(market)) return prev.filter((m) => m !== market);
      if (prev.length >= cap) return prev;
      return [...prev, market];
    });
  };

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

                  {plan.free ? (
                    <Button asChild variant={plan.featured ? "default" : "outline"} size="sm">
                      <a href={TELEGRAM_BOT_URL} target="_blank" rel="noopener noreferrer">
                        {plan.cta}
                      </a>
                    </Button>
                  ) : (
                    <Dialog
                      onOpenChange={(open) => {
                        if (!open) {
                          setMarketPickerPlanId(null);
                          setPickedMarkets([]);
                        }
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button variant={plan.featured ? "default" : "outline"} size="sm">
                          {plan.cta}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>{plan.name}</DialogTitle>
                          <DialogDescription>
                            {marketPickerPlanId === plan.id
                              ? t("subscriptionChooseMarkets")
                              : t("subscriptionPayDialogDesc")}
                          </DialogDescription>
                        </DialogHeader>

                        {marketPickerPlanId === plan.id ? (
                          <div className="grid gap-3 pt-1">
                            <div className="grid grid-cols-2 gap-2">
                              {ALL_MARKETS.map((market) => {
                                const checked = pickedMarkets.includes(market);
                                const cap = PRODUCT_MARKET_CAP[plan.id] ?? 0;
                                const disabled = !checked && pickedMarkets.length >= cap;
                                return (
                                  <button
                                    key={market}
                                    type="button"
                                    disabled={disabled}
                                    onClick={() => toggleMarket(plan.id, market)}
                                    className={`flex items-center gap-2 rounded-xl border p-3 text-left text-sm transition-colors disabled:opacity-40 ${
                                      checked
                                        ? "border-primary bg-primary/10 text-foreground"
                                        : "border-border bg-muted/50 text-foreground hover:border-primary/40"
                                    }`}
                                  >
                                    {t(MARKET_T_KEY[market])}
                                  </button>
                                );
                              })}
                            </div>
                            <div className="flex gap-2 pt-1">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setMarketPickerPlanId(null);
                                  setPickedMarkets([]);
                                }}
                              >
                                {t("subscriptionBack")}
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                className="flex-1"
                                disabled={
                                  pickedMarkets.length !== (PRODUCT_MARKET_CAP[plan.id] ?? 0) ||
                                  payingPlanId === plan.id
                                }
                                onClick={() => handleRevolutPay(plan.id, pickedMarkets)}
                              >
                                {payingPlanId === plan.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  t("subscriptionContinue")
                                )}
                              </Button>
                            </div>
                            {payErrorPlanId === plan.id && (
                              <span className="block text-xs text-rose-500">
                                {t("subscriptionPayError")}
                              </span>
                            )}
                          </div>
                        ) : (
                          <div className="grid gap-3 pt-1">
                            <a
                              href={TELEGRAM_BOT_URL}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 rounded-2xl border border-border bg-muted/50 p-4 text-left transition-colors hover:border-primary/40 hover:bg-muted"
                            >
                              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10">
                                <Bot className="h-5 w-5 text-primary" />
                              </span>
                              <span className="flex-1">
                                <span className="block text-sm font-medium text-foreground">
                                  {t("subscriptionPayTelegram")}
                                </span>
                                <span className="block text-xs text-muted-foreground">
                                  {t("subscriptionPayTelegramDesc")}
                                </span>
                              </span>
                              <ArrowRight className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                            </a>

                            <button
                              type="button"
                              disabled={payingPlanId === plan.id}
                              onClick={() => startRevolutPay(plan.id)}
                              className="flex w-full items-center gap-3 rounded-2xl border border-border bg-muted/50 p-4 text-left transition-colors hover:border-primary/40 hover:bg-muted disabled:opacity-60"
                            >
                              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-border bg-muted">
                                {payingPlanId === plan.id ? (
                                  <Loader2 className="h-5 w-5 animate-spin text-foreground/80" />
                                ) : (
                                  <CreditCard className="h-5 w-5 text-foreground/80" />
                                )}
                              </span>
                              <span className="flex-1">
                                <span className="block text-sm font-medium text-foreground">
                                  {t("subscriptionPayRevolut")}
                                </span>
                                <span className="block text-xs text-muted-foreground">
                                  {payingPlanId === plan.id
                                    ? t("subscriptionPayRedirecting")
                                    : t("subscriptionPayRevolutDesc")}
                                </span>
                                {payErrorPlanId === plan.id && (
                                  <span className="mt-1 block text-xs text-rose-500">
                                    {t("subscriptionPayError")}
                                  </span>
                                )}
                              </span>
                              {payingPlanId !== plan.id && (
                                <ArrowRight className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                              )}
                            </button>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  )}
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
