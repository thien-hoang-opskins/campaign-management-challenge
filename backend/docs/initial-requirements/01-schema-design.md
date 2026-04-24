# Part I.1 - Schema Design (Agent-Friendly)

## Goal
Design a PostgreSQL schema for a mini campaign manager backend.

## Required Core Tables

### `users`
- `id` (PK)
- `email` (unique, required)
- `name` (required)
- `created_at` (timestamp, required, default now)

### `campaigns`
- `id` (PK)
- `name` (required)
- `subject` (required)
- `body` (text, required)
- `status` (required enum/string)
  - Include at least: `draft`, `scheduled`, `sent`
  - A variant of the challenge also includes `sending`; support it only if needed by send flow
- `scheduled_at` (nullable timestamp)
- `created_by` (FK -> `users.id`, required)
- `created_at` (timestamp, required, default now)
- `updated_at` (timestamp, required, default now)

### `recipients`
- `id` (PK)
- `email` (unique or tenant-scoped unique; required)
- `name` (nullable/required based on product decision)
- `created_at` (timestamp, required, default now)

### `campaign_recipients`
- `campaign_id` (FK -> `campaigns.id`)
- `recipient_id` (FK -> `recipients.id`)
- `sent_at` (nullable timestamp)
- `opened_at` (nullable timestamp)
- `status` (required enum/string: `pending` | `sent` | `failed`)
- Composite primary key or unique constraint on (`campaign_id`, `recipient_id`)

## Suggested Indexes (Minimum Set)
- `users(email)` unique index
- `campaigns(created_by, created_at desc)` for user campaign list
- `campaigns(status, scheduled_at)` for scheduling/sending jobs
- `campaign_recipients(campaign_id, status)` for stats and send progress
- `campaign_recipients(campaign_id, opened_at)` for open-rate queries
- `recipients(email)` index/unique index

## Integrity Rules to Encode in DB
- FK constraints with safe delete behavior (`ON DELETE CASCADE` for `campaign_recipients` from `campaigns`)
- Check constraint for campaign status values
- Check constraint for campaign recipient status values
- Optional check: `opened_at` should not be earlier than `sent_at` when both exist

## Migration Deliverables
- Initial migration creating all required tables
- Secondary migration(s) for indexes and check constraints if separated
- Rollback support for each migration

