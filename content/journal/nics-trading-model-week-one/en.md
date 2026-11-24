---
title: "Training our own trading model from scratch: week one of NICS Trading"
description: "A 166-thousand-parameter Transformer, an ordinary laptop instead of rented GPUs, nightly self-learning, and a counting mistake we caught ourselves."
date: 2026-11-22
image: /og-trading.jpg
service: /trading
cta: "NICS Trading Ecosystem is the platform this work happens inside: technical analysis on 37 instruments, open statistics and a Windows app."
ctaButton: Open NICS Trading Ecosystem
---

NICS has three directions: language, vision and markets. This week we got serious about the third one and started training our own trading model, NICS Trading. There is no ready-made "big" model under the hood: the architecture, the weights and the training are ours from the first step.

## What the model is

It is a small Transformer: three blocks, 166,532 parameters. Tiny by the standards of today's language models, and that is on purpose. The model sees the last 96 candles of one instrument on any timeframe, from one minute to one week. Each candle comes in normalised form: move, range and wicks in ATR units, volatility regime, time of day and day of week, distance to levels, indicators and candle patterns.

It has two outputs, or "heads":

- **Where price goes.** Down, sideways or up after a set number of candles; "sideways" means within half an ATR.
- **Whether a trade reaches its first target before its stop.** This is the key question for every setup our scanner finds.

## What it learns from

Only data we collected ourselves or took from open sources: broker candles on every timeframe, every trade idea the scanner produced with its real outcome, shadow strategies and our own trades. On top of that there is long public history since 2008 for 19 instruments. It is used for training only and never enters the evaluation sets.

The data is split by time into training, validation and test, with a gap between them so the future cannot leak into the past. Every trade outcome is recomputed from candles. If one candle touched both the target and the stop, we count it as a loss.

## An ordinary laptop instead of a data centre

All training runs on the CPU of an ordinary laptop; we rent no GPUs. The first training from scratch, on 19 November, took 21 minutes. The weights never leave the laptop: only metrics go to the server, so the team can see them on an internal dashboard.

Every night a self-learning cycle runs. The current best model, the "champion", is re-checked on fresh data, a "challenger" is fine-tuned next to it, and once a week another one is trained from scratch. A challenger replaces the champion only if it beats it on validation on the same new data. The test set is report-only; nothing is chosen by it.

## Honest first numbers

The first champion **cannot** predict price direction yet. On the test set it got 43.4% of moves right, while the naive rule "always answer the most common case" would get 48.9%. That is worse than the simple rule, and we say so plainly.

The question "will the setup reach its target" is more interesting. Quality there is measured with AUC, where 0.5 is a coin flip and 1.0 is a perfect prediction. The first champion scored 0.589 on the test set. Weak, but no longer random.

> All of this is measured on past data and is not a forecast. The model does not trade and does not influence anything yet.

## A mistake we caught ourselves

We compared the model with the scanner: which one picks the direction correctly more often. The first summary looked too good. When we dug in, it turned out the scanner re-saves the same idea every three minutes. That made about a thousand records a day, while roughly fifty actually reach users. One good day was being counted dozens of times.

We fixed the count: the summary now includes only what was actually delivered to users, and repeats are reported separately. A simple lesson, but an important one: before you celebrate a number, check what you are counting.

## Where the model is now

The model runs "in the shadow". Every two minutes it looks at the fresh technical analysis users received and sends the team its opinion: whether it agrees with the direction and what plan it would choose itself. Users, trading accounts and the platform's logic are not changed.

The decision is 2–4 weeks of observation, including bad market days, and only then a conversation about whether the model may influence anything.

## What comes next

The next step is a rules registry. We rewrite classic technical-analysis ideas as code with our own parameters. Every rule first lives in the shadow, and the model learns from it only if it has proven useful on new data. That will be the next entry in this journal.
