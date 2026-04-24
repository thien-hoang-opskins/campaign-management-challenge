# SP-04 - Frontend Pages SOLID Refactor Spike

## Goal

Define an implementation-ready refactor for `frontend/src/pages` that reduces responsibility overload, improves extension points, and preserves current behavior.

## Mandatory Skill Application

This spike must explicitly apply both of the following:

- `frontend/.cursor/skills/frontend-ui-engineering/SKILL.md`
- `~/.agents/skills/clean-code-principles/SKILL.md`

Applied interpretation:

- Keep page components focused and split data orchestration from presentation.
- Enforce SOLID boundaries (especially `solid-srp`, `solid-ocp`, `solid-dip`) for page-level code.
- Preserve accessibility and UX states (loading/error/empty) during refactor.

## Findings (Current Violations)

`frontend/src/pages/CampaignDetailPage.tsx:18` - [solid-srp] One component handles query orchestration, mutation side effects, form state, business-rule gating, schedule validation, and view rendering.

`frontend/src/pages/CampaignDetailPage.tsx:45` - [core-dry] Query invalidation logic is duplicated across schedule/send/update mutations.

`frontend/src/pages/CampaignDetailPage.tsx:118` - [solid-ocp] Status-driven action policy is embedded inline, so adding a new status requires editing multiple branches in the page.

`frontend/src/pages/CampaignDetailPage.tsx:71` - [core-separation-of-concerns] Date parsing/validation and submission side effects are mixed directly in UI event handlers.

`frontend/src/pages/CampaignCreatePage.tsx:60` - [solid-srp] Form parsing, validation, duplicate detection, server mutation, and full page markup are tightly coupled.

`frontend/src/pages/CampaignListPage.tsx:10` - [core-separation-of-concerns] Pagination state, API orchestration, auth action, and list rendering are all in one page component.

## Refactor Slices (Low-Risk Order)

### Slice 1 - Extract shared campaign detail policies

- Add a `campaignDetailPolicy` module with:
  - status-to-action capability mapping
  - schedule datetime validation helper
  - consolidated mutation error extraction helper
- Keep current page behavior unchanged; replace inline branches with policy calls.

### Slice 2 - Extract data orchestration hooks

- Create hooks in `frontend/src/pages/hooks`:
  - `useCampaignDetailData(campaignId)`
  - `useCampaignDetailActions(campaignId)`
  - `useCampaignCreateForm()` (parse + validate + submit)
- Hooks own query/mutation setup and cache invalidation.
- Pages become thin composition roots.

### Slice 3 - Split presentational sections

- Move large JSX blocks into components in `frontend/src/pages/components`:
  - `CampaignMessageSection`
  - `CampaignEditSection`
  - `CampaignStatsSection`
  - `CampaignActionsSection`
  - `CampaignRecipientsSection`
- Keep components prop-driven and side-effect free.

### Slice 4 - Normalize list/create page composition

- Introduce `CampaignListView` and `CampaignCreateFormView` as presentational components.
- Keep API concerns in page-level hooks/containers.
- Standardize empty/loading/error rendering order across all pages.

## Acceptance Criteria

- No user-visible behavior regression for `VS-04`, `VS-05`, `VS-06`, `VS-07`, `VS-08` flows.
- Each page container stays under ~150 lines and delegates heavy logic to hooks/policy modules.
- No duplicated query invalidation snippets across campaign detail mutations.
- Status action rules are defined in one module and unit-testable.
- Existing accessibility affordances remain intact (labels, keyboard-reachable controls, meaningful error messages).

## Out of Scope

- Backend contract changes.
- Visual redesign.
- Replacing TanStack Query or auth state strategy.
