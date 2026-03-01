# Runbook

## Local Development

1. Install dependencies:
   `npm install`
2. Start dev server:
   `npm run dev`
3. Open:
   `http://localhost:3000`

## Quality Checks

- Lint:
  `npm run lint`
- Production build:
  `npm run build`
- Start production server:
  `npm run start`

## Common Issues

### Port 3000 In Use

- Run with another port:
  `npm run dev -- -p 3001`

### Dependency Drift

- Remove `node_modules` and reinstall:
  `rm -rf node_modules && npm ci`
- Only update `package-lock.json` when intentionally upgrading dependencies.

### Build Fails After Config Change

- Clear build cache:
  `rm -rf .next && npm run build`

## AI Docs Skill (Next Official MCP)

1. Keep `.mcp.json` at repo root with `next-devtools-mcp`.
2. In Codex/agent session, initialize docs index once:
   `init`
3. Before querying docs, read the index resource once to get exact doc paths:
   `nextjs-docs://llms-index`
4. Query Next docs with an exact path from the index:
   `nextjs_docs(path: "/docs/...")`
5. Use `upgrade_nextjs_16` when migrating from older major versions.
