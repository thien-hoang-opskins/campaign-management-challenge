# VS-03 Decisions

## DEC-01: Use Pagination Controls Instead of Infinite Scroll

### Context

`VS-03` allows either paginated lists or infinite-scroll. Existing backend already returned page metadata.

### Alternatives Considered

1. Implement infinite-scroll list with query chaining.
2. Implement explicit previous/next pagination controls.

### Decision

Use explicit pagination controls in `CampaignListPage`.

### Consequences

- Minimal implementation complexity while fully satisfying acceptance criteria.
- Easier manual verification and deterministic navigation behavior.

---

## DEC-02: Add Explicit Unknown Status Visual Fallback

### Context

`VS-03` requires explicit fallback mapping for unknown statuses. Previous implementation had fallback text but no distinct fallback style contract.

### Alternatives Considered

1. Keep implicit fallback via dynamic class names.
2. Map unknown statuses to dedicated class + label.

### Decision

Map unknown statuses to `status-unknown` class with explicit badge colors and label.

### Consequences

- UI behavior remains stable if backend contract expands with new statuses.
- Requirement is satisfied with explicit fallback semantics, not accidental styling.

---

## DEC-03: Add a VS-03 Seeder for Manual Verification

### Context

Badge color mapping is easiest to verify with campaigns in each known status.

### Alternatives Considered

1. Rely on ad-hoc manual DB edits or future flows to create statuses.
2. Add a dedicated seeder for list-status examples.

### Decision

Add `20260424000400-seed-vs03-list-data.js` and package scripts for seed/undo.

### Consequences

- Faster QA and demo setup for list/status behavior.
- Keeps reproducible verification data close to the story implementation.
