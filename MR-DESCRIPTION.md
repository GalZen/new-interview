# AD-407: add urgency banding to the digest

**Author:** Ravit L.  ·  **Branch:** `mr/AD-407` → `master`  ·  **CI:** passing (26 tests)

Dana asked for the nightly digest email to be grouped by urgency instead of
being one long list, so people can see at a glance whether anything needs
attention tonight.

Adds `src/digest.ts` with a `summarise()` that takes the queue and
returns alert names grouped into three bands:

| Band | Score |
|---|---|
| critical | 80 and above |
| elevated | 40 to 79 |
| routine | below 40 |

Names are sorted within each band so the output is stable between runs.

Also renamed `advance` to `applyDailyChange` in `engine.ts` while I was in
there - the old name did not say what it did.

Tests included. Nothing else calls into this yet; the email template change is
a separate ticket.
