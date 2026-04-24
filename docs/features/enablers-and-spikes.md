# Enablers and Spikes

Use these items to support vertical stories. Keep them small, dependency-linked, and outcome-based.

## Enablers

Backend skill enforcement:
- For backend enablers (`EN-01`, `EN-02`, `EN-03`, `EN-04`), explicitly apply `~/.cursor/skills/layered-backend-structure/SKILL.md`.

Frontend skill enforcement:
- For frontend enablers (`EN-05`, `EN-06`, `EN-07`, `EN-08`), explicitly apply `frontend/.cursor/skills/vercel-react-best-practices/SKILL.md`.
- For frontend enablers (`EN-05`, `EN-06`, `EN-07`, `EN-08`), explicitly apply `frontend/.cursor/skills/frontend-ui-engineering/SKILL.md`.

### EN-01 (P0) - Database schema and migration baseline
**Type:** Enabler  
**Outcome:** Clean database can run migrations up/down and produce required core schema.

**Scope**
- Implement schema and migrations according to `backend/docs/initial-requirements/01-schema-design.md`.
- Treat that document as the source of truth for required tables, constraints, indexes, and rollback support.

**Enables**
- `VS-01`, `VS-02`, `VS-09`

### EN-02 (P0) - Auth middleware and route protection contract
**Type:** Enabler  
**Outcome:** Protected API endpoints consistently enforce authentication and ownership policies.

**Scope**
- Implement auth flow and protection according to:
  - `backend/docs/initial-requirements/02-api-endpoints.md` (Auth, route protection, status/error semantics)
  - `backend/docs/initial-requirements/04-tech-requirements.md` (JWT middleware and validation requirements)
- Treat those documents as the source of truth for auth contract and protected-route behavior.
- Apply `backend/.cursor/skills/api-and-interface-design/SKILL.md` for endpoint contracts, validation boundaries, and error format consistency.

**Enables**
- `VS-01`, `VS-03`, `VS-04`, `VS-09`

### EN-03 (P0) - Campaign create payload and recipient link model
**Type:** Enabler  
**Outcome:** Stable request/response contract for campaign creation with recipients.

**Scope**
- Implement campaign create payload/response and recipient-link model according to:
  - `backend/docs/initial-requirements/01-schema-design.md` (recipient link constraints and uniqueness)
  - `backend/docs/initial-requirements/02-api-endpoints.md` (create endpoint contract)
  - `backend/docs/initial-requirements/03-business-rules.md` (validation and duplicate handling rules)
- Treat those documents as the source of truth for request shape and data integrity behavior.
- Apply `backend/.cursor/skills/api-and-interface-design/SKILL.md` to enforce contract-first request/response schemas and predictable error semantics.

**Enables**
- `VS-02`

### EN-04 (P0) - Campaign lifecycle state machine and transition guards
**Type:** Enabler  
**Outcome:** Draft/scheduled/sent rules are consistently enforced across all mutation endpoints.

**Scope**
- Implement lifecycle transitions and guards according to:
  - `backend/docs/initial-requirements/03-business-rules.md` (state machine, draft-only mutation, send finality, idempotency)
  - `backend/docs/initial-requirements/02-api-endpoints.md` (schedule/send endpoint behavior)
- Treat those documents as the source of truth for lifecycle policy and transition error handling.
- Apply `backend/.cursor/skills/api-and-interface-design/SKILL.md` for schedule/send/stats API contracts and transition-related error responses.

**Enables**
- `VS-04`, `VS-05`, `VS-06`, `VS-07`

### EN-05 (P0) - Shared frontend API layer and UX states
**Type:** Enabler  
**Outcome:** Frontend has consistent query/mutation, loading, and error patterns.

**Scope**
- Implement frontend API/UX foundation according to:
  - `frontend/docs/initial-requirement/02-ui-features.md` (error handling and loading-state behavior)
  - `frontend/docs/initial-requirement/03-tech-requirements.md` (React + TypeScript with selected server-state strategy)
- Provide shared API client and typed response/error models.
- Provide reusable loading components and shared error display utilities.
- Treat those documents as the source of truth for FE API interaction and baseline UX feedback patterns.

**Enables**
- `VS-03`, `VS-08`

