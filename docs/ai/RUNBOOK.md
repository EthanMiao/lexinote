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
