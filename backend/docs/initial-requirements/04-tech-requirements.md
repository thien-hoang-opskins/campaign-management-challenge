# Part I.4 - Tech Requirements and Testing (Agent-Friendly)

## Goal
Implement backend using required stack constraints and provide minimum quality gates.

## Required Stack
- Node.js backend
- Express for API layer
- PostgreSQL database
- Query layer:
  - Sequelize for data access/migrations
- JWT authentication middleware
- Input validation with `zod` or `joi`
- Database migrations (SQL files or migration tool)

## Testing Requirements
- At least 3 meaningful tests for critical business logic
- Prefer integration-style tests for:
  - Draft-only update/delete protection
  - Future-only schedule validation
  - Send flow status transitions and stats correctness

## Suggested Non-Functional Standards
- Consistent API error shape
- Environment-based config management
- Structured logging for auth/scheduling/sending failures
- Seed script or demo bootstrap data

## Suggested Project Structure (Backend)
- `src/modules/auth/*`
- `src/modules/campaigns/*`
- `src/modules/recipients/*`
- `src/db/migrations/*`
- `src/middlewares/*`
- `tests/*`

## Definition of Done for Part I
- Schema exists with constraints + indexes
- All required endpoints implemented and authenticated
- Business rules enforced server-side
- Migrations run from a clean database
- Minimum test requirement met
- README explains implementation choices where challenge versions conflict
