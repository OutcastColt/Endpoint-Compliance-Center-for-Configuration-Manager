import { Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface Filter {
  key: string;
  label: string;
  options: string[];
}

interface Props {
  filters: Filter[];
  onSearch: (q: string) => void;
  onFilter: (key: string, value: string) => void;
  activeFilters: Record<string, string>;
  onClearFilter: (key: string) => void;
  onClearAll: () => void;
}

export function FilterBar({ filters, onSearch, onFilter, activeFilters, onClearFilter, onClearAll }: Props) {
  const [query, setQuery] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleSearch = (val: string) => {
    setQuery(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => onSearch(val), 300);
  };

  useEffect(() => () => clearTimeout(debounceRef.current), []);

  const activeEntries = Object.entries(activeFilters).filter(([, v]) => v);

  return (
    <div role="search" aria-label="Endpoint filters">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input
            type="search"
            placeholder="Search endpoints..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--bg-border)',
              color: 'var(--text-primary)',
            }}
            className="w-full pl-9 pr-3 py-2 rounded-md text-sm focus:outline-none focus:border-[var(--accent-primary)]"
          />
        </div>
        {filters.map((f) => (
          <select
            key={f.key}
            value={activeFilters[f.key] ?? ''}
            onChange={(e) => onFilter(f.key, e.target.value)}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--bg-border)',
              color: activeFilters[f.key] ? 'var(--text-primary)' : 'var(--text-muted)',
            }}
            className="px-3 py-2 rounded-md text-sm focus:outline-none focus:border-[var(--accent-primary)] cursor-pointer"
          >
            <option value="">{f.label}</option>
            {f.options.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        ))}
        {activeEntries.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-xs px-3 py-2 rounded-md transition-colors"
            style={{ color: 'var(--accent-primary)', background: 'rgba(0,120,212,0.08)' }}
          >
            Reset
          </button>
        )}
      </div>
      {activeEntries.length > 0 && (
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          {activeEntries.map(([key, val]) => (
            <span
              key={key}
              style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--bg-border)' }}
              className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full"
            >
              {val}
              <button
                onClick={() => onClearFilter(key)}
                aria-label={`Remove filter ${val}`}
                className="hover:opacity-70"
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
