import { Minus, Plus, type LucideIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export interface Rule {
  id:
    | 'grace'
    | 'halfDay'
    | 'overtime'
    | 'rest'
    | 'nightAllowance'
    | 'daysInRow';
  title: string;
  icon: LucideIcon;
  before: string;
  after: string;
  prefix: string;
  unit: string;
  value: number;
  step: number;
  min: number;
  max: number;
  isOn: boolean;
  defaultValue: number;
  defaultOn: boolean;
}

interface RulesTabProps {
  rules: Rule[];
  rulesOnCount: number;
  onReset: () => void;
  onToggle: (rule: Rule) => void;
  onStep: (rule: Rule, direction: 1 | -1) => void;
}

const formatClock = (totalMinutes: number) => {
  const minutes = ((totalMinutes % 1440) + 1440) % 1440;
  const hours = Math.floor(minutes / 60);
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  const paddedMinutes = String(minutes % 60).padStart(2, '0');
  return `${hour12}:${paddedMinutes} ${hours >= 12 ? 'PM' : 'AM'}`;
};

const formatMoney = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

const getRuleValueText = (rule: Rule) =>
  `${rule.prefix}${rule.value}${rule.unit ? ` ${rule.unit}` : ''}`;

const getRuleExample = (rule: Rule) => {
  switch (rule.id) {
    case 'grace':
      return `for a 9:00 AM shift, checking in until ${formatClock(9 * 60 + rule.value)} is on time.`;
    case 'halfDay':
      return `working ${Math.max(rule.value - 1, 0)} hrs counts as a half day, and ${rule.value} hrs or more is a full day.`;
    case 'overtime':
      return `a 10-hr day gives ${Math.max(10 - rule.value, 0)} hrs of overtime.`;
    case 'rest':
      return `after a Night shift ends at 6:00 AM, the next shift can start at ${formatClock((6 + rule.value) * 60)} or later.`;
    case 'nightAllowance':
      return `5 night shifts in a week add ${formatMoney(5 * rule.value)}.`;
    default:
      return `after ${rule.value} working days, the next day must be a day off.`;
  }
};

const RuleSwitch = ({
  isOn,
  label,
  onToggle,
}: {
  isOn: boolean;
  label: string;
  onToggle: () => void;
}) => (
  <Button
    type="button"
    role="switch"
    aria-checked={isOn}
    aria-label={label}
    variant="ghost"
    onClick={onToggle}
    className={`relative h-5 w-10 min-w-10 shrink-0 rounded-full p-0 transition-colors hover:text-inherit focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
      isOn
        ? 'bg-primary hover:bg-primary/90'
        : 'bg-muted hover:bg-muted-foreground/20'
    }`}
  >
    <span
      className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-background shadow transition-transform ${isOn ? 'translate-x-5' : ''}`}
    />
  </Button>
);

const RuleCard = ({
  rule,
  onToggle,
  onStep,
}: {
  rule: Rule;
  onToggle: () => void;
  onStep: (direction: 1 | -1) => void;
}) => {
  const Icon = rule.icon;
  const valueText = getRuleValueText(rule);

  return (
    <Card className="space-y-4 p-6">
      <div className="flex items-center gap-3.5">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <h3 className="flex-1 text-base font-semibold text-foreground">
          {rule.title}
        </h3>
        <RuleSwitch
          isOn={rule.isOn}
          label={`${rule.title} is on`}
          onToggle={onToggle}
        />
      </div>

      <div className={`space-y-4 ${rule.isOn ? '' : 'opacity-50'}`}>
        <p className="text-sm text-muted-foreground">
          {rule.before}
          <span className="font-semibold text-foreground">{valueText}</span>
          {rule.after}
        </p>
        <div className="flex items-center justify-between gap-3 rounded-xl bg-muted/50 p-2.5">
          <span className="pl-1 text-xs font-medium">Change value</span>
          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              variant="default"
              className="h-5 w-5 rounded-lg text-lg"
              aria-label={`Decrease ${rule.title}`}
              disabled={!rule.isOn || rule.value <= rule.min}
              onClick={() => onStep(-1)}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="min-w-20 text-center text-base font-semibold text-foreground">
              {valueText}
            </span>
            <Button
              type="button"
              variant="default"
              className="h-5 w-5 rounded-lg text-lg"
              aria-label={`Increase ${rule.title}`}
              disabled={!rule.isOn || rule.value >= rule.max}
              onClick={() => onStep(1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">Example:</span>{' '}
          {getRuleExample(rule)}
        </p>
      </div>
    </Card>
  );
};

const RulesTab = ({
  rules,
  rulesOnCount,
  onReset,
  onToggle,
  onStep,
}: RulesTabProps) => (
  <div className="space-y-6">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="space-y-1">
        <h3 className="text-xl font-semibold text-foreground">Shift rules</h3>
        <p className="text-sm text-muted-foreground">
          {rules.length} rules · {rulesOnCount} turned on. Schedules are checked
          against them automatically.
        </p>
      </div>
      <Button type="button" variant="outline" onClick={onReset}>
        Reset to recommended
      </Button>
    </div>
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {rules.map(rule => (
        <RuleCard
          key={rule.id}
          rule={rule}
          onToggle={() => onToggle(rule)}
          onStep={direction => onStep(rule, direction)}
        />
      ))}
    </div>
  </div>
);

export default RulesTab;
