import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { visibleCount, type PayslipRecord } from './payslipUtils';
import { PayslipRow } from './payslipShared';

interface ReadyToSendTabProps {
  records: PayslipRecord[];
  totalReady: number;
  filteredCount: number;
  showAll: boolean;
  onToggleShowAll: () => void;
  onPreview: (record: PayslipRecord) => void;
  onSend: (record: PayslipRecord) => void;
}

const ReadyToSendTab = ({
  records,
  totalReady,
  filteredCount,
  showAll,
  onToggleShowAll,
  onPreview,
  onSend,
}: ReadyToSendTabProps) => (
  <div className="space-y-2">
    {totalReady === 0 ? (
      <p className="flex items-center gap-2 py-8 text-sm text-muted-foreground">
        <CheckCircle2 className="h-5 w-5 text-primary" aria-hidden="true" />
        No payslip is waiting to be sent.
      </p>
    ) : filteredCount === 0 ? (
      <p className="py-8 text-sm text-muted-foreground">
        No employee matches this search.
      </p>
    ) : (
      <div className="divide-y divide-border">
        {records.map(record => (
          <PayslipRow
            key={record.id}
            record={record}
            onOpen={() => onPreview(record)}
            onAction={() => onSend(record)}
          />
        ))}
      </div>
    )}

    {filteredCount > visibleCount && (
      <div className="flex justify-center pt-2">
        <Button type="button" variant="outline" onClick={onToggleShowAll}>
          {showAll ? 'Show less' : `Show ${filteredCount - visibleCount} more`}
        </Button>
      </div>
    )}
  </div>
);

export default ReadyToSendTab;
