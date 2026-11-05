import { type FormEvent, useMemo, useRef, useState } from 'react';
import {
  Armchair,
  Check,
  Headphones,
  Laptop,
  Monitor,
  Plus,
  Printer,
  Smartphone,
  type LucideIcon,
} from 'lucide-react';
import { toast } from 'sonner';

import FormField from '@/components/common/FormField';
import Section from '@/components/common/Section';
import {
  initialRepairs,
  repairableAssets,
  repairColumns,
  repairPriorityFilterOptions,
  repairPriorityOptions,
  repairVendorOptions,
  type RepairItem,
  type RepairPriority,
  type RepairPriorityFilter,
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

const typeIcons: Record<RepairItem['assetType'], LucideIcon> = {
  laptop: Laptop,
  mobile: Smartphone,
  monitor: Monitor,
  headset: Headphones,
  printer: Printer,
  furniture: Armchair,
};

const priorityBadgeClass: Record<RepairPriority, string> = {
  High: 'bg-destructive/10 text-destructive',
  Normal: 'bg-muted text-muted-foreground',
  Low: 'bg-primary/10 text-primary',
};

const minDetailLength = 10;

const formatShortDate = (date: string) =>
  new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
  }).format(new Date(`${date}T00:00:00`));

const formatMoney = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

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

const isDelayed = (item: RepairItem) =>
  item.stage === 2 && item.backBy !== null && daysLate(item.backBy) > 0;

const getRepairMeta = (item: RepairItem): { text: string; isLate: boolean } => {
  if (isDelayed(item) && item.backBy) {
    const late = daysLate(item.backBy);
    return {
      text: `${late} ${late === 1 ? 'day' : 'days'} late · ${
        item.vendor ?? 'Vendor'
      }`,
      isLate: true,
    };
  }
  if (item.stage === 2) {
    return {
      text: `${item.vendor ?? 'Vendor'} · back by ${
        item.backBy ? formatShortDate(item.backBy) : 'a date to be confirmed'
      }`,
      isLate: false,
    };
  }
  if (item.stage === 1) {
    if (item.covered) return { text: 'Covered by warranty', isLate: false };
    return {
      text:
        item.cost !== null
          ? `Estimate ${formatMoney(item.cost)}`
          : 'Estimate pending',
      isLate: false,
    };
  }
  return {
    text: `Reported ${formatShortDate(item.reportedOn)}`,
    isLate: false,
  };
};

const parseCost = (value: string): { ok: boolean; amount: number | null } => {
  const trimmed = value.trim();
  if (!trimmed) return { ok: true, amount: null };
  const amount = Number(trimmed.replace(/,/g, ''));
  return Number.isFinite(amount) && amount >= 0
    ? { ok: true, amount }
    : { ok: false, amount: null };
};

const isPriority = (value: string): value is RepairPriority =>
  repairPriorityOptions.some(option => option.value === value);

const isPriorityFilter = (value: string): value is RepairPriorityFilter =>
  repairPriorityFilterOptions.some(option => option.value === value);

const PriorityBadge = ({ priority }: { priority: RepairPriority }) => (
  <Badge className={`border-transparent ${priorityBadgeClass[priority]}`}>
    {priority}
  </Badge>
);

const SummaryStat = ({
  label,
  value,
  help,
  isAlert = false,
}: {
  label: string;
  value: string | number;
  help: string;
  isAlert?: boolean;
}) => (
  <Card className="space-y-1.5 p-5">
    <p className="text-sm font-medium text-muted-foreground">{label}</p>
    <p
      className={`text-3xl font-semibold ${
        isAlert ? 'text-destructive' : 'text-card-foreground'
      }`}
    >
      {value}
    </p>
    <p className="text-sm text-muted-foreground">{help}</p>
  </Card>
);

