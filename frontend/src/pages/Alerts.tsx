import { useState } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { AlertCard } from '../components/AlertCard';
import { mockAlerts, mockAlertRules } from '../mockData';
import type { Alert, AlertRule } from '../types';

export function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [rules] = useState<AlertRule[]>(mockAlertRules);

  const handleAcknowledge = (id: string) =>
    setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, acknowledged: true } : a));

  const handleDismiss = (id: string) =>
    setAlerts((prev) => prev.filter((a) => a.id !== id));

  return (
    <div style={{ padding: 'var(--space-6)', maxWidth: 960 }}>
      <h1 style={{ color: 'var(--text-primary)', fontSize: 28, fontWeight: 700, marginBottom: 24 }}>Alerts</h1>

      {/* Active alerts */}
      <div className="mb-8">
        <h2 style={{ color: 'var(--text-primary)', fontSize: 15, fontWeight: 600, marginBottom: 12 }}>
          Active Alerts ({alerts.length})
        </h2>
        {alerts.length === 0 ? (
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--bg-border)', textAlign: 'center', padding: 40 }} className="rounded-lg">
            <p style={{ color: '#22c55e', fontWeight: 500, marginBottom: 4 }}>No active alerts.</p>
            <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Your environment looks good.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {alerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} onAcknowledge={handleAcknowledge} onDismiss={handleDismiss} />
            ))}
          </div>
        )}
      </div>

      {/* Alert rules */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 style={{ color: 'var(--text-primary)', fontSize: 15, fontWeight: 600 }}>Alert Rules</h2>
          <button
            style={{ background: 'var(--accent-primary)', color: 'white' }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium"
          >
            <Plus size={15} />
            New Alert
          </button>
        </div>

        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--bg-border)' }} className="rounded-lg overflow-hidden">
          <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
            <thead style={{ borderBottom: '1px solid var(--bg-border)' }}>
              <tr>
                {['Condition', 'Threshold', 'Severity', 'Actions'].map((h) => (
                  <th key={h} style={{ color: 'var(--text-muted)', fontWeight: 500, padding: '12px 16px', textAlign: 'left', fontSize: 12 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rules.map((rule) => (
                <tr key={rule.id} style={{ borderBottom: '1px solid var(--bg-border)' }} className="hover:bg-[var(--bg-elevated)]">
                  <td style={{ padding: '12px 16px', color: 'var(--text-primary)' }}>{rule.condition}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontFamily: 'monospace', fontSize: 13 }}>{rule.threshold}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      color: rule.severity === 'critical' ? '#ef4444' : '#f59e0b',
                      background: rule.severity === 'critical' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)',
                      fontSize: 12,
                      fontWeight: 600,
                      textTransform: 'uppercase',
                    }} className="px-2.5 py-1 rounded-full">
                      {rule.severity}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div className="flex items-center gap-1">
                      <button style={{ color: 'var(--text-secondary)' }} className="p-1.5 rounded hover:opacity-70" aria-label="Edit rule">
                        <Edit2 size={14} />
                      </button>
                      <button style={{ color: '#ef4444' }} className="p-1.5 rounded hover:opacity-70" aria-label="Delete rule">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
