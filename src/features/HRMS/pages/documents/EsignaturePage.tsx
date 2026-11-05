import {
  type FormEvent,
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import {
  ArrowDownToLine,
  Check,
  CheckCircle2,
  Clock3,
  Eye,
  PenLine,
  FileText,
  XCircle,
  AlertTriangle,
  Plus,
  Send,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

import FormField from '@/components/common/FormField';
import Section from '@/components/common/Section';
import { TanStackTable } from '@/components/common';
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
import { cn } from '@/lib/utils';
import {
  esignatureDeclineReasonOptions,
  esignatureReminderOptions,
  esignatureRoleOptions,
  esignatureSignerOptions,
  esignatureStatusFilterOptions,
} from '@/data/reusableDropdownData';

type SignatureStatus =
  | 'your-turn'
  | 'in-progress'
  | 'completed'
  | 'declined'
  | 'expired';
type RequestGroup = 'awaiting-me' | 'awaiting-others' | 'completed' | 'closed';
type StatusFilter = 'all' | SignatureStatus;
type SignatureMode = 'draw' | 'type' | 'upload';

interface Signer {
  id: string;
  name: string;
  initials: string;
  role: string;
  signedAt: string | null;
  isMe: boolean;
}

interface SendSigner {
  id: string;
  name: string;
  role: string;
}

interface SignatureRequest {
  id: string;
  title: string;
  sentBy: string;
  sentAt: string;
  dueDate: string;
  status: SignatureStatus;
  signers: Signer[];
  declinedReason?: string;
}

const initialRequests: SignatureRequest[] = [
  {
    id: 'offer-letter-rahul',
    title: 'Offer Letter – Rahul Menon',
    sentBy: 'HR',
    sentAt: '2026-10-08',
    dueDate: '2026-10-12',
    status: 'your-turn',
    signers: [
      {
        id: 'rahul',
        name: 'Rahul Menon',
        initials: 'RM',
        role: 'Employee',
        signedAt: '2026-10-08',
        isMe: false,
      },
      {
        id: 'me-offer',
        name: 'You',
        initials: 'HR',
        role: 'HR Manager',
        signedAt: null,
        isMe: true,
      },
      {
        id: 'director-offer',
        name: 'Director',
        initials: 'DR',
        role: 'Director',
        signedAt: null,
        isMe: false,
      },
    ],
  },
  {
    id: 'employment-agreement-ananya',
    title: 'Employment Agreement – Ananya Das',
    sentBy: 'HR',
    sentAt: '2026-10-07',
    dueDate: '2026-10-14',
    status: 'your-turn',
    signers: [
      {
        id: 'ananya',
        name: 'Ananya Das',
        initials: 'AD',
        role: 'Employee',
        signedAt: '2026-10-07',
        isMe: false,
      },
      {
        id: 'me-agreement',
        name: 'You',
        initials: 'HR',
        role: 'HR Manager',
        signedAt: null,
        isMe: true,
      },
    ],
  },
  {
    id: 'nda-jay',
    title: 'Non-Disclosure Agreement',
    sentBy: 'Legal',
    sentAt: '2026-10-05',
    dueDate: '2026-10-15',
    status: 'in-progress',
    signers: [
      {
        id: 'jay',
        name: 'Jay Kapoor',
        initials: 'JK',
        role: 'Employee',
        signedAt: '2026-10-05',
        isMe: false,
      },
      {
        id: 'me-nda',
        name: 'You',
        initials: 'HR',
        role: 'HR Manager',
        signedAt: '2026-10-06',
        isMe: true,
      },
      {
        id: 'legal-nda',
        name: 'Legal Counsel',
        initials: 'LG',
        role: 'Legal',
        signedAt: null,
        isMe: false,
      },
    ],
  },
  {
    id: 'salary-revision-meera',
    title: 'Salary Revision Letter – Meera S.',
    sentBy: 'HR',
    sentAt: '2026-10-01',
    dueDate: '2026-10-09',
    status: 'completed',
    signers: [
      {
        id: 'meera',
        name: 'Meera S.',
        initials: 'MS',
        role: 'Employee',
        signedAt: '2026-10-02',
        isMe: false,
      },
      {
        id: 'me-salary',
        name: 'You',
        initials: 'HR',
        role: 'HR Manager',
        signedAt: '2026-10-03',
        isMe: true,
      },
    ],
  },
  {
    id: 'relieving-letter-karan',
    title: 'Relieving Letter – Karan Patel',
    sentBy: 'HR',
    sentAt: '2026-09-28',
    dueDate: '2026-10-05',
    status: 'declined',
    signers: [
      {
        id: 'karan',
        name: 'Karan Patel',
        initials: 'KP',
        role: 'Employee',
        signedAt: null,
        isMe: false,
      },
      {
        id: 'me-relieving',
        name: 'You',
        initials: 'HR',
        role: 'HR Manager',
        signedAt: null,
        isMe: true,
      },
    ],
  },
  {
    id: 'policy-acknowledgment',
    title: 'Policy Acknowledgment Form',
    sentBy: 'HR',
    sentAt: '2026-09-20',
    dueDate: '2026-09-30',
    status: 'expired',
    signers: [
      {
        id: 'amit',
        name: 'Amit Lal',
        initials: 'AL',
        role: 'Employee',
        signedAt: null,
        isMe: false,
      },
      {
        id: 'me-policy',
        name: 'You',
        initials: 'HR',
        role: 'HR Manager',
        signedAt: null,
        isMe: true,
      },
    ],
  },
];

const statusConfig: Record<
  SignatureStatus,
  { label: string; group: RequestGroup; className: string }
> = {
  'your-turn': {
    label: 'Your turn',
    group: 'awaiting-me',
    className: 'bg-accent text-accent-foreground',
  },
  'in-progress': {
    label: 'In progress',
    group: 'awaiting-others',
    className: 'bg-primary/10 text-primary',
  },
  completed: {
    label: 'Completed',
    group: 'completed',
    className: 'bg-emerald-100 text-emerald-800',
  },
  declined: {
    label: 'Declined',
    group: 'closed',
    className: 'bg-destructive/10 text-destructive',
  },
  expired: {
    label: 'Expired',
    group: 'closed',
    className: 'bg-muted text-muted-foreground',
  },
};

const sendSteps = ['Document', 'Signers', 'Review'];
const sendStepHints = [
  'Upload a document and give it a clear title.',
  'Add everyone who needs to sign.',
  'Check the details, then send.',
];
const sendNextLabels = [' Add signers', 'Review'];

const signatureModes: { value: SignatureMode; label: string }[] = [
  { value: 'draw', label: 'Draw' },
  { value: 'type', label: 'Type' },
  { value: 'upload', label: 'Upload' },
];

const isStatusFilter = (value: string): value is StatusFilter =>
  esignatureStatusFilterOptions.some(option => option.value === value);

const formatDate = (date: string) =>
  new Intl.DateTimeFormat('en-GB').format(new Date(`${date}T00:00:00`));

const getDueLabel = (date: string) => {
  const today = new Date(new Date().toDateString()).getTime();
  const days = Math.round(
    (new Date(`${date}T00:00:00`).getTime() - today) / 86400000
  );

  if (days === 0) return 'Due today';
  if (days === 1) return 'Due tomorrow';
  return days > 0 ? `Due in ${days} days` : `Overdue by ${Math.abs(days)} days`;
};

const getInitials = (name: string) =>
  name === 'You'
    ? 'HR'
    : name
        .split(' ')
        .map(part => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

const createSendSigner = (name: string, role: string): SendSigner => ({
  id: `send-signer-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  name,
  role,
});

const getStatusLabel = (request: SignatureRequest) => {
  if (request.status !== 'in-progress')
    return statusConfig[request.status].label;

  const signedCount = request.signers.filter(signer => signer.signedAt).length;
  return `${signedCount} of ${request.signers.length} signed`;
};

const downloadRequest = (request: SignatureRequest) => {
  const fileContent = [
    request.title,
    '',
    `Sent by: ${request.sentBy} on ${formatDate(request.sentAt)}`,
    `Due: ${formatDate(request.dueDate)}`,
    `Status: ${statusConfig[request.status].label}`,
    `Signers: ${request.signers.map(signer => signer.name).join(', ')}`,
    '',
    'This sample file represents the signed document download workflow.',
  ].join('\n');
  const downloadUrl = URL.createObjectURL(
    new Blob([fileContent], { type: 'text/plain;charset=utf-8' })
  );
  const link = document.createElement('a');

  link.href = downloadUrl;
  link.download = `${request.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.txt`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 0);
};

const createRequestColumns = ({
  onView,
  onSign,
}: {
  onView: (request: SignatureRequest) => void;
  onSign: (request: SignatureRequest) => void;
}): ColumnDef<SignatureRequest>[] => [
  {
    accessorKey: 'title',
    header: 'Document',
    cell: ({ row }) => {
      const request = row.original;
      return (
        <div className="flex min-w-56 items-start gap-3">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FileText className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="font-semibold text-foreground">{request.title}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Sent by {request.sentBy} · {formatDate(request.sentAt)}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    id: 'signers',
    header: 'Signers',
    enableSorting: false,
    cell: ({ row }) => (
      <div className="flex min-w-24 -space-x-2">
        {row.original.signers.map(signer => (
          <span
            key={signer.id}
            title={`${signer.name} · ${signer.role}`}
            className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-card bg-primary/15 text-xs font-semibold text-primary"
          >
            {signer.initials}
          </span>
        ))}
      </div>
    ),
  },
  {
    accessorKey: 'dueDate',
    header: 'Due',
    cell: ({ getValue }) => (
      <span className="whitespace-nowrap text-muted-foreground">
        {formatDate(getValue<string>())}
      </span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge
        variant="secondary"
        className={cn(
          'whitespace-nowrap border-transparent',
          statusConfig[row.original.status].className
        )}
      >
        {getStatusLabel(row.original)}
      </Badge>
    ),
  },
  {
    id: 'actions',
    header: 'Action',
    enableSorting: false,
    cell: ({ row }) =>
      row.original.status === 'your-turn' ? (
        <Button
          type="button"
          size="sm"
          aria-label={`Sign ${row.original.title}`}
          onClick={() => onSign(row.original)}
        >
          <PenLine className="h-4 w-4" aria-hidden="true" />
          Sign
        </Button>
      ) : (
        <Button
          type="button"
          size="icon"
          variant="outline"
          className="h-8 w-8"
          aria-label={`View ${row.original.title}`}
          onClick={() => onView(row.original)}
        >
          <Eye className="h-4 w-4" aria-hidden="true" />
        </Button>
      ),
  },
];

interface SignaturePadProps {
  resetKey: number;
  onChange: (hasSignature: boolean) => void;
}

const SignaturePad = ({ resetKey, onChange }: SignaturePadProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas?.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
    onChange(false);
  }, [resetKey, onChange]);

  const getPoint = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const canvas = event.currentTarget;
    const bounds = canvas.getBoundingClientRect();

    return {
      x: (event.clientX - bounds.left) * (canvas.width / bounds.width),
      y: (event.clientY - bounds.top) * (canvas.height / bounds.height),
    };
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const context = event.currentTarget.getContext('2d');
    if (!context) return;

    const { x, y } = getPoint(event);
    isDrawing.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    context.strokeStyle = getComputedStyle(event.currentTarget).color;
    context.lineWidth = 3;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.beginPath();
    context.moveTo(x, y);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;

    const context = event.currentTarget.getContext('2d');
    if (!context) return;

    const { x, y } = getPoint(event);
    context.lineTo(x, y);
    context.stroke();
    onChange(true);
  };

  const stopDrawing = () => {
    isDrawing.current = false;
  };

  return (
    <canvas
      ref={canvasRef}
      width={480}
      height={200}
      aria-label="Draw your signature"
      className="h-40 w-full touch-none rounded-lg border border-border bg-background text-foreground"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={stopDrawing}
      onPointerLeave={stopDrawing}
    />
  );
};

const ESignaturePage = () => {
  const [requests, setRequests] = useState(initialRequests);
  const [activeGroup, setActiveGroup] = useState<RequestGroup | null>(
    'awaiting-me'
  );
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [selectedId, setSelectedId] = useState<string | null>(
    initialRequests[0]?.id ?? null
  );

  const [signatureMode, setSignatureMode] = useState<SignatureMode>('draw');
  const [hasDrawnSignature, setHasDrawnSignature] = useState(false);
  const [padResetKey, setPadResetKey] = useState(0);
  const [isSignOpen, setIsSignOpen] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [typedName, setTypedName] = useState('');
  const [uploadedSignatureName, setUploadedSignatureName] = useState('');

  const [isSendOpen, setIsSendOpen] = useState(false);
  const [sendTitle, setSendTitle] = useState('');
  const [sendStep, setSendStep] = useState(0);
  const [sendSigners, setSendSigners] = useState<SendSigner[]>(() => [
    createSendSigner('Rahul Menon', 'Employee'),
  ]);
  const [sendInOrder, setSendInOrder] = useState(true);
  const [sendDueDate, setSendDueDate] = useState('');
  const [sendReminder, setSendReminder] = useState('2');
  const [sendMessage, setSendMessage] = useState('');
  const [sendFileName, setSendFileName] = useState('');

  const [isDeclineOpen, setIsDeclineOpen] = useState(false);
  const [declineChoice, setDeclineChoice] = useState('');
  const [declineReason, setDeclineReason] = useState('');
  const [successRequest, setSuccessRequest] = useState<SignatureRequest | null>(
    null
  );

  const selectedRequest =
    requests.find(request => request.id === selectedId) ?? null;
  const canSign = selectedRequest?.status === 'your-turn';
  const groupCounts = useMemo(
    () => ({
      'awaiting-me': requests.filter(
        request => statusConfig[request.status].group === 'awaiting-me'
      ).length,
      'awaiting-others': requests.filter(
        request => statusConfig[request.status].group === 'awaiting-others'
      ).length,
      completed: requests.filter(
        request => statusConfig[request.status].group === 'completed'
      ).length,
      closed: requests.filter(
        request => statusConfig[request.status].group === 'closed'
      ).length,
    }),
    [requests]
  );

  const visibleRequests = useMemo(() => {
    return requests
      .filter(
        request =>
          (activeGroup === null ||
            statusConfig[request.status].group === activeGroup) &&
          (statusFilter === 'all' || request.status === statusFilter)
      )
      .sort((first, second) => second.sentAt.localeCompare(first.sentAt));
  }, [activeGroup, requests, statusFilter]);

  const resetSignature = () => {
    setSignatureMode('draw');
    setAgreed(false);
    setHasDrawnSignature(false);
    setPadResetKey(key => key + 1);
    setTypedName('');
    setUploadedSignatureName('');
  };

  const selectRequest = (request: SignatureRequest) => {
    setSelectedId(request.id);
    resetSignature();
  };

  const requestColumns = useMemo(
    () =>
      createRequestColumns({
        onView: request => {
          selectRequest(request);
          setIsSignOpen(true);
        },
        onSign: request => {
          selectRequest(request);
          setIsSignOpen(true);
        },
      }),
    []
  );

  const summaryCards: {
    group: RequestGroup;
    label: string;
    icon: typeof PenLine;
    iconClassName: string;
  }[] = [
    {
      group: 'awaiting-me',
      label: 'Awaiting my signature',
      icon: PenLine,
      iconClassName: 'bg-primary/10 text-primary',
    },
    {
      group: 'awaiting-others',
      label: 'Awaiting others',
      icon: Clock3,
      iconClassName: 'bg-primary/10 text-primary',
    },
    {
      group: 'completed',
      label: 'Completed',
      icon: CheckCircle2,
      iconClassName: 'bg-emerald-100 text-emerald-800',
    },
    {
      group: 'closed',
      label: 'Declined or expired',
      icon: XCircle,
      iconClassName: 'bg-destructive/10 text-destructive',
    },
  ];

  const hasSignature =
    (signatureMode === 'draw' && hasDrawnSignature) ||
    (signatureMode === 'type' && Boolean(typedName.trim())) ||
    (signatureMode === 'upload' && Boolean(uploadedSignatureName));

  const canFinish = hasSignature && agreed;

  const renderSignatureSlot = () => {
    if (signatureMode === 'type' && typedName.trim()) {
      return <span className="font-serif text-3xl italic">{typedName}</span>;
    }

    if (hasSignature) {
      return (
        <span className="flex items-center gap-2">
          <Check className="h-4 w-4" aria-hidden="true" />
          Signature added
        </span>
      );
    }

    return (
      <span className="flex items-center gap-2">
        <PenLine className="h-4 w-4" aria-hidden="true" />
        Your signature goes here
      </span>
    );
  };

  const handleSign = () => {
    if (!selectedRequest || !canSign) return;

    if (!canFinish) {
      toast.error('Add your signature and accept the agreement.');
      return;
    }

    const today = new Date().toISOString().slice(0, 10);
    const signers = selectedRequest.signers.map(signer =>
      signer.isMe ? { ...signer, signedAt: today } : signer
    );
    const updatedRequest: SignatureRequest = {
      ...selectedRequest,
      signers,
      status: signers.every(signer => signer.signedAt)
        ? 'completed'
        : 'in-progress',
    };

    setRequests(currentRequests =>
      currentRequests.map(request =>
        request.id === updatedRequest.id ? updatedRequest : request
      )
    );
    setIsSignOpen(false);
    resetSignature();
    setSuccessRequest(updatedRequest);
  };

  const closeSignDialog = () => {
    setIsSignOpen(false);
    resetSignature();
  };

  const closeDeclineDialog = () => {
    setIsDeclineOpen(false);
    setDeclineChoice('');
    setDeclineReason('');
  };

  const handleDecline = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedRequest) return;

    if (!declineChoice) {
      toast.error('Choose why you are declining.');
      return;
    }

    if (declineChoice === 'Something else' && !declineReason.trim()) {
      toast.error('Tell the sender why you are declining.');
      return;
    }

    const reason = [declineChoice, declineReason.trim()]
      .filter(Boolean)
      .join(' – ');

    setRequests(currentRequests =>
      currentRequests.map(request =>
        request.id === selectedRequest.id
          ? { ...request, status: 'declined', declinedReason: reason }
          : request
      )
    );
    toast.success(`"${selectedRequest.title}" declined.`);
    closeDeclineDialog();
  };

  const closeSendDialog = () => {
    setIsSendOpen(false);
    setSendStep(0);
    setSendTitle('');
    setSendFileName('');
    setSendSigners([createSendSigner('Rahul Menon', 'Employee')]);
    setSendInOrder(true);
    setSendDueDate('');
    setSendReminder('2');
    setSendMessage('');
  };

  const updateSendSigner = (id: string, changes: Partial<SendSigner>) => {
    setSendSigners(currentSigners =>
      currentSigners.map(signer =>
        signer.id === id ? { ...signer, ...changes } : signer
      )
    );
  };

  const removeSendSigner = (id: string) => {
    setSendSigners(currentSigners =>
      currentSigners.filter(signer => signer.id !== id)
    );
  };

  const handleSendSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (sendStep === 0 && (!sendFileName || !sendTitle.trim())) {
      toast.error('Choose a file and add a title.');
      return;
    }

    if (sendStep === 1 && !sendDueDate) {
      toast.error('Pick a due date.');
      return;
    }

    if (sendStep < sendSteps.length - 1) {
      setSendStep(step => step + 1);
      return;
    }

    const today = new Date().toISOString().slice(0, 10);
    const newRequest: SignatureRequest = {
      id: `signature-request-${Date.now()}`,
      title: sendTitle.trim(),
      sentBy: 'You',
      sentAt: today,
      dueDate: sendDueDate,
      status: sendSigners[0]?.name === 'You' ? 'your-turn' : 'in-progress',
      signers: sendSigners.map(signer => ({
        id: signer.id,
        name: signer.name,
        initials: getInitials(signer.name),
        role: signer.role,
        signedAt: null,
        isMe: signer.name === 'You',
      })),
    };

    setRequests(currentRequests => [newRequest, ...currentRequests]);
    setActiveGroup(statusConfig[newRequest.status].group);
    setSelectedId(newRequest.id);
    closeSendDialog();
    toast.success(
      `"${newRequest.title}" sent to ${newRequest.signers.length} ${
        newRequest.signers.length === 1 ? 'signer' : 'signers'
      }.`
    );
  };

  const successSignedCount =
    successRequest?.signers.filter(signer => signer.signedAt).length ?? 0;
  const successTotal = successRequest?.signers.length ?? 0;
  const successNextSigner = successRequest?.signers.find(
    signer => !signer.signedAt
  );

  return (
    <>
      <Section title="E-Signature" menuId="esignature" showBreadcrumbs>
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {summaryCards.map(({ group, label, icon: Icon, iconClassName }) => (
              <Button
                key={group}
                type="button"
                variant="ghost"
                aria-pressed={activeGroup === group}
                className="h-auto w-full min-w-0 shrink justify-start whitespace-normal p-0 text-left font-normal hover:bg-transparent"
                onClick={() =>
                  setActiveGroup(current => (current === group ? null : group))
                }
              >
                <Card
                  className={cn(
                    'flex w-full min-w-0 items-center gap-3 border-border p-4 text-left transition-colors',
                    activeGroup === group && 'border-2 border-primary'
                  )}
                >
                  <span
                    className={cn(
                      'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
                      iconClassName
                    )}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <p className="text-xl font-semibold text-card-foreground">
                      {groupCounts[group]}
                    </p>
                  </div>
                </Card>
              </Button>
            ))}
          </div>

          <TanStackTable
            data={visibleRequests}
            columns={requestColumns}
            enableSearch={false}
            showDownload={true}
            enableColumnVisibility={false}
            enablePagination
            pageSize={8}
            pageSizeOptions={[8, 10, 20]}
            getRowId={request => request.id}
            emptyMessage="No signature requests match these filters."
            customFilters={
              <div className="grid w-full grid-cols-2 items-end gap-3">
                <FormField
                  label="Status"
                  name="signature-status"
                  type="select"
                  value={statusFilter}
                  onChange={value => {
                    if (isStatusFilter(value)) setStatusFilter(value);
                  }}
                  options={esignatureStatusFilterOptions}
                />

                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  onClick={() => setIsSendOpen(true)}
                >
                  <PenLine className="w-4 h-4" />
                  Send for Signature
                </Button>
              </div>
            }
          />
        </div>
      </Section>

      <Dialog
        open={isSignOpen && Boolean(selectedRequest)}
        onOpenChange={open => {
          if (open) {
            setIsSignOpen(true);
          } else {
            closeSignDialog();
          }
        }}
      >
        <DialogContent
          className="max-h-[92vh] overflow-y-auto sm:max-w-3xl"
          onInteractOutside={event => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>{selectedRequest?.title}</DialogTitle>
            <DialogDescription>
              {selectedRequest &&
                `Sent by ${selectedRequest.sentBy} · ${
                  canSign
                    ? getDueLabel(selectedRequest.dueDate)
                    : `Due ${formatDate(selectedRequest.dueDate)}`
                }`}
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div
              className={cn(
                'grid gap-6',
                canSign && 'md:grid-cols-[1.1fr_1fr]'
              )}
            >
              <div className="space-y-5">
                <div className="rounded-xl bg-muted/50 p-4">
                  <div className="space-y-2.5 rounded-lg bg-card p-5 shadow-sm">
                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <FileText
                        className="h-4 w-4 shrink-0 text-primary"
                        aria-hidden="true"
                      />
                      <span className="truncate">
                        {selectedRequest.title}.pdf
                      </span>
                    </div>
                    <div className="h-2 rounded bg-muted" />
                    <div className="h-2 w-11/12 rounded bg-muted" />
                    <div className="h-2 w-3/4 rounded bg-muted" />
                    <div className="h-2 w-2/3 rounded bg-muted" />
                    {canSign && (
                      <div className="mt-3 flex h-24 items-center justify-center rounded-lg border-2 border-dashed border-primary bg-primary/5 px-3 text-center text-sm font-medium text-primary">
                        {renderSignatureSlot()}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {canSign && (
                <div className="space-y-4 self-start rounded-xl border border-border bg-card p-4">
                  <div>
                    <h3 className="text-base font-semibold text-foreground">
                      Add your signature
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Choose how you want to sign.
                    </p>
                  </div>

                  <div
                    role="group"
                    aria-label="Signature type"
                    className="grid grid-cols-3 gap-1 rounded-lg bg-muted p-1"
                  >
                    {signatureModes.map(mode => (
                      <Button
                        key={mode.value}
                        type="button"
                        size="sm"
                        variant={
                          signatureMode === mode.value ? 'default' : 'ghost'
                        }
                        aria-pressed={signatureMode === mode.value}
                        onClick={() => setSignatureMode(mode.value)}
                      >
                        {mode.label}
                      </Button>
                    ))}
                  </div>

                  {signatureMode === 'draw' && (
                    <div className="space-y-1">
                      <div className="relative">
                        <SignaturePad
                          resetKey={padResetKey}
                          onChange={setHasDrawnSignature}
                        />
                        <span className="pointer-events-none absolute inset-x-4 bottom-8 border-t border-border" />
                        {!hasDrawnSignature && (
                          <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
                            Draw your signature here
                          </span>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setPadResetKey(key => key + 1)}
                      >
                        Clear and redo
                      </Button>
                    </div>
                  )}

                  {signatureMode === 'type' && (
                    <div className="space-y-3">
                      <FormField
                        label="Full name"
                        name="typed-signature"
                        value={typedName}
                        onChange={setTypedName}
                        placeholder="Type your full name"
                      />
                      <div className="flex h-24 items-center justify-center rounded-lg border border-border bg-background px-3">
                        <span
                          className={cn(
                            'truncate font-serif text-3xl italic',
                            !typedName.trim() && 'text-muted-foreground/50'
                          )}
                        >
                          {typedName.trim() || 'Your signature'}
                        </span>
                      </div>
                    </div>
                  )}

                  {signatureMode === 'upload' &&
                    (uploadedSignatureName ? (
                      <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <FileText className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <p className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
                          {uploadedSignatureName}
                        </p>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setUploadedSignatureName('')}
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <FormField
                        label="Signature image"
                        name="uploaded-signature"
                        type="file"
                        value=""
                        accept=".png,.jpg,.jpeg"
                        onFileChange={event => {
                          const file = event.currentTarget.files?.[0];
                          setUploadedSignatureName(file?.name ?? '');
                        }}
                        hint="Use a clear photo of your signature on white paper."
                      />
                    ))}

                  <FormField
                    label="I agree this is my legal signature on this document."
                    name="signature-agreement"
                    type="checkbox"
                    value={agreed}
                    onCheckboxChange={setAgreed}
                  />

                  {!canFinish && (
                    <p className="text-xs text-muted-foreground">
                      Add your signature and tick the box to continue.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          <DialogFooter className="gap-2 sm:justify-between">
            {selectedRequest && (
              <Button
                type="button"
                variant="default"
                onClick={() => {
                  downloadRequest(selectedRequest);
                  toast.success(`Downloading "${selectedRequest.title}".`);
                }}
              >
                <ArrowDownToLine className="h-4 w-4" aria-hidden="true" />
                Download
              </Button>
            )}
            <div className="flex flex-col-reverse gap-2 sm:flex-row">
              {canSign ? (
                <>
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                    onClick={() => {
                      setIsSignOpen(false);
                      setIsDeclineOpen(true);
                    }}
                  >
                    Decline
                  </Button>
                  <Button
                    type="button"
                    disabled={!canFinish}
                    onClick={handleSign}
                  >
                    <PenLine className="h-4 w-4" aria-hidden="true" />
                    Sign &amp; Finish
                  </Button>
                </>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeSignDialog}
                >
                  Close
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isSendOpen}
        onOpenChange={open => {
          if (open) {
            setIsSendOpen(true);
          } else {
            closeSendDialog();
          }
        }}
      >
        <DialogContent
          className="max-h-[92vh] overflow-y-auto sm:max-w-xl"
          onInteractOutside={event => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Send for Signature</DialogTitle>
            <DialogDescription>{sendStepHints[sendStep]}</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSendSubmit} className="space-y-5">
            <div
              role="list"
              aria-label="Steps"
              className="flex items-center gap-2 text-sm"
            >
              {sendSteps.map((label, index) => (
                <div
                  key={label}
                  role="listitem"
                  aria-current={index === sendStep ? 'step' : undefined}
                  className="flex flex-1 items-center gap-2 last:flex-none"
                >
                  <span
                    className={cn(
                      'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                      index < sendStep
                        ? 'bg-emerald-100 text-success'
                        : index === sendStep
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {index < sendStep ? (
                      <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    ) : (
                      index + 1
                    )}
                  </span>
                  <span
                    className={cn(
                      'font-medium',
                      index === sendStep
                        ? 'text-foreground'
                        : 'text-muted-foreground'
                    )}
                  >
                    {label}
                  </span>
                  {index < sendSteps.length - 1 && (
                    <span className="h-px flex-1 bg-border" />
                  )}
                </div>
              ))}
            </div>

            {sendStep === 0 && (
              <div className="space-y-4">
                {sendFileName ? (
                  <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <FileText className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {sendFileName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Ready to send
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setSendFileName('')}
                    >
                      Replace
                    </Button>
                  </div>
                ) : (
                  <FormField
                    label="Document file"
                    name="signature-document-file"
                    type="file"
                    value=""
                    accept=".pdf,.doc,.docx"
                    onFileChange={event => {
                      const file = event.currentTarget.files?.[0];
                      setSendFileName(file?.name ?? '');
                      if (file && !sendTitle.trim()) {
                        setSendTitle(file.name.replace(/\.[^.]+$/, ''));
                      }
                    }}
                    hint="Choose a PDF or Word file."
                  />
                )}
                <FormField
                  label="Document title"
                  name="signature-document-title"
                  value={sendTitle}
                  onChange={setSendTitle}
                  placeholder="e.g. Offer Letter – Priya Nair"
                  required
                />
              </div>
            )}

            {sendStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-3">
                  {sendSigners.map((signer, index) => (
                    <div
                      key={signer.id}
                      className="grid gap-2 sm:grid-cols-3 sm:items-end"
                    >
                      <FormField
                        label={`Signer ${index + 1}`}
                        name={`signer-name-${signer.id}`}
                        type="select"
                        value={signer.name}
                        onChange={value =>
                          updateSendSigner(signer.id, { name: value })
                        }
                        options={esignatureSignerOptions}
                      />
                      <FormField
                        label="Role"
                        name={`signer-role-${signer.id}`}
                        type="select"
                        value={signer.role}
                        onChange={value =>
                          updateSendSigner(signer.id, { role: value })
                        }
                        options={esignatureRoleOptions}
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        aria-label={`Remove signer ${index + 1}`}
                        disabled={sendSigners.length === 1}
                        onClick={() => removeSendSigner(signer.id)}
                      >
                        <X className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-primary"
                    onClick={() =>
                      setSendSigners(currentSigners => [
                        ...currentSigners,
                        createSendSigner('Rahul Menon', 'Employee'),
                      ])
                    }
                  >
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    Add another signer
                  </Button>
                </div>

                <FormField
                  label="Signers sign in order"
                  name="signature-sign-in-order"
                  type="checkbox"
                  value={sendInOrder}
                  onCheckboxChange={setSendInOrder}
                  hint="Each person gets the document after the one before signs."
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    label="Due date"
                    name="signature-document-due"
                    type="date"
                    value={sendDueDate}
                    onChange={setSendDueDate}
                    required
                  />
                  <FormField
                    label="Send reminders"
                    name="signature-reminders"
                    type="select"
                    value={sendReminder}
                    onChange={setSendReminder}
                    options={esignatureReminderOptions}
                  />
                </div>
              </div>
            )}

            {sendStep === 2 && (
              <div className="space-y-4">
                <div
                  role="group"
                  aria-label="Signature request summary"
                  className="divide-y divide-border rounded-lg border border-border px-4 text-sm"
                >
                  <div className="flex items-center justify-between gap-4 py-3">
                    <span className="text-muted-foreground">Document</span>
                    <span className="truncate font-medium text-foreground">
                      {sendTitle.trim() || sendFileName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4 py-3">
                    <span className="text-muted-foreground">Signers</span>
                    <span className="flex flex-wrap justify-end gap-1.5">
                      {sendSigners.map((signer, index) => (
                        <Badge
                          key={signer.id}
                          variant="secondary"
                          className="border-transparent bg-primary/10 text-primary"
                        >
                          {sendInOrder ? `${index + 1} ` : ''}
                          {signer.name}
                        </Badge>
                      ))}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4 py-3">
                    <span className="text-muted-foreground">Due date</span>
                    <span className="font-medium text-foreground">
                      {sendDueDate ? formatDate(sendDueDate) : '–'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4 py-3">
                    <span className="text-muted-foreground">Reminders</span>
                    <span className="font-medium text-foreground">
                      {esignatureReminderOptions.find(
                        option => option.value === sendReminder
                      )?.label ?? ''}
                    </span>
                  </div>
                </div>
                <FormField
                  label="Message to signers (optional)"
                  name="signature-message"
                  value={sendMessage}
                  onChange={setSendMessage}
                  placeholder="Please review and sign by the due date."
                />
              </div>
            )}

            <DialogFooter className="gap-2 sm:justify-between">
              {sendStep === 0 ? (
                <Button
                  key="cancel"
                  type="button"
                  variant="ghost"
                  onClick={closeSendDialog}
                >
                  Cancel
                </Button>
              ) : (
                <Button
                  key="back"
                  type="button"
                  variant="ghost"
                  onClick={() => setSendStep(step => step - 1)}
                >
                  Back
                </Button>
              )}
              {sendStep < sendSteps.length - 1 ? (
                <Button key="next" type="submit">
                  {sendNextLabels[sendStep]}
                </Button>
              ) : (
                <Button key="send" type="submit">
                  <Send className="h-4 w-4" aria-hidden="true" />
                  Send for signature
                </Button>
              )}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isDeclineOpen}
        onOpenChange={open => {
          if (open) {
            setIsDeclineOpen(true);
          } else {
            closeDeclineDialog();
          }
        }}
      >
        <DialogContent
          className="sm:max-w-md"
          onInteractOutside={event => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Decline to sign</DialogTitle>
            <DialogDescription>
              {selectedRequest?.title} · From {selectedRequest?.sentBy}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleDecline} className="space-y-4">
            <FormField
              label="Why are you declining?"
              name="decline-choice"
              type="radio"
              value={declineChoice}
              onChange={setDeclineChoice}
              options={esignatureDeclineReasonOptions}
            />

            <FormField
              label="Tell the sender what needs to change"
              name="decline-reason"
              value={declineReason}
              onChange={setDeclineReason}
              placeholder="e.g. The salary figure on page 2 does not match"
            />

            <div className="flex gap-3 rounded-lg bg-accent p-3 text-sm text-accent-foreground">
              <AlertTriangle
                className="mt-0.5 h-4 w-4 shrink-0"
                aria-hidden="true"
              />
              <span>
                Declining stops the signing for everyone.{' '}
                {selectedRequest?.sentBy} will see your reason.
              </span>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={closeDeclineDialog}
              >
                Cancel
              </Button>
              <Button type="submit" variant="destructive">
                Decline document
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(successRequest)}
        onOpenChange={open => {
          if (!open) setSuccessRequest(null);
        }}
      >
        <DialogContent
          className="sm:max-w-sm"
          onInteractOutside={event => event.preventDefault()}
        >
          <DialogHeader className="items-center text-center sm:text-center">
            <span className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
              <Check className="h-7 w-7" aria-hidden="true" />
            </span>
            <DialogTitle>You signed {successRequest?.title}</DialogTitle>
            <DialogDescription>
              Thanks! Your signature has been added.
            </DialogDescription>
          </DialogHeader>

          {successRequest && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-foreground">
                  {successSignedCount} of {successTotal} signed
                </span>
                <span className="text-muted-foreground">
                  {successNextSigner
                    ? `Next: ${successNextSigner.name}`
                    : 'Everyone has signed'}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{
                    width: `${(successSignedCount / successTotal) * 100}%`,
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Everyone gets a signed copy by email once the last person signs.
              </p>
            </div>
          )}

          <DialogFooter className="gap-2 sm:justify-center">
            {successRequest && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  downloadRequest(successRequest);
                  toast.success(`Downloading "${successRequest.title}".`);
                }}
              >
                <ArrowDownToLine className="h-4 w-4" aria-hidden="true" />
                Download copy
              </Button>
            )}
            <Button type="button" onClick={() => setSuccessRequest(null)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ESignaturePage;
