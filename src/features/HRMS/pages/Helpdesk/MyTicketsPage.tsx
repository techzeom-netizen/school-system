import { useMemo, useState, type FormEvent } from 'react';
import type { ColumnDef, Row } from '@tanstack/react-table';
import { EyeIcon, MessageSquare, Plus, Send } from 'lucide-react';
import Section from '@/components/common/Section';
import FormField from '@/components/common/FormField';
import TanStackTable from '@/components/common/TanStackTable';
import { Button } from '@/components/ui/button';
import {
  helpdeskTicketCategoryFilterOptions,
  helpdeskTicketCategoryOptions,
  helpdeskTicketPriorityFilterOptions,
  helpdeskTicketPriorityOptions,
} from '@/data/reusableDropdownData';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

export {
  helpdeskTicketCategoryFilterOptions,
  helpdeskTicketCategoryOptions,
  helpdeskTicketPriorityFilterOptions,
  helpdeskTicketPriorityOptions,
} from '@/data/reusableDropdownData';

type TicketStatus = 'Open' | 'In progress' | 'Resolved' | 'Closed';
type TicketPriority = 'High' | 'Medium' | 'Low';
type StatusFilter = 'All' | TicketStatus;

type TicketMessage = {
  id: string;
  author: string;
  role: 'you' | 'agent';
  text: string;
  at: string;
};

type TicketRecord = {
  id: string;
  subject: string;
  category: string;
  priority: TicketPriority;
  status: TicketStatus;
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  messages: TicketMessage[];
};

type TicketDraft = {
  subject: string;
  category: string;
  priority: TicketPriority;
  description: string;
};

const CURRENT_USER = 'You';

const statusTabs: StatusFilter[] = [
  'All',
  'Open',
  'In progress',
  'Resolved',
  'Closed',
];

const statusDot: Record<TicketStatus, string> = {
  Open: 'bg-primary',
  'In progress': 'bg-accent-foreground',
  Resolved: 'bg-secondary-foreground',
  Closed: 'bg-muted-foreground',
};

const priorityBadge: Record<TicketPriority, string> = {
  High: 'bg-destructive/10 text-destructive',
  Medium: 'bg-accent text-accent-foreground',
  Low: 'bg-muted text-muted-foreground',
};

