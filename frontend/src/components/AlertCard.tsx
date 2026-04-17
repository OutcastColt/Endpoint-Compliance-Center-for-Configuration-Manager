import { AlertTriangle, XCircle, Eye, Check, X } from 'lucide-react';
import type { Alert } from '../types';

interface Props {
  alert: Alert;
  onAcknowledge: (id: string) => void;
  onDismiss: (id: string) => void;
}

export function AlertCard({ alert, onAcknowledge, onDismiss }: Props) {
  const isCritical = alert.severity === 'critical';
  const borderColor = isCritical ? '#ef4444' : '#f59e0b';
  const Icon = isCritical ? XCircle : AlertTriangle;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onDismiss(alert.id);
  };

  return (
    <div
      role={isCritical ? 'alert' : 'status'}
      onKeyDown={handleKeyDown}
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--bg-border)',
        borderLeft: `4px solid ${borderColor}`,
      }}
      className="rounded-lg p-4 flex items-start gap-3"
    >
      <Icon size={18} style={{ color: borderColor, flexShrink: 0, marginTop: 2 }} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span style={{ color: borderColor }} className="text-xs font-semibold uppercase tracking-wide">
            {alert.severity}
          </span>
          <span style={{ color: 'var(--text-muted)' }} className="text-xs">
            {new Date(alert.timestamp).toLocaleString()}
          </span>
          {alert.acknowledged && (
            <span style={{ color: '#22c55e' }} className="text-xs">acknowledged</span>
          )}
        </div>
        <p style={{ color: 'var(--text-primary)' }} className="text-sm">{alert.message}</p>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={() => alert.acknowledged ? undefined : onAcknowledge(alert.id)}
          aria-label="Acknowledge alert"
          title="Acknowledge"
          className="p-1.5 rounded hover:opacity-70 transition-opacity"
          style={{ color: 'var(--text-secondary)' }}
        >
          <Eye size={15} />
        </button>
        {!alert.acknowledged && (
          <button
            onClick={() => onAcknowledge(alert.id)}
            aria-label="Mark as acknowledged"
            title="Acknowledge"
            className="p-1.5 rounded hover:opacity-70 transition-opacity"
            style={{ color: '#22c55e' }}
          >
            <Check size={15} />
          </button>
        )}
        <button
          onClick={() => onDismiss(alert.id)}
          aria-label="Dismiss alert"
          title="Dismiss"
          className="p-1.5 rounded hover:opacity-70 transition-opacity"
          style={{ color: 'var(--text-muted)' }}
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
}
