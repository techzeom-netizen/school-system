import type { ApprovalRequest } from './approvalInboxUtils';
import { DecidedRequestsTable } from './approvalInboxShared';

const RejectedTab = ({ records }: { records: ApprovalRequest[] }) => (
  <DecidedRequestsTable
    records={records}
    emptyMessage="No request has been rejected."
  />
);

export default RejectedTab;
