# Campaign Manager Monorepo

Campaign Manager is a Yarn workspaces monorepo with a Node.js backend and a React frontend.

## AI Agent Workflow

This project is delivered through an AI agent workflow centered on vertical user stories, with explicit enablers/spikes, repeatable prompt-driven execution, quality gates, and story-level implementation documentation.

- Workflow guide: `docs/showcase/workflow.md`

## Stack Decision Summary

The requirement variants are resolved with the following authoritative choices:

- Backend API framework: `Express`
- Backend query and migration layer: `Sequelize`
- Frontend server-state: `TanStack Query`
- Frontend client-state: `Zustand`
- Repo layout: Yarn workspaces monorepo (`backend`, `frontend`)

These decisions are applied across `EN-01` to `EN-08`.

## Workspaces

- `backend` - Express + Sequelize + PostgreSQL API
- `frontend` - React + Vite + TanStack Query + Zustand client

## Quick Start

1. Install dependencies:
   - `yarn install`
2. Start local infrastructure:
   - `docker compose -f backend/docker-compose.yml up -d`
3. Run backend migrations:
   - `yarn workspace campaign-manager-backend db:migrate`
4. Run backend:
   - `yarn dev:backend`
5. Run frontend:
   - `yarn dev:frontend`

## Root Commands

- `yarn dev:backend` - start backend in watch mode
- `yarn dev:frontend` - start frontend
- `yarn build` - build both workspaces
- `yarn test:backend` - run backend tests
