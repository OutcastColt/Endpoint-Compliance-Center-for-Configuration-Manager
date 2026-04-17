# Developer Guide

## Prerequisites

- Node.js 20+
- npm 10+
- Git

---

## Local Development

```bash
# Clone
git clone https://github.com/OutcastColt/Endpoint-Compliance-Center-for-Configuration-Manager.git
cd Endpoint-Compliance-Center-for-Configuration-Manager

# Install dependencies
cd frontend
npm install

# Start dev server
npm run dev
```

Dev server runs at: `http://localhost:5173/Endpoint-Compliance-Center-for-Configuration-Manager/`

The base path matches the GitHub Pages deployment path so that asset URLs are consistent across environments.

Login with any username/password — authentication is currently mocked and always succeeds.

---

## Available Scripts

All scripts run from the `frontend/` directory.

| Script | Command | Description |
|---|---|---|
| Dev server | `npm run dev` | Starts Vite HMR dev server |
| Production build | `npm run build` | TypeScript check + Vite production build → `dist/` |
| Preview build | `npm run preview` | Serve the production build locally |
| Lint | `npm run lint` | ESLint with TypeScript rules |

---

## Building for Production

```bash
cd frontend
npm run build
```

Output goes to `frontend/dist/`. The build includes:
- Minified JS bundle (Vite code-splitting)
- Minified CSS (Tailwind purge + PostCSS)
- Static assets (SVG icons, fonts)

---

## Deployment

Deployment is automated via GitHub Actions. Any push to `main` triggers the deploy workflow.

**Workflow file:** `.github/workflows/deploy.yml`

**Steps:**
1. Checkout repo
2. Setup Node.js 20 (with npm cache on `frontend/package-lock.json`)
3. `npm ci` in `frontend/`
4. `npm run build` in `frontend/`
5. Upload `frontend/dist/` as a GitHub Pages artifact
6. Deploy to GitHub Pages

**Live URL:** `https://outcastcolt.github.io/Endpoint-Compliance-Center-for-Configuration-Manager/`

To trigger a manual deploy without pushing, use the `workflow_dispatch` trigger in the GitHub Actions UI.

---

## Project Structure

```
frontend/src/
├── components/          # Shared reusable components
│   ├── AlertCard.tsx
│   ├── DonutChart.tsx
│   ├── FilterBar.tsx
│   ├── Layout.tsx       # App shell (sidebar + outlet)
│   ├── MetricCard.tsx
│   ├── Sidebar.tsx
│   └── StatusBadge.tsx
├── pages/               # One file per route
│   ├── Alerts.tsx
│   ├── Dashboard.tsx
│   ├── EndpointDetail.tsx
│   ├── Endpoints.tsx
│   ├── Login.tsx
│   ├── Reports.tsx
│   └── Settings.tsx
├── types.ts             # Shared TypeScript interfaces
├── mockData.ts          # Static mock data (replace with API calls)
├── store.ts             # Zustand global state
├── App.tsx              # React Router setup
├── main.tsx             # App entry point
├── index.css            # CSS custom property tokens + base styles
└── App.css              # App-level styles
```

---

## Adding a New Page

1. Create `frontend/src/pages/YourPage.tsx`
2. Add the route to `App.tsx` inside the `<Layout>` route group
3. Add a navigation entry to `Sidebar.tsx`
4. If the page fetches data, add a React Query hook (see [docs/api.md](api.md))

---

## Theming

All colors and spacing are CSS custom properties defined in `index.css`. Components must reference tokens — never hardcode hex values.

```css
/* index.css — dark theme (default) */
:root {
  --bg-base: #0f172a;
  --bg-surface: #1e293b;
  --accent-primary: #0078d4;
  ...
}

/* Light theme override */
[data-theme="light"] {
  --bg-base: #ffffff;
  ...
}
```

Theme toggle is in `store.ts`. It sets `document.documentElement.setAttribute('data-theme', 'light')` and stores the preference.

---

## Mock Data

All data is currently served from `frontend/src/mockData.ts`. When adding or modifying mock endpoints, alerts, or rules, update this file.

When connecting a real backend, replace direct imports of `mockData.ts` with React Query `useQuery` hooks. The TypeScript interfaces in `types.ts` define the expected shapes.

---

## Linting

```bash
cd frontend
npm run lint
```

ESLint is configured in `eslint.config.js` with:
- `@eslint/js` recommended
- `typescript-eslint` recommended
- `eslint-plugin-react-hooks`
- `eslint-plugin-react-refresh`

---

## Accessibility Testing

- Use the [axe DevTools](https://www.deque.com/axe/devtools/) browser extension during development
- All new components must meet WCAG 2.1 AA
- Run a manual keyboard-navigation check on any new interactive component
- Status indicators must pair color with icon + text (never color-only)
- See [ux-design-spec.md](../ux-design-spec.md) Section 8 for the full accessibility requirement table

---

## Documentation Updates

**When completing a task that adds or modifies features, update the relevant docs:**

- New feature or page → update `docs/features.md`
- Architecture change → update `docs/architecture.md`
- New dev workflow or tooling → update `docs/development.md`
- API contract change → update `docs/api.md`
- Root `README.md` — update only if the project overview, tech stack, or structure changes significantly
