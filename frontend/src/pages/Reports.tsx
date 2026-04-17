import { useState } from 'react';
import { FileText, Download, Link } from 'lucide-react';

const REPORT_TYPES = [
  'Compliance Summary',
  'Non-Compliant Endpoints',
  'Software Inventory',
  'Update Compliance',
  'Endpoint Health',
];

const GROUP_BY = ['OS Version', 'Collection', 'Site'];

export function Reports() {
  const [reportType, setReportType] = useState('');
  const [dateRange, setDateRange] = useState('last30');
  const [groupBy, setGroupBy] = useState('');
  const [generated, setGenerated] = useState(false);

  const handleGenerate = () => {
    if (reportType) setGenerated(true);
  };

  return (
    <div style={{ padding: 'var(--space-6)', maxWidth: 960 }}>
      <h1 style={{ color: 'var(--text-primary)', fontSize: 28, fontWeight: 700, marginBottom: 24 }}>Reports</h1>

      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--bg-border)' }} className="rounded-lg p-6 mb-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label style={{ color: 'var(--text-secondary)', fontSize: 12, fontWeight: 500, display: 'block', marginBottom: 6 }}>
              Report Type
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--bg-border)', color: reportType ? 'var(--text-primary)' : 'var(--text-muted)' }}
              className="w-full px-3 py-2 rounded-md text-sm"
            >
              <option value="">Select type...</option>
              {REPORT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label style={{ color: 'var(--text-secondary)', fontSize: 12, fontWeight: 500, display: 'block', marginBottom: 6 }}>
              Date Range
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--bg-border)', color: 'var(--text-primary)' }}
              className="w-full px-3 py-2 rounded-md text-sm"
            >
              <option value="last7">Last 7 days</option>
              <option value="last30">Last 30 days</option>
              <option value="last90">Last 90 days</option>
              <option value="custom">Custom range</option>
            </select>
          </div>

          <div>
            <label style={{ color: 'var(--text-secondary)', fontSize: 12, fontWeight: 500, display: 'block', marginBottom: 6 }}>
              Group By
            </label>
            <select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value)}
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--bg-border)', color: groupBy ? 'var(--text-primary)' : 'var(--text-muted)' }}
              className="w-full px-3 py-2 rounded-md text-sm"
            >
              <option value="">No grouping</option>
              {GROUP_BY.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleGenerate}
            disabled={!reportType}
            style={{
              background: reportType ? 'var(--accent-primary)' : 'var(--bg-border)',
              color: 'white',
              cursor: reportType ? 'pointer' : 'not-allowed',
              opacity: reportType ? 1 : 0.5,
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium transition-colors"
            aria-disabled={!reportType}
          >
            <FileText size={15} />
            Generate Report
          </button>
          <button
            style={{ color: 'var(--text-secondary)', background: 'var(--bg-elevated)', border: '1px solid var(--bg-border)' }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-md text-sm"
          >
            Schedule Report
          </button>
        </div>
      </div>

      {generated ? (
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--bg-border)' }} className="rounded-lg overflow-hidden">
          <div style={{ borderBottom: '1px solid var(--bg-border)', padding: '14px 16px' }} className="flex items-center justify-between">
            <h2 style={{ color: 'var(--text-primary)', fontSize: 15, fontWeight: 600 }}>{reportType}</h2>
            <div className="flex items-center gap-2">
              <button style={{ color: 'var(--accent-primary)', background: 'rgba(0,120,212,0.08)', border: '1px solid rgba(0,120,212,0.2)' }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded text-sm">
                <Download size={14} /> PDF
              </button>
              <button style={{ color: 'var(--accent-primary)', background: 'rgba(0,120,212,0.08)', border: '1px solid rgba(0,120,212,0.2)' }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded text-sm">
                <Download size={14} /> CSV
              </button>
              <button style={{ color: 'var(--text-secondary)', background: 'var(--bg-elevated)', border: '1px solid var(--bg-border)' }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded text-sm">
                <Link size={14} /> Copy link
              </button>
            </div>
          </div>
          <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
            <thead style={{ borderBottom: '1px solid var(--bg-border)' }}>
              <tr>
                {['Collection', 'Total', 'Compliant', 'Non-Compliant', 'Rate'].map((h) => (
                  <th key={h} style={{ color: 'var(--text-muted)', fontWeight: 500, padding: '12px 16px', textAlign: 'left', fontSize: 12 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'All Workstations', total: 180, compliant: 142, nonCompliant: 38, rate: '79%' },
                { name: 'Servers', total: 45, compliant: 43, nonCompliant: 2, rate: '96%' },
                { name: 'Remote Workers', total: 82, compliant: 55, nonCompliant: 27, rate: '67%' },
                { name: 'Kiosks', total: 40, compliant: 28, nonCompliant: 12, rate: '70%' },
              ].map((row) => (
                <tr key={row.name} style={{ borderBottom: '1px solid var(--bg-border)' }} className="hover:bg-[var(--bg-elevated)]">
                  <td style={{ padding: '10px 16px', color: 'var(--text-primary)' }}>{row.name}</td>
                  <td style={{ padding: '10px 16px', color: 'var(--text-secondary)' }}>{row.total}</td>
                  <td style={{ padding: '10px 16px', color: '#22c55e' }}>{row.compliant}</td>
                  <td style={{ padding: '10px 16px', color: '#ef4444' }}>{row.nonCompliant}</td>
                  <td style={{ padding: '10px 16px', color: 'var(--text-primary)', fontWeight: 600 }}>{row.rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: 64, color: 'var(--text-muted)' }}>
          <FileText size={32} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
          <p>Run a report above to see results.</p>
        </div>
      )}
    </div>
  );
}
