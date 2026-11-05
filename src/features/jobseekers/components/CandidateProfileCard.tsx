import { Link } from 'react-router-dom';
import {
  Bookmark,
  Briefcase,
  Building2,
  CheckCircle2,
  FileText,
  MapPin,
  MoreVertical,
  Send,
  Sparkles,
  Target,
  type LucideIcon,
  User,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import useScrollThumb from '@/hooks/useScrollThumb';

const profileImage =
  'https://images.squarespace-cdn.com/content/v1/5e2e7ccf474b6e545efeee8e/5aeb35cd-717b-4c8f-b5d6-7c4ef64c0cd7/Josh+Clapper+%282%29.jpg';

const skillMatches = [
  ['React', 95],
  ['TypeScript', 88],
  ['JavaScript', 82],
  ['UI/UX', 70],
] as const;

const recommendedCompanies = [
  { name: 'Uber', jobs: 312, className: 'bg-black text-white', logo: 'Uber' },
  {
    name: 'Swiggy',
    jobs: 178,
    className:
      'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400',
    logo: 'S',
  },
  {
    name: 'Microsoft',
    jobs: 124,
    className:
      'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-200',
    logo: 'MS',
  },
  {
    name: 'Google',
    jobs: 96,
    className:
      'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400',
    logo: 'G',
  },
] as const;

const quickLinks: {
  icon: LucideIcon;
  label: string;
  to: string;
}[] = [
  { icon: User, label: 'Update Profile', to: '/jobseekers/profile' },
  { icon: FileText, label: 'Resume', to: '/jobseekers/resume' },
  { icon: Bookmark, label: 'Saved jobs', to: '/jobseekers/saved-jobs' },
  { icon: Briefcase, label: 'Applied jobs', to: '/jobseekers/applied-jobs' },
  {
    icon: Building2,
    label: 'Followed companies',
    to: '/jobseekers/followed-companies',
  },
] as const;

const CandidateProfileCard = () => {
  const { user } = useAuth();
  const { scrollRef, scrollThumb, updateScrollThumb } =
    useScrollThumb<HTMLElement>();
  const displayName =
    [user?.firstName, user?.lastName].filter(Boolean).join(' ') ||
    'Aarav Verma';

  return (
    <div className="relative">
      <aside
        ref={scrollRef}
        onScroll={updateScrollThumb}
        className="profile-sidebar-scroll border border-blue-300 dark:border-blue-700 rounded-t-md  space-y-4 xl:h-[calc(100vh-6px)] xl:overflow-y-auto xl:pr-4"
      >
        <section className=" bg-gradient-to-br from-white dark:from-slate-900/50 via-blue-50  dark:via-slate-800/50 to-white dark:to-slate-900 p-5 shadow-sm">
          <div className="flex items-start gap-4">
            <img
              src={user?.avatar || profileImage}
              alt="Candidate profile"
              className="h-28 w-28 rounded-md object-cover ring-2 ring-white dark:ring-slate-700 shadow-xl"
            />
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-xl font-bold text-slate-950 dark:text-slate-100">
                {displayName}
              </h2>
              <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-300">
                Software Engineer
              </p>
              <p className="mt-2 flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                <MapPin className="h-4 w-4" />
                Bengaluru
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                asChild
                className="mt-3 h-7 rounded-full border-blue-100 dark:border-blue-900 bg-white dark:bg-slate-800/50 px-5 text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                <Link to="/jobseekers/my-profile">
                  View Profile
                  {/* <ArrowRight className="h-4 w-4" /> */}
                </Link>
              </Button>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-[1fr_1fr_1fr_auto] items-center rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/50 p-3">
            {[
              ['6', 'Applied'],
              ['3', 'Interviews'],
              ['1', 'Offers'],
            ].map(([value, label]) => (
              <div
                key={label}
                className="border-r border-slate-100 dark:border-slate-800 px-2 text-center last:border-r-0"
              >
                <p className="text-xl font-bold text-slate-950 dark:text-slate-100">
                  {value}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {label}
                </p>
              </div>
            ))}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Open profile actions"
              className="h-8 w-8 text-slate-500 dark:text-slate-400"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-4 rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/50 p-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-slate-950 dark:text-slate-100">
                Profile strength
              </p>
              <div className="text-right text-xs">
                <p className="font-semibold text-blue-700 dark:text-blue-400">
                  Good
                </p>
                <p className="text-slate-500 dark:text-slate-400">75%</p>
              </div>
            </div>
            <div className="mt-3 h-2 rounded-full bg-slate-200 dark:bg-slate-700">
              <div className="h-2 w-3/4 rounded-full bg-blue-600" />
            </div>
            <div className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              {['Resume updated', 'Skills added', 'Work preference set'].map(
                item => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 fill-emerald-500 text-white" />
                    {item}
                  </div>
                )
              )}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              asChild
              className="mt-4 h-9 w-full border-blue-100 dark:border-blue-900 text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              <Link to="/jobseekers/profile">
                <Sparkles className="h-4 w-4" />
                Improve Profile
              </Link>
            </Button>
          </div>

          <div className="mt-4 rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/50 p-4">
            <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
              Quick links
            </p>
            <nav className="mt-3 space-y-1">
              {quickLinks.map(({ icon: Icon, label, to }) =>
                to ? (
                  <Link
                    key={label}
                    to={to}
                    className="group flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 transition-colors hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-700 dark:hover:text-blue-400"
                  >
                    <Icon className="h-4 w-4 text-slate-500 dark:text-slate-400 transition-colors group-hover:text-blue-700 dark:group-hover:text-blue-400" />
                    {label}
                  </Link>
                ) : (
                  <button
                    key={label}
                    type="button"
                    className="group flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium text-slate-700 dark:text-slate-200 transition-colors hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-700 dark:hover:text-blue-400"
                  >
                    <Icon className="h-4 w-4 text-slate-500 dark:text-slate-400 transition-colors group-hover:text-blue-700 dark:group-hover:text-blue-400" />
                    {label}
                  </button>
                )
              )}
            </nav>
          </div>
          <div className="mt-4 rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/50 p-4">
            <div className="flex items-center gap-3">
              <Send className="h-6 w-6 text-blue-700 dark:text-blue-400" />
              <h3 className="text-lg font-bold text-slate-950 dark:text-slate-100">
                Quick apply
              </h3>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Apply to multiple matching jobs with one click using your updated
              profile.
            </p>
            <Button type="button" className="mt-4 h-11 w-full">
              <Zap className="h-4 w-4" />
              Quick Apply to 3 Jobs
            </Button>
          </div>

          <div className="mt-4 rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/50 p-4">
            <div className="mb-4 flex items-center gap-3">
              <Target className="h-5 w-5 text-blue-700 dark:text-blue-400" />
              <h3 className="text-lg font-bold text-slate-950 dark:text-slate-100">
                Top skill matches
              </h3>
            </div>
            <div className="space-y-3">
              {skillMatches.map(([skill, value]) => (
                <div
                  key={skill}
                  className="grid grid-cols-[86px_1fr_38px] items-center gap-3 text-sm"
                >
                  <span className="text-slate-600 dark:text-slate-300">
                    {skill}
                  </span>
                  <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700">
                    <div
                      className="h-2 rounded-full bg-blue-600"
                      style={{ width: `${value}%` }}
                    />
                  </div>
                  <span className="text-right text-xs font-medium text-slate-500 dark:text-slate-400">
                    {value}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/50 p-4">
            <div className="mb-4 flex items-center gap-3">
              <Building2 className="h-5 w-5 text-blue-700 dark:text-blue-400" />
              <h3 className="text-lg font-bold text-slate-950 dark:text-slate-100">
                Recommended companies
              </h3>
              <Button
                type="button"
                variant="link"
                size="sm"
                className="ml-auto h-auto px-0 text-blue-700 dark:text-blue-400"
              >
                View all
              </Button>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {recommendedCompanies.map(company => (
                <div key={company.name} className="min-w-0 text-center">
                  <div
                    className={`mx-auto flex h-14 w-14 items-center justify-center rounded-lg border border-slate-100 dark:border-slate-800 text-sm font-black shadow-sm ${company.className}`}
                  >
                    {company.logo}
                  </div>
                  <p className="mt-2 truncate text-sm font-semibold text-slate-950 dark:text-slate-100">
                    {company.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {company.jobs} jobs
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </aside>

      {scrollThumb.visible && (
        <div className="pointer-events-none absolute bottom-0 right-1 top-0 hidden w-2 xl:block">
          <div
            className="absolute right-0 w-[3px] rounded-full bg-blue-600"
            style={{
              height: `${scrollThumb.height}px`,
              top: `${scrollThumb.top}px`,
            }}
          />
        </div>
      )}
    </div>
  );
};

export default CandidateProfileCard;
