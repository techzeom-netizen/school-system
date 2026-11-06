import { useState } from 'react';
import ThemeToggle from '@/components/common/ThemeToggle';
import SchoolBrand from '@/components/common/SchoolBrand';
import { Button } from '@/components/ui/button';
import { Link, NavLink } from 'react-router-dom';
import { ArrowRightIcon, MenuIcon, XIcon } from 'lucide-react';

const navItems = [
  { to: '/employer/post-job', label: 'Post Job' },
  { to: '/employer/search-candidate', label: 'Search Candidate' },
  { to: '/employer/works', label: 'How it Works' },
];

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    'relative rounded-md px-3 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'text-blue-700 dark:text-blue-400 '
      : 'text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-blue-700 dark:hover:text-blue-400',
  ].join(' ');

const RecruiterHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-slate-900/80">
      <div className="mx-auto grid w-full max-w-[1560px] grid-cols-[1fr_auto] items-center gap-4 px-5 py-3 lg:grid-cols-[1fr_auto_1fr] lg:px-8">
        {/* Logo */}
        <Link
          to="/employer"
          className="flex shrink-0 items-center"
          onClick={() => setMenuOpen(false)}
        >
          <SchoolBrand compact />
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden items-center justify-center gap-2 lg:flex">
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to} className={navLinkClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop action */}
        <div className="hidden items-center justify-self-end gap-3 lg:flex">
          <ThemeToggle />
          <Link
            to="/"
            className="group flex items-center gap-2 whitespace-nowrap rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-blue-600/25 transition hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            For job seekers
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
            className="inline-flex h-10 w-10 items-center justify-center justify-self-end rounded-md border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800 lg:hidden"
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
                      : 'text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="mt-4 flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-blue-600/25"
          >
            For job seekers
            <ArrowRightIcon className="h-4 w-4 shrink-0" />
          </Link>
        </div>
      )}
    </header>
  );
};

export default RecruiterHeader;
