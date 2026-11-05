import FormField from '@/components/common/FormField';
import type { OpenToWork, Visibility } from '../../data/resume';

type ResumeSidebarProps = {
  visibility: Visibility;
  hideCurrentEmployer: boolean;
  openToWork: OpenToWork;
  onVisibilityChange: (visibility: Visibility) => void;
  onHideCurrentEmployerChange: (value: boolean) => void;
  onOpenToWorkChange: (value: OpenToWork) => void;
};

const visibilityOptions = [
  {
    value: 'all',
    label: 'Visible to all recruiters',
    hint: 'Recruiters can find your profile in search.',
  },
  {
    value: 'applied',
    label: 'Only companies I apply to',
    hint: 'Your resume is shared with applied companies only.',
  },
  {
    value: 'hidden',
    label: 'Hidden',
    hint: 'Your profile will not appear in recruiter search.',
  },
] as const;
const jobTypeOptions = ['Full-time', 'Part-time', 'Contract', 'Internship'].map(
  option => ({ label: option, value: option })
);

const ResumeSidebar = ({
  visibility,
  hideCurrentEmployer,
  openToWork,
  onVisibilityChange,
  onHideCurrentEmployerChange,
  onOpenToWorkChange,
}: ResumeSidebarProps) => {
  return (
    <aside className="space-y-4">
      <section className="rounded-t-md border border-blue-300 dark:border-blue-700 bg-white dark:bg-slate-900 p-4 shadow-sm">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
          <h2 className="text-lg font-bold text-slate-950 dark:text-slate-100">
            Profile visibility
          </h2>
        </div>
        <div className="mt-4 space-y-2">
          {visibilityOptions.map(option => {
            const selected = visibility === option.value;
            return (
              <label
                key={option.value}
                className={`block cursor-pointer rounded-lg border p-3 ${
                  selected
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40'
                    : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900'
                }`}
              >
                <input
                  type="radio"
                  name="visibility"
                  value={option.value}
                  checked={selected}
                  onChange={() => onVisibilityChange(option.value)}
                  className="sr-only"
                />
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {option.label}
                </span>
                <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
                  {option.hint}
                </span>
              </label>
            );
          })}
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <FormField
            label="Hide from my current employer"
            name="hideCurrentEmployer"
            type="toggle"
            value={hideCurrentEmployer}
            onToggleChange={onHideCurrentEmployerChange}
            toggleActiveLabel="Visible to Every one"
            toggleInactiveLabel="Hide from my current employer"
          />
        </div>
      </section>

      <section className="rounded-t-md border border-blue-300 dark:border-blue-700 bg-white dark:bg-slate-900 p-4 shadow-sm">
        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
          <h2 className="text-lg font-bold text-slate-950 dark:text-slate-100">
            Open to work
          </h2>
          <div className="mt-3">
            <FormField
              label="Open to work"
              name="openToWork"
              type="toggle"
              value={openToWork.enabled}
              onToggleChange={enabled =>
                onOpenToWorkChange({
                  ...openToWork,
                  enabled,
                })
              }
              toggleActiveLabel="Active"
              toggleInactiveLabel="Inactive"
            />
          </div>
        </div>
        {openToWork.enabled && (
          <div className="mt-4 space-y-3">
            <FormField
              label="Job type"
              name="openToWorkJobType"
              type="select"
              value={openToWork.jobType}
              onChange={jobType =>
                onOpenToWorkChange({
                  ...openToWork,
                  jobType,
                })
              }
              options={jobTypeOptions}
            />
            <FormField
              label="Can start from"
              name="openToWorkStartDate"
              type="date"
              value={openToWork.startDate}
              onChange={startDate =>
                onOpenToWorkChange({
                  ...openToWork,
                  startDate,
                })
              }
            />
          </div>
        )}
      </section>
    </aside>
  );
};

export default ResumeSidebar;
