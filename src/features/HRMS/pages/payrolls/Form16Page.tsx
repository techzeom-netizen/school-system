import { type FormEvent, useMemo, useState } from 'react';
import {
  ArrowDownToLine,
  ChevronLeft,
  ChevronRight,
  FileText,
  Send,
} from 'lucide-react';
import { toast } from 'sonner';

import FormField from '@/components/common/FormField';
import Section from '@/components/common/Section';
import { TanStackTable } from '@/components/common';
import {
  form16AllDepartmentsOption,
  form16FilterOptions,
  form16GenerationScopeOptions,
} from '@/data/reusableDropdownData';
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
import { cn } from '@/lib/utils';
import {
  downloadForm16,
  financialYears,
  formatCurrency,
  getPartB,
  getQuarters,
  getStatus,
  initialRecords,
  isValidPan,
  maskPan,
  quarterNames,
  sliceColors,
  statusOrder,
  statusStyles,
} from './form-16/form16Data';
import { createForm16Columns } from './form-16/form16Columns';
import { StatusDonut, StepRow } from './form-16/Form16Components';
import type {
  FilterTab,
  Form16Record,
  Status,
  DonutSlice,
} from './form-16/form16Types';
const Form16Page = () => {
  const [records, setRecords] = useState(initialRecords);
  const [fy, setFy] = useState('2025-26');
  const [department, setDepartment] = useState('all');
  const [tab, setTab] = useState<FilterTab>('everyone');
  const [query] = useState('');

  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [genScope, setGenScope] = useState('all');
  const [genTeam, setGenTeam] = useState('');
  const [genIssueDate, setGenIssueDate] = useState('');
  const [genParts, setGenParts] = useState(true);
  const [genShare, setGenShare] = useState(false);
  const [genEmail, setGenEmail] = useState(true);
  const [genSave, setGenSave] = useState(true);

  const [fixId, setFixId] = useState<string | null>(null);
  const [fixQueue, setFixQueue] = useState(false);
  const [fixPan, setFixPan] = useState('');
  const [fixName, setFixName] = useState('');
  const [fixCreate, setFixCreate] = useState(true);

  const [previewId, setPreviewId] = useState<string | null>(null);

  const [shareIds, setShareIds] = useState<string[] | null>(null);
  const [shareEmail, setShareEmail] = useState(true);
  const [shareDocs, setShareDocs] = useState(true);

  const yearRecords = useMemo(
    () => records.filter(record => record.fy === fy),
    [fy, records]
  );
  const scopedRecords = useMemo(
    () =>
      yearRecords.filter(
        record => department === 'all' || record.department === department
      ),
    [department, yearRecords]
  );

  const departments = useMemo(
    () => [...new Set(yearRecords.map(record => record.department))].sort(),
    [yearRecords]
  );
  const departmentOptions = useMemo(
    () => [
      form16AllDepartmentsOption,
      ...departments.map(value => ({ value, label: value })),
    ],
    [departments]
  );

  const counts: Record<Status, number> = {
    attention: scopedRecords.filter(r => getStatus(r) === 'attention').length,
    ready: scopedRecords.filter(r => getStatus(r) === 'ready').length,
    generated: scopedRecords.filter(r => getStatus(r) === 'generated').length,
    shared: scopedRecords.filter(r => getStatus(r) === 'shared').length,
  };

  const visibleRecords = useMemo(() => {
    const search = query.trim().toLowerCase();

    return scopedRecords
      .filter(
        record =>
          (tab === 'everyone' || getStatus(record) === tab) &&
          (!search || record.name.toLowerCase().includes(search))
      )
      .sort(
        (first, second) =>
          statusOrder[getStatus(first)] - statusOrder[getStatus(second)] ||
          first.name.localeCompare(second.name)
      );
  }, [query, scopedRecords, tab]);

  const slices: DonutSlice[] = (
    ['shared', 'generated', 'ready', 'attention'] as Status[]
  ).map(status => ({
    label: statusStyles[status].label,
    value: counts[status],
    color: sliceColors[status],
  }));

  const updateRecords = (ids: string[], changes: Partial<Form16Record>) => {
    setRecords(currentRecords =>
      currentRecords.map(record =>
        ids.includes(record.id) ? { ...record, ...changes } : record
      )
    );
  };

  const generateIds = (ids: string[], share: boolean) => {
    updateRecords(ids, { stage: share ? 'shared' : 'generated' });
  };

  const generateOne = (record: Form16Record) => {
    generateIds([record.id], false);
    toast.success(`Form 16 created for ${record.name}.`);
  };

  const openGenerate = () => {
    setGenScope('all');
    setGenTeam(departments[0] ?? '');
    setGenIssueDate('');
    setGenParts(true);
    setGenShare(false);
    setGenEmail(true);
    setGenSave(true);
    setIsGenerateOpen(true);
  };

  const generateTargets = scopedRecords.filter(
    record =>
      getStatus(record) === 'ready' &&
      (genScope === 'all' || record.department === genTeam)
  );
  const skippedCount = scopedRecords.filter(
    record => getStatus(record) === 'attention'
  ).length;

  const handleGenerate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (generateTargets.length === 0) {
      toast.error('Nobody is ready to generate for this choice.');
      return;
    }

    // TODO: call your API with genIssueDate, genParts, genEmail and genSave.
    generateIds(
      generateTargets.map(record => record.id),
      genShare
    );
    toast.success(
      `${generateTargets.length} Form 16 ${generateTargets.length === 1 ? 'file was' : 'files were'} created${genShare ? ' and shared' : ''}.`
    );
    setIsGenerateOpen(false);
  };

  const fixRecord = records.find(record => record.id === fixId) ?? null;

  const openFix = (record: Form16Record, queue = false) => {
    setFixId(record.id);
    setFixQueue(queue);
    setFixPan(record.pan);
    setFixName(record.name);
    setFixCreate(true);
  };

  const startFixQueue = () => {
    const first = scopedRecords.find(
      record => getStatus(record) === 'attention'
    );

    if (first) openFix(first, true);
  };

  const closeFix = () => {
    setFixId(null);
    setFixQueue(false);
  };

  const handleFix = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!fixRecord) return;

    const pan = fixPan.trim().toUpperCase();

    if (!isValidPan(pan)) {
      toast.error(
        'A PAN has 5 letters, 4 numbers, then 1 letter. Example: ABCDE1234F.'
      );
      return;
    }

    if (!fixName.trim()) {
      toast.error('Add the name as on the PAN.');
      return;
    }

    updateRecords([fixRecord.id], {
      pan,
      name: fixName.trim(),
      stage: fixCreate ? 'generated' : fixRecord.stage,
    });
    toast.success(
      `Details saved for ${fixName.trim()}.${fixCreate ? ' Form 16 created.' : ''}`
    );

    const nextRecord = fixQueue
      ? scopedRecords.find(
          record =>
            record.id !== fixRecord.id && getStatus(record) === 'attention'
        )
      : undefined;

    if (nextRecord) {
      openFix(nextRecord, true);
    } else {
      closeFix();
    }
  };

  const previewRecord = records.find(record => record.id === previewId) ?? null;
  const previewStatus = previewRecord ? getStatus(previewRecord) : null;

  const openShare = (ids: string[]) => {
    setShareIds(ids);
    setShareEmail(true);
    setShareDocs(true);
  };

  const shareTargets = records.filter(record => shareIds?.includes(record.id));

  const handleShare = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (shareTargets.length === 0) return;

    // TODO: call your API with shareEmail and shareDocs.
    updateRecords(
      shareTargets.map(record => record.id),
      { stage: 'shared' }
    );
    toast.success(
      `Form 16 shared with ${shareTargets.length} ${shareTargets.length === 1 ? 'employee' : 'employees'}.`
    );
    setShareIds(null);
    setPreviewId(null);
  };

  const changeYear = (step: number) => {
    const next = financialYears[financialYears.indexOf(fy) + step];

    if (!next) return;
    setFy(next);
    setDepartment('all');
    setTab('everyone');
  };

  const columns = createForm16Columns({
    onFix: record => openFix(record),
    onGenerate: generateOne,
    onShare: record => openShare([record.id]),
    onPreview: record => setPreviewId(record.id),
  });

  const partB = previewRecord ? getPartB(previewRecord) : null;

  return (
    <>
      <Section title="Form 16" menuId="form16" showBreadcrumbs>
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center overflow-hidden rounded-lg border border-border bg-card">
              <Button
                type="button"
                variant="default"
                size="icon"
                aria-label="Previous financial year"
                disabled={financialYears.indexOf(fy) === 0}
                onClick={() => changeYear(-1)}
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </Button>
              <span className="min-w-48 px-3 text-center text-sm font-semibold text-foreground">
                Financial year {fy}
              </span>
              <Button
                type="button"
                variant="default"
                size="icon"
                aria-label="Next financial year"
                disabled={
                  financialYears.indexOf(fy) === financialYears.length - 1
                }
                onClick={() => changeYear(1)}
              >
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>

            <div className="flex flex-wrap items-end justify-end gap-3">
              <FormField
                label="Show"
                name="form16-department"
                type="select"
                value={department}
                onChange={setDepartment}
                options={departmentOptions}
              />
              <Button variant="default" onClick={openGenerate}>
                <FileText className="w-4 h-4" />
                Generate Form 16
              </Button>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <Card className="border-border p-4 sm:p-5">
              <h2 className="text-lg font-semibold text-foreground">
                Where are we?
              </h2>
              <p className="mb-4 text-sm text-muted-foreground">
                Form 16 for {scopedRecords.length} employees
              </p>
              <div className="grid items-center gap-6 sm:grid-cols-2">
                <StatusDonut
                  slices={slices}
                  total={scopedRecords.length}
                  centerValue={String(counts.shared)}
                  centerLabel={`of ${scopedRecords.length} shared`}
                />
                <div className="divide-y divide-border text-sm">
                  {slices.map(slice => (
                    <div
                      key={slice.label}
                      className="flex items-center justify-between gap-3 py-2"
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className={cn(
                            'h-2.5 w-2.5 rounded-full bg-current',
                            slice.color
                          )}
                          aria-hidden="true"
                        />
                        {slice.label}
                      </span>
                      <span className="font-semibold text-foreground">
                        {slice.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <Card className="border-border p-4 sm:p-5">
              <h2 className="text-lg font-semibold text-foreground">
                What to do next
              </h2>
              <p className="text-sm text-muted-foreground">
                Do these in order. Each button does the step for you.
              </p>
              <div className="divide-y divide-border">
                <StepRow
                  number={1}
                  warn
                  title="Check employee details"
                  text={
                    counts.attention === 0
                      ? 'All PAN numbers look correct.'
                      : `${counts.attention} ${counts.attention === 1 ? 'employee has' : 'employees have'} a missing or wrong PAN number.`
                  }
                  buttonLabel={
                    counts.attention === 0 ? 'Done' : `Fix ${counts.attention}`
                  }
                  disabled={counts.attention === 0}
                  onClick={startFixQueue}
                />
                <StepRow
                  number={2}
                  title="Generate Form 16"
                  text={
                    counts.ready === 0
                      ? 'Nobody is waiting to be generated.'
                      : `${counts.ready} ${counts.ready === 1 ? 'employee is' : 'employees are'} ready.`
                  }
                  buttonLabel={
                    counts.ready === 0 ? 'Done' : `Generate ${counts.ready}`
                  }
                  disabled={counts.ready === 0}
                  primary
                  onClick={openGenerate}
                />
                <StepRow
                  number={3}
                  title="Share with employees"
                  text={
                    counts.generated === 0
                      ? 'Everything generated has been shared.'
                      : `${counts.generated} ${counts.generated === 1 ? 'is' : 'are'} generated but not shared yet.`
                  }
                  buttonLabel={
                    counts.generated === 0
                      ? 'Done'
                      : `Share ${counts.generated}`
                  }
                  disabled={counts.generated === 0}
                  onClick={() =>
                    openShare(
                      scopedRecords
                        .filter(record => getStatus(record) === 'generated')
                        .map(record => record.id)
                    )
                  }
                />
              </div>
            </Card>
          </div>

          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-foreground">
              Form 16 by employee
            </h2>
            <p className="text-sm text-muted-foreground">
              Employees who need attention come first.
            </p>
          </div>

          <TanStackTable
            data={visibleRecords}
            columns={columns}
            enableSearch={true}
            showDownload={true}
            enableColumnVisibility={false}
            enablePagination
            pageSize={8}
            pageSizeOptions={[8, 10, 20]}
            getRowId={record => record.id}
            emptyMessage="No employees match these filters."
            customFilters={
              <div className="space-y-3">
                <div
                  role="group"
                  aria-label="Form 16 filter"
                  className="flex flex-wrap gap-2"
                >
                  {form16FilterOptions.map(({ value, label }) => {
                    const option = value as FilterTab;
                    return (
                      <Button
                        key={option}
                        type="button"
                        size="sm"
                        className="rounded-lg"
                        variant={tab === option ? 'default' : 'outline'}
                        aria-pressed={tab === option}
                        onClick={() => setTab(option)}
                      >
                        {label}{' '}
                        {option === 'everyone'
                          ? scopedRecords.length
                          : counts[option]}
                      </Button>
                    );
                  })}
                </div>
              </div>
            }
          />
        </div>
      </Section>

      <Dialog
        open={isGenerateOpen}
        onOpenChange={open => !open && setIsGenerateOpen(false)}
      >
        <DialogContent
          className="max-h-[92vh] overflow-y-auto sm:max-w-xl"
          onInteractOutside={event => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Generate Form 16</DialogTitle>
            <DialogDescription>Financial year {fy}</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleGenerate} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <FormField
                  label="Who should get one?"
                  name="gen-scope"
                  type="radio"
                  value={genScope}
                  onChange={setGenScope}
                  options={form16GenerationScopeOptions.map(option => ({
                    ...option,
                    label:
                      option.value === 'all'
                        ? `All ${scopedRecords.filter(record => getStatus(record) === 'ready').length} ready employees (recommended)`
                        : option.label,
                  }))}
                />
              </div>
              {genScope === 'team' && (
                <FormField
                  label="Team"
                  name="gen-team"
                  type="select"
                  value={genTeam}
                  onChange={setGenTeam}
                  options={departments.map(value => ({ value, label: value }))}
                />
              )}
              <FormField
                label="Issue date"
                name="gen-issue-date"
                type="date"
                value={genIssueDate}
                onChange={setGenIssueDate}
              />
              <FormField
                label="Include Part A and Part B"
                name="gen-parts"
                type="checkbox"
                value={genParts}
                onCheckboxChange={setGenParts}
                className="rounded-lg border border-border bg-muted/40 p-3"
              />
              <FormField
                label="Share with employees right after"
                name="gen-share"
                type="checkbox"
                value={genShare}
                onCheckboxChange={setGenShare}
                className="rounded-lg border border-border bg-muted/40 p-3"
              />
              <FormField
                label="Email each employee a copy"
                name="gen-email"
                type="checkbox"
                value={genEmail}
                onCheckboxChange={setGenEmail}
                className="rounded-lg border border-border bg-muted/40 p-3"
              />
              <FormField
                label="Save a copy in their documents"
                name="gen-save"
                type="checkbox"
                value={genSave}
                onCheckboxChange={setGenSave}
                className="rounded-lg border border-border bg-muted/40 p-3"
              />
            </div>

            <p className="rounded-lg bg-primary/10 p-3 text-sm text-foreground">
              <strong>
                {generateTargets.length} Form 16{' '}
                {generateTargets.length === 1 ? 'file' : 'files'} will be
                created.
              </strong>{' '}
              {skippedCount > 0
                ? `${skippedCount} ${skippedCount === 1 ? 'employee is' : 'employees are'} skipped because the PAN number needs fixing.`
                : 'Nobody is skipped.'}
            </p>

            <DialogFooter>
              <Button
                type="button"
                variant="destructive"
                onClick={() => setIsGenerateOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={generateTargets.length === 0}>
                Generate {generateTargets.length} Form 16
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(fixRecord)}
        onOpenChange={open => !open && closeFix()}
      >
        <DialogContent
          className="sm:max-w-lg"
          onInteractOutside={event => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Fix details · {fixRecord?.name}</DialogTitle>
            <DialogDescription>
              {fixRecord?.department} ·{' '}
              {fixRecord?.pan
                ? 'The PAN number looks wrong.'
                : 'The PAN number is missing.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleFix} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                label="PAN number"
                name="fix-pan"
                value={fixPan}
                onChange={value => setFixPan(value.toUpperCase())}
                placeholder="e.g. ABCDE1234F"
                required
              />
              <FormField
                label="Name as on PAN"
                name="fix-name"
                value={fixName}
                onChange={setFixName}
                required
              />
              <div className="sm:col-span-2">
                <FormField
                  label="Create Form 16 right after saving"
                  name="fix-create"
                  type="checkbox"
                  value={fixCreate}
                  onCheckboxChange={setFixCreate}
                  className="rounded-lg border border-border bg-muted/40 p-3"
                />
              </div>
            </div>

            <p className="rounded-lg bg-primary/10 p-3 text-sm text-foreground">
              A PAN has 10 characters: 5 letters, 4 numbers, then 1 letter. For
              example ABCDE1234F.
            </p>

            <DialogFooter>
              <Button type="button" variant="destructive" onClick={closeFix}>
                Cancel
              </Button>
              <Button type="submit">
                {fixQueue ? 'Save and go to next' : 'Save details'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(previewRecord)}
        onOpenChange={open => !open && setPreviewId(null)}
      >
        <DialogContent
          className="max-h-[92vh] overflow-y-auto sm:max-w-2xl"
          onInteractOutside={event => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Form 16 · {previewRecord?.name}</DialogTitle>
            <DialogDescription>
              Financial year {previewRecord?.fy} ·{' '}
              {previewRecord && maskPan(previewRecord.pan)} ·{' '}
              {previewRecord?.department}
            </DialogDescription>
          </DialogHeader>

          {previewRecord && partB && (
            <div className="space-y-4">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="mb-1 text-sm font-semibold text-foreground">
                    Part A · Tax your company deducted
                  </p>
                  <div className="divide-y divide-border text-sm">
                    {getQuarters(previewRecord.tax).map((amount, index) => (
                      <div
                        key={quarterNames[index]}
                        className="flex justify-between py-2.5"
                      >
                        <span className="text-muted-foreground">
                          {quarterNames[index]}
                        </span>
                        <span>{formatCurrency(amount)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between border-t-2 border-border py-2.5 font-bold">
                      <span>Total tax deducted</span>
                      <span>{formatCurrency(previewRecord.tax)}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="mb-1 text-sm font-semibold text-foreground">
                    Part B · Salary and tax
                  </p>
                  <div className="divide-y divide-border text-sm">
                    <div className="flex justify-between py-2.5">
                      <span className="text-muted-foreground">
                        Gross salary
                      </span>
                      <span>{formatCurrency(partB.gross)}</span>
                    </div>
                    <div className="flex justify-between py-2.5">
                      <span className="text-muted-foreground">
                        Standard deduction
                      </span>
                      <span> {formatCurrency(partB.deduction)}</span>
                    </div>
                    <div className="flex justify-between py-2.5">
                      <span className="text-muted-foreground">
                        Taxable income
                      </span>
                      <span>{formatCurrency(partB.taxable)}</span>
                    </div>
                    <div className="flex justify-between border-t-2 border-border py-2.5 font-bold">
                      <span>Tax to pay</span>
                      <span>{formatCurrency(partB.tax)}</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="rounded-lg bg-primary/10 p-3 text-sm text-foreground">
                Tax deducted matches the tax to pay. Nothing is left to collect.
              </p>
            </div>
          )}

          <DialogFooter className="gap-2 sm:justify-between">
            <Button
              type="button"
              variant="destructive"
              onClick={() => setPreviewId(null)}
            >
              Close
            </Button>
            {previewRecord && (
              <div className="flex flex-col-reverse gap-2 sm:flex-row">
                <Button
                  type="button"
                  variant="default"
                  onClick={() => downloadForm16(previewRecord)}
                >
                  <ArrowDownToLine className="h-4 w-4" aria-hidden="true" />
                  Download PDF
                </Button>
                {previewStatus === 'ready' && (
                  <Button
                    type="button"
                    onClick={() => {
                      generateOne(previewRecord);
                      setPreviewId(null);
                    }}
                  >
                    Generate Form 16
                  </Button>
                )}
                {previewStatus === 'generated' && (
                  <Button
                    type="button"
                    onClick={() => openShare([previewRecord.id])}
                  >
                    <Send className="h-4 w-4" aria-hidden="true" />
                    Share with {previewRecord.name.split(' ')[0]}
                  </Button>
                )}
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(shareIds)}
        onOpenChange={open => !open && setShareIds(null)}
      >
        <DialogContent
          className="sm:max-w-lg"
          onInteractOutside={event => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>
              Share Form 16 with {shareTargets.length}{' '}
              {shareTargets.length === 1 ? 'employee' : 'employees'}
            </DialogTitle>
            <DialogDescription>
              {shareTargets
                .slice(0, 3)
                .map(record => record.name)
                .join(', ')}
              {shareTargets.length > 3
                ? ` and ${shareTargets.length - 3} more`
                : ''}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleShare} className="space-y-5">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <FormField
                label="Email each employee"
                name="share-email"
                type="checkbox"
                value={shareEmail}
                onCheckboxChange={setShareEmail}
                className="rounded-lg border border-border bg-muted/40 p-3"
              />
              <FormField
                label="Show in their documents"
                name="share-docs"
                type="checkbox"
                value={shareDocs}
                onCheckboxChange={setShareDocs}
                className="rounded-lg border border-border bg-muted/40 p-3"
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="destructive"
                onClick={() => setShareIds(null)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={shareTargets.length === 0}>
                <Send className="h-4 w-4" aria-hidden="true" />
                Share now
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Form16Page;
