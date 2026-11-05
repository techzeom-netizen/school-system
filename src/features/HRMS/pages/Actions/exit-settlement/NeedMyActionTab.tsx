import { CheckCircle2, Mail, Wallet } from 'lucide-react';
import { ActionRow, GroupHeading } from './exitSettlementShared';
import { formatLakhs } from './exitSettlementUtils';
import type { ExitRecord } from '@/data/reusableDropdownData';

interface NeedMyActionTabProps {
  resignations: ExitRecord[];
  payments: ExitRecord[];
  paymentsTotal: number;
  onReview: (record: ExitRecord) => void;
  onPay: (record: ExitRecord) => void;
}

const NeedMyActionTab = ({
  resignations,
  payments,
  paymentsTotal,
  onReview,
  onPay,
}: NeedMyActionTabProps) => {
  const actionCount = resignations.length + payments.length;

  if (actionCount === 0) {
    return (
      <p className="flex items-center gap-2 py-6 text-sm text-muted-foreground">
        <CheckCircle2 className="h-5 w-5 text-primary" aria-hidden="true" />
        You are all caught up. New resignations and final payments will show up
        here.
      </p>
    );
  }

  return (
    <div className="space-y-8">
      {resignations.length > 0 && (
        <section>
          <GroupHeading
            icon={Mail}
            title="Resignations to accept"
            note={`${resignations.length} ${resignations.length === 1 ? 'employee' : 'employees'}`}
            tone="bg-secondary text-secondary-foreground"
          />
          <div className="divide-y divide-border">
            {resignations.map(record => (
              <ActionRow
                key={record.id}
                record={record}
                buttonText="Review"
                onClick={() => onReview(record)}
              />
            ))}
          </div>
        </section>
      )}

      {payments.length > 0 && (
        <section>
          <GroupHeading
            icon={Wallet}
            title="Final payments to approve"
            note={`${payments.length} ${payments.length === 1 ? 'employee' : 'employees'} · ${formatLakhs(paymentsTotal)} in total`}
            tone="bg-primary/10 text-primary"
          />
          <div className="divide-y divide-border">
            {payments.map(record => (
              <ActionRow
                key={record.id}
                record={record}
                buttonText="Approve and pay"
                onClick={() => onPay(record)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default NeedMyActionTab;
