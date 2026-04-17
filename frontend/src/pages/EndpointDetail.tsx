import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ExternalLink, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { useState } from 'react';
import { StatusBadge } from '../components/StatusBadge';
import { mockEndpoints } from '../mockData';

const TABS = ['Compliance', 'Hardware', 'Software', 'History'] as const;
type Tab = typeof TABS[number];

const mockRules = [
  { id: '1', name: 'Windows Defender Antivirus', status: 'pass' as const, details: 'Real-time protection enabled, definitions current' },
  { id: '2', name: 'Critical Security Updates', status: 'fail' as const, details: 'Missing KB5034441, KB5035853', kbNumbers: ['KB5034441', 'KB5035853'] },
  { id: '3', name: 'BitLocker Encryption', status: 'pass' as const, details: 'C: drive encrypted (AES-256)' },
  { id: '4', name: 'Windows Firewall', status: 'pass' as const, details: 'Enabled on all profiles' },
  { id: '5', name: 'UAC Enabled', status: 'pass' as const, details: 'UAC level: Notify me' },
  { id: '6', name: 'Auto-Update Policy', status: 'fail' as const, details: 'Updates deferred by 14 days' },
];

const mockSoftware = [
  { name: 'Microsoft 365 Apps', version: '16.0.17628', installed: '2026-01-15' },
  { name: 'Google Chrome', version: '124.0.6367', installed: '2026-03-20' },
  { name: 'Visual Studio Code', version: '1.88.1', installed: '2026-04-01' },
  { name: 'Zoom', version: '5.17.11', installed: '2026-02-10' },
];

const mockHistory = [
  { date: '2026-04-16T20:00:00Z', prev: 'compliant', next: 'warning', reason: 'Update policy drift detected' },
  { date: '2026-04-10T08:00:00Z', prev: 'warning', next: 'compliant', reason: 'Patches applied successfully' },
  { date: '2026-04-01T12:00:00Z', prev: 'critical', next: 'warning', reason: 'Defender definitions updated' },
];

