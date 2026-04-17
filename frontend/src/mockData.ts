import type { Endpoint, Alert, AlertRule, MetricSummary } from './types';

export const mockMetrics: MetricSummary = {
  total: 347,
  compliant: 218,
  warning: 89,
  critical: 40,
};

export const mockEndpoints: Endpoint[] = [
  { id: '1', hostname: 'DESKTOP-A1B2C3', ipAddress: '10.0.1.101', lastSeen: '2026-04-16T23:45:00Z', osVersion: 'Windows 11 23H2', status: 'compliant', collection: 'All Workstations' },
  { id: '2', hostname: 'LAPTOP-X9Y8Z7', ipAddress: '10.0.1.102', lastSeen: '2026-04-16T22:30:00Z', osVersion: 'Windows 10 22H2', status: 'warning', collection: 'Remote Workers' },
  { id: '3', hostname: 'SERVER-PROD-01', ipAddress: '10.0.0.10', lastSeen: '2026-04-16T23:59:00Z', osVersion: 'Windows Server 2022', status: 'critical', collection: 'Servers' },
  { id: '4', hostname: 'WORKSTATION-HR-04', ipAddress: '10.0.2.201', lastSeen: '2026-04-15T14:00:00Z', osVersion: 'Windows 11 23H2', status: 'compliant', collection: 'HR Department' },
  { id: '5', hostname: 'LAPTOP-DEV-12', ipAddress: '10.0.3.112', lastSeen: '2026-04-16T18:00:00Z', osVersion: 'Windows 11 23H2', status: 'pending', collection: 'Development' },
  { id: '6', hostname: 'KIOSK-LOBBY-01', ipAddress: '10.0.5.201', lastSeen: '2026-04-10T09:00:00Z', osVersion: 'Windows 10 21H2', status: 'unknown', collection: 'Kiosks' },
  { id: '7', hostname: 'DESKTOP-FIN-07', ipAddress: '10.0.2.107', lastSeen: '2026-04-16T20:00:00Z', osVersion: 'Windows 11 23H2', status: 'warning', collection: 'Finance' },
  { id: '8', hostname: 'SERVER-DC-01', ipAddress: '10.0.0.1', lastSeen: '2026-04-17T00:00:00Z', osVersion: 'Windows Server 2022', status: 'compliant', collection: 'Servers' },
];

export const mockAlerts: Alert[] = [
  { id: '1', severity: 'critical', message: '3 servers missing critical security patches (KB5034441)', timestamp: '2026-04-16T20:15:00Z', acknowledged: false },
  { id: '2', severity: 'warning', message: '12 endpoints have not checked in for 7+ days', timestamp: '2026-04-16T18:00:00Z', acknowledged: false },
  { id: '3', severity: 'warning', message: 'Windows Defender definitions outdated on 24 endpoints', timestamp: '2026-04-16T12:00:00Z', acknowledged: true },
];

export const mockAlertRules: AlertRule[] = [
  { id: '1', condition: 'Critical patches missing', threshold: '> 0 endpoints', severity: 'critical' },
  { id: '2', condition: 'Last seen', threshold: '> 7 days ago', severity: 'warning' },
  { id: '3', condition: 'Compliance rate', threshold: '< 80%', severity: 'critical' },
];

export const mockTrendData = [
  { date: 'Mar 18', compliant: 60 }, { date: 'Mar 21', compliant: 63 },
  { date: 'Mar 24', compliant: 61 }, { date: 'Mar 27', compliant: 65 },
  { date: 'Mar 30', compliant: 67 }, { date: 'Apr 2', compliant: 70 },
  { date: 'Apr 5', compliant: 68 }, { date: 'Apr 8', compliant: 72 },
  { date: 'Apr 11', compliant: 74 }, { date: 'Apr 14', compliant: 71 },
  { date: 'Apr 16', compliant: 63 },
];
