# Part I.2 - API Endpoints (Agent-Friendly)

## Goal
Implement authenticated REST endpoints for campaign management.

## Auth

### `POST /auth/register`
- Create user account
- Validate email format and password rules
- Return user payload (and token only if product chooses auto-login)

### `POST /auth/login`
- Verify credentials
- Return JWT access token

## Campaigns

### `GET /campaigns` (auth required)
- Return paginated campaign list for current user
- Include basic fields: id, name, subject, status, scheduled_at, timestamps

### `POST /campaigns` (auth required)
- Create campaign in `draft` state
- Accept campaign fields and recipient references/input according to design

### `GET /campaigns/:id` (auth required)
- Return campaign details and aggregated recipient stats
- Must enforce ownership/access rules

### `PATCH /campaigns/:id` (auth required)
- Update campaign only when status is `draft`
- Reject updates otherwise with clear error code/message

### `DELETE /campaigns/:id` (auth required)
- Delete campaign only when status is `draft`

### `POST /campaigns/:id/schedule` (auth required)
- Set `scheduled_at`
- Validate timestamp is in the future
- Transition status to `scheduled`

### `POST /campaigns/:id/send` (auth required)
- Trigger send simulation
- Update recipient rows (`sent` or `failed` depending on chosen variant)
- Write `sent_at` when send is successful
- Transition campaign status to `sent` at completion
- Response 202 job ID + stats endpoint

### `GET /campaigns/:id/stats` (auth required)
- Return send/open counts and derived rates

## Recipient Endpoints (variant-dependent but present in one challenge version)

### `GET /recipients` (auth required)
- List recipients

### `POST /recipient` or `POST /recipients` (auth required)
- Create recipient
- Normalize endpoint naming (`/recipients` preferred) and document if adjusted

## Response and Error Conventions
- Use consistent JSON response envelopes (or consistent raw resources)
- Use proper status codes:
  - `200`/`201` success
  - `202` accepted for processing
  - `400` validation errors
  - `401` unauthenticated
  - `403` unauthorized
  - `404` not found
  - `409` invalid state transitions (for non-draft edits/deletes, etc.)
- Return machine-readable error codes for frontend handling

## Implementation Checklist
- JWT auth middleware on all non-auth routes
- Input validation on all request bodies/query/params
- Ownership checks for campaign access
- Transactional writes for send and schedule operations
