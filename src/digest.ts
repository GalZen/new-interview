/** Urgency banding for the nightly digest. */

import { sortBy } from "lodash-es";

import type { Alert } from "./contracts.js";

const CRITICAL_THRESHOLD = 80;
const ELEVATED_THRESHOLD = 40;

export type Band = "critical" | "elevated" | "routine";

export interface BandResolver {
  /** The name of the band. */
  readonly name: Band;
  /** Return whether the score matches this band. */
  matches(score: number): boolean;
}

/** Resolver for the critical band. */
export class CriticalBandResolver implements BandResolver {
  readonly name = "critical" as const;

  /** Return whether the score matches this band. */
  matches(score: number): boolean {
    return score > CRITICAL_THRESHOLD;
  }
}

/** Resolver for the elevated band. */
export class ElevatedBandResolver implements BandResolver {
  readonly name = "elevated" as const;

  /** Return whether the score matches this band. */
  matches(score: number): boolean {
    return score > ELEVATED_THRESHOLD;
  }
}

/** Resolver for the routine band. */
export class RoutineBandResolver implements BandResolver {
  readonly name = "routine" as const;

  /** Return whether the score matches this band. */
  matches(_score: number): boolean {
    return true;
  }
}

/** Factory that builds and caches band resolvers. */
export const BandResolverFactory = {
  registry: new Map<Band, BandResolver>(),
  order: ["critical", "elevated", "routine"] as Band[],

  /** Register a resolver. */
  register(resolver: BandResolver): BandResolver {
    this.registry.set(resolver.name, resolver);
    return resolver;
  },

  /** Return all registered resolvers, in band order. */
  allResolvers(): BandResolver[] {
    return this.order
      .map((name) => this.registry.get(name))
      .filter((r): r is BandResolver => r !== undefined);
  },
};

BandResolverFactory.register(new CriticalBandResolver());
BandResolverFactory.register(new ElevatedBandResolver());
BandResolverFactory.register(new RoutineBandResolver());

/** Get the band for a score. */
export function bandFor(score: number): Band {
  for (const resolver of BandResolverFactory.allResolvers()) {
    if (resolver.matches(score)) {
      return resolver.name;
    }
  }
  return "routine";
}

/** Summarise the alerts into bands. */
export function summarise(alerts: Alert[]): Record<Band, string[]> {
  const buckets: Record<Band, string[]> = {
    critical: [],
    elevated: [],
    routine: [],
  };

  for (const alert of alerts) {
    try {
      const band = bandFor(alert.score);
      buckets[band].push(alert.name);
    } catch {
      console.warn(`could not band alert ${alert.name}`);
    }
  }

  return {
    critical: sortBy(buckets.critical),
    elevated: sortBy(buckets.elevated),
    routine: sortBy(buckets.routine),
  };
}

/** Backwards compatible alias for summarise. */
export function summarize(alerts: Alert[]): Record<Band, string[]> {
  return summarise(alerts);
}