const createId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `msg-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const ago = (days: number, hour: number, minute: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
};

const initialTickets: TicketRecord[] = [
  {
    id: 'TKT-1048',
    subject: 'Payslip shows wrong deductions',
    category: 'Payroll',
    priority: 'High',
    status: 'Open',
    assignedTo: 'Priya (HR)',
    createdAt: ago(0, 9, 40),
    updatedAt: ago(0, 10, 20),
    description:
      'My October payslip shows a deduction of PF twice. Please check and correct it.',
    messages: [
      {
        id: createId(),
        author: CURRENT_USER,
        role: 'you',
        text: 'My October payslip shows a deduction of PF twice. Please check and correct it.',
        at: ago(0, 9, 40),
      },
      {
        id: createId(),
        author: 'Priya (HR)',
        role: 'agent',
        text: 'Thanks for flagging this. I am reviewing the payroll run and will update you shortly.',
        at: ago(0, 10, 20),
      },
    ],
  },
  {
    id: 'TKT-1045',
    subject: 'Laptop not connecting to VPN',
    category: 'IT Support',
    priority: 'Medium',
    status: 'In progress',
    assignedTo: 'Rahul (IT)',
    createdAt: ago(2, 15, 5),
    updatedAt: ago(1, 11, 30),
    description:
      'VPN client shows "authentication failed" since the last Windows update.',
    messages: [
      {
        id: createId(),
        author: CURRENT_USER,
        role: 'you',
        text: 'VPN client shows "authentication failed" since the last Windows update.',
        at: ago(2, 15, 5),
      },
      {
        id: createId(),
        author: 'Rahul (IT)',
        role: 'agent',
        text: 'Could you reinstall the VPN client from the software portal and try again?',
        at: ago(1, 11, 30),
      },
    ],
  },
  {
    id: 'TKT-1041',
    subject: 'Leave balance not updated',
    category: 'Leave',
    priority: 'Medium',
    status: 'Open',
    assignedTo: 'Unassigned',
    createdAt: ago(3, 12, 0),
    updatedAt: ago(3, 12, 0),
    description:
      'My approved leave from last month is still not reflected in my balance.',
    messages: [
      {
        id: createId(),
        author: CURRENT_USER,
        role: 'you',
        text: 'My approved leave from last month is still not reflected in my balance.',
        at: ago(3, 12, 0),
      },
    ],
  },
  {
    id: 'TKT-1039',
    subject: 'Update bank account details',
    category: 'Payroll',
    priority: 'Low',
    status: 'Resolved',
    assignedTo: 'Priya (HR)',
    createdAt: ago(6, 10, 15),
    updatedAt: ago(5, 16, 45),
    description: 'Please update my salary account to my new bank.',
    messages: [
      {
        id: createId(),
        author: CURRENT_USER,
        role: 'you',
        text: 'Please update my salary account to my new bank.',
        at: ago(6, 10, 15),
      },
      {
        id: createId(),
        author: 'Priya (HR)',
        role: 'agent',
        text: 'Your bank details have been updated and will apply from the next payroll cycle.',
        at: ago(5, 16, 45),
      },
    ],
  },
  {
    id: 'TKT-1032',
    subject: 'ID card replacement',
    category: 'Admin',
    priority: 'Low',
    status: 'Resolved',
    assignedTo: 'Kiran (Admin)',
    createdAt: ago(11, 9, 0),
    updatedAt: ago(10, 14, 10),
    description: 'My ID card is damaged and needs to be replaced.',
    messages: [
      {
        id: createId(),
        author: CURRENT_USER,
        role: 'you',
        text: 'My ID card is damaged and needs to be replaced.',
        at: ago(11, 9, 0),
      },
      {
        id: createId(),
        author: 'Kiran (Admin)',
        role: 'agent',
        text: 'A new card is ready. Please collect it from the front desk.',
        at: ago(10, 14, 10),
      },
    ],
  },
  {
    id: 'TKT-1027',
    subject: 'Attendance regularisation missing',
    category: 'Attendance',
    priority: 'High',
    status: 'Closed',
    assignedTo: 'Meera (HR)',
    createdAt: ago(16, 11, 0),
    updatedAt: ago(14, 17, 0),
    description:
      'My regularisation request for 24 Sep is not visible in the attendance module.',
    messages: [
      {
        id: createId(),
        author: CURRENT_USER,
        role: 'you',
        text: 'My regularisation request for 24 Sep is not visible in the attendance module.',
        at: ago(16, 11, 0),
      },
      {
        id: createId(),
        author: 'Meera (HR)',
        role: 'agent',
        text: 'The request has been approved and the record is now updated. Closing this ticket.',
        at: ago(14, 17, 0),
      },
    ],
  },
];

const createEmptyDraft = (): TicketDraft => ({
  subject: '',
  category: helpdeskTicketCategoryOptions[0].value,
  priority: 'Medium',
  description: '',
});

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

const formatTime = (date: Date) =>
  date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

const formatShortDate = (date: Date) =>
  date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });

const formatUpdated = (iso: string) => {
  const date = new Date(iso);
  const diffDays = Math.round(
    (startOfDay(new Date()) - startOfDay(date)) / 86_400_000
  );
  if (diffDays === 0) return `Today, ${formatTime(date)}`;
  if (diffDays === 1) return 'Yesterday';
  return formatShortDate(date);
};

const formatMessageTime = (iso: string) => {
  const date = new Date(iso);
  const diffDays = Math.round(
    (startOfDay(new Date()) - startOfDay(date)) / 86_400_000
  );
  if (diffDays === 0) return `Today, ${formatTime(date)}`;
  if (diffDays === 1) return `Yesterday, ${formatTime(date)}`;
  return `${formatShortDate(date)}, ${formatTime(date)}`;
};

const MyTicketsTab = () => {
  const [tickets, setTickets] = useState<TicketRecord[]>(initialTickets);

  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<'All' | TicketPriority>(
    'All'
  );
  const [categoryFilter, setCategoryFilter] = useState('All');

  const [isRaiseDialogOpen, setIsRaiseDialogOpen] = useState(false);
  const [draft, setDraft] = useState<TicketDraft>(createEmptyDraft());
  const [draftTouched, setDraftTouched] = useState(false);

  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const [reply, setReply] = useState('');

  const activeTicket = useMemo(
    () => tickets.find(ticket => ticket.id === activeTicketId) ?? null,
    [tickets, activeTicketId]
  );

  const statusCounts = useMemo(() => {
    const counts: Record<StatusFilter, number> = {
      All: tickets.length,
      Open: 0,
      'In progress': 0,
      Resolved: 0,
      Closed: 0,
    };
    tickets.forEach(ticket => {
      counts[ticket.status] += 1;
    });
    return counts;
  }, [tickets]);

  const filteredTickets = useMemo(() => {
    const query = search.trim().toLowerCase();

    return tickets
      .filter(ticket => {
        if (statusFilter !== 'All' && ticket.status !== statusFilter) {
          return false;
        }
        if (priorityFilter !== 'All' && ticket.priority !== priorityFilter) {
          return false;
        }
        if (categoryFilter !== 'All' && ticket.category !== categoryFilter) {
          return false;
        }
        if (!query) return true;
        return (
          ticket.id.toLowerCase().includes(query) ||
          ticket.subject.toLowerCase().includes(query)
        );
      })
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
  }, [tickets, statusFilter, priorityFilter, categoryFilter, search]);

  const openRaiseDialog = () => {
    setDraft(createEmptyDraft());
    setDraftTouched(false);
    setIsRaiseDialogOpen(true);
  };

  const raiseTicket = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setDraftTouched(true);

    if (!draft.subject.trim() || !draft.description.trim()) {
      toast.error('Please enter a subject and describe the issue.');
      return;
    }

    const nextNumber =
      tickets.reduce(
        (max, ticket) => Math.max(max, Number(ticket.id.replace(/\D/g, ''))),
        1000
      ) + 1;
    const now = new Date().toISOString();

    const newTicket: TicketRecord = {
      id: `TKT-${nextNumber}`,
      subject: draft.subject.trim(),
      category: draft.category,
      priority: draft.priority,
      status: 'Open',
      assignedTo: 'Unassigned',
      createdAt: now,
      updatedAt: now,
      description: draft.description.trim(),
      messages: [
        {
          id: createId(),
          author: CURRENT_USER,
          role: 'you',
          text: draft.description.trim(),
          at: now,
        },
      ],
    };

    setTickets(current => [newTicket, ...current]);
    setIsRaiseDialogOpen(false);
    toast.success(`Ticket ${newTicket.id} submitted successfully.`);
  };

  const openTicket = (ticket: TicketRecord) => {
    setReply('');
    setActiveTicketId(ticket.id);
  };

  const closeTicket = () => {
    setActiveTicketId(null);
    setReply('');
  };

  const sendReply = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = reply.trim();
    if (!text || !activeTicket) return;

    const now = new Date().toISOString();

    setTickets(current =>
      current.map(ticket =>
        ticket.id === activeTicket.id
          ? {
              ...ticket,
              updatedAt: now,
              status: ticket.status === 'Resolved' ? 'Open' : ticket.status,
              messages: [
                ...ticket.messages,
                {
                  id: createId(),
                  author: CURRENT_USER,
                  role: 'you',
                  text,
                  at: now,
                },
              ],
            }
          : ticket
      )
    );
    setReply('');
  };

  const updateStatus = (ticketId: string, status: TicketStatus) => {
    setTickets(current =>
      current.map(ticket =>
        ticket.id === ticketId
          ? { ...ticket, status, updatedAt: new Date().toISOString() }
          : ticket
      )
    );
  };

  const isTicketLocked = activeTicket?.status === 'Closed';

  const columns = useMemo<ColumnDef<TicketRecord>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'Ticket',
        cell: ({ row }) => (
          <Button
            type="button"
            variant="link"
            className="h-auto p-0 text-xs font-semibold"
            onClick={event => {
              event.stopPropagation();
              openTicket(row.original);
            }}
            aria-label={`Open ticket ${row.original.id}`}
          >
            {row.original.id}
          </Button>
        ),
      },
      {
        accessorKey: 'subject',
        header: 'Subject',
        cell: ({ row }) => (
          <div className="min-w-[220px]">
            <p className="font-medium text-foreground">
              {row.original.subject}
            </p>
            <p className="text-xs text-muted-foreground">
              {row.original.category}
            </p>
          </div>
        ),
      },
      {
        accessorKey: 'priority',
        header: 'Priority',
        cell: ({ row }) => (
          <span
            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${priorityBadge[row.original.priority]}`}
          >
            {row.original.priority}
          </span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <span className="inline-flex items-center gap-2 text-foreground">
            <span
              className={`h-2 w-2 rounded-full ${statusDot[row.original.status]}`}
              aria-hidden="true"
            />
            {row.original.status}
          </span>
        ),
      },
      {
        accessorKey: 'updatedAt',
        header: 'Updated',
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-muted-foreground">
            {formatUpdated(row.original.updatedAt)}
          </span>
        ),
      },
      {
        accessorKey: 'assignedTo',
        header: 'Assigned to',
        cell: ({ row }) => (
          <span
            className={
              row.original.assignedTo === 'Unassigned'
                ? 'text-muted-foreground'
                : 'text-card-foreground'
            }
          >
            {row.original.assignedTo}
          </span>
        ),
      },
      {
        id: 'actions',
        header: 'Action',
        enableSorting: false,
        cell: ({ row }) => (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={event => {
              event.stopPropagation();
              openTicket(row.original);
            }}
            aria-label={`Open ticket ${row.original.id}`}
          >
            <EyeIcon className="h-4 w-4 " />
          </Button>
        ),
      },
    ],
    [openTicket]
  );

  const tableFilters = (
    <div className="grid w-full grid-cols-1 items-end gap-4 xl:grid-cols-2">
      <div
        role="tablist"
        aria-label="Filter tickets by status"
        className="flex w-full min-w-0 gap-1 overflow-x-auto rounded-lg bg-muted/50 p-1"
      >
        {statusTabs.map(tab => {
          const selected = statusFilter === tab;

          return (
            <Button
              key={tab}
              type="button"
              role="tab"
              aria-selected={selected}
              variant={selected ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setStatusFilter(tab)}
              className="shrink-0"
            >
              {tab}
              <span
                className={`rounded-full px-1.5 text-[11px] font-medium ${
                  selected
                    ? 'bg-primary-foreground/20 text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {statusCounts[tab]}
              </span>
            </Button>
          );
        })}
      </div>
      <div className="grid min-w-0 grid-cols-1 items-end gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <FormField
          label="Search"
          name="ticket-search"
          type="text"
          value={search}
          onChange={setSearch}
          placeholder="Search by ID or subject..."
        />
        <FormField
          label="Priority"
          name="ticket-priority-filter"
          type="select"
          value={priorityFilter}
          onChange={value => setPriorityFilter(value as 'All' | TicketPriority)}
          options={helpdeskTicketPriorityFilterOptions}
        />
        <FormField
          label="Category"
          name="ticket-category-filter"
          type="select"
          value={categoryFilter}
          onChange={setCategoryFilter}
          options={helpdeskTicketCategoryFilterOptions}
        />
        <Button
          type="button"
          variant="default"
          className="h-10 w-full"
          onClick={openRaiseDialog}
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Raise Ticket
        </Button>
      </div>
    </div>
  );

  const handleTableRowClick = (row: Row<TicketRecord>) => {
    openTicket(row.original);
  };

  return (
    <>
      <Section title="My Tickets" menuId="my-tickets" showBreadcrumbs>
        <TanStackTable
          data={filteredTickets}
          columns={columns}
          customFilters={tableFilters}
          enableSorting={false}
          enablePagination
          pageSize={5}
          pageSizeOptions={[5, 10, 20]}
          getRowId={ticket => ticket.id}
          onRowClick={handleTableRowClick}
          emptyMessage={
            tickets.length === 0
              ? 'You have not raised any tickets yet.'
              : 'No tickets match the selected filters.'
          }
          footerContent
        />
      </Section>

      <Dialog open={isRaiseDialogOpen} onOpenChange={setIsRaiseDialogOpen}>
        <DialogContent
          className="max-h-[85vh] gap-3 overflow-y-auto p-4 sm:max-w-lg sm:p-5"
          onInteractOutside={event => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Raise Ticket</DialogTitle>
            <DialogDescription>
              Describe your request and we will route it to the right team.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={raiseTicket} className="space-y-4" noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <FormField
                  label="Subject"
                  name="subject"
                  type="text"
                  value={draft.subject}
                  onChange={value =>
                    setDraft(current => ({ ...current, subject: value }))
                  }
                  placeholder="Short summary of the issue"
                />
                {draftTouched && !draft.subject.trim() && (
                  <p className="mt-1 text-xs text-destructive">
                    Please enter a subject.
                  </p>
                )}
              </div>

              <FormField
                label="Category"
                name="category"
                type="select"
                value={draft.category}
                onChange={value =>
                  setDraft(current => ({ ...current, category: value }))
                }
                options={helpdeskTicketCategoryOptions}
              />

              <FormField
                label="Priority"
                name="priority"
                type="select"
                value={draft.priority}
                onChange={value =>
                  setDraft(current => ({
                    ...current,
                    priority: value as TicketPriority,
                  }))
                }
                options={helpdeskTicketPriorityOptions}
              />

              <FormField
                label="Description"
                name="description"
                type="textarea"
                value={draft.description}
                onChange={value =>
                  setDraft(current => ({ ...current, description: value }))
                }
                rows={5}
                placeholder="Share what happened, when it started and anything you have already tried."
                error={
                  draftTouched && !draft.description.trim()
                    ? 'Please describe the issue.'
                    : undefined
                }
                className="sm:col-span-2"
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="destructive"
                onClick={() => setIsRaiseDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Submit Ticket</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={activeTicket !== null}
        onOpenChange={open => !open && closeTicket()}
      >
        <DialogContent
          className="max-h-[90vh] gap-0 overflow-hidden p-0 sm:max-w-2xl"
          onInteractOutside={event => event.preventDefault()}
        >
          <DialogHeader className="flex-row items-start justify-between gap-3 border-b border-border px-4 py-3">
            <div className="min-w-0">
              <DialogTitle className="truncate text-base font-semibold">
                {activeTicket?.id} · {activeTicket?.subject}
              </DialogTitle>
              <DialogDescription className="sr-only">
                Conversation and details for this ticket.
              </DialogDescription>
              {activeTicket && (
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-2 text-foreground">
                    <span
                      className={`h-2 w-2 rounded-full ${statusDot[activeTicket.status]}`}
                      aria-hidden="true"
                    />
                    {activeTicket.status}
                  </span>
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 font-medium ${priorityBadge[activeTicket.priority]}`}
                  >
                    {activeTicket.priority}
                  </span>
                  <span>{activeTicket.category}</span>
                  <span>Assigned to: {activeTicket.assignedTo}</span>
                  <span>
                    Raised {formatMessageTime(activeTicket.createdAt)}
                  </span>
                </div>
              )}
            </div>
          </DialogHeader>

          <div className="max-h-[45vh] min-h-[180px] space-y-3 overflow-y-auto bg-muted/30 px-4 py-4">
            {activeTicket?.messages.map(message => {
              const mine = message.role === 'you';
              return (
                <div
                  key={message.id}
                  className={`flex ${mine ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                      mine
                        ? 'bg-primary text-primary-foreground'
                        : 'border border-border bg-background text-foreground'
                    }`}
                  >
                    <p
                      className={`mb-1 text-[11px] ${
                        mine
                          ? 'text-primary-foreground/80'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {message.author} · {formatMessageTime(message.at)}
                    </p>
                    <p className="whitespace-pre-wrap">{message.text}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-border px-4 py-3">
            {isTicketLocked ? (
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MessageSquare className="h-4 w-4" aria-hidden="true" />
                  This ticket is closed. Raise a new ticket if you need more
                  help.
                </p>
                <Button
                  type="button"
                  variant="default"
                  onClick={() => {
                    closeTicket();
                    openRaiseDialog();
                  }}
                >
                  Raise new ticket
                </Button>
              </div>
            ) : (
              <form onSubmit={sendReply} className="space-y-3">
                <FormField
                  label="Your reply"
                  name="ticket-reply"
                  type="textarea"
                  value={reply}
                  onChange={setReply}
                  rows={3}
                  placeholder={
                    activeTicket?.status === 'Resolved'
                      ? 'Replying will reopen this ticket...'
                      : 'Write a reply...'
                  }
                />

                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap gap-2">
                    {activeTicket?.status === 'Resolved' ? (
                      <>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => updateStatus(activeTicket.id, 'Open')}
                        >
                          Reopen
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            updateStatus(activeTicket.id, 'Closed')
                          }
                        >
                          Close ticket
                        </Button>
                      </>
                    ) : (
                      activeTicket && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            updateStatus(activeTicket.id, 'Resolved')
                          }
                        >
                          Mark as resolved
                        </Button>
                      )
                    )}
                  </div>

                  <Button type="submit" disabled={!reply.trim()}>
                    <Send className="h-4 w-4" aria-hidden="true" />
                    Send reply
                  </Button>
                </div>
              </form>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MyTicketsTab;
