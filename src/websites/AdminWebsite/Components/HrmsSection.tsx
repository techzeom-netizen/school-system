import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  hrmsEmployees,
  hrmsKpis,
  hrmsModules,
  hrmsStatusClass,
  hrmsWeek,
} from './hrmsData';

interface HrmsSectionProps {
  onRegister: () => void;
}

const ModuleTile = ({ label, icon: Icon }: (typeof hrmsModules)[number]) => (
  <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-2.5 transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-blue-800 hover:shadow-[4px_4px_0_0_#1e40af] motion-reduce:transition-none motion-reduce:hover:translate-x-0 motion-reduce:hover:translate-y-0 sm:flex-col sm:items-start sm:gap-2 sm:p-3 lg:p-[clamp(0.5rem,1.5vh,0.75rem)]">
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-800 text-white">
      <Icon className="h-4 w-4" aria-hidden="true" />
    </span>
    <span className="text-xs font-bold leading-tight text-slate-900 dark:text-slate-100">
      {label}
    </span>
  </div>
);

const KpiCard = ({
  label,
  value,
  highlighted,
}: (typeof hrmsKpis)[number] & { highlighted: boolean }) => (
  <div
    className={`rounded-xl border p-3 ${
      highlighted
        ? 'border-blue-900 bg-blue-900 text-white'
        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-950 dark:text-slate-100'
    }`}
  >
    <p
      className={`truncate text-[11px] font-medium ${
        highlighted ? 'text-blue-200' : 'text-slate-500 dark:text-slate-400'
      }`}
    >
      {label}
    </p>
    <p className="mt-0.5 text-xl font-extrabold tracking-tight">{value}</p>
  </div>
);

const AttendanceBar = ({ day, value }: (typeof hrmsWeek)[number]) => (
  <div className="flex flex-1 flex-col items-center gap-1.5">
    <div
      className="w-full rounded-t-md bg-blue-800"
      style={{ height: Math.round(value * 0.5) }}
    />
    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
      {day}
    </span>
  </div>
);

const EmployeeRow = ({
  employee,
}: {
  employee: (typeof hrmsEmployees)[number];
}) => (
  <div className="flex items-center gap-3 px-3.5 py-2.5">
    <span
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white ${employee.color}`}
    >
      {employee.initials}
    </span>
    <div className="min-w-0 flex-1">
      <p className="truncate text-sm font-bold leading-tight text-slate-900 dark:text-slate-100">
        {employee.name}
      </p>
      <p className="truncate text-xs text-slate-500 dark:text-slate-400">
        {employee.role}
      </p>
    </div>
    <span
      className={`rounded-md px-2.5 py-1 text-[11px] font-bold ${hrmsStatusClass[employee.status]}`}
    >
      {employee.status}
    </span>
  </div>
);

const HrmsSection = ({ onRegister }: HrmsSectionProps) => (
  <section
    id="free-hrms"
    aria-labelledby="free-hrms-title"
    className="relative isolate scroll-mt-[4.1rem] overflow-hidden bg-blue-100/60 dark:bg-blue-950/50 py-10 lg:flex lg:h-[calc(100svh-4.1rem)] lg:min-h-[480px] lg:items-center lg:py-0"
  >
    <div className="mx-auto grid w-full max-w-[1320px] items-center gap-10 px-5 lg:grid-cols-2 lg:gap-16 lg:px-8">
      {/* Copy */}
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-white">
            100% Free
          </span>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-800 dark:text-blue-300">
            HRMS software
          </span>
        </div>

        <h2
          id="free-hrms-title"
          className="mt-4 max-w-2xl text-3xl font-extrabold leading-[1.08] tracking-tight text-slate-800 dark:text-slate-100 sm:text-4xl lg:mt-[clamp(0.75rem,2.4vh,1.25rem)] lg:text-[clamp(1.75rem,5.4vh,3rem)]"
        >
          Manage your school with Demo School. Keep your community{' '}
          <span className="text-blue-800 dark:text-blue-300">free.</span>
        </h2>
        <p className="mt-4 max-w-xl text-sm leading-5 text-slate-600 dark:text-slate-300 lg:mt-[clamp(0.625rem,2vh,1.25rem)] lg:text-[clamp(0.875rem,2.3vh,1.125rem)] lg:leading-[1.65]">
          Every school on Demo School gets the tools to look after its
          community, from records and attendance to leave and payslips, all in
          the same place you hire.
        </p>

        <div className="mt-6 grid max-w-xl grid-cols-2 gap-2.5 sm:grid-cols-4 lg:mt-[clamp(1rem,3.2vh,1.75rem)]">
          {hrmsModules.map(module => (
            <ModuleTile key={module.label} {...module} />
          ))}
        </div>

        <Button
          type="button"
          onClick={onRegister}
          className="group mt-7 inline-flex h-12 items-center gap-2 rounded-xl border-2 border-white dark:border-white/60 bg-blue-800 px-5 font-bold text-white shadow-[5px_5px_0_0_#607cbd] hover:-translate-y-0.5 hover:bg-blue-800 hover:shadow-[7px_7px_0_0_#1e40af] focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 dark:focus-visible:ring-blue-700 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none motion-reduce:transition-none lg:mt-[clamp(1rem,3.4vh,1.75rem)]"
        >
          Register and get free HRMS
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
        </Button>
      </div>

      {/* Decorative product preview (sample data only), desktop only */}
      <div
        aria-hidden="true"
        className="relative hidden w-full max-w-xl pr-1.5 lg:ml-auto lg:block"
      >
        <div className="overflow-hidden rounded-xl border-2 border-blue-800 dark:border-white/60 bg-blue-800 shadow-[5px_5px_0_0_#1e40af] ">
          <div className="flex items-center justify-between bg-blue-900  border border-b-none rounded-t-xl px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-white/30 dark:bg-white/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/30 dark:bg-white/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/30 dark:bg-white/60" />
              <span className="ml-3 text-sm font-extrabold text-white">
                Demo School ERP
              </span>
            </div>
            <span className="rounded-md bg-emerald-500 px-2.5 py-1 text-[11px] font-bold tracking-wider text-white">
              FREE
            </span>
          </div>

          <div className="space-y-3 bg-slate-50 dark:bg-slate-900 p-4">
            <div className="grid grid-cols-4 gap-2.5">
              {hrmsKpis.map((kpi, index) => (
                <KpiCard key={kpi.label} {...kpi} highlighted={index === 0} />
              ))}
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-3.5">
              <p className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                Attendance this week
              </p>
              <div className="mt-3 flex items-end gap-3">
                {hrmsWeek.map(item => (
                  <AttendanceBar key={item.day} {...item} />
                ))}
              </div>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50">
              {hrmsEmployees.slice(0, 2).map(employee => (
                <EmployeeRow key={employee.name} employee={employee} />
              ))}
            </div>
          </div>
        </div>

        {/* Only on tall screens: on short ones it would not fit inside the section */}
        <div className="absolute -bottom-9 -left-6 hidden items-center gap-3 rounded-xl border border-blue-800 dark:border-white/60 bg-white dark:bg-slate-800 px-3.5 py-2.5 shadow-[5px_5px_0_0_#1e40af] [@media(min-height:700px)]:flex">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          <div>
            <p className="text-sm font-bold leading-tight text-slate-900 dark:text-slate-100">
              Leave approved
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Priya Sharma - 2 days
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default HrmsSection;
