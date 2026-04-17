import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useAppStore } from '../store';

export function Layout() {
  const { sidebarCollapsed } = useAppStore();
  const sidebarWidth = sidebarCollapsed ? 56 : 220;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <a
        href="#main-content"
        style={{
          position: 'absolute',
          left: '-9999px',
          zIndex: 9999,
          padding: '8px 16px',
          background: 'var(--accent-primary)',
          color: 'white',
          fontSize: 14,
          fontWeight: 500,
          borderRadius: 4,
          textDecoration: 'none',
        }}
        onFocus={(e) => { e.currentTarget.style.left = '8px'; e.currentTarget.style.top = '8px'; }}
        onBlur={(e) => { e.currentTarget.style.left = '-9999px'; }}
      >
        Skip to main content
      </a>
      <Sidebar />
      <main
        id="main-content"
        style={{
          marginLeft: sidebarWidth,
          flex: 1,
          minWidth: 0,
          transition: 'margin-left 100ms ease',
          background: 'var(--bg-base)',
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}
