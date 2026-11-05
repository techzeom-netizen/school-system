import { useState, useCallback } from 'react';
import {
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  ColumnOrderState,
  PaginationState,
  OnChangeFn,
} from '@tanstack/react-table';

export interface UseTanStackTableOptions {
  initialSorting?: SortingState;
  initialColumnFilters?: ColumnFiltersState;
  initialColumnVisibility?: VisibilityState;
  initialColumnOrder?: string[];
  initialPagination?: PaginationState;
  initialRowSelection?: Record<string, boolean>;
}

export interface UseTanStackTableReturn {
  sorting: SortingState;
  setSorting: OnChangeFn<SortingState>;
  columnFilters: ColumnFiltersState;
  setColumnFilters: OnChangeFn<ColumnFiltersState>;
  columnVisibility: VisibilityState;
  setColumnVisibility: OnChangeFn<VisibilityState>;
  columnOrder: ColumnOrderState;
  setColumnOrder: OnChangeFn<ColumnOrderState>;
  pagination: PaginationState;
  setPagination: OnChangeFn<PaginationState>;
  rowSelection: Record<string, boolean>;
  setRowSelection: OnChangeFn<Record<string, boolean>>;
  globalFilter: string;
  setGlobalFilter: (value: string) => void;

  // Reset functions
  resetSorting: () => void;
  resetColumnFilters: () => void;
  resetColumnVisibility: () => void;
  resetColumnOrder: () => void;
  resetPagination: () => void;
  resetRowSelection: () => void;
  resetGlobalFilter: () => void;
  resetAll: () => void;

  // Utility functions
  getSelectedRows: <T>(data: T[]) => T[];
  getSelectedRowIds: () => string[];
}

export function useTanStackTable({
  initialSorting = [],
  initialColumnFilters = [],
  initialColumnVisibility = {},
  initialColumnOrder = [],
  initialPagination = { pageIndex: 0, pageSize: 10 },
  initialRowSelection = {},
}: UseTanStackTableOptions = {}): UseTanStackTableReturn {
  // State
  const [sorting, setSorting] = useState<SortingState>(initialSorting);
  const [columnFilters, setColumnFilters] =
    useState<ColumnFiltersState>(initialColumnFilters);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    initialColumnVisibility
  );
  const [columnOrder, setColumnOrder] =
    useState<ColumnOrderState>(initialColumnOrder);
  const [pagination, setPagination] =
    useState<PaginationState>(initialPagination);
  const [rowSelection, setRowSelection] =
    useState<Record<string, boolean>>(initialRowSelection);
  const [globalFilter, setGlobalFilterState] = useState<string>('');

  // Memoized handlers
  const setGlobalFilter = useCallback((value: string) => {
    setGlobalFilterState(value);
  }, []);

  // Reset functions
  const resetSorting = useCallback(() => {
    setSorting(initialSorting);
  }, [initialSorting]);

  const resetColumnFilters = useCallback(() => {
    setColumnFilters(initialColumnFilters);
  }, [initialColumnFilters]);

  const resetColumnVisibility = useCallback(() => {
    setColumnVisibility(initialColumnVisibility);
  }, [initialColumnVisibility]);

  const resetColumnOrder = useCallback(() => {
    setColumnOrder(initialColumnOrder);
  }, [initialColumnOrder]);

  const resetPagination = useCallback(() => {
    setPagination(initialPagination);
  }, [initialPagination]);

  const resetRowSelection = useCallback(() => {
    setRowSelection(initialRowSelection);
  }, [initialRowSelection]);

  const resetGlobalFilter = useCallback(() => {
    setGlobalFilterState('');
  }, []);

  const resetAll = useCallback(() => {
    resetSorting();
    resetColumnFilters();
    resetColumnVisibility();
    resetColumnOrder();
    resetPagination();
    resetRowSelection();
    resetGlobalFilter();
  }, [
    resetSorting,
    resetColumnFilters,
    resetColumnVisibility,
    resetColumnOrder,
    resetPagination,
    resetRowSelection,
    resetGlobalFilter,
  ]);

  // Utility functions
  const getSelectedRows = useCallback(
    <T>(data: T[]) => {
      return data.filter((_, index) => rowSelection[index.toString()]);
    },
    [rowSelection]
  );

  const getSelectedRowIds = useCallback(() => {
    return Object.keys(rowSelection).filter(key => rowSelection[key]);
  }, [rowSelection]);

  return {
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    columnVisibility,
    setColumnVisibility,
    columnOrder,
    setColumnOrder,
    pagination,
    setPagination,
    rowSelection,
    setRowSelection,
    globalFilter,
    setGlobalFilter,
    resetSorting,
    resetColumnFilters,
    resetColumnVisibility,
    resetColumnOrder,
    resetPagination,
    resetRowSelection,
    resetGlobalFilter,
    resetAll,
    getSelectedRows,
    getSelectedRowIds,
  };
}

export default useTanStackTable;
