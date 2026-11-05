import {
  exitClearanceItems,
  type ExitRecord,
  type ExitStage,
} from '@/data/reusableDropdownData';

const avatarTones = [
  'bg-primary/10 text-primary',
  'bg-secondary text-secondary-foreground',
  'bg-accent text-accent-foreground',
  'bg-muted text-muted-foreground',
  'bg-destructive/10 text-destructive',
  'bg-card text-card-foreground',
];

export const stageLabels: Record<ExitStage, string> = {
  resignation: 'Resignation received',
  notice: 'Notice period',
  clearance: 'Clearance',
  settlement: 'Ready to pay',
  exited: 'Exited',
};

export const stageTones: Record<ExitStage, string> = {
  resignation: 'bg-secondary text-secondary-foreground',
  notice: 'bg-primary/10 text-primary',
  clearance: 'bg-accent text-accent-foreground',
  settlement: 'bg-primary text-primary-foreground',
  exited: 'bg-muted text-muted-foreground',
};

export const todayIso = () => new Date().toLocaleDateString('en-CA');

const toDate = (iso: string) => new Date(`${iso}T00:00:00`);

export const formatDate = (iso: string | null) =>
  iso
    ? toDate(iso).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '—';

export const formatMoney = (amount: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);

export const formatLakhs = (amount: number) =>
  `₹${(amount / 100000).toFixed(2)} L`;

const getDaysLeft = (iso: string) =>
  Math.round((toDate(iso).getTime() - toDate(todayIso()).getTime()) / 86400000);

export const describeDaysLeft = (iso: string) => {
  const days = getDaysLeft(iso);
  if (days === 0) return 'Last day is today';
  if (days === 1) return '1 day left';
  if (days > 1) return `${days} days left`;
  return `Last day was ${Math.abs(days)} ${Math.abs(days) === 1 ? 'day' : 'days'} ago`;
};

export const getInitials = (name: string) =>
  name
    .split(' ')
    .map(part => part.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase();

export const getTone = (id: string) =>
  avatarTones[Number(id.replace(/\D/g, '')) % avatarTones.length];

export const getPendingText = (record: ExitRecord) => {
  if (record.stage === 'resignation') return 'Waiting for your decision';
  if (record.stage === 'notice') return 'Serving notice';
  if (record.stage === 'settlement') return 'Ready to pay';
  if (record.stage === 'exited') return 'Completed';

  const pending = exitClearanceItems.filter(item => !record.clearance[item.id]);
  if (pending.length === 0) return 'All clearance done';
  return pending.length > 1
    ? `${pending[0].shortLabel} (+${pending.length - 1} more)`
    : pending[0].shortLabel;
};
