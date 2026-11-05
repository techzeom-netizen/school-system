import { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ArrowRightIcon, UserIcon, MenuIcon, XIcon } from 'lucide-react';
import JobSeekerLoginDialog from '@/features/jobseekers/components/JobSeekerLoginDialog';
import { cn } from '@/lib/utils';
import ThemeToggle from '@/components/common/ThemeToggle';
import { Button } from '@/components/ui/button';

const logoSrc = '/frontendImages/LOGO.png';

const navItems = [
  { to: '/jobs', label: 'Find Jobs' },
  { to: '/companies', label: 'Find Company' },
];

type NavLinkClassProps = {
  isActive: boolean;
};

const navLinkClass = ({ isActive }: NavLinkClassProps) =>
  [
    'relative rounded-md md:px-2 text-[14px] lg:px-3 py-2 lg:text-[15px] font-medium transition-colors',
    isActive
      ? 'text-blue-700 dark:text-blue-400'
      : 'text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-950 hover:text-blue-700 dark:hover:text-blue-400',
  ].join(' ');

const LandingHeader = ({ hideForSectionId }: { hideForSectionId?: string }) => {
  const [loginOpen, setLoginOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const header = headerRef.current;
    const section = hideForSectionId
      ? document.getElementById(hideForSectionId)
      : null;

    if (!header || !section) {
      setIsHidden(false);
      return;
    }

    let frameId: number | undefined;
    const updateVisibility = () => {
      frameId = undefined;
      const { top, bottom } = section.getBoundingClientRect();
      setIsHidden(top <= header.offsetHeight + 16 && bottom > 0);
    };
    const scheduleUpdate = () => {
      if (frameId === undefined) {
        frameId = requestAnimationFrame(updateVisibility);
      }
    };

    // Keep the header's layout space so hiding it cannot move the section
    // across the threshold and cause flickering.
    const resizeObserver = new ResizeObserver(scheduleUpdate);
    resizeObserver.observe(header);
    resizeObserver.observe(section);
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    updateVisibility();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      if (frameId !== undefined) cancelAnimationFrame(frameId);
    };
  }, [hideForSectionId]);

  return (
    <header
      ref={headerRef}
      aria-hidden={isHidden || undefined}
      className={cn(
        'sticky top-0 z-40 border-b border-gray-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 backdrop-blur transition-transform duration-200 motion-reduce:transition-none supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-slate-900/80',
        isHidden && 'invisible pointer-events-none -translate-y-full'
      )}
    >
      <div className="mx-auto grid w-full max-w-[1560px] grid-cols-[1fr_auto] items-center gap-4 px-5 py-3 lg:grid-cols-[1fr_auto_1fr] lg:px-8">
        {/* Logo */}
        <Link
          to="/"
          className="flex shrink-0 items-center"
          onClick={() => setMenuOpen(false)}
        >
          <img
            src={logoSrc}
            alt="Demo School"
            className="h-10 w-auto bg-white rounded-md"
          />
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden items-center justify-center  gap-2 lg:flex">
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to} className={navLinkClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center justify-self-end gap-3 lg:flex">
          <ThemeToggle />
          <Button
            type="button"
            onClick={() => setLoginOpen(true)}
            className="flex items-center gap-2 whitespace-nowrap rounded-full border border-gray-300 dark:border-slate-600 hover:bg-blue-50 bg-white dark:bg-slate-800 px-5 py-2 text-sm font-semibold text-gray-800 dark:text-slate-100 shadow-sm transition hover:border-blue-600 hover:text-blue-700 dark:hover:text-blue-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            <UserIcon className="h-4 w-4 shrink-0" />
            Sign in
          </Button>

          <Link
            to="/employer"
            className="group flex items-center gap-2 whitespace-nowrap rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-blue-600/25 transition hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            For Employer
            <ArrowRightIcon className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center justify-self-end gap-2 lg:hidden">
          <ThemeToggle />
          <Button
            variant="outline"
            size="icon"
            type="button"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(v => !v)}
            className="inline-flex h-10 w-10 items-center justify-center justify-self-end rounded-md border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-950 lg:hidden"
          >
            {menuOpen ? (
              <XIcon className="h-5 w-5" />
            ) : (
              <MenuIcon className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile panel */}
      {menuOpen && (
        <div className="border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 pb-5 pt-3 lg:hidden">
          <nav className="flex flex-col gap-1">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2.5 text-sm font-medium ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400'
                      : 'text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-950'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <Button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                setLoginOpen(true);
              }}
              className="flex items-center gap-2 whitespace-nowrap rounded-full border border-gray-300 dark:border-slate-600 hover:bg-blue-50 bg-white dark:bg-slate-800 px-5 py-2 text-sm font-semibold text-gray-800 dark:text-slate-100 shadow-sm transition hover:border-blue-600 hover:text-blue-700 dark:hover:text-blue-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              <UserIcon className="h-4 w-4 shrink-0" />
              Sign in
            </Button>
            <Link
              to="/employer"
              onClick={() => setMenuOpen(false)}
              className="group flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-blue-600/25"
            >
              For Employer
              <ArrowRightIcon className="h-4 w-4 shrink-0" />
            </Link>
          </div>
        </div>
      )}

      <JobSeekerLoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
    </header>
  );
};

export default LandingHeader;
