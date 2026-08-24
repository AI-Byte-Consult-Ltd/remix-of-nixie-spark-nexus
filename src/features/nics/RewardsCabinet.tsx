import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Coins, Gift, Sparkles, Ticket } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { AppLanguage, RewardsState, WheelRewardType } from "./types";
import type { Translation } from "./i18n";

interface RewardsCabinetProps {
  rewards: RewardsState;
  language: AppLanguage;
  t: Translation;
  accessMode: string;
  checkinLoading: boolean;
  spinLoading: boolean;
  redeemLoading: boolean;
  onCheckin: () => void;
  onSpin: () => void;
  onRedeem: () => void;
}

/*
 * Must stay in sync with WHEEL_SECTORS in [07 APP]'s
 * "Validate Telegram Mini App & Build Query" node -- the server always
 * picks the sector, this only renders and animates to whatever the
 * backend actually persisted.
 */
const WHEEL_SECTORS: Array<{ type: WheelRewardType; value: number | null }> = [
  { type: "EMPTY", value: null },
  { type: "POINTS", value: 2 },
  { type: "EMPTY", value: null },
  { type: "POINTS", value: 3 },
  { type: "POINTS", value: 5 },
  { type: "POINTS", value: 10 },
  { type: "VOUCHER", value: null },
  { type: "POINTS", value: 25 },
];

const SECTOR_ANGLE = 360 / WHEEL_SECTORS.length;
const WHEEL_SIZE = 240;
const CENTER = WHEEL_SIZE / 2;
const RADIUS = WHEEL_SIZE / 2;

const SECTOR_FILLS = [
  "#1c2130",
  "#f59e0b",
  "#1c2130",
  "#f59e0b",
  "#f59e0b",
  "#f59e0b",
  "#10b981",
  "#fbbf24",
];

const polarToCartesian = (angleDeg: number, radius: number) => {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: CENTER + radius * Math.cos(angleRad),
    y: CENTER + radius * Math.sin(angleRad),
  };
};

const sectorPath = (index: number) => {
  const startAngle = index * SECTOR_ANGLE;
  const endAngle = startAngle + SECTOR_ANGLE;
  const start = polarToCartesian(startAngle, RADIUS);
  const end = polarToCartesian(endAngle, RADIUS);
  return `M ${CENTER} ${CENTER} L ${start.x} ${start.y} A ${RADIUS} ${RADIUS} 0 0 1 ${end.x} ${end.y} Z`;
};

const sectorLabel = (sector: (typeof WHEEL_SECTORS)[number]) =>
  sector.type === "POINTS"
    ? `+${sector.value}`
    : sector.type === "VOUCHER"
      ? "🎁"
      : "—";

const eligibleForRedeem = (accessMode: string) =>
  !["PAID", "ADMIN", "GRANT_ALL"].includes(accessMode);

