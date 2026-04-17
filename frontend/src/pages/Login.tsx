import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Eye, EyeOff } from 'lucide-react';

export function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [failCount, setFailCount] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (lockoutUntil && Date.now() < lockoutUntil) return;

    const form = new FormData(e.currentTarget);
    const username = form.get('username') as string;
    const password = form.get('password') as string;

    if (username === 'admin' && password === 'admin') {
      navigate('/dashboard');
    } else {
      const next = failCount + 1;
      setFailCount(next);
      if (next >= 5) {
        setLockoutUntil(Date.now() + 30000);
        setError('Too many failed attempts. Please wait 30 seconds before trying again.');
      } else {
        setError('Invalid credentials. Please try again.');
      }
    }
  };

  const isLocked = lockoutUntil !== null && Date.now() < lockoutUntil;

  return (
    <div
      style={{ background: 'var(--bg-base)', minHeight: '100vh' }}
      className="flex items-center justify-center p-4"
    >
      <main className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <ShieldCheck size={40} style={{ color: 'var(--accent-primary)' }} />
          <h1 style={{ color: 'var(--text-primary)', fontSize: 22, fontWeight: 600, marginTop: 12 }}>
            Endpoint Compliance Center
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4 }}>
            for Configuration Manager
          </p>
        </div>

        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--bg-border)' }} className="rounded-xl p-8">
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-4">
              <label htmlFor="username" style={{ color: 'var(--text-secondary)', fontSize: 12, fontWeight: 500 }} className="block mb-1.5 uppercase tracking-wide">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                placeholder="domain\username"
                required
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--bg-border)', color: 'var(--text-primary)' }}
                className="w-full px-3 py-2.5 rounded-md text-sm focus:border-[var(--accent-primary)]"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" style={{ color: 'var(--text-secondary)', fontSize: 12, fontWeight: 500 }} className="block mb-1.5 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  style={{ background: 'var(--bg-elevated)', border: '1px solid var(--bg-border)', color: 'var(--text-primary)' }}
                  className="w-full px-3 py-2.5 pr-10 rounded-md text-sm focus:border-[var(--accent-primary)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{ color: 'var(--text-muted)' }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div aria-live="polite" className="mb-4">
              {error && (
                <p style={{ color: 'var(--status-critical)', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }} className="text-sm px-3 py-2.5 rounded-md">
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLocked}
              style={{
                background: isLocked ? 'var(--bg-border)' : 'var(--accent-primary)',
                color: 'white',
                cursor: isLocked ? 'not-allowed' : 'pointer',
                opacity: isLocked ? 0.4 : 1,
              }}
              aria-disabled={isLocked}
              className="w-full py-2.5 rounded-md text-sm font-medium transition-colors hover:bg-[var(--accent-hover)]"
            >
              Sign In
            </button>
          </form>

          <div className="mt-4">
            <p style={{ color: 'var(--text-muted)', fontSize: 12, textAlign: 'center' }}>
              Using local authentication (AD unavailable)
            </p>
          </div>
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: 12, textAlign: 'center', marginTop: 16 }}>
          Demo: username <code style={{ fontFamily: 'monospace' }}>admin</code> / password <code style={{ fontFamily: 'monospace' }}>admin</code>
        </p>
      </main>
    </div>
  );
}
