---
title: "How to Calculate Risk per Trade: the 1% Rule, Losing Streaks and Drawdown"
description: How much of your account to risk on one trade, why losing streaks decide the answer, and the simple maths of drawdown and recovery every trader should know.
date: 2026-11-12
image: /og-trading.jpg
service: /nics-trading-software
cta: Set your risk once in NICS AI Trader, and every signal card shows the money at risk and the lot size for your account.
ctaButton: Try NICS AI Trader
---

Risk per trade is the amount you lose if a trade hits its stop. It is the setting that decides whether a normal bad week is an annoyance or the end of your account.

## The calculation

**Risk amount = account balance × risk percent**

With $5,000 and 1% risk you risk $50 per trade. That number then decides the lot size: the wider the stop, the smaller the lot, so the loss at the stop is always the same $50. (Step by step: [how to calculate lot size](/blog/how-to-calculate-lot-size-forex/).)

Risk is set in money, not in lots. "I always trade 0.1 lots" means your risk changes with every stop distance — sometimes $20, sometimes $200.

## Why 0.5–2% is the usual range

Every strategy has losing streaks, including good ones. Ten losses in a row is not rare over a few hundred trades. Here is what ten consecutive losses do to an account at different risk levels:

| Risk per trade | Drawdown after 10 losses in a row |
|---|---|
| 0.5% | 4.9% |
| 1% | 9.6% |
| 2% | 18.3% |
| 5% | 40.1% |

At 1% a bad streak costs about a tenth of the account. At 5% it costs two fifths — and the way back is much longer than the way down.

## Drawdown and recovery

Losses and gains are not symmetrical. To get back to where you started you need:

| Drawdown | Gain needed to recover |
|---|---|
| 10% | 11.1% |
| 20% | 25% |
| 40% | 66.7% |
| 50% | 100% |

That is the main reason professional traders keep risk small: not because they expect to lose, but because a deep hole is very hard to climb out of.

## How to choose your number

1. **Start from the worst week you can accept.** If losing 10% in a bad run is your limit, 1% per trade fits.
2. **Count open trades together.** Three open positions at 1% each is 3% at risk at the same time.
3. **Watch correlation.** Long EUR/USD and long GBP/USD are both bets against the dollar; together they behave more like one larger trade.
4. **Lower risk after a drawdown, not higher.** Increasing size to "win it back" is how drawdowns become blow-ups.
5. **Set a daily or weekly loss limit** — for example 3% a day — after which you stop trading until the next period.

## Risk in R

Once your risk is fixed, it is useful to measure results in **R**, where 1R is the amount you risk. A trade that makes twice the risk is +2R; a full stop is −1R. R makes results comparable across instruments and account sizes, and it is how the [risk-to-reward ratio](/blog/risk-to-reward-ratio/) is usually expressed.

## How NICS AI Trader uses it

In [NICS AI Trader](/nics-trading-software/) you set your balance, account currency and risk once. Every signal card then shows the money at risk, the exact lot and the lot rounded to your broker's step, plus the loss if you are forced to use the minimum lot. The public [track record](/trading/#track-record) is kept in R, so you can see how a 1R loss and a +2R win add up over hundreds of strong signals — drawdowns included.

> Trading involves substantial risk. Choose a risk level you can afford to lose; past results do not guarantee future ones.
