# Conventions

## General

- Prefer TypeScript for all new code.
- Keep components small and single-purpose.
- Avoid adding dependencies without clear need.

## Next.js App Router

- Use `app/` routing conventions (`page.tsx`, `layout.tsx`).
- Keep global concerns in root `app/layout.tsx`.
- Keep route-specific logic inside the route segment folder.

## Styling

- Prefer Tailwind utility classes for component styling.
- Keep global CSS in `app/globals.css` limited to reset/theme primitives.

## Naming

- Components: `PascalCase`
- Variables/functions: `camelCase`
- Constants: `UPPER_SNAKE_CASE` when truly constant
- File names for routes/layouts follow Next.js reserved names.

## Imports

- Prefer alias imports with `@/` when paths get long.
- Group imports in this order: external packages, internal modules, relative files.

## Quality Bar

- Run `npm run lint` before commit.
- Keep commits focused and descriptive.
- Update `docs/ai/*` when architecture or workflow changes.

