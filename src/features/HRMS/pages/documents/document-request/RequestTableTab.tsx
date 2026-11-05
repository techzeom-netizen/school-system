import type { ReactNode } from 'react';
import type { ColumnDef } from '@tanstack/react-table';

import { TanStackTable } from '@/components/common';

export interface RequestTableTabProps<TData extends { id: string }> {
  data: TData[];
  columns: ColumnDef<TData>[];
  customFilters: ReactNode;
  emptyMessage: string;
}

const RequestTableTab = <TData extends { id: string }>({
  data,
  columns,
  customFilters,
  emptyMessage,
}: RequestTableTabProps<TData>) => (
  <TanStackTable
    data={data}
    columns={columns}
    showDownload={true}
    enableSearch={false}
    enableColumnVisibility={false}
    enablePagination
    pageSize={8}
    pageSizeOptions={[8, 10, 20]}
    getRowId={row => row.id}
    emptyMessage={emptyMessage}
    customFilters={customFilters}
  />
);

export default RequestTableTab;
