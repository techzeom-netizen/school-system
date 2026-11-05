import type { ReactNode } from 'react';
import { Check, type LucideIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  type LeavePolicy,
  getMissingLeaves,
  getTiles,
  getYearlyDays,
  maxRulesShown,
  pluralize,
  statusBadgeClass,
  statusLabels,
} from './leavePolicyData';
export const SummaryStat = ({
  label,
  value,
  help,
  children,
  tone = 'default',
}: {
  label: string;
  value: string | number;
  help: string;
  children?: ReactNode;
  tone?: 'default' | 'warning' | 'success';
}) => {
  const toneClass = {
    default: 'border-border',
    warning: 'border-border bg-muted text-card-foreground',
    success: 'border-primary/30 bg-primary/10 text-card-foreground',
  }[tone];
  const valueClass = {
    default: 'text-card-foreground',
    warning: 'text-foreground',
    success: 'text-primary',
  }[tone];

  return (
    <Card className={`space-y-1.5 p-5 ${toneClass}`}>
      <p className="text-sm font-medium opacity-80">{label}</p>
      <p className={`text-3xl font-semibold ${valueClass}`}>{value}</p>
      <p className="text-sm opacity-80">{help}</p>
      {children}
    </Card>
  );
};

export const CommonRuleItem = ({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) => (
  <div className="flex items-center gap-4">
    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
      <Icon className="h-5 w-5" aria-hidden="true" />
    </span>
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-semibold text-foreground">{value}</p>
    </div>
  </div>
);

export const PolicyCard = ({
  policy,
  onEdit,
  onDuplicate,
  onPublish,
  onRestore,
}: {
  policy: LeavePolicy;
  onEdit: () => void;
  onDuplicate: () => void;
  onPublish: () => void;
  onRestore: () => void;
}) => {
  const tiles = getTiles(policy);
  const missing = getMissingLeaves(policy);
  const yearlyDays = getYearlyDays(policy);
  const extraRules = policy.rules.length - maxRulesShown;

  return (
    <Card
      className={`flex flex-col gap-5 p-6 ${
        policy.status === 'draft' ? 'border-border bg-muted/40' : ''
      }`}
    >
      <div className="space-y-1.5">
        <div className="flex items-start gap-3">
          <h3 className="flex-1 text-lg font-semibold text-foreground">
            {policy.name}
          </h3>
          <Badge
            className={`border-transparent ${statusBadgeClass[policy.status]}`}
          >
            {statusLabels[policy.status]}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{policy.audience}</p>
        {yearlyDays > 0 && (
          <p className="text-sm font-semibold text-foreground">
            {yearlyDays} days a year
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {tiles.map(tile => (
          <div
            key={tile.key}
            className={`space-y-0.5 rounded-2xl p-4 ${tile.classes}`}
          >
            <p
              className={`font-semibold ${tile.isWord ? 'text-xl' : 'text-3xl'}`}
            >
              {tile.value}
            </p>
            <p className="text-sm font-medium">{tile.label}</p>
          </div>
        ))}
      </div>

      {missing.length > 0 && (
        <p className="rounded-xl bg-muted px-3.5 py-2.5 text-sm text-muted-foreground">
          Not included: {missing.join(', ')}
        </p>
      )}

      <ul className="space-y-2.5">
        {policy.rules.slice(0, maxRulesShown).map(rule => (
          <li key={rule} className="flex items-start gap-2.5 text-sm">
            <Check
              className="mt-0.5 h-4 w-4 shrink-0 text-primary"
              aria-hidden="true"
            />
            <span className="text-foreground">{rule}</span>
          </li>
        ))}
        {extraRules > 0 && (
          <li className="pl-[1.625rem] text-xs text-muted-foreground">
            +{extraRules} more {pluralize(extraRules, 'rule')}. Open Edit to see
            them.
          </li>
        )}
      </ul>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
        <p className="text-sm text-muted-foreground">
          {policy.status === 'draft' && (
            <span className="font-medium text-muted-foreground">
              Not live yet
            </span>
          )}
          {policy.status === 'archived' && <span>Archived</span>}
          {policy.status === 'active' && policy.isAddOn && (
            <>
              <span className="font-semibold text-foreground">
                {policy.onLeaveNow}
              </span>{' '}
              on leave now
            </>
          )}
          {policy.status === 'active' && !policy.isAddOn && (
            <>
              <span className="font-semibold text-foreground">
                {policy.employeeCount}
              </span>{' '}
              {pluralize(policy.employeeCount, 'employee')}
            </>
          )}
        </p>

        <div className="flex items-center gap-2">
          {policy.status !== 'draft' && (
            <Button type="button" variant="default" onClick={onDuplicate}>
              Duplicate
            </Button>
          )}
          {policy.status !== 'archived' && (
            <Button type="button" variant="success" onClick={onEdit}>
              Edit
            </Button>
          )}
          {policy.status === 'draft' && (
            <Button type="button" onClick={onPublish}>
              Publish
            </Button>
          )}
          {policy.status === 'archived' && (
            <Button type="button" variant="outline" onClick={onRestore}>
              Restore
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
