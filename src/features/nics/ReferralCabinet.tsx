import { useState } from "react";
import {
  BadgeDollarSign,
  Check,
  Copy,
  Send,
  Users,
  WalletCards,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type {
  AppLanguage,
  ReferralProgram,
} from "./types";
import type { Translation } from "./i18n";
import { formatDate } from "./utils";

interface ReferralCabinetProps {
  program: ReferralProgram;
  language: AppLanguage;
  t: Translation;
  onCopy: () => void;
  onShare: () => void;
  onPayout: () => void;
}

const locales: Record<AppLanguage, string> = {
  ru: "ru-RU",
  bg: "bg-BG",
  en: "en-GB",
  es: "es-ES",
};

const formatStars = (value: number, language: AppLanguage) =>
  new Intl.NumberFormat(locales[language], {
    maximumFractionDigits: 2,
  }).format(Number(value ?? 0));

export const ReferralCabinet = ({
  program,
  language,
  t,
  onCopy,
  onShare,
  onPayout,
}: ReferralCabinetProps) => {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(program.link);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
      onCopy();
    } catch {
      // Telegram's share button remains available if clipboard access is denied.
    }
  };

  const metrics = [
    [t.invited, program.referralCount],
    [t.paidSubscribers, program.payingReferralCount],
    [t.earned, `${formatStars(program.earnedLifetimeXtr, language)} XTR`],
    [t.available, `${formatStars(program.availableXtr, language)} XTR`],
    [t.pending, `${formatStars(program.pendingXtr, language)} XTR`],
    [t.paidOut, `${formatStars(program.paidXtr, language)} XTR`],
  ];

  return (
    <section className="space-y-4">
      <div className="overflow-hidden rounded-[28px] border border-emerald-300/20 bg-[radial-gradient(circle_at_top_right,rgba(52,211,153,0.24),transparent_42%),linear-gradient(145deg,#141b1b,#0b0d13)] p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-emerald-300/80">
              {t.referralTitle}
            </p>
            <p className="mt-3 text-5xl font-semibold text-white">
              {formatStars(program.commissionRatePercent, language)}%
            </p>
            <p className="mt-1 text-xs text-emerald-100/70">
              {t.referralRateCaption}
            </p>
          </div>
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-300/10 text-emerald-300">
            <BadgeDollarSign className="h-6 w-6" />
          </div>
        </div>
        <p className="mt-5 max-w-xl text-sm leading-6 text-slate-300">
          {t.referralLead}
        </p>
      </div>

      <Card className="border-white/10 bg-white/[0.045] text-white shadow-none">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">{t.personalLink}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <a
            href={program.link || undefined}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={!program.link}
            className="block rounded-xl border border-white/10 bg-black/20 px-3 py-3 transition hover:border-amber-300/30 hover:bg-amber-300/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/60"
          >
            <span className="block break-all font-mono text-xs text-amber-200 underline decoration-amber-300/35 underline-offset-4 select-all">
              {program.link || "—"}
            </span>
          </a>
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={!program.link}
              onClick={() => void copyLink()}
              className="border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.08] hover:text-white"
            >
              {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
              {copied ? t.copied : t.copy}
            </Button>
            <Button
              type="button"
              disabled={!program.link}
              onClick={onShare}
              className="bg-amber-400 text-black hover:bg-amber-300"
            >
              <Send className="mr-2 h-4 w-4" />
              {t.share}
            </Button>
          </div>
        </CardContent>
      </Card>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {metrics.map(([label, value], index) => (
          <Card
            key={String(label)}
            className="border-white/10 bg-white/[0.045] text-white shadow-none"
          >
            <CardContent className="p-4">
              {index < 2 ? (
                <Users className="h-4 w-4 text-sky-300" />
              ) : (
                <WalletCards className="h-4 w-4 text-emerald-300" />
              )}
              <p className="mt-3 text-lg font-semibold">{value}</p>
              <p className="mt-1 text-xs text-slate-500">{label}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <Card className="border-white/10 bg-white/[0.045] text-white shadow-none">
        <CardHeader>
          <CardTitle className="text-base">{t.howItWorks}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {program.plans.map((plan) => {
              const [period, markets] = plan.code.split("_");
              return (
                <div
                  key={plan.code}
                  className="grid grid-cols-[1fr_auto_auto] items-center gap-3 rounded-xl border border-white/10 bg-black/10 px-3 py-3 text-xs"
                >
                  <div>
                    <p className="font-medium">
                      {period === "WEEK" ? t.referralWeek : t.referralMonth}
                    </p>
                    <p className="mt-1 text-[10px] text-slate-500">
                      {markets} · {t.markets}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-500">{t.subscriptionPrice}</p>
                    <p className="mt-1">{formatStars(plan.priceXtr, language)} XTR</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-emerald-400/70">{t.yourReward}</p>
                    <p className="mt-1 font-semibold text-emerald-300">
                      {formatStars(plan.commissionXtr, language)} XTR
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-xs leading-5 text-slate-500">{t.refundRule}</p>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/[0.045] text-white shadow-none">
        <CardHeader>
          <CardTitle className="text-base">{t.recentReferrals}</CardTitle>
        </CardHeader>
        <CardContent>
          {program.recentReferrals.length ? (
            <div className="space-y-2">
              {program.recentReferrals.map((referral, index) => (
                <div
                  key={`${referral.username ?? referral.firstName ?? "referral"}-${index}`}
                  className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-black/10 px-3 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {referral.username
                        ? `@${referral.username}`
                        : referral.firstName || `NICS #${index + 1}`}
                    </p>
                    <p className="mt-1 text-[10px] text-slate-500">
                      {t.joined}: {formatDate(referral.joinedAt, language)}
                    </p>
                  </div>
                  <Badge
                    className={
                      referral.hasPaid
                        ? "bg-emerald-400/10 text-emerald-300"
                        : "bg-slate-400/10 text-slate-400"
                    }
                  >
                    {referral.hasPaid ? t.referralPaidStatus : t.referralRegisteredStatus}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-6 text-center text-sm text-slate-500">{t.noReferrals}</p>
          )}
        </CardContent>
      </Card>

      <Card className="border-emerald-300/15 bg-emerald-300/[0.05] text-white shadow-none">
        <CardContent className="space-y-3 p-5">
          <Button
            type="button"
            disabled={Number(program.availableXtr) <= 0}
            onClick={onPayout}
            className="w-full bg-emerald-400 text-[#07120d] hover:bg-emerald-300"
          >
            <WalletCards className="mr-2 h-4 w-4" />
            {t.requestPayout}
          </Button>
          <p className="text-center text-xs leading-5 text-slate-400">{t.payoutHint}</p>
        </CardContent>
      </Card>
    </section>
  );
};
