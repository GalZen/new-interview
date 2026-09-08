# alert-digest

Scoring service for the on-call alert digest. A nightly cron calls
`advanceDay()` over the open queue.

```
src/
  contracts.ts        Alert. Published to other services - see the note in the file.
  engine.ts           The nightly pass.
  strategies/         Per-kind scoring. Partially migrated.
  legacy.ts           Older helpers.
tests/
  engine.test.ts
```

## Running

```
npm install
npm test
npm run typecheck
```

See `SPEC.md` for what the scoring is meant to do.
