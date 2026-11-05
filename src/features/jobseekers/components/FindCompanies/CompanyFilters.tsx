import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FormField from '@/components/common/FormField';
import useScrollThumb from '@/hooks/useScrollThumb';
import {
  COMPANY_SIZES,
  COMPANY_TYPES,
  INDUSTRIES,
  LOCATIONS,
  RATING_STEPS,
  type CompanyFilters as Filters,
  type CompanySize,
  type CompanyType,
} from '../../data/companies';

type CompanyFiltersProps = {
  filters: Filters;
  onChange: (filters: Filters) => void;
  onReset: () => void;
  className?: string;
  scrollAreaClassName?: string;
  scrollThumbClassName?: string;
};

const toggleValue = <T extends string>(values: T[], value: T) =>
  values.includes(value)
    ? values.filter(item => item !== value)
    : [...values, value];

const checkboxClass = '[&_input]:h-4 [&_input]:w-4 [&_label]:text-sm';
const ANY_LOCATION_VALUE = 'any-location';

const CompanyFilters = ({
  filters,
  onChange,
  onReset,
  className = '',
  scrollAreaClassName = 'lg:h-[calc(100vh-6px)] lg:overflow-y-auto lg:pr-4',
  scrollThumbClassName = 'hidden lg:block',
}: CompanyFiltersProps) => {
  const { scrollRef, scrollThumb, updateScrollThumb } =
    useScrollThumb<HTMLElement>(filters);

  return (
    <div className={`relative ${className}`}>
      <aside
        ref={scrollRef}
        onScroll={updateScrollThumb}
        className={`profile-sidebar-scroll h-fit rounded-t-md border border-blue-300 dark:border-blue-700 bg-gradient-to-br from-white dark:from-slate-900 via-blue-50 dark:via-blue-950/40 to-white dark:to-slate-900 p-3 shadow-sm ${scrollAreaClassName}`}
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
            onClick={onReset}
            className="h-auto text-xs p-1 px-2  text-blue-700 dark:text-blue-400"
          >
            Reset all
          </Button>
        </div>

        <div className="space-y-3">
          <fieldset className="rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-3">
            <legend className="sr-only">Quick filters</legend>
            <p className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
              Quick filters
            </p>
            <div className="space-y-2.5">
              <FormField
                label="Hiring now"
                name="hiringOnly"
                type="checkbox"
                value={filters.hiringOnly}
                onCheckboxChange={checked =>
                  onChange({ ...filters, hiringOnly: checked })
                }
                className={checkboxClass}
              />
              <FormField
                label="Companies I follow"
                name="followingOnly"
                type="checkbox"
                value={filters.followingOnly}
                onCheckboxChange={checked =>
                  onChange({ ...filters, followingOnly: checked })
                }
                className={checkboxClass}
              />
            </div>
          </fieldset>

          <fieldset className="rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-3">
            <legend className="sr-only">Industry</legend>
            <p className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
              Industry
            </p>
            <div className="space-y-2.5">
              {INDUSTRIES.map(industry => (
                <FormField
                  key={industry}
                  label={industry}
                  name={`industry-${industry}`}
                  type="checkbox"
                  value={filters.industries.includes(industry)}
                  onCheckboxChange={() =>
                    onChange({
                      ...filters,
                      industries: toggleValue(filters.industries, industry),
                    })
                  }
                  className={checkboxClass}
                />
              ))}
            </div>
          </fieldset>

          <fieldset className="rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-3">
            <legend className="sr-only">Company type</legend>
            <p className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
              Company type
            </p>
            <div className="space-y-2.5">
              {COMPANY_TYPES.map(type => (
                <FormField
                  key={type}
                  label={type}
                  name={`type-${type}`}
                  type="checkbox"
                  value={filters.types.includes(type)}
                  onCheckboxChange={() =>
                    onChange({
                      ...filters,
                      types: toggleValue<CompanyType>(filters.types, type),
                    })
                  }
                  className={checkboxClass}
                />
              ))}
            </div>
          </fieldset>

          <fieldset className="rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-3">
            <legend className="sr-only">Company size</legend>
            <p className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
              Company size
            </p>
            <div className="space-y-2.5">
              {COMPANY_SIZES.map(size => (
                <FormField
                  key={size}
                  label={size}
                  name={`size-${size}`}
                  type="checkbox"
                  value={filters.sizes.includes(size)}
                  onCheckboxChange={() =>
                    onChange({
                      ...filters,
                      sizes: toggleValue<CompanySize>(filters.sizes, size),
                    })
                  }
                  className={checkboxClass}
                />
              ))}
            </div>
          </fieldset>

          <fieldset className="rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-3">
            <legend className="sr-only">Rating</legend>
            <p className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
              Rating
            </p>
            <FormField
              label="Rating"
              name="company-rating"
              type="radio"
              value={filters.minRating.toString()}
              onChange={value =>
                onChange({ ...filters, minRating: Number(value) })
              }
              options={[
                { value: '0', label: 'Any' },
                ...RATING_STEPS.map(rating => ({
                  value: rating.toString(),
                  label: `${rating}+ stars`,
                })),
              ]}
              className="[&_label]:sr-only"
            />
          </fieldset>

          <fieldset className="rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-3">
            <legend className="sr-only">Location</legend>
            <p className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
              Location
            </p>
            <FormField
              label="Location"
              name="company-location"
              type="select"
              value={filters.location || ANY_LOCATION_VALUE}
              onChange={location =>
                onChange({
                  ...filters,
                  location: location === ANY_LOCATION_VALUE ? '' : location,
                })
              }
              options={[
                { value: ANY_LOCATION_VALUE, label: 'Any location' },
                ...LOCATIONS.map(location => ({
                  value: location,
                  label: location,
                })),
              ]}
              className="[&_label]:sr-only"
            />
          </fieldset>
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

export default CompanyFilters;
