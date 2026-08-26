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
  /*
   * Incremented by the parent every time a spin request comes back.
   * Comparing spin *values* is not enough to know a spin happened:
   * WheelSpinResult carries no timestamp, so two spins that land on
   * the same sector look identical, and any other action that
   * refreshes the dashboard hands back an equal-but-new object. This
   * counter is the only unambiguous "the user just span" signal.
   */
  spinNonce: number;
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
const WHEEL_SIZE = 260;
const CENTER = WHEEL_SIZE / 2;
/*
 * The rim is drawn as a thick ring inside the viewBox, so the sectors
 * stop short of the edge and the wheel reads as a physical object with
 * a raised border rather than a flat pie chart.
 */
const RIM_WIDTH = 13;
const RADIUS = WHEEL_SIZE / 2 - RIM_WIDTH;
const HUB_RADIUS = 26;
const TURNS = 6;

/*
 * Casino palette: near-black and deep crimson alternate the way a
 * roulette wheel does, gold carries the point sectors, emerald marks
 * the one sector that pays a voucher. Each sector also gets a paired
 * darker shade so it can be filled with a gradient instead of a flat
 * colour -- that gradient is what makes it look bevelled.
 */
const SECTOR_FILLS: Array<[string, string]> = [
  ["#1f2937", "#0b0f18"],
  ["#fbbf24", "#b45309"],
  ["#3f1d1d", "#180a0a"],
  ["#fcd34d", "#c2740a"],
  ["#fbbf24", "#b45309"],
  ["#fcd34d", "#c2740a"],
  ["#34d399", "#047857"],
  ["#fde68a", "#d97706"],
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
  spinNonce,
  onCheckin,
  onSpin,
  onRedeem,
}: RewardsCabinetProps) => {
  const [rotation, setRotation] = useState(0);
  const [instant, setInstant] = useState(true);
  const [spinning, setSpinning] = useState(false);
  const handledNonce = useRef(spinNonce);

  /*
   * Where the wheel has to stop for `sectorIndex` to sit under the
   * pointer at twelve o'clock. Sector i covers [i*45, (i+1)*45]
   * clockwise from the top, so its MIDDLE is at i*45 + 22.5 -- the
   * half-sector term is what was missing before, which is why the
   * pointer always came to rest exactly on a divider line.
   */
  const landingAngle = (sectorIndex: number) =>
    -(sectorIndex * SECTOR_ANGLE + SECTOR_ANGLE / 2);

  /* Restore the last known result on first paint, without animating. */
  useEffect(() => {
    const spin = rewards.lastWheelSpin;
    if (!spin) return;
    setInstant(true);
    setRotation(landingAngle(spin.sectorIndex));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (spinNonce === handledNonce.current) return;
    handledNonce.current = spinNonce;

    const spin = rewards.lastWheelSpin;
    if (!spin) return;

    const landing = landingAngle(spin.sectorIndex);

    setInstant(false);
    setSpinning(true);
    setRotation((current) => {
      /*
       * Keep turning forwards. The landing angle is only defined
       * modulo 360, so pick the multiple that sits at least TURNS
       * full revolutions ahead of wherever the wheel is resting --
       * otherwise a new result behind the current one would make the
       * wheel crawl backwards instead of spinning.
       */
      const turnsAhead = Math.ceil((current + TURNS * 360 - landing) / 360);
      return landing + turnsAhead * 360;
    });
  }, [spinNonce, rewards.lastWheelSpin]);

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
          {/*
            * The tilt lives on a wrapper, not on the spinning SVG:
            * the wheel has to keep turning around its own axis, so
            * rotateX has to be applied by an element above it.
            */}
          <div
            className="relative"
            style={{ width: WHEEL_SIZE, height: WHEEL_SIZE, perspective: 900 }}
          >
            <div
              className="relative h-full w-full"
              style={{ transform: "rotateX(16deg)", transformStyle: "preserve-3d" }}
            >
              {/* Contact shadow, so the wheel sits on the card instead of floating. */}
              <div
                aria-hidden
                className="absolute left-1/2 bottom-[-14px] -translate-x-1/2 rounded-[50%]"
                style={{
                  width: WHEEL_SIZE * 0.78,
                  height: 18,
                  background:
                    "radial-gradient(ellipse at center, rgba(0,0,0,0.55), transparent 70%)",
                }}
              />

              <div
                aria-hidden
                className="absolute left-1/2 top-[-6px] z-20 -translate-x-1/2"
                style={{ filter: "drop-shadow(0 3px 4px rgba(0,0,0,0.6))" }}
              >
                <svg width="26" height="30" viewBox="0 0 26 30">
                  <defs>
                    <linearGradient id="nics-wheel-pointer" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#fde68a" />
                      <stop offset="45%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#b45309" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M13 29 L2 7 A 12 12 0 0 1 24 7 Z"
                    fill="url(#nics-wheel-pointer)"
                    stroke="#78350f"
                    strokeWidth="1.2"
                    strokeLinejoin="round"
                  />
                  <circle cx="13" cy="8" r="3" fill="#fffbeb" opacity="0.85" />
                </svg>
              </div>

              <svg
                width={WHEEL_SIZE}
                height={WHEEL_SIZE}
                viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`}
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transition: instant
                    ? "none"
                    : "transform 4.6s cubic-bezier(0.12, 0.68, 0.12, 1)",
                  filter: "drop-shadow(0 10px 18px rgba(0,0,0,0.55))",
                }}
                onTransitionEnd={() => setSpinning(false)}
              >
                <defs>
                  <linearGradient id="nics-wheel-rim" x1="0" y1="0" x2="0.6" y2="1">
                    <stop offset="0%" stopColor="#fde68a" />
                    <stop offset="28%" stopColor="#d97706" />
                    <stop offset="52%" stopColor="#7c4a06" />
                    <stop offset="74%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#6b3f05" />
                  </linearGradient>
                  <radialGradient id="nics-wheel-depth" cx="0.5" cy="0.5" r="0.5">
                    <stop offset="60%" stopColor="#000" stopOpacity="0" />
                    <stop offset="100%" stopColor="#000" stopOpacity="0.55" />
                  </radialGradient>
                  <radialGradient id="nics-wheel-hub" cx="0.35" cy="0.3" r="0.8">
                    <stop offset="0%" stopColor="#fef3c7" />
                    <stop offset="45%" stopColor="#d97706" />
                    <stop offset="100%" stopColor="#5b3405" />
                  </radialGradient>
                  {SECTOR_FILLS.map(([light, dark], index) => (
                    <linearGradient
                      key={index}
                      id={`nics-wheel-sector-${index}`}
                      x1="0"
                      y1="0"
                      x2="0.4"
                      y2="1"
                    >
                      <stop offset="0%" stopColor={light} />
                      <stop offset="100%" stopColor={dark} />
                    </linearGradient>
                  ))}
                </defs>

                <circle
                  cx={CENTER}
                  cy={CENTER}
                  r={WHEEL_SIZE / 2 - RIM_WIDTH / 2}
                  fill="none"
                  stroke="url(#nics-wheel-rim)"
                  strokeWidth={RIM_WIDTH}
                />

                {WHEEL_SECTORS.map((sector, index) => {
                  const midAngle = index * SECTOR_ANGLE + SECTOR_ANGLE / 2;
                  const labelPos = polarToCartesian(midAngle, RADIUS * 0.64);
                  const onDark = sector.type === "EMPTY";
                  return (
                    <g key={index}>
                      <path
                        d={sectorPath(index)}
                        fill={`url(#nics-wheel-sector-${index})`}
                        stroke="#3b2405"
                        strokeWidth={1.4}
                      />
                      <text
                        x={labelPos.x}
                        y={labelPos.y}
                        fill={onDark ? "#94a3b8" : "#1a1205"}
                        fontSize={sector.type === "VOUCHER" ? 19 : 15}
                        fontWeight={800}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        transform={`rotate(${midAngle}, ${labelPos.x}, ${labelPos.y})`}
                        style={{
                          textShadow: onDark
                            ? "none"
                            : "0 1px 0 rgba(255,255,255,0.35)",
                        }}
                      >
                        {sectorLabel(sector)}
                      </text>
                    </g>
                  );
                })}

                {/* Darkens the outer edge so the face reads as concave. */}
                <circle
                  cx={CENTER}
                  cy={CENTER}
                  r={RADIUS}
                  fill="url(#nics-wheel-depth)"
                  pointerEvents="none"
                />

                {/* Studs on the rim, the way a real wheel has them. */}
                {WHEEL_SECTORS.map((_, index) => {
                  const pos = polarToCartesian(index * SECTOR_ANGLE, RADIUS + 1);
                  return (
                    <circle
                      key={`stud-${index}`}
                      cx={pos.x}
                      cy={pos.y}
                      r={3}
                      fill="#fde68a"
                      stroke="#78350f"
                      strokeWidth={1}
                    />
                  );
                })}

                <circle
                  cx={CENTER}
                  cy={CENTER}
                  r={HUB_RADIUS}
                  fill="url(#nics-wheel-hub)"
                  stroke="#78350f"
                  strokeWidth={2}
                />
                <circle
                  cx={CENTER}
                  cy={CENTER}
                  r={HUB_RADIUS - 9}
                  fill="#120d06"
                  opacity={0.85}
                />
              </svg>
            </div>
          </div>

          <Button
            type="button"
            disabled={!rewards.wheelAvailableToday || spinLoading || spinning}
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

          {/*
            * Held back until the wheel actually stops -- announcing the
            * prize while it is still turning gives the result away and
            * makes the spin look decorative.
            */}
          {resultText && !spinning ? (
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
