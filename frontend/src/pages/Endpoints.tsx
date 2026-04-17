import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Download } from 'lucide-react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  type SortingState,
  type ColumnDef,
} from '@tanstack/react-table';
import { StatusBadge } from '../components/StatusBadge';
import { FilterBar } from '../components/FilterBar';
import { mockEndpoints } from '../mockData';
import type { Endpoint } from '../types';

const FILTERS = [
  { key: 'status', label: 'Status', options: ['compliant', 'warning', 'critical', 'unknown', 'pending'] },
  { key: 'osVersion', label: 'OS Version', options: [...new Set(mockEndpoints.map((e) => e.osVersion))] },
  { key: 'collection', label: 'Collection', options: [...new Set(mockEndpoints.map((e) => e.collection))] },
];

export function Endpoints() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [query, setQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({
    status: searchParams.get('status') ?? '',
  });

  const data = useMemo(() => {
    let rows = mockEndpoints;
    if (query) {
      const q = query.toLowerCase();
      rows = rows.filter((e) => e.hostname.toLowerCase().includes(q) || e.ipAddress.includes(q));
    }
    Object.entries(activeFilters).forEach(([key, val]) => {
      if (val) rows = rows.filter((e) => String(e[key as keyof Endpoint]) === val);
    });
    return rows;
  }, [query, activeFilters]);

  const columns = useMemo<ColumnDef<Endpoint>[]>(() => [
    {
      id: 'select',
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllPageRowsSelected()}
          onChange={table.getToggleAllPageRowsSelectedHandler()}
          aria-label="Select all"
          style={{ accentColor: 'var(--accent-primary)' }}
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
          onClick={(e) => e.stopPropagation()}
          aria-label={`Select ${row.original.hostname}`}
          style={{ accentColor: 'var(--accent-primary)' }}
        />
      ),
      size: 40,
    },
    {
      accessorKey: 'hostname',
      header: 'Hostname',
      cell: (info) => <span style={{ fontFamily: 'monospace', fontSize: 13 }}>{String(info.getValue())}</span>,
    },
    {
      accessorKey: 'ipAddress',
      header: 'IP Address',
      cell: (info) => <span style={{ fontFamily: 'monospace', fontSize: 13, color: 'var(--text-secondary)' }}>{String(info.getValue())}</span>,
    },
    {
      accessorKey: 'lastSeen',
      header: 'Last Seen',
      cell: (info) => <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{new Date(String(info.getValue())).toLocaleDateString()}</span>,
    },
    {
      accessorKey: 'osVersion',
      header: 'OS Version',
      cell: (info) => <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{String(info.getValue())}</span>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: (info) => <StatusBadge status={info.getValue() as Endpoint['status']} />,
    },
  ], []);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, rowSelection },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 25 } },
    enableRowSelection: true,
  });

  const selectedCount = Object.keys(rowSelection).length;

  const handleFilter = (key: string, value: string) => {
    setActiveFilters((p) => ({ ...p, [key]: value }));
    if (key === 'status') setSearchParams(value ? { status: value } : {});
  };

  const handleClearFilter = (key: string) => handleFilter(key, '');
  const handleClearAll = () => {
    setActiveFilters({});
    setQuery('');
    setSearchParams({});
  };

  return (
    <div style={{ padding: 'var(--space-6)' }}>
      <div className="flex items-center justify-between mb-6">
        <h1 style={{ color: 'var(--text-primary)', fontSize: 28, fontWeight: 700 }}>Endpoints</h1>
        <button
          style={{ color: 'var(--accent-primary)', background: 'rgba(0,120,212,0.08)', border: '1px solid rgba(0,120,212,0.2)' }}
          className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium"
        >
          <Download size={15} />
          Export CSV
        </button>
      </div>

      <div className="mb-4">
        <FilterBar
          filters={FILTERS}
          onSearch={setQuery}
          onFilter={handleFilter}
          activeFilters={activeFilters}
          onClearFilter={handleClearFilter}
          onClearAll={handleClearAll}
        />
      </div>

      <div className="flex items-center justify-between mb-3">
        <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
          {data.length} endpoint{data.length !== 1 ? 's' : ''} · Showing{' '}
          {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}–
          {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, data.length)}
        </p>
        {selectedCount > 0 && (
          <div className="flex items-center gap-2">
            <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{selectedCount} selected</span>
            <button style={{ color: 'var(--accent-primary)' }} className="text-sm hover:underline">Export Selected</button>
            <button style={{ color: 'var(--accent-primary)' }} className="text-sm hover:underline">Force Compliance Check</button>
          </div>
        )}
      </div>

      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--bg-border)' }} className="rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table
            className="w-full text-sm"
            style={{ borderCollapse: 'collapse' }}
            role="grid"
            aria-label="Endpoints table"
          >
            <thead style={{ borderBottom: '1px solid var(--bg-border)', position: 'sticky', top: 0, background: 'var(--bg-surface)' }}>
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((header) => (
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      aria-sort={header.column.getIsSorted() === 'asc' ? 'ascending' : header.column.getIsSorted() === 'desc' ? 'descending' : 'none'}
                      style={{
                        color: 'var(--text-muted)',
                        fontWeight: 500,
                        padding: '12px 12px',
                        textAlign: 'left',
                        fontSize: 12,
                        cursor: header.column.getCanSort() ? 'pointer' : 'default',
                        userSelect: 'none',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {header.isPlaceholder ? null : (
                        <span className="flex items-center gap-1">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getIsSorted() === 'asc' ? ' ↑' : header.column.getIsSorted() === 'desc' ? ' ↓' : ''}
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)' }}>
                    <p style={{ marginBottom: 12 }}>No endpoints match your filters.</p>
                    <button onClick={handleClearAll} style={{ color: 'var(--accent-primary)' }} className="text-sm hover:underline">
                      Clear filters
                    </button>
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => navigate(`/endpoints/${row.original.id}`)}
                    style={{
                      borderBottom: '1px solid var(--bg-border)',
                      cursor: 'pointer',
                      background: row.getIsSelected() ? 'rgba(0,120,212,0.06)' : 'transparent',
                      borderLeft: row.getIsSelected() ? '4px solid var(--accent-primary)' : '4px solid transparent',
                    }}
                    className="hover:bg-[var(--bg-elevated)] transition-colors"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && navigate(`/endpoints/${row.original.id}`)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} style={{ padding: '12px 12px' }}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ borderTop: '1px solid var(--bg-border)', padding: '12px 16px' }} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Rows per page:</span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--bg-border)', color: 'var(--text-primary)' }}
              className="px-2 py-1 rounded text-sm"
            >
              {[25, 50, 100].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              style={{ color: 'var(--text-secondary)', background: 'var(--bg-elevated)', border: '1px solid var(--bg-border)' }}
              className="px-3 py-1 rounded text-sm disabled:opacity-40"
            >
              ←
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              style={{ color: 'var(--text-secondary)', background: 'var(--bg-elevated)', border: '1px solid var(--bg-border)' }}
              className="px-3 py-1 rounded text-sm disabled:opacity-40"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
