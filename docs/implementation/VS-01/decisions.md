# VS-01 Decisions

## DEC-01: Keep In-Memory JWT Session Policy

### Context

`VS-01` allows either in-memory JWT storage or httpOnly cookie policy. Existing frontend already used Zustand in-memory session state and route guard logic based on token presence.

### Alternatives Considered

1. Move to httpOnly cookie session in this story.
2. Keep current in-memory JWT approach.

### Decision

Keep in-memory JWT policy for `VS-01`.

### Consequences

- Minimal change surface and strict scope adherence for the current story.
- Requires re-login on page refresh (acceptable for current MVP baseline).
- Future migration to cookie-based auth remains possible without changing the story contract.

---

## DEC-02: Add Focused Auth Flow Tests Instead of Refactoring Existing Auth Code

### Context

Backend and frontend behavior already matched `VS-01` acceptance criteria, but coverage for auth flow success/failure and protected route `401` behavior was missing.

### Alternatives Considered

1. Refactor auth modules before adding tests.
2. Add targeted tests that prove current contract behavior.

### Decision

Add targeted backend tests (`backend/tests/authFlow.test.ts`) and keep production auth code unchanged.

### Consequences

- Improves confidence in existing auth behavior with low risk.
- Keeps implementation within story boundaries and avoids unrelated architectural churn.

---

## DEC-03: Use Idempotent Seed Upserts for VS-01 Demo Data

### Context

The `VS-01` flow needs repeatable local demo data for login and immediate access to protected campaign pages, without forcing manual database cleanup between runs.

### Alternatives Considered

1. One-time insert seed that fails on duplicates.
2. Idempotent seed using upsert + safe link inserts.

### Decision

Use an idempotent Sequelize CLI seeder (`backend/src/seeders/20260424000300-seed-vs01-demo-data.js`) that:

- upserts user by email
- reuses existing campaign by owner + name + subject when present
- inserts campaign-recipient links with conflict-safe behavior

### Consequences

- Developers can rerun seeding safely during local development.
- Seed credentials and content remain predictable for UI/manual validation.
