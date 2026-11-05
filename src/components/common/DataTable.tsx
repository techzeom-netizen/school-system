import React from 'react';
import ErrorBoundary from './ErrorBoundary';
import { SkeletonTable } from './Skeleton';

type ColumnRender<T> = {
  bivarianceHack(value: T[keyof T], record: T, index: number): React.ReactNode;
}['bivarianceHack'];

interface Column<T> {
  key: keyof T | string;
  title: string;
  render?: ColumnRender<T>;
  width?: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  error?: string;
  emptyMessage?: string;
  className?: string;
  onRowClick?: (record: T, index: number) => void;
  rowKey?: keyof T | ((record: T) => string | number);
}

function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  loading = false,
  error,
  emptyMessage = 'No data available',
  className = '',
  onRowClick,
  rowKey = 'id',
}: DataTableProps<T>) {
  if (loading) {
    return <SkeletonTable className={className} />;
  }

  if (error) {
    return (
      <div
        className={`bg-white rounded-lg shadow-sm border border-red-200 overflow-hidden ${className}`}
      >
        <div className="p-6 text-center">
          <div className="flex items-center justify-center text-red-600 mb-2">
            <svg
              className="h-8 w-8 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <span className="font-medium">Failed to load data</span>
          </div>
          <p className="text-sm text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  const getRowKey = (record: T, index: number): string | number => {
    if (typeof rowKey === 'function') {
      return rowKey(record);
    }
    const value = record[rowKey];
    return typeof value === 'string' || typeof value === 'number'
      ? value
      : index;
  };

  const getValue = (record: T, key: keyof T | string): T[keyof T] => {
    if (typeof key === 'string' && key.includes('.')) {
      return key.split('.').reduce<unknown>((obj, k) => {
        if (obj && typeof obj === 'object' && k in obj) {
          return (obj as Record<string, unknown>)[k];
        }
        return undefined;
      }, record) as T[keyof T];
    }
    return record[key as keyof T];
  };

  return (
    <ErrorBoundary>
      <div
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}
      >
        {data.length === 0 ? (
          <div className="p-8 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              No data
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {emptyMessage}
            </p>
          </div>
        ) : (
          <>
            {/* Table header */}
            <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <div
                className="grid gap-4"
                style={{
                  gridTemplateColumns: columns
                    .map(col => col.width || '1fr')
                    .join(' '),
                }}
              >
                {columns.map((column, index) => (
                  <div
                    key={index}
                    className={`text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${
                      column.align === 'center'
                        ? 'text-center'
                        : column.align === 'right'
                          ? 'text-right'
                          : 'text-left'
                    }`}
                  >
                    {column.title}
                  </div>
                ))}
              </div>
            </div>

            {/* Table body */}
            <div className="divide-y divide-gray-200 dark:divide-gray-600">
              {data.map((record, index) => (
                <div
                  key={getRowKey(record, index)}
                  className={`px-6 py-4 ${
                    onRowClick
                      ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
                      : ''
                  }`}
                  onClick={() => onRowClick?.(record, index)}
                >
                  <div
                    className="grid gap-4"
                    style={{
                      gridTemplateColumns: columns
                        .map(col => col.width || '1fr')
                        .join(' '),
                    }}
                  >
                    {columns.map((column, colIndex) => (
                      <div
                        key={colIndex}
                        className={`text-sm text-gray-900 dark:text-white ${
                          column.align === 'center'
                            ? 'text-center'
                            : column.align === 'right'
                              ? 'text-right'
                              : 'text-left'
                        }`}
                      >
                        {column.render
                          ? column.render(
                              getValue(record, column.key),
                              record,
                              index
                            )
                          : String(getValue(record, column.key) ?? '')}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default DataTable;
