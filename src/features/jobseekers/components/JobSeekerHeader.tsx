import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/common/ThemeToggle';
import { useAuth } from '@/hooks/useAuth';
import {
  getJobSeekerHeaderLinks,
  getJobSeekerLogoPath,
} from '../config/jobSeekerNavigation';
import JobSeekerNotifications from './JobSeekerNotifications';

const logoSrc = '/frontendImages/LOGO.png';
const profileImage =
  'https://images.squarespace-cdn.com/content/v1/5e2e7ccf474b6e545efeee8e/5aeb35cd-717b-4c8f-b5d6-7c4ef64c0cd7/Josh+Clapper+%282%29.jpg';

const JobSeekerHeader = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const displayName = [user?.firstName, user?.lastName]
    .filter(Boolean)
    .join(' ');
  const initials = [user?.firstName?.[0], user?.lastName?.[0]]
    .filter(Boolean)
    .join('');
  const logoPath = getJobSeekerLogoPath(true, user);
  const navItems = getJobSeekerHeaderLinks(true, user);

  const isActive = (to: string) =>
    to === '/jobseekers'
      ? location.pathname === '/jobseekers' ||
        location.pathname === getJobSeekerLogoPath(true, user)
      : location.pathname === to || location.pathname.startsWith(`${to}/`);

  return (
    <header className="bg-slate-50/90 dark:bg-slate-800/50 px-3 py-2 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1560px] items-center justify-between rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-5 py-3 shadow-sm lg:px-7">
        <Link to={logoPath} className="flex items-center">
          <img
            src={logoSrc}
            alt="Demo School"
            className="h-10 w-auto bg-white rounded-md"
          />
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300 md:flex">
          {navItems.map(item => (
            <Link
              key={`${item.label}-${item.to}`}
              to={item.to}
              className={`relative py-2 transition hover:text-blue-700 dark:hover:text-blue-400 ${
                isActive(item.to) ? 'text-blue-700 dark:text-blue-400' : ''
              }`}
            >
              {item.label}
              {isActive(item.to) && (
                <span className="absolute inset-x-0 -bottom-1 h-0.5 rounded-full bg-blue-700" />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Notifications"
            aria-expanded={notificationsOpen}
            className="relative rounded-full text-slate-600 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400"
            onClick={() => setNotificationsOpen(true)}
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-700" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 rounded outline-none ring-offset-white dark:ring-offset-slate-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              <Avatar className="h-10 w-10 rounded-full ring-2 ring-slate-100 dark:ring-slate-800">
                <AvatarImage
                  src={user?.avatar || profileImage}
                  alt={displayName}
                  className="rounded-md object-cover"
                />
                <AvatarFallback className="rounded-md">
                  {initials || 'JS'}
                </AvatarFallback>
              </Avatar>
              <ChevronDown className="hidden h-4 w-4 text-slate-500 dark:text-slate-400 sm:block" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link to="/jobseekers/my-profile">View profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/jobseekers/saved-jobs">Saved jobs</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/jobseekers/applied-jobs">Applied jobs</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => void logout()}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <JobSeekerNotifications
        open={notificationsOpen}
        onOpenChange={setNotificationsOpen}
      />
    </header>
  );
};

export default JobSeekerHeader;
