# VS-05 Architecture

## Data and Request Flow

- User opens campaign detail page.
- Frontend determines action availability from campaign `status`.
- For `draft` campaigns:
  - edit form is rendered and `PATCH /campaigns/:id` is enabled
  - delete button is enabled
- For non-draft campaigns:
  - edit/delete actions are hidden and explanatory copy is rendered
- Backend validates ownership, then enforces draft-only guard before update/delete mutation.
- Guard failures return standardized `409` error payload with machine-readable code.

## High-Level Flow Diagram

```mermaid
flowchart LR
  U[User] --> DP[CampaignDetailPage]
  DP --> SM[StatusMatrix]
  SM -->|draft| EA[Edit and Delete Actions]
  SM -->|non-draft| HM[Hidden Action Messages]
  EA --> API[PATCH or DELETE /campaigns/:id]
  API --> CT[CampaignController]
  CT --> SV[campaignService]
  SV --> DG[ensureDraftOnlyMutation]
  DG --> DB[(campaigns)]
  DG --> ER[409 INVALID_STATE]
```

## Focused Sequence (Blocked Non-Draft Delete)

```mermaid
sequenceDiagram
  participant FE as CampaignDetailPage
  participant BE as DELETE /campaigns/:id
  participant SV as deleteCampaign
  participant DG as ensureDraftOnlyMutation

  FE->>BE: DELETE /campaigns/:id
  BE->>SV: deleteCampaign(userId, campaignId)
  SV->>SV: getOwnedCampaignOrFail
  SV->>DG: validate status
  DG-->>SV: throw AppError(409, INVALID_STATE)
  SV-->>BE: 409 error envelope
  BE-->>FE: { error: { code, message } }
  FE-->>FE: show ErrorAlert
```

## Boundaries

- Frontend: action visibility matrix, edit/delete mutation triggers, user-facing error feedback.
- Backend: ownership checks + draft-only transition guard + standardized error response.
- Database: campaign lifecycle state persisted in `campaigns.status`; delete cascade handled by FK constraints for `campaign_recipients`.
- External: none.
