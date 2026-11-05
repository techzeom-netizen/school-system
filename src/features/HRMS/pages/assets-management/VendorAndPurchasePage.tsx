import { type FormEvent, useMemo, useRef, useState } from 'react';
import {
  Armchair,
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
  initialPurchaseOrders,
  initialPurchaseVendors,
  purchaseAssetTypeOptions,
  purchaseCategoryOptions,
  purchaseDepartmentOptions,
  purchaseFilterOptions,
  type PurchaseAssetType,
  type PurchaseFilter,
  type PurchaseHistoryEntry,
  type PurchaseOrder,
  type PurchaseVendor,
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

type OrderBucket = 'pending' | 'ordered' | 'delayed' | 'received';

const typeIcons: Record<PurchaseAssetType, LucideIcon> = {
  laptop: Laptop,
  mobile: Smartphone,
  monitor: Monitor,
  headset: Headphones,
  printer: Printer,
  furniture: Armchair,
};

const bucketLabels: Record<OrderBucket, string> = {
  pending: 'Pending approval',
  ordered: 'Ordered',
  delayed: 'Delayed',
  received: 'Received',
};

const bucketBadgeClass: Record<OrderBucket, string> = {
  pending: 'bg-accent text-accent-foreground',
  ordered: 'bg-primary/10 text-primary',
  delayed: 'bg-destructive/10 text-destructive',
  received: 'bg-muted text-muted-foreground',
};

const bucketDotClass: Record<OrderBucket, string> = {
  pending: 'bg-accent-foreground',
  ordered: 'bg-primary',
  delayed: 'bg-destructive',
  received: 'bg-muted-foreground',
};

const avatarClasses = [
  'bg-primary/10 text-primary',
  'bg-secondary text-secondary-foreground',
  'bg-accent text-accent-foreground',
  'bg-muted text-muted-foreground',
  'bg-primary/10 text-primary',
  'bg-secondary text-secondary-foreground',
];

const minNameLength = 3;
const recentOrderDays = 30;

const formatDate = (date: string) =>
  new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date.length === 10 ? `${date}T00:00:00` : date));

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

const getBucket = (order: PurchaseOrder): OrderBucket => {
  if (order.status === 'pending') return 'pending';
  if (order.status === 'received') return 'received';
  return daysLate(order.expectedOn) > 0 ? 'delayed' : 'ordered';
};

const getOrderTitle = (order: PurchaseOrder) =>
  `${order.quantity} × ${order.itemName}`;

const getDelivery = (
  order: PurchaseOrder,
  bucket: OrderBucket
): { text: string; isLate: boolean } => {
  if (bucket === 'pending') return { text: 'Not ordered yet', isLate: false };
  if (bucket === 'received') {
    return {
      text: `Received ${order.receivedOn ? formatShortDate(order.receivedOn) : ''}`,
      isLate: false,
    };
  }
  if (bucket === 'delayed') {
    const late = daysLate(order.expectedOn);
    return {
      text: `${late} ${late === 1 ? 'day' : 'days'} late`,
      isLate: true,
    };
  }
  return {
    text: `Arrives ${formatShortDate(order.expectedOn)}`,
    isLate: false,
  };
};

const matchesFilter = (bucket: OrderBucket, filter: PurchaseFilter) => {
  if (filter === 'all') return true;
  if (filter === 'way') return bucket === 'ordered' || bucket === 'delayed';
  return bucket === filter;
};

const getInitials = (name: string) =>
  name
    .split(' ')
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

const parseAmount = (value: string): number | null => {
  const amount = Number(value.trim().replace(/,/g, ''));
  return Number.isFinite(amount) && amount > 0 ? amount : null;
};

const parseQuantity = (value: string): number | null => {
  const quantity = Number(value.trim());
  return Number.isInteger(quantity) && quantity > 0 ? quantity : null;
};

const isAssetType = (value: string): value is PurchaseAssetType =>
  purchaseAssetTypeOptions.some(option => option.value === value);

const isPurchaseFilter = (value: string): value is PurchaseFilter =>
  purchaseFilterOptions.some(option => option.value === value);

