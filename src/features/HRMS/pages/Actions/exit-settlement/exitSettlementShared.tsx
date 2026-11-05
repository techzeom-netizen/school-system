import type { LucideIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  describeDaysLeft,
  formatDate,
  formatMoney,
  getInitials,
  getTone,
  stageLabels,
  stageTones,
  todayIso,
} from './exitSettlementUtils';
import {
  getSettlementNet,
  type ExitRecord,
  type ExitStage,
} from '@/data/reusableDropdownData';

export const EmployeeCell = ({ record }: { record: ExitRecord }) => (
  <div className="flex min-w-48 items-center gap-3">
    <span
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${getTone(record.id)}`}
      aria-hidden="true"
    >
      {getInitials(record.name)}
    </span>
    <div className="min-w-0">
      <p className="font-semibold text-foreground">{record.name}</p>
      <p className="text-xs text-muted-foreground">
        {record.department} · {record.position}
      </p>
    </div>
  </div>
);

export const StageBadge = ({ stage }: { stage: ExitStage }) => (
  <Badge
    variant="secondary"
    className={`whitespace-nowrap ${stageTones[stage]}`}
  >
    {stageLabels[stage]}
  </Badge>
);

export const GroupHeading = ({
  icon: Icon,
  title,
  note,
  tone,
}: {
  icon: LucideIcon;
  title: string;
  note: string;
  tone: string;
}) => (
  <div className="flex flex-wrap items-center gap-3">
    <span
      className={`flex h-9 w-9 items-center justify-center rounded-lg ${tone}`}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
    </span>
    <h3 className="text-lg font-semibold text-card-foreground">{title}</h3>
    <span className="text-sm text-muted-foreground">{note}</span>
  </div>
);

export const ActionRow = ({
  record,
  buttonText,
  onClick,
}: {
  record: ExitRecord;
  buttonText: string;
  onClick: () => void;
}) => {
  const isPayment = record.stage === 'settlement';
  const netAmount = getSettlementNet(record.settlement);

  return (
    <div className="grid items-center gap-3 py-4 sm:grid-cols-2 xl:grid-cols-4">
      <EmployeeCell record={record} />
      <div>
        <p className="text-sm font-semibold text-foreground">
          {formatDate(record.lastWorkingDay)}
        </p>
        <p className="text-xs text-muted-foreground">
          Last working day · {describeDaysLeft(record.lastWorkingDay)}
        </p>
      </div>
      <div className="space-y-1">
        <StageBadge stage={record.stage} />
        <p className="text-xs text-muted-foreground">
          {isPayment
            ? netAmount > 0
              ? `Final amount ${formatMoney(netAmount)}`
              : 'Amount not ready yet'
            : `Submitted ${
                record.resignedOn === todayIso()
                  ? 'today'
                  : `on ${formatDate(record.resignedOn)}`
              }`}
        </p>
      </div>
      <Button type="button" className="w-fit px-3" onClick={onClick}>
        {buttonText}
      </Button>
    </div>
  );
};
