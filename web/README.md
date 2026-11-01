# CareerMirror web

Next.js (App Router) in JavaScript, Tailwind CSS 4, Thai UI. UI rules: [docs/DesignSystem.md](../docs/DesignSystem.md) · brand values: [docs/CIBrand.md](../docs/CIBrand.md) · brand book: [docs/brand/](../docs/brand/) · API: [docs/Contract.md](../docs/Contract.md).

## Run locally

```bash
cd web
npm install
npm run dev          # http://localhost:3000
npm run lint
npm run build
```

The browser calls `/api/*` on the web origin; `app/api/[...path]/route.js` forwards each request to the api. Outside Docker it uses `API_BASE_URL=http://localhost:8000` unless you set another value (for example in `web/.env.local`, which git ignores). Start the api first (see `api/README.md`).

With Docker, `docker compose up --build` from the repo root starts `web` on port 3000 next to `api` and `db`.

## Layout

```
app/
  layout.js             fonts (Anuphan + Urbanist), lang="th", theme provider, top bar
  globals.css           design tokens: light values in @theme, dark values in .dark
  page.js               temporary home page until the landing page task
  icon.svg              favicon from the logo mark
  api/[...path]/route.js  /api proxy to the api container
components/
  theme-provider.js     next-themes: light / dark / system, saved in localStorage
  theme-toggle.js       icon button + menu: สว่าง / มืด / ตามระบบ
  top-bar.js            slim app-shell top bar (app name, theme toggle)
  logo.js               logo mark and wordmark, coloured by tokens
components/charts/       chart card + table view, meter, skill radar, match, salary range,
                         work style, admin charts (Recharts 3; examples at /examples/charts)
lib/
  api.js                fetch helper: JSON or FormData body, ApiError with message_th, quota headers
  config.js             APP_NAME (build time) and API_BASE_URL (request time)
  format.js             ฿, %, numbers and Thai dates (DesignSystem.md 5)
  use-motion.js         reduced-motion check, count-up and grow-in helpers
  mock/charts.js        mock data for /examples/charts only
```

## Rules

- Colours, fonts, radius and type sizes come only from the tokens in `app/globals.css`, which mirror CIBrand.md. The default Tailwind colour palette is switched off, so only brand utilities exist: `bg-bg`, `bg-surface`, `border-border`, `text-text`, `text-text-muted`, `bg-primary`, `text-on-primary`, `bg-primary-subtle`, `text-accent`, `text-success`, `text-warning`, `text-danger`, `text-info`. Charts use `--color-chart-you` and `--color-chart-ref` (DesignSystem.md 1.5).
- Never use hex values or `dark:` colour overrides in components; every token already has a dark value.
- Type sizes: `text-display`, `text-h1`, `text-h2`, `text-h3`, `text-body`, `text-small`, `text-tiny` (sizes and line heights from DesignSystem.md 1.2). Radius: `rounded-sm` 8 px, `rounded-md` 12 px, `rounded-lg` 16 px, `rounded-xl` 20 px.
- Frosted glass (`glass`) and the brand gradient (`bg-brand-gradient`) only on the hero and empty states.
- All user-facing text is Thai; call the API with `api()` from `lib/api.js` and show `error.messageTh` on failure.
- If the proxy cannot reach the api it returns `502` with code `INTERNAL_ERROR` and a Thai message.
