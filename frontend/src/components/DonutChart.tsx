import type { MetricSummary } from '../types';

interface Props {
  data: MetricSummary;
}

export function DonutChart({ data }: Props) {
  const segments = [
    { label: 'Compliant', value: data.compliant, color: '#22c55e' },
    { label: 'Warning', value: data.warning, color: '#f59e0b' },
    { label: 'Critical', value: data.critical, color: '#ef4444' },
    { label: 'Unknown', value: data.total - data.compliant - data.warning - data.critical, color: '#64748b' },
  ].filter((s) => s.value > 0);

  const total = data.total;
  const compliancePercent = Math.round((data.compliant / total) * 100);

  const r = 60;
  const cx = 80;
  const cy = 80;
  const strokeWidth = 18;
  const circumference = 2 * Math.PI * r;

  let offset = 0;
  const arcs = segments.map((seg) => {
    const fraction = seg.value / total;
    const dash = fraction * circumference;
    const gap = circumference - dash;
    const arc = { ...seg, dash, gap, offset, fraction };
    offset += dash;
    return arc;
  });

  const ariaLabel = segments.map((s) => `${s.label}: ${s.value} (${Math.round((s.value / total) * 100)}%)`).join(', ');

  return (
    <div className="flex items-center gap-6">
      <svg
        width={160}
        height={160}
        viewBox="0 0 160 160"
        role="img"
        aria-label={`Compliance donut chart. ${ariaLabel}`}
      >
        {arcs.map((arc) => (
          <circle
            key={arc.label}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={arc.color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${arc.dash} ${arc.gap}`}
            strokeDashoffset={-arc.offset}
            transform={`rotate(-90 ${cx} ${cy})`}
          />
        ))}
        <text x={cx} y={cy - 6} textAnchor="middle" fill="var(--text-primary)" fontSize={22} fontWeight={700}>
          {compliancePercent}%
        </text>
        <text x={cx} y={cy + 14} textAnchor="middle" fill="var(--text-secondary)" fontSize={11}>
          compliant
        </text>
      </svg>
      <div className="flex flex-col gap-2">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-2 text-xs">
            <span style={{ width: 10, height: 10, borderRadius: 2, background: seg.color, flexShrink: 0, display: 'inline-block' }} />
            <span style={{ color: 'var(--text-secondary)' }}>{seg.label}</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 600, marginLeft: 'auto' }}>{seg.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
