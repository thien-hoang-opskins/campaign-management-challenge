# VS-05 Implementation Record

## Story Summary

`VS-05` enforces draft-only update/delete lifecycle rules across backend and frontend, with explicit `409` machine-readable errors and status-based action visibility.

## Acceptance Criteria Checklist

- [x] `PATCH /campaigns/:id` succeeds only when status is `draft`.  
  Evidence: `ensureDraftOnlyMutation` usage in `backend/src/application/use-cases/campaignService.ts`; tests in `backend/tests/campaignDraftGuards.test.ts`.
- [x] `DELETE /campaigns/:id` succeeds only when status is `draft`.  
  Evidence: same draft guard in delete service path; tests in `backend/tests/campaignDraftGuards.test.ts`.
- [x] Non-draft operations return `409` with machine-readable error codes.  
  Evidence: `AppError(409, "INVALID_STATE", ...)` in `backend/src/domain/services/campaignRules.ts`; `409` endpoint assertions in `backend/tests/campaignDraftGuards.test.ts`.
- [x] UI hides/disables invalid actions by status.  
  Evidence: draft-only edit and delete sections in `frontend/src/pages/CampaignDetailPage.tsx` with explicit hidden messages for non-draft status.

## Scope

### Included

- Added draft-only edit UI on campaign detail.
- Retained draft-only delete visibility/behavior.
- Added backend integration-style tests for allowed and blocked patch/delete transitions.
- Ensured user-facing mutation failures surface through existing error alert flow.
- Added `VS-05` documentation set.

### Excluded

- Schedule/send lifecycle changes beyond existing behavior.
- List-page action controls not required by `VS-05`.

## File Change Map

### Backend

- `backend/tests/campaignDraftGuards.test.ts` (new)

### Frontend

- `frontend/src/pages/CampaignDetailPage.tsx` (draft-only edit form + update mutation)

### Docs

- [README.md](README.md) (new)
- [progress-log.md](progress-log.md) (new)
- [architecture.md](architecture.md) (new)
- [decisions.md](decisions.md) (new)
- [test-report.md](test-report.md) (new)

### Tests

- Added `backend/tests/campaignDraftGuards.test.ts`.
