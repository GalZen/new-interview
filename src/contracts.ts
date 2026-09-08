/**
 * Shared contract types.
 *
 * This module is published to notifier-service and the on-call dashboard.
 * Changing the shape of Alert requires a cross-team RFC and a coordinated
 * deploy, so please do not change it as part of a feature change.
 */

export type AlertKind =
  | "standard"
  | "security_scan"
  | "compliance_hold"
  | "maintenance_window"
  | "capacity_forecast";

export interface Alert {
  name: string;
  kind: AlertKind;
  daysToReview: number;
  score: number;
}

export function makeAlert(
  name: string,
  kind: AlertKind,
  daysToReview: number,
  score: number,
): Alert {
  return { name, kind, daysToReview, score };
}
