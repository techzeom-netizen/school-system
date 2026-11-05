import { TanStackTable } from '@/components/common';
import type { TaxDeclarationTabProps } from './taxDeclarationTypes';

const NotSubmittedTab = ({ rows, columns }: TaxDeclarationTabProps) => (
  <TanStackTable
    data={rows}
    columns={columns}
    getRowId={row => row.id}
    enableSearch={false}
    enableSorting={false}
    showDownload={true}
    enablePagination
    pageSize={8}
    pageSizeOptions={[8, 16, 32]}
    emptyMessage="No unsubmitted declarations match your search."
  />
);

export default NotSubmittedTab;
