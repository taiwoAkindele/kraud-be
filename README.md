# Kraud Backend (skeleton)

This folder contains a minimal NestJS project scaffold for the Kraud backend.

Quick start (after installing dependencies):

```bash
# from kraud-be
npm install
npm run start:dev
```

Files created:
- `package.json` - scripts and dependencies for local development
- `tsconfig.json`, `tsconfig.build.json` - TypeScript configs
- `src/main.ts` - entrypoint (heavily commented)
- `src/app.module.ts`, `src/app.controller.ts`, `src/app.service.ts` - minimal module/controller/service

Next steps:
- Install dependencies: `npm ci`
- Add Mongoose integration and modules
- Add Dockerfile and docker-compose (if desired)
