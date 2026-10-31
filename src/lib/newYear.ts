import { HALLOWEEN_END_MS } from "@/lib/halloween";

// New Year 2027 theme (Alexander, 2026-10-31): switches itself on the moment
// Halloween ends (31.10 23:59 Sofia time) and off on 15.01.2027 23:59 Sofia
// time (proposed date, change NEW_YEAR_END_MS if Alexander picks another).
// Theme only: no promo code, no bonus credits.
export const NEW_YEAR_START_MS = HALLOWEEN_END_MS;
export const NEW_YEAR_END_MS = Date.parse("2027-01-15T22:00:00Z");

export const isNewYear = (now = Date.now()) => now >= NEW_YEAR_START_MS && now < NEW_YEAR_END_MS;
