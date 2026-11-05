import { TanStackTable } from '@/components/common';
import type { TaxDeclarationTabProps } from './taxDeclarationTypes';

const WaitingForReviewTab = ({ rows, columns }: TaxDeclarationTabProps) => (
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
    emptyMessage="No declarations are waiting for review."
  />
);

export default WaitingForReviewTab;