const PurchaseStatusBadge = ({ bucket }: { bucket: OrderBucket }) => (
  <Badge className={`gap-2 border-transparent ${bucketBadgeClass[bucket]}`}>
    <span
      className={`h-2 w-2 shrink-0 rounded-full ${bucketDotClass[bucket]}`}
      aria-hidden="true"
    />
    {bucketLabels[bucket]}
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

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-start justify-between gap-4 border-b border-border py-2 text-sm last:border-b-0">
    <span className="font-medium">{label}</span>
    <span className="text-right text-muted-foreground">{value}</span>
  </div>
);

const OrderRow = ({
  order,
  vendorName,
  onApprove,
  onReceive,
  onView,
}: {
  order: PurchaseOrder;
  vendorName: string;
  onApprove: () => void;
  onReceive: () => void;
  onView: () => void;
}) => {
  const Icon = typeIcons[order.assetType];
  const bucket = getBucket(order);
  const delivery = getDelivery(order, bucket);

  return (
    <div className="grid grid-cols-[3rem_minmax(0,2.2fr)_8rem_10rem_11rem_9.5rem] items-center gap-6 px-6 py-5">
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="font-semibold text-foreground">{getOrderTitle(order)}</p>
        <p className="text-sm text-muted-foreground">
          {vendorName} · {order.id}
        </p>
      </div>
      <div>
        <p className="font-semibold text-foreground">
          {formatMoney(order.amount)}
        </p>
        <p className="text-sm text-muted-foreground">For {order.dept}</p>
      </div>
      <p
        className={`text-sm ${
          delivery.isLate
            ? 'font-semibold text-destructive'
            : 'text-muted-foreground'
        }`}
      >
        {delivery.text}
      </p>
      <div>
        <PurchaseStatusBadge bucket={bucket} />
      </div>
      <div className="flex justify-end">
        {bucket === 'pending' && (
          <Button type="button" onClick={onApprove}>
            Approve
          </Button>
        )}
        {(bucket === 'ordered' || bucket === 'delayed') && (
          <Button type="button" onClick={onReceive}>
            Mark received
          </Button>
        )}
        {bucket === 'received' && (
          <Button type="button" variant="outline" onClick={onView}>
            View order
          </Button>
        )}
      </div>
    </div>
  );
};

