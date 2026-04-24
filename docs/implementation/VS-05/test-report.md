# VS-05 Test Report

## Test Plan

- Verify patch/delete draft-only enforcement at endpoint level.
- Verify blocked non-draft operations produce `409` with machine-readable error code.
- Verify frontend compiles with draft-only edit visibility and mutation flow.

## Seeders for Testing

- Base auth/demo seed:
  - `yarn workspace campaign-manager-backend db:seed:vs01`
- Status variety seed (includes draft + non-draft campaigns):
  - `yarn workspace campaign-manager-backend db:seed:vs03`
- Undo:
  - `yarn workspace campaign-manager-backend db:seed:vs03:undo`
  - `yarn workspace campaign-manager-backend db:seed:vs01:undo`

## Commands Run

1. `yarn workspace campaign-manager-backend test`
2. `yarn workspace campaign-manager-backend build`
3. `yarn workspace campaign-manager-frontend build`

## Pass/Fail Outcomes

- `yarn workspace campaign-manager-backend test`: **PASS**
  - `tests/campaignRules.test.ts` passed
  - `tests/authFlow.test.ts` passed
  - `tests/campaignCreate.test.ts` passed
  - `tests/campaignList.test.ts` passed
  - `tests/campaignDetailStats.test.ts` passed
  - `tests/campaignDraftGuards.test.ts` passed
- `yarn workspace campaign-manager-backend build`: **PASS**
- `yarn workspace campaign-manager-frontend build`: **PASS**

## Known Gaps and Risk Notes

- Frontend lacks component-level tests for edit form visibility by status.
- Delete cascade behavior relies on existing database FK design; no live DB integration test added in this story scope.
