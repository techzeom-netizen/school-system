import React, {
  forwardRef,
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { createPortal } from 'react-dom';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Calendar, ChevronDown, X } from 'lucide-react';
import { Button } from '../ui';

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Helper function to safely forward refs
const forwardRefSafely = (
  node: HTMLInputElement | HTMLTextAreaElement | null,
  ref: React.ForwardedRef<HTMLInputElement | HTMLTextAreaElement>
) => {
  if (typeof ref === 'function') {
    ref(node);
  } else if (ref && 'current' in ref) {
    // Only assign if the ref is mutable (not read-only)
    const mutableRef = ref as {
      -readonly [K in keyof typeof ref]: (typeof ref)[K];
    };
    mutableRef.current = node;
  }
};

// OTP Input Component
interface OtpInputProps {
  value: string;
  onChange?: (value: string) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  readOnly?: boolean;
  error?: string;
}

const OtpInput: React.FC<OtpInputProps> = ({
  value,
  onChange,
  onKeyDown,
  disabled,
  readOnly,
  error,
}) => {
  const otpValue = value || '';
  const otpDigits = useMemo(() => {
    const digits = otpValue.split('').slice(0, 6);
    while (digits.length < 6) {
      digits.push('');
    }
    return digits;
  }, [otpValue]);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleOtpChange = (index: number, digitValue: string) => {
    // Only allow numbers
    if (digitValue && !/^\d$/.test(digitValue)) return;

    const newDigits = [...otpDigits];
    newDigits[index] = digitValue;
    const newOtp = newDigits.join('');
    onChange?.(newOtp);

    // Auto-focus next input
    if (digitValue && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
    onKeyDown?.(e);
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      onChange?.(pastedData);
      // Focus the next empty input or the last one
      const nextIndex = Math.min(pastedData.length, 5);
      otpInputRefs.current[nextIndex]?.focus();
    }
  };

  return (
    <div className="flex justify-center gap-2">
      {otpDigits.map((digit, index) => (
        <Input
          key={index}
          ref={el => (otpInputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={e => handleOtpChange(index, e.target.value)}
          onKeyDown={e => handleOtpKeyDown(index, e)}
          onPaste={index === 0 ? handleOtpPaste : undefined}
          disabled={disabled}
          readOnly={readOnly}
          className={cn(
            'w-12 h-12 text-center text-lg font-semibold border-2 rounded-md transition-colors',
            'border-gray-300 dark:border-gray-600',
            'focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800',
            'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100',
            {
              'border-red-500 dark:border-red-400': error,
              'bg-gray-100 dark:bg-gray-600': readOnly,
            }
          )}
        />
      ))}
    </div>
  );
};

interface FormFieldOption {
  value: string;
  label: string;
  type?: 'default' | 'button';
  onButtonClick?: () => void;
}

interface FormFieldProps {
  label: string;
  name: string;
  type?:
    | 'text'
    | 'email'
    | 'tel'
    | 'number'
    | 'date'
    | 'time'
    | 'url'
    | 'password'
    | 'textarea'
    | 'select'
    | 'searchSelect'
    | 'radio'
    | 'file'
    | 'contentFile'
    | 'checkbox'
    | 'color'
    | 'otp'
    | 'toggle'
    | 'buttonText';
  value: string | number | boolean;
  onChange?: (value: string) => void;
  onCheckboxChange?: (checked: boolean) => void;
  onToggleChange?: (checked: boolean) => void;
  onFileChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onImageClick?: (imageUrl: string, label: string) => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  onBlur?: (event: React.FocusEvent) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  error?: string;
  hint?: string;
  options?: FormFieldOption[];
  rows?: number;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  step?: string;
  min?: string;
  max?: string;
  accept?: string;
  previewUrl?: string;
  className?: string;
  colSpan?: 1 | 2;
  toggleActiveLabel?: string;
  toggleInactiveLabel?: string;
  // Search select specific props
  onSearchSelectChange?: (value: string, option?: FormFieldOption) => void;
  onSearchInputChange?: (value: string) => void;
  isLoading?: boolean;
  noOptionsMessage?: string;
  // Button text props
  buttonText?: string;
  buttonVariant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  onButtonClick?: () => void;
  buttonDisabled?: boolean;
}

const FormField = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  FormFieldProps
>(
  (
    {
      label,
      name,
      type = 'text',
      value,
      onChange,
      onCheckboxChange,
      onToggleChange,
      onFileChange,
      onImageClick,
      onKeyDown,
      onBlur,
      placeholder,
      required = false,
      disabled = false,
      readOnly = false,
      error,
      hint,
      options = [],
      rows = 3,
      maxLength,
      minLength,
      pattern,
      step,
      min,
      max,
      accept,
      previewUrl,
      className,
      colSpan = 1,
      toggleActiveLabel = 'Active',
      toggleInactiveLabel = 'Inactive',
      // Search select specific props
      onSearchSelectChange,
      onSearchInputChange,
      isLoading = false,
      noOptionsMessage = 'No options found',
      // Button text props
      buttonText,
      buttonVariant,
      onButtonClick,
      buttonDisabled,
    },
    ref
  ) => {
    const primaryColor = '#0B1F4D';
    const primaryColorStyle = primaryColor
      ? ({ '--field-primary-color': primaryColor } as React.CSSProperties)
      : undefined;
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [currentDate, setCurrentDate] = useState(new Date());
    const dateInputRef = useRef<HTMLInputElement | null>(null);
    const [datePickerPosition, setDatePickerPosition] = useState({
      top: 0,
      left: 0,
    });

    // State for searchSelect
    const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
    const [searchInput, setSearchInput] = useState(value?.toString() || '');
    const [filteredOptions, setFilteredOptions] =
      useState<FormFieldOption[]>(options);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [fileSizeError, setFileSizeError] = useState<string | undefined>();
    const [searchDropdownPosition, setSearchDropdownPosition] = useState({
      top: 0,
      left: 0,
      width: 0,
      maxHeight: 240,
    });

    // Refs for searchSelect
    const searchSelectRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement | null>(null);
    const searchDropdownRef = useRef<HTMLDivElement>(null);
    const shouldAutoScrollHighlightedRef = useRef(false);

    const updateSearchDropdownPosition = useCallback(() => {
      if (!searchInputRef.current) return;

      const rect = searchInputRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const preferredHeight = 240;
      const spacing = 4;

      const spaceBelow = viewportHeight - rect.bottom - spacing;
      const spaceAbove = rect.top - spacing;
      const openUpward = spaceBelow < 160 && spaceAbove > spaceBelow;

      const availableSpace = openUpward ? spaceAbove : spaceBelow;
      const maxHeight = Math.max(
        120,
        Math.min(preferredHeight, availableSpace)
      );

      let left = rect.left;
      const width = Math.min(rect.width, viewportWidth - spacing * 2);

      if (left + width > viewportWidth - spacing) {
        left = Math.max(spacing, viewportWidth - width - spacing);
      }

      const top = openUpward
        ? Math.max(spacing, rect.top - maxHeight - spacing)
        : rect.bottom + spacing;

      setSearchDropdownPosition({
        top,
        left,
        width,
        maxHeight,
      });
    }, []);

    // Updated base input classes with dark mode support
    const baseInputClasses =
      'text-xs bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 h-8 md:h-8 px-2 md:px-3 rounded-none w-full md:w-[100%] border border-gray-400 dark:border-gray-600 focus-visible:!ring-[var(--field-primary-color)] focus-visible:!border-[var(--field-primary-color)]';
    const numberInputClasses =
      'appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none';
    const handleNumberWheel: React.WheelEventHandler<HTMLInputElement> = e => {
      // Prevent mouse wheel from changing number inputs
      (e.target as HTMLInputElement).blur();
      e.preventDefault();
    };

    const formatDateForApi = (date: Date): string => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');

      return `${year}-${month}-${day}`;
    };

    const isValidDateParts = (
      year: number,
      month: number,
      day: number
    ): boolean => {
      const date = new Date(year, month - 1, day);

      return (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day
      );
    };

    // Parse date from string input. Values emitted from this field use YYYY-MM-DD.
    const parseDateFromInput = (dateString: string): Date | null => {
      if (!dateString) return null;

      const apiMatch = dateString.match(/^(\d{4})[/-](\d{1,2})[/-](\d{1,2})$/);
      if (apiMatch) {
        const year = Number(apiMatch[1]);
        const month = Number(apiMatch[2]);
        const day = Number(apiMatch[3]);

        return isValidDateParts(year, month, day)
          ? new Date(year, month - 1, day)
          : null;
      }

      const displayMatch = dateString.match(
        /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/
      );
      if (displayMatch) {
        const day = Number(displayMatch[1]);
        const month = Number(displayMatch[2]);
        const year = Number(displayMatch[3]);

        return isValidDateParts(year, month, day)
          ? new Date(year, month - 1, day)
          : null;
      }

      const shortYearMatch = dateString.match(
        /^(\d{1,2})[/-](\d{1,2})[/-](\d{2})$/
      );
      if (shortYearMatch) {
        const day = Number(shortYearMatch[1]);
        const month = Number(shortYearMatch[2]);
        const year = 2000 + Number(shortYearMatch[3]);

        return isValidDateParts(year, month, day)
          ? new Date(year, month - 1, day)
          : null;
      }

      return null;
    };

    // Update selected date when value changes
    useEffect(() => {
      if (value) {
        const date = parseDateFromInput(value.toString());
        setSelectedDate(date);
        if (date) {
          setCurrentDate(date);
        }
      } else {
        setSelectedDate(null);
      }
    }, [value]);

    // SearchSelect useEffect hooks
    // Filter options based on search input
    useEffect(() => {
      if (type === 'searchSelect' && options) {
        if (!searchInput.trim()) {
          setFilteredOptions(options);
        } else {
          const buttonOptions = options.filter(
            option => option.type === 'button'
          );
          const filtered = options.filter(
            option =>
              option.type !== 'button' &&
              (option.label.toLowerCase().includes(searchInput.toLowerCase()) ||
                option.value.toLowerCase().includes(searchInput.toLowerCase()))
          );
          setFilteredOptions([...filtered, ...buttonOptions]);
        }
      }
    }, [searchInput, options, type]);

    // Close search dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          searchSelectRef.current &&
          !searchSelectRef.current.contains(event.target as Node) &&
          searchDropdownRef.current &&
          !searchDropdownRef.current.contains(event.target as Node)
        ) {
          setIsSearchDropdownOpen(false);
        }
      };

      if (isSearchDropdownOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }
    }, [isSearchDropdownOpen]);

    // Reset highlighted index when search dropdown opens/closes or options change
    useEffect(() => {
      if (isSearchDropdownOpen && filteredOptions.length > 0) {
        setHighlightedIndex(0);
      } else {
        setHighlightedIndex(-1);
      }
    }, [isSearchDropdownOpen, filteredOptions]);

    useEffect(() => {
      if (!isSearchDropdownOpen) return;

      updateSearchDropdownPosition();

      window.addEventListener('resize', updateSearchDropdownPosition);

      return () => {
        window.removeEventListener('resize', updateSearchDropdownPosition);
      };
    }, [isSearchDropdownOpen, updateSearchDropdownPosition]);

    // Scroll highlighted item into view
    useEffect(() => {
      if (
        isSearchDropdownOpen &&
        shouldAutoScrollHighlightedRef.current &&
        highlightedIndex >= 0 &&
        searchDropdownRef.current
      ) {
        const items = searchDropdownRef.current.querySelectorAll(
          '[data-option-index]'
        );
        if (items[highlightedIndex]) {
          items[highlightedIndex].scrollIntoView({
            block: 'nearest',
          });
        }
        shouldAutoScrollHighlightedRef.current = false;
      }
    }, [highlightedIndex, isSearchDropdownOpen]);

    // Handle keyboard navigation for searchSelect
    const handleSearchSelectKeyDown = (
      e: React.KeyboardEvent<HTMLInputElement>
    ) => {
      if (!isSearchDropdownOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          if (highlightedIndex < filteredOptions.length - 1) {
            shouldAutoScrollHighlightedRef.current = true;
            setHighlightedIndex(prev => prev + 1);
          } else {
            shouldAutoScrollHighlightedRef.current = false;
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (highlightedIndex > 0) {
            shouldAutoScrollHighlightedRef.current = true;
            setHighlightedIndex(prev => prev - 1);
          } else {
            shouldAutoScrollHighlightedRef.current = false;
          }
          break;
        case 'Enter':
          e.preventDefault();
          if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
            handleSearchOptionSelect(filteredOptions[highlightedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setIsSearchDropdownOpen(false);
          break;
        case 'Tab':
          setIsSearchDropdownOpen(false);
          break;
      }
      onKeyDown?.(e);
    };

    // Handle search option selection
    const handleSearchOptionSelect = (option: FormFieldOption) => {
      if (option.type === 'button') {
        setIsSearchDropdownOpen(false);
        option.onButtonClick?.();
        return;
      }

      setSearchInput(option.label);
      setIsSearchDropdownOpen(false);

      // Call all relevant change handlers
      onChange?.(option.value);
      onSearchSelectChange?.(option.value, option);
    };

    // Handle search input change
    const handleSearchInputChange = (value: string) => {
      setSearchInput(value);
      setIsSearchDropdownOpen(true);
      updateSearchDropdownPosition();
      onSearchInputChange?.(value);
      onChange?.(value);
    };

    // Clear search input
    const handleClearSearch = () => {
      setSearchInput('');
      setIsSearchDropdownOpen(true);
      onSearchInputChange?.('');
      onChange?.('');
      searchInputRef.current?.focus();
    };

    // Toggle search dropdown
    const toggleSearchDropdown = () => {
      if (disabled || readOnly) return;

      if (!isSearchDropdownOpen) {
        updateSearchDropdownPosition();
      }

      setIsSearchDropdownOpen(!isSearchDropdownOpen);
      if (!isSearchDropdownOpen) {
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 0);
      }
    };

    // Search select dropdown component
    const SearchSelectDropdown = () => {
      if (!isSearchDropdownOpen || disabled || readOnly) return null;

      return createPortal(
        <div
          id={`${name}-dropdown`}
          ref={searchDropdownRef}
          className="fixed z-[10002] bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg overflow-y-auto"
          style={{
            top: `${searchDropdownPosition.top}px`,
            left: `${searchDropdownPosition.left}px`,
            width: `${searchDropdownPosition.width}px`,
            maxHeight: `${searchDropdownPosition.maxHeight}px`,
          }}
        >
          {isLoading ? (
            <div className="px-3 py-2 text-xs text-gray-500 dark:text-gray-400 text-center">
              Loading...
            </div>
          ) : filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <button
                key={option.value}
                type="button"
                id={`${name}-option-${index}`}
                data-option-index={index}
                className={cn(
                  'w-full text-left px-3 py-2 text-xs cursor-pointer transition-colors',
                  'hover:bg-blue-50 dark:hover:bg-gray-700',
                  highlightedIndex === index && 'bg-blue-100 dark:bg-blue-900',
                  'border-b border-gray-100 dark:border-gray-700 last:border-b-0'
                )}
                onMouseDown={e => e.preventDefault()}
                onClick={() => handleSearchOptionSelect(option)}
              >
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  {option.label}
                </div>
                {/* {option.value !== option.label && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {option.value}
                  </div>
                )} */}
              </button>
            ))
          ) : (
            <div className="px-3 py-2 text-xs text-gray-500 dark:text-gray-400 text-center">
              {noOptionsMessage}
            </div>
          )}
        </div>,
        document.body
      );
    };

    // Function to handle date selection from calendar
    const handleDateSelect = (date: Date) => {
      onChange?.(formatDateForApi(date));
      setSelectedDate(date);
      setShowDatePicker(false);
    };

    // Handle input change for date field
    const handleDateInputChange = (inputValue: string) => {
      const parsedDate = parseDateFromInput(inputValue);
      if (parsedDate) {
        onChange?.(formatDateForApi(parsedDate));
        setSelectedDate(parsedDate);
        setCurrentDate(parsedDate);
      } else {
        onChange?.(inputValue);
        setSelectedDate(null);
      }
    };

    // Ref callback for date input
    const dateInputRefCallback = useCallback(
      (node: HTMLInputElement | null) => {
        dateInputRef.current = node;
        forwardRefSafely(node, ref);
      },
      [ref]
    );

    // Calculate date picker position when opening
    // Note: Since DatePicker uses position: fixed, we use viewport-relative coordinates
    // (getBoundingClientRect already returns viewport-relative values)
    const handleDatePickerToggle = () => {
      if (!showDatePicker && dateInputRef.current) {
        const rect = dateInputRef.current.getBoundingClientRect();
        const datePickerWidth = 280; // min-w-[280px]
        const datePickerHeight = 280; // approximate height (reduced for compact design)
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // For position: fixed, use viewport-relative coordinates (no scroll offset needed)
        let top = rect.bottom + 4;
        let left = rect.left;

        // Adjust if date picker would go off bottom of viewport
        if (rect.bottom + datePickerHeight > viewportHeight) {
          // Show above input instead
          top = rect.top - datePickerHeight - 4;
          if (top < 0) {
            // If still off-screen at top, align to viewport top
            top = 4;
          }
        }

        // Adjust if date picker would go off right edge of viewport
        if (left + datePickerWidth > viewportWidth) {
          left = viewportWidth - datePickerWidth - 4;
        }

        // Adjust if date picker would go off left edge of viewport
        if (left < 0) {
          left = 4;
        }

        setDatePickerPosition({ top, left });
      }
      setShowDatePicker(!showDatePicker);
    };

    // Custom Date Picker Component
    const DatePicker = () => {
      const today = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth();

      // Get days in month
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

      // Get first day of month (0 = Sunday, 1 = Monday, etc.)
      const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

      // Generate calendar days
      const calendarDays = [];

      // Add empty cells for days before the first day of month
      for (let i = 0; i < firstDayOfMonth; i++) {
        calendarDays.push(null);
      }

      // Add days of the month
      for (let day = 1; day <= daysInMonth; day++) {
        calendarDays.push(new Date(currentYear, currentMonth, day));
      }

      const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];

      const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

      // Generate year options (from 1900 to current year + 10)
      const yearOptions = [];
      const startYear = 1900;
      const endYear = today.getFullYear() + 10;
      for (let year = startYear; year <= endYear; year++) {
        yearOptions.push(year);
      }

      const navigateMonth = (direction: 'prev' | 'next') => {
        setCurrentDate(prev => {
          const newDate = new Date(prev);
          if (direction === 'prev') {
            newDate.setMonth(prev.getMonth() - 1);
          } else {
            newDate.setMonth(prev.getMonth() + 1);
          }
          return newDate;
        });
      };

      const handleMonthChange = (monthIndex: number) => {
        setCurrentDate(prev => {
          const newDate = new Date(prev);
          newDate.setMonth(monthIndex);
          return newDate;
        });
      };

      const handleYearChange = (year: number) => {
        setCurrentDate(prev => {
          const newDate = new Date(prev);
          newDate.setFullYear(year);
          return newDate;
        });
      };

      const isToday = (date: Date) => {
        return date.toDateString() === today.toDateString();
      };

      const isSelected = (date: Date) => {
        return (
          selectedDate && date.toDateString() === selectedDate.toDateString()
        );
      };

      const getSelectedDateStyle = (date: Date | null) => {
        if (!date || !isSelected(date) || !primaryColor) return undefined;
        return { backgroundColor: primaryColor } as React.CSSProperties;
      };

      const getTodayDateStyle = (date: Date | null) => {
        if (!date || isSelected(date) || !isToday(date) || !primaryColor)
          return undefined;
        return {
          borderColor: primaryColor,
          color: primaryColor,
        } as React.CSSProperties;
      };

      const handleClear = () => {
        onChange?.('');
        setSelectedDate(null);
        setShowDatePicker(false);
      };

      return (
        <div
          className="fixed z-[10000] bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 shadow-lg rounded-md p-2 min-w-[280px]"
          style={{
            top: `${datePickerPosition.top}px`,
            left: `${datePickerPosition.left}px`,
            pointerEvents: 'auto',
          }}
          onClick={e => {
            e.stopPropagation();
            e.preventDefault();
          }}
          onMouseDown={e => {
            e.stopPropagation();
            e.preventDefault();
          }}
        >
          {/* Header with Month and Year Dropdowns */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {/* Month Dropdown */}
              <Select
                value={currentMonth.toString()}
                onValueChange={value => handleMonthChange(parseInt(value))}
              >
                <SelectTrigger
                  className={cn(
                    'h-6 text-xs px-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 w-28',
                    primaryColor &&
                      'focus:!ring-[var(--field-primary-color)] focus:!border-[var(--field-primary-color)] data-[state=open]:!ring-[var(--field-primary-color)] data-[state=open]:!border-[var(--field-primary-color)]'
                  )}
                >
                  <SelectValue>{monthNames[currentMonth]}</SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 max-h-[200px] z-[10050]">
                  {monthNames.map((month, index) => (
                    <SelectItem
                      key={month}
                      value={index.toString()}
                      className="text-xs"
                    >
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Year Dropdown */}
              <Select
                value={currentYear.toString()}
                onValueChange={value => handleYearChange(parseInt(value))}
              >
                <SelectTrigger
                  className={cn(
                    'h-6 text-xs px-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 w-20',
                    primaryColor &&
                      'focus:!ring-[var(--field-primary-color)] focus:!border-[var(--field-primary-color)] data-[state=open]:!ring-[var(--field-primary-color)] data-[state=open]:!border-[var(--field-primary-color)]'
                  )}
                >
                  <SelectValue>{currentYear}</SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 max-h-[200px] overflow-y-auto z-[10002]">
                  {yearOptions.map(year => (
                    <SelectItem
                      key={year}
                      value={year.toString()}
                      className="text-xs"
                    >
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  e.preventDefault();
                  navigateMonth('prev');
                }}
                onMouseDown={e => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex-shrink-0"
                aria-label="Previous month"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  e.preventDefault();
                  navigateMonth('next');
                }}
                onMouseDown={e => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex-shrink-0"
                aria-label="Next month"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {dayNames.map(day => (
              <div
                key={day}
                className="text-xs text-center text-gray-500 dark:text-gray-400 font-medium py-0.5"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {calendarDays.map((date, index) => (
              <button
                key={index}
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  e.preventDefault();
                  if (date) handleDateSelect(date);
                }}
                onMouseDown={e => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                className={cn(
                  'w-7 h-7 text-xs rounded flex items-center justify-center transition-colors',
                  !date && 'invisible',
                  date && isSelected(date) && 'bg-blue-600 text-white',
                  date && !isSelected(date) && isToday(date) && 'border',
                  date &&
                    !isSelected(date) &&
                    !isToday(date) &&
                    'text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700'
                )}
                style={
                  getSelectedDateStyle(date) ||
                  getTodayDateStyle(date) ||
                  undefined
                }
                disabled={!date}
              >
                {date ? date.getDate() : ''}
              </button>
            ))}
          </div>

          {/* Footer buttons */}
          <div className="flex justify-between items-center border-t border-gray-200 dark:border-gray-600 pt-2">
            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                handleClear();
              }}
              onMouseDown={e => {
                e.stopPropagation();
                e.preventDefault();
              }}
              className="text-xs px-2 py-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                handleDateSelect(today);
              }}
              onMouseDown={e => {
                e.stopPropagation();
                e.preventDefault();
              }}
              className={cn(
                'text-xs px-2 py-1 text-white rounded transition-colors',
                primaryColor
                  ? 'hover:opacity-90'
                  : 'bg-blue-600 hover:bg-blue-700'
              )}
              style={
                primaryColor
                  ? ({ backgroundColor: primaryColor } as React.CSSProperties)
                  : undefined
              }
            >
              Today
            </button>
          </div>
        </div>
      );
    };

    const renderInput = () => {
      switch (type) {
        case 'textarea':
          return (
            <Textarea
              ref={node => forwardRefSafely(node, ref)}
              id={name}
              name={name}
              value={value == null ? '' : value.toString()}
              onChange={e => onChange?.(e.target.value)}
              onKeyDown={onKeyDown}
              onBlur={onBlur}
              placeholder={placeholder}
              required={required}
              disabled={disabled}
              readOnly={readOnly}
              rows={rows}
              maxLength={maxLength}
              className={cn(baseInputClasses, {
                'bg-gray-100 dark:bg-gray-600': readOnly,
                'border-red-500 dark:border-red-400': error,
              })}
            />
          );

        case 'select': {
          const selectValue =
            value == null || value === '' ? '' : value.toString();

          return (
            <Select
              value={selectValue}
              onValueChange={val => {
                onChange?.(val);
              }}
              disabled={disabled}
            >
              <SelectTrigger
                className={cn(
                  baseInputClasses,
                  primaryColor &&
                    'focus:!ring-[var(--field-primary-color)] focus:!border-[var(--field-primary-color)] data-[state=open]:!ring-[var(--field-primary-color)] data-[state=open]:!border-[var(--field-primary-color)]',
                  {
                    'border-red-500 dark:border-red-400': error,
                  }
                )}
                id={name}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-700 border-gray-400 dark:border-gray-600 z-[10002]">
                {options?.map(option => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="text-xs text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        }

        case 'searchSelect':
          return (
            <div className="relative" ref={searchSelectRef}>
              {/* Search Input */}
              <div className="relative">
                <Input
                  ref={node => {
                    if (searchInputRef) {
                      (
                        searchInputRef as React.MutableRefObject<HTMLInputElement | null>
                      ).current = node;
                    }
                    forwardRefSafely(node, ref);
                  }}
                  id={name}
                  name={name}
                  type="text"
                  value={searchInput}
                  onChange={e => handleSearchInputChange(e.target.value)}
                  onFocus={() => {
                    setIsSearchFocused(true);
                    updateSearchDropdownPosition();
                    setIsSearchDropdownOpen(true);
                  }}
                  onBlur={e => {
                    setIsSearchFocused(false);
                    onBlur?.(e);
                  }}
                  onKeyDown={handleSearchSelectKeyDown}
                  placeholder={placeholder || 'Search...'}
                  required={required}
                  disabled={disabled}
                  readOnly={readOnly}
                  className={cn(baseInputClasses, 'pr-16', {
                    'border-red-500 dark:border-red-400': error,
                    'bg-gray-100 dark:bg-gray-600': readOnly,
                    'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-900':
                      isSearchFocused && !disabled && !primaryColor,
                    'border-[var(--field-primary-color)] ring-2 ring-[var(--field-primary-color)]/20':
                      isSearchFocused && !disabled && !!primaryColor,
                  })}
                  aria-expanded={isSearchDropdownOpen}
                  aria-autocomplete="list"
                  aria-controls={`${name}-dropdown`}
                  aria-activedescendant={
                    highlightedIndex >= 0
                      ? `${name}-option-${highlightedIndex}`
                      : undefined
                  }
                />

                {/* Clear and dropdown buttons */}
                <div className="absolute right-0 top-0 bottom-0 flex items-center pr-1">
                  {searchInput && !disabled && !readOnly && (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 mr-1"
                      aria-label="Clear search"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={toggleSearchDropdown}
                    disabled={disabled || readOnly}
                    className={cn(
                      'p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300',
                      'transition-transform duration-200',
                      isSearchDropdownOpen && 'rotate-180',
                      (disabled || readOnly) && 'opacity-50 cursor-not-allowed'
                    )}
                    aria-label={
                      isSearchDropdownOpen ? 'Close dropdown' : 'Open dropdown'
                    }
                    aria-haspopup="listbox"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Dropdown */}
              <SearchSelectDropdown />
            </div>
          );

        case 'radio':
          return (
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3">
              {options?.map(option => (
                <label
                  key={option.value}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name={name}
                    value={option.value}
                    checked={value.toString() === option.value}
                    onChange={e => onChange?.(e.target.value)}
                    disabled={disabled}
                    className="w-4 h-4 text-primary focus:ring-primary dark:focus:ring-primary"
                  />
                  <span className="text-xs text-gray-900 dark:text-gray-100">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          );

        case 'date':
          return (
            <div className="relative">
              <Input
                ref={dateInputRefCallback}
                id={name}
                name={name}
                type="text"
                value={value == null ? '' : value.toString()}
                onChange={e => handleDateInputChange(e.target.value)}
                onKeyDown={onKeyDown}
                onBlur={onBlur}
                placeholder={placeholder || 'YYYY-MM-DD'}
                required={required}
                disabled={disabled}
                readOnly={readOnly}
                className={cn(baseInputClasses, 'pr-8', {
                  'bg-gray-100 dark:bg-gray-600': readOnly,
                  'border-red-500 dark:border-red-400': error,
                })}
              />
              <button
                type="button"
                onClick={handleDatePickerToggle}
                disabled={disabled || readOnly}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed z-10"
                aria-label="Open date picker"
              >
                <Calendar className="w-4 h-4" />
              </button>

              {showDatePicker &&
                !disabled &&
                !readOnly &&
                typeof document !== 'undefined' &&
                createPortal(
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 z-[9998] bg-transparent"
                      onClick={e => {
                        // Only close if clicking directly on backdrop, not on date picker
                        if (e.target === e.currentTarget) {
                          setShowDatePicker(false);
                        }
                      }}
                      style={{ pointerEvents: 'auto' }}
                    />
                    <DatePicker />
                  </>,
                  document.body
                )}
            </div>
          );

        case 'color':
          return (
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="color"
                  id={name}
                  name={name}
                  value={value.toString()}
                  onChange={e => onChange?.(e.target.value)}
                  disabled={disabled}
                  className={cn(
                    'w-24 h-8 rounded border cursor-pointer disabled:cursor-not-allowed',
                    'border-gray-400 dark:border-gray-600'
                  )}
                />
              </div>
              <Input
                ref={node => forwardRefSafely(node, ref)}
                type="text"
                value={value.toString()}
                onChange={e => onChange?.(e.target.value)}
                onKeyDown={onKeyDown}
                onBlur={onBlur}
                placeholder={placeholder}
                disabled={disabled}
                readOnly={readOnly}
                maxLength={7}
                pattern="^#[0-9A-Fa-f]{6}$"
                className={cn(baseInputClasses, 'flex-1', {
                  'bg-gray-100 dark:bg-gray-600': readOnly,
                  'border-red-500 dark:border-red-400': error,
                })}
              />
            </div>
          );

        case 'file': {
          const controlledFileName =
            typeof value === 'string' &&
            value &&
            !value.startsWith('data:') &&
            !value.startsWith('blob:')
              ? value
              : '';
          const renderImagePreview = () => {
            if (!previewUrl) return null;

            if (onImageClick) {
              return (
                <button
                  type="button"
                  className="rounded-md bg-gray-50 dark:bg-gray-700 cursor-pointer hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={() => onImageClick(previewUrl, label)}
                  title="Click to preview"
                  aria-label={`Preview ${label}`}
                >
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-48 object-contain"
                  />
                </button>
              );
            }

            return (
              <div className="rounded-md bg-gray-50 dark:bg-gray-700">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-w-[120px] max-h-[90px] object-contain"
                />
              </div>
            );
          };

          return (
            <div className="space-y-3 border border-gray-400 dark:border-gray-600 p-1">
              {renderImagePreview()}
              <div className="relative">
                <input
                  type="file"
                  id={name}
                  name={name}
                  accept={accept}
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    const maxSize = 3 * 1024 * 1024;
                    if (file.size > maxSize) {
                      setFileSizeError('File size must not exceed 3MB');
                      e.target.value = '';
                      return;
                    }
                    setFileSizeError(undefined);
                    onFileChange?.(e);
                  }}
                  disabled={disabled}
                  style={
                    primaryColor
                      ? ({
                          '--file-bg-color': primaryColor,
                        } as React.CSSProperties)
                      : undefined
                  }
                  className={cn(
                    'block w-full text-xs',
                    'file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0',
                    'file:text-xs file:font-semibold file:!text-white hover:file:opacity-90',
                    primaryColor
                      ? 'file:!bg-[var(--file-bg-color)]'
                      : 'file:bg-primary',
                    controlledFileName && 'text-transparent'
                  )}
                />
                {controlledFileName && (
                  <span
                    className="pointer-events-none absolute inset-y-0 left-28 right-2 flex items-center truncate bg-white text-xs text-foreground dark:bg-gray-900"
                    title={controlledFileName}
                  >
                    {controlledFileName}
                  </span>
                )}
              </div>
              {fileSizeError && (
                <p className="text-xs text-red-500 dark:text-red-400">
                  {fileSizeError}
                </p>
              )}
            </div>
          );
        }

        case 'contentFile': {
          const controlledFileName =
            typeof value === 'string' &&
            value &&
            !value.startsWith('data:') &&
            !value.startsWith('blob:')
              ? value
              : '';
          const renderImagePreview = () => {
            if (!previewUrl) return null;

            if (onImageClick) {
              return (
                <button
                  type="button"
                  className="rounded-md bg-gray-50 dark:bg-gray-700 cursor-pointer hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={() => onImageClick(previewUrl, label)}
                  title="Click to preview"
                  aria-label={`Preview ${label}`}
                >
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-48 object-contain"
                  />
                </button>
              );
            }

            return (
              <div className="rounded-md bg-gray-50 dark:bg-gray-700">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-w-[120px] max-h-[90px] object-contain"
                />
              </div>
            );
          };

          return (
            <div className="space-y-3 border border-gray-400 dark:border-gray-600 p-1">
              {renderImagePreview()}
              <div className="relative">
                <input
                  type="file"
                  id={name}
                  name={name}
                  accept={accept}
                  onChange={onFileChange}
                  disabled={disabled}
                  style={
                    primaryColor
                      ? ({
                          '--file-bg-color': primaryColor,
                        } as React.CSSProperties)
                      : undefined
                  }
                  className={cn(
                    'block w-full text-xs',
                    'file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0',
                    'file:text-xs file:font-semibold file:!text-white hover:file:opacity-90',
                    primaryColor
                      ? 'file:!bg-[var(--file-bg-color)]'
                      : 'file:bg-primary',
                    controlledFileName && 'text-transparent'
                  )}
                />
                {controlledFileName && (
                  <span
                    className="pointer-events-none absolute inset-y-0 left-24 right-2 flex items-center truncate text-xs text-foreground"
                    title={controlledFileName}
                  >
                    {controlledFileName}
                  </span>
                )}
              </div>
            </div>
          );
        }

        case 'checkbox':
          return (
            <div className="flex items-center gap-2">
              <Input
                type="checkbox"
                id={name}
                name={name}
                checked={value as boolean}
                onChange={e => onCheckboxChange?.(e.target.checked)}
                disabled={disabled}
                className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary dark:bg-gray-700"
              />
              <label
                htmlFor={name}
                className="text-xs font-medium cursor-pointer text-gray-900 dark:text-gray-100"
              >
                {label}
              </label>
            </div>
          );

        case 'toggle': {
          const isActive = value === true;
          return (
            <div className="flex items-center gap-2">
              <button
                type="button"
                id={name}
                role="switch"
                aria-checked={isActive ? 'true' : 'false'}
                disabled={disabled}
                onClick={() => !disabled && onToggleChange?.(!isActive)}
                className={cn(
                  'relative inline-flex h-4 w-8 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                  isActive ? 'bg-navbar-bg' : 'bg-gray-300 dark:bg-gray-600',
                  disabled && 'opacity-50 cursor-not-allowed'
                )}
              >
                <span
                  className={cn(
                    'pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                    isActive ? 'translate-x-4' : 'translate-x-0'
                  )}
                />
              </button>
              <span
                className={cn(
                  'text-xs font-medium',
                  isActive
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-gray-500 dark:text-gray-400'
                )}
              >
                {isActive ? toggleActiveLabel : toggleInactiveLabel}
              </span>
            </div>
          );
        }

        case 'otp':
          return (
            <OtpInput
              value={value == null ? '' : value.toString()}
              onChange={onChange}
              onKeyDown={onKeyDown}
              disabled={disabled}
              readOnly={readOnly}
              error={error}
            />
          );

        case 'buttonText':
          return (
            <div className="relative">
              <Input
                ref={node => forwardRefSafely(node, ref)}
                id={name}
                name={name}
                type="text"
                value={
                  value == null
                    ? ''
                    : typeof value === 'boolean'
                      ? ''
                      : value.toString()
                }
                onChange={e => onChange?.(e.target.value)}
                onKeyDown={onKeyDown}
                onBlur={onBlur}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                readOnly={readOnly}
                maxLength={maxLength}
                minLength={minLength}
                pattern={pattern}
                className={cn(baseInputClasses, 'pr-[110px]', {
                  'bg-gray-100 dark:bg-gray-600': readOnly,
                  'border-red-500 dark:border-red-400': error,
                })}
              />
              <div className="absolute right-0 top-1/2 -translate-y-1/2">
                <Button
                  type="button"
                  size="lg"
                  variant={buttonVariant || 'default'}
                  onClick={onButtonClick}
                  disabled={buttonDisabled}
                  className="h-8 min-w-[90px] rounded-none"
                >
                  {buttonText || 'Action'}
                </Button>
              </div>
            </div>
          );

        case 'time':
          return (
            <Input
              ref={node => forwardRefSafely(node, ref)}
              id={name}
              name={name}
              type="time"
              value={value == null ? '' : value.toString()}
              onChange={e => onChange?.(e.target.value)}
              onKeyDown={onKeyDown}
              onBlur={onBlur}
              placeholder={placeholder || 'HH:MM'}
              required={required}
              disabled={disabled}
              readOnly={readOnly}
              step={step}
              min={min}
              max={max}
              className={cn(
                baseInputClasses,
                'transition-all duration-200 ease-in-out',
                primaryColor
                  ? 'focus:ring-2 focus:ring-[var(--field-primary-color)]/20 focus:border-[var(--field-primary-color)]'
                  : 'focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500',
                {
                  'bg-gray-100 dark:bg-gray-600': readOnly,
                  'border-red-500 dark:border-red-400 focus:ring-red-500/20 focus:border-red-500':
                    error,
                  'cursor-pointer': !readOnly && !disabled,
                }
              )}
            />
          );

        default:
          return (
            <Input
              ref={node => forwardRefSafely(node, ref)}
              id={name}
              name={name}
              type={type}
              value={
                value == null
                  ? ''
                  : typeof value === 'boolean'
                    ? ''
                    : value.toString()
              }
              onChange={e =>
                onChange?.(
                  type === 'email'
                    ? e.target.value.toLowerCase()
                    : e.target.value
                )
              }
              onKeyDown={onKeyDown}
              onBlur={onBlur}
              placeholder={placeholder}
              required={required}
              disabled={disabled}
              readOnly={readOnly}
              maxLength={maxLength}
              minLength={minLength}
              pattern={
                type === 'email' ? pattern || emailRegex.source : pattern
              }
              autoCapitalize={type === 'email' ? 'none' : undefined}
              spellCheck={type === 'email' ? false : undefined}
              step={step}
              min={min}
              max={max}
              onWheel={type === 'number' ? handleNumberWheel : undefined}
              className={cn(
                baseInputClasses,
                type === 'number' && numberInputClasses,
                {
                  'bg-gray-100 dark:bg-gray-600': readOnly,
                  'border-red-500 dark:border-red-400': error,
                }
              )}
            />
          );
      }
    };

    return (
      <div
        className={cn(
          'space-y-1 md:space-y-2',
          { 'md:col-span-2': colSpan === 2 },
          className
        )}
        style={primaryColorStyle}
      >
        {type !== 'checkbox' && type !== 'toggle' && (
          <Label
            htmlFor={name}
            className="text-gray-900 dark:text-gray-100 text-xs font-medium"
          >
            {label}
            {required && (
              <span className="text-red-500 dark:text-red-400"> *</span>
            )}
          </Label>
        )}

        {renderInput()}

        {hint && !error && (
          <p className="text-[11px] text-muted-foreground dark:text-white/80">
            {hint}
          </p>
        )}
        {error && (
          <p className="text-[11px] text-red-500 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';

export default FormField;
