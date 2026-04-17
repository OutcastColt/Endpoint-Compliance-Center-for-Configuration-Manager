import { TrendingUp, TrendingDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { ComplianceStatus } from '../types';

interface Props {
  label: string;
  value: number;
  trend?: number;
  filterStatus?: ComplianceStatus | 'total';
  color?: string;
}

export function MetricCard({ label, value, trend, filterStatus, color }: Props) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (filterStatus && filterStatus !== 'total') {
      navigate(`/endpoints?status=${filterStatus}`);
    } else if (filterStatus === 'total') {
      navigate('/endpoints');
    }
  };

  return (
    <button
      onClick={handleClick}
      style={{ background: 'var(--bg-surface)', border: '1px solid var(--bg-border)' }}
      className="rounded-lg p-6 text-left w-full cursor-pointer transition-colors hover:border-[var(--accent-primary)] focus-visible:outline-2"
      aria-label={`${label}: ${value}`}
    >
      <p style={{ color: 'var(--text-secondary)' }} className="text-xs font-medium uppercase tracking-wider mb-3">
        {label}
      </p>
      <p style={{ color: color ?? 'var(--text-primary)', fontSize: 28, fontWeight: 700, lineHeight: 1.2 }}>
        {value.toLocaleString()}
      </p>
      {trend !== undefined && (
        <div className="flex items-center gap-1 mt-2">
          {trend >= 0
            ? <TrendingUp size={14} color="#22c55e" />
            : <TrendingDown size={14} color="#ef4444" />}
          <span style={{ color: trend >= 0 ? '#22c55e' : '#ef4444' }} className="text-xs">
            {trend >= 0 ? '+' : ''}{trend}% this week
          </span>
        </div>
      )}
    </button>
  );
}
