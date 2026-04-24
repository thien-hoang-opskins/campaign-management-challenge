# VS-09 Architecture

## Data and Request Flow

- User navigates to `/recipients` (protected by auth guard).
- Frontend loads recipient list via `GET /recipients`.
- Backend auth middleware enforces authorized access before recipient controller logic.
- Frontend create form validates basic email format and submits `POST /recipients`.
- Backend validates request schema and executes `findOrCreate` on normalized email.
- Duplicate-email requests return existing recipient record (idempotent create policy).
- Frontend invalidates recipient list query after successful create.

## High-Level Flow Diagram

```mermaid
flowchart LR
  U[User] --> RP[RecipientsPage]
  RP --> LR[listRecipients API]
  RP --> CR[createRecipient API]
  LR --> AM[authMiddleware]
  CR --> AM
  AM --> RC[RecipientController]
  RC --> RS[recipientService]
  RS --> DB[(recipients table)]
  DB --> RP
```

## Focused Sequence (Duplicate Email Policy)

```mermaid
sequenceDiagram
  participant FE as RecipientsPage
  participant BE as POST /recipients
  participant SV as createRecipient
  participant DB as recipients

  FE->>BE: create recipient(email)
  BE->>SV: createRecipient(email,name)
  SV->>DB: findOrCreate(email)
  alt new recipient
    DB-->>SV: [recipient, created=true]
    SV-->>BE: 201 recipient
  else duplicate email
    DB-->>SV: [recipient, created=false]
    SV-->>BE: 200 existing recipient
  end
  BE-->>FE: recipient payload
```

## Boundaries

- Frontend: recipient list/create UI, local validation, query invalidation.
- Backend: recipient endpoint validation and idempotent duplicate behavior policy.
- Database: unique email constraint enforces recipient uniqueness.
- External: none.
