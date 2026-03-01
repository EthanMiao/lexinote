# Architecture

## Tech Stack

- Next.js `16` (App Router)
- React `19`
- TypeScript `5`
- Tailwind CSS `4` via PostCSS

## Current Structure

- `app/`: Route and layout entry (`layout.tsx`, `page.tsx`, global CSS)
- `public/`: Static assets served from `/`
- Root configs: `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`
- Human-facing overview: `PROJECT_STRUCTURE.md`
- AI docs index: root `AGENTS.md` -> `docs/ai/*`

## Runtime Flow

1. `npm run dev` starts Next.js dev server.
2. Root layout in `app/layout.tsx` wraps all routes.
3. Route file `app/page.tsx` renders `/`.
4. Global styles come from `app/globals.css`.

## Extension Guidance

- Add new routes with `app/<segment>/page.tsx`.
- Add shared UI components under a future `components/` directory.
- Add business modules under a future `features/` directory.
