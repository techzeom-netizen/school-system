import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FormField from '@/components/common/FormField';

type CompanySearchBarProps = {
  value: string;
  hasActiveFilters: boolean;
  onSearch: (value: string) => void;
  onClear: () => void;
};

const CompanySearchBar = ({
  value,
  hasActiveFilters,
  onSearch,
  onClear,
}: CompanySearchBarProps) => {
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  const handleSearch = () => {
    onSearch(draft);
  };

  const handleSearchKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="min-w-0 flex-1">
        <FormField
          label=""
          name="company-search"
          type="buttonText"
          value={draft}
          onChange={setDraft}
          onKeyDown={handleSearchKeyDown}
          placeholder="Search by company, industry, tag, or location"
          buttonText="Search"
          buttonVariant="default"
          onButtonClick={handleSearch}
        />
      </div>
      <div className="flex gap-2 sm:items-end">
        {hasActiveFilters && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-8 -mt-4 w-full rounded-none shrink-0 gap-2 border-red-200 dark:border-red-800 px-4 text-red-600 dark:text-red-400 hover:border-red-300 dark:hover:border-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-700 dark:hover:text-red-400 sm:w-auto"
            onClick={onClear}
          >
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
};

export default CompanySearchBar;
