export type ComplianceStatus = 'compliant' | 'warning' | 'critical' | 'unknown' | 'pending';

export interface Endpoint {
  id: string;
  hostname: string;
  ipAddress: string;
  lastSeen: string;
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

export interface ComplianceRule {
  id: string;
  name: string;
  status: 'pass' | 'fail';
  details?: string;
  kbNumbers?: string[];
}

export interface Alert {
  id: string;
  severity: 'critical' | 'warning';
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

export interface AlertRule {
  id: string;
  condition: string;
  threshold: string;
  severity: 'critical' | 'warning';
}

export interface MetricSummary {
  total: number;
  compliant: number;
  warning: number;
  critical: number;
}
