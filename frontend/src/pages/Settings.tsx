import { useState } from 'react';
import { CheckCircle, AlertTriangle } from 'lucide-react';

const TABS = ['Data Sources', 'Authentication', 'Site Config', 'Notifications'] as const;
type Tab = typeof TABS[number];

export function Settings() {
  const [activeTab, setActiveTab] = useState<Tab>('Data Sources');
  const [adEnabled, setAdEnabled] = useState(true);
  const [testStatus, setTestStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const simulateTest = () => {
    setTestStatus('idle');
    setTimeout(() => setTestStatus('success'), 800);
  };

  return (
    <div style={{ padding: 'var(--space-6)', maxWidth: 800 }}>
      <h1 style={{ color: 'var(--text-primary)', fontSize: 28, fontWeight: 700, marginBottom: 24 }}>Settings</h1>

      <div style={{ borderBottom: '1px solid var(--bg-border)', marginBottom: 24 }} role="tablist" aria-label="Settings sections">
        <div className="flex gap-0 flex-wrap">
          {TABS.map((tab) => (
            <button
              key={tab}
              role="tab"
              aria-selected={activeTab === tab}
              onClick={() => setActiveTab(tab)}
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

      {activeTab === 'Data Sources' && (
        <div className="flex flex-col gap-6">
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--bg-border)' }} className="rounded-lg p-6">
            <h2 style={{ color: 'var(--text-primary)', fontSize: 15, fontWeight: 600, marginBottom: 4 }}>ConfigMgr REST API</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 20 }}>Primary data source for endpoint compliance data</p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label style={{ color: 'var(--text-secondary)', fontSize: 12, fontWeight: 500, display: 'block', marginBottom: 6 }}>API URL</label>
                <input
                  type="url"
                  defaultValue="https://sccm.corp.local/AdminService/v1"
                  style={{ background: 'var(--bg-elevated)', border: '1px solid var(--bg-border)', color: 'var(--text-primary)' }}
                  className="w-full px-3 py-2 rounded-md text-sm focus:outline-none focus:border-[var(--accent-primary)]"
                />
              </div>
              <div>
                <label style={{ color: 'var(--text-secondary)', fontSize: 12, fontWeight: 500, display: 'block', marginBottom: 6 }}>Service Account</label>
                <input
                  type="text"
                  defaultValue="corp\svc-ecc"
                  style={{ background: 'var(--bg-elevated)', border: '1px solid var(--bg-border)', color: 'var(--text-primary)' }}
                  className="w-full px-3 py-2 rounded-md text-sm focus:outline-none focus:border-[var(--accent-primary)]"
                />
              </div>
              <div>
                <label style={{ color: 'var(--text-secondary)', fontSize: 12, fontWeight: 500, display: 'block', marginBottom: 6 }}>Password</label>
                <input
                  type="password"
                  placeholder="Enter password to change"
                  style={{ background: 'var(--bg-elevated)', border: '1px solid var(--bg-border)', color: 'var(--text-primary)' }}
                  className="w-full px-3 py-2 rounded-md text-sm focus:outline-none focus:border-[var(--accent-primary)]"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={simulateTest}
                style={{ color: 'var(--accent-primary)', background: 'rgba(0,120,212,0.08)', border: '1px solid rgba(0,120,212,0.2)' }}
                className="px-4 py-2 rounded-md text-sm font-medium"
              >
                Test Connection
              </button>
              {testStatus === 'success' && (
                <span className="flex items-center gap-1.5 text-sm" style={{ color: '#22c55e' }}>
                  <CheckCircle size={15} /> Connected successfully
                </span>
              )}
              {testStatus === 'error' && (
                <span className="flex items-center gap-1.5 text-sm" style={{ color: '#ef4444' }}>
                  <AlertTriangle size={15} /> Connection failed
                </span>
              )}
            </div>
          </div>

          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--bg-border)' }} className="rounded-lg p-6">
            <h2 style={{ color: 'var(--text-primary)', fontSize: 15, fontWeight: 600, marginBottom: 4 }}>SCCM SQL (Optional)</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 20 }}>Direct SQL access for advanced queries</p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label style={{ color: 'var(--text-secondary)', fontSize: 12, fontWeight: 500, display: 'block', marginBottom: 6 }}>SQL Server</label>
                <input
                  type="text"
                  placeholder="sql.corp.local"
                  style={{ background: 'var(--bg-elevated)', border: '1px solid var(--bg-border)', color: 'var(--text-primary)' }}
                  className="w-full px-3 py-2 rounded-md text-sm focus:outline-none focus:border-[var(--accent-primary)]"
                />
              </div>
              <div>
                <label style={{ color: 'var(--text-secondary)', fontSize: 12, fontWeight: 500, display: 'block', marginBottom: 6 }}>Database Name</label>
                <input
                  type="text"
                  placeholder="CM_XXX"
                  style={{ background: 'var(--bg-elevated)', border: '1px solid var(--bg-border)', color: 'var(--text-primary)' }}
                  className="w-full px-3 py-2 rounded-md text-sm focus:outline-none focus:border-[var(--accent-primary)]"
                />
              </div>
            </div>
            <button
              style={{ color: 'var(--accent-primary)', background: 'rgba(0,120,212,0.08)', border: '1px solid rgba(0,120,212,0.2)' }}
              className="px-4 py-2 rounded-md text-sm font-medium"
            >
              Test Connection
            </button>
          </div>

          <div className="flex justify-end">
            <button style={{ background: 'var(--accent-primary)', color: 'white' }} className="px-6 py-2.5 rounded-md text-sm font-medium">
              Save Changes
            </button>
          </div>
        </div>
      )}

      {activeTab === 'Authentication' && (
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--bg-border)' }} className="rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 style={{ color: 'var(--text-primary)', fontSize: 15, fontWeight: 600, marginBottom: 4 }}>AD/LDAP Authentication</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Falls back to local auth if AD is unavailable</p>
            </div>
            <button
              role="switch"
              aria-checked={adEnabled}
              onClick={() => setAdEnabled((v) => !v)}
              style={{
                width: 44,
                height: 24,
                borderRadius: 12,
                background: adEnabled ? 'var(--accent-primary)' : 'var(--bg-border)',
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                transition: 'background 100ms',
              }}
            >
              <span style={{
                position: 'absolute',
                top: 2,
                left: adEnabled ? 22 : 2,
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: 'white',
                transition: 'left 100ms',
              }} />
            </button>
          </div>

          {adEnabled && (
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Domain', placeholder: 'corp.local' },
                { label: 'LDAP Server URL', placeholder: 'ldap://dc.corp.local' },
                { label: 'Bind Account', placeholder: 'corp\\svc-ldap' },
                { label: 'Bind Password', type: 'password', placeholder: 'Enter to change' },
              ].map(({ label, placeholder, type = 'text' }) => (
                <div key={label}>
                  <label style={{ color: 'var(--text-secondary)', fontSize: 12, fontWeight: 500, display: 'block', marginBottom: 6 }}>{label}</label>
                  <input
                    type={type}
                    placeholder={placeholder}
                    style={{ background: 'var(--bg-elevated)', border: '1px solid var(--bg-border)', color: 'var(--text-primary)' }}
                    className="w-full px-3 py-2 rounded-md text-sm focus:outline-none focus:border-[var(--accent-primary)]"
                  />
                </div>
              ))}
              <div className="col-span-2">
                <button
                  style={{ color: 'var(--accent-primary)', background: 'rgba(0,120,212,0.08)', border: '1px solid rgba(0,120,212,0.2)' }}
                  className="px-4 py-2 rounded-md text-sm font-medium"
                >
                  Test AD Connection
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {(activeTab === 'Site Config' || activeTab === 'Notifications') && (
        <div style={{ textAlign: 'center', padding: 64, color: 'var(--text-muted)' }}>
          <p>{activeTab} configuration coming soon.</p>
        </div>
      )}
    </div>
  );
}
