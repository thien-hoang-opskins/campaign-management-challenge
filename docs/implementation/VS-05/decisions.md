# VS-05 Decisions

## DEC-01: Keep Existing Draft Guard and Expand Test Coverage

### Context

The backend already enforced draft-only mutation via `ensureDraftOnlyMutation`, but lacked explicit endpoint-level tests for patch/delete allowed vs blocked scenarios.

### Alternatives Considered

1. Refactor draft guard implementation and then test.
2. Keep implementation and add integration-style endpoint tests.

### Decision

Keep existing guard logic and add `campaignDraftGuards.test.ts` with four transition cases.

### Consequences

- Lower implementation risk.
- Direct verification of contract-level behavior (`409` + machine-readable code).

---

## DEC-02: Add Edit UI in Existing Detail Page

### Context

`VS-05` is user-facing for both edit and delete. Delete existed, but edit action was missing in UI despite `PATCH` endpoint support.

### Alternatives Considered

1. Create a dedicated edit route/page.
2. Add lightweight edit form to current detail page.

### Decision

Add draft-only edit form to `CampaignDetailPage`.

### Consequences

- Story becomes complete from user perspective with minimal routing complexity.
- Mutation feedback and state refresh reuse existing query invalidation pattern.

---

## DEC-03: Reuse Existing Error Surface for Invalid State Rejections

### Context

Backend already returns standardized error envelope; frontend should not introduce separate error mechanisms for invalid state.

### Alternatives Considered

1. Add bespoke toast/channel for edit/delete only.
2. Reuse existing page-level `ErrorAlert`.

### Decision

Continue using `ErrorAlert` with mutation error message precedence.

### Consequences

- Consistent UX for all action failures.
- No additional UI infrastructure required for this story.
