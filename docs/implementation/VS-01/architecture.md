# VS-01 Architecture

## Data and Request Flow

- Frontend login form submits credentials to `POST /auth/login`.
- Backend validates payload, verifies credentials, and returns `{ token, user }`.
- Frontend stores token in in-memory Zustand state.
- API client reads token from store and attaches `Authorization: Bearer <token>` for protected API calls.
- Frontend route guard checks for token presence before rendering campaign routes.
- Backend auth middleware verifies JWT for protected route groups and returns `401` payloads on missing/invalid token.

## High-Level Flow Diagram

```mermaid
flowchart LR
  U[User] --> LP[LoginPage]
  LP -->|POST /auth/login| AC[AuthController]
  AC --> AS[authService]
  AS --> DB[(users table)]
  AS --> LP
  LP --> ST[authStore]
  ST --> PR[ProtectedRoute]
  PR --> CP[Campaign pages]
  CP --> API[API client]
  API -->|Bearer token| AM[authMiddleware]
  AM --> CR[Campaign routes]
  AM -->|401 error payload| UI[ErrorAlert UI]
```

## Focused Sequence (Protected Access)

```mermaid
sequenceDiagram
  participant B as Browser
  participant P as ProtectedRoute
  participant C as CampaignPage
  participant A as API
  participant M as authMiddleware

  B->>P: Navigate /campaigns
  alt token missing
    P-->>B: Redirect /login
  else token present
    P->>C: Render page
    C->>A: GET /campaigns (Bearer token)
    A->>M: Verify token
    alt token invalid
      M-->>C: 401 { error: { code, message } }
      C-->>B: Show ErrorAlert message
    else token valid
      M-->>C: Continue to controller
    end
  end
```

## Boundaries

- Frontend: `LoginPage`, `ProtectedRoute`, `authStore`, API client, error alert components.
- Backend: auth routes/controller/service, auth middleware, standardized error handler.
- Database: `users` table accessed by auth service credential verification.
- External: none for `VS-01` core flow.
