import clsx from 'clsx';
import type { ReactNode } from 'react';

interface TableColumn<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
  headerClassName?: string;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  keyField: keyof T;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  className?: string;
}

export function Table<T>({ columns, data, keyField, onRowClick, emptyMessage = 'No data available', className }: TableProps<T>) {
  return (
    <div className={clsx('overflow-x-auto rounded-xl border border-gray-200', className)}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map(col => (
              <th
                key={col.key}
                className={clsx('px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap', col.headerClassName)}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-10 text-center text-sm text-gray-400">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map(row => (
              <tr
                key={String(row[keyField])}
                className={clsx('transition-colors', onRowClick && 'cursor-pointer hover:bg-green-50')}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map(col => (
                  <td key={col.key} className={clsx('px-4 py-3 text-sm text-gray-700 whitespace-nowrap', col.className)}>
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// Tabs component
interface Tab {
  id: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs = ({ tabs, activeTab, onChange, className }: TabsProps) => (
  <div className={clsx('flex gap-1 border-b border-gray-200', className)}>
    {tabs.map(tab => (
      <button
        key={tab.id}
        onClick={() => onChange(tab.id)}
        className={clsx(
          'flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px',
          activeTab === tab.id
            ? 'border-green-600 text-green-700'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        )}
      >
        {tab.label}
        {tab.count != null && (
          <span className={clsx('text-xs px-1.5 py-0.5 rounded-full', activeTab === tab.id ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500')}>
            {tab.count}
          </span>
        )}
      </button>
    ))}
  </div>
);

// Page header
export const PageHeader = ({ title, subtitle, breadcrumb, actions }: { title: string; subtitle?: string; breadcrumb?: string; actions?: ReactNode }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
    <div>
      {breadcrumb && <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">{breadcrumb}</p>}
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
    </div>
    {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
  </div>
);
