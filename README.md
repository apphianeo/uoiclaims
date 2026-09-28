# UOI Claims demo: "See what we see"

Booth prototype for Singapore FinTech Festival 2026. Fully scripted, offline, 1920×1080.
See the build spec for the full flow; this repo is built milestone by milestone.

```bash
npm install
npm run dev      # develop at http://localhost:5173
npm run build    # dist/index.html: one self-contained file, open it directly from disk
```

- Brand colours, radii, shadows and type (Noto Sans) come from the UOI customer portal: `src/styles/tokens.css`.
- Scenario content: `src/scenarios/*.ts` (from milestone 2).
