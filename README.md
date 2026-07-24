## Run locally

```bash
npm install
npm run dev
```

## Verify

```bash
npm test
npm run lint
npm run build
```

## Styling architecture

- `src/primitives.css` contains raw Figma values.
- `src/tailwind-theme.css` exposes semantic Tailwind utilities.
- `src/index.css` is the only global stylesheet entry point.
