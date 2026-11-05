import React, { useMemo, useState, useCallback, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  ColumnDef,
  flexRender,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  ColumnOrderState,
  PaginationState,
  Row,
  Column,
} from '@tanstack/react-table';
import {
  ChevronDown,
  ChevronsUpDown,
  Search,
  EyeOff,
  Settings2,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  GripVertical,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
// import TableHeaderInfo, { TableHeaderInfoProps } from './table/TableHeaderInfo';
import { TableHeaderInfoProps } from './table/TableHeaderInfo';
import DownloadButton from './table/DownloadButton';
import { ExportData } from './table/exportTemplateGenerator';
import { useAuth } from '@/hooks/useAuth';
export interface ServerSideDataResponse<TData> {
  data: TData[];
  totalCount: number;
  totalPages: number;
}

export type DataFetchFunction<TData> = (
  page: number,
  pageSize: number,
  search?: string,
  sortBy?: string,
  sortDirection?: 'asc' | 'desc'
) => Promise<ServerSideDataResponse<TData>>;

export interface TanStackTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  headerInfo?: boolean | TableHeaderInfoProps;
  enableSearch?: boolean;
  enableSorting?: boolean;
  enableColumnVisibility?: boolean;
  enableColumnReordering?: boolean;
  enablePagination?: boolean;
  enableRowSelection?: boolean;
  showDownload?: boolean;
  hideFooter?: boolean;
  searchPlaceholder?: string;
  pageSize?: number;
  initialPageIndex?: number;
  pageSizeOptions?: number[];
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  isLoading?: boolean;
  onRowClick?: (row: Row<TData>) => void;
  emptyMessage?: string;
  customFilters?: React.ReactNode;
  onSelectionChange?: (selectedRows: TData[]) => void;
  onSearchChange?: (searchTerm: string) => void;
  // Server-side pagination props
  enableServerSidePagination?: boolean;
  onDataFetch?: DataFetchFunction<TData>;
  totalCount?: number;
  // Footer content (rendered between table and pagination)
  footerContent?: React.ReactNode;
  // Custom row ID getter for stable row identification
  getRowId?: (row: TData, index: number) => string;
  // Top action button (rendered at the top of the table toolbar)
  topActionButton?: React.ReactNode;
  // Optional expanded row renderer, shown as a full-width row below a data row
  renderExpandedRow?: (row: Row<TData>) => React.ReactNode;
  // Controls whether a row should render its expanded content
  isRowExpanded?: (row: Row<TData>) => boolean;
  // Optional export override for downloads/print
  exportDataOverride?: ExportData;
  // Enable table body vertical scrolling in a bounded container
  scrollable?: boolean;
  // Max height for scrollable table body
  scrollableHeight?: string;
}

