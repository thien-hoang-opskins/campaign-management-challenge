# VS-06 Test Report

## Test Plan

- Validate scheduling success transition to `scheduled` with future timestamp.
- Validate invalid past timestamp rejection with clear error code/message.
- Validate schedule action blocked for non-draft campaigns.
- Validate frontend build/type safety after schedule input validation update.

## Seeders for Testing

- Base auth/demo seed:
  - `yarn workspace campaign-manager-backend db:seed:vs01`
- Status variety seed for draft/non-draft lifecycle checks:
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
  - `tests/campaignSchedule.test.ts` passed
- `yarn workspace campaign-manager-backend build`: **PASS**
- `yarn workspace campaign-manager-frontend build`: **PASS**

## Known Gaps and Risk Notes

- Frontend schedule validation has no dedicated component test coverage yet.
- Timezone nuance for `datetime-local` depends on browser/local environment and may need explicit UX copy later.
