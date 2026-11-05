import { Button } from '@/components/ui/button';
import {
  fixReasons,
  formatCurrency,
  getNet,
  type PayslipRecord,
} from './payslipUtils';

export const PersonCell = ({
  record,
  onOpen,
}: {
  record: PayslipRecord;
  onOpen?: () => void;
}) => (
  <div className="flex min-w-44 items-center gap-3">
    <span
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary"
      aria-hidden="true"
    >
      {record.name
        .split(' ')
        .map(part => part.charAt(0))
        .slice(0, 2)
        .join('')
        .toUpperCase()}
    </span>
    <div className="min-w-0">
      {onOpen ? (
        <Button
          type="button"
          variant="link"
          onClick={onOpen}
          className="h-auto justify-start p-0 text-left font-semibold text-foreground"
        >
          {record.name}
        </Button>
      ) : (
        <p className="font-semibold text-foreground">{record.name}</p>
      )}
      <p className="text-xs text-muted-foreground">{record.department}</p>
    </div>
  </div>
);

export const PayslipRow = ({
  record,
  onOpen,
  onAction,
}: {
  record: PayslipRecord;
  onOpen: () => void;
  onAction: () => void;
}) => {
  const isReady = record.status === 'ready';
  const reason = record.fixReason ? fixReasons[record.fixReason] : null;

  return (
    <div className="grid items-center gap-3 py-4 md:grid-cols-3 md:gap-5">
      <PersonCell record={record} onOpen={onOpen} />
      <div className="min-w-0">
        {isReady ? (
          <>
            <p className="text-base font-bold text-foreground">
              {formatCurrency(getNet(record))}
            </p>
            <p className="text-xs text-muted-foreground">Take-home pay</p>
          </>
        ) : (
          <>
            <p className="font-semibold text-foreground">{reason?.label}</p>
            <p className="text-xs text-muted-foreground">{reason?.hint}</p>
          </>
        )}
      </div>
      <Button
        type="button"
        variant={isReady ? 'default' : 'success'}
        className="w-fit justify-self-end whitespace-nowrap"
        onClick={onAction}
      >
        {isReady ? 'Send payslip' : 'Fix this'}
      </Button>
    </div>
  );
};
