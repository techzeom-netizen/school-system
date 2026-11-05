import type { ApprovalRequest } from './approvalInboxUtils';
import { DecidedRequestsTable } from './approvalInboxShared';

const ApprovedTab = ({ records }: { records: ApprovalRequest[] }) => (
  <DecidedRequestsTable
    records={records}
    emptyMessage="No request has been approved yet."
  />
);

export default ApprovedTab;
