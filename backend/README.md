# Campaign Manager Backend

Express + Sequelize backend implementing enablers `EN-01` to `EN-04`.

## Commands

- `yarn workspace campaign-manager-backend dev`
- `yarn workspace campaign-manager-backend db:migrate`
- `yarn workspace campaign-manager-backend db:migrate:undo`
- `yarn workspace campaign-manager-backend db:seed:vs01`
- `yarn workspace campaign-manager-backend db:seed:vs03`
- `yarn workspace campaign-manager-backend db:seed:vs04`
- `yarn workspace campaign-manager-backend db:seed:vs07`
- `yarn workspace campaign-manager-backend db:seed:vs09`
- `yarn workspace campaign-manager-backend test`

## Stack

- Node.js + Express
- PostgreSQL + Sequelize migrations
- JWT auth middleware
- `zod` validation at HTTP boundaries
# Campaign Manager — Backend (Part I)

Node.js + Express REST API for campaign lifecycle, recipients, auth, and delivery stats. Domain rules live on rich aggregates (especially `Campaign`); HTTP/DB are adapters.

## Requirements source

- `docs/initial-requirements/01-schema-design.md`
- `docs/initial-requirements/02-api-endpoints.md`
- `docs/initial-requirements/03-business-rules.md`
- `docs/initial-requirements/04-tech-requirements.md`
- `docs/initial-requirements/INDEX.md` (verification checklist)

## Stack choices (variant conflicts)

| Topic | Choice | Rationale |
|--------|--------|-----------|
| HTTP framework | **Express** | Required in one challenge variant; widely used and sufficient here. |
| SQL / persistence | **Knex** (migrations + queries) + **pg** | Lightweight query layer without Sequelize/Prisma ORM; explicit SQL-shaped repositories. |
| Validation | **Zod** | At HTTP boundaries only; matches “zod or joi” requirement. |
| Auth | **JWT** (Bearer) + **bcrypt** | Standard stateless API auth. |

## Strategic DDD

### Ubiquitous language (glossary)

- **User (campaign owner)**: Authenticated actor who owns campaigns (`created_by`).
- **Campaign**: Named message (`name`, `subject`, `body`) with a **lifecycle status** (`draft` → `scheduled` → `sent`).
- **Schedule**: User-selected future instant (`scheduled_at`) when the campaign should go out; transitions to `scheduled`.
- **Send (dispatch)**: Simulated delivery to all linked recipients; finalizes the campaign as `sent` (no return).
- **Recipient**: Global addressee record (email uniqueness is case-insensitive at the DB boundary).
- **Campaign recipient / delivery slot**: Link row tracking per-recipient `pending` → `sent` | `failed`, plus `sent_at` / optional `opened_at`.
- **Stats**: Aggregates over delivery slots for a campaign (`total`, `sent`, `failed`, `opened`, rates).

### Bounded contexts

1. **Identity & Access** — register/login, password hashing, JWT issuance, authentication middleware.
2. **Campaign Lifecycle** — draft CRUD, schedule, send, ownership; `Campaign` aggregate enforces invariants.
3. **Recipient Management** — list/create recipients (global directory in v1).
4. **Campaign Delivery & Tracking** — `campaign_recipients` rows, simulated send outcomes, stats contract.

### Context map (v1)

- **Identity** supplies **user id** to **Campaign Lifecycle** as owner identity (no separate IAM federation).
- **Campaign Lifecycle** references **Recipient Management** by **recipient id** only at creation/link time.
- **Delivery & Tracking** is modeled **inside** the `Campaign` aggregate (slots loaded with the campaign); persistence is normalized in `campaign_recipients`.

## Tactical DDD (high level)

- **Aggregate root**: `Campaign` — owns lifecycle transitions, draft-only edits, schedule validation vs `now`, dispatch simulation over its `CampaignDeliverySlot` collection, and stats derivation (`computeStats`).
- **Entities / VOs**: `CampaignDeliverySlot` (per-recipient state), `Email` (shared VO), status enums as string unions with DB checks.
- **Repositories (ports)**: `CampaignRepository`, `RecipientRepository`, `AuthUserRepository` — aggregate-shaped methods, not generic `Repository<T>`.
- **Application services**: Orchestrate transactions, row locks (`SELECT … FOR UPDATE` on `campaigns`), and persistence after domain commands.

