import {
  type FormEvent,
  type ReactNode,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Check,
  CreditCard,
  Headphones,
  Laptop,
  Monitor,
  Plus,
  Smartphone,
  type LucideIcon,
} from 'lucide-react';
import { toast } from 'sonner';

import FormField from '@/components/common/FormField';
import Section from '@/components/common/Section';
import {
  initialAssetReturns,
  returnableAssets,
  returnAssetTypeLabels,
  returnBucketLabels,
  returnConditionOptions,
  returnModeOptions,
  returnReasonFilterOptions,
  returnReasonOptions,
  returnStepLabels,
  returnTabOptions,
  type AssetReturnItem,
  type ReturnAssetType,
  type ReturnBucket,
  type ReturnCondition,
  type ReturnMode,
  type ReturnReason,
  type ReturnTab,
} from '@/data/reusableDropdownData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const inventoryPath = '/assets-management/assets-inventory';

const typeIcons: Record<ReturnAssetType, LucideIcon> = {
  laptop: Laptop,
  mobile: Smartphone,
  monitor: Monitor,
  headset: Headphones,
  card: CreditCard,
};

const bucketBadgeClass: Record<ReturnBucket, string> = {
  overdue: 'bg-destructive/10 text-destructive',
  requested: 'bg-accent text-accent-foreground',
  handed: 'bg-primary/10 text-primary',
  checked: 'bg-secondary text-secondary-foreground',
  closed: 'bg-muted text-muted-foreground',
};

const bucketDotClass: Record<ReturnBucket, string> = {
  overdue: 'bg-destructive',
  requested: 'bg-accent-foreground',
  handed: 'bg-primary',
  checked: 'bg-secondary-foreground',
  closed: 'bg-muted-foreground',
};

const nextStepBoxClass: Record<ReturnBucket, string> = {
  overdue: 'border-destructive/30 bg-destructive/10',
  requested: 'border-border bg-muted',
  handed: 'border-primary/20 bg-primary/5 dark:bg-primary/10',
  checked: 'border-border bg-secondary',
  closed: 'border-border bg-muted',
};

const nextStepLabelClass: Record<ReturnBucket, string> = {
  overdue: 'text-destructive',
  requested: 'text-accent-foreground',
  handed: 'text-primary',
  checked: 'text-secondary-foreground',
  closed: 'text-foreground',
};

const conditionBadgeClass: Record<ReturnCondition, string> = {
  Good: 'bg-primary/10 text-primary',
  'Minor damage': 'bg-accent text-accent-foreground',
  Damaged: 'bg-destructive/10 text-destructive',
};

const avatarClasses = [
  'bg-primary/10 text-primary',
  'bg-secondary text-secondary-foreground',
  'bg-accent text-accent-foreground',
  'bg-muted text-muted-foreground',
  'bg-primary/10 text-primary',
];

const minDetailLength = 10;

