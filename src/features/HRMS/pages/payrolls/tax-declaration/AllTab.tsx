import { TanStackTable } from '@/components/common';
import type { TaxDeclarationTabProps } from './taxDeclarationTypes';

const AllTab = ({ rows, columns }: TaxDeclarationTabProps) => (
  <TanStackTable
    data={rows}
    columns={columns}
    showDownload={true}
    getRowId={row => row.id}
    enableSearch={false}
    enableSorting={false}
    enablePagination
    pageSize={8}
    pageSizeOptions={[8, 16, 32]}
    emptyMessage="No employees match your search."
  />
);

export default AllTab;
