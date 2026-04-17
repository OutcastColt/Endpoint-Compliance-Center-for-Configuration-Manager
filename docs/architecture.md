# Architecture

## Overview

The Endpoint Compliance Center is a **single-page application (SPA)** built with React. It runs entirely in the browser and is deployed as a static site to GitHub Pages. There is currently no backend server — all data is served from `mockData.ts`. The architecture is designed so that mock data sources can be replaced with real API calls without changing the component layer.

---

## Deployment Architecture

```
User Browser
    │
    ▼
GitHub Pages (static hosting)
    │  https://outcastcolt.github.io/Endpoint-Compliance-Center-for-Configuration-Manager/
    │
    ▼
frontend/dist/         ← Vite production build
    index.html
    assets/
        index-[hash].js
        index-[hash].css
```

GitHub Actions builds the `frontend/` directory on every push to `main` and deploys `frontend/dist/` to GitHub Pages. See `.github/workflows/deploy.yml`.

**Future state (planned):** A backend server would sit between the browser and ConfigMgr, proxying the ConfigMgr REST API and SCCM SQL data sources, handling authentication, and serving the SPA.

---

## Frontend Architecture

```
App.tsx  (React Router v7)
│
├── / → Login.tsx
│
└── Layout.tsx  (Sidebar + Outlet)
    ├── /dashboard         → Dashboard.tsx
    ├── /endpoints         → Endpoints.tsx
    ├── /endpoints/:id     → EndpointDetail.tsx
    ├── /reports           → Reports.tsx
    ├── /alerts            → Alerts.tsx
    └── /settings          → Settings.tsx
```

### State Management

| Concern | Solution |
|---|---|
| Server/async data | TanStack React Query (2-min stale time, retry: 1) |
| UI state (sidebar, theme) | Zustand (`store.ts`) |
| Form state | React Hook Form + Zod schemas |
| URL/filter state | React Router `useSearchParams` |

### Data Flow (current — mock)

```
mockData.ts
    └── imported directly into page components
            └── rendered via TanStack Table / Recharts / custom components
```

### Data Flow (planned — real backend)

```
ConfigMgr REST API  +  SCCM SQL
    └── Backend proxy server
            └── REST API endpoints
                    └── React Query fetchers (in pages / hooks)
                            └── page components (no component changes needed)
```

---

## Component Map

### Shared Components (`frontend/src/components/`)

| Component | Purpose |
|---|---|
| `Layout.tsx` | Shell with `<Sidebar>` and `<Outlet>` |
| `Sidebar.tsx` | Collapsible navigation, persists state in localStorage |
| `StatusBadge.tsx` | Color + icon + text status pill (compliant / warning / critical / unknown / pending) |
| `MetricCard.tsx` | KPI card with value, trend arrow, and progress bar |
| `DonutChart.tsx` | SVG donut chart for compliance breakdown |
| `AlertCard.tsx` | Alert notification card with acknowledge/dismiss actions |
| `FilterBar.tsx` | Search input + dropdown filters + active filter chips |

### Pages (`frontend/src/pages/`)

| Page | Route | Description |
|---|---|---|
| `Login.tsx` | `/` | Username/password form with AD status indicator |
| `Dashboard.tsx` | `/dashboard` | KPIs, trend chart, donut chart, alerts, non-compliant table |
| `Endpoints.tsx` | `/endpoints` | Paginated, filterable endpoint list |
| `EndpointDetail.tsx` | `/endpoints/:id` | Per-device detail with Hardware/Software/Compliance/History tabs |
| `Reports.tsx` | `/reports` | Report type selector, date range, group by, export |
| `Alerts.tsx` | `/alerts` | Active alerts + alert rule configuration table |
| `Settings.tsx` | `/settings` | Data sources, authentication, site config, notifications tabs |

---

## Theme System

Styles are built on CSS custom properties defined in `frontend/src/index.css`. Components reference tokens (e.g., `var(--bg-surface)`) and never raw hex values.

```
Dark theme (default): :root { --bg-base: #0f172a; ... }
Light theme:          [data-theme="light"] { --bg-base: #ffffff; ... }
```

Theme toggle is stored in Zustand (`store.ts`) and applied by setting `data-theme` on `<html>`.

---

## Accessibility

WCAG 2.1 AA compliance is a core requirement. Key patterns:

- All status signals pair color with an icon and text label (1.4.1)
- Focus ring: 2px `accent-primary` outline, never hidden (2.4.7)
- Semantic HTML + Radix UI for all interactive primitives
- `aria-live` regions for sync status, errors, and success messages (4.1.3)
- `role="grid"` + `aria-sort` on sortable table headers (4.1.2)
- Charts expose `role="img"` with descriptive `aria-label` (4.1.2)