const formatDate = (date: string) =>
  new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${date}T00:00:00`));

const formatShortDate = (date: string) =>
  new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
  }).format(new Date(`${date}T00:00:00`));

const todayIso = () => new Date().toLocaleDateString('en-CA');

const dateOffset = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toLocaleDateString('en-CA');
};

const daysLate = (date: string) => {
  const today = new Date(`${todayIso()}T00:00:00`).getTime();
  const target = new Date(`${date}T00:00:00`).getTime();
  return Math.round((today - target) / 86_400_000);
};

const getBucket = (item: AssetReturnItem): ReturnBucket => {
  if (item.stage === 0) {
    return daysLate(item.returnBy) > 0 ? 'overdue' : 'requested';
  }
  if (item.stage === 1) return 'handed';
  if (item.stage === 2) return 'checked';
  return 'closed';
};

const getTab = (item: AssetReturnItem): ReturnTab => {
  const bucket = getBucket(item);
  if (bucket === 'requested') return 'waiting';
  if (bucket === 'closed') return 'closed';
  return 'action';
};

const getFirstName = (name: string) => name.split(' ')[0];

const getInitials = (name: string) =>
  name
    .split(' ')
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

const getAvatarClass = (name: string) => {
  const sum = Array.from(name).reduce(
    (total, char) => total + char.charCodeAt(0),
    0
  );
  return avatarClasses[sum % avatarClasses.length];
};

const getNextStep = (
  item: AssetReturnItem,
  bucket: ReturnBucket
): { title: string; help: string; primary: string | null } => {
  const firstName = getFirstName(item.person);
  const late = daysLate(item.returnBy);

  switch (bucket) {
    case 'overdue':
      return {
        title: `Follow up with ${firstName}`,
        help: `This was due ${late} ${
          late === 1 ? 'day' : 'days'
        } ago. Send a reminder, or mark it received if it is already back.`,
        primary: 'Mark received',
      };
    case 'requested':
      return {
        title: `Waiting for ${firstName} to hand it over`,
        help: `They have until ${formatDate(
          item.returnBy
        )}. Mark it received as soon as it arrives.`,
        primary: 'Mark received',
      };
    case 'handed':
      return {
        title: 'Check the condition',
        help: 'Look for damage or missing parts, then record what you find.',
        primary: 'Check condition',
      };
    case 'checked':
      return {
        title: 'Ready to close',
        help: `Condition is recorded as ${
          item.condition ?? 'Good'
        }. Closing puts the asset back in inventory.`,
        primary: 'Close return',
      };
    default:
      return {
        title: 'All done',
        help: 'This return is closed and the asset has been updated in inventory.',
        primary: null,
      };
  }
};

const isCondition = (value: string): value is ReturnCondition =>
  returnConditionOptions.some(option => option.value === value);

const isReason = (value: string): value is ReturnReason =>
  returnReasonOptions.some(option => option.value === value);

const isMode = (value: string): value is ReturnMode =>
  returnModeOptions.some(option => option.value === value);

const ReturnBucketBadge = ({ bucket }: { bucket: ReturnBucket }) => (
  <Badge className={`gap-2 border-transparent ${bucketBadgeClass[bucket]}`}>
    <span
      className={`h-2 w-2 shrink-0 rounded-full ${bucketDotClass[bucket]}`}
      aria-hidden="true"
    />
    {returnBucketLabels[bucket]}
  </Badge>
);

const InfoRow = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => (
  <div className="flex items-center justify-between gap-4 border-b border-border py-3 text-sm last:border-b-0">
    <span className="font-semibold">{label}</span>
    <span className="text-right  text-muted-foreground ">{children}</span>
  </div>
);

const ReturnRecoveryPage = () => {
  const [returns, setReturns] = useState(initialAssetReturns);
  const [tab, setTab] = useState<ReturnTab>('action');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [reasonFilter, setReasonFilter] = useState('all');
  const returnSequence = useRef(initialAssetReturns.length);

  const [conditionId, setConditionId] = useState<string | null>(null);
  const [conditionValue, setConditionValue] = useState<ReturnCondition>('Good');
  const [conditionNote, setConditionNote] = useState('');

  const [isStartOpen, setIsStartOpen] = useState(false);
  const [startAssetId, setStartAssetId] = useState('');
  const [startReason, setStartReason] = useState<ReturnReason>('Upgrade');
  const [startReturnBy, setStartReturnBy] = useState(dateOffset(3));
  const [startMode, setStartMode] = useState<ReturnMode>(
    'Hand over to IT desk'
  );

  const conditionItem = returns.find(item => item.id === conditionId) ?? null;

  const tabCounts: Record<ReturnTab, number> = {
    action: returns.filter(item => getTab(item) === 'action').length,
    waiting: returns.filter(item => getTab(item) === 'waiting').length,
    closed: returns.filter(item => getTab(item) === 'closed').length,
    all: returns.length,
  };

  const visibleReturns = useMemo(() => {
    const term = search.trim().toLowerCase();
    return returns.filter(item => {
      if (tab !== 'all' && getTab(item) !== tab) return false;
      if (reasonFilter !== 'all' && item.reason !== reasonFilter) return false;
      if (!term) return true;
      return [item.name, item.tag, item.person].some(value =>
        value.toLowerCase().includes(term)
      );
    });
  }, [returns, tab, reasonFilter, search]);

  const selected =
    visibleReturns.find(item => item.id === selectedId) ??
    visibleReturns[0] ??
    null;
  const selectedBucket = selected ? getBucket(selected) : null;
  const nextStep =
    selected && selectedBucket ? getNextStep(selected, selectedBucket) : null;

  const availableAssetOptions = returnableAssets
    .filter(asset => !returns.some(item => item.tag === asset.tag))
    .map(asset => ({
      label: `${asset.name} (${asset.tag}) - ${asset.person}`,
      value: asset.id,
    }));

  const updateReturn = (
    id: string,
    change: (item: AssetReturnItem) => AssetReturnItem
  ) =>
    setReturns(current =>
      current.map(item => (item.id === id ? change(item) : item))
    );

  const openConditionDialog = (item: AssetReturnItem) => {
    setConditionValue('Good');
    setConditionNote('');
    setConditionId(item.id);
  };

  const openStartDialog = () => {
    const firstOption = availableAssetOptions[0];
    if (!firstOption) {
      toast.error('Every assigned asset already has a return in progress.');
      return;
    }
    setStartAssetId(firstOption.value);
    setStartReason('Upgrade');
    setStartReturnBy(dateOffset(3));
    setStartMode('Hand over to IT desk');
    setIsStartOpen(true);
  };

  const closeStartDialog = () => setIsStartOpen(false);

  const handleMarkReceived = (item: AssetReturnItem) => {
    updateReturn(item.id, current => ({ ...current, stage: 1 }));
    toast.success(`${item.name} marked as received from ${item.person}.`);
  };

  const handleCloseReturn = (item: AssetReturnItem) => {
    updateReturn(item.id, current => ({ ...current, stage: 3 }));
    toast.success(
      item.condition === 'Damaged'
        ? `Return closed. ${item.name} is back in inventory, marked as damaged.`
        : `Return closed. ${item.name} is back in inventory.`
    );
  };

  const handlePrimaryAction = (item: AssetReturnItem, bucket: ReturnBucket) => {
    if (bucket === 'overdue' || bucket === 'requested') {
      handleMarkReceived(item);
    } else if (bucket === 'handed') {
      openConditionDialog(item);
    } else if (bucket === 'checked') {
      handleCloseReturn(item);
    }
  };

  const handleRemind = (item: AssetReturnItem) => {
    updateReturn(item.id, current => ({ ...current, reminded: true }));
    toast.success(`Reminder sent to ${item.person}.`);
  };

  const handleCheckCondition = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!conditionItem) return;

    const note = conditionNote.trim();
    if (conditionValue !== 'Good' && note.length < minDetailLength) {
      toast.error(
        `Describe the damage in at least ${minDetailLength} characters.`
      );
      return;
    }

    updateReturn(conditionItem.id, current => ({
      ...current,
      stage: 2,
      condition: conditionValue,
      conditionNote: note,
    }));
    toast.success(`Condition recorded as ${conditionValue.toLowerCase()}.`);
    setConditionId(null);
  };

  const handleStartReturn = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const asset = returnableAssets.find(item => item.id === startAssetId);
    if (!asset) {
      toast.error('Choose the asset that is being returned.');
      return;
    }
    if (!startReturnBy || startReturnBy < todayIso()) {
      toast.error('Pick today or a future date for the return.');
      return;
    }

    returnSequence.current += 1;
    const id = `ret-${String(returnSequence.current).padStart(3, '0')}`;
    const item: AssetReturnItem = {
      id,
      name: asset.name,
      tag: asset.tag,
      assetType: asset.assetType,
      person: asset.person,
      dept: asset.dept,
      reason: startReason,
      returnBy: startReturnBy,
      mode: startMode,
      stage: 0,
      condition: null,
      conditionNote: '',
      reminded: false,
    };
    setReturns(current => [item, ...current]);
    setSearch('');
    setReasonFilter('all');
    setTab('waiting');
    setSelectedId(id);
    toast.success(`Return started for ${asset.name}.`);
    closeStartDialog();
  };

  return (
    <>
      <Section
        title="Return & Recovery"
        menuId="return-and-recovery"
        showBreadcrumbs
      >
        <div className="space-y-5">
          <div className="flex flex-wrap items-start gap-5">
            <div className="min-w-0 flex-1 basis-[32rem] space-y-4">
              <div
                className="flex flex-wrap gap-1 rounded-xl border border-border bg-card p-1.5"
                role="group"
                aria-label="Filter returns"
              >
                {returnTabOptions.map(option => {
                  const isActive = tab === option.value;
                  return (
                    <Button
                      key={option.value}
                      type="button"
                      variant={isActive ? 'default' : 'ghost'}
                      aria-pressed={isActive}
                      className="h-10 flex-1 gap-2"
                      onClick={() => setTab(option.value)}
                    >
                      {option.label}
                      <span
                        className={`rounded-full px-2 text-xs font-semibold ${
                          isActive
                            ? 'bg-white/25 text-primary-foreground'
                            : 'bg-muted text-foreground'
                        }`}
                      >
                        {tabCounts[option.value]}
                      </span>
                    </Button>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-end gap-3">
                <div className="min-w-44">
                  <FormField
                    label="Search returns"
                    name="return-search"
                    value={search}
                    onChange={setSearch}
                    placeholder="Search by asset or employee"
                    className="min-w-20 flex-1"
                  />
                </div>
                <div className="min-w-44">
                  <FormField
                    label="Reason"
                    name="return-reason"
                    type="select"
                    value={reasonFilter}
                    onChange={setReasonFilter}
                    options={returnReasonFilterOptions}
                  />
                </div>
                <Button variant="default" size="sm" onClick={openStartDialog}>
                  <Plus className="w-4 h-4" />
                  Start a Return
                </Button>
              </div>

              <div className="space-y-2.5">
                {visibleReturns.length === 0 && (
                  <Card className="border-dashed p-10 text-center text-sm text-muted-foreground">
                    Nothing to show here. You are all caught up.
                  </Card>
                )}
                {visibleReturns.map(item => {
                  const Icon = typeIcons[item.assetType];
                  const bucket = getBucket(item);
                  const isLate = bucket === 'overdue';
                  const late = daysLate(item.returnBy);
                  const isSelected = selected?.id === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => setSelectedId(item.id)}
                      className={`grid w-full grid-cols-[3rem_minmax(0,1fr)_auto] items-center gap-4 rounded-xl border-2 p-4 text-left transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                        isSelected
                          ? 'border-primary bg-primary/5'
                          : 'border-border bg-card'
                      }`}
                    >
                      <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span className="min-w-0">
                        <span className="block font-semibold text-foreground">
                          {item.name}
                        </span>
                        <span className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                          <span
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${getAvatarClass(
                              item.person
                            )}`}
                            aria-hidden="true"
                          >
                            {getInitials(item.person)}
                          </span>
                          <span className="truncate">
                            {item.person} · {item.dept}
                          </span>
                        </span>
                      </span>
                      <span className="flex flex-col items-end gap-1.5">
                        <ReturnBucketBadge bucket={bucket} />
                        <span
                          className={`text-xs ${
                            isLate
                              ? 'font-semibold text-destructive'
                              : 'text-muted-foreground'
                          }`}
                        >
                          Due {formatShortDate(item.returnBy)}
                          {isLate &&
                            ` · ${late} ${late === 1 ? 'day' : 'days'} late`}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>

              <p className="text-sm text-muted-foreground">
                Showing{' '}
                <span className="font-semibold text-foreground">
                  {visibleReturns.length}
                </span>{' '}
                {visibleReturns.length === 1 ? 'return' : 'returns'}
              </p>
            </div>

            <Card
              className="w-full space-y-5 p-5 lg:w-[25rem] lg:shrink-0"
              aria-label="Return details"
            >
              {selected && selectedBucket && nextStep ? (
                <>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">
                      Return details
                    </p>
                    <h2 className="text-xl font-semibold text-foreground">
                      {selected.name}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {selected.tag} ·{' '}
                      {returnAssetTypeLabels[selected.assetType]}
                    </p>
                  </div>

                  <div
                    className={`space-y-2 rounded-xl border p-4 ${nextStepBoxClass[selectedBucket]}`}
                  >
                    <p
                      className={`text-xs font-semibold ${nextStepLabelClass[selectedBucket]}`}
                    >
                      What to do next
                    </p>
                    <p className="text-base font-semibold text-foreground">
                      {nextStep.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {nextStep.help}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {nextStep.primary && (
                        <Button
                          type="button"
                          onClick={() =>
                            handlePrimaryAction(selected, selectedBucket)
                          }
                        >
                          <Check className="h-4 w-4" aria-hidden="true" />
                          {nextStep.primary}
                        </Button>
                      )}
                      {(selectedBucket === 'overdue' ||
                        selectedBucket === 'requested') &&
                        (selected.reminded ? (
                          <span className="px-1 text-sm font-semibold text-primary">
                            Reminder sent
                          </span>
                        ) : (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleRemind(selected)}
                          >
                            Send reminder
                          </Button>
                        ))}
                      {selectedBucket === 'closed' && (
                        <Button asChild type="button" variant="outline">
                          <a href={inventoryPath}>View in inventory</a>
                        </Button>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="mb-3 text-sm font-semibold text-foreground">
                      Progress
                    </p>
                    <div role="list">
                      {returnStepLabels.map((label, index) => {
                        const isDone = index <= selected.stage;
                        const isCurrent = index === selected.stage + 1;
                        const isLast = index === returnStepLabels.length - 1;
                        return (
                          <div
                            key={label}
                            className="flex gap-3.5"
                            role="listitem"
                          >
                            <div className="flex flex-col items-center">
                              {isDone && (
                                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                  <Check
                                    className="h-4 w-4"
                                    aria-hidden="true"
                                  />
                                </span>
                              )}
                              {isCurrent && (
                                <span className="flex h-7 w-7 items-center justify-center rounded-full border-[3px] border-primary bg-background">
                                  <span className="h-2 w-2 rounded-full bg-primary" />
                                </span>
                              )}
                              {!isDone && !isCurrent && (
                                <span className="h-7 w-7 rounded-full border-2 border-border bg-background" />
                              )}
                              <span
                                className={`min-h-5 w-0.5 flex-1 ${
                                  isLast
                                    ? 'bg-transparent'
                                    : index < selected.stage
                                      ? 'bg-primary'
                                      : 'bg-border'
                                }`}
                              />
                            </div>
                            <div className="pb-3.5">
                              <p
                                className={`text-sm font-semibold ${
                                  isDone || isCurrent
                                    ? 'text-foreground'
                                    : 'text-muted-foreground'
                                }`}
                              >
                                {label}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {isDone
                                  ? 'Done'
                                  : isCurrent
                                    ? 'Up next'
                                    : 'Not started yet'}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="border-t border-border pt-2">
                    <InfoRow label="Returned by">
                      {selected.person} ({selected.dept})
                    </InfoRow>
                    <InfoRow label="Reason">{selected.reason}</InfoRow>
                    <InfoRow label="Return by">
                      {formatDate(selected.returnBy)}
                    </InfoRow>
                    <InfoRow label="How">{selected.mode}</InfoRow>
                    <InfoRow label="Condition">
                      <Badge
                        className={`border-transparent ${
                          selected.condition
                            ? conditionBadgeClass[selected.condition]
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {selected.condition ?? 'Not checked yet'}
                      </Badge>
                    </InfoRow>
                    {selected.conditionNote && (
                      <InfoRow label="Note">{selected.conditionNote}</InfoRow>
                    )}
                  </div>
                </>
              ) : (
                <p className="py-10 text-center text-sm text-muted-foreground">
                  Pick a return from the list to see what to do next.
                </p>
              )}
            </Card>
          </div>
        </div>
      </Section>

      <Dialog
        open={Boolean(conditionItem)}
        onOpenChange={open => !open && setConditionId(null)}
      >
        <DialogContent
          className="sm:max-w-md"
          onInteractOutside={event => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Check the condition</DialogTitle>
            <DialogDescription>
              {conditionItem?.name}. Record what you find before closing the
              return.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCheckCondition} className="space-y-4">
            <FormField
              label="Condition"
              name="return-condition"
              type="select"
              value={conditionValue}
              onChange={value => {
                if (isCondition(value)) setConditionValue(value);
              }}
              options={returnConditionOptions}
              required
            />
            <FormField
              label={
                conditionValue === 'Good'
                  ? 'Note (optional)'
                  : 'Describe the damage'
              }
              name="return-condition-note"
              type="textarea"
              value={conditionNote}
              onChange={setConditionNote}
              placeholder="e.g. Small scratch on the back panel"
              required={conditionValue !== 'Good'}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="destructive"
                onClick={() => setConditionId(null)}
              >
                Cancel
              </Button>
              <Button type="submit">Save condition</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isStartOpen}
        onOpenChange={open => {
          if (open) {
            setIsStartOpen(true);
          } else {
            closeStartDialog();
          }
        }}
      >
        <DialogContent
          className="sm:max-w-xl"
          onInteractOutside={event => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Start a return</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleStartReturn} className="space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <FormField
                label="Asset"
                name="start-return-asset"
                type="select"
                value={startAssetId}
                onChange={setStartAssetId}
                options={availableAssetOptions}
                placeholder="Select assets"
                required
              />
              <FormField
                label="Why is it coming back?"
                name="start-return-reason"
                type="select"
                value={startReason}
                onChange={value => {
                  if (isReason(value)) setStartReason(value);
                }}
                options={returnReasonOptions}
                required
              />

              <FormField
                label="Return by"
                name="start-return-date"
                type="date"
                value={startReturnBy}
                onChange={setStartReturnBy}
                required
              />
              <FormField
                label="How will it be returned?"
                name="start-return-mode"
                type="select"
                value={startMode}
                onChange={value => {
                  if (isMode(value)) setStartMode(value);
                }}
                options={returnModeOptions}
                required
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="destructive"
                onClick={closeStartDialog}
              >
                Cancel
              </Button>
              <Button type="submit">Start return</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReturnRecoveryPage;
