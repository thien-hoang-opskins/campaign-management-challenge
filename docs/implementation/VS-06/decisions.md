# VS-06 Decisions

## DEC-01: Keep Schedule Rule in Domain Service

### Context

Existing scheduling behavior already enforced future-only time and draft-only lifecycle through domain/service checks.

### Alternatives Considered

1. Rework schedule logic in controller layer.
2. Keep domain/service checks and strengthen tests.

### Decision

Keep `ensureDraftOnlyMutation` + `ensureFutureSchedule` as the authoritative backend rules.

### Consequences

- Centralized lifecycle logic remains reusable across endpoints.
- Behavior hardening achieved via tests rather than risky refactors.

---

## DEC-02: Add Client-Side Future-Time Validation

### Context

`VS-06` requires clear rejection for past/current timestamps. Backend already returns error, but UX can fail faster for obvious invalid inputs.

### Alternatives Considered

1. Rely only on backend validation.
2. Add lightweight frontend pre-submit checks + keep backend as source of truth.

### Decision

Add in-page timestamp parsing/future checks before schedule mutation.

### Consequences

- Better user feedback latency.
- No contract drift because backend validation still enforces final rule.

---

## DEC-03: Add Integration-Style Endpoint Tests for Scheduling

### Context

Prior coverage only tested rule utility behavior, not endpoint wiring and mutation semantics.

### Alternatives Considered

1. Keep unit-rule tests only.
2. Add endpoint-level tests for success and failure paths.

### Decision

Add `backend/tests/campaignSchedule.test.ts`.

### Consequences

- Stronger confidence in transition contract and error semantics.
- Captures regressions in middleware/controller/service integration.
