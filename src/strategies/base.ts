/**
 * Scoring strategies.
 *
 * Part of an in-progress migration away from the conditional block in
 * engine.ts. Only capacity_forecast has been moved over so far.
 */

import type { Alert } from "../contracts.js";

export interface ScoringStrategy {
  /** Advance the alert by one day, in place. */
  apply(alert: Alert): void;
}

export abstract class BaseScoringStrategy implements ScoringStrategy {
  abstract apply(alert: Alert): void;
}
