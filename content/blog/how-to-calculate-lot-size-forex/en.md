---
title: "How to Calculate Lot Size in Forex (and Gold), With Worked Examples"
description: The one formula for position size, pip values for EUR/USD, USD/JPY and gold, rounding to your broker's lot step, and what to do when even the minimum lot is too big.
date: 2026-11-12
image: /og-trading.jpg
service: /nics-trading-software
cta: NICS AI Trader calculates the lot for every signal from your balance, your risk and your broker's MT5 contract specification.
ctaButton: See position sizing in NICS
---

Lot size is the one number in a trade that you fully control. The market decides where price goes; you decide how much you lose if you are wrong. Here is how to calculate it properly.

## The formula

**Lot size = risk amount ÷ (stop distance × value of one unit of that distance per lot)**

Three inputs:

1. **Risk amount** — how much money you accept to lose on this trade: balance × risk percent.
2. **Stop distance** — from your entry to your stop loss, in pips (forex) or in price (gold).
3. **Value per lot** — how much one pip (or one dollar of price) is worth for one standard lot.

## Example 1: EUR/USD

- Balance: $5,000, risk 1% → risk amount **$50**
- Stop: 25 pips
- For EUR/USD with a USD account, one pip on 1 standard lot (100,000 units) is worth **$10**

Lot = 50 ÷ (25 × 10) = **0.20 lots**. If the stop is hit, you lose 25 × $10 × 0.20 = $50, exactly your planned risk.

## Example 2: USD/JPY

For pairs quoted in yen, one pip is 0.01 and its value depends on the exchange rate. One pip on 1 lot = 100,000 × 0.01 = 1,000 JPY. At USD/JPY 150 that is 1,000 ÷ 150 ≈ **$6.67**.

- Risk $50, stop 30 pips → 50 ÷ (30 × 6.67) ≈ **0.25 lots**

## Example 3: Gold (XAU/USD)

Gold is usually quoted in dollars per ounce, and on most MT5 accounts 1 lot = **100 ounces** — but check your broker, contract sizes differ. With 100 oz, a $1 move in price is worth $100 per lot.

- Risk $50, stop $8 below the entry → 50 ÷ (8 × 100) = 0.0625 lots
- Your broker's lot step is 0.01, so round **down** to **0.06 lots**
- Real risk: 0.06 × 100 × 8 = **$48**

Always round down. Rounding up quietly increases the risk you decided on.

## Account in another currency

If your account is in euros, convert the risk amount first. With a €5,000 account and 1% risk you risk €50; at EUR/USD 1.08 that is $54, and you size the trade with $54.

## When the minimum lot is too big

Small accounts hit this often. Balance $500, risk 1% = $5, gold stop $8: the formula gives 0.00625 lots, but the minimum is 0.01. At 0.01 lots a stop costs $8 — that is 1.6% of the account, not 1%.

You have two honest options: skip the trade, or take it knowing the real risk is 1.6%. What you should not do is move the stop closer just to make the numbers fit — the stop belongs where the idea is wrong, not where the lot is convenient.

## Check margin too

Lot size decides risk; leverage decides margin. Make sure the margin for the position leaves enough free funds so that normal swings do not trigger a margin call before your stop is reached.

## Quick checklist

- Risk percent chosen before the trade (see [how to calculate risk per trade](/blog/how-to-calculate-risk-per-trade/))
- Stop placed where the idea is invalid
- Pip or point value taken from your broker's contract specification
- Lot rounded down to the broker's step
- Loss at the minimum lot checked on small accounts

## How NICS AI Trader helps

Every signal card in [NICS AI Trader](/nics-trading-software/) shows this calculation for you: the risk amount from your balance and risk setting, the exact lot, the lot rounded to the broker step, the loss at the minimum lot and the estimated margin. It uses the broker's MT5 contract specification, so gold, indices and yen pairs are sized correctly. If the specification or exchange rate is missing, the card says sizing is unavailable instead of guessing.

> Trading involves substantial risk. These examples illustrate the arithmetic; they are not trading advice.
