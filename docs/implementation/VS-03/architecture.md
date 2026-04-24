# VS-03 Architecture

## Data and Request Flow

- Authenticated user loads `/campaigns`.
- Frontend requests `GET /campaigns?page=<n>&pageSize=<m>` via shared API client.
- Backend auth middleware resolves `userId` from JWT.
- Campaign list use case queries campaigns filtered by `createdBy = userId`, sorted by newest first, with offset/limit pagination.
- Frontend renders list rows with reusable `StatusBadge` and pagination controls.
- Unknown status values (if ever returned) render through explicit fallback label and style.

## High-Level Flow Diagram

```mermaid
flowchart LR
  U[User] --> CL[CampaignListPage]
  CL --> API[listCampaigns API]
  API --> MW[authMiddleware]
  MW --> CT[CampaignController.list]
  CT --> SV[listCampaigns service]
  SV --> DB[(campaigns table)]
  DB --> SV
  SV --> CT
  CT --> CL
  CL --> SB[StatusBadge]
```

## Focused Sequence (Pagination + Ownership)

```mermaid
sequenceDiagram
  participant FE as CampaignListPage
  participant BE as GET /campaigns
  participant SV as listCampaigns
  participant DB as campaigns

  FE->>BE: GET /campaigns?page=2&pageSize=10 (Bearer token)
  BE->>SV: listCampaigns(userId, 2, 10)
  SV->>DB: SELECT ... WHERE created_by=userId LIMIT 10 OFFSET 10
  DB-->>SV: rows + total count
  SV-->>BE: data + pagination
  BE-->>FE: 200 list response
  FE->>FE: render rows + status badges + next/previous controls
```

## Boundaries

- Frontend: list query lifecycle, list rendering, status badge mapping, pagination controls.
- Backend: auth-protected list endpoint, ownership filter, pagination metadata.
- Database: campaign records constrained by owner foreign key.
- External services: none.
