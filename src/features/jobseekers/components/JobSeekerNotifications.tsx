import { useMemo, useState } from 'react';
import { Bell, CheckCheck, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  jobSeekerNotifications,
  type JobSeekerNotification,
} from '../data/notifications';

type JobSeekerNotificationsProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const groups: JobSeekerNotification['group'][] = ['Today', 'Earlier'];

const JobSeekerNotifications = ({
  open,
  onOpenChange,
}: JobSeekerNotificationsProps) => {
  const [readIds, setReadIds] = useState<string[]>([]);

  const notifications = useMemo(
    () =>
      jobSeekerNotifications.map(item => ({
        ...item,
        unread: item.unread && !readIds.includes(item.id),
      })),
    [readIds]
  );

  const unreadCount = notifications.filter(item => item.unread).length;

  const markAsRead = (id: string) => {
    setReadIds(current => (current.includes(id) ? current : [...current, id]));
  };

  const markAllAsRead = () => {
    setReadIds(jobSeekerNotifications.map(item => item.id));
  };

  const handleDialogOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      onOpenChange(true);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="left-auto right-0 top-0 flex h-screen max-h-screen w-full max-w-[420px] translate-x-0 translate-y-0 flex-col gap-0 overflow-hidden rounded-none bg-white dark:bg-slate-800 p-0 shadow-2xl sm:max-w-[420px] md:right-0 md:top-0 md:h-[calc(100vh)]  data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right"
      >
        <DialogHeader className="shrink-0 border-b border-slate-100 dark:border-slate-800 px-4 py-4 text-left">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <DialogTitle className="text-base font-extrabold tracking-tight text-slate-700 dark:text-slate-200">
                Notifications
              </DialogTitle>
              <span className="rounded-full bg-blue-600 px-2.5 py-0.5 text-xs font-bold text-white">
                {unreadCount} new
              </span>
            </div>

            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={unreadCount === 0}
                className="h-8 rounded-lg px-2 text-xs font-bold text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-700 dark:hover:text-blue-400 disabled:text-slate-400"
                onClick={markAllAsRead}
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Mark all read
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Close notifications"
                title="close"
                className="h-8 w-8 rounded-full text-slate-400 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-600 dark:hover:text-red-400"
                onClick={() => onOpenChange(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="profile-sidebar-scroll flex-1 overflow-y-auto">
          {groups.map(group => {
            const items = notifications.filter(
              notification => notification.group === group
            );

            return (
              <section key={group}>
                <div className="sticky top-0 z-10 borde-b border-slate-100 dark:border-white/60 border-t b bg-white/95 dark:bg-slate-800 /95 px-4 py-2 backdrop-blur">
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
                    {group}
                  </p>
                </div>

                {items.map(item => {
                  const Icon = item.icon;

                  return (
                    <article
                      key={item.id}
                      className={`border-b border-slate-100 dark:border-slate-600 px-4 py-3 transition hover:bg-blue-50/50 dark:hover:bg-blue-950/50 ${
                        item.unread
                          ? 'bg-blue-50/30 dark:bg-slate-950/50'
                          : 'bg-white dark:bg-slate-950/30'
                      }`}
                    >
                      <div className="flex gap-3">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-xs font-extrabold ${item.avatarTone}`}
                        >
                          {item.companyInitial}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start gap-2">
                            <div className="min-w-0 flex-1">
                              <p className="line-clamp-2 text-sm font-semibold leading-5 text-slate-700 dark:text-slate-200">
                                {item.title}
                              </p>
                              <p className="mt-0.5 line-clamp-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                                {item.description}
                              </p>
                            </div>
                            {item.unread && (
                              <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-600" />
                            )}
                          </div>

                          <div className="mt-2 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`flex h-5 w-5 items-center justify-center rounded-full ${item.iconTone}`}
                              >
                                <Icon className="h-3 w-3" aria-hidden="true" />
                              </span>
                              <span className="text-[11px] font-semibold text-slate-400">
                                {item.time}
                              </span>
                            </div>

                            {item.unread ? (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-7 rounded-md px-2 text-[11px] font-bold text-blue-700 dark:text-blue-400 hover:bg-white dark:hover:bg-slate-900 hover:text-blue-700 dark:hover:text-blue-400"
                                onClick={() => markAsRead(item.id)}
                              >
                                Mark read
                              </Button>
                            ) : (
                              <span className="text-[11px] font-semibold text-slate-400">
                                Read
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </section>
            );
          })}

          <div className="flex min-h-20 flex-col items-center justify-center px-4 py-5 text-center">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400">
              <Bell className="h-4 w-4" aria-hidden="true" />
            </div>
            <p className="mt-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              You are all caught up.
            </p>
          </div>
        </div>

        <div className="shrink-0 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3">
          <Button
            type="button"
            variant="ghost"
            asChild
            onClick={() => onOpenChange(false)}
            className="h-10 w-full rounded-lg text-sm font-extrabold text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-700 dark:hover:text-blue-400"
          >
            <Link to="/jobseekers/notifications">View all notifications</Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobSeekerNotifications;