export const RewardsCabinet = ({
  rewards,
  language: _language,
  t,
  accessMode,
  checkinLoading,
  spinLoading,
  redeemLoading,
  onCheckin,
  onSpin,
  onRedeem,
}: RewardsCabinetProps) => {
  const [rotation, setRotation] = useState(0);
  const [instant, setInstant] = useState(true);
  const previousSpinKey = useRef<string | null>(null);
  const isFirstSpin = useRef(true);

  useEffect(() => {
    const spin = rewards.lastWheelSpin;
    if (!spin) return;

    const key = `${spin.sectorIndex}-${spin.rewardType}-${spin.rewardValue}`;
    if (previousSpinKey.current === key) return;
    previousSpinKey.current = key;

    const isInstant = isFirstSpin.current;
    isFirstSpin.current = false;

    const spins = isInstant ? 0 : 5;
    const target = spins * 360 - spin.sectorIndex * SECTOR_ANGLE;

    setInstant(isInstant);
    setRotation(target);
  }, [rewards.lastWheelSpin]);

  const canRedeem =
    eligibleForRedeem(accessMode) &&
    rewards.pointsBalance >= rewards.pointsToRedeemSignal;

  const resultText = rewards.lastWheelSpin
    ? rewards.lastWheelSpin.rewardType === "POINTS"
      ? `${t.wheelWonPointsPrefix} +${rewards.lastWheelSpin.rewardValue} ${t.pointsUnit}`
      : rewards.lastWheelSpin.rewardType === "VOUCHER"
        ? t.wheelWonVoucher
        : t.wheelSectorEmpty
    : null;

  return (
    <section className="space-y-4">
      <div className="overflow-hidden rounded-[28px] border border-amber-300/20 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.22),transparent_42%),linear-gradient(145deg,#1a1610,#0b0d13)] p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-amber-300/80">
              {t.rewardsTitle}
            </p>
            <p className="mt-3 text-5xl font-semibold text-white">
              {rewards.pointsBalance}
            </p>
            <p className="mt-1 text-xs text-amber-100/70">{t.pointsBalance}</p>
          </div>
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-300/10 text-amber-300">
            <Coins className="h-6 w-6" />
          </div>
        </div>
        <p className="mt-5 max-w-xl text-sm leading-6 text-slate-300">
          {t.rewardsLead}
        </p>
      </div>

      <Card className="border-white/10 bg-white/[0.045] text-white shadow-none">
        <CardContent className="p-5">
          <Button
            type="button"
            disabled={rewards.checkedInToday || checkinLoading}
            onClick={onCheckin}
            className={cn(
              "w-full",
              rewards.checkedInToday
                ? "bg-white/[0.06] text-slate-400 hover:bg-white/[0.06]"
                : "bg-amber-400 text-black hover:bg-amber-300",
            )}
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            {rewards.checkedInToday
              ? t.checkinDone
              : `${t.checkinButton} (+${rewards.pointsPerCheckin} ${t.pointsUnit})`}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/[0.045] text-white shadow-none">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Sparkles className="h-4 w-4 text-amber-300" />
            {t.wheelTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4 pb-6">
          <div className="relative" style={{ width: WHEEL_SIZE, height: WHEEL_SIZE }}>
            <div
              className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/3"
              style={{
                width: 0,
                height: 0,
                borderLeft: "9px solid transparent",
                borderRight: "9px solid transparent",
                borderTop: "16px solid #fbbf24",
              }}
            />
            <svg
              width={WHEEL_SIZE}
              height={WHEEL_SIZE}
              viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`}
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: instant
                  ? "none"
                  : "transform 3.2s cubic-bezier(0.17, 0.67, 0.32, 1.28)",
              }}
            >
              <circle cx={CENTER} cy={CENTER} r={RADIUS - 1} fill="#0b0d13" />
              {WHEEL_SECTORS.map((sector, index) => {
                const midAngle = index * SECTOR_ANGLE + SECTOR_ANGLE / 2;
                const labelPos = polarToCartesian(midAngle, RADIUS * 0.66);
                return (
                  <g key={index}>
                    <path
                      d={sectorPath(index)}
                      fill={SECTOR_FILLS[index]}
                      stroke="#0b0d13"
                      strokeWidth={2}
                    />
                    <text
                      x={labelPos.x}
                      y={labelPos.y}
                      fill={sector.type === "EMPTY" ? "#64748b" : "#0b0d13"}
                      fontSize={sector.type === "VOUCHER" ? 18 : 13}
                      fontWeight={700}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${midAngle}, ${labelPos.x}, ${labelPos.y})`}
                    >
                      {sectorLabel(sector)}
                    </text>
                  </g>
                );
              })}
              <circle cx={CENTER} cy={CENTER} r={22} fill="#0b0d13" stroke="#f59e0b" strokeWidth={2} />
            </svg>
          </div>

          <Button
            type="button"
            disabled={!rewards.wheelAvailableToday || spinLoading}
            onClick={onSpin}
            className={cn(
              "w-full",
              rewards.wheelAvailableToday
                ? "bg-amber-400 text-black hover:bg-amber-300"
                : "bg-white/[0.06] text-slate-400 hover:bg-white/[0.06]",
            )}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            {rewards.wheelAvailableToday ? t.spinButton : t.wheelDoneToday}
          </Button>

          {resultText ? (
            <p className="text-center text-sm font-medium text-amber-200">{resultText}</p>
          ) : null}
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/[0.045] text-white shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Ticket className="h-4 w-4 text-emerald-300" />
            {t.vouchersTitle}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {rewards.availableVouchers.length ? (
            <div className="space-y-2">
              {rewards.availableVouchers.map((voucher) => (
                <div
                  key={voucher.id}
                  className="flex items-center justify-between gap-4 rounded-xl border border-emerald-300/15 bg-emerald-300/[0.05] px-3 py-3"
                >
                  <div className="flex items-center gap-2">
                    <Gift className="h-4 w-4 text-emerald-300" />
                    <p className="text-sm">
                      {voucher.source === "WHEEL" ? t.voucherWheelSource : t.voucherPointsSource}
                    </p>
                  </div>
                  <Badge className="border-0 bg-emerald-400/10 text-emerald-300">
                    {voucher.market || t.voucherAnyMarket}
                  </Badge>
                </div>
              ))}
              <p className="pt-1 text-xs leading-5 text-slate-500">{t.voucherUseHint}</p>
            </div>
          ) : (
            <p className="py-6 text-center text-sm text-slate-500">{t.noVouchers}</p>
          )}
        </CardContent>
      </Card>

      {eligibleForRedeem(accessMode) ? (
        <Card className="border-amber-300/15 bg-amber-300/[0.05] text-white shadow-none">
          <CardContent className="space-y-3 p-5">
            <Button
              type="button"
              disabled={!canRedeem || redeemLoading}
              onClick={onRedeem}
              className="w-full bg-amber-400 text-black hover:bg-amber-300 disabled:bg-white/[0.06] disabled:text-slate-400"
            >
              <Gift className="mr-2 h-4 w-4" />
              {t.redeemButton} · {rewards.pointsToRedeemSignal} {t.pointsUnit}
            </Button>
            {!canRedeem ? (
              <p className="text-center text-xs leading-5 text-slate-400">
                {t.redeemInsufficientPoints}
              </p>
            ) : null}
          </CardContent>
        </Card>
      ) : null}
    </section>
  );
};
