import { TanStackTable } from '@/components/common';
import type { TaxDeclarationTabProps } from './taxDeclarationTypes';

const ApprovedTab = ({ rows, columns }: TaxDeclarationTabProps) => (
  <TanStackTable
    data={rows}
    columns={columns}
    getRowId={row => row.id}
    enableSearch={false}
    showDownload={true}
    enableSorting={false}
    enablePagination
    pageSize={8}
    pageSizeOptions={[8, 16, 32]}
    emptyMessage="No approved declarations match your search."
  />
);

export default ApprovedTab;
