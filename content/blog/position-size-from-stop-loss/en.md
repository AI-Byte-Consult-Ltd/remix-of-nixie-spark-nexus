---
title: "How to Calculate Lot Size From Your Stop Loss: Formula and Two Examples"
description: A simple position size formula from risk per trade and stop distance, with worked examples for EUR/USD and gold, and three common lot size mistakes.
date: 2026-11-12
image: /og-trading.jpg
service: /trading#free
cta: Skip the arithmetic - paste the entry and stop from any signal and the calculator shows the lot that risks exactly the share of your deposit you chose.
ctaButton: Open the lot size calculator
---

Most losses of new traders come not from a bad entry but from the wrong size. The same signal can be a reasonable risk at 0.02 lots and a dangerous one at 0.5. So the lot is not chosen by feel; it comes from two numbers: how much you accept to lose on the trade and where the stop is.

## The formula

**Lot = Risk in money ÷ (Stop distance × Value of one price unit per 1 lot)**

- **Risk in money** is the share of your deposit you accept to lose if the stop is hit. A common guide is 0.5 to 2% of the deposit per trade.
- **Stop distance** is the difference between the entry price and the stop loss.
- **Value per 1 lot** is how much money one unit of price movement makes or costs at a size of 1 lot. You find it in your broker's instrument specification.

## Example 1. EUR/USD

Deposit 2,000 USD, risk 1% = **20 USD**. Entry 1.0850, stop 1.0825: **25 pips**. On EUR/USD one pip on 1 standard lot is worth about **10 USD**.

Lot = 20 ÷ (25 × 10) = **0.08 lots**.

If the stop is hit, you lose about 20 USD, exactly the planned 1%.

## Example 2. Gold (XAU/USD)

Same deposit, risk 20 USD. Entry 4000.00, stop 3990.00: a **10 USD** price distance. At most brokers 1 lot of gold is 100 ounces, so a 1 USD move is worth **100 USD** per lot and a 10 USD move is 1,000 USD.

Lot = 20 ÷ (10 × 100) = **0.02 lots**.

Note that with the same deposit and the same risk, the gold size is four times smaller than on EUR/USD. That is normal: gold moves more.

## Three common mistakes

1. **The same lot on every instrument.** 0.1 lots on EUR/USD and 0.1 lots on gold are completely different risks.
2. **Ignoring the contract size.** It can differ between brokers and account types (for example 100 or 10 ounces per gold lot, different index contracts). Check the specification in your terminal.
3. **Moving the stop after the calculation.** If you widened the stop, the risk grew: recalculate the lot.

## Also keep in mind

- Spread and commission make the real loss at the stop slightly larger.
- With several open trades on related instruments (for example gold and silver), the total risk adds up.
- Your broker's minimum lot step may not allow the exact size; round down.

Trading financial markets carries a high risk of losing money. The right position size does not make a trade profitable, but it keeps one mistake from wiping out the account.
