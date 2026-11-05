import { type FormEvent, useMemo, useRef, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import {
  Box,
  CheckCircle2,
  Contact,
  Headphones,
  Info,
  Keyboard,
  Laptop,
  Monitor,
  Mouse,
  Plug,
  Smartphone,
  type LucideIcon,
} from 'lucide-react';
import { toast } from 'sonner';

import FormField from '@/components/common/FormField';
import Section from '@/components/common/Section';
import { TanStackTable } from '@/components/common';
import { assetIssueOptions } from '@/data/reusableDropdownData';

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

type AssetType =
  | 'laptop'
  | 'monitor'
  | 'mouse'
  | 'keyboard'
  | 'idcard'
  | 'headset'
  | 'dock'
  | 'phone';
type AssetStatus = 'in_use' | 'repair' | 'reported' | 'lost' | 'returned';
type AssetTab = 'withMe' | 'returned';

interface Asset {
  id: string;
  type: AssetType;
  name: string;
  detail: string;
  serial: string;
  givenOn: string;
  condition: string;
  status: AssetStatus;
  ticket: string | null;
  problem: string;
  returnedOn: string | null;
  returnCondition: string;
}

const assetIcons: Record<AssetType, LucideIcon> = {
  laptop: Laptop,
  monitor: Monitor,
  mouse: Mouse,
  keyboard: Keyboard,
  idcard: Contact,
  headset: Headphones,
  dock: Plug,
  phone: Smartphone,
};

const statusLabels: Record<AssetStatus, string> = {
  in_use: 'In use',
  repair: 'Under repair',
  reported: 'Problem reported',
  lost: 'Reported lost',
  returned: 'Returned',
};

const statusTones: Record<AssetStatus, string> = {
  in_use: 'bg-primary/10 text-primary',
  repair: 'bg-secondary text-secondary-foreground',
  reported: 'bg-secondary text-secondary-foreground',
  lost: 'bg-destructive/10 text-destructive',
  returned: 'bg-muted text-muted-foreground',
};

const initialAssets: Asset[] = [
  {
    id: 'AST-001',
    type: 'laptop',
    name: 'Dell Latitude 5440',
    detail: 'Laptop · Serial DL-4821',
    serial: 'DL-4821',
    givenOn: '2025-01-12',
    condition: 'Good',
    status: 'in_use',
    ticket: null,
    problem: '',
    returnedOn: null,
    returnCondition: '',
  },
  {
    id: 'AST-002',
    type: 'monitor',
    name: 'Dell 24 inch Monitor',
    detail: 'Monitor · Serial MN-3307',
    serial: 'MN-3307',
    givenOn: '2025-01-12',
    condition: 'Good',
    status: 'in_use',
    ticket: null,
    problem: '',
    returnedOn: null,
    returnCondition: '',
  },
  {
    id: 'AST-003',
    type: 'keyboard',
    name: 'Logitech Keyboard',
    detail: 'Keyboard · Serial KB-9051',
    serial: 'KB-9051',
    givenOn: '2025-01-12',
    condition: 'Good',
    status: 'in_use',
    ticket: null,
    problem: '',
    returnedOn: null,
    returnCondition: '',
  },
  {
    id: 'AST-004',
    type: 'mouse',
    name: 'Wireless mouse',
    detail: 'Logitech MX · Serial LM-7712',
    serial: 'LM-7712',
    givenOn: '2025-01-12',
    condition: 'Needs repair',
    status: 'repair',
    ticket: 'HD-2041',
    problem: 'The scroll wheel does not work.',
    returnedOn: null,
    returnCondition: '',
  },
  {
    id: 'AST-005',
    type: 'idcard',
    name: 'Access card',
    detail: 'ID card · ID AC-10234',
    serial: 'AC-10234',
    givenOn: '2025-01-12',
    condition: 'Good',
    status: 'in_use',
    ticket: null,
    problem: '',
    returnedOn: null,
    returnCondition: '',
  },
  {
    id: 'AST-006',
    type: 'headset',
    name: 'Jabra Headset',
    detail: 'Headset · Serial HS-2210',
    serial: 'HS-2210',
    givenOn: '2025-01-12',
    condition: 'Good',
    status: 'returned',
    ticket: null,
    problem: '',
    returnedOn: '2025-08-20',
    returnCondition: 'Good',
  },
  {
    id: 'AST-007',
    type: 'dock',
    name: 'USB-C Docking Station',
    detail: 'Docking station · Serial DK-5543',
    serial: 'DK-5543',
    givenOn: '2025-02-03',
    condition: 'Good',
    status: 'returned',
    ticket: null,
    problem: '',
    returnedOn: '2025-09-15',
    returnCondition: 'Light scratches',
  },
];

const formatDate = (iso: string | null) =>
  iso
    ? new Date(`${iso}T00:00:00`).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '—';

const matchesSearch = (asset: Asset, query: string) =>
  `${asset.name} ${asset.detail} ${asset.serial}`
    .toLowerCase()
    .includes(query.trim().toLowerCase());

const AssetIcon = ({ type }: { type: AssetType }) => {
  const Icon = assetIcons[type];
  return (
    <span
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"
      aria-hidden="true"
    >
      <Icon className="h-6 w-6" />
    </span>
  );
};

const StatusBadge = ({ status }: { status: AssetStatus }) => (
  <Badge
    variant="secondary"
    className={`whitespace-nowrap ${statusTones[status]}`}
  >
    {statusLabels[status]}
  </Badge>
);

const createReturnedColumns = ({
  onOpen,
}: {
  onOpen: (asset: Asset) => void;
}): ColumnDef<Asset>[] => [
  {
    accessorKey: 'name',
    header: 'Asset',
    cell: ({ row }) => (
      <div className="flex min-w-48 items-center gap-3">
        <AssetIcon type={row.original.type} />
        <div className="min-w-0">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpen(row.original)}
            className="h-auto p-0 text-left font-semibold text-foreground"
          >
            {row.original.name}
          </Button>
          <p className="text-xs text-muted-foreground">{row.original.detail}</p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'givenOn',
    header: 'Given on',
    cell: ({ row }) => (
      <span className="whitespace-nowrap">
        {formatDate(row.original.givenOn)}
      </span>
    ),
  },
  {
    accessorKey: 'returnedOn',
    header: 'Returned on',
    cell: ({ row }) => (
      <span className="whitespace-nowrap">
        {formatDate(row.original.returnedOn)}
      </span>
    ),
  },
  {
    accessorKey: 'returnCondition',
    header: 'Condition when returned',
    cell: ({ getValue }) => (
      <span className="text-muted-foreground">{getValue<string>() || '—'}</span>
    ),
  },
];

const AssetRow = ({
  asset,
  onOpen,
  onReport,
}: {
  asset: Asset;
  onOpen: () => void;
  onReport: () => void;
}) => {
  const hasProblem = asset.status !== 'in_use';

  return (
    <div className="grid grid-cols-1 items-center gap-3 rounded-lg border border-border bg-card p-4 sm:grid-cols-2 xl:grid-cols-4">
      <div className="flex min-w-0 items-center gap-3">
        <AssetIcon type={asset.type} />
        <div className="min-w-0">
          <Button
            type="button"
            variant="ghost"
            onClick={onOpen}
            className="h-auto p-0 text-left font-semibold text-foreground"
          >
            {asset.name}
          </Button>
          <p className="break-words text-xs text-muted-foreground">
            {asset.detail}
          </p>
        </div>
      </div>
      <div>
        <p className="text-xs text-muted-foreground">Given on</p>
        <p className="text-sm font-semibold">{formatDate(asset.givenOn)}</p>
      </div>
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">Status</p>
        <StatusBadge status={asset.status} />
      </div>
      {hasProblem ? (
        <p className="text-center text-xs text-muted-foreground">
          Ticket {asset.ticket}
          <br />
          {asset.status === 'repair'
            ? 'Helpdesk is fixing it'
            : 'Helpdesk will contact you'}
        </p>
      ) : (
        <Button type="button" variant="default" onClick={onReport}>
          Report a problem
        </Button>
      )}
    </div>
  );
};

const AssetsTab = () => {
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [tab, setTab] = useState<AssetTab>('withMe');
  const [search, setSearch] = useState('');

  const [detailsId, setDetailsId] = useState<string | null>(null);

  const [reportId, setReportId] = useState<string | null>(null);
  const [issue, setIssue] = useState('');
  const [details, setDetails] = useState('');

  const nextTicket = useRef(2041);

  const withMe = useMemo(
    () => assets.filter(asset => asset.status !== 'returned'),
    [assets]
  );
  const returned = useMemo(
    () =>
      assets
        .filter(asset => asset.status === 'returned')
        .sort((first, second) =>
          (second.returnedOn ?? '').localeCompare(first.returnedOn ?? '')
        ),
    [assets]
  );

  const filteredWithMe = withMe.filter(asset => matchesSearch(asset, search));
  const detailsAsset = assets.find(asset => asset.id === detailsId);
  const reportAsset = assets.find(asset => asset.id === reportId);

  const changeTab = (next: AssetTab) => {
    setTab(next);
    setSearch('');
  };

  const openReport = (asset: Asset) => {
    setReportId(asset.id);
    setIssue('');
    setDetails('');
  };

  const handleReport = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!reportAsset) return;

    if (!issue) {
      toast.error('Choose what is wrong with it.');
      return;
    }
    if (details.trim().length < 10) {
      toast.error('Tell us a little more, in at least 10 letters.');
      return;
    }

    nextTicket.current += 1;
    const ticket = `HD-${nextTicket.current}`;
    const isLost = issue === 'lost';
    setAssets(current =>
      current.map(asset =>
        asset.id === reportAsset.id
          ? {
              ...asset,
              status: isLost ? 'lost' : 'reported',
              ticket,
              problem: details.trim(),
            }
          : asset
      )
    );
    toast.success(
      `Problem reported. Your ticket is ${ticket}. Helpdesk will contact you.`
    );
    setReportId(null);
  };

  const returnedColumns = createReturnedColumns({
    onOpen: asset => setDetailsId(asset.id),
  });

  return (
    <>
      <Section title="Assets" icon={Box}>
        <div className="space-y-4">
          <Card className="flex items-center gap-3 border-primary/20 bg-primary/5 p-4">
            <Info
              className="h-5 w-5 shrink-0 text-primary"
              aria-hidden="true"
            />
            <p className="text-sm text-foreground" role="status">
              {withMe.length === 0 ? (
                <span className="font-semibold">
                  You have no company assets with you.
                </span>
              ) : (
                <>
                  <span className="font-semibold">
                    You have {withMe.length} company{' '}
                    {withMe.length === 1 ? 'asset' : 'assets'}.
                  </span>{' '}
                  Please take good care of them and return them when you leave.
                </>
              )}
            </p>
          </Card>

          <div
            role="tablist"
            aria-label="Assets"
            className="flex flex-wrap gap-1 "
          >
            {(
              [
                { key: 'withMe', label: 'With me', count: withMe.length },
                { key: 'returned', label: 'Returned', count: returned.length },
              ] as { key: AssetTab; label: string; count: number }[]
            ).map(item => {
              const isActive = tab === item.key;
              return (
                <Button
                  key={item.key}
                  type="button"
                  variant="ghost"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => changeTab(item.key)}
                  className={`-mb-px h-auto items-center gap-2 rounded-none border-b-2 px-4 py-3 text-sm font-semibold ${
                    isActive
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground'
                  }`}
                >
                  {item.label}
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {item.count}
                  </span>
                </Button>
              );
            })}
          </div>

          {tab === 'withMe' && (
            <div className="space-y-3">
              <div className="flex justify-end">
                <div className="w-full sm:w-64">
                  <FormField
                    label="Search assets"
                    name="assets-search"
                    value={search}
                    onChange={setSearch}
                    placeholder="Search by name or serial"
                  />
                </div>
              </div>

              {withMe.length === 0 ? (
                <p className="flex items-center gap-2 py-8 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  No asset is assigned to you right now.
                </p>
              ) : filteredWithMe.length === 0 ? (
                <p className="py-8 text-sm text-muted-foreground">
                  No asset matches this search.
                </p>
              ) : (
                filteredWithMe.map(asset => (
                  <AssetRow
                    key={asset.id}
                    asset={asset}
                    onOpen={() => setDetailsId(asset.id)}
                    onReport={() => openReport(asset)}
                  />
                ))
              )}
            </div>
          )}

          {tab === 'returned' && (
            <TanStackTable
              data={returned}
              columns={returnedColumns}
              enableSearch
              enablePagination
              pageSize={8}
              pageSizeOptions={[8, 10, 20]}
              getRowId={asset => asset.id}
              emptyMessage="You have not returned any asset yet."
            />
          )}
        </div>

        <Dialog
          open={detailsAsset !== undefined}
          onOpenChange={open => {
            if (!open) setDetailsId(null);
          }}
        >
          <DialogContent
            className="sm:max-w-md"
            onInteractOutside={event => event.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle>{detailsAsset?.name}</DialogTitle>
              <DialogDescription>{detailsAsset?.detail}</DialogDescription>
            </DialogHeader>
            {detailsAsset && (
              <div className="space-y-4">
                <div className="divide-y divide-border rounded-lg border border-border text-sm">
                  {[
                    ['Serial or ID', detailsAsset.serial],
                    ['Given on', formatDate(detailsAsset.givenOn)],
                    ['Condition', detailsAsset.condition],
                    ...(detailsAsset.status === 'returned'
                      ? [
                          ['Returned on', formatDate(detailsAsset.returnedOn)],
                          [
                            'Condition when returned',
                            detailsAsset.returnCondition || '—',
                          ],
                        ]
                      : []),
                    ...(detailsAsset.ticket
                      ? [
                          ['Helpdesk ticket', detailsAsset.ticket],
                          ['Problem', detailsAsset.problem || '—'],
                        ]
                      : []),
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex justify-between gap-4 px-3 py-2"
                    >
                      <span className="text-muted-foreground">{label}</span>
                      <span className="text-right font-medium">{value}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between gap-4 px-3 py-2">
                    <span className="text-muted-foreground">Status</span>
                    <span>
                      <StatusBadge status={detailsAsset.status} />
                    </span>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => setDetailsId(null)}
                  >
                    Cancel
                  </Button>
                  {detailsAsset.status === 'in_use' && (
                    <Button
                      type="button"
                      onClick={() => {
                        const asset = detailsAsset;
                        setDetailsId(null);
                        openReport(asset);
                      }}
                    >
                      Report a problem
                    </Button>
                  )}
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Dialog
          open={reportAsset !== undefined}
          onOpenChange={open => {
            if (!open) setReportId(null);
          }}
        >
          <DialogContent
            className="sm:max-w-md"
            onInteractOutside={event => event.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle>Report a problem</DialogTitle>
              <DialogDescription>
                {reportAsset
                  ? `${reportAsset.name} · ${reportAsset.serial}`
                  : ''}
              </DialogDescription>
            </DialogHeader>
            {reportAsset && (
              <form onSubmit={handleReport} className="space-y-4">
                <FormField
                  label="What is wrong?"
                  name="asset-issue"
                  type="select"
                  value={issue}
                  onChange={setIssue}
                  placeholder="Choose one"
                  options={assetIssueOptions}
                  required
                />
                <FormField
                  label="Tell us more"
                  name="asset-issue-details"
                  type="textarea"
                  value={details}
                  onChange={setDetails}
                  placeholder="For example: the screen flickers when I open it"
                  rows={3}
                  required
                />
                <DialogFooter>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => setReportId(null)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Send report</Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </Section>
    </>
  );
};

export default AssetsTab;
