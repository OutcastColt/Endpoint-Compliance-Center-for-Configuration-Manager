# Endpoint Compliance Center — Agent Guide

## Project Overview

Web-based compliance dashboard for Microsoft Configuration Manager. React + TypeScript SPA deployed to GitHub Pages. Currently uses mock data; designed for future ConfigMgr REST API integration.

- **Repo:** https://github.com/OutcastColt/Endpoint-Compliance-Center-for-Configuration-Manager
- **Live site:** https://outcastcolt.github.io/Endpoint-Compliance-Center-for-Configuration-Manager/
- **All source code:** `frontend/src/`
- **Deployment:** push to `main` → GitHub Actions → GitHub Pages (automatic)

## Tech Stack

React 19, TypeScript, Vite 8, Tailwind CSS 4, Radix UI, Recharts, TanStack Table, TanStack React Query, Zustand, React Hook Form + Zod, Lucide React.

## Key Conventions

- **No raw hex values in components** — use CSS custom property tokens from `index.css` (e.g., `var(--bg-surface)`, `var(--accent-primary)`)
- **Mock data lives in `mockData.ts`** — when adding features, add corresponding mock data there
- **Type all data shapes in `types.ts`** — add new interfaces here, not inline
- **Accessibility is non-negotiable** — WCAG 2.1 AA; status indicators must pair color with icon + text
- **Radix UI for interactive primitives** — Dialog, Dropdown, Select, Tabs, Tooltip; do not rebuild these from scratch

## Documentation Policy

**When completing a task that adds or modifies features, update the relevant doc(s) before marking the task done:**

| What changed | Update this file |
|---|---|
| New feature, page, or component | `docs/features.md` |
| Architecture, routing, state management | `docs/architecture.md` |
| Dev workflow, tooling, build, deploy | `docs/development.md` |
| API contract or data shape | `docs/api.md` |
| Major project-level change | `README.md` |

This keeps documentation in sync with the code without requiring a separate documentation pass.

## Build & Dev

```bash
cd frontend
npm install       # first time
npm run dev       # local dev server
npm run build     # production build
npm run lint      # ESLint
```
