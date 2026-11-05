export type ApprovalType =
  | 'leave'
  | 'shiftSwap'
  | 'overtime'
  | 'regularization';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface ApprovalRequest {
  id: string;
  name: string;
  department: string;
  position: string;
  type: ApprovalType;
  title: string;
  details: string;
  reason: string;
  submittedOn: string;
  status: ApprovalStatus;
  decidedOn: string | null;
  note: string;
}

export const overdueAfterDays = 2;

export const typeLabels: Record<ApprovalType, string> = {
  leave: 'Leave',
  shiftSwap: 'Shift swap',
  overtime: 'Overtime',
  regularization: 'Attendance fix',
};

export const statusLabels: Record<ApprovalStatus, string> = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
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

export const getDaysWaiting = (iso: string) =>
  Math.max(
    0,
    Math.round(
      (toDate(todayIso()).getTime() - toDate(iso).getTime()) / 86400000
    )
  );

export const describeWaiting = (days: number) => {
  if (days === 0) return 'Submitted today';
  if (days === 1) return 'Waiting 1 day';
  return `Waiting ${days} days`;
};

export const getInitials = (name: string) =>
  name
    .split(' ')
    .map(part => part.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase();

const avatarTones = [
  'bg-primary/10 text-primary',
  'bg-secondary text-secondary-foreground',
  'bg-accent text-accent-foreground',
  'bg-muted text-muted-foreground',
  'bg-destructive/10 text-destructive',
  'bg-card text-card-foreground',
];

export const getTone = (id: string) =>
  avatarTones[Number(id.replace(/\D/g, '')) % avatarTones.length];
