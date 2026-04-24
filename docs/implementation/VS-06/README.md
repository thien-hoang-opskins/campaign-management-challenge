# VS-06 Implementation Record

## Story Summary

`VS-06` enables future scheduling for campaigns with backend transition enforcement, clear invalid-time errors, and draft-only scheduling UI behavior.

## Acceptance Criteria Checklist

- [x] `POST /campaigns/:id/schedule` accepts only future timestamps.  
  Evidence: `ensureFutureSchedule` in `backend/src/domain/services/campaignRules.ts`; endpoint tests in `backend/tests/campaignSchedule.test.ts`.
- [x] Valid request sets `scheduled_at` and transitions status to `scheduled`.  
  Evidence: `scheduleCampaign` update path in `backend/src/application/use-cases/campaignService.ts`; valid scheduling test in `backend/tests/campaignSchedule.test.ts`.
- [x] Past/current timestamps are rejected with clear validation errors.  
  Evidence: backend returns `INVALID_SCHEDULE_TIME` with `400` in `campaignRules`; tested in `backend/tests/campaignSchedule.test.ts`; frontend pre-submit validation message in `frontend/src/pages/CampaignDetailPage.tsx`.
- [x] UI schedule action is only available when lifecycle rules allow.  
  Evidence: schedule form visibility gated by `campaign.status === "draft"` in `frontend/src/pages/CampaignDetailPage.tsx`.

## Scope

### Included

- Backend tests for schedule success, invalid past timestamp, and non-draft rejection.
- Frontend client-side “future time” validation before schedule mutation.
- Story documentation for implementation, decisions, architecture, and test outcomes ([VS-06](README.md)).

### Excluded

- Send flow behavior changes (`VS-07` scope).
- Broader scheduling queue/job infrastructure.

## File Change Map

### Backend

- `backend/tests/campaignSchedule.test.ts` (new)

### Frontend

- `frontend/src/pages/CampaignDetailPage.tsx` (schedule input validation feedback)

### Docs

- [README.md](README.md) (new)
- [progress-log.md](progress-log.md) (new)
- [architecture.md](architecture.md) (new)
- [decisions.md](decisions.md) (new)
- [test-report.md](test-report.md) (new)

### Tests

- Added `backend/tests/campaignSchedule.test.ts`.
