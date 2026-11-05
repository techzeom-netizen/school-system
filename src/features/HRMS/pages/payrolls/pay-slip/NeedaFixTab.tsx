import { visibleCount, type PayslipRecord } from './payslipUtils';
import { PayslipRow } from './payslipShared';
import { Button } from '@/components/ui/button';

interface NeedaFixTabProps {
  records: PayslipRecord[];
  totalNeedingFix: number;
  filteredCount: number;
  showAll: boolean;
  onToggleShowAll: () => void;
  onPreview: (record: PayslipRecord) => void;
  onFix: (record: PayslipRecord) => void;
}

const NeedaFixTab = ({
  records,
  totalNeedingFix,
  filteredCount,
  showAll,
  onToggleShowAll,
  onPreview,
  onFix,
}: NeedaFixTabProps) => (
  <div className="space-y-2">
    {totalNeedingFix === 0 ? (
      <p className="py-8 text-sm text-muted-foreground">Nothing needs a fix.</p>
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
            onAction={() => onFix(record)}
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

export default NeedaFixTab;
