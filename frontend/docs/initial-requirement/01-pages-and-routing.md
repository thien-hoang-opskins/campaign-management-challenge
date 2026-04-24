# Pages and routing

Build a **simple but functional** UI.

## Required routes

| Route | Behavior |
|--------|------------|
| `/login` | Login form; store JWT **in memory** or **httpOnly cookie** |
| `/campaigns` | List campaigns with **status badges**; use **pagination** or **infinite scroll** |
| `/campaigns/new` | Create campaign: **name**, **subject**, **body**, **recipient emails** |
| `/campaigns/:id` | Campaign detail: **stats**, **recipient list**, **action buttons** |

## Notes for implementation

- Protect campaign routes when there is no valid session; redirect unauthenticated users to `/login` as appropriate.
- Detail page should load enough data to render recipient rows and stats; exact API shapes depend on the backend contract (`GET /campaigns/:id`, `GET /campaigns/:id/stats`, etc.).

## Monorepo (variant B only)

One version of the challenge states that **backend and frontend should live in the same monorepo** using **Yarn workspaces**. If this repo already uses that layout, keep shared types or API clients in a workspace package only when it reduces duplication without coupling layers incorrectly.
