import { type FormEvent, useMemo, useRef, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import {
  Armchair,
  CheckCircle2,
  Laptop,
  Monitor,
  Package,
  Plus,
  Printer,
  Smartphone,
  Upload,
  UserCheck,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import { toast } from 'sonner';

import FormField from '@/components/common/FormField';
import Section from '@/components/common/Section';
import { TanStackTable } from '@/components/common';
import {
  initialInventory,
  inventoryCategoryFilterOptions,
  inventoryCategoryOptions,
  inventoryDepartmentFilterOptions,
  inventoryEmployeeOptions,
  inventoryEmployees,
  inventoryStatusFilterOptions,
  inventoryStatusLabels,
  type InventoryAsset,
  type InventoryCategory,
  type InventoryEmployee,
  type InventoryHistoryEntry,
  type InventoryStatus,
  type InventoryStatusFilter,
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

type WarrantyLevel = 'valid' | 'soon' | 'expired' | 'none';

const categoryIcons: Record<InventoryCategory, LucideIcon> = {
  laptop: Laptop,
  mobile: Smartphone,
  monitor: Monitor,
  furniture: Armchair,
  printer: Printer,
};

const statusBadgeClass: Record<InventoryStatus, string> = {
  allocated: 'bg-primary/10 text-primary',
  available: 'bg-primary/10 text-primary',
  maintenance: 'bg-accent text-accent-foreground',
  retired: 'bg-muted text-muted-foreground',
};

const statusDotClass: Record<InventoryStatus, string> = {
  allocated: 'bg-primary',
  available: 'bg-primary',
  maintenance: 'bg-accent-foreground',
  retired: 'bg-muted-foreground',
};

const warrantyTextClass: Record<WarrantyLevel, string> = {
  valid: 'text-primary',
  soon: 'text-accent-foreground',
  expired: 'text-destructive',
  none: 'text-muted-foreground',
};

const avatarClasses = [
  'bg-primary/10 text-primary',
  'bg-secondary text-secondary-foreground',
  'bg-accent text-accent-foreground',
  'bg-muted text-muted-foreground',
  'bg-primary/10 text-primary',
];

const warrantySoonDays = 30;
const minNameLength = 3;

const formatDate = (date: string) =>
  new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date.length === 10 ? `${date}T00:00:00` : date));

const formatDateTime = (date: string) =>
  new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date));

const formatMonthYear = (date: string) =>
  new Intl.DateTimeFormat('en-GB', {
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${date}T00:00:00`));

const todayIso = () => new Date().toLocaleDateString('en-CA');

const daysUntil = (date: string) => {
  const today = new Date(`${todayIso()}T00:00:00`).getTime();
  const target = new Date(`${date}T00:00:00`).getTime();
  return Math.round((target - today) / 86_400_000);
};

const getWarranty = (
  asset: InventoryAsset
): {
  level: WarrantyLevel;
  label: string;
} => {
  if (!asset.warrantyEnds) return { level: 'none', label: 'No warranty' };
  const days = daysUntil(asset.warrantyEnds);
  if (days < 0) return { level: 'expired', label: 'Expired' };
  if (days <= warrantySoonDays) {
    return {
      level: 'soon',
      label:
        days === 0
          ? 'Ends today'
          : `Ends in ${days} ${days === 1 ? 'day' : 'days'}`,
    };
  }
  return {
    level: 'valid',
    label: `Valid until ${formatMonthYear(asset.warrantyEnds)}`,
  };
};

const needsAttention = (asset: InventoryAsset) => {
  const { level } = getWarranty(asset);
  return level === 'soon' || level === 'expired';
};

const findEmployee = (id: string | null): InventoryEmployee | null =>
  inventoryEmployees.find(employee => employee.id === id) ?? null;

const getInitials = (name: string) =>
  name
    .split(' ')
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

const isStatusFilter = (value: string): value is InventoryStatusFilter =>
  inventoryStatusFilterOptions.some(option => option.value === value);

const isCategory = (value: string): value is InventoryCategory =>
  inventoryCategoryOptions.some(option => option.value === value);

const InventoryStatusBadge = ({ status }: { status: InventoryStatus }) => (
  <Badge className={`gap-2 border-transparent ${statusBadgeClass[status]}`}>
    <span
      className={`h-2 w-2 shrink-0 rounded-full ${statusDotClass[status]}`}
      aria-hidden="true"
    />
    {inventoryStatusLabels[status]}
  </Badge>
);

const SummaryCard = ({
  icon: Icon,
  label,
  value,
  help,
  tone,
  isActive,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  help: string;
  tone: 'primary' | 'success' | 'warning';
  isActive: boolean;
  onClick: () => void;
}) => {
  const toneClass = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-primary/10 text-primary',
    warning: 'bg-accent text-accent-foreground',
  }[tone];

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className="rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    >
      <Card
        className={`flex items-center gap-4 p-4 transition-colors hover:bg-muted/40 ${
          isActive ? 'border-primary ring-1 ring-primary' : 'border-border'
        }`}
      >
        <span
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${toneClass}`}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold text-card-foreground">{value}</p>
          <p className="text-xs text-muted-foreground">{help}</p>
        </div>
      </Card>
    </button>
  );
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-start justify-between gap-4 border-b border-border py-2 text-sm last:border-b-0">
    <span className="font-medium">{label}</span>
    <span className="text-right text-muted-foreground">{value}</span>
  </div>
);

