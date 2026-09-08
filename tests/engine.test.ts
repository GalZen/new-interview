import { describe, expect, it } from "vitest";

import { advanceDay, makeAlert } from "../src/index.js";
import type { Alert, AlertKind } from "../src/index.js";

function run(kind: AlertKind, days: number, score: number, times = 1): Alert {
  const alert = makeAlert("test", kind, days, score);
  for (let i = 0; i < times; i++) {
    advanceDay([alert]);
  }
  return alert;
}

describe("standard alerts", () => {
  it("loses a point a day", () => {
    const alert = run("standard", 5, 10);
    expect(alert.score).toBe(9);
    expect(alert.daysToReview).toBe(4);
  });

  it("decays twice as fast once the review date is reached", () => {
    expect(run("standard", 0, 10).score).toBe(8);
  });

  it("never goes negative", () => {
    expect(run("standard", 5, 0).score).toBe(0);
  });

  it("holds up over several days", () => {
    const alert = run("standard", 3, 10, 3);
    expect(alert.score).toBe(7);
    expect(alert.daysToReview).toBe(0);
  });
});

describe("security scans", () => {
  it("decays at double rate", () => {
    expect(run("security_scan", 5, 10).score).toBe(8);
  });

  it("decays at quadruple rate once overdue", () => {
    expect(run("security_scan", 0, 10).score).toBe(6);
  });

  it("floors at zero", () => {
    expect(run("security_scan", 5, 1).score).toBe(0);
  });
});

describe("compliance holds", () => {
  it("never changes", () => {
    const alert = run("compliance_hold", 5, 120);
    expect(alert.score).toBe(120);
    expect(alert.daysToReview).toBe(5);
  });

  it("is unchanged even when long overdue", () => {
    const alert = run("compliance_hold", -30, 120);
    expect(alert.score).toBe(120);
    expect(alert.daysToReview).toBe(-30);
  });
});

describe("maintenance windows", () => {
  it("gains a point when far out", () => {
    expect(run("maintenance_window", 15, 20).score).toBe(21);
  });

  it("gains two inside ten days", () => {
    expect(run("maintenance_window", 10, 20).score).toBe(22);
  });

  it("gains three inside five days", () => {
    expect(run("maintenance_window", 5, 20).score).toBe(23);
  });

  it("drops to zero once the window passes", () => {
    expect(run("maintenance_window", 0, 20).score).toBe(0);
  });

  it("is capped at one hundred", () => {
    expect(run("maintenance_window", 5, 99).score).toBe(100);
  });
});

describe("capacity forecasts", () => {
  it("gains a point a day", () => {
    const alert = run("capacity_forecast", 5, 10);
    expect(alert.score).toBe(11);
    expect(alert.daysToReview).toBe(4);
  });

  it("gains over several days", () => {
    const alert = run("capacity_forecast", 10, 10, 4);
    expect(alert.score).toBe(14);
    expect(alert.daysToReview).toBe(6);
  });

  it("is capped at one hundred", () => {
    expect(run("capacity_forecast", 5, 100).score).toBe(100);
  });
});

describe("the queue", () => {
  it("touches every alert", () => {
    const queue: Alert[] = [
      makeAlert("a", "standard", 5, 10),
      makeAlert("b", "security_scan", 5, 10),
      makeAlert("c", "capacity_forecast", 5, 10),
    ];
    advanceDay(queue);
    expect(queue.map((a) => a.score)).toEqual([9, 8, 11]);
    expect(queue.map((a) => a.daysToReview)).toEqual([4, 4, 4]);
  });
});
