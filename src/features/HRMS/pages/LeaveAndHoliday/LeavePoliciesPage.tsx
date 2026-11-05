import { type FormEvent, useRef, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import {
  ArrowLeftRight,
  Calendar,
  CalendarDays,
  History,
  Plus,
  Sun,
} from 'lucide-react';
import { toast } from 'sonner';

import { FormField, TanStackTable } from '@/components/common';
import Section from '@/components/common/Section';
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
import {
  type CommonRulesForm,
  type LeavePolicy,
  type PolicyCompareRow,
  type PolicyForm,
  type StatusFilter,
  emptyPolicyForm,
  hasAnyLeave,
  initialCommonRules,
  initialPolicies,
  initialUnassignedCount,
  isStatusFilter,
  leaveTypeCount,
  leaveTypes,
  maxLeaveDays,
  maxPastDays,
  minNameLength,
  monthOptions,
  parseLeaveDays,
  parseRules,
  policyToForm,
  statusFilterOptions,
  getLeaveYearText,
  getPastDaysText,
  getYearlyDays,
} from './leave-policies/leavePolicyData';
import {
  CommonRuleItem,
  PolicyCard,
  SummaryStat,
} from './leave-policies/LeavePolicyComponents';
const LeavePoliciesPage = () => {
  const [policies, setPolicies] = useState(initialPolicies);
  const [commonRules, setCommonRules] = useState(initialCommonRules);
  const [unassignedCount, setUnassignedCount] = useState(
    initialUnassignedCount
  );
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [search] = useState('');
  const policySequence = useRef(initialPolicies.length);

  const [isPolicyOpen, setIsPolicyOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [policyForm, setPolicyForm] = useState<PolicyForm>(emptyPolicyForm);

  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [rulesForm, setRulesForm] = useState<CommonRulesForm>({
    yearStartMonth: initialCommonRules.yearStartMonth,
    halfDayAllowed: initialCommonRules.halfDayAllowed,
    countWeeklyOffs: initialCommonRules.countWeeklyOffs,
    pastDays: String(initialCommonRules.pastDays),
  });

  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [assignPolicyId, setAssignPolicyId] = useState('');

  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [compareIds, setCompareIds] = useState<[string, string]>(['', '']);

  const activePolicies = policies.filter(policy => policy.status === 'active');
  const draftCount = policies.filter(
    policy => policy.status === 'draft'
  ).length;
  const coveredEmployees = activePolicies
    .filter(policy => !policy.isAddOn)
    .reduce((total, policy) => total + policy.employeeCount, 0);
  const teamSize = coveredEmployees + unassignedCount;
  const coveragePercent =
    teamSize === 0 ? 0 : Math.round((coveredEmployees / teamSize) * 100);

  const statusCounts: Record<StatusFilter, number> = {
    all: policies.length,
    active: activePolicies.length,
    draft: draftCount,
    archived: policies.filter(policy => policy.status === 'archived').length,
  };

  const visiblePolicies = policies.filter(policy => {
    if (statusFilter !== 'all' && policy.status !== statusFilter) return false;
    const term = search.trim().toLowerCase();
    if (!term) return true;
    return [policy.name, policy.audience].some(text =>
      text.toLowerCase().includes(term)
    );
  });

  const assignOptions = activePolicies
    .filter(policy => !policy.isAddOn)
    .map(policy => ({ label: policy.name, value: policy.id }));

  const policyOptions = policies.map(policy => ({
    label: policy.name,
    value: policy.id,
  }));

  const findPolicy = (id: string) =>
    policies.find(policy => policy.id === id) ?? null;

  const updatePolicy = (id: string, changes: Partial<LeavePolicy>) =>
    setPolicies(current =>
      current.map(policy =>
        policy.id === id ? { ...policy, ...changes } : policy
      )
    );

  const updatePolicyForm = (changes: Partial<PolicyForm>) =>
    setPolicyForm(current => ({ ...current, ...changes }));

  const updateRulesForm = (changes: Partial<CommonRulesForm>) =>
    setRulesForm(current => ({ ...current, ...changes }));

  const openCreateDialog = () => {
    setEditingId(null);
    setPolicyForm(emptyPolicyForm);
    setIsPolicyOpen(true);
  };

  const openEditDialog = (policy: LeavePolicy) => {
    setEditingId(policy.id);
    setPolicyForm(policyToForm(policy));
    setIsPolicyOpen(true);
  };

  const closePolicyDialog = () => setIsPolicyOpen(false);

  const handleSavePolicy = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = policyForm.name.trim();
    if (name.length < minNameLength) {
      toast.error(
        `Enter a policy name of at least ${minNameLength} characters.`
      );
      return;
    }
    const nameTaken = policies.some(
      policy =>
        policy.id !== editingId &&
        policy.name.toLowerCase() === name.toLowerCase()
    );
    if (nameTaken) {
      toast.error('A policy with this name already exists.');
      return;
    }
    if (policyForm.audience.trim().length < minNameLength) {
      toast.error(
        'Say who this policy is for, for example "Contract employees".'
      );
      return;
    }
    const days = parseLeaveDays(policyForm.days);
    if (!days) {
      toast.error(
        `Enter leave days as whole numbers between 0 and ${maxLeaveDays}.`
      );
      return;
    }

    const details = {
      name,
      audience: policyForm.audience.trim(),
      days,
      hasCompOff: policyForm.hasCompOff,
      rules: parseRules(policyForm.rulesText),
    };

    if (editingId) {
      updatePolicy(editingId, details);
      toast.success(`${name} updated.`);
    } else {
      policySequence.current += 1;
      setPolicies(current => [
        ...current,
        {
          id: `policy-${policySequence.current}`,
          ...details,
          status: 'draft',
          employeeCount: 0,
          isAddOn: false,
          onLeaveNow: 0,
        },
      ]);
      setStatusFilter('all');
      toast.success(`${name} saved as a draft. Publish it when you are ready.`);
    }
    closePolicyDialog();
  };

  const handleArchive = (policy: LeavePolicy) => {
    if (policy.employeeCount > 0) {
      toast.error(
        `${policy.employeeCount} employees use this policy. Move them to another policy first.`
      );
      return;
    }
    updatePolicy(policy.id, { status: 'archived' });
    toast.success(`${policy.name} archived.`);
    closePolicyDialog();
  };

  const handleRestore = (policy: LeavePolicy) => {
    updatePolicy(policy.id, { status: 'draft' });
    toast.success(`${policy.name} restored as a draft.`);
  };

  const handleDuplicate = (policy: LeavePolicy) => {
    let name = `${policy.name} (copy)`;
    let copyNumber = 2;
    while (policies.some(item => item.name === name)) {
      name = `${policy.name} (copy ${copyNumber})`;
      copyNumber += 1;
    }

    policySequence.current += 1;
    setPolicies(current => [
      ...current,
      {
        ...policy,
        id: `policy-${policySequence.current}`,
        name,
        status: 'draft',
        employeeCount: 0,
        onLeaveNow: 0,
      },
    ]);
    toast.success(`${name} created as a draft.`);
  };

  const handlePublish = (policy: LeavePolicy) => {
    if (!hasAnyLeave(policy)) {
      toast.error('Add at least one leave type before publishing.');
      return;
    }
    updatePolicy(policy.id, { status: 'active' });
    toast.success(`${policy.name} is now live.`);
  };

  const openRulesDialog = () => {
    setRulesForm({
      yearStartMonth: commonRules.yearStartMonth,
      halfDayAllowed: commonRules.halfDayAllowed,
      countWeeklyOffs: commonRules.countWeeklyOffs,
      pastDays: String(commonRules.pastDays),
    });
    setIsRulesOpen(true);
  };

  const handleSaveRules = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const pastDays = Number(rulesForm.pastDays.trim() || '0');
    if (!Number.isInteger(pastDays) || pastDays < 0 || pastDays > maxPastDays) {
      toast.error(
        `Enter the past-date limit as days between 0 and ${maxPastDays}.`
      );
      return;
    }

    setCommonRules({
      yearStartMonth: rulesForm.yearStartMonth,
      halfDayAllowed: rulesForm.halfDayAllowed,
      countWeeklyOffs: rulesForm.countWeeklyOffs,
      pastDays,
    });
    toast.success('Rules for everyone updated.');
    setIsRulesOpen(false);
  };

  const openAssignDialog = () => {
    setAssignPolicyId(assignOptions[0]?.value ?? '');
    setIsAssignOpen(true);
  };

  const handleAssign = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const policy = findPolicy(assignPolicyId);
    if (!policy) {
      toast.error('Choose a policy for these employees.');
      return;
    }
    updatePolicy(policy.id, {
      employeeCount: policy.employeeCount + unassignedCount,
    });
    toast.success(`${unassignedCount} employees moved to ${policy.name}.`);
    setUnassignedCount(0);
    setIsAssignOpen(false);
  };

  const openCompareDialog = () => {
    const [first, second] = policies;
    if (!first || !second) {
      toast.error('Create at least two policies to compare them.');
      return;
    }
    setCompareIds([first.id, second.id]);
    setIsCompareOpen(true);
  };

  const comparePolicyA = findPolicy(compareIds[0]);
  const comparePolicyB = findPolicy(compareIds[1]);
  const getCompareRows = (a: LeavePolicy, b: LeavePolicy) => {
    const dayText = (days: number | undefined) =>
      days ? `${days} days` : 'â€”';
    return [
      { label: 'Applies to', a: a.audience, b: b.audience },
      {
        label: 'Days a year',
        a: dayText(getYearlyDays(a)),
        b: dayText(getYearlyDays(b)),
      },
      ...leaveTypes.map(type => ({
        label: type.label,
        a: dayText(a.days[type.id]),
        b: dayText(b.days[type.id]),
      })),
      {
        label: 'Comp-off',
        a: a.hasCompOff ? 'Added when earned' : 'â€”',
        b: b.hasCompOff ? 'Added when earned' : 'â€”',
      },
      {
        label: 'Employees',
        a: String(a.employeeCount),
        b: String(b.employeeCount),
      },
    ];
  };

  const compareRows: PolicyCompareRow[] =
    comparePolicyA && comparePolicyB
      ? getCompareRows(comparePolicyA, comparePolicyB).map(row => ({
          label: row.label,
          policyA: row.a,
          policyB: row.b,
          changed: row.a !== row.b,
        }))
      : [];
  const compareColumns: ColumnDef<PolicyCompareRow>[] = [
    {
      accessorKey: 'label',
      header: 'Policy detail',
      cell: ({ row }) => (
        <span className="font-medium text-foreground">
          {row.original.label}
        </span>
      ),
    },
    {
      accessorKey: 'policyA',
      header: comparePolicyA?.name ?? 'First policy',
      cell: ({ row }) => (
        <span
          className={
            row.original.changed ? 'font-medium ' : 'text-muted-foreground'
          }
        >
          {row.original.policyA}
        </span>
      ),
    },
    {
      accessorKey: 'policyB',
      header: comparePolicyB?.name ?? 'Second policy',
      cell: ({ row }) => (
        <span
          className={
            row.original.changed ? 'font-medium ' : 'text-muted-foreground'
          }
        >
          {row.original.policyB}
        </span>
      ),
    },
  ];

  return (
    <>
      <Section title="Leave policies" menuId="leave-policies" showBreadcrumbs>
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-end gap-3"></div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryStat
              label="Active policies"
              value={activePolicies.length}
              help={`${draftCount} more in draft`}
            />
            <SummaryStat
              label="Employees covered"
              value={coveredEmployees}
              help={`${coveragePercent}% of your team`}
            />
            <SummaryStat
              label="Leave types"
              value={leaveTypeCount}
              help="Casual, sick, earned and more"
            />
            <SummaryStat
              label="Without a policy"
              value={unassignedCount}
              help={
                unassignedCount > 0
                  ? 'Employees need one'
                  : 'Everyone has a policy'
              }
              tone={unassignedCount > 0 ? 'warning' : 'success'}
            >
              {unassignedCount > 0 && (
                <Button
                  type="button"
                  className="mt-2 w-full"
                  onClick={openAssignDialog}
                >
                  Assign now
                </Button>
              )}
            </SummaryStat>
          </div>

          <Card className="space-y-6 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-foreground">
                  Rules for everyone
                </h3>
                <p className="text-sm text-muted-foreground">
                  These apply to every policy below.
                </p>
              </div>
              <Button type="button" variant="default" onClick={openRulesDialog}>
                Edit rules
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
              <CommonRuleItem
                icon={Calendar}
                label="Leave year"
                value={getLeaveYearText(commonRules.yearStartMonth)}
              />
              <CommonRuleItem
                icon={Sun}
                label="Half-day leave"
                value={commonRules.halfDayAllowed ? 'Allowed' : 'Not allowed'}
              />
              <CommonRuleItem
                icon={CalendarDays}
                label="Weekly offs between leaves"
                value={commonRules.countWeeklyOffs ? 'Counted' : 'Not counted'}
              />
              <CommonRuleItem
                icon={History}
                label="Apply for past dates"
                value={getPastDaysText(commonRules.pastDays)}
              />
            </div>
          </Card>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div
              className="flex gap-1 rounded-xl border border-border bg-card p-1"
              role="group"
              aria-label="Filter policies"
            >
              {statusFilterOptions.map(option => {
                if (!isStatusFilter(option.value)) return null;
                const value = option.value;
                const isActive = statusFilter === value;
                return (
                  <Button
                    key={value}
                    type="button"
                    variant={isActive ? 'default' : 'ghost'}
                    aria-pressed={isActive}
                    className="h-10 gap-2 px-4"
                    onClick={() => setStatusFilter(value)}
                  >
                    {option.label}
                    <span
                      className={`rounded-full px-2 text-xs font-semibold ${
                        isActive
                          ? 'bg-primary-foreground/20 text-primary-foreground'
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      {statusCounts[value]}
                    </span>
                  </Button>
                );
              })}
            </div>
            <div className="ml-auto grid w-full grid-cols-2 gap-3 sm:w-auto">
              <Button variant="default" onClick={openCreateDialog}>
                <Plus className="w-4 h-4" />
                Create policy
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={openCompareDialog}
              >
                <ArrowLeftRight className="h-4 w-4" aria-hidden="true" />
                Compare policies
              </Button>
            </div>
          </div>

          {visiblePolicies.length === 0 ? (
            <Card className="border-2 border-dashed bg-transparent p-10 text-center text-sm text-muted-foreground shadow-none">
              No policies match your search.
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {visiblePolicies.map(policy => (
                <PolicyCard
                  key={policy.id}
                  policy={policy}
                  onEdit={() => openEditDialog(policy)}
                  onDuplicate={() => handleDuplicate(policy)}
                  onPublish={() => handlePublish(policy)}
                  onRestore={() => handleRestore(policy)}
                />
              ))}
            </div>
          )}
        </div>
      </Section>

      <Dialog
        open={isPolicyOpen}
        onOpenChange={open => !open && closePolicyDialog()}
      >
        <DialogContent
          className="max-h-[90vh] overflow-y-auto sm:max-w-2xl"
          onInteractOutside={event => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>
              {editingId ? 'Edit policy' : 'Create policy'}
            </DialogTitle>
            <DialogDescription>
              Leave empty any leave type this group should not get.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSavePolicy} className="space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <FormField
                label="Policy name"
                name="policy-name"
                value={policyForm.name}
                onChange={name => updatePolicyForm({ name })}
                placeholder="e.g. Contract staff policy"
                required
              />
              <FormField
                label="Who is it for?"
                name="policy-audience"
                value={policyForm.audience}
                onChange={audience => updatePolicyForm({ audience })}
                placeholder="e.g. Contract employees"
                required
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">
                Leave days per year
              </p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {leaveTypes.map(type => (
                  <FormField
                    key={type.id}
                    label={type.label}
                    name={`policy-days-${type.id}`}
                    value={policyForm.days[type.id]}
                    onChange={value =>
                      updatePolicyForm({
                        days: { ...policyForm.days, [type.id]: value },
                      })
                    }
                    placeholder="Days"
                  />
                ))}
              </div>
            </div>

            <FormField
              label="Allow comp-off (added when someone works on a day off)"
              name="policy-comp-off"
              type="checkbox"
              value={policyForm.hasCompOff}
              onCheckboxChange={hasCompOff => updatePolicyForm({ hasCompOff })}
              className="rounded-lg bg-muted/40 p-3"
            />

            <FormField
              label="Rules (one per line)"
              name="policy-rules"
              type="textarea"
              value={policyForm.rulesText}
              onChange={rulesText => updatePolicyForm({ rulesText })}
              placeholder={
                'Leave is added every month\nCarry forward up to 10 days'
              }
            />

            <DialogFooter className="gap-2 sm:justify-between">
              <div>
                {editingId && findPolicy(editingId)?.status === 'active' && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const policy = findPolicy(editingId);
                      if (policy) handleArchive(policy);
                    }}
                  >
                    Archive policy
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={closePolicyDialog}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingId ? 'Save changes' : 'Save as draft'}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isRulesOpen}
        onOpenChange={open => !open && setIsRulesOpen(false)}
      >
        <DialogContent
          className="sm:max-w-md"
          onInteractOutside={event => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Rules for everyone</DialogTitle>
            <DialogDescription>
              These apply to every policy, so change them with care.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveRules} className="space-y-4">
            <FormField
              label="Leave year starts in"
              name="rules-year-start"
              type="select"
              value={rulesForm.yearStartMonth}
              onChange={yearStartMonth => updateRulesForm({ yearStartMonth })}
              options={monthOptions}
              required
            />
            <FormField
              label="Allow half-day leave"
              name="rules-half-day"
              type="checkbox"
              value={rulesForm.halfDayAllowed}
              onCheckboxChange={halfDayAllowed =>
                updateRulesForm({ halfDayAllowed })
              }
              className="rounded-lg bg-muted/40 p-3"
            />
            <FormField
              label="Count weekly offs that fall between leaves"
              name="rules-weekly-offs"
              type="checkbox"
              value={rulesForm.countWeeklyOffs}
              onCheckboxChange={countWeeklyOffs =>
                updateRulesForm({ countWeeklyOffs })
              }
              className="rounded-lg bg-muted/40 p-3"
            />
            <FormField
              label="Apply for past dates up to (days, 0 = not allowed)"
              name="rules-past-days"
              value={rulesForm.pastDays}
              onChange={pastDays => updateRulesForm({ pastDays })}
              placeholder="e.g. 7"
            />

            <DialogFooter>
              <Button
                type="button"
                variant="destructive"
                onClick={() => setIsRulesOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save rules</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isAssignOpen}
        onOpenChange={open => !open && setIsAssignOpen(false)}
      >
        <DialogContent
          className="sm:max-w-md"
          onInteractOutside={event => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Assign a policy</DialogTitle>
            <DialogDescription>
              {unassignedCount} employees have no leave policy yet. Choose the
              one they should follow.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAssign} className="space-y-4">
            <FormField
              label="Policy"
              name="assign-policy"
              type="select"
              value={assignPolicyId}
              onChange={setAssignPolicyId}
              placeholder="Select policy"
              options={assignOptions}
              required
            />

            <DialogFooter>
              <Button
                type="button"
                variant="destructive"
                onClick={() => setIsAssignOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Assign {unassignedCount} employees</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isCompareOpen}
        onOpenChange={open => !open && setIsCompareOpen(false)}
      >
        <DialogContent
          className="max-h-[90vh] overflow-y-auto sm:max-w-3xl"
          onInteractOutside={event => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Compare policies</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FormField
              label="First policy"
              name="compare-first"
              type="select"
              value={compareIds[0]}
              onChange={value => setCompareIds([value, compareIds[1]])}
              options={policyOptions}
            />
            <FormField
              label="Second policy"
              name="compare-second"
              type="select"
              value={compareIds[1]}
              onChange={value => setCompareIds([compareIds[0], value])}
              options={policyOptions}
            />
          </div>

          {comparePolicyA && comparePolicyB && (
            <TanStackTable
              data={compareRows}
              columns={compareColumns}
              enableSearch={false}
              enableSorting={false}
              enablePagination={false}
              hideFooter
              emptyMessage="No comparison details available."
            />
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="destructive"
              onClick={() => setIsCompareOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LeavePoliciesPage;
