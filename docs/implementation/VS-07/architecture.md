# VS-07 Architecture

## Data and Request Flow

- User triggers send action from campaign detail (only when status allows).
- Frontend calls `POST /campaigns/:id/send`.
- Backend validates auth + ownership and acquires campaign row lock in transaction.
- Lifecycle rule rejects already-sent campaigns with idempotent conflict.
- Service loads campaign recipients with row lock and computes deterministic outcome:
  - local-part contains `"fail"` => `failed`
  - otherwise => `sent` and `sent_at = now`
- Backend updates campaign to terminal `sent` and returns job ID + stats contract.
- Frontend refreshes list/detail/stats queries and shows terminal state.

## High-Level Flow Diagram

```mermaid
flowchart LR
  U[User] --> FE[CampaignDetailPage]
  FE --> API[POST /campaigns/:id/send]
  API --> MW[authMiddleware]
  MW --> CT[CampaignController.send]
  CT --> SV[sendCampaign]
  SV --> LK[Campaign and recipient row locks]
  LK --> OUT[Deterministic sent or failed outcomes]
  OUT --> DB[(campaigns and campaign_recipients)]
  DB --> FE
```

## Focused Sequence (Idempotent Conflict on Re-send)

```mermaid
sequenceDiagram
  participant FE as CampaignDetailPage
  participant BE as /campaigns/:id/send
  participant SV as sendCampaign
  participant RL as ensureSendable

  FE->>BE: POST /campaigns/:id/send
  BE->>SV: sendCampaign(userId, campaignId)
  SV->>SV: load campaign with lock
  SV->>RL: validate campaign.status
  alt status is sent
    RL-->>SV: throw ALREADY_SENT (409)
    SV-->>BE: conflict error payload
    BE-->>FE: 409 error response
  else draft or scheduled
    SV->>SV: update recipient statuses sent/failed
    SV->>SV: set campaign status sent
    SV-->>BE: 202 with jobId + stats
    BE-->>FE: success
  end
```

## Boundaries

- Frontend: send action trigger, action visibility by status, post-send refresh/error feedback.
- Backend: transactional send orchestration, lifecycle guard, deterministic simulation policy.
- Database: campaign and campaign-recipient updates within one transaction.
- External: none (simulation-only send in MVP scope).
