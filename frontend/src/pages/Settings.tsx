import { useState } from 'react';
import { CheckCircle, AlertTriangle } from 'lucide-react';

const TABS = ['Data Sources', 'Authentication', 'Site Config', 'Notifications'] as const;
type Tab = typeof TABS[number];

const tabId = (tab: Tab) => `settings-tab-${tab.replace(/\s+/g, '-').toLowerCase()}`;
const panelId = (tab: Tab) => `settings-panel-${tab.replace(/\s+/g, '-').toLowerCase()}`;

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
          {TABS.map((tab, i) => (
            <button
              key={tab}
              role="tab"
              id={tabId(tab)}
              aria-selected={activeTab === tab}
              aria-controls={panelId(tab)}
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

      <div
        role="tabpanel"
        id={panelId(activeTab)}
        aria-labelledby={tabId(activeTab)}
      >
        {activeTab === 'Data Sources' && (
          <div className="flex flex-col gap-6">
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--bg-border)' }} className="rounded-lg p-6">
              <h2 style={{ color: 'var(--text-primary)', fontSize: 15, fontWeight: 600, marginBottom: 4 }}>ConfigMgr REST API</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 20 }}>Primary data source for endpoint compliance data</p>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="api-url" style={{ color: 'var(--text-secondary)', fontSize: 12, fontWeight: 500, display: 'block', marginBottom: 6 }}>API URL</label>
                  <input
                    id="api-url"
                    type="url"
                    defaultValue="https://sccm.corp.local/AdminService/v1"
                    style={{ background: 'var(--bg-elevated)', border: '1px solid var(--bg-border)', color: 'var(--text-primary)' }}
                    className="w-full px-3 py-2 rounded-md text-sm focus:border-[var(--accent-primary)]"
                  />
                </div>
                <div>
                  <label htmlFor="service-account" style={{ color: 'var(--text-secondary)', fontSize: 12, fontWeight: 500, display: 'block', marginBottom: 6 }}>Service Account</label>
                  <input
                    id="service-account"
                    type="text"
                    defaultValue="corp\svc-ecc"
                    style={{ background: 'var(--bg-elevated)', border: '1px solid var(--bg-border)', color: 'var(--text-primary)' }}
                    className="w-full px-3 py-2 rounded-md text-sm focus:border-[var(--accent-primary)]"
                  />
                </div>
                <div>
                  <label htmlFor="api-password" style={{ color: 'var(--text-secondary)', fontSize: 12, fontWeight: 500, display: 'block', marginBottom: 6 }}>Password</label>
                  <input
                    id="api-password"
                    type="password"
                    placeholder="Enter password to change"
                    style={{ background: 'var(--bg-elevated)', border: '1px solid var(--bg-border)', color: 'var(--text-primary)' }}
                    className="w-full px-3 py-2 rounded-md text-sm focus:border-[var(--accent-primary)]"
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
                    <CheckCircle size={15} aria-hidden="true" /> Connected successfully
                  </span>
                )}
                {testStatus === 'error' && (
                  <span className="flex items-center gap-1.5 text-sm" style={{ color: '#ef4444' }}>
                    <AlertTriangle size={15} aria-hidden="true" /> Connection failed
                  </span>
                )}
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--bg-border)' }} className="rounded-lg p-6">
              <h2 style={{ color: 'var(--text-primary)', fontSize: 15, fontWeight: 600, marginBottom: 4 }}>SCCM SQL (Optional)</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 20 }}>Direct SQL access for advanced queries</p>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="sql-server" style={{ color: 'var(--text-secondary)', fontSize: 12, fontWeight: 500, display: 'block', marginBottom: 6 }}>SQL Server</label>
                  <input
                    id="sql-server"
                    type="text"
                    placeholder="sql.corp.local"
                    style={{ background: 'var(--bg-elevated)', border: '1px solid var(--bg-border)', color: 'var(--text-primary)' }}
                    className="w-full px-3 py-2 rounded-md text-sm focus:border-[var(--accent-primary)]"
                  />
                </div>
                <div>
                  <label htmlFor="sql-database" style={{ color: 'var(--text-secondary)', fontSize: 12, fontWeight: 500, display: 'block', marginBottom: 6 }}>Database Name</label>
                  <input
                    id="sql-database"
                    type="text"
                    placeholder="CM_XXX"
                    style={{ background: 'var(--bg-elevated)', border: '1px solid var(--bg-border)', color: 'var(--text-primary)' }}
                    className="w-full px-3 py-2 rounded-md text-sm focus:border-[var(--accent-primary)]"
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
                aria-label="Enable AD/LDAP authentication"
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
                  { id: 'ad-domain', label: 'Domain', placeholder: 'corp.local' },
                  { id: 'ad-ldap-url', label: 'LDAP Server URL', placeholder: 'ldap://dc.corp.local' },
                  { id: 'ad-bind-account', label: 'Bind Account', placeholder: 'corp\\svc-ldap' },
                  { id: 'ad-bind-password', label: 'Bind Password', type: 'password', placeholder: 'Enter to change' },
                ].map(({ id, label, placeholder, type = 'text' }) => (
                  <div key={id}>
                    <label htmlFor={id} style={{ color: 'var(--text-secondary)', fontSize: 12, fontWeight: 500, display: 'block', marginBottom: 6 }}>{label}</label>
                    <input
                      id={id}
                      type={type}
                      placeholder={placeholder}
                      style={{ background: 'var(--bg-elevated)', border: '1px solid var(--bg-border)', color: 'var(--text-primary)' }}
                      className="w-full px-3 py-2 rounded-md text-sm focus:border-[var(--accent-primary)]"
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
    </div>
  );
}
