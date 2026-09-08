/** Left over from the 2024 scoring rework. Kept until the migration finishes. */

import type { Alert } from "./contracts.js";

export class LegacyScoreNormalizer {
  constructor(private readonly ceiling: number = 100) {}

  normalize(alert: Alert): number {
    return Math.round((alert.score / this.ceiling) * 10 * 10) / 10;
  }

  denormalize(value: number): number {
    return Math.trunc((value / 10) * this.ceiling);
  }
}