const createInventoryColumns = ({
  onAssign,
  onView,
}: {
  onAssign: (asset: InventoryAsset) => void;
  onView: (asset: InventoryAsset) => void;
}): ColumnDef<InventoryAsset>[] => [
  {
    accessorKey: 'name',
    header: 'Asset',
    cell: ({ row }) => {
      const asset = row.original;
      const Icon = categoryIcons[asset.category];
      const categoryLabel =
        inventoryCategoryOptions.find(option => option.value === asset.category)
          ?.label ?? asset.category;
      return (
        <div className="flex min-w-60 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="font-semibold text-foreground">{asset.name}</p>
            <p className="text-xs text-muted-foreground">
              {asset.tag} · {categoryLabel}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    id: 'employee',
    header: 'Assigned to',
    accessorFn: asset => findEmployee(asset.employeeId)?.name ?? '',
    cell: ({ row }) => {
      const employee = findEmployee(row.original.employeeId);
      if (!employee) {
        return (
          <span className="whitespace-nowrap text-muted-foreground">
            Not assigned yet
          </span>
        );
      }
      const index = inventoryEmployees.findIndex(
        item => item.id === employee.id
      );
      return (
        <div className="flex min-w-48 items-center gap-3">
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
              avatarClasses[index % avatarClasses.length]
            }`}
            aria-hidden="true"
          >
            {getInitials(employee.name)}
          </span>
          <div className="min-w-0">
            <p className="font-medium text-foreground">{employee.name}</p>
            <p className="text-xs text-muted-foreground">
              {employee.department}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <InventoryStatusBadge status={row.original.status} />,
  },
  {
    accessorKey: 'warrantyEnds',
    header: 'Warranty',
    cell: ({ row }) => {
      const warranty = getWarranty(row.original);
      return (
        <span
          className={`whitespace-nowrap text-sm font-medium ${warrantyTextClass[warranty.level]}`}
        >
          {warranty.label}
        </span>
      );
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    enableSorting: false,
    cell: ({ row }) => {
      const asset = row.original;
      if (asset.status === 'available') {
        return (
          <Button type="button" size="sm" onClick={() => onAssign(asset)}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            Assign
          </Button>
        );
      }
      return (
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => onView(asset)}
        >
          View details
        </Button>
      );
    },
  },
];

const AssetsInventoryPage = () => {
  const [assets, setAssets] = useState(initialInventory);
  const [statusFilter, setStatusFilter] =
    useState<InventoryStatusFilter>('all');
  const [search] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [attentionOnly, setAttentionOnly] = useState(false);
  const tagSequence = useRef(initialInventory.length);

  const [assignIds, setAssignIds] = useState<string[] | null>(null);
  const [assignEmployeeId, setAssignEmployeeId] = useState(
    inventoryEmployeeOptions[0]?.value ?? ''
  );

  const [viewId, setViewId] = useState<string | null>(null);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<InventoryCategory>('laptop');
  const [newSerial, setNewSerial] = useState('');
  const [newWarrantyEnds, setNewWarrantyEnds] = useState('');

  const viewAsset = assets.find(asset => asset.id === viewId) ?? null;
  const viewEmployee = findEmployee(viewAsset?.employeeId ?? null);

  const countByStatus = (status: InventoryStatus) =>
    assets.filter(asset => asset.status === status).length;
  const statusCounts: Record<InventoryStatusFilter, number> = {
    all: assets.length,
    allocated: countByStatus('allocated'),
    available: countByStatus('available'),
    maintenance: countByStatus('maintenance'),
    retired: countByStatus('retired'),
  };

  const attentionAssets = assets.filter(needsAttention);

  const visibleAssets = useMemo(() => {
    const term = search.trim().toLowerCase();
    return assets.filter(asset => {
      if (statusFilter !== 'all' && asset.status !== statusFilter) return false;
      if (categoryFilter !== 'all' && asset.category !== categoryFilter) {
        return false;
      }
      const employee = findEmployee(asset.employeeId);
      if (
        departmentFilter !== 'all' &&
        employee?.department !== departmentFilter
      ) {
        return false;
      }
      if (attentionOnly && !needsAttention(asset)) return false;
      if (!term) return true;
      return [asset.name, asset.tag, asset.serial, employee?.name ?? ''].some(
        value => value.toLowerCase().includes(term)
      );
    });
  }, [
    assets,
    statusFilter,
    categoryFilter,
    departmentFilter,
    attentionOnly,
    search,
  ]);

  const addHistory = (
    asset: InventoryAsset,
    text: string
  ): InventoryHistoryEntry[] => [
    ...asset.history,
    { at: new Date().toISOString(), text },
  ];

  const closeAddDialog = () => {
    setIsAddOpen(false);
    setNewName('');
    setNewCategory('laptop');
    setNewSerial('');
    setNewWarrantyEnds('');
  };

  const columns = useMemo(
    () =>
      createInventoryColumns({
        onAssign: asset => {
          setAssignEmployeeId(inventoryEmployeeOptions[0]?.value ?? '');
          setAssignIds([asset.id]);
        },
        onView: asset => setViewId(asset.id),
      }),
    []
  );

  const handleCardClick = (filter: InventoryStatusFilter) => {
    setStatusFilter(filter);
    setAttentionOnly(false);
  };

  const handleResetAttention = () => {
    setAttentionOnly(current => !current);
    setStatusFilter('all');
  };

  const handleImportFile = (file: File | undefined) => {
    if (!file) return;

    toast.success(`"${file.name}" selected for import.`);
  };

  const handleAssign = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!assignIds) return;

    const employee = findEmployee(assignEmployeeId);
    if (!employee) {
      toast.error('Choose an employee to assign to.');
      return;
    }

    const eligibleIds = assets
      .filter(
        asset => assignIds.includes(asset.id) && asset.status === 'available'
      )
      .map(asset => asset.id);
    if (eligibleIds.length === 0) {
      toast.error('Only available assets can be assigned.');
      return;
    }

    const skipped = assignIds.length - eligibleIds.length;
    setAssets(current =>
      current.map(asset =>
        eligibleIds.includes(asset.id)
          ? {
              ...asset,
              status: 'allocated',
              employeeId: employee.id,
              history: addHistory(asset, `Assigned to ${employee.name}`),
            }
          : asset
      )
    );
    toast.success(
      `${eligibleIds.length} ${
        eligibleIds.length === 1 ? 'asset' : 'assets'
      } assigned to ${employee.name}.${
        skipped > 0 ? ` ${skipped} skipped (not available).` : ''
      }`
    );
    setAssignIds(null);
  };

  const handleAddAsset = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (newName.trim().length < minNameLength) {
      toast.error(
        `Enter an asset name of at least ${minNameLength} characters.`
      );
      return;
    }
    if (!newSerial.trim()) {
      toast.error('Enter the serial number.');
      return;
    }
    if (newWarrantyEnds && newWarrantyEnds < todayIso()) {
      toast.error('Warranty end date must be today or later.');
      return;
    }

    tagSequence.current += 1;
    const tag = `AST-${String(tagSequence.current).padStart(4, '0')}`;
    const asset: InventoryAsset = {
      id: `inv-${String(tagSequence.current).padStart(3, '0')}`,
      name: newName.trim(),
      tag,
      category: newCategory,
      serial: newSerial.trim(),
      status: 'available',
      employeeId: null,
      purchasedOn: todayIso(),
      warrantyEnds: newWarrantyEnds || null,
      history: [{ at: new Date().toISOString(), text: 'Added to inventory' }],
    };
    setAssets(current => [asset, ...current]);
    toast.success(`${asset.name} added as ${tag}.`);
    closeAddDialog();
  };

  return (
    <>
      <Section
        title="Assets Inventory"
        menuId="assets-inventory"
        showBreadcrumbs
      >
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-end gap-3">
            <div className="flex flex-wrap gap-2">
              <FormField
                label="Import assets from CSV"
                name="assets-import"
                type="file"
                value=""
                accept=".csv"
                className="hidden"
                onFileChange={event => {
                  handleImportFile(event.target.files?.[0]);
                  event.target.value = '';
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryCard
              icon={Package}
              label="Total assets"
              value={statusCounts.all}
              help="Everything we own"
              tone="primary"
              isActive={statusFilter === 'all' && !attentionOnly}
              onClick={() => handleCardClick('all')}
            />
            <SummaryCard
              icon={UserCheck}
              label="In use"
              value={statusCounts.allocated}
              help="Assigned to employees"
              tone="success"
              isActive={statusFilter === 'allocated'}
              onClick={() => handleCardClick('allocated')}
            />
            <SummaryCard
              icon={CheckCircle2}
              label="Ready to assign"
              value={statusCounts.available}
              help="In stock right now"
              tone="primary"
              isActive={statusFilter === 'available'}
              onClick={() => handleCardClick('available')}
            />
            <SummaryCard
              icon={Wrench}
              label="In repair"
              value={statusCounts.maintenance}
              help="Being serviced"
              tone="warning"
              isActive={statusFilter === 'maintenance'}
              onClick={() => handleCardClick('maintenance')}
            />
          </div>

          <TanStackTable
            data={visibleAssets}
            columns={columns}
            enableSearch={false}
            showDownload={true}
            enableColumnVisibility
            enablePagination
            pageSize={8}
            pageSizeOptions={[8, 10, 20]}
            getRowId={asset => asset.id}
            emptyMessage="No assets match these filters."
            customFilters={
              <div className="w-full space-y-4">
                <div className="flex flex-wrap items-end gap-3">
                  <div className="min-w-44">
                    <FormField
                      label="Category"
                      name="inventory-category"
                      type="select"
                      value={categoryFilter}
                      onChange={setCategoryFilter}
                      options={inventoryCategoryFilterOptions}
                    />
                  </div>
                  <div className="min-w-44">
                    <FormField
                      label="Department"
                      name="inventory-department"
                      type="select"
                      value={departmentFilter}
                      onChange={setDepartmentFilter}
                      options={inventoryDepartmentFilterOptions}
                    />
                  </div>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => setIsAddOpen(true)}
                  >
                    <Plus className="w-4 h-4" />
                    Add Asset
                  </Button>

                  <Button asChild type="button" size="sm" variant="default">
                    <label htmlFor="assets-import">
                      <Upload className="h-4 w-4" aria-hidden="true" />
                      Import
                    </label>
                  </Button>
                  {attentionAssets.length > 0 && (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="ml-auto"
                      onClick={handleResetAttention}
                    >
                      {attentionOnly ? 'Show all assets' : 'Review now'}
                    </Button>
                  )}
                </div>

                <div
                  className="flex flex-wrap gap-2"
                  role="group"
                  aria-label="Filter by status"
                >
                  {inventoryStatusFilterOptions.map(option => {
                    const isActive =
                      statusFilter === option.value && !attentionOnly;
                    return (
                      <Button
                        key={option.value}
                        type="button"
                        size="sm"
                        variant="outline"
                        aria-pressed={isActive}
                        className={`rounded-full ${
                          isActive
                            ? 'border-primary bg-primary/10 text-primary'
                            : ''
                        }`}
                        onClick={() => {
                          if (isStatusFilter(option.value)) {
                            handleCardClick(option.value);
                          }
                        }}
                      >
                        {option.label}
                        <span className="rounded-full bg-muted px-2 text-xs font-semibold text-foreground">
                          {statusCounts[option.value]}
                        </span>
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
        open={assignIds !== null}
        onOpenChange={open => !open && setAssignIds(null)}
      >
        <DialogContent
          className="sm:max-w-md"
          onInteractOutside={event => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Assign to employee</DialogTitle>
            <DialogDescription>
              Choose who will use{' '}
              {assignIds && assignIds.length > 1
                ? `these ${assignIds.length} assets`
                : 'this asset'}
              . Only available assets are assigned.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAssign} className="space-y-4">
            <FormField
              label="Employee"
              name="assign-employee"
              type="select"
              value={assignEmployeeId}
              onChange={setAssignEmployeeId}
              options={inventoryEmployeeOptions}
              required
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setAssignIds(null)}
              >
                Cancel
              </Button>
              <Button type="submit">Assign</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(viewAsset)}
        onOpenChange={open => !open && setViewId(null)}
      >
        <DialogContent
          className="sm:max-w-xl"
          onInteractOutside={event => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>{viewAsset?.name}</DialogTitle>
            <DialogDescription>Asset details and history.</DialogDescription>
          </DialogHeader>

          {viewAsset && (
            <div className="space-y-4">
              <div
                className="rounded-lg border border-border px-3"
                role="group"
                aria-label="Asset details"
              >
                <DetailRow label="Tag" value={viewAsset.tag} />
                <DetailRow label="Serial no." value={viewAsset.serial} />
                <DetailRow
                  label="Status"
                  value={inventoryStatusLabels[viewAsset.status]}
                />
                <DetailRow
                  label="Assigned to"
                  value={
                    viewEmployee
                      ? `${viewEmployee.name} (${viewEmployee.department})`
                      : 'Not assigned yet'
                  }
                />
                <DetailRow
                  label="Purchased on"
                  value={formatDate(viewAsset.purchasedOn)}
                />
                <DetailRow
                  label="Warranty"
                  value={getWarranty(viewAsset).label}
                />
              </div>

              <div>
                <p className="text-sm font-medium text-foreground">History</p>
                <div className="mt-2 space-y-3" role="list">
                  {[...viewAsset.history].reverse().map(entry => (
                    <div
                      key={`${entry.at}-${entry.text}`}
                      className="flex items-start gap-3 text-sm"
                      role="listitem"
                    >
                      <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />
                      <div>
                        <p className="text-foreground">{entry.text}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDateTime(entry.at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" onClick={() => setViewId(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isAddOpen}
        onOpenChange={open => {
          if (open) {
            setIsAddOpen(true);
          } else {
            closeAddDialog();
          }
        }}
      >
        <DialogContent
          className="sm:max-w-md"
          onInteractOutside={event => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Add asset</DialogTitle>
            <DialogDescription>
              New assets start as Available. You can assign them afterwards.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddAsset} className="space-y-4">
            <FormField
              label="Asset name"
              name="new-asset-name"
              value={newName}
              onChange={setNewName}
              placeholder="e.g. Dell Latitude 5440"
              required
            />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <FormField
                label="Category"
                name="new-asset-category"
                type="select"
                value={newCategory}
                onChange={value => {
                  if (isCategory(value)) setNewCategory(value);
                }}
                options={inventoryCategoryOptions}
                required
              />
              <FormField
                label="Warranty ends (optional)"
                name="new-asset-warranty"
                type="date"
                value={newWarrantyEnds}
                onChange={setNewWarrantyEnds}
              />
            </div>
            <FormField
              label="Serial number"
              name="new-asset-serial"
              value={newSerial}
              onChange={setNewSerial}
              placeholder="e.g. DL5440-7F2Q"
              required
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeAddDialog}>
                Cancel
              </Button>
              <Button type="submit">Add asset</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AssetsInventoryPage;
