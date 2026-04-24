# Part I Backend Requirements - Agent Runbook

## Purpose
Use this folder as the implementation source of truth for Part I (Backend).

## Execution Order
1. [01-schema-design.md](./01-schema-design.md)
2. [02-api-endpoints.md](./02-api-endpoints.md)
3. [03-business-rules.md](./03-business-rules.md)
4. [04-tech-requirements.md](./04-tech-requirements.md)

## Agent Workflow
1. Finalize stack choices where challenge variants conflict.
2. Implement schema + migrations + indexes first.
3. Implement auth (register/login/JWT middleware).
4. Implement campaigns and recipients endpoints.
5. Enforce business rules in service layer and DB constraints.
6. Add at least 3 meaningful tests for critical paths.
7. Validate full flow locally from clean DB state.
8. Document final decisions in `README.md`.

## Conflict Resolution Policy
When requirement variants disagree, prefer:
1. Latest explicit evaluator instruction
2. Stricter requirement
3. Clear documentation of chosen interpretation in README

## Minimum Verification Checklist
- Migrations run up/down successfully
- All protected routes require JWT
- Draft-only edit/delete enforced
- Future-only schedule enforced
- Send flow reaches final `sent` state safely
- `/campaigns/:id/stats` matches required response contract
- Tests pass in local environment
