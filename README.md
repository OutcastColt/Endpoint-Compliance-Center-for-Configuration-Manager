# Endpoint Compliance Center for Configuration Manager

A web-based dashboard for IT administrators to monitor and manage endpoint compliance in Microsoft Configuration Manager (SCCM) environments.

Live demo: [GitHub Pages](https://outcastcolt.github.io/Endpoint-Compliance-Center-for-Configuration-Manager/)

---

## Overview

The Endpoint Compliance Center provides a single-pane-of-glass view of device compliance across a Configuration Manager estate. Administrators can track compliant/non-compliant/warning endpoint states, drill into individual device details, configure alert rules, and generate compliance reports — all without leaving the browser.

The current release is a **frontend-only** application backed by mock data. It is designed to be connected to a ConfigMgr REST API backend in a future phase.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build tool | Vite 8 |
| Styling | Tailwind CSS 4 (via `@tailwindcss/vite`) + CSS custom properties |
| UI primitives | Radix UI (Dialog, Dropdown, Select, Tabs, Tooltip) |
| Charts | Recharts (SVG-based) |
| Tables | TanStack Table |
| Server state | TanStack React Query |
| Client state | Zustand |
| Forms | React Hook Form + Zod |
| Icons | Lucide React |
| Fonts | Inter (`@fontsource/inter`, self-hosted) |
| Hosting | GitHub Pages (via GitHub Actions) |

---

## Project Structure

```
Endpoint-Compliance-Center-for-Configuration-Manager/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Pages CI/CD
├── frontend/
│   ├── src/
│   │   ├── components/         # Shared UI components
│   │   ├── pages/              # Route-level page components
│   │   ├── types.ts            # TypeScript domain types
│   │   ├── mockData.ts         # Static mock data (replace with API calls)
│   │   ├── store.ts            # Zustand global state (theme, sidebar)
│   │   ├── App.tsx             # Router setup
│   │   └── main.tsx            # Entry point
│   ├── public/                 # Static assets
│   ├── dist/                   # Built output (committed for Pages)
│   ├── package.json
│   └── vite.config.ts
├── docs/
│   ├── architecture.md         # System architecture and component overview
│   ├── features.md             # Feature inventory
│   ├── development.md          # Developer guide
│   └── api.md                  # API integration guide
├── ux-design-spec.md           # Full UX/design specification
└── README.md
```

---

## Quick Start

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173/Endpoint-Compliance-Center-for-Configuration-Manager/](http://localhost:5173/Endpoint-Compliance-Center-for-Configuration-Manager/)

Use any username/password on the login screen (authentication is mocked).

---

## Documentation

| Document | Description |
|---|---|
| [docs/architecture.md](docs/architecture.md) | System architecture, component map, data flow |
| [docs/features.md](docs/features.md) | Full feature inventory with status |
| [docs/development.md](docs/development.md) | Local dev, build, and deploy guide |
| [docs/api.md](docs/api.md) | API integration guide for connecting a real backend |
| [ux-design-spec.md](ux-design-spec.md) | Color system, typography, component specs, accessibility requirements |
