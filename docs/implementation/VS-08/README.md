# VS-08 Implementation Record

## Story Summary

`VS-08` standardizes loading and API failure feedback so users consistently understand system state across login, create, schedule, send, delete, and detail flows.

## Acceptance Criteria Checklist

- [x] Fetching screens use skeletons/spinners.  
  Evidence: `frontend/src/pages/CampaignListPage.tsx` uses `SkeletonList`; `frontend/src/pages/CampaignDetailPage.tsx` uses `LoadingSpinner`.
- [x] API failures are surfaced via toast/inline alert/error region.  
  Evidence: shared `ErrorAlert` plus centralized message mapping through `frontend/src/utils/getApiErrorMessage.ts` used in login/list/create/detail flows.
- [x] No silent failure in login, create, schedule, send, delete, and detail flows.  
  Evidence: mutation/query failure rendering in `frontend/src/pages/LoginPage.tsx`, `frontend/src/pages/CampaignCreatePage.tsx`, `frontend/src/pages/CampaignDetailPage.tsx`; backend envelope consistency test in `backend/tests/errorEnvelope.test.ts`.

## Scope

### Included

- Centralized frontend API error message presentation utility.
- Hardened API client error handling for network and non-JSON error responses.
- Rewired key pages to use centralized error messaging.
- Added backend tests for consistent error envelope and machine-readable business-failure code presence.
- Added VS-08 documentation package.

### Excluded

- Full global toast infrastructure (inline error region retained).
- UX redesign of existing loading components beyond standardization.

## File Change Map

### Backend

- `backend/tests/errorEnvelope.test.ts` (new)

### Frontend

- `frontend/src/api/client.ts` (network/non-JSON error normalization)
- `frontend/src/utils/getApiErrorMessage.ts` (new centralized error mapper)
- `frontend/src/pages/LoginPage.tsx` (centralized error presentation)
- `frontend/src/pages/CampaignCreatePage.tsx` (centralized error presentation)
- `frontend/src/pages/CampaignListPage.tsx` (centralized error presentation)
- `frontend/src/pages/CampaignDetailPage.tsx` (centralized error presentation)

### Docs

- `docs/implementation/VS-08/README.md` (new)
- `docs/implementation/VS-08/progress-log.md` (new)
- `docs/implementation/VS-08/architecture.md` (new)
- `docs/implementation/VS-08/decisions.md` (new)
- `docs/implementation/VS-08/test-report.md` (new)

### Tests

- Added `backend/tests/errorEnvelope.test.ts`.
