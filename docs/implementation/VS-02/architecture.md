# VS-02 Architecture

## Data and Request Flow

- User fills campaign create form (`name`, `subject`, `body`, recipient emails).
- Frontend performs typed validation:
  - required non-empty text fields
  - recipient email format validation
  - duplicate recipient email detection
- On valid input, frontend submits `POST /campaigns`.
- Backend validates request body with Zod schema.
- Service opens DB transaction, creates `campaigns` row in `draft` status, upserts recipients, and inserts `campaign_recipients` links.
- Response returns created campaign payload; frontend invalidates list query and navigates to campaign detail.

## High-Level Flow Diagram

```mermaid
flowchart LR
  U[User] --> CF[CampaignCreatePage]
  CF --> FV[FormValidation]
  FV -->|valid| API[POST /campaigns]
  FV -->|invalid| UIE[InlineErrorAlert]
  API --> CC[CampaignController]
  CC --> CV[createCampaignSchema]
  CV --> CS[campaignService.createCampaign]
  CS --> DB[(campaigns recipients links)]
  CS --> RES[201 CreatedCampaign]
  RES --> NAV[Navigate to CampaignDetail]
```

## Focused Sequence (Duplicate Recipient Prevention)

```mermaid
sequenceDiagram
  participant FE as Frontend
  participant CT as CampaignController
  participant SV as campaignService
  participant R as recipients table
  participant CR as campaign_recipients table

  FE->>CT: POST /campaigns with recipientEmails
  CT->>SV: createCampaign(userId, input)
  SV->>SV: normalize lower-case + deduplicate emails
  SV->>R: find existing recipients by email
  SV->>R: insert missing recipients
  SV->>CR: insert links (ignoreDuplicates true)
  CR-->>SV: unique links persisted
  SV-->>CT: created campaign (status draft)
  CT-->>FE: 201 response
```

## Boundaries

- Frontend: create form, client-side validation, mutation lifecycle, user feedback.
- Backend: request validation, auth-protected endpoint, transactional campaign create orchestration.
- Database: `campaigns`, `recipients`, `campaign_recipients` with uniqueness/integrity constraints.
- External services: none for `VS-02`.
