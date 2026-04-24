# VS-04 Decisions

## DEC-01: Explicitly Fetch Detail and Stats as Separate Queries

### Context

`VS-04` frontend subtask explicitly references detail and stats APIs. Previous page only consumed detail endpoint payload (which already embedded stats).

### Alternatives Considered

1. Keep single detail query and rely on embedded stats.
2. Fetch detail and stats endpoints explicitly.

### Decision

Fetch both endpoints explicitly in `CampaignDetailPage`.

### Consequences

- Better alignment with story contract wording.
- Keeps stats endpoint exercised by real UI flow.

---

## DEC-02: Add Dedicated VS-04 Backend Tests for Error Paths and Stats Contract

### Context

Existing coverage lacked targeted tests for `VS-04` ownership/not-found behavior and required stats contract values.

### Alternatives Considered

1. Rely on existing generic tests.
2. Add focused backend tests for VS-04 scenarios.

### Decision

Add `backend/tests/campaignDetailStats.test.ts` with service-level and request-level checks.

### Consequences

- Protects against regressions in critical detail/stats authorization behavior.
- Provides direct acceptance-criteria evidence.

---

## DEC-03: Provide VS-04 Seeder for Deterministic Detail/Stats QA

### Context

Manual verification of stats visualization is faster with a known campaign containing sent/failed/opened variations.

### Alternatives Considered

1. Manual DB edits for each QA run.
2. Add deterministic story seed data.

### Decision

Add `20260424000500-seed-vs04-detail-stats-data.js` and seed/undo scripts.

### Consequences

- Repeatable QA setup for detail/stats flows.
- Reduced setup friction for reviewers and future stories.
