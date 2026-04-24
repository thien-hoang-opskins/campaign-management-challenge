# VS-09 Decisions

## DEC-01: Keep Recipient Endpoint Naming as `/recipients`

### Context

`VS-09` asks to standardize endpoint naming to `/recipients`.

### Alternatives Considered

1. Maintain mixed singular/plural forms.
2. Use plural-only `/recipients`.

### Decision

Keep and reinforce plural-only `/recipients` for list/create.

### Consequences

- Consistent REST resource naming across backend and frontend API layer.

---

## DEC-02: Adopt Idempotent Duplicate Email Policy

### Context

Story requires duplicate-email behavior to follow documented uniqueness policy.

### Alternatives Considered

1. Return conflict (`409`) on duplicate email.
2. Return existing recipient (idempotent create behavior).

### Decision

Use idempotent behavior: return existing recipient with `200` when email already exists.

### Consequences

- Simpler client flows and repeat-safe submissions.
- Policy is explicit and test-covered.

---

## DEC-03: Implement Dedicated Recipient Page Instead of Modal

### Context

Frontend subtask allows interface or modal flow. Current app routing already uses dedicated pages for major resources.

### Alternatives Considered

1. Embed recipient create/list modal in campaign pages.
2. Add dedicated `/recipients` page.

### Decision

Add dedicated `RecipientsPage` route.

### Consequences

- Clearer separation of concerns and predictable navigation.
- Easier to expand recipient management features later.
