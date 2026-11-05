import { Check, CheckCircle2 } from 'lucide-react';
import FormField from '@/components/common/FormField';
import { Button } from '@/components/ui/button';
import {
  describeWaiting,
  formatDate,
  getDaysWaiting,
  overdueAfterDays,
  type ApprovalRequest,
} from './approvalInboxUtils';
import { EmployeeCell, RequestCell } from './approvalInboxShared';

interface NeedMyApprovalTabProps {
  records: ApprovalRequest[];
  pendingCount: number;
  selectedIds: string[];
  selectedCount: number;
  allSelected: boolean;
  onToggleSelectAll: () => void;
  onToggleSelect: (id: string) => void;
  onApproveSelected: () => void;
  onReview: (record: ApprovalRequest) => void;
  onApprove: (record: ApprovalRequest) => void;
}

const NeedMyApprovalTab = ({
  records,
  pendingCount,
  selectedIds,
  selectedCount,
  allSelected,
  onToggleSelectAll,
  onToggleSelect,
  onApproveSelected,
  onReview,
  onApprove,
}: NeedMyApprovalTabProps) => {
  if (records.length === 0) {
    return (
      <p className="flex items-center gap-2 py-6 text-sm text-muted-foreground">
        <CheckCircle2 className="h-5 w-5 text-primary" aria-hidden="true" />
        {pendingCount === 0
          ? 'You are all caught up. New requests will show up here.'
          : 'No requests match your search.'}
      </p>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-md bg-muted/50 px-4 py-2">
        <FormField
          label={selectedCount > 0 ? `${selectedCount} selected` : 'Select all'}
          name="approval-select-all"
          type="checkbox"
          value={allSelected}
          onCheckboxChange={onToggleSelectAll}
        />
        <Button
          type="button"
          size="sm"
          disabled={selectedCount === 0}
          onClick={onApproveSelected}
        >
          <Check className="h-4 w-4" /> Approve selected
        </Button>
      </div>

      <div className="divide-y divide-border">
        {records.map(record => (
          <RequestRow
            key={record.id}
            record={record}
            isSelected={selectedIds.includes(record.id)}
            onSelect={() => onToggleSelect(record.id)}
            onReview={() => onReview(record)}
            onApprove={() => onApprove(record)}
          />
        ))}
      </div>
    </div>
  );
};

const RequestRow = ({
  record,
  isSelected,
  onSelect,
  onReview,
  onApprove,
}: {
  record: ApprovalRequest;
  isSelected: boolean;
  onSelect: () => void;
  onReview: () => void;
  onApprove: () => void;
}) => {
  const waiting = getDaysWaiting(record.submittedOn);

  return (
    <div className="grid grid-cols-1 items-center gap-3 py-4 md:grid-cols-5 md:gap-5">
      <FormField
        label={`Select ${record.name}'s request`}
        name={`approval-select-${record.id}`}
        type="checkbox"
        value={isSelected}
        onCheckboxChange={onSelect}
      />
      <EmployeeCell record={record} />
      <RequestCell record={record} />
      <div>
        <p className="text-sm font-medium text-foreground">
          {formatDate(record.submittedOn)}
        </p>
        <p
          className={`text-xs ${
            waiting > overdueAfterDays
              ? 'font-semibold text-destructive'
              : 'text-muted-foreground'
          }`}
        >
          {describeWaiting(waiting)}
        </p>
      </div>
      <div className="flex gap-2">
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="flex-1"
          onClick={onReview}
        >
          Review
        </Button>
        <Button type="button" size="sm" className="flex-1" onClick={onApprove}>
          <Check className="h-4 w-4" /> Approve
        </Button>
      </div>
    </div>
  );
};

export default NeedMyApprovalTab;
