# UOI Claims demo: "See what we see"

Booth prototype for Singapore FinTech Festival 2026. The customer's phone and the claims officer's workbench sit side by side; every answer and document lands in the same claim file, and the same assessment appears on both screens.

Fully scripted and offline. All figures and policy wording are illustrative.

```bash
npm install
npm run dev      # develop at http://localhost:5173
npm run build    # dist/index.html: one self-contained file, open it directly from disk
```

## Booth controls

Not shown on screen.

| Keys | Action |
|---|---|
| `Shift+R` | Reset to the idle loop |
| `Shift+S` | Toggle staff mode ("Approve & pay" waits for a real click) |
| `Shift+1` / `Shift+2` | Jump straight into scenario A / B |
| `Shift+F` | Toggle fullscreen |

After 45 seconds without input the demo asks "Still there?", then returns to the idle loop 10 seconds later.

## Where things live

- `src/scenarios/*.ts`: all scenario content (questions, documents, assessment lines, branches). Add a file and list it in `src/scenarios/index.ts`; no UI changes needed.
- `src/engine/machine.ts`: the state store and the director that walks a scenario's steps. Pacing is tuned in the `T` constants.
- `src/components/Phone`, `Desk`, `Shared`: the two views, and the pieces rendered on both (assessment card, answer travel, connectors).
- `src/styles/tokens.css`: brand colours, radii, shadows and type (Noto Sans), taken from the UOI customer portal.
