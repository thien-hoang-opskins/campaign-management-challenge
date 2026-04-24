# Feature Backlog (Vertical Structure)

This folder converts initial requirements into a product backlog using:

- Vertical user stories (end-to-end value per story).
- Enablers and spikes (foundation work that supports vertical stories).

## Source Requirements

- `backend/docs/initial-requirements/01-schema-design.md`
- `backend/docs/initial-requirements/02-api-endpoints.md`
- `backend/docs/initial-requirements/03-business-rules.md`
- `backend/docs/initial-requirements/04-tech-requirements.md`
- `frontend/docs/initial-requirement/01-pages-and-routing.md`
- `frontend/docs/initial-requirement/02-ui-features.md`
- `frontend/docs/initial-requirement/03-tech-requirements.md`

## Backlog Documents

- `docs/features/vertical-user-stories.md`
- `docs/features/enablers-and-spikes.md`

## How To Use

1. Plan sprint scope from `vertical-user-stories.md` first.
2. Pull only the required enablers/spikes for those stories.
3. Keep enablers small and directly mapped to story dependencies.

## Definition of Ready

- Story has clear user value and acceptance criteria.
- Required dependencies are listed (`depends_on`).
- API and error behavior are explicit.

## Definition of Done

- Story acceptance criteria pass in UI + API behavior.
- Critical business rules covered by tests.
- Variant conflicts and chosen implementation are documented in README.
