import { useState } from 'react';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';
import FormField from '@/components/common/FormField';
import { Button } from '@/components/ui/button';
import useScrollThumb from '@/hooks/useScrollThumb';
import { experienceRanges, workModes } from '../data/jobs';

type JobFilterProps = {
  workModes: string[];
  experiences: string[];
  onWorkModeChange: (value: string, checked: boolean) => void;
  onExperienceChange: (value: string, checked: boolean) => void;
  onClear: () => void;
  scrollAreaClassName?: string;
  scrollThumbClassName?: string;
};

const workModeCounts: Record<string, string> = {
  Remote: '1.2K',
  Hybrid: '2.4K',
  'On-site': '3.1K',
};

const experienceCounts: Record<string, string> = {
  '0-2 years': '1.1K',
  '2-5 years': '2.8K',
  '5-10 years': '1.9K',
  '10+ years': '640',
};

const expandableGroups = [
  {
    name: 'Salary range',
    options: ['3-6 LPA', '6-10 LPA', '10-15 LPA', '15+ LPA'],
  },
  {
    name: 'Job type',
    options: ['Full time', 'Part time', 'Contract', 'Internship', 'Freelance'],
  },
  {
    name: 'Company type',
    options: ['Startup', 'MNC', 'Product', 'Service', 'Agency'],
  },
  {
    name: 'Skills',
    options: [
      'React',
      'TypeScript',
      'JavaScript',
      'HR Operations',
      'Analytics',
    ],
  },
  {
    name: 'Industry',
    options: ['IT Services', 'Product', 'HR Tech', 'Fintech', 'Healthcare'],
  },
  {
    name: 'Location',
    options: ['Bengaluru', 'Hyderabad', 'Pune', 'Mumbai', 'Remote'],
  },
  {
    name: 'Posted date',
    options: ['Last 24 hours', 'Last 7 days', 'Last 15 days', 'Last 30 days'],
  },
];

const JobFilter = ({
  workModes: selectedWorkModes,
  experiences,
  onWorkModeChange,
  onExperienceChange,
  onClear,
  scrollAreaClassName = 'lg:h-[calc(100vh-6px)] lg:overflow-y-auto lg:pr-4',
  scrollThumbClassName = 'hidden lg:block',
}: JobFilterProps) => {
  const [openGroups, setOpenGroups] = useState<string[]>([]);
  const [selectedFacets, setSelectedFacets] = useState<
    Record<string, string[]>
  >({});
  const { scrollRef, scrollThumb, updateScrollThumb } =
    useScrollThumb<HTMLElement>(openGroups);

  const toggleGroup = (group: string) => {
    setOpenGroups(current =>
      current.includes(group)
        ? current.filter(item => item !== group)
        : [...current, group]
    );
  };

  const toggleFacet = (group: string, value: string, checked: boolean) => {
    setSelectedFacets(current => {
      const currentValues = current[group] || [];

      return {
        ...current,
        [group]: checked
          ? [...currentValues, value]
          : currentValues.filter(item => item !== value),
      };
    });
  };

  const handleClear = () => {
    setSelectedFacets({});
    onClear();
  };

  return (
    <div className="relative">
      <aside
        ref={scrollRef}
        onScroll={updateScrollThumb}
        className={`profile-sidebar-scroll h-fit rounded-t-md border border-blue-300 dark:border-blue-700 bg-gradient-to-br from-white dark:from-slate-800/50 via-blue-50 dark:via-slate-800/50 to-white dark:to-slate-800/50 p-3 shadow-sm ${scrollAreaClassName}`}
      >
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-lg font-semibold text-slate-950 dark:text-slate-100">
            <SlidersHorizontal className="h-4 w-4 text-blue-700 dark:text-blue-400" />
            Filters
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClear}
            className="h-auto text-xs p-1 px-2  text-blue-700 dark:text-blue-400"
          >
            Reset all
          </Button>
        </div>

        <div className="space-y-3">
          {/* Work mode */}
          <fieldset className="rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/50 p-3">
            <legend className="sr-only">Work mode</legend>
            <p className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
              Work mode
            </p>
            <div className="space-y-2.5">
              {workModes.map(mode => (
                <div
                  key={mode}
                  className="flex items-center justify-between gap-3"
                >
                  <FormField
                    label={mode}
                    name={`workMode-${mode}`}
                    type="checkbox"
                    value={selectedWorkModes.includes(mode)}
                    onCheckboxChange={checked =>
                      onWorkModeChange(mode, checked)
                    }
                    className="[&_input]:rounded [&_input]:accent-blue-700"
                  />
                  <span className="text-xs text-slate-400">
                    {workModeCounts[mode]}
                  </span>
                </div>
              ))}
            </div>
          </fieldset>

          {/* Experience */}
          <fieldset className="rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/50 p-3">
            <legend className="sr-only">Experience</legend>
            <p className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
              Experience
            </p>
            <div className="space-y-2.5">
              {experienceRanges.map(range => (
                <div
                  key={range}
                  className="flex items-center justify-between gap-3"
                >
                  <FormField
                    label={range}
                    name={`experience-${range}`}
                    type="checkbox"
                    value={experiences.includes(range)}
                    onCheckboxChange={checked =>
                      onExperienceChange(range, checked)
                    }
                    className="[&_input]:rounded [&_input]:accent-blue-700"
                  />
                  <span className="text-xs text-slate-400">
                    {experienceCounts[range]}
                  </span>
                </div>
              ))}
            </div>
          </fieldset>

          {/* Expandable groups: one white card each */}
          {expandableGroups.map(group => {
            const isOpen = openGroups.includes(group.name);
            const selectedValues = selectedFacets[group.name] || [];

            return (
              <div
                key={group.name}
                className="rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/50 px-4"
              >
                <button
                  type="button"
                  onClick={() => toggleGroup(group.name)}
                  className="flex w-full items-center justify-between py-3 text-left text-sm font-semibold text-slate-900 dark:text-slate-100"
                  aria-expanded={isOpen}
                >
                  <span className="flex items-center gap-2">
                    {group.name}
                    {selectedValues.length > 0 && (
                      <span className="rounded-full bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 text-[11px] font-semibold text-blue-700 dark:text-blue-400">
                        {selectedValues.length}
                      </span>
                    )}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-500 dark:text-slate-400 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="space-y-2 pb-4">
                    {group.options.map(option => (
                      <FormField
                        key={option}
                        label={option}
                        name={`${group.name}-${option}`}
                        type="checkbox"
                        value={selectedValues.includes(option)}
                        onCheckboxChange={checked =>
                          toggleFacet(group.name, option, checked)
                        }
                        className="[&_input]:rounded [&_input]:accent-blue-700"
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </aside>

      {scrollThumb.visible && (
        <div
          className={`pointer-events-none absolute bottom-0 right-1 top-0 w-2 ${scrollThumbClassName}`}
        >
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

export default JobFilter;
