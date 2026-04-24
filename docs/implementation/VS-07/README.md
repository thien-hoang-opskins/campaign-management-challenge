# VS-07 Implementation Record

## Story Summary

`VS-07` finalizes send behavior with deterministic recipient outcomes (`sent`/`failed`), terminal campaign state enforcement, and idempotent conflict handling for repeated sends.

## Acceptance Criteria Checklist

- [x] `POST /campaigns/:id/send` updates recipient statuses (`sent`/`failed`) and `sent_at` on success.  
  Evidence: deterministic outcome logic in `backend/src/application/use-cases/campaignService.ts`; tests in `backend/tests/campaignSend.test.ts`.
- [x] Campaign reaches terminal `sent` state.  
  Evidence: campaign update to `status: "sent"` in send service; test assertion in `backend/tests/campaignSend.test.ts`.
- [x] Repeated send attempts after finalization are idempotent conflict/no-op per documented policy.  
  Evidence: `ensureSendable` returns `409` with `ALREADY_SENT` for terminal state; endpoint test in `backend/tests/campaignSend.test.ts`.
- [x] UI reflects action availability and final state correctly.  
  Evidence: send button hidden when status is `sent` in `frontend/src/pages/CampaignDetailPage.tsx`; status badge/list behavior inherited from previous stories.

## Scope

### Included

- Backend send-flow hardening for deterministic success/failure recipient outcomes.
- Campaign-row lock usage during send transaction to reduce double-send race risk.
- Backend tests for send finality and idempotent conflict policy.
- VS-07 seed data for manual send flow verification.
- Story documentation package under [VS-07](README.md).

### Excluded

- Async job queue architecture for send processing.
- Additional send confirmation modal UX beyond current flow.

## File Change Map

### Backend

- `backend/src/application/use-cases/campaignService.ts` (send flow + lock behavior)
- `backend/tests/campaignSend.test.ts` (new)
- `backend/src/seeders/20260424000600-seed-vs07-send-data.js` (new)
- `backend/package.json` (added `db:seed:vs07`, `db:seed:vs07:undo`)
- [backend/README.md](../../../backend/README.md) (updated seed command list)

### Frontend

- No additional `VS-07` UI change required; existing status-based send visibility already compliant.

### Docs

- [README.md](README.md) (new)
- [progress-log.md](progress-log.md) (new)
- [architecture.md](architecture.md) (new)
- [decisions.md](decisions.md) (new)
- [test-report.md](test-report.md) (new)

### Tests

- Added `backend/tests/campaignSend.test.ts`.
