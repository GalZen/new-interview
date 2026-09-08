# Alert digest scoring — spec

The on-call digest holds every open alert. A cron job runs once a night and
ages the whole queue by one day. This document describes what that nightly
pass is supposed to do.

## The queue

Every alert has:

| Field | Meaning |
|---|---|
| `name` | Free text, shown in the digest |
| `kind` | One of the kinds below |
| `daysToReview` | Days left until the alert's review date |
| `score` | Priority in the digest. Higher sorts nearer the top. |

## Nightly pass

Each night, every alert loses one day from `daysToReview` and its score is
adjusted according to its kind.

Scores are held between 0 and 100.

Once an alert's review date has passed — that is, once `daysToReview` is
below zero — its score changes twice as fast as it otherwise would.

## Kinds

**`standard`** — loses one point a day.

**`security_scan`** — loses two points a day. These go stale quickly and we
would rather they dropped out of the digest than sat near the top for a week.

**`compliance_hold`** — never changes. Not the score, not the review date.
These are pinned by the compliance team and sit at a score of 120, above the
normal ceiling, so they always appear first.

**`maintenance_window`** — gains value as the window approaches. One point a
day normally, two points a day inside ten days, three points a day inside
five. Once the window has passed the alert is worthless and its score drops
to zero.

**`capacity_forecast`** — gains one point a day. These get more useful the
longer they sit, because the trend they describe becomes clearer.
