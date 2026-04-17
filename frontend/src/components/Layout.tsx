import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useAppStore } from '../store';

export function Layout() {
  const { sidebarCollapsed } = useAppStore();
  const sidebarWidth = sidebarCollapsed ? 56 : 220;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main
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
