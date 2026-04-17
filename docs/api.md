# API Integration Guide

## Current State

The application currently uses **static mock data** imported from `frontend/src/mockData.ts`. There are no live API calls. This document describes the planned API contract for connecting a real ConfigMgr/SCCM backend.

---

## Planned Backend

A backend proxy server (Node.js or similar) would sit between this SPA and the data sources:

```
Browser SPA
    │  REST calls to /api/*
    ▼
Backend Server
    ├── ConfigMgr REST API  (device inventory, compliance data)
    └── SCCM SQL database   (optional — extended reporting)
```

The backend handles:
- Authentication (AD/LDAP validation, session tokens)
- ConfigMgr credential management (service account, AES-256 encrypted at rest)
- Data aggregation and normalization
- SCCM client action triggers (Force Compliance Evaluation)

---

## Data Types

Defined in `frontend/src/types.ts`:

```typescript
type ComplianceStatus = 'compliant' | 'warning' | 'critical' | 'unknown' | 'pending';

interface Endpoint {
  id: string;
  hostname: string;
  ipAddress: string;
  lastSeen: string;           // ISO 8601
  osVersion: string;
  status: ComplianceStatus;
  collection: string;
  cpu?: string;
  ram?: string;
  disk?: string;
  make?: string;
  model?: string;
  biosVersion?: string;
}

interface ComplianceRule {
  id: string;
  name: string;
  status: 'pass' | 'fail';
  details?: string;
  kbNumbers?: string[];
}

interface Alert {
  id: string;
  severity: 'critical' | 'warning';
  message: string;
  timestamp: string;          // ISO 8601
  acknowledged: boolean;
}

interface AlertRule {
  id: string;
  condition: string;
  threshold: string;
  severity: 'critical' | 'warning';
}

interface MetricSummary {
  total: number;
  compliant: number;
  warning: number;
  critical: number;
}
```

---

## Planned API Endpoints

### Authentication

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Authenticate (AD first, fallback to local) |
| `POST` | `/api/auth/logout` | Invalidate session |
| `GET` | `/api/auth/me` | Current user info + roles |

**Login request:**
```json
{ "username": "domain\\username", "password": "..." }
```

**Login response:**
```json
{ "token": "...", "user": { "username": "...", "role": "admin | viewer" } }
```

---

### Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/endpoints` | Paginated endpoint list with filters |
| `GET` | `/api/endpoints/:id` | Single endpoint details |
| `POST` | `/api/endpoints/:id/evaluate` | Trigger compliance evaluation (SCCM client action) |

**`GET /api/endpoints` query parameters:**

| Param | Type | Description |
|---|---|---|
| `status` | string | Filter by compliance status |
| `collection` | string | Filter by ConfigMgr collection |
| `osVersion` | string | Filter by OS version |
| `lastSeenDays` | number | Filter: last seen within N days |
| `search` | string | Hostname or IP search |
| `page` | number | Page number (1-based) |
| `pageSize` | number | Rows per page (25, 50, 100) |
| `sort` | string | Field name |
| `order` | `asc \| desc` | Sort direction |

**`GET /api/endpoints` response:**
```json
{
  "data": [ /* Endpoint[] */ ],
  "total": 347,
  "page": 1,
  "pageSize": 25
}
```

**`GET /api/endpoints/:id` response:**
```json
{
  "endpoint": { /* Endpoint */ },
  "complianceRules": [ /* ComplianceRule[] */ ],
  "software": [
    { "name": "...", "version": "...", "installDate": "2026-01-15" }
  ],
  "history": [
    { "timestamp": "...", "previousStatus": "warning", "newStatus": "critical", "reason": "..." }
  ]
}
```

---

### Metrics

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/metrics/summary` | Compliance KPI counts |
| `GET` | `/api/metrics/trend` | 30-day compliance trend data |

**`GET /api/metrics/summary` response:**
```json
{ "total": 347, "compliant": 218, "warning": 89, "critical": 40 }
```

**`GET /api/metrics/trend` response:**
```json
{
  "data": [
    { "date": "2026-03-18", "compliant": 60 },
    ...
  ]
}
```

---

### Alerts

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/alerts` | List active alerts |
| `PATCH` | `/api/alerts/:id` | Acknowledge an alert |
| `DELETE` | `/api/alerts/:id` | Dismiss an alert |
| `GET` | `/api/alert-rules` | List alert rules |
| `POST` | `/api/alert-rules` | Create an alert rule |
| `PUT` | `/api/alert-rules/:id` | Update an alert rule |
| `DELETE` | `/api/alert-rules/:id` | Delete an alert rule |

---

### Reports

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/reports/generate` | Generate a report (returns data or file) |
| `POST` | `/api/reports/schedule` | Schedule a recurring report |
| `GET` | `/api/reports/scheduled` | List scheduled reports |

**`POST /api/reports/generate` request:**
```json
{
  "type": "compliance_summary | non_compliant | software_inventory | update_compliance | endpoint_health",
  "dateRange": { "start": "2026-03-01", "end": "2026-04-17" },
  "groupBy": "os_version | collection | site",
  "collections": ["All Workstations"],
  "format": "json | csv | pdf"
}
```

---

### Settings

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/settings` | Get current settings (passwords redacted) |
| `PUT` | `/api/settings/data-sources` | Update ConfigMgr / SQL connection config |
| `POST` | `/api/settings/data-sources/test` | Test a data source connection |
| `PUT` | `/api/settings/auth` | Update AD/LDAP settings |
| `POST` | `/api/settings/auth/test` | Test AD connection |

---

## Connecting the Frontend

To replace mock data with real API calls:

1. Add a base API client in `frontend/src/api/client.ts` (axios or fetch wrapper with auth headers)
2. For each data type, create a React Query hook in `frontend/src/api/`:
   - `useEndpoints(filters)` → `GET /api/endpoints`
   - `useEndpoint(id)` → `GET /api/endpoints/:id`
   - `useMetrics()` → `GET /api/metrics/summary`
   - `useTrend()` → `GET /api/metrics/trend`
   - `useAlerts()` → `GET /api/alerts`
3. Replace `mockData.ts` imports in page components with the corresponding hooks
4. Remove `mockData.ts` once all pages are migrated

The TypeScript interfaces in `types.ts` already match the planned API shapes — no component changes required beyond swapping the data source.

---

## Authentication Headers

All authenticated requests must include a session token:

```
Authorization: Bearer <token>
```

The token is returned on login and should be stored in memory (not localStorage) to prevent XSS token theft. On 401 responses, redirect to `/` (login page).

---

## ConfigMgr Data Source Notes

- The ConfigMgr REST API is the primary data source (device inventory, compliance baselines, collections)
- SCCM SQL provides extended reporting data not exposed via the REST API
- Service account credentials are stored encrypted at rest (AES-256) on the backend
- "Test Connection" endpoints perform read-only probes — they never write or modify data