export function EndpointDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('Compliance');

  const endpoint = mockEndpoints.find((e) => e.id === id);

  if (!endpoint) {
    return (
      <div style={{ padding: 'var(--space-6)' }}>
        <p style={{ color: 'var(--text-muted)' }}>Endpoint not found.</p>
        <button onClick={() => navigate('/endpoints')} style={{ color: 'var(--accent-primary)' }} className="text-sm mt-2 hover:underline">
          ← Back to endpoints
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: 'var(--space-6)', maxWidth: 960 }}>
      <nav aria-label="Breadcrumb" className="mb-6">
        <button
          onClick={() => navigate('/endpoints')}
          style={{ color: 'var(--text-secondary)' }}
          className="flex items-center gap-1.5 text-sm hover:opacity-70 transition-opacity"
        >
          <ChevronLeft size={15} />
          Endpoints
        </button>
      </nav>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1 style={{ color: 'var(--text-primary)', fontSize: 22, fontWeight: 700, fontFamily: 'monospace' }}>
            {endpoint.hostname}
          </h1>
          <div className="flex items-center gap-4 mt-2 flex-wrap">
            <span style={{ color: 'var(--text-muted)', fontFamily: 'monospace', fontSize: 13 }}>{endpoint.ipAddress}</span>
            <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{endpoint.osVersion}</span>
            <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>
              Last seen: {new Date(endpoint.lastSeen).toLocaleString()}
            </span>
            <StatusBadge status={endpoint.status} />
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            style={{ color: 'var(--accent-primary)', background: 'rgba(0,120,212,0.08)', border: '1px solid rgba(0,120,212,0.2)' }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm"
          >
            <RefreshCw size={14} />
            Force Evaluation
          </button>
          <button
            style={{ color: 'var(--text-secondary)', background: 'var(--bg-elevated)', border: '1px solid var(--bg-border)' }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm"
          >
            <ExternalLink size={14} />
            View in SCCM
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: '1px solid var(--bg-border)', marginBottom: 24 }} role="tablist" aria-label="Endpoint detail sections">
        <div className="flex gap-0">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              role="tab"
              id={`tab-${tab}`}
              aria-selected={activeTab === tab}
              aria-controls={`tabpanel-${tab}`}
              tabIndex={activeTab === tab ? 0 : -1}
              onClick={() => setActiveTab(tab)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowRight') setActiveTab(TABS[(i + 1) % TABS.length]);
                if (e.key === 'ArrowLeft') setActiveTab(TABS[(i - 1 + TABS.length) % TABS.length]);
              }}
              style={{
                color: activeTab === tab ? 'var(--accent-primary)' : 'var(--text-secondary)',
                borderBottom: activeTab === tab ? '2px solid var(--accent-primary)' : '2px solid transparent',
                background: 'transparent',
                border: 'none',
                padding: '8px 16px',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: activeTab === tab ? 500 : 400,
                marginBottom: -1,
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div role="tabpanel" id={`tabpanel-${activeTab}`} aria-labelledby={`tab-${activeTab}`}>
        {activeTab === 'Compliance' && (
          <div className="flex flex-col gap-3">
            {mockRules.map((rule) => (
              <div
                key={rule.id}
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--bg-border)' }}
                className="rounded-lg"
              >
                <div className="flex items-center gap-3 p-4">
                  {rule.status === 'pass'
                    ? <CheckCircle size={18} style={{ color: '#22c55e', flexShrink: 0 }} />
                    : <XCircle size={18} style={{ color: '#ef4444', flexShrink: 0 }} />}
                  <div className="flex-1">
                    <p style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{rule.name}</p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 2 }}>{rule.details}</p>
                    {rule.kbNumbers && (
                      <div className="flex gap-1.5 mt-1.5 flex-wrap">
                        {rule.kbNumbers.map((kb) => (
                          <span key={kb} style={{ fontFamily: 'monospace', background: 'rgba(239,68,68,0.08)', color: '#ef4444', fontSize: 12 }} className="px-2 py-0.5 rounded">
                            {kb}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <span style={{ color: rule.status === 'pass' ? '#22c55e' : '#ef4444', fontSize: 12, fontWeight: 600, textTransform: 'uppercase' }}>
                    {rule.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Hardware' && (
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--bg-border)' }} className="rounded-lg p-6">
            <dl className="grid grid-cols-2 gap-x-8 gap-y-4">
              {[
                { label: 'CPU', value: 'Intel Core i7-12700K @ 3.60GHz' },
                { label: 'RAM', value: '32 GB DDR5' },
                { label: 'Disk', value: '512 GB NVMe SSD' },
                { label: 'Make', value: 'Dell Inc.' },
                { label: 'Model', value: 'OptiPlex 7090' },
                { label: 'BIOS Version', value: '1.12.0 (2025-09-15)' },
              ].map(({ label, value }) => (
                <div key={label}>
                  <dt style={{ color: 'var(--text-muted)', fontSize: 12, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{label}</dt>
                  <dd style={{ color: 'var(--text-primary)', fontFamily: 'monospace', fontSize: 13 }}>{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {activeTab === 'Software' && (
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--bg-border)' }} className="rounded-lg overflow-hidden">
            <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
              <thead style={{ borderBottom: '1px solid var(--bg-border)' }}>
                <tr>
                  {['Application', 'Version', 'Install Date'].map((h) => (
                    <th key={h} style={{ color: 'var(--text-muted)', fontWeight: 500, padding: '12px 16px', textAlign: 'left', fontSize: 12 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mockSoftware.map((sw) => (
                  <tr key={sw.name} style={{ borderBottom: '1px solid var(--bg-border)' }} className="hover:bg-[var(--bg-elevated)]">
                    <td style={{ padding: '10px 16px', color: 'var(--text-primary)' }}>{sw.name}</td>
                    <td style={{ padding: '10px 16px', color: 'var(--text-secondary)', fontFamily: 'monospace', fontSize: 13 }}>{sw.version}</td>
                    <td style={{ padding: '10px 16px', color: 'var(--text-secondary)', fontSize: 13 }}>{sw.installed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'History' && (
          <div className="flex flex-col gap-3">
            {mockHistory.map((h, i) => (
              <div key={i} style={{ background: 'var(--bg-surface)', border: '1px solid var(--bg-border)' }} className="rounded-lg p-4 flex items-start gap-4">
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-primary)', marginTop: 6, flexShrink: 0 }} />
                <div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 12, marginBottom: 4 }}>{new Date(h.date).toLocaleString()}</p>
                  <p style={{ color: 'var(--text-primary)', fontSize: 13 }}>
                    State changed: <span style={{ textTransform: 'capitalize' }}>{h.prev}</span> → <span style={{ textTransform: 'capitalize' }}>{h.next}</span>
                  </p>
                  <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>{h.reason}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
