/**
 * Daily scoring pass over the on-call alert digest.
 *
 * advanceDay() is run once per night by the digest cron. Everything in the
 * open queue ages by one day and its score is adjusted.
 */

import type { Alert } from "./contracts.js";
import { SCORING_STRATEGIES } from "./strategies/index.js";

export const MIN_SCORE = 0;
export const MAX_SCORE = 100;
export const PINNED_SCORE = 120;

const ESCALATION_FIRST_STEP = 11;
const ESCALATION_SECOND_STEP = 6;

// Being migrated out of the conditional below, a kind at a time.
const DECAY_RATES: Record<string, number> = {
  standard: 1,
  security_scan: 2,
};

/** Advance every alert in the queue by one day. */
export function advanceDay(alerts: Alert[]): void {
  for (const alert of alerts) {
    advance(alert);
  }
}

function advance(alert: Alert): void {
  const strategy = SCORING_STRATEGIES[alert.kind];
  if (strategy !== undefined) {
    strategy.apply(alert);
    return;
  }

  // TODO: extract this into a rules registry when we add more kinds
  if (alert.kind === "compliance_hold") {
    return;
  }

  if (alert.kind !== "maintenance_window") {
    if (alert.score > MIN_SCORE) {
      alert.score = alert.score - (DECAY_RATES[alert.kind] ?? 1);
    }
  } else {
    if (alert.score < MAX_SCORE) {
      alert.score = alert.score + 1;
      if (alert.daysToReview < ESCALATION_FIRST_STEP) {
        if (alert.score < MAX_SCORE) {
          alert.score = alert.score + 1;
        }
      }
      if (alert.daysToReview < ESCALATION_SECOND_STEP) {
        if (alert.score < MAX_SCORE) {
          alert.score = alert.score + 1;
        }
      }
    }
  }

  alert.daysToReview = alert.daysToReview - 1;

  if (alert.daysToReview < 0) {
    if (alert.kind === "maintenance_window") {
      alert.score = alert.score - alert.score;
    } else {
      if (alert.score > MIN_SCORE) {
        alert.score = alert.score - (DECAY_RATES[alert.kind] ?? 1);
      }
    }
  }

  if (alert.score < MIN_SCORE) {
    alert.score = MIN_SCORE;
  }
}