### EN-06 (P0) - Frontend routing and auth-guard baseline
**Type:** Enabler  
**Outcome:** Required routes exist and protected screens consistently enforce session rules.

**Scope**
- Implement route skeleton and auth gate according to `frontend/docs/initial-requirement/01-pages-and-routing.md`.
- Ensure `/campaigns`, `/campaigns/new`, and `/campaigns/:id` are protected and redirect unauthenticated users to `/login`.
- Implement session handling policy aligned with requirements (JWT in memory or httpOnly cookie, per chosen variant).
- Treat that document as the source of truth for route behavior and protected-access flow.

**Enables**
- `VS-01`, `VS-02`, `VS-03`, `VS-04`

### EN-07 (P0) - Frontend campaign UI behavior primitives
**Type:** Enabler  
**Outcome:** Campaign UI consistently renders status semantics, action visibility, and stats visuals.

**Scope**
- Implement shared UI behavior primitives according to `frontend/docs/initial-requirement/02-ui-features.md`.
- Add status badge mapping (including explicit fallback for unknown statuses).
- Define status-based action visibility for Schedule/Send/Delete aligned with backend business rules.
- Add stats visualization primitives for open/send rate display.
- Treat that document as the source of truth for campaign UI behavior consistency.

**Enables**
- `VS-03`, `VS-04`, `VS-05`, `VS-06`, `VS-07`

### EN-08 (P0) - Frontend stack and state-management baseline
**Type:** Enabler  
**Outcome:** Frontend uses one documented stack choice for server state and client state across all screens.

**Scope**
- Implement selected FE stack baseline according to `frontend/docs/initial-requirement/03-tech-requirements.md`.
- Standardize server-state approach (TanStack Query or SWR) and client-state approach (Redux/Zustand per chosen variant).
- Document final stack choice and variant resolution in README as required by FE tech requirements.
- Treat that document as the source of truth for FE stack and state-management constraints.

**Enables**
- `VS-01`, `VS-03`, `VS-08`

## Spikes (Timeboxed Research)

### SP-01 (P0) - Resolve stack variant conflicts
**Type:** Spike  
**Timebox:** 0.5-1 day  
**Question:** Which requirement variant is authoritative for ORM, frontend state library, and tooling?

**Deliverable**
- Decision note in README:
  - ORM/query approach selected.
  - Frontend state library selected (Redux or Zustand).
  - Tooling/monorepo implications confirmed.

**Unblocks**
- `EN-01`, `EN-05`, `EN-08`

### SP-02 (P1) - Define open rate formula contract
**Type:** Spike  
**Timebox:** 0.25 day  
**Question:** Should `open_rate` be `opened / total` or `opened / sent`?

**Deliverable**
- Documented formula in API docs and tests.
- Alignment across backend calculation and frontend display copy.

**Unblocks**
- `VS-04`

### SP-03 (P1) - Decide zero-recipient send behavior
**Type:** Spike  
**Timebox:** 0.25 day  
**Question:** For campaigns with zero recipients, should send be blocked or allowed with deterministic stats?

**Deliverable**
- Policy documented with expected status code and UI behavior.
- Added tests for chosen behavior.

**Unblocks**
- `VS-07`

### SP-04 (P0) - Frontend pages SOLID refactor plan
**Type:** Spike  
**Timebox:** 0.5 day  
**Question:** How should page-level responsibilities be split so `frontend/src/pages` follows SOLID and remains easy to evolve?

**Scope**
- Audit current page components in `frontend/src/pages` against SOLID and separation-of-concerns boundaries.
- Define a low-risk refactor path that separates container logic (queries/mutations/navigation) from presentational UI sections.
- Explicitly apply:
  - `frontend/.cursor/skills/frontend-ui-engineering/SKILL.md`
  - `~/.agents/skills/clean-code-principles/SKILL.md`

**Deliverable**
- A written findings report with concrete violations and targeted refactor slices.
- A stepwise implementation plan that can be executed without changing user-visible behavior.
- Clear acceptance checks for behavior parity (loading, error, empty, and mutation feedback states).

**Unblocks**
- `VS-04`, `VS-05`, `VS-06`, `VS-07`, `VS-08`

## Planning Rules

- Prefer pulling vertical stories into sprint planning first.
- Include only enablers required by selected stories.
- Do not schedule large standalone "foundation sprints" unless they directly unlock imminent stories.
