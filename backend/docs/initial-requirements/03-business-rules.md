# Part I.3 - Business Rules (Agent-Friendly)

## Goal
Enforce campaign lifecycle and stats behavior strictly on the server.

## Mandatory Rules

### Draft-only mutation
- A campaign can be edited only when `status = draft`
- A campaign can be deleted only when `status = draft`

### Scheduling validity
- `scheduled_at` must be a future timestamp at schedule time
- Reject past or current timestamps

### Send finality
- Sending transitions campaign toward final sent state
- After campaign is `sent`, no further edits/deletes/schedule actions are allowed
- Send operation cannot be undone

### Stats contract
- `/campaigns/:id/stats` must provide:
```json
{ "total": 0, "sent": 0, "failed": 0, "opened": 0, "open_rate": 0, "send_rate": 0 }
```
- Definitions:
  - `total` = all campaign recipients
  - `sent` = recipients with send success
  - `failed` = recipients with send failure
  - `opened` = recipients with non-null `opened_at`
  - `open_rate` = `opened / total` (or `opened / sent` if chosen; must be documented)
  - `send_rate` = `sent / total`

## State Machine (Recommended)
- `draft` -> `scheduled` (via schedule endpoint)
- `draft` or `scheduled` -> `sent` (via send endpoint, depending on policy)
- Optional intermediate: `sending` -> `sent` for async send flow
- No transitions out of `sent`

## Concurrency and Data Safety Rules
- Use row-level locking or guarded updates for status transitions to prevent double-send
- Send operation should be idempotent: repeated call after sent should return conflict/no-op
- Use DB transactions for campaign status + recipient updates

## Validation Rules
- Campaign fields required: `name`, `subject`, `body`
- Recipient emails must be valid format
- Duplicate recipient links in same campaign should be prevented

## Edge Cases to Handle
- Campaign with zero recipients: either block send or define deterministic result
- Schedule then immediate send: define precedence and enforce consistently
- Missing campaign or unauthorized access: return proper error codes
