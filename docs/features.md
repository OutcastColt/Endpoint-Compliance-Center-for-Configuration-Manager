# Feature Inventory

All features below were implemented across Phases 1–4 of the frontend build. The current release uses mock data; backend integration is planned.

---

## Phase 1 — Foundation

| Feature | Status | Notes |
|---|---|---|
| Vite + React 19 + TypeScript scaffold | Done | |
| Tailwind CSS 4 integration | Done | Via `@tailwindcss/vite` plugin |
| CSS custom property token system | Done | Dark/light theme support |
| React Router v7 routing | Done | |
| Zustand global state (sidebar, theme) | Done | Sidebar state persisted in localStorage |
| TanStack React Query setup | Done | 2-min stale time, retry: 1 |
| Inter font (self-hosted) | Done | `@fontsource/inter` — no Google Fonts dependency |

---

## Phase 2 — Core UI

### Login Page (`/`)
- Username + password form
- Password show/hide toggle
- AD status indicator (shows "Using local authentication" when AD unavailable)
- Generic error message on failed login (never field-specific)
- Lockout after 5 failed attempts with countdown timer
- `aria-live` region for error/status messages

### Dashboard (`/dashboard`)
- Page header with last sync timestamp and manual refresh button
- **Metric cards:** Total Endpoints, Compliant, Warning, Critical — each clickable to filtered endpoint list
- Trend indicator on each metric card (arrow + delta %)
- **Compliance Trend chart:** 30-day line chart (Recharts)
- **Compliance by Status donut chart:** SVG-based with center text, always-visible legend
- **Active Alerts panel:** top 3 unacknowledged alerts with acknowledge/dismiss actions
- **Recently Non-Compliant table:** 5 non-compliant endpoints, row-click navigates to detail
- `aria-live` region for data load status

### Sidebar (`Layout.tsx`)
- Navigation items: Dashboard, Endpoints, Reports, Alerts, Settings
- Collapsible (220px expanded / 56px icon-only)
- Collapse state persisted in localStorage
- Active item highlighted with left border + accent color
- Mobile drawer mode below 768px
- `aria-current="page"` on active link

---

## Phase 3 — Endpoint Management

### Endpoints List (`/endpoints`)
- Full-width data table (TanStack Table)
- Columns: Hostname, IP Address, Last Seen, OS Version, Compliance Status
- **Filter bar:** real-time search (debounced), Status dropdown, OS Version dropdown, Collection dropdown, Last Seen dropdown
- Active filters displayed as dismissible chips
- Filter state persisted in URL query params
- Multi-select checkboxes for bulk actions (Export Selected, Force Compliance Check)
- Pagination: 25 / 50 / 100 rows per page
- Export CSV button
- Empty states for no-data and no-filter-match scenarios
- Keyboard navigation (arrow keys, Enter to open detail)

### Endpoint Detail (`/endpoints/:id`)
- Breadcrumb navigation back to Endpoints list
- Header: hostname, IP address, OS version, last seen, compliance status badge
- **Four tabs** (Radix UI Tabs):
  - **Compliance (default):** All compliance rules with pass/fail status, expandable details, affected KB numbers
  - **Hardware:** CPU, RAM, disk, make/model, BIOS version in definition list layout
  - **Software:** Paginated installed application table with name, version, install date
  - **History:** Timeline of compliance state changes with timestamps and previous/new state
- Actions: "Force Compliance Evaluation", "View in SCCM" (deep-link, new tab)

---

## Phase 4 — Reports, Alerts, Settings & QA

### Reports (`/reports`)
- Report Type dropdown: Compliance Summary, Non-Compliant Endpoints, Software Inventory, Update Compliance, Endpoint Health
- Date Range dropdown + custom date picker
- Group By dropdown: OS Version, Collection, Site
- Collections filter
- Generate Report and Schedule Report actions (Schedule opens modal with cron-style scheduler)
- Results table with export: PDF, CSV, shareable link

### Alerts (`/alerts`)
- **Active Alerts section:** Cards for triggered alerts — severity, message, timestamp, acknowledge/dismiss actions
- **Alert Rules section:** Table of configured rules — condition, threshold, severity, edit/delete per row
- "+ New Alert Rule" button — modal form (condition type, threshold, severity, notification channel)

### Settings (`/settings`)
- **Data Sources tab:**
  - ConfigMgr REST API: URL, service account credentials, Test Connection
  - SCCM SQL (optional): server, database, Test Connection
  - Passwords never pre-populated
- **Authentication tab:**
  - AD/LDAP toggle
  - Domain, LDAP URL, bind account, Test AD Connection
  - Fallback-to-local-auth setting
- **Site Config tab:** Site-level configuration
- **Notifications tab:** Notification channel configuration

### QA & Accessibility (Phase 4)
- WCAG 2.1 AA audit and fixes across all pages
- All interactive elements keyboard-accessible
- Focus ring visible on all interactive elements
- All status badges include icon + text (never color-only)
- `aria-sort` on sortable table headers
- `role="img"` + `aria-label` on all charts
- Responsive layout tested at all breakpoints

---

## Compliance Status States

| Status | Color | Meaning |
|---|---|---|
| `compliant` | Green | Endpoint meets all compliance rules |
| `warning` | Yellow | Partially compliant or upcoming expiry |
| `critical` | Red | Non-compliant, action required |
| `unknown` | Gray | No data collected yet |
| `pending` | Purple | Compliance evaluation in progress |

---

## Planned / Not Yet Built

| Feature | Notes |
|---|---|
| Real ConfigMgr API integration | Replace `mockData.ts` with React Query fetchers |
| Authentication (real AD/LDAP) | Backend required |
| Backend proxy server | Node.js or similar; connects to ConfigMgr REST API + SCCM SQL |
| Report scheduling | UI exists; backend cron/email integration needed |
| "Force Compliance Evaluation" action | UI button exists; SCCM client action API call needed |
| Notification channels | UI tab exists; email/webhook backend needed |