const VendorCard = ({
  vendor,
  index,
  activeOrders,
  totalSpend,
  onOrder,
}: {
  vendor: PurchaseVendor;
  index: number;
  activeOrders: number;
  totalSpend: number;
  onOrder: () => void;
}) => (
  <Card className="space-y-5 p-6">
    <div className="flex items-center gap-4">
      <span
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-base font-semibold ${
          avatarClasses[index % avatarClasses.length]
        }`}
        aria-hidden="true"
      >
        {getInitials(vendor.name)}
      </span>
      <div className="min-w-0">
        <p className="font-semibold text-foreground">{vendor.name}</p>
        <p className="text-sm text-muted-foreground">
          {vendor.categories.join(' · ')}
        </p>
      </div>
    </div>

    <p className="text-sm text-muted-foreground">
      Contact:{' '}
      <span className="font-semibold text-foreground">{vendor.contact}</span>
    </p>

    <div className="grid grid-cols-2 gap-4 rounded-xl bg-muted/50 p-4">
      <div>
        <p className="text-xs text-muted-foreground">Active orders</p>
        <p className="text-xl font-semibold text-foreground">{activeOrders}</p>
      </div>
      <div>
        <p className="text-xs text-muted-foreground">Total spend</p>
        <p className="text-xl font-semibold text-foreground">
          {formatMoney(totalSpend)}
        </p>
      </div>
    </div>

    <Button
      type="button"
      variant="default"
      className="w-full"
      onClick={onOrder}
    >
      Order from {vendor.shortName}
    </Button>
  </Card>
);

const VendorsPurchasePage = () => {
  const [orders, setOrders] = useState(initialPurchaseOrders);
  const [vendors, setVendors] = useState(initialPurchaseVendors);
  const [filter, setFilter] = useState<PurchaseFilter>('all');
  const orderSequence = useRef(48);
  const vendorSequence = useRef(initialPurchaseVendors.length);

  const [receiveId, setReceiveId] = useState<string | null>(null);
  const [receiveDate, setReceiveDate] = useState(todayIso());
  const [receiveNote, setReceiveNote] = useState('');

  const [viewId, setViewId] = useState<string | null>(null);

  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [orderVendorId, setOrderVendorId] = useState('');
  const [orderAssetType, setOrderAssetType] =
    useState<PurchaseAssetType>('laptop');
  const [orderItemName, setOrderItemName] = useState('');
  const [orderQuantity, setOrderQuantity] = useState('1');
  const [orderAmount, setOrderAmount] = useState('');
  const [orderDept, setOrderDept] = useState(
    purchaseDepartmentOptions[0]?.value ?? ''
  );
  const [orderExpectedOn, setOrderExpectedOn] = useState(dateOffset(10));

  const [isVendorOpen, setIsVendorOpen] = useState(false);
  const [vendorName, setVendorName] = useState('');
  const [vendorContact, setVendorContact] = useState('');
  const [vendorCategory, setVendorCategory] = useState(
    purchaseCategoryOptions[0]?.value ?? ''
  );

  const findVendor = (id: string) =>
    vendors.find(vendor => vendor.id === id) ?? null;
  const receiveOrder = orders.find(order => order.id === receiveId) ?? null;
  const viewOrder = orders.find(order => order.id === viewId) ?? null;
  const viewVendor = findVendor(viewOrder?.vendorId ?? '');

  const vendorOptions = vendors.map(vendor => ({
    label: vendor.name,
    value: vendor.id,
  }));

  const bucketOf = (order: PurchaseOrder) => getBucket(order);
  const countBucket = (bucket: OrderBucket) =>
    orders.filter(order => bucketOf(order) === bucket).length;
  const filterCounts: Record<PurchaseFilter, number> = {
    all: orders.length,
    pending: countBucket('pending'),
    way: countBucket('ordered') + countBucket('delayed'),
    received: countBucket('received'),
  };

  const openOrderCount = orders.filter(
    order => order.status !== 'received'
  ).length;
  const lateCount = countBucket('delayed');
  const recentSpend = orders
    .filter(
      order =>
        order.status !== 'pending' &&
        daysLate(order.placedOn) <= recentOrderDays
    )
    .reduce((total, order) => total + order.amount, 0);

  const visibleOrders = useMemo(
    () => orders.filter(order => matchesFilter(getBucket(order), filter)),
    [orders, filter]
  );

  const addHistory = (
    order: PurchaseOrder,
    text: string
  ): PurchaseHistoryEntry[] => [
    ...order.history,
    { at: new Date().toISOString(), text },
  ];

  const updateOrder = (
    id: string,
    change: (order: PurchaseOrder) => PurchaseOrder
  ) =>
    setOrders(current =>
      current.map(order => (order.id === id ? change(order) : order))
    );

  const openReceiveDialog = (order: PurchaseOrder) => {
    setReceiveDate(todayIso());
    setReceiveNote('');
    setReceiveId(order.id);
  };

  const openOrderDialog = (vendorId?: string) => {
    const vendor = vendorId ? findVendor(vendorId) : null;
    setOrderVendorId(vendor?.id ?? vendorOptions[0]?.value ?? '');
    setOrderAssetType('laptop');
    setOrderItemName('');
    setOrderQuantity('1');
    setOrderAmount('');
    setOrderDept(purchaseDepartmentOptions[0]?.value ?? '');
    setOrderExpectedOn(dateOffset(10));
    setIsOrderOpen(true);
  };

  const openVendorDialog = () => {
    setVendorName('');
    setVendorContact('');
    setVendorCategory(purchaseCategoryOptions[0]?.value ?? '');
    setIsVendorOpen(true);
  };

  const handleApprove = (order: PurchaseOrder) => {
    updateOrder(order.id, current => ({
      ...current,
      status: 'ordered',
      history: addHistory(current, 'Approved and sent to the vendor'),
    }));
    toast.success(
      `${order.id} approved and sent to ${findVendor(order.vendorId)?.name ?? 'the vendor'}.`
    );
  };

  const handleReceive = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!receiveOrder) return;

    if (!receiveDate || receiveDate > todayIso()) {
      toast.error('Pick today or an earlier date for when it arrived.');
      return;
    }
    if (receiveDate < receiveOrder.placedOn) {
      toast.error('The received date cannot be before the order date.');
      return;
    }

    const note = receiveNote.trim();
    updateOrder(receiveOrder.id, current => ({
      ...current,
      status: 'received',
      receivedOn: receiveDate,
      history: addHistory(
        current,
        note ? `Items received (note: ${note})` : 'Items received'
      ),
    }));
    toast.success(`${receiveOrder.id} marked as received.`);
    setReceiveId(null);
  };

  const handleNewOrder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const vendor = findVendor(orderVendorId);
    if (!vendor) {
      toast.error('Choose the vendor you are ordering from.');
      return;
    }
    if (orderItemName.trim().length < minNameLength) {
      toast.error(
        `Enter an item name of at least ${minNameLength} characters.`
      );
      return;
    }
    const quantity = parseQuantity(orderQuantity);
    if (quantity === null) {
      toast.error('Enter the quantity as a whole number, for example 5.');
      return;
    }
    const amount = parseAmount(orderAmount);
    if (amount === null) {
      toast.error('Enter the total amount as a number, for example 410000.');
      return;
    }
    if (!orderExpectedOn || orderExpectedOn < todayIso()) {
      toast.error('Pick today or a future date for the expected delivery.');
      return;
    }

    orderSequence.current += 1;
    const id = `PO-2026-${String(orderSequence.current).padStart(4, '0')}`;
    const order: PurchaseOrder = {
      id,
      vendorId: vendor.id,
      itemName: orderItemName.trim(),
      quantity,
      assetType: orderAssetType,
      amount,
      dept: orderDept,
      placedOn: todayIso(),
      expectedOn: orderExpectedOn,
      status: 'pending',
      receivedOn: null,
      history: [
        {
          at: new Date().toISOString(),
          text: 'Order created, waiting for approval',
        },
      ],
    };
    setOrders(current => [order, ...current]);
    setFilter('all');
    toast.success(`Purchase order ${id} created. It is waiting for approval.`);
    setIsOrderOpen(false);
  };

  const handleAddVendor = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = vendorName.trim();
    if (name.length < minNameLength) {
      toast.error(
        `Enter a vendor name of at least ${minNameLength} characters.`
      );
      return;
    }
    if (
      vendors.some(vendor => vendor.name.toLowerCase() === name.toLowerCase())
    ) {
      toast.error('A vendor with this name already exists.');
      return;
    }
    if (vendorContact.trim().length < minNameLength) {
      toast.error('Enter the name of the contact person.');
      return;
    }

    vendorSequence.current += 1;
    const vendor: PurchaseVendor = {
      id: `ven-${vendorSequence.current}`,
      name,
      shortName: name.split(' ').slice(0, 2).join(' '),
      categories: [vendorCategory],
      contact: vendorContact.trim(),
    };
    setVendors(current => [...current, vendor]);
    toast.success(`${name} added to your vendors.`);
    setIsVendorOpen(false);
  };

  return (
    <>
      <Section
        title="Vendors & Purchase"
        menuId="vendor-and-purchase"
        showBreadcrumbs
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryStat
              label="Open orders"
              value={openOrderCount}
              help="Not received yet"
            />
            <SummaryStat
              label="Waiting for approval"
              value={filterCounts.pending}
              help="Needs a decision"
            />
            <SummaryStat
              label="Running late"
              value={lateCount}
              help="Past the expected date"
              isAlert={lateCount > 0}
            />
            <SummaryStat
              label="Ordered in 30 days"
              value={formatMoney(recentSpend)}
              help="Approved orders only"
            />
          </div>

          <Section title="Purchase orders" contentClassName="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div
                className="flex w-fit max-w-full flex-wrap gap-1 rounded-xl border border-border bg-card p-1"
                role="group"
              >
                {purchaseFilterOptions.map(option => {
                  const isActive = filter === option.value;
                  return (
                    <Button
                      key={option.value}
                      type="button"
                      variant={isActive ? 'default' : 'ghost'}
                      aria-pressed={isActive}
                      className="h-10 gap-2 px-4"
                      onClick={() => {
                        if (isPurchaseFilter(option.value)) {
                          setFilter(option.value);
                        }
                      }}
                    >
                      {option.label}
                      <span
                        className={`rounded-full px-2 text-xs font-semibold ${
                          isActive
                            ? 'bg-white/25 text-primary-foreground'
                            : 'bg-muted text-foreground'
                        }`}
                      >
                        {filterCounts[option.value]}
                      </span>
                    </Button>
                  );
                })}
              </div>
              <div className="ml-auto grid w-full grid-cols-2 gap-3 sm:w-auto">
                <Button
                  type="button"
                  variant="default"
                  className="w-full sm:min-w-48"
                  onClick={() => openOrderDialog()}
                >
                  <Plus className="w-4 h-4" />
                  New Purchase Order
                </Button>
                <Button
                  type="button"
                  variant="default"
                  className="w-full sm:min-w-48"
                  onClick={openVendorDialog}
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  Add Vendor
                </Button>
              </div>
            </div>

            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <div className="min-w-[64rem] divide-y divide-border">
                  {visibleOrders.map(order => (
                    <OrderRow
                      key={order.id}
                      order={order}
                      vendorName={findVendor(order.vendorId)?.name ?? 'Vendor'}
                      onApprove={() => handleApprove(order)}
                      onReceive={() => openReceiveDialog(order)}
                      onView={() => setViewId(order.id)}
                    />
                  ))}
                  {visibleOrders.length === 0 && (
                    <p className="p-10 text-center text-sm text-muted-foreground">
                      No orders here yet.
                    </p>
                  )}
                </div>
              </div>
            </Card>
          </Section>

          <Section title="Your vendors" contentClassName="space-y-4">
            <p className="text-sm text-muted-foreground">
              {vendors.length} {vendors.length === 1 ? 'vendor' : 'vendors'}
            </p>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {vendors.map((vendor, index) => {
                const vendorOrders = orders.filter(
                  order => order.vendorId === vendor.id
                );
                return (
                  <VendorCard
                    key={vendor.id}
                    vendor={vendor}
                    index={index}
                    activeOrders={
                      vendorOrders.filter(order => order.status !== 'received')
                        .length
                    }
                    totalSpend={vendorOrders
                      .filter(order => order.status !== 'pending')
                      .reduce((total, order) => total + order.amount, 0)}
                    onOrder={() => openOrderDialog(vendor.id)}
                  />
                );
              })}
            </div>
          </Section>
        </div>
      </Section>

      <Dialog
        open={Boolean(receiveOrder)}
        onOpenChange={open => !open && setReceiveId(null)}
      >
        <DialogContent
          className="sm:max-w-lg"
          onInteractOutside={event => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Mark as received</DialogTitle>
            <DialogDescription>
              {receiveOrder ? getOrderTitle(receiveOrder) : ''}{' '}
              {receiveOrder ? `(${receiveOrder.id})` : ''}. Confirm that the
              items have arrived.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleReceive} className="space-y-4">
            <FormField
              label="Received on"
              name="receive-date"
              type="date"
              value={receiveDate}
              onChange={setReceiveDate}
              required
            />
            <FormField
              label="Note (optional)"
              name="receive-note"
              type="textarea"
              value={receiveNote}
              onChange={setReceiveNote}
              placeholder="e.g. All items arrived in good condition"
            />

            <DialogFooter>
              <Button
                type="button"
                variant="destructive"
                onClick={() => setReceiveId(null)}
              >
                Cancel
              </Button>
              <Button type="submit">Mark as received</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(viewOrder)}
        onOpenChange={open => !open && setViewId(null)}
      >
        <DialogContent
          className="sm:max-w-xl"
          onInteractOutside={event => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>
              {viewOrder ? getOrderTitle(viewOrder) : 'Order details'}
            </DialogTitle>
            <DialogDescription>Order details and history.</DialogDescription>
          </DialogHeader>

          {viewOrder && (
            <div className="space-y-4">
              <div
                className="rounded-lg border border-border px-3"
                role="group"
                aria-label="Order details"
              >
                <DetailRow label="Order number" value={viewOrder.id} />
                <DetailRow
                  label="Vendor"
                  value={
                    viewVendor
                      ? `${viewVendor.name} (${viewVendor.contact})`
                      : '-'
                  }
                />
                <DetailRow
                  label="Amount"
                  value={formatMoney(viewOrder.amount)}
                />
                <DetailRow label="For" value={viewOrder.dept} />
                <DetailRow
                  label="Ordered on"
                  value={formatDate(viewOrder.placedOn)}
                />
                <DetailRow
                  label="Expected delivery"
                  value={formatDate(viewOrder.expectedOn)}
                />
                {viewOrder.receivedOn && (
                  <DetailRow
                    label="Received on"
                    value={formatDate(viewOrder.receivedOn)}
                  />
                )}
                <DetailRow
                  label="Status"
                  value={bucketLabels[getBucket(viewOrder)]}
                />
              </div>

              <div>
                <p className="text-sm font-medium text-foreground">History</p>
                <div className="mt-2 space-y-3" role="list">
                  {[...viewOrder.history].reverse().map(entry => (
                    <div
                      key={`${entry.at}-${entry.text}`}
                      className="flex items-start gap-3 text-sm"
                      role="listitem"
                    >
                      <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />
                      <div>
                        <p className="text-foreground">{entry.text}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(entry.at)}
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
        open={isOrderOpen}
        onOpenChange={open => !open && setIsOrderOpen(false)}
      >
        <DialogContent
          className="sm:max-w-xl"
          onInteractOutside={event => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>New purchase order</DialogTitle>
            <DialogDescription>
              The order waits for approval before it is sent to the vendor.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleNewOrder} className="space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <FormField
                label="Vendor"
                name="order-vendor"
                type="select"
                value={orderVendorId}
                onChange={setOrderVendorId}
                placeholder="Select vendor"
                options={vendorOptions}
                required
              />
              <FormField
                label="What are you ordering?"
                name="order-asset-type"
                type="select"
                value={orderAssetType}
                onChange={value => {
                  if (isAssetType(value)) setOrderAssetType(value);
                }}
                options={purchaseAssetTypeOptions}
                required
              />
            </div>
            <FormField
              label="Item name"
              name="order-item-name"
              value={orderItemName}
              onChange={setOrderItemName}
              placeholder="e.g. Dell Latitude 5440"
              required
            />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <FormField
                label="Quantity"
                name="order-quantity"
                value={orderQuantity}
                onChange={setOrderQuantity}
                placeholder="e.g. 5"
                required
              />
              <FormField
                label="Total amount in ₹"
                name="order-amount"
                value={orderAmount}
                onChange={setOrderAmount}
                placeholder="e.g. 410000"
                required
              />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <FormField
                label="Needed for"
                name="order-dept"
                type="select"
                value={orderDept}
                onChange={setOrderDept}
                options={purchaseDepartmentOptions}
                required
              />
              <FormField
                label="Expected delivery"
                name="order-expected-on"
                type="date"
                value={orderExpectedOn}
                onChange={setOrderExpectedOn}
                required
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="destructive"
                onClick={() => setIsOrderOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create order</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isVendorOpen}
        onOpenChange={open => !open && setIsVendorOpen(false)}
      >
        <DialogContent
          className="sm:max-w-xl"
          onInteractOutside={event => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Add a vendor</DialogTitle>
            <DialogDescription>
              Add the company you buy from, so you can raise orders quickly.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddVendor} className="space-y-4">
            <FormField
              label="Vendor name"
              name="vendor-name"
              value={vendorName}
              onChange={setVendorName}
              placeholder="e.g. Dell India Pvt Ltd"
              required
            />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <FormField
                label="Contact person"
                name="vendor-contact"
                value={vendorContact}
                onChange={setVendorContact}
                placeholder="e.g. Rakesh Menon"
                required
              />
              <FormField
                label="Main category"
                name="vendor-category"
                type="select"
                value={vendorCategory}
                onChange={setVendorCategory}
                options={purchaseCategoryOptions}
                required
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="destructive"
                onClick={() => setIsVendorOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Add vendor</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VendorsPurchasePage;
