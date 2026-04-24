Initialize monorepo codebase (Backend + Frontend) for the mini Campaign Manager.

Instructions:
1) Initialize the backend project structure and baseline setup.
2) Initialize the frontend project structure and baseline setup.
3) Implement backlog items from [docs/features/enablers-and-spikes.md](../features/enablers-and-spikes.md) only:
   - Backend: `EN-01`, `EN-02`, `EN-03`, `EN-04` (+ backend-relevant spikes)
   - Frontend: `EN-05`, `EN-06`, `EN-07`, `EN-08` (+ frontend-relevant dependencies from selected stories)
4) Apply backend tech constraints from [backend/docs/initial-requirements/04-tech-requirements.md](../../backend/docs/initial-requirements/04-tech-requirements.md) (Node.js, Express or Express/Fastify per variant, PostgreSQL, query-layer choice with rationale, JWT middleware, `zod`/`joi` validation, and migrations).

Scope guard:
- Do not implement anything outside that backlog file.
- Follow backlog priorities/dependencies as defined there.
- Keep backend and frontend scopes aligned to their enablers and avoid cross-scope changes unless explicitly required by dependencies.

Mandatory skills:
- Apply [`.cursor/skills/code-review-and-quality/SKILL.md`](../../.cursor/skills/code-review-and-quality/SKILL.md) before marking any backlog item complete.
- If a spike requires architectural decisions, apply [`.cursor/skills/documentation-and-adrs/SKILL.md`](../../.cursor/skills/documentation-and-adrs/SKILL.md) and record the decision.
- For frontend implementation, explicitly apply:
  - [`frontend/.cursor/skills/vercel-react-best-practices/SKILL.md`](../../frontend/.cursor/skills/vercel-react-best-practices/SKILL.md)
  - [`frontend/.cursor/skills/frontend-ui-engineering/SKILL.md`](../../frontend/.cursor/skills/frontend-ui-engineering/SKILL.md)
