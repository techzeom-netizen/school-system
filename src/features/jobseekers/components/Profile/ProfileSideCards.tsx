import { CheckCircle2, Circle } from 'lucide-react';

type ChecklistItem = {
  key: string;
  label: string;
  done: boolean;
};

type ProfileChecklistCardProps = {
  percent: number;
  items: ChecklistItem[];
};

const activityItems = [
  ['Applied', '6'],
  ['Interviews', '3'],
  ['Offers', '1'],
  ['Saved jobs', '4'],
  ['Profile views', '48'],
  ['Search appearances', '215'],
];

const viewedBy = [
  ['Demo School', 'Teacher', '2h ago'],
  ['PeopleWorks', 'React Developer', '1d ago'],
  ['TalentBridge', 'UI Engineer', '3d ago'],
];

export const ProfileChecklistCard = ({
  percent,
  items,
}: ProfileChecklistCardProps) => {
  const label =
    percent >= 85 ? 'Strong' : percent >= 60 ? 'Good' : 'Needs work';

  return (
    <section className="rounded-t-md border border-blue-300 dark:border-blue-700 bg-white dark:bg-slate-900 p-4 shadow-sm">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
        <h2 className="text-lg font-bold text-slate-950 dark:text-slate-100">
          Profile strength
        </h2>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <p className="font-semibold text-slate-800 dark:text-slate-100">
          {label}
        </p>
        <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">
          {percent}%
        </p>
      </div>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        className="mt-2 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"
      >
        <div
          className="h-2.5 rounded-full bg-blue-600"
          style={{ width: `${percent}%` }}
        />
      </div>
      <ul className="mt-4 space-y-3">
        {items.map(item => (
          <li key={item.key} className="flex items-center gap-2 text-sm">
            {item.done ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Circle className="h-4 w-4 text-slate-300" />
            )}
            <span
              className={
                item.done
                  ? 'text-slate-700 dark:text-slate-200'
                  : 'text-slate-500 dark:text-slate-400'
              }
            >
              {item.label}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export const ProfileActivityCard = () => (
  <section className="rounded-t-md border border-blue-300 dark:border-blue-700 bg-white dark:bg-slate-900 p-4 shadow-sm">
    <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
      <h2 className="text-lg font-bold text-slate-950 dark:text-slate-100">
        Your activity
      </h2>
    </div>
    <div className="mt-4 grid grid-cols-2 gap-2">
      {activityItems.map(([label, value]) => (
        <div
          key={label}
          className="rounded-lg bg-slate-50 dark:bg-slate-800 border p-2"
        >
          <p className="text-xl font-bold text-slate-950 dark:text-slate-100">
            {value}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
        </div>
      ))}
    </div>
    <h3 className="mt-5 text-sm font-bold text-slate-800 dark:text-slate-100">
      Recently viewed by
    </h3>
    <div className="mt-3 space-y-3">
      {viewedBy.map(([company, role, time]) => (
        <div
          key={company}
          className="rounded-lg border border-slate-100 dark:border-slate-800 dark:bg-slate-800 p-3"
        >
          <p className="font-semibold text-slate-900 dark:text-slate-100">
            {company}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {role} | {time}
          </p>
        </div>
      ))}
    </div>
  </section>
);