## API contracts

- Typed Zod schemas per route for params/query/body (see `*.schemas.ts` under each module).
- **Single error envelope**: `{ "error": { "code", "message", "details?" } }` (`ApiErrorBody`).
- **Pagination**: `page`, `pageSize` (default 20, max 100) on `GET /campaigns` and `GET /recipients`; responses include `pagination: { page, pageSize, totalItems, totalPages }`.
- **Naming**: Plural REST resources (`/campaigns`, `/recipients`). Auth under `/auth/*`.

## Business rules (implemented)

- **Draft-only** `PATCH` / `DELETE` — enforced in `Campaign.reviseContent` / `Campaign.discard` (HTTP 409).
- **Future-only schedule** — `Campaign.scheduleForFuture` compares strictly to `now` (HTTP 409).
- **No edits after sent** — aggregate refuses transitions from `sent` (HTTP 409 on schedule/patch/delete; send is idempotent).
- **Send idempotency** — second `POST …/send` after `sent` returns **409** with `CAMPAIGN_ALREADY_SENT` in `details`.
- **Concurrency** — send + schedule paths load the campaign with `FOR UPDATE` inside a DB transaction.
- **Zero-recipient send** — allowed: campaign becomes `sent` with empty delivery set; stats return zeros (deterministic).
- **Schedule then send** — **explicit send wins**: a user may send while `scheduled`; we do not block send until `scheduled_at`. Documented here so scheduling jobs vs immediate send is unambiguous.

## Stats contract

`GET /campaigns/:id/stats` returns:

```json
{
  "total": 0,
  "sent": 0,
  "failed": 0,
  "opened": 0,
  "open_rate": 0,
  "send_rate": 0
}
```

- **`open_rate`** = `opened / total` (if `total === 0`, rate is `0`). *Not* `opened/sent`, so failed sends still count toward the denominator — matches “per campaign audience” interpretation.
- **`send_rate`** = `sent / total` (if `total === 0`, rate is `0`).

## Simulated send semantics

- Recipients whose **email local-part contains `"fail"`** (case-insensitive substring on normalized email) simulate **failure**; otherwise **sent** with `sent_at` set.
- **Opened** timestamps are assigned **deterministically** from `(campaignId, recipientId)` so stats stay stable in tests.

## Local development

1. Start PostgreSQL (e.g. `docker compose up -d` in `backend/` — port **5434** in the provided compose file).
2. Create databases if needed: `campaign_management_db` and `campaign_management_test` (for integration tests).
3. Copy `.env.example` → `.env` and adjust secrets (**`JWT_SECRET` must be ≥ 32 characters**).
4. From repo root: `yarn install`, then `yarn workspace campaign-manager-backend migrate:latest`.
5. `yarn workspace campaign-manager-backend dev` — listens on `PORT` (default **4000**).

### Migrations rollback

```bash
yarn workspace campaign-manager-backend migrate:rollback
```

### Seed demo user

```bash
yarn workspace campaign-manager-backend db:seed:vs01
```

## Tests

```bash
yarn workspace campaign-manager-backend test
```

Requires PostgreSQL and a migrated **`campaign_management_test`** database. Vitest runs `tests/globalSetup.ts` (`migrate:latest`) then integration tests.

## INDEX.md checklist (Part I)

- [x] Schema + constraints + indexes (initial migration)
- [x] Migrations up (global test setup); rollback supported via Knex CLI
- [x] JWT on all non-auth routes
- [x] Draft-only edit/delete
- [x] Future-only schedule
- [x] Send reaches `sent` with transaction + row lock; idempotent second send → 409
- [x] `/campaigns/:id/stats` matches numeric contract
- [x] Integration tests for the three critical paths above
