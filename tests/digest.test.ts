import { describe, expect, it, vi } from "vitest";

import { makeAlert } from "../src/index.js";
import {
  BandResolverFactory,
  bandFor,
  summarise,
  summarize,
} from "../src/digest.js";

describe("bandFor", () => {
  it("returns critical for a high score", () => {
    expect(bandFor(81)).toBe("critical");
  });

  it("returns elevated for a middling score", () => {
    expect(bandFor(79)).toBe("elevated");
  });

  it("returns routine for a low score", () => {
    expect(bandFor(10)).toBe("routine");
  });
});

describe("summarise", () => {
  it("groups alerts by band", () => {
    const alerts = [
      makeAlert("disk pressure", "standard", 3, 95),
      makeAlert("cert expiry", "standard", 9, 55),
      makeAlert("log volume", "standard", 20, 12),
    ];
    const result = summarise(alerts);
    expect(result.critical).toEqual(["disk pressure"]);
    expect(result.elevated).toEqual(["cert expiry"]);
    expect(result.routine).toEqual(["log volume"]);
  });

  it("resolves bands through the factory for every alert", () => {
    const spy = vi.spyOn(BandResolverFactory, "allResolvers");
    const alerts = [
      makeAlert("a", "standard", 1, 10),
      makeAlert("b", "standard", 1, 90),
    ];
    summarise(alerts);
    expect(spy).toHaveBeenCalledTimes(2);
    spy.mockRestore();
  });

  it("sorts names within a band", () => {
    const alerts = [
      makeAlert("zebra", "standard", 1, 10),
      makeAlert("apple", "standard", 1, 10),
    ];
    expect(summarise(alerts).routine).toEqual(["apple", "zebra"]);
  });

  it("handles an empty queue", () => {
    expect(summarise([])).toEqual({ critical: [], elevated: [], routine: [] });
  });
});

describe("summarize alias", () => {
  it("still works", () => {
    expect(summarize([])).toEqual({ critical: [], elevated: [], routine: [] });
  });
});
