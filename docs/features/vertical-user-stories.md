# Vertical User Stories (MVP First)

## Priority Model

- `P0`: must-have for usable MVP
- `P1`: should-have after MVP core flow is stable
- `P2`: improvement/polish

---

## VS-01 (P0) - User can log in and access protected campaign routes

**User story**  
As a campaign operator, I want to log in and access protected pages so that campaign data is secure.

**Acceptance criteria**
- `/login` authenticates successfully with valid credentials.
- JWT/session is stored per chosen policy (memory or httpOnly cookie).
- Unauthenticated access to `/campaigns`, `/campaigns/new`, `/campaigns/:id` redirects to `/login`.
- `401` errors are surfaced with meaningful UI feedback.

**Backend subtasks**
- Implement `POST /auth/login` with credential verification and JWT issuance.
- Ensure auth middleware protects non-auth routes.
- Return standardized auth error payloads/codes.

**Frontend subtasks**
- Build login form and submit flow.
- Implement auth guard for protected routes.
- Add loading and error states for login/session failures.

**Depends on**
- `EN-01`, `EN-02`, `EN-06`, `EN-08`

---

## VS-02 (P0) - User can create a draft campaign with recipients

**User story**  
As a campaign owner, I want to create a campaign draft with recipient emails so that I can prepare outreach content.

**Acceptance criteria**
- `/campaigns/new` supports `name`, `subject`, `body`, and recipient emails.
- Backend creates campaign in `draft` status.
- Validation errors are returned and shown clearly in the UI.
- Duplicate recipient links in the same campaign are prevented.

**Backend subtasks**
- Implement `POST /campaigns` with required field validation.
- Persist recipients/links according to API contract.
- Enforce duplicate campaign-recipient prevention.

**Frontend subtasks**
- Build create form with typed validation.
- Provide recipient email input UX.
- Submit and handle success/error states.

**Depends on**
- `EN-01`, `EN-02`, `EN-03`, `EN-06`

---

## VS-03 (P0) - User can view campaign list with status badges

**User story**  
As a campaign owner, I want to see my campaigns with clear status badges so that I can identify what action is needed.

**Acceptance criteria**
- `/campaigns` shows paginated or infinite-scroll campaign list.
- Only campaigns belonging to current user are returned.
- Badge colors map: `draft` grey, `scheduled` blue, `sent` green.
- Unknown/extra statuses have explicit fallback mapping.

**Backend subtasks**
- Implement `GET /campaigns` with ownership filtering and pagination.
- Return fields needed by list UI.

**Frontend subtasks**
- Build list page with React Query/SWR integration.
- Add pagination/infinite scroll.
- Implement reusable status badge component.
- Add loading and empty states.

**Depends on**
- `EN-02`, `EN-05`, `EN-06`, `EN-07`, `EN-08`

---

## VS-04 (P0) - User can view campaign detail, recipient list, and stats

**User story**  
As a campaign owner, I want campaign detail and performance metrics so that I can evaluate campaign outcomes.

**Acceptance criteria**
- `/campaigns/:id` shows campaign details, recipient rows, and stats.
- Stats contract fields: `total`, `sent`, `failed`, `opened`, `open_rate`, `send_rate`.
- Open rate and send rate are visualized (progress bar or simple chart).
- Not-found/unauthorized cases show correct behavior.

**Backend subtasks**
- Implement `GET /campaigns/:id` with ownership checks.
- Implement `GET /campaigns/:id/stats` with required contract.
- Document and enforce selected `open_rate` formula.

**Frontend subtasks**
- Fetch detail and stats APIs.
- Render recipient list and metric visuals.
- Handle loading/error states explicitly.

**Depends on**
- `EN-02`, `EN-04`, `EN-05`, `EN-06`, `EN-07`

---

## VS-05 (P0) - User can edit and delete only draft campaigns

**User story**  
As a campaign owner, I want strict draft-only mutation rules so that sent/scheduled records remain reliable.

**Acceptance criteria**
- `PATCH /campaigns/:id` succeeds only when status is `draft`.
- `DELETE /campaigns/:id` succeeds only when status is `draft`.
- Non-draft operations return `409` with machine-readable error codes.
- UI hides/disables invalid actions by status.

**Backend subtasks**
- Implement draft-only guards for update and delete endpoints.
- Ensure delete cascade behavior for campaign recipients.
- Add integration tests for allowed/blocked transitions.

**Frontend subtasks**
- Implement status-based visibility matrix for action buttons.
- Add user-friendly messages when backend rejects invalid actions.
- Refresh list/detail state after successful mutation.

**Depends on**
- `EN-04`, `EN-07`

---

## VS-06 (P0) - User can schedule campaign for future send time

**User story**  
As a campaign owner, I want to schedule campaigns in the future so that sending can be planned safely.

**Acceptance criteria**
- `POST /campaigns/:id/schedule` accepts only future timestamps.
- Valid request sets `scheduled_at` and transitions status to `scheduled`.
- Past/current timestamps are rejected with clear validation errors.
- UI schedule action is only available when lifecycle rules allow.

**Backend subtasks**
- Implement schedule endpoint with future-time validation.
- Enforce valid state transition rules.
- Add tests for valid and invalid timestamps.

**Frontend subtasks**
- Add schedule control with datetime input.
- Validate obvious client-side input and handle server errors.
- Refresh UI state after successful schedule action.

**Depends on**
- `EN-04`, `EN-07`

---

## VS-07 (P0) - User can send campaign safely with final state

**User story**  
As a campaign owner, I want send operations to be safe and final so that recipients and stats remain trustworthy.

**Acceptance criteria**
- `POST /campaigns/:id/send` updates recipient statuses (`sent`/`failed`) and `sent_at` on success.
- Campaign reaches terminal `sent` state.
- Repeated send attempts after finalization are idempotent conflict/no-op per documented policy.
- UI reflects action availability and final state correctly.

**Backend subtasks**
- Implement transactional send flow for campaign + recipients.
- Add concurrency protection against double-send.
- Define deterministic policy for zero-recipient campaigns.
- Add integration tests for send finality and idempotency.

**Frontend subtasks**
- Implement send action and confirmation UX.
- Handle success/failure feedback.
- Refresh detail/list views after send.

**Depends on**
- `EN-04`, `EN-07`

---

## VS-08 (P1) - User can understand failures and loading states clearly

**User story**  
As an end user, I want clear feedback on loading and API failures so that I can trust system behavior.

**Acceptance criteria**
- Fetching screens use skeletons/spinners.
- API failures are surfaced via toast/inline alert/error region.
- No silent failure in login, create, schedule, send, delete, and detail flows.

**Backend subtasks**
- Ensure consistent API error shape across endpoints.
- Include machine-readable error codes for key business failures.

**Frontend subtasks**
- Implement shared loading components/patterns.
- Implement centralized API error presentation.
- Validate UX behavior under network latency and failure.

**Depends on**
- `EN-05`, `EN-08`

---

## VS-09 (P1) - User can manage recipients independently

**User story**  
As a campaign owner, I want recipient management endpoints and UI flows so that contact data can be maintained.

**Acceptance criteria**
- `GET /recipients` lists recipients in authorized scope.
- `POST /recipients` creates recipient with valid email format.
- Duplicate email behavior follows documented uniqueness policy.

**Backend subtasks**
- Implement recipient list/create endpoints with validation.
- Standardize endpoint naming to `/recipients`.

**Frontend subtasks**
- Add recipient management interface or modal flow.
- Integrate list/create APIs with error and loading states.

**Depends on**
- `EN-01`, `EN-02`, `EN-05`
