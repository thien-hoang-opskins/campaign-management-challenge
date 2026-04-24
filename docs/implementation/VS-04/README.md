# VS-04 Implementation Record

## Story Summary

`VS-04` provides campaign detail with recipient rows and stats metrics, including explicit handling for not-found and unauthorized access paths.

## Acceptance Criteria Checklist

- [x] `/campaigns/:id` shows campaign details, recipient rows, and stats.  
  Evidence: detail endpoint/service in `backend/src/presentation/controllers/CampaignController.ts` and `backend/src/application/use-cases/campaignService.ts`; UI rendering in `frontend/src/pages/CampaignDetailPage.tsx`.
- [x] Stats contract fields: `total`, `sent`, `failed`, `opened`, `open_rate`, `send_rate`.  
  Evidence: `getCampaignStats` return shape in `backend/src/application/use-cases/campaignService.ts`; contract test in `backend/tests/campaignDetailStats.test.ts`.
- [x] Open rate and send rate are visualized (progress bar or simple chart).  
  Evidence: `RateBar` usage for `open_rate` and `send_rate` in `frontend/src/pages/CampaignDetailPage.tsx`.
- [x] Not-found/unauthorized cases show correct behavior.  
  Evidence: `getOwnedCampaignOrFail` error mapping in `backend/src/application/use-cases/campaignService.ts`; `404`/`403` request tests in `backend/tests/campaignDetailStats.test.ts`; frontend error alert fallback in `frontend/src/pages/CampaignDetailPage.tsx`.

## Scope

### Included

- Frontend detail page now fetches both detail and stats endpoints explicitly.
- Backend tests for stats contract and ownership/not-found error paths.
- VS-04 seed data for detail/stats manual verification.
- Complete story documentation in [VS-04](README.md).

### Excluded

- Lifecycle action behavior changes (schedule/send/delete rules).
- Recipient management API/UI changes beyond detail rendering.

## File Change Map

### Backend

- `backend/tests/campaignDetailStats.test.ts` (new)
- `backend/src/seeders/20260424000500-seed-vs04-detail-stats-data.js` (new)
- `backend/package.json` (added `db:seed:vs04`, `db:seed:vs04:undo`)
- [backend/README.md](../../../backend/README.md) (updated commands list)

### Frontend

- `frontend/src/pages/CampaignDetailPage.tsx` (explicit detail + stats fetching)

### Docs

- [README.md](README.md) (new)
- [progress-log.md](progress-log.md) (new)
- [architecture.md](architecture.md) (new)
- [decisions.md](decisions.md) (new)
- [test-report.md](test-report.md) (new)

### Tests

- Added `backend/tests/campaignDetailStats.test.ts`.