const RepairCard = ({
  item,
  primaryLabel,
  onPrimary,
  onChase,
}: {
  item: RepairItem;
  primaryLabel: string;
  onPrimary: () => void;
  onChase: () => void;
}) => {
  const Icon = typeIcons[item.assetType];
  const late = isDelayed(item);
  const meta = getRepairMeta(item);

  return (
    <Card
      className={`space-y-4 p-5 ${late ? 'border-destructive/30' : 'border-border'}`}
    >
      <div className="flex items-center gap-3.5">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-foreground">{item.name}</p>
          <p className="text-xs text-muted-foreground">{item.tag}</p>
        </div>
        {item.priority === 'High' && <PriorityBadge priority="High" />}
      </div>

      <div className="space-y-1.5">
        <p className="font-medium text-foreground">{item.issue}</p>
        <p className="text-sm text-muted-foreground">{item.person}</p>
      </div>

      <p
        className={`text-sm ${
          meta.isLate
            ? 'font-semibold text-destructive'
            : 'text-muted-foreground'
        }`}
      >
        {meta.text}
      </p>

      <div className="space-y-2.5">
        <Button type="button" className="w-full" onClick={onPrimary}>
          {primaryLabel}
        </Button>
        {late &&
          (item.chased ? (
            <p className="text-center text-sm font-semibold text-primary">
              Update requested
            </p>
          ) : (
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={onChase}
            >
              Ask vendor for update
            </Button>
          ))}
      </div>
    </Card>
  );
};

