# VS-01 Implementation Record

## Story Summary

`VS-01` delivers login and protected-route access control for campaign pages so only authenticated operators can reach campaign data.

## Acceptance Criteria Checklist

- [x] `/login` authenticates successfully with valid credentials.  
  Evidence: `backend/src/presentation/routes/authRoutes.ts`, `backend/src/presentation/controllers/AuthController.ts`, `backend/src/application/use-cases/authService.ts`, `backend/tests/authFlow.test.ts` (`POST /auth/login` success case).
- [x] JWT/session is stored per chosen policy (memory or httpOnly cookie).  
  Evidence: in-memory JWT via Zustand store in `frontend/src/store/authStore.ts` and request header injection in `frontend/src/api/client.ts`.
- [x] Unauthenticated access to `/campaigns`, `/campaigns/new`, `/campaigns/:id` redirects to `/login`.  
  Evidence: `frontend/src/routes/ProtectedRoute.tsx`, route wiring in `frontend/src/App.tsx`.
- [x] `401` errors are surfaced with meaningful UI feedback.  
  Evidence: standardized backend error payload in `backend/src/presentation/middleware/errorHandler.ts`; login and page error UI rendering in `frontend/src/pages/LoginPage.tsx`, `frontend/src/components/ErrorAlert.tsx`; auth `401` tests in `backend/tests/authFlow.test.ts`.

## Scope

### Included

- Verification and hardening of `VS-01` auth flow across backend and frontend.
- Backend tests for login success/failure and protected route enforcement.
- Seed data support for `VS-01` login and protected-route demo flow.
- Story-level implementation documentation under [VS-01](README.md).

### Excluded

- Non-`VS-01` stories (campaign create/list/detail enhancements beyond auth guard).
- Lifecycle, scheduling, sending, and recipient-management behavior not required by this story.

## File Change Map

### Backend

- `backend/tests/authFlow.test.ts` (new)
- `backend/src/seeders/20260424000300-seed-vs01-demo-data.js` (new)
- `backend/package.json` (updated scripts: `db:seed:vs01`, `db:seed:vs01:undo`)

### Frontend

- No functional code changes required; existing implementation already satisfied story contract.

### Docs

- [README.md](README.md) (new)
- [progress-log.md](progress-log.md) (new)
- [architecture.md](architecture.md) (new)
- [decisions.md](decisions.md) (new)
- [test-report.md](test-report.md) (new)

### Tests

- Added `backend/tests/authFlow.test.ts`.

## Seed Data for VS-01

After migrations, run:

- `yarn workspace campaign-manager-backend db:seed:vs01`

Default seeded credentials:

- Email: `operator@example.com`
- Password: `password123`

Seeded entities:

- 1 upserted user for login flow
- 1 draft campaign owned by that user
- 2 recipients linked to the draft campaign

Undo seed data:

- `yarn workspace campaign-manager-backend db:seed:vs01:undo`
