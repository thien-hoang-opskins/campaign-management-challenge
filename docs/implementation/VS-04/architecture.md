# VS-04 Architecture

## Data and Request Flow

- User opens `/campaigns/:id`.
- Frontend requests campaign detail and stats in parallel:
  - `GET /campaigns/:id`
  - `GET /campaigns/:id/stats`
- Backend auth middleware validates JWT and injects `userId`.
- Service enforces ownership via `getOwnedCampaignOrFail` before returning data.
- Detail response includes campaign core fields and recipient rows.
- Stats response includes required contract fields and derived rates.
- Frontend renders:
  - campaign detail and recipients
  - rate visualization via `RateBar`
  - explicit error alert for failed/not-authorized/not-found responses.

## High-Level Flow Diagram

```mermaid
flowchart LR
  U[User] --> DP[CampaignDetailPage]
  DP --> DAPI[GET /campaigns/:id]
  DP --> SAPI[GET /campaigns/:id/stats]
  DAPI --> AM[authMiddleware]
  SAPI --> AM
  AM --> CT[CampaignController]
  CT --> SV[campaignService]
  SV --> DB[(campaigns recipients links)]
  SV --> DP
  DP --> RB[RateBar Visualization]
  DP --> ER[ErrorAlert]
```

## Focused Sequence (Ownership + Stats Contract)

```mermaid
sequenceDiagram
  participant FE as CampaignDetailPage
  participant BE as /campaigns/:id/stats
  participant SV as getCampaignStats
  participant DB as campaign_recipients

  FE->>BE: GET /campaigns/:id/stats (Bearer token)
  BE->>SV: getCampaignStats(userId, campaignId)
  SV->>SV: getOwnedCampaignOrFail(campaignId, userId)
  alt missing campaign
    SV-->>BE: 404 CAMPAIGN_NOT_FOUND
  else unauthorized
    SV-->>BE: 403 FORBIDDEN
  else owned campaign
    SV->>DB: load campaign recipients
    DB-->>SV: recipient status/opened data
    SV-->>BE: {total,sent,failed,opened,open_rate,send_rate}
    BE-->>FE: 200 stats payload
  end
```

## Boundaries

- Frontend: route/page orchestration, loading/error states, recipient/stats rendering.
- Backend: auth + ownership checks, detail and stats endpoint contracts.
- Database: campaign ownership and recipient delivery link records.
- External services: none.
