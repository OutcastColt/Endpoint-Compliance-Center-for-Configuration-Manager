import { CheckCircle, AlertTriangle, XCircle, HelpCircle, Loader2 } from 'lucide-react';
import type { ComplianceStatus } from '../types';

interface Props {
  status: ComplianceStatus;
}

const config: Record<ComplianceStatus, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
  compliant: { label: 'Compliant', icon: <CheckCircle size={14} aria-hidden="true" />, color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
  warning: { label: 'Warning', icon: <AlertTriangle size={14} aria-hidden="true" />, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  critical: { label: 'Non-Compliant', icon: <XCircle size={14} aria-hidden="true" />, color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
  unknown: { label: 'Unknown', icon: <HelpCircle size={14} aria-hidden="true" />, color: '#64748b', bg: 'rgba(100,116,139,0.12)' },
  pending: { label: 'Pending', icon: <Loader2 size={14} aria-hidden="true" className="animate-spin" />, color: '#a78bfa', bg: 'rgba(167,139,250,0.12)' },
};

export function StatusBadge({ status }: Props) {
  const { label, icon, color, bg } = config[status];
  return (
    <span
      style={{ color, background: bg, borderColor: color }}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-opacity-30 whitespace-nowrap"
    >
      {icon}
      {label}
    </span>
  );
}
