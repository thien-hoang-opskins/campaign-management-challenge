# Tech requirements

## Shared requirements (both variants on the source page)

- **React 18+** with **TypeScript**
- **TanStack Query (React Query)** or **SWR** for server state and data fetching
- **Any component library** is acceptable: **shadcn/ui**, **Chakra**, **MUI**, or **Tailwind** (or combinations that stay maintainable)

## Variant A (first Part 2 block on the page)

- TypeScript without naming a bundler explicitly
- **Redux required** (global client state)

## Variant B (second Part 2 block on the page)

- **React 18+ with TypeScript (Vite)** as the toolchain
- **Zustand or Redux required** for client state
- **Monorepo:** backend and frontend in the **same repo**, **Yarn workspaces**

## How to reconcile variants

| Topic | Variant A | Variant B | Suggested default for this repo |
|--------|-----------|-----------|----------------------------------|
| Bundler | Unspecified | Vite | Prefer **Vite** if the frontend is already Vite-based |
| Client state | Redux only | Zustand **or** Redux | Prefer **Zustand** for minimal boilerplate **or** **Redux Toolkit** if you need strict patterns—document the choice |
| Monorepo / Yarn | Silent | Required | Match **actual repo layout**; if already a monorepo, satisfy variant B |

Record the final choice in the repository `README.md` (or frontend `README.md`) so reviewers see a single source of truth.