// Custom hook for error handling
const useErrorHandler = () => {
  const [error, setError] = useState<string | null>(null);

  const handleError = useCallback((error: unknown, userMessage: string) => {
    const errorMessage = error instanceof Error ? error.message : String(error);
    // Error logged for debugging purposes
    setError(userMessage);

    return errorMessage;
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return { error, handleError, clearError };
};

export function TanStackTable<TData>({
  data,
  columns,
  headerInfo,
  enableSearch = false,
  enableSorting = false,
  enableColumnVisibility = false,
  enableColumnReordering = false,
  enablePagination = true,
  enableRowSelection = false,
  showDownload = false,
  hideFooter = false,
  searchPlaceholder = 'Search...',
  pageSize = 10,
  initialPageIndex = 0,
  pageSizeOptions = [10, 20, 50, 100],
  className = '',
  headerClassName = '',
  bodyClassName = '',
  // isLoading = false,
  onRowClick,
  emptyMessage = 'No data available',
  customFilters,
  onSelectionChange,
  onSearchChange,
  enableServerSidePagination = false,
  onDataFetch,
  totalCount = 0,
  footerContent,
  getRowId,
  topActionButton,
  renderExpandedRow,
  isRowExpanded,
  exportDataOverride,
  scrollable = false,
  scrollableHeight = '620px',
}: TanStackTableProps<TData>) {
  const { error, handleError, clearError } = useErrorHandler();
  const { user } = useAuth();
  // Hard-coded primary color
  const primaryColor = '#2563EB';
  const [serverSideData, setServerSideData] = useState<TData[]>([]);
  // const [serverSideLoading, setServerSideLoading] = useState(false);
  const [serverTotalCount, setServerTotalCount] = useState(0);

  // Internal state management
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(
    columns.map((_, index) => index.toString())
  );
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: initialPageIndex,
    pageSize,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Resolve header information
  // (still used by the export/download data, even though the on-screen header is commented out)
  const resolvedHeaderInfo = useMemo(() => {
    const defaultHeaderInfo: TableHeaderInfoProps = {
      // ...getHeaderInfoFromUser(user),
      reportTitle: 'MEMBER ENROLLMENT REPORT FROM:',
    };

    if (headerInfo === false) {
      return undefined;
    }

    if (headerInfo === true) {
      return defaultHeaderInfo;
    }

    // If headerInfo is an object, use it (custom props)
    if (typeof headerInfo === 'object') {
      return {
        ...defaultHeaderInfo,
        ...headerInfo,
      };
    }

    return undefined;
  }, [headerInfo, user]);

  // Handle server-side data fetching
  useEffect(() => {
    if (enableServerSidePagination && onDataFetch) {
      const fetchData = async () => {
        // setServerSideLoading(true);
        try {
          const sortField = sorting.length > 0 ? sorting[0].id : undefined;
          const sortDirection =
            sorting.length > 0 ? (sorting[0].desc ? 'desc' : 'asc') : undefined;

          const result = await onDataFetch(
            pagination.pageIndex,
            pagination.pageSize,
            searchTerm || undefined,
            sortField,
            sortDirection
          );

          setServerSideData(result.data);
          setServerTotalCount(result.totalCount);
        } catch (err) {
          handleError(err, 'Error fetching data');
        } finally {
          // setServerSideLoading(false);
        }
      };

      fetchData();
    }
  }, [
    enableServerSidePagination,
    onDataFetch,
    pagination.pageIndex,
    pagination.pageSize,
    searchTerm,
    sorting,
    handleError,
  ]);

  // Handle selection changes
  useEffect(() => {
    if (onSelectionChange && enableRowSelection) {
      const currentData = enableServerSidePagination ? serverSideData : data;
      const selectedRows = currentData.filter(
        (_, index) => rowSelection[index.toString()]
      );
      onSelectionChange(selectedRows);
    }
  }, [
    rowSelection,
    data,
    serverSideData,
    onSelectionChange,
    enableRowSelection,
    enableServerSidePagination,
  ]);

  // Handle search changes
  useEffect(() => {
    if (onSearchChange) {
      onSearchChange(searchTerm);
    }
  }, [searchTerm, onSearchChange]);

  // Determine which data to use
  const tableData = enableServerSidePagination ? serverSideData : data;
  const resolvedServerTotalCount = totalCount || serverTotalCount;
  const resolvedServerPageCount = Math.max(
    1,
    Math.ceil(resolvedServerTotalCount / Math.max(pagination.pageSize, 1))
  );
  // const tableIsLoading = isLoading || serverSideLoading;

  // Memoized columns with enhanced functionality
  const enhancedColumns = useMemo(() => {
    const processedColumns = columns.map((column, index) => ({
      ...column,
      id: column.id || index.toString(),
      enableSorting: enableSorting && column.enableSorting !== false,
    }));

    if (enableRowSelection) {
      const selectionColumn: ColumnDef<TData> = {
        id: 'select',
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllPageRowsSelected()}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              table.toggleAllPageRowsSelected(e.target.checked)
            }
            className="rounded border-gray-300"
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              row.toggleSelected(e.target.checked)
            }
            className="rounded border-gray-300"
          />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 40,
      };
      return [selectionColumn, ...processedColumns];
    }

    return processedColumns;
  }, [columns, enableSorting, enableRowSelection]);

  // Table instance
  const table = useReactTable({
    data: tableData,
    columns: enhancedColumns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      columnOrder,
      rowSelection,
      pagination,
      globalFilter: searchTerm,
    },
    enableRowSelection,
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setSearchTerm,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel:
      enablePagination && !enableServerSidePagination
        ? getPaginationRowModel()
        : undefined,
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    manualPagination: enableServerSidePagination,
    manualFiltering: enableServerSidePagination,
    pageCount: enableServerSidePagination ? resolvedServerPageCount : undefined,
    initialState: {
      pagination: { pageIndex: initialPageIndex, pageSize },
    },
    // Use custom getRowId if provided, otherwise use default (index-based)
    getRowId:
      getRowId ||
      ((row: TData, index: number) => {
        // Try to use 'id' field if available, otherwise fall back to index
        const rowWithId = row as { id?: string | number };
        return rowWithId?.id !== undefined
          ? String(rowWithId.id)
          : String(index);
      }),
  });

  // Prepare export data
  const exportData: ExportData = useMemo(() => {
    const rows = table?.getFilteredRowModel().rows || [];
    const visibleColumns =
      table
        ?.getAllColumns()
        .filter(
          col =>
            col.getIsVisible() && col.id !== 'select' && col.id !== 'actions'
        ) || [];

    return {
      headerInfo: resolvedHeaderInfo,
      columns: visibleColumns.map(col => ({
        header:
          typeof col.columnDef.header === 'string'
            ? col.columnDef.header
            : col.id,
        id: col.id,
      })),
      rows: rows.map(row => {
        const rowData: { [key: string]: string } = {};
        row
          .getVisibleCells()
          .filter(
            cell => cell.column.id !== 'select' && cell.column.id !== 'actions'
          )
          .forEach(cell => {
            const value = cell.getValue();
            rowData[cell.column.id] =
              value === null || value === undefined || typeof value === 'object'
                ? ''
                : String(value);
          });
        return rowData;
      }),
      fileName: resolvedHeaderInfo?.reportTitle || 'report',
    };
  }, [table, resolvedHeaderInfo]);

  const resolvedExportData = exportDataOverride || exportData;

  // Handlers
  const handleGlobalFilterChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleRowClick = useCallback(
    (row: Row<TData>) => {
      if (onRowClick) {
        onRowClick(row);
      }
    },
    [onRowClick]
  );

  const renderSortIcon = (column: Column<TData, unknown>) => {
    if (!column.getCanSort()) return null;

    const sorted = column.getIsSorted();
    if (sorted === 'asc') return <ArrowUp className="h-4 w-4" />;
    if (sorted === 'desc') return <ArrowDown className="h-4 w-4" />;
    return <ChevronsUpDown className="h-4 w-4" />;
  };

  const renderPaginationInfo = () => {
    if (enableServerSidePagination) {
      const total = resolvedServerTotalCount;
      if (total === 0) {
        return (
          <>
            <span className="hidden lg:inline">Showing 0-0 of 0 results</span>
            <span className="lg:hidden">Total 0 results</span>
          </>
        );
      }
      const start = pagination.pageIndex * pagination.pageSize + 1;
      const end = Math.min(
        (pagination.pageIndex + 1) * pagination.pageSize,
        total
      );
      return (
        <>
          <span className="hidden lg:inline">
            Showing {start}-{end} of {total} results
          </span>
          <span className="lg:hidden">Total {total} results</span>
        </>
      );
    }

    const start =
      table.getState().pagination.pageIndex *
        table.getState().pagination.pageSize +
      1;
    const end = Math.min(
      (table.getState().pagination.pageIndex + 1) *
        table.getState().pagination.pageSize,
      table.getFilteredRowModel().rows.length
    );
    const total = table.getFilteredRowModel().rows.length;
    return (
      <>
        <span className="hidden lg:inline">
          Showing {start}-{end} of {total} results
        </span>
        <span className="lg:hidden">Total {total} results</span>
      </>
    );
  };

  return (
    <div className={`w-full space-y-4 ${className}`}>
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
          <button onClick={clearError} className="ml-2 text-sm underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {enableSearch && (
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={e => handleGlobalFilterChange(e.target.value)}
                className="pl-8 w-[300px]"
              />
            </div>
          )}
          {customFilters}
        </div>

        <div className="flex items-center space-x-2">
          {topActionButton && topActionButton}
          {showDownload && (
            <DownloadButton
              data={resolvedExportData}
              variant="outline"
              size="sm"
            />
          )}

          {enableColumnVisibility && (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <EyeOff className="h-4 w-4 mr-2" />
                  Columns
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-[200px] z-50"
                onCloseAutoFocus={e => e.preventDefault()}
              >
                {table
                  .getAllColumns()
                  .filter(column => column.getCanHide())
                  .map(column => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={value => {
                          column.toggleVisibility(!!value);
                        }}
                        onSelect={e => e.preventDefault()}
                      >
                        {typeof column.columnDef.header === 'string'
                          ? column.columnDef.header
                          : column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {enableColumnReordering && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.resetColumnOrder()}
            >
              <Settings2 className="h-4 w-4 mr-2" />
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Table with Header Info */}
      <div
        className="rounded-b-md border"
        style={{ borderColor: `${primaryColor}70` }}
      >
        {/* Header Information with Logo */}
        {/* {resolvedHeaderInfo && <TableHeaderInfo {...resolvedHeaderInfo} />} */}

        {/* Table Container */}
        <div className="relative">
          {/* {tableIsLoading && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center">
              <div className="flex flex-col items-center space-y-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="text-muted-foreground text-sm">Loading...</p>
              </div>
            </div>
          )} */}
          <div
            className={`overflow-x-auto ${scrollable ? 'overflow-y-auto' : ''}`}
            style={scrollable ? { maxHeight: scrollableHeight } : undefined}
          >
            <table className="w-full border-collapse">
              <thead
                className={`${headerClassName} ${scrollable ? 'sticky top-0 z-20' : ''}`}
                style={{ backgroundColor: primaryColor }}
              >
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id} className="border-b border-border">
                    {headerGroup.headers.map(header => (
                      <th
                        key={header.id}
                        className="px-2 py-1.5 text-white whitespace-nowrap text-xs text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 border-r border-border last:border-r-0"
                        style={{
                          width: header.getSize(),
                        }}
                        onDragOver={e => {
                          e.preventDefault();
                          e.dataTransfer.dropEffect = 'move';
                          if (isDragging) {
                            e.currentTarget.classList.add('bg-muted/50');
                          }
                        }}
                        onDragLeave={e => {
                          e.currentTarget.classList.remove('bg-muted/50');
                        }}
                        onDrop={e => {
                          e.preventDefault();
                          e.currentTarget.classList.remove('bg-muted/50');
                          const draggedColumnId =
                            e.dataTransfer.getData('text/plain');
                          const targetColumnId = header.column.id;

                          if (draggedColumnId !== targetColumnId) {
                            const newColumnOrder = [
                              ...table.getState().columnOrder,
                            ];
                            const draggedIndex =
                              newColumnOrder.indexOf(draggedColumnId);
                            const targetIndex =
                              newColumnOrder.indexOf(targetColumnId);

                            newColumnOrder.splice(draggedIndex, 1);
                            newColumnOrder.splice(
                              targetIndex,
                              0,
                              draggedColumnId
                            );

                            table.setColumnOrder(newColumnOrder);
                          }
                        }}
                      >
                        {header.isPlaceholder ? null : (
                          <div
                            className={`flex items-center space-x-2 ${
                              header.column.getCanSort()
                                ? 'cursor-pointer select-none'
                                : ''
                            }`}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {enableColumnReordering &&
                              header.column.getCanHide() && (
                                <div
                                  className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
                                  draggable
                                  onDragStart={e => {
                                    setIsDragging(true);
                                    e.dataTransfer.effectAllowed = 'move';
                                    e.dataTransfer.setData(
                                      'text/plain',
                                      header.column.id
                                    );
                                  }}
                                  onDragEnd={() => {
                                    setIsDragging(false);
                                  }}
                                >
                                  <GripVertical className="h-4 w-4" />
                                </div>
                              )}
                            <span>
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                            </span>
                            {renderSortIcon(header.column)}
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className={bodyClassName}>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row, index) => {
                    const shouldRenderExpandedRow =
                      Boolean(renderExpandedRow) &&
                      Boolean(isRowExpanded?.(row));

                    return (
                      <React.Fragment key={row.id}>
                        <tr
                          className={`
                            border-b border-border transition-colors hover:bg-muted/50
                            ${onRowClick ? 'cursor-pointer' : ''}
                          `}
                          style={
                            index % 2 === 0
                              ? {
                                  backgroundColor: `${primaryColor}10`,
                                  borderColor: `${primaryColor}70`,
                                }
                              : { borderColor: `${primaryColor}70` }
                          }
                          onClick={() => handleRowClick(row)}
                        >
                          {row.getVisibleCells().map((cell, cellIndex) => (
                            <td
                              key={cell.id}
                              className={`p-2 text-xs align-middle [&:has([role=checkbox])]:pr-0 border-r border-border ${
                                cellIndex === row.getVisibleCells().length - 1
                                  ? 'border-r-0'
                                  : ''
                              }`}
                              style={{ borderColor: `${primaryColor}70` }}
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </td>
                          ))}
                        </tr>

                        {shouldRenderExpandedRow && (
                          <tr className="bg-muted/30 border-b border-border">
                            <td
                              colSpan={row.getVisibleCells().length}
                              className="p-2"
                            >
                              {renderExpandedRow?.(row)}
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="h-24 text-center border-b border-border"
                    >
                      {emptyMessage}
                    </td>
                  </tr>
                )}
              </tbody>
              {table
                .getFooterGroups()
                .some(footerGroup =>
                  footerGroup.headers.some(
                    footer =>
                      !footer.isPlaceholder && footer.column.columnDef.footer
                  )
                ) && (
                <tfoot className="bg-slate-50 dark:bg-slate-800 font-semibold">
                  {table.getFooterGroups().map(footerGroup => (
                    <tr key={footerGroup.id} className="border-t border-border">
                      {footerGroup.headers.map((footer, footerIndex) => (
                        <td
                          key={footer.id}
                          className={`p-2 text-xs align-middle border-r border-border ${
                            footerIndex === footerGroup.headers.length - 1
                              ? 'border-r-0'
                              : ''
                          }`}
                          style={{
                            width: footer.getSize(),
                          }}
                        >
                          {footer.isPlaceholder
                            ? null
                            : flexRender(
                                footer.column.columnDef.footer,
                                footer.getContext()
                              )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tfoot>
              )}
            </table>
            {/* Footer Content */}
            {footerContent}
          </div>
        </div>

        {/* Pagination */}
        {enablePagination && !hideFooter && (
          <div className="flex flex-col gap-3 border-t border-border  rounded-b-md px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm font-medium text-muted-foreground">
              {renderPaginationInfo()}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6 lg:gap-8">
              <div className="flex items-center justify-between gap-2 sm:justify-start">
                <p className="hidden text-sm font-medium md:block">
                  Rows per page
                </p>
                <select
                  value={table.getState().pagination.pageSize}
                  onChange={e => {
                    const newPageSize = Number(e.target.value);
                    table.setPageSize(newPageSize);
                  }}
                  className="h-8 w-[70px] rounded border border-input bg-background px-2 text-sm"
                >
                  {pageSizeOptions.map(size => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                  aria-label="First page"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center space-x-1">
                  <span className="text-sm font-medium">
                    Page {table.getState().pagination.pageIndex + 1} of{' '}
                    {enableServerSidePagination
                      ? resolvedServerPageCount
                      : table.getPageCount()}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                  aria-label="Last page"
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TanStackTable;
