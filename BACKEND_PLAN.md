# Backend Setup Plan — NestJS + MongoDB

## Overview
This document describes a recommended setup for the backend using NestJS (TypeScript) and MongoDB, along with Docker, testing, and CI considerations. It contains a step-by-step plan and justification for technology choices and layout.

## Goals
- Rapidly scaffold a maintainable, testable API for the existing frontend.
- Use robust patterns (dependency injection, modules) to scale features.
- Provide reproducible local/dev/test environments via Docker.

## Technology choices & justification
- NestJS: opinionated, TypeScript-first framework with DI, modular architecture, easy testing, and strong community support. It maps well to enterprise needs and aligns with React/TypeScript frontend.
- MongoDB: flexible document model for orders/staff/menus, good horizontal scaling and fast prototyping for schema-evolving domains (orders, menus). Use Mongoose for schema validation and modeling.
- Docker + docker-compose: reproducible dev environment and easy onboarding; will include a MongoDB service and optional admin tool (Mongo Express).
- Jest: default NestJS testing stack; supports unit and e2e tests.
- ESLint + Prettier: consistent code style and catching errors early.
- GitHub Actions (or equivalent): run lint, tests, and build on PRs.

## High-level file layout (recommended)
- src/
  - main.ts
  - app.module.ts
  - common/ (filters, interceptors, pipes, guards)
  - config/ (configuration service, env schema)
  - modules/
    - auth/
      - auth.module.ts
      - auth.service.ts
      - jwt.strategy.ts
    - users/
    - orders/
  - database/
    - mongoose.module.ts (connection)
- test/ (e2e tests)

## Environment variables (example)
- PORT=3000
- MONGODB_URI=mongodb://mongo:27017/kraud_dev
- JWT_SECRET=your_jwt_secret
- NODE_ENV=development

## Step-by-step plan (actionable)
1. Initialize project
   - `npm init -y`
   - `npm i -D @nestjs/cli` and `npx nest-cli new .` or `npx @nestjs/cli new kraud-be` (TypeScript)
2. Add core dependencies
   - `npm i @nestjs/mongoose mongoose dotenv`
   - `npm i @nestjs/config` to centralize env
   - `npm i @nestjs/passport passport passport-jwt bcrypt` for auth
3. Create Mongoose connection module
   - Use `@nestjs/config` to load envs
   - Create `MongooseModule.forRoot(process.env.MONGODB_URI, {...})`
4. Scaffold modules
   - `auth`, `users`, `orders` with controllers/services/dto/schema files
   - Define Mongoose schemas and DTOs using `class-validator` + `class-transformer`
5. Authentication
   - Implement JWT strategy, AuthGuard, refresh tokens (optional), password hashing with bcrypt
6. Dockerize
   - `Dockerfile` for Node app (multi-stage build for smaller images)
   - `docker-compose.yml` with `mongo` service and volumes
   - Optionally add `mongo-express` for quick DB inspection
7. Seeds & initial data
   - Add a `scripts/seed.ts` executable via ts-node or a compiled script to seed admin user and sample data
8. Tests & lint
   - Add Jest unit tests for services and controllers
   - Add e2e tests that run against a test MongoDB instance (use `mongodb-memory-server` or a docker compose test profile)
   - Configure ESLint + Prettier
9. CI/CD
   - Add GitHub Actions to run `npm ci`, `npm run lint`, `npm test`, and optionally build Docker image
10. Documentation
   - README with dev/run commands, environment variables, and example requests

## Suggested Docker snippets
- docker-compose.yml (minimal)

version: '3.8'
services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - MONGODB_URI=mongodb://mongo:27017/kraud_dev
    depends_on:
      - mongo
  mongo:
    image: mongo:6
    volumes:
      - mongo-data:/data/db
volumes:
  mongo-data:

## Quick dev commands (after scaffold)
- `npm run start:dev` — run with hot reload
- `docker-compose up --build` — run API + Mongo locally
- `npm run test` — run unit and e2e tests

## Security & operational notes
- Keep `JWT_SECRET` and other secrets in a secrets manager for production (do not commit `.env`)
- Enable indexes on frequently queried fields (e.g., user email)
- Consider backups and data migration tools (mongodump, or a migration runner like `migrate-mongo`)

## Estimated effort
- Scaffolding + basic modules + Docker: 1–2 days
- Auth + validation + seed data: 1 day
- Tests & CI: 1–2 days

## Next steps (recommended immediate next actions)
- Scaffold the NestJS app and commit the skeleton
- Add Dockerfile + docker-compose and verify `docker-compose up` connects to Mongo
- Implement Mongoose connection and a single `users` module to validate end-to-end flow

---

If you want, I can now scaffold the NestJS project inside `kraud-be`, add Docker files, and implement the Mongoose connection and `users` module as the first feature. Let me know which step to start with.
