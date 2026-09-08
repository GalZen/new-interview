import type { Alert } from "../contracts.js";
import { BaseScoringStrategy } from "./base.js";

const MAX_SCORE = 100;

/** Capacity forecasts become more useful the longer they sit. */
export class CapacityForecastStrategy extends BaseScoringStrategy {
  apply(alert: Alert): void {
    if (alert.score < MAX_SCORE) {
      alert.score = alert.score + 1;
    }

    alert.daysToReview = alert.daysToReview - 1;

    if (alert.daysToReview < 0) {
      if (alert.score < MAX_SCORE) {
        alert.score = alert.score + 1;
      }
    }
  }
}
