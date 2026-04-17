import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Monitor, BarChart3, Bell, Settings, ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';
import { useAppStore } from '../store';

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/endpoints', icon: Monitor, label: 'Endpoints' },
  { to: '/reports', icon: BarChart3, label: 'Reports' },
  { to: '/alerts', icon: Bell, label: 'Alerts' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useAppStore();
  const width = sidebarCollapsed ? 56 : 220;

  return (
    <nav
      aria-label="Main navigation"
      style={{
        width,
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--bg-border)',
        flexShrink: 0,
        transition: 'width 100ms ease',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 40,
        overflow: 'hidden',
      }}
    >
      <div style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid var(--bg-border)', minHeight: 56 }}>
        <ShieldCheck size={22} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
        {!sidebarCollapsed && (
          <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden' }}>
            ECC for ConfigMgr
          </span>
        )}
      </div>

      <div style={{ flex: 1, padding: '8px 0' }}>
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            aria-label={sidebarCollapsed ? label : undefined}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: sidebarCollapsed ? '10px 17px' : '10px 16px',
              color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
              background: isActive ? 'rgba(0,120,212,0.12)' : 'transparent',
              borderLeft: isActive ? '4px solid var(--accent-primary)' : '4px solid transparent',
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: isActive ? 500 : 400,
              transition: 'background 100ms ease',
              whiteSpace: 'nowrap',
            })}
          >
            {({ isActive }) => (
              <>
                <Icon size={18} style={{ flexShrink: 0 }} aria-hidden="true" />
                {!sidebarCollapsed && <span>{label}</span>}
                {isActive && <span className="sr-only">(current page)</span>}
              </>
            )}
          </NavLink>
        ))}
      </div>

      <button
        onClick={toggleSidebar}
        aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
          color: 'var(--text-muted)',
          background: 'transparent',
          border: 'none',
          borderTop: '1px solid var(--bg-border)',
          cursor: 'pointer',
          width: '100%',
        }}
      >
        {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        {!sidebarCollapsed && <span style={{ marginLeft: 8, fontSize: 13 }}>Collapse</span>}
      </button>
    </nav>
  );
}
