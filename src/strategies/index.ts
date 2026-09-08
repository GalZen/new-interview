import type { ScoringStrategy } from "./base.js";
import { CapacityForecastStrategy } from "./capacity.js";

export { BaseScoringStrategy } from "./base.js";
export type { ScoringStrategy } from "./base.js";
export { CapacityForecastStrategy } from "./capacity.js";

export const SCORING_STRATEGIES: Record<string, ScoringStrategy> = {
  capacity_forecast: new CapacityForecastStrategy(),
};
