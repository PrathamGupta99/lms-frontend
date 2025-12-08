# LMS Frontend

Next.js + TypeScript client for the adaptive testing LMS, using React Context for state. This repository is scoped for frontend-only work and will be expanded ticket-by-ticket.

## Quick start
1. Install dependencies: `npm install`
2. Run dev server: `npm run dev` (defaults to http://localhost:3000)
3. Build for production: `npm run build`
4. Start production build: `npm run start`

## Scripts
- `npm run dev` — start Next.js dev server
- `npm run build` — build for production
- `npm run start` — run production server
- `npm run lint` — lint the codebase
- `npm run format` — prettier format

## Docker
- Build: `docker build -t lms-frontend .`
- Run: `docker run --env-file .env -p 3000:3000 lms-frontend`
- Compose: `docker compose up --build` (uses `docker-compose.yml`)

## Role rules (UI mirrors backend)
- Admin: created via `/register`; can manage users/questions/tests and preview tests; cannot take tests.
- Normal user: created by admin; can start adaptive tests via unique URLs and view results.
