# VS-06 Architecture

## Data and Request Flow

- User opens campaign detail and can schedule only when campaign status is `draft`.
- Frontend validates `datetime-local` input is parseable and strictly in the future.
- On valid input, frontend sends `POST /campaigns/:id/schedule` with ISO timestamp.
- Backend validates auth, ownership, and lifecycle status (`draft` only), then validates future timestamp.
- Backend updates `campaigns.status` to `scheduled` and persists `scheduled_at`.
- Frontend refreshes detail/list queries and renders new scheduled state.

## High-Level Flow Diagram

```mermaid
flowchart LR
  U[User] --> DP[CampaignDetailPage]
  DP --> CV[ClientScheduleValidation]
  CV -->|future| API[POST /campaigns/:id/schedule]
  CV -->|invalid| ER[ErrorAlert]
  API --> CT[CampaignController.schedule]
  CT --> SV[scheduleCampaign service]
  SV --> DG[ensureDraftOnlyMutation]
  SV --> FG[ensureFutureSchedule]
  FG --> DB[(campaigns table)]
  DB --> DP
```

## Focused Sequence (Past Timestamp Rejection)

```mermaid
sequenceDiagram
  participant FE as CampaignDetailPage
  participant BE as /campaigns/:id/schedule
  participant SV as scheduleCampaign
  participant RL as ensureFutureSchedule

  FE->>BE: POST schedule with past scheduledAt
  BE->>SV: scheduleCampaign(userId, id, scheduledAt)
  SV->>RL: validate future timestamp
  RL-->>SV: throw INVALID_SCHEDULE_TIME (400)
  SV-->>BE: standardized error response
  BE-->>FE: { error: { code, message } }
  FE-->>FE: show clear schedule validation feedback
```

## Boundaries

- Frontend: schedule control visibility, client validation, mutation error display.
- Backend: auth + ownership + lifecycle guard + future-time rule.
- Database: `campaigns.status` and `campaigns.scheduled_at`.
- External systems: none in this story scope.
