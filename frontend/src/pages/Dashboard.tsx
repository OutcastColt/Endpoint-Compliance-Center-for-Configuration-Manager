import { RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { MetricCard } from '../components/MetricCard';
import { DonutChart } from '../components/DonutChart';
import { AlertCard } from '../components/AlertCard';
import { StatusBadge } from '../components/StatusBadge';
import { mockMetrics, mockAlerts, mockTrendData, mockEndpoints } from '../mockData';
import type { Alert } from '../types';

export function Dashboard() {
  const navigate = useNavigate();
  const [lastSync] = useState(new Date().toLocaleTimeString());
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts.filter((a) => !a.acknowledged).slice(0, 3));

  const handleAcknowledge = (id: string) =>
    setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, acknowledged: true } : a));

  const handleDismiss = (id: string) =>
    setAlerts((prev) => prev.filter((a) => a.id !== id));

  const recentNonCompliant = mockEndpoints.filter((e) => e.status === 'critical' || e.status === 'warning').slice(0, 5);

  return (
    <div style={{ padding: 'var(--space-6)', maxWidth: 1400 }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ color: 'var(--text-primary)', fontSize: 28, fontWeight: 700 }}>Dashboard</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 2 }}>Last sync: {lastSync}</p>
        </div>
        <button
          style={{ color: 'var(--accent-primary)', background: 'rgba(0,120,212,0.08)', border: '1px solid rgba(0,120,212,0.2)' }}
          className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium hover:bg-opacity-80 transition-colors"
          aria-label="Refresh data"
        >
          <RefreshCw size={15} />
          Refresh
        </button>
      </div>

      <div aria-live="polite" className="sr-only">Dashboard data loaded</div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard label="Total Endpoints" value={mockMetrics.total} filterStatus="total" trend={2} />
        <MetricCard label="Compliant" value={mockMetrics.compliant} filterStatus="compliant" color="#22c55e" trend={5} />
        <MetricCard label="Warning" value={mockMetrics.warning} filterStatus="warning" color="#f59e0b" trend={-3} />
        <MetricCard label="Critical" value={mockMetrics.critical} filterStatus="critical" color="#ef4444" trend={-8} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--bg-border)' }} className="rounded-lg p-6">
          <h2 style={{ color: 'var(--text-primary)', fontSize: 15, fontWeight: 600, marginBottom: 20 }}>
            Compliance Trend (30 days)
          </h2>
          <div role="img" aria-label="Line chart showing compliance percentage trend over the past 30 days">
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={mockTrendData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <XAxis dataKey="date" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} tickLine={false} axisLine={false} domain={[50, 100]} />
              <Tooltip
                contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--bg-border)', borderRadius: 6, color: 'var(--text-primary)', fontSize: 13 }}
                formatter={(v) => [`${v}%`, 'Compliant']}
              />
              <Line type="monotone" dataKey="compliant" stroke="#0078d4" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
          </div>
        </div>

        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--bg-border)' }} className="rounded-lg p-6">
          <h2 style={{ color: 'var(--text-primary)', fontSize: 15, fontWeight: 600, marginBottom: 20 }}>
            Compliance by Status
          </h2>
          <DonutChart data={mockMetrics} />
        </div>
      </div>

      {/* Active alerts */}
      {alerts.length > 0 && (
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--bg-border)' }} className="rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 style={{ color: 'var(--text-primary)', fontSize: 15, fontWeight: 600 }}>Active Alerts</h2>
            <button
              onClick={() => navigate('/alerts')}
              style={{ color: 'var(--accent-primary)' }}
              className="text-sm hover:underline"
            >
              View all
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {alerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} onAcknowledge={handleAcknowledge} onDismiss={handleDismiss} />
            ))}
          </div>
        </div>
      )}

      {/* Recently non-compliant */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--bg-border)' }} className="rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 style={{ color: 'var(--text-primary)', fontSize: 15, fontWeight: 600 }}>Recently Non-Compliant</h2>
          <button
            onClick={() => navigate('/endpoints?status=critical')}
            style={{ color: 'var(--accent-primary)' }}
            className="text-sm hover:underline"
          >
            View all
          </button>
        </div>
        <div className="overflow-x-auto">
        <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--bg-border)' }}>
              {['Hostname', 'IP Address', 'OS Version', 'Status'].map((h) => (
                <th key={h} style={{ color: 'var(--text-muted)', fontWeight: 500, padding: '0 8px 10px', textAlign: 'left', fontSize: 12 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentNonCompliant.map((ep) => (
              <tr
                key={ep.id}
                onClick={() => navigate(`/endpoints/${ep.id}`)}
                onKeyDown={(e) => e.key === 'Enter' && navigate(`/endpoints/${ep.id}`)}
                tabIndex={0}
                style={{ borderBottom: '1px solid var(--bg-border)', cursor: 'pointer' }}
                className="hover:bg-[var(--bg-elevated)] transition-colors"
              >
                <td style={{ padding: '10px 8px', color: 'var(--text-primary)', fontFamily: 'monospace', fontSize: 13 }}>{ep.hostname}</td>
                <td style={{ padding: '10px 8px', color: 'var(--text-secondary)', fontFamily: 'monospace', fontSize: 13 }}>{ep.ipAddress}</td>
                <td style={{ padding: '10px 8px', color: 'var(--text-secondary)' }}>{ep.osVersion}</td>
                <td style={{ padding: '10px 8px' }}><StatusBadge status={ep.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