const MaintenanceRepairPage = () => {
  const [repairs, setRepairs] = useState(initialRepairs);
  const [priorityFilter, setPriorityFilter] =
    useState<RepairPriorityFilter>('all');
  const repairSequence = useRef(initialRepairs.length);

  const [assessId, setAssessId] = useState<string | null>(null);
  const [assessDiagnosis, setAssessDiagnosis] = useState('');
  const [assessCost, setAssessCost] = useState('');
  const [assessCovered, setAssessCovered] = useState(false);

  const [sendId, setSendId] = useState<string | null>(null);
  const [sendVendor, setSendVendor] = useState(
    repairVendorOptions[0]?.value ?? ''
  );
  const [sendBackBy, setSendBackBy] = useState(dateOffset(7));

  const [fixId, setFixId] = useState<string | null>(null);
  const [fixCost, setFixCost] = useState('');
  const [fixNote, setFixNote] = useState('');

  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportAssetId, setReportAssetId] = useState('');
  const [reportIssue, setReportIssue] = useState('');
  const [reportPriority, setReportPriority] =
    useState<RepairPriority>('Normal');

  const assessItem = repairs.find(item => item.id === assessId) ?? null;
  const sendItem = repairs.find(item => item.id === sendId) ?? null;
  const fixItem = repairs.find(item => item.id === fixId) ?? null;

  const openItems = repairs.filter(item => item.stage < 3);
  const lateCount = repairs.filter(isDelayed).length;
  const highOpenCount = openItems.filter(
    item => item.priority === 'High'
  ).length;
  const openSpend = openItems.reduce(
    (total, item) =>
      total + (item.covered || item.cost === null ? 0 : item.cost),
    0
  );

  const visibleRepairs = useMemo(
    () =>
      repairs.filter(
        item => priorityFilter === 'all' || item.priority === priorityFilter
      ),
    [repairs, priorityFilter]
  );
  const fixedRepairs = visibleRepairs.filter(item => item.stage === 3);

  const availableAssetOptions = repairableAssets
    .filter(
      asset => !repairs.some(item => item.tag === asset.tag && item.stage < 3)
    )
    .map(asset => ({
      label: `${asset.name} (${asset.tag}) - ${asset.person}`,
      value: asset.id,
    }));

  const updateRepair = (id: string, change: (item: RepairItem) => RepairItem) =>
    setRepairs(current =>
      current.map(item => (item.id === id ? change(item) : item))
    );

  const openAssessDialog = (item: RepairItem) => {
    setAssessDiagnosis('');
    setAssessCost('');
    setAssessCovered(false);
    setAssessId(item.id);
  };

  const openSendDialog = (item: RepairItem) => {
    setSendVendor(repairVendorOptions[0]?.value ?? '');
    setSendBackBy(dateOffset(7));
    setSendId(item.id);
  };

  const openFixDialog = (item: RepairItem) => {
    setFixCost(item.cost !== null && item.cost > 0 ? String(item.cost) : '');
    setFixNote('');
    setFixId(item.id);
  };

  const openReportDialog = () => {
    const firstOption = availableAssetOptions[0];
    if (!firstOption) {
      toast.error('Every assigned asset already has a repair in progress.');
      return;
    }
    setReportAssetId(firstOption.value);
    setReportIssue('');
    setReportPriority('Normal');
    setIsReportOpen(true);
  };

  const handlePrimaryAction = (item: RepairItem) => {
    if (item.stage === 0) openAssessDialog(item);
    else if (item.stage === 1) openSendDialog(item);
    else if (item.stage === 2) openFixDialog(item);
  };

  const handleChase = (item: RepairItem) => {
    updateRepair(item.id, current => ({ ...current, chased: true }));
    toast.success(`Update requested from ${item.vendor ?? 'the vendor'}.`);
  };

  const handleAssess = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!assessItem) return;

    if (assessDiagnosis.trim().length < minDetailLength) {
      toast.error(
        `Describe what you found in at least ${minDetailLength} characters.`
      );
      return;
    }
    const parsed = parseCost(assessCost);
    if (!assessCovered && !parsed.ok) {
      toast.error('Enter the estimated cost as a number, for example 2500.');
      return;
    }

    updateRepair(assessItem.id, current => ({
      ...current,
      stage: 1,
      diagnosis: assessDiagnosis.trim(),
      covered: assessCovered,
      cost: assessCovered ? null : parsed.amount,
    }));
    toast.success(`${assessItem.name} assessed. It is ready for repair.`);
    setAssessId(null);
  };

  const handleSendForRepair = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!sendItem) return;

    if (!sendVendor) {
      toast.error('Choose who will repair it.');
      return;
    }
    if (!sendBackBy || sendBackBy < todayIso()) {
      toast.error('Pick today or a future date for the expected return.');
      return;
    }

    updateRepair(sendItem.id, current => ({
      ...current,
      stage: 2,
      vendor: sendVendor,
      backBy: sendBackBy,
      chased: false,
    }));
    toast.success(`${sendItem.name} sent to ${sendVendor}.`);
    setSendId(null);
  };

  const handleMarkFixed = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!fixItem) return;

    const parsed = parseCost(fixCost);
    if (!fixItem.covered && !parsed.ok) {
      toast.error('Enter the final cost as a number, for example 2500.');
      return;
    }

    const note = fixNote.trim();
    updateRepair(fixItem.id, current => ({
      ...current,
      stage: 3,
      cost: current.covered ? null : (parsed.amount ?? current.cost),
      diagnosis: note || current.diagnosis,
      completedOn: todayIso(),
    }));
    toast.success(`${fixItem.name} is fixed and back in inventory.`);
    setFixId(null);
  };

  const handleReportProblem = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const asset = repairableAssets.find(item => item.id === reportAssetId);
    if (!asset) {
      toast.error('Choose the asset that has a problem.');
      return;
    }
    if (reportIssue.trim().length < minDetailLength) {
      toast.error(
        `Describe the problem in at least ${minDetailLength} characters.`
      );
      return;
    }

    repairSequence.current += 1;
    const item: RepairItem = {
      id: `rep-${String(repairSequence.current).padStart(3, '0')}`,
      name: asset.name,
      tag: asset.tag,
      assetType: asset.assetType,
      person: asset.person,
      issue: reportIssue.trim(),
      priority: reportPriority,
      diagnosis: '',
      vendor: null,
      cost: null,
      covered: false,
      reportedOn: todayIso(),
      backBy: null,
      completedOn: null,
      stage: 0,
      chased: false,
    };
    setRepairs(current => [item, ...current]);
    setPriorityFilter('all');
    toast.success(`Problem reported for ${asset.name}.`);
    setIsReportOpen(false);
  };

  return (
    <>
      <Section
        title="Maintenance & Repair"
        menuId="maintanance-and-repairs"
        showBreadcrumbs
      >
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3"></div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryStat
              label="Open repairs"
              value={openItems.length}
              help="Not fixed yet"
            />
            <SummaryStat
              label="Running late"
              value={lateCount}
              help="Past the expected date"
              isAlert={lateCount > 0}
            />
            <SummaryStat
              label="High priority"
              value={highOpenCount}
              help="Open and urgent"
            />
            <SummaryStat
              label="Open repair spend"
              value={formatMoney(openSpend)}
              help="Estimate, excluding warranty"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div
              className="flex gap-1 rounded-xl border border-border bg-card p-1"
              role="group"
              aria-label="Filter by priority"
            >
              {repairPriorityFilterOptions.map(option => {
                const isActive = priorityFilter === option.value;
                return (
                  <Button
                    key={option.value}
                    type="button"
                    variant={isActive ? 'default' : 'ghost'}
                    aria-pressed={isActive}
                    className="h-10 px-5"
                    onClick={() => {
                      if (isPriorityFilter(option.value)) {
                        setPriorityFilter(option.value);
                      }
                    }}
                  >
                    {option.label}
                  </Button>
                );
              })}
            </div>
            <Button variant="default" onClick={openReportDialog}>
              <Plus className="w-4 h-4" />
              Report a Problem
            </Button>
          </div>

          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
            {repairColumns.map(column => {
              const columnItems = visibleRepairs.filter(
                item => item.stage === column.stage
              );
              return (
                <section
                  key={column.stage}
                  aria-label={column.title}
                  className="space-y-5 rounded-2xl bg-muted/50 p-6"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${column.dotClass}`}
                        aria-hidden="true"
                      />
                      <h3 className="flex-1 text-base font-semibold text-foreground">
                        {column.title}
                      </h3>
                      <span className="text-sm font-semibold text-muted-foreground">
                        {columnItems.length}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {column.help}
                    </p>
                  </div>

                  <div className="space-y-4">
                    {columnItems.map(item => (
                      <RepairCard
                        key={item.id}
                        item={item}
                        primaryLabel={column.primaryLabel}
                        onPrimary={() => handlePrimaryAction(item)}
                        onChase={() => handleChase(item)}
                      />
                    ))}
                    {columnItems.length === 0 && (
                      <Card className="border-2 border-dashed bg-transparent p-8 text-center text-sm text-muted-foreground shadow-none">
                        {column.emptyText}
                      </Card>
                    )}
                  </div>
                </section>
              );
            })}
          </div>

          <Section title="Recently fixed" contentClassName="space-y-4">
            <Card className="divide-y divide-border overflow-hidden">
              {fixedRepairs.map(item => {
                const Icon = typeIcons[item.assetType];
                return (
                  <div
                    key={item.id}
                    className="grid grid-cols-1 items-center gap-3 p-5 sm:grid-cols-[2.75rem_minmax(0,1.6fr)_minmax(0,1fr)_auto] sm:gap-5"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground">
                        {item.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {item.issue}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {item.person}
                    </p>
                    <p className="flex items-center gap-2 text-sm font-semibold text-primary">
                      <Check className="h-4 w-4" aria-hidden="true" />
                      Back in inventory
                    </p>
                  </div>
                );
              })}
              {fixedRepairs.length === 0 && (
                <p className="p-8 text-center text-sm text-muted-foreground">
                  No completed repairs to show.
                </p>
              )}
            </Card>
          </Section>
        </div>
      </Section>

      <Dialog
        open={Boolean(assessItem)}
        onOpenChange={open => !open && setAssessId(null)}
      >
        <DialogContent
          className="sm:max-w-md"
          onInteractOutside={event => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Assess the problem</DialogTitle>
            <DialogDescription>
              {assessItem?.name}. Note what you found and what it may cost.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAssess} className="space-y-4">
            <FormField
              label="What did you find?"
              name="assess-diagnosis"
              type="textarea"
              value={assessDiagnosis}
              onChange={setAssessDiagnosis}
              placeholder="e.g. Faulty display cable, needs to be replaced"
              required
            />
            <FormField
              label="This repair is covered by warranty"
              name="assess-covered"
              type="checkbox"
              value={assessCovered}
              onCheckboxChange={setAssessCovered}
              className="rounded-lg bg-muted/40 p-3"
            />
            {!assessCovered && (
              <FormField
                label="Estimated cost in ₹ (optional)"
                name="assess-cost"
                value={assessCost}
                onChange={setAssessCost}
                placeholder="e.g. 2500"
              />
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="destructive"
                onClick={() => setAssessId(null)}
              >
                Cancel
              </Button>
              <Button type="submit">Save assessment</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(sendItem)}
        onOpenChange={open => !open && setSendId(null)}
      >
        <DialogContent
          className="sm:max-w-xl"
          onInteractOutside={event => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Send for repair</DialogTitle>
            <DialogDescription>
              {sendItem?.name}. Choose who will repair it and when it should be
              back.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSendForRepair} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField
                label="Vendor"
                name="send-vendor"
                type="select"
                value={sendVendor}
                onChange={setSendVendor}
                options={repairVendorOptions}
                required
              />
              <FormField
                label="Expected back"
                name="send-back-by"
                type="date"
                value={sendBackBy}
                onChange={setSendBackBy}
                required
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="destructive"
                onClick={() => setSendId(null)}
              >
                Cancel
              </Button>
              <Button type="submit">Send for repair</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(fixItem)}
        onOpenChange={open => !open && setFixId(null)}
      >
        <DialogContent
          className="sm:max-w-md"
          onInteractOutside={event => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Mark as fixed</DialogTitle>
            <DialogDescription>
              {fixItem?.name}. It goes back to inventory once you confirm.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleMarkFixed} className="space-y-4">
            {fixItem && !fixItem.covered && (
              <FormField
                label="Final cost in ₹ (optional)"
                name="fix-cost"
                value={fixCost}
                onChange={setFixCost}
                placeholder="e.g. 2500"
              />
            )}
            <FormField
              label="Note (optional)"
              name="fix-note"
              type="textarea"
              value={fixNote}
              onChange={setFixNote}
              placeholder="e.g. Display panel replaced and tested"
            />

            <DialogFooter>
              <Button
                type="button"
                variant="destructive"
                onClick={() => setFixId(null)}
              >
                Cancel
              </Button>
              <Button type="submit">Mark as fixed</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isReportOpen}
        onOpenChange={open => !open && setIsReportOpen(false)}
      >
        <DialogContent
          className="sm:max-w-xl"
          onInteractOutside={event => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Report a problem</DialogTitle>
            <DialogDescription>
              Tell the asset team what is wrong. It starts in Reported.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleReportProblem} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField
                label="Asset"
                name="report-asset"
                type="select"
                value={reportAssetId}
                onChange={setReportAssetId}
                placeholder="Select assets"
                options={availableAssetOptions}
                required
              />

              <FormField
                label="Priority"
                name="report-priority"
                type="select"
                value={reportPriority}
                onChange={value => {
                  if (isPriority(value)) setReportPriority(value);
                }}
                options={repairPriorityOptions}
                required
              />
            </div>
            <FormField
              label="What is the problem?"
              name="report-issue"
              type="textarea"
              value={reportIssue}
              onChange={setReportIssue}
              placeholder="e.g. Battery drains in under an hour"
              required
            />

            <DialogFooter>
              <Button
                type="button"
                variant="destructive"
                onClick={() => setIsReportOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Report problem</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MaintenanceRepairPage;
