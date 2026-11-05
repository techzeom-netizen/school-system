import { type FormEvent, useMemo, useRef, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Pencil, Plus, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';

import FormField from '@/components/common/FormField';
import Section from '@/components/common/Section';
import { TanStackTable } from '@/components/common';
import {
  salaryStructureBasicMethodOptions,
  salaryStructurePayKindOptions,
  salaryStructurePayMethodOptions,
  salaryStructureStartOptions,
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

interface SplitRow {
  part: SalaryPart;
  monthly: number;
  yearly: number;
  color: string;
}

type PayMethod = 'ctc' | 'basic' | 'fixed' | 'rest';
type PayKind = 'employee' | 'company';

interface SalaryPart {
  id: string;
  name: string;
  method: PayMethod;
  value: number;
  kind: PayKind;
}

interface SalaryStructure {
  id: string;
  name: string;
  description: string;
  employees: number;
  employeePf: boolean;
  parts: SalaryPart[];
}

interface DraftPart {
  id: string;
  name: string;
  method: PayMethod;
  value: string;
  kind: PayKind;
}

interface Draft {
  name: string;
  description: string;
  employeePf: boolean;
  parts: DraftPart[];
}

const maxYearlyPay = 100000000;
const defaultYearlyPay = 780000;
const employeePfRate = 12;
const maxSalaryParts = 10;

const initialSalaryStructures: SalaryStructure[] = [
  {
    id: 'STR-001',
    name: 'Standard',
    description: 'Default monthly salary structure',
    employees: 42,
    employeePf: true,
    parts: [
      {
        id: 'PART-001',
        name: 'Basic pay',
        method: 'ctc',
        value: 40,
        kind: 'employee',
      },
      {
        id: 'PART-002',
        name: 'House rent (HRA)',
        method: 'basic',
        value: 50,
        kind: 'employee',
      },
      {
        id: 'PART-003',
        name: 'Special allowance',
        method: 'rest',
        value: 0,
        kind: 'employee',
      },
    ],
  },
  {
    id: 'STR-002',
    name: 'Leadership',
    description: 'Salary structure for leadership roles',
    employees: 8,
    employeePf: true,
    parts: [
      {
        id: 'PART-004',
        name: 'Basic pay',
        method: 'ctc',
        value: 45,
        kind: 'employee',
      },
      {
        id: 'PART-005',
        name: 'House rent (HRA)',
        method: 'basic',
        value: 50,
        kind: 'employee',
      },
      {
        id: 'PART-006',
        name: 'Special allowance',
        method: 'rest',
        value: 0,
        kind: 'employee',
      },
    ],
  },
  {
    id: 'STR-003',
    name: 'Contractor',
    description: 'Monthly pay without employee PF deduction',
    employees: 5,
    employeePf: false,
    parts: [
      {
        id: 'PART-007',
        name: 'Basic pay',
        method: 'ctc',
        value: 40,
        kind: 'employee',
      },
      {
        id: 'PART-008',
        name: 'House rent (HRA)',
        method: 'basic',
        value: 40,
        kind: 'employee',
      },
      {
        id: 'PART-009',
        name: 'Special allowance',
        method: 'rest',
        value: 0,
        kind: 'employee',
      },
    ],
  },
];

const dotColors = [
  'bg-primary',
  'bg-secondary-foreground',
  'bg-accent-foreground',
  'bg-muted-foreground',
  'bg-primary/60',
  'bg-secondary-foreground/60',
  'bg-accent-foreground/60',
  'bg-muted-foreground/60',
];

const formatCurrency = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

// Reads "6,00,000" or "600000". Returns null when it is not a plain number.
const parseNumber = (text: string) => {
  const cleaned = text.replace(/[,\s]/g, '');
  if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) return null;
  return Number(cleaned);
};

const describeRule = (part: SalaryPart) => {
  switch (part.method) {
    case 'ctc':
      return `${part.value}% of yearly pay`;
    case 'basic':
      return `${part.value}% of basic pay`;
    case 'fixed':
      return `Fixed ${formatCurrency(part.value)} a month`;
    default:
      return 'Whatever is left';
  }
};

const computeSplit = (parts: SalaryPart[], yearlyPay: number) => {
  const monthlyTotal = Math.round(yearlyPay / 12);
  const basic = parts[0];
  const basicYearly =
    basic.method === 'fixed'
      ? basic.value * 12
      : Math.round((yearlyPay * basic.value) / 100);

  const rows: SplitRow[] = parts.map((part, index) => {
    let yearly = 0;
    if (index === 0) yearly = basicYearly;
    else if (part.method === 'ctc')
      yearly = Math.round((yearlyPay * part.value) / 100);
    else if (part.method === 'basic')
      yearly = Math.round((basicYearly * part.value) / 100);
    else if (part.method === 'fixed') yearly = part.value * 12;
    const monthly =
      part.method === 'fixed' ? part.value : Math.round(yearly / 12);
    return {
      part,
      yearly,
      monthly,
      color: dotColors[index % dotColors.length],
    };
  });

  const others = rows.filter(row => row.part.method !== 'rest');
  const restRow = rows.find(row => row.part.method === 'rest');
  if (restRow) {
    restRow.yearly =
      yearlyPay - others.reduce((total, row) => total + row.yearly, 0);
    restRow.monthly =
      monthlyTotal - others.reduce((total, row) => total + row.monthly, 0);
  }

  const employeeMonthly = rows
    .filter(row => row.part.kind === 'employee')
    .reduce((total, row) => total + row.monthly, 0);

  return {
    rows,
    monthlyTotal,
    basicYearly,
    employeeMonthly,
    isOver: restRow ? restRow.yearly < 0 : false,
  };
};

const toDraft = (structure: SalaryStructure): Draft => ({
  name: structure.name,
  description: structure.description,
  employeePf: structure.employeePf,
  parts: structure.parts.map(part => ({
    id: part.id,
    name: part.name,
    method: part.method,
    value: part.method === 'rest' ? '' : String(part.value),
    kind: part.kind,
  })),
});

const splitColumns: ColumnDef<SplitRow>[] = [
  {
    id: 'part',
    header: 'Part of pay',
    cell: ({ row }) => (
      <div className="flex items-start gap-2">
        <span
          className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-sm ${row.original.color}`}
          aria-hidden="true"
        />
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-2 font-semibold">
            {row.original.part.name}
            {row.original.part.kind === 'company' && (
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-normal text-muted-foreground">
                Paid by company
              </span>
            )}
          </p>
          <p className="text-xs text-muted-foreground">
            {describeRule(row.original.part)}
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 'monthly',
    header: 'Per month',
    cell: ({ row }) => (
      <span className="block whitespace-nowrap text-right">
        {formatCurrency(row.original.monthly)}
      </span>
    ),
  },
  {
    id: 'yearly',
    header: 'Per year',
    cell: ({ row }) => (
      <span className="block whitespace-nowrap text-right font-semibold">
        {formatCurrency(row.original.yearly)}
      </span>
    ),
  },
];

const SalaryStructurePage = () => {
  const [structures, setStructures] = useState<SalaryStructure[]>(
    initialSalaryStructures
  );
  const [selectedId, setSelectedId] = useState(
    initialSalaryStructures[0]?.id ?? ''
  );
  const [yearlyText, setYearlyText] = useState(String(defaultYearlyPay));

  const [dialogMode, setDialogMode] = useState<'new' | 'edit' | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [startFrom, setStartFrom] = useState('blank');

  const [deleteOpen, setDeleteOpen] = useState(false);

  const nextStructure = useRef(initialSalaryStructures.length);
  const nextPart = useRef(100);
  const makePartId = () => {
    nextPart.current += 1;
    return `PART-${nextPart.current}`;
  };

  const selected =
    structures.find(structure => structure.id === selectedId) ?? structures[0];

  const yearlyPay = parseNumber(yearlyText);
  const isYearlyValid =
    yearlyPay !== null && yearlyPay > 0 && yearlyPay <= maxYearlyPay;

  const split = useMemo(
    () =>
      selected && isYearlyValid
        ? computeSplit(selected.parts, yearlyPay as number)
        : null,
    [selected, isYearlyValid, yearlyPay]
  );

  const employeePfMonthly =
    selected && split && selected.employeePf
      ? Math.round((split.basicYearly * employeePfRate) / 100 / 12)
      : 0;
  const takeHome = split ? split.employeeMonthly - employeePfMonthly : 0;

  const blankParts = (): DraftPart[] => [
    {
      id: makePartId(),
      name: 'Basic pay',
      method: 'ctc',
      value: '40',
      kind: 'employee',
    },
    {
      id: makePartId(),
      name: 'House rent (HRA)',
      method: 'basic',
      value: '50',
      kind: 'employee',
    },
    {
      id: makePartId(),
      name: 'Special allowance',
      method: 'rest',
      value: '',
      kind: 'employee',
    },
  ];

  const openNew = () => {
    setStartFrom('blank');
    setDraft({
      name: '',
      description: '',
      employeePf: true,
      parts: blankParts(),
    });
    setDialogMode('new');
  };

  const openEdit = () => {
    if (!selected) return;
    setDraft(toDraft(selected));
    setDialogMode('edit');
  };

  const closeDialog = () => {
    setDialogMode(null);
    setDraft(null);
  };

  const handleStartFrom = (value: string) => {
    setStartFrom(value);
    const source = structures.find(structure => structure.id === value);
    setDraft(current =>
      current
        ? {
            ...current,
            employeePf: source ? source.employeePf : true,
            parts: source
              ? toDraft(source).parts.map(part => ({
                  ...part,
                  id: makePartId(),
                }))
              : blankParts(),
          }
        : current
    );
  };

  const updateDraft = (changes: Partial<Draft>) =>
    setDraft(current => (current ? { ...current, ...changes } : current));

  const updatePart = (id: string, changes: Partial<DraftPart>) =>
    setDraft(current =>
      current
        ? {
            ...current,
            parts: current.parts.map(part =>
              part.id === id ? { ...part, ...changes } : part
            ),
          }
        : current
    );

  const addPart = () => {
    if (!draft) return;
    if (draft.parts.length >= maxSalaryParts) {
      toast.error(`You can add up to ${maxSalaryParts} parts.`);
      return;
    }
    updateDraft({
      parts: [
        ...draft.parts,
        {
          id: makePartId(),
          name: '',
          method: 'fixed',
          value: '',
          kind: 'employee',
        },
      ],
    });
  };

  const removePart = (id: string) => {
    if (!draft) return;
    updateDraft({ parts: draft.parts.filter(part => part.id !== id) });
  };

  const validate = (): SalaryPart[] | null => {
    if (!draft) return null;

    const name = draft.name.trim();
    if (!name) {
      toast.error('Give this structure a name.');
      return null;
    }
    if (name.length > 40) {
      toast.error('Keep the structure name under 40 letters.');
      return null;
    }
    const duplicate = structures.some(
      structure =>
        structure.id !== (dialogMode === 'edit' ? selected?.id : '') &&
        structure.name.toLowerCase() === name.toLowerCase()
    );
    if (duplicate) {
      toast.error('A structure with this name already exists.');
      return null;
    }

    if (draft.parts.length < 2) {
      toast.error('Add at least two parts of pay.');
      return null;
    }

    const names = new Set<string>();
    const parts: SalaryPart[] = [];
    for (let index = 0; index < draft.parts.length; index += 1) {
      const item = draft.parts[index];
      const partName = item.name.trim();
      if (!partName) {
        toast.error('Every part needs a name.');
        return null;
      }
      if (partName.length > 30) {
        toast.error(`Keep "${partName.slice(0, 12)}…" under 30 letters.`);
        return null;
      }
      if (names.has(partName.toLowerCase())) {
        toast.error(`"${partName}" is added twice.`);
        return null;
      }
      names.add(partName.toLowerCase());

      let value = 0;
      if (item.method !== 'rest') {
        const parsed = parseNumber(item.value);
        if (parsed === null) {
          toast.error(`Enter a number for ${partName}.`);
          return null;
        }
        if (item.method === 'fixed') {
          if (!Number.isInteger(parsed) || parsed > maxYearlyPay) {
            toast.error(`${partName}: enter a whole rupee amount.`);
            return null;
          }
          if (index === 0 && parsed <= 0) {
            toast.error('Basic pay must be more than ₹0.');
            return null;
          }
        } else if (parsed <= 0 || parsed > 100) {
          toast.error(`${partName}: enter a percentage between 1 and 100.`);
          return null;
        }
        value = parsed;
      }
      parts.push({
        id: item.id,
        name: partName,
        method: item.method,
        value,
        kind: item.kind,
      });
    }

    if (parts.filter(part => part.method === 'rest').length !== 1) {
      toast.error(
        'Choose exactly one part as "Whatever is left" so the total always matches.'
      );
      return null;
    }
    if (parts[0].kind !== 'employee') {
      toast.error('Basic pay must go to the employee.');
      return null;
    }

    const check = computeSplit(parts, defaultYearlyPay);
    if (check.isOver) {
      toast.error(
        `These parts add up to more than ${formatCurrency(defaultYearlyPay)}. Lower a value.`
      );
      return null;
    }
    return parts;
  };

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft) return;
    const parts = validate();
    if (!parts) return;

    if (dialogMode === 'edit' && selected) {
      setStructures(current =>
        current.map(structure =>
          structure.id === selected.id
            ? {
                ...structure,
                name: draft.name.trim(),
                description: draft.description.trim(),
                employeePf: draft.employeePf,
                parts,
              }
            : structure
        )
      );
      toast.success(`${draft.name.trim()} structure saved.`);
    } else {
      nextStructure.current += 1;
      const id = `STR-${nextStructure.current}`;
      setStructures(current => [
        ...current,
        {
          id,
          name: draft.name.trim(),
          description: draft.description.trim(),
          employees: 0,
          employeePf: draft.employeePf,
          parts,
        },
      ]);
      setSelectedId(id);
      toast.success(`${draft.name.trim()} structure added.`);
    }
    closeDialog();
  };

  const handleDelete = () => {
    if (!selected) return;
    if (selected.employees > 0) {
      toast.error(
        `${selected.employees} employees use this structure. Move them first.`
      );
      setDeleteOpen(false);
      return;
    }
    const remaining = structures.filter(
      structure => structure.id !== selected.id
    );
    setStructures(remaining);
    setSelectedId(remaining[0]?.id ?? '');
    toast.success(`${selected.name} structure deleted.`);
    setDeleteOpen(false);
  };

  return (
    <>
      <Section
        title=" Salary Structure"
        menuId="salary-structure"
        showBreadcrumbs
      >
        <div className="space-y-4">
          {structures.length === 0 || !selected ? (
            <Card className="space-y-3 p-6 text-center">
              <p className="text-sm text-muted-foreground">
                You have no salary structure yet.
              </p>
              <div>
                <Button type="button" onClick={openNew}>
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  New structure
                </Button>
              </div>
            </Card>
          ) : (
            <>
              <div className="flex gap-3 justify-end">
                <Button type="button" onClick={openNew}>
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  New structure
                </Button>
              </div>
              <div
                role="group"
                aria-label="Salary structures"
                className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
              >
                {structures.map(structure => {
                  const isActive = structure.id === selected.id;
                  return (
                    <Button
                      key={structure.id}
                      type="button"
                      variant={isActive ? 'default' : 'outline'}
                      aria-pressed={isActive}
                      onClick={() => setSelectedId(structure.id)}
                      className={`h-auto w-full flex-col items-start gap-1 whitespace-normal rounded-lg border-2 p-4 text-left text-foreground hover:text-foreground ${
                        isActive
                          ? 'border-primary bg-primary/5 hover:bg-primary/5 dark:bg-primary/5 dark:hover:bg-primary/5'
                          : 'border-border bg-card hover:bg-card dark:bg-card dark:hover:bg-card'
                      }`}
                    >
                      {isActive && (
                        <span className="mb-1 self-start rounded-full px-2.5 py-0.5 text-xs font-semibold text-primary">
                          Showing below
                        </span>
                      )}
                      <span className="text-base font-semibold text-foreground">
                        {structure.name}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {structure.description || 'No description'}
                      </span>
                      <span className="mt-2 flex items-baseline gap-1.5">
                        <span className="text-2xl font-bold text-foreground">
                          {structure.employees}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {structure.employees === 1 ? 'employee' : 'employees'}
                        </span>
                      </span>
                    </Button>
                  );
                })}
              </div>

              <Section
                title={`${selected.name} structure`}
                contentClassName="space-y-4 p-3 sm:p-5"
              >
                <div className="flex flex-wrap items-end justify-start gap-3">
                  <div className="flex flex-wrap items-end gap-2">
                    <div className="w-44">
                      <FormField
                        label="Yearly pay (₹)"
                        name="salary-yearly-pay"
                        value={yearlyText}
                        onChange={setYearlyText}
                        placeholder="600000"
                      />
                    </div>
                    <Button type="button" variant="default" onClick={openEdit}>
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                      Edit structure
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => setDeleteOpen(true)}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                      Delete
                    </Button>
                  </div>
                </div>

                {!isYearlyValid || !split ? (
                  <p className="rounded-md bg-muted px-3 py-6 text-center text-sm text-muted-foreground">
                    Enter a yearly pay between ₹1 and{' '}
                    {formatCurrency(maxYearlyPay)}, for example 600000.
                  </p>
                ) : (
                  <>
                    <div
                      className="flex h-4 gap-0.5 overflow-hidden rounded-full bg-muted"
                      role="img"
                      aria-label="How the yearly pay is split"
                    >
                      {split.rows.map(row => (
                        <span
                          key={row.part.id}
                          className={`h-full ${row.color}`}
                          style={{
                            width: `${Math.max(0, (row.yearly / (yearlyPay as number)) * 100)}%`,
                          }}
                        />
                      ))}
                    </div>

                    {split.isOver && (
                      <p
                        className="rounded-md bg-destructive/10 px-3 py-2 text-sm font-semibold text-destructive"
                        role="alert"
                      >
                        This yearly pay is too low for the fixed amounts in this
                        structure.
                      </p>
                    )}

                    <div className="overflow-x-auto">
                      <TanStackTable
                        data={split.rows}
                        columns={splitColumns}
                        getRowId={row => row.part.id}
                        enableSearch={false}
                        showDownload={true}
                        enableSorting={false}
                        enableColumnVisibility={false}
                        enablePagination={false}
                        hideFooter
                      />
                    </div>

                    <div className="flex items-center justify-between rounded-md bg-muted px-3 py-2.5 text-sm font-semibold">
                      <span>Total</span>
                      <span>
                        {formatCurrency(split.monthlyTotal)} a month ·{' '}
                        {formatCurrency(yearlyPay as number)} a year
                      </span>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="rounded-lg bg-primary/10 p-4 text-primary">
                        <p className="text-2xl font-bold">
                          {formatCurrency(takeHome)}
                        </p>
                        <p className="text-sm">
                          Employee gets about this each month before tax
                        </p>
                      </div>
                      <div className="rounded-lg bg-secondary p-4 text-secondary-foreground">
                        <p className="text-2xl font-bold">
                          {formatCurrency(employeePfMonthly)}
                        </p>
                        <p className="text-sm">
                          {selected.employeePf
                            ? 'Employee PF taken from pay each month'
                            : 'No PF is taken in this structure'}
                        </p>
                      </div>
                      <div className="rounded-lg bg-accent p-4 text-accent-foreground">
                        <p className="text-2xl font-bold">
                          {selected.employees}{' '}
                          {selected.employees === 1 ? 'employee' : 'employees'}
                        </p>
                        <p className="text-sm">use this structure today</p>
                      </div>
                    </div>
                  </>
                )}
              </Section>
            </>
          )}
        </div>

        <Dialog
          open={dialogMode !== null && draft !== null}
          onOpenChange={open => {
            if (!open) closeDialog();
          }}
        >
          <DialogContent
            className="max-h-[90vh] overflow-y-auto sm:max-w-2xl"
            onInteractOutside={event => event.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle>
                {dialogMode === 'new'
                  ? 'New salary structure'
                  : 'Edit structure'}
              </DialogTitle>
              <DialogDescription>
                The first part is always the basic pay. Choose one part as
                &quot;Whatever is left&quot; so the total always matches.
              </DialogDescription>
            </DialogHeader>
            {draft && (
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-3">
                  {dialogMode === 'new' && (
                    <FormField
                      label="Start from"
                      name="salary-start-from"
                      type="select"
                      value={startFrom}
                      onChange={handleStartFrom}
                      options={[
                        ...salaryStructureStartOptions,
                        ...structures.map(structure => ({
                          value: structure.id,
                          label: `A copy of ${structure.name}`,
                        })),
                      ]}
                    />
                  )}
                  <FormField
                    label="Structure name"
                    name="salary-name"
                    value={draft.name}
                    onChange={value => updateDraft({ name: value })}
                    placeholder="For example: Support team"
                    required
                  />
                  <FormField
                    label="Short description"
                    name="salary-description"
                    value={draft.description}
                    onChange={value => updateDraft({ description: value })}
                    placeholder="Who is it for?"
                  />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border p-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Take employee PF from pay
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {employeePfRate}% of basic pay is kept as PF each month.
                    </p>
                  </div>
                  <FormField
                    label="Take employee PF from pay"
                    name="salary-employee-pf"
                    type="toggle"
                    value={draft.employeePf}
                    onToggleChange={() =>
                      updateDraft({ employeePf: !draft.employeePf })
                    }
                    toggleActiveLabel="Yes"
                    toggleInactiveLabel="No"
                  />
                </div>

                <div className="space-y-3">
                  {draft.parts.map((part, index) => (
                    <div
                      key={part.id}
                      className="space-y-3 rounded-lg border border-border p-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-foreground">
                          {index === 0 ? 'Basic pay' : `Part ${index + 1}`}
                        </p>
                        {index > 0 && (
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            aria-label={`Remove ${part.name || `part ${index + 1}`}`}
                            onClick={() => removePart(part.id)}
                          >
                            <X className="h-4 w-4" aria-hidden="true" /> Remove
                          </Button>
                        )}
                      </div>
                      <div className="grid gap-3 sm:grid-cols-3">
                        {index > 0 && (
                          <FormField
                            label="Name"
                            name={`salary-part-${part.id}-name`}
                            value={part.name}
                            onChange={value =>
                              updatePart(part.id, { name: value })
                            }
                            placeholder="For example: Conveyance"
                          />
                        )}
                        <FormField
                          label="How it is worked out"
                          name={`salary-part-${part.id}-method`}
                          type="select"
                          value={part.method}
                          onChange={value =>
                            updatePart(part.id, {
                              method: value as PayMethod,
                              value: value === 'rest' ? '' : part.value,
                            })
                          }
                          options={
                            index === 0
                              ? salaryStructureBasicMethodOptions
                              : salaryStructurePayMethodOptions
                          }
                        />
                        {part.method !== 'rest' && (
                          <FormField
                            label={
                              part.method === 'fixed'
                                ? 'Amount a month (₹)'
                                : 'Percentage (%)'
                            }
                            name={`salary-part-${part.id}-value`}
                            value={part.value}
                            onChange={value => updatePart(part.id, { value })}
                            placeholder={
                              part.method === 'fixed' ? '1600' : '40'
                            }
                          />
                        )}
                        {index > 0 && (
                          <FormField
                            label="Who gets it"
                            name={`salary-part-${part.id}-kind`}
                            type="select"
                            value={part.kind}
                            onChange={value =>
                              updatePart(part.id, { kind: value as PayKind })
                            }
                            options={salaryStructurePayKindOptions}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addPart}>
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    Add a part
                  </Button>
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={closeDialog}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {dialogMode === 'new' ? 'Add structure' : 'Save changes'}
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <DialogContent
            className="sm:max-w-md"
            onInteractOutside={event => event.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle>Delete this structure?</DialogTitle>
              <DialogDescription>
                {selected && selected.employees > 0
                  ? `${selected.employees} employees use ${selected.name}. Move them to another structure before you delete it.`
                  : selected
                    ? `${selected.name} will be removed. This cannot be undone.`
                    : ''}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                type="button"
                variant="destructive"
                onClick={() => setDeleteOpen(false)}
              >
                Cancel
              </Button>
              <Button type="button" variant="outline" onClick={handleDelete}>
                Delete structure
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Section>
    </>
  );
};

export default SalaryStructurePage;
