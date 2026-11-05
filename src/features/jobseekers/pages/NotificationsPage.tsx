import { useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Bell, CheckCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import TanStackTable from '@/components/common/TanStackTable';
import { Button } from '@/components/ui/button';
import {
  jobSeekerNotifications,
  type JobSeekerNotification,
} from '../data/notifications';

type NotificationRow = JobSeekerNotification & {
  status: 'Unread' | 'Read';
};

const NotificationsPage = () => {
  const [readIds, setReadIds] = useState<string[]>([]);

  const notifications = useMemo<NotificationRow[]>(
    () =>
      jobSeekerNotifications.map(item => {
        const unread = item.unread && !readIds.includes(item.id);

        return {
          ...item,
          unread,
          status: unread ? 'Unread' : 'Read',
        };
      }),
    [readIds]
  );

  const unreadCount = notifications.filter(item => item.unread).length;

  const markAsRead = (id: string) => {
    setReadIds(current => (current.includes(id) ? current : [...current, id]));
  };

  const markAllAsRead = () => {
    setReadIds(jobSeekerNotifications.map(item => item.id));
  };

  const columns = useMemo<ColumnDef<NotificationRow>[]>(
    () => [
      {
        accessorKey: 'title',
        header: 'Notification',
        cell: ({ row }) => {
          const item = row.original;
          const Icon = item.icon;

          return (
            <div className="flex min-w-[320px] items-start gap-3">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-xs font-extrabold ${item.avatarTone}`}
              >
                {item.companyInitial}
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-bold text-slate-950 dark:text-slate-100">
                    {item.title}
                  </p>
                  {item.unread && (
                    <span className="rounded-full bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 text-[11px] font-bold text-blue-700 dark:text-blue-400">
                      New
                    </span>
                  )}
                </div>
                <p className="mt-1 max-w-xl text-xs leading-5 text-slate-500 dark:text-slate-400">
                  {item.description}
                </p>
                <div className="mt-2 flex items-center gap-1.5">
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full ${item.iconTone}`}
                  >
                    <Icon className="h-3 w-3" aria-hidden="true" />
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400">
                    {item.time}
                  </span>
                </div>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: 'group',
        header: 'Group',
        cell: ({ row }) => (
          <span className="font-semibold text-slate-600 dark:text-slate-300">
            {row.original.group}
          </span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-bold ${
              row.original.unread
                ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
            }`}
          >
            {row.original.status}
          </span>
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        enableSorting: false,
        cell: ({ row }) => {
          const item = row.original;

          return (
            <div className="flex min-w-[180px] flex-wrap justify-start gap-2">
              {item.href && (
                <Button
                  type="button"
                  size="xs"
                  variant="ghost"
                  asChild
                  className="rounded-md font-bold text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-700 dark:hover:text-blue-400"
                >
                  <Link to={item.href}>Open</Link>
                </Button>
              )}
              {item.unread && (
                <Button
                  type="button"
                  size="xs"
                  variant="outline"
                  className="rounded-md border-blue-100 dark:border-blue-900 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-700 dark:hover:text-blue-400"
                  onClick={() => markAsRead(item.id)}
                >
                  Mark read
                </Button>
              )}
            </div>
          );
        },
      },
    ],
    []
  );

  return (
    <section className="min-h-[calc(100vh-96px)] bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-[1580px] px-4 py-6">
        <section className="rounded-t-md border border-blue-300 dark:border-blue-700 bg-white dark:bg-slate-900 p-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-blue-50 dark:bg-blue-950/40 px-3 py-1 text-xs font-semibold text-blue-700 dark:text-blue-400">
                <Bell className="h-3.5 w-3.5" />
                Notifications
              </p>
              <h1 className="mt-3 text-2xl font-bold text-slate-950 dark:text-slate-100">
                ALL Notifications
              </h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {unreadCount} unread updates from your job search.
              </p>
            </div>
            <div className="">
              <Button
                type="button"
                variant="default"
                size="xs"
                disabled={unreadCount === 0}
                className="rounded-md border-blue-100 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 font-semibold text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:text-blue-700 dark:hover:text-blue-400 disabled:bg-slate-50 dark:disabled:bg-slate-950 disabled:text-slate-400"
                onClick={markAllAsRead}
              >
                <CheckCheck className="h-4 w-4" />
                Mark all read
              </Button>
            </div>
          </div>
        </section>

        <TanStackTable
          data={notifications}
          columns={columns}
          enablePagination
          searchPlaceholder="Search notifications"
          pageSize={10}
          pageSizeOptions={[10, 20, 50]}
          emptyMessage="No notifications found"
        />
      </div>
    </section>
  );
};

export default NotificationsPage;
