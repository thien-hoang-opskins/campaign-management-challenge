# Part 2 — Frontend Requirements (React + TypeScript)

## Purpose

This folder is the implementation source of truth for **Part 2 — Frontend** of the Mini Campaign Manager challenge, transcribed from the canonical Notion page.

## Source

- **Notion (public site):** [AI Full-Stack Code Challenge](https://s5tech.notion.site/AI-Full-Stack-Code-Challenge-32248905ea7780cd8796c1961de759ec)
- **Notion page ID:** `32248905ea7780cd8796c1961de759ec` (also reachable as `https://www.notion.so/32248905ea7780cd8796c1961de759ec`)

Content was retrieved via the Notion MCP `notion-fetch` tool. The live page contains **two copies** of the challenge (Part 1 differs between them); Part 2 is nearly identical except for **tech requirements** (see [03-tech-requirements.md](./03-tech-requirements.md)).

## Execution order

1. [01-pages-and-routing.md](./01-pages-and-routing.md) — routes and screen responsibilities
2. [02-ui-features.md](./02-ui-features.md) — badges, actions, stats, errors, loading
3. [03-tech-requirements.md](./03-tech-requirements.md) — stack, data fetching, state, monorepo note

## Agent workflow

1. Align stack choices where the two Part 2 variants disagree (document the decision in the repo root or frontend `README.md`).
2. Implement routing and auth gate (`/login` vs protected campaign routes).
3. Wire list, create, and detail flows to the backend API contract.
4. Implement status badges, conditional actions, stats visualization, API error surfacing, and loading UX.
5. Manually verify flows against backend business rules (draft-only edit/delete, schedule, send).

## Conflict resolution policy

When requirement variants disagree:

1. Latest explicit evaluator instruction
2. Stricter requirement
3. Document the chosen interpretation (see variant table in [03-tech-requirements.md](./03-tech-requirements.md))

## Minimum verification checklist

- All four routes exist and behave as specified
- JWT stored per spec (memory or httpOnly cookie)
- Campaign list supports pagination or infinite scroll
- Status badges match required colors for `draft`, `scheduled`, `sent`
- Schedule, Send, and Delete visibility follows campaign status
- Stats show open rate and send rate with a progress bar or simple chart
- Failed API calls show meaningful errors
- Fetches show skeleton or spinner loading states
