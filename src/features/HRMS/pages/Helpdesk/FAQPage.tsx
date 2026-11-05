import { useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Section from '@/components/common/Section';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const faqCategories = [
  'All',
  'Payroll',
  'Leave',
  'Attendance',
  'IT Support',
  'Admin',
] as const;

type FaqCategory = (typeof faqCategories)[number];

type FaqRecord = {
  id: string;
  category: Exclude<FaqCategory, 'All'>;
  question: string;
  answer: string;
};

type FAQPageProps = {
  // Hook this up to open your Raise Ticket tab / dialog.
  onRaiseTicket?: () => void;
};

const faqs: FaqRecord[] = [
  {
    id: 'payslip',
    category: 'Payroll',
    question: 'How do I download my payslip?',
    answer:
      'Open the Payroll menu, choose Payslips, select the month you need and use the download option next to it.',
  },
  {
    id: 'bank',
    category: 'Payroll',
    question: 'How do I update my bank account details?',
    answer:
      'Submit the change from your profile along with a supporting proof such as a cancelled cheque. HR verifies it, and the new account applies from the next payroll cycle.',
  },
  {
    id: 'deductions',
    category: 'Payroll',
    question: 'Why do the deductions on my payslip look different this month?',
    answer:
      'Deductions can change when tax declarations, loan recoveries or leave without pay are applied. If something still looks wrong, raise a Payroll ticket with the month and the amount in question.',
  },
  {
    id: 'apply-leave',
    category: 'Leave',
    question: 'How do I apply for leave?',
    answer:
      'Go to the Leave menu, choose Apply Leave, select the leave type and dates, and submit. Your reporting manager is notified for approval.',
  },
  {
    id: 'leave-balance',
    category: 'Leave',
    question:
      'My leave balance has not updated after approval. What should I do?',
    answer:
      'Balances can take a short while to refresh after approval. If it is still wrong after a day, raise a Leave ticket with the leave dates so HR can correct it.',
  },
  {
    id: 'regularise',
    category: 'Attendance',
    question: 'How do I regularise a missed punch?',
    answer:
      'Open Attendance, select the day with the missing punch and submit a regularisation request with the correct in and out times and a short reason.',
  },
  {
    id: 'vpn',
    category: 'IT Support',
    question: 'My laptop is not connecting to the VPN. What can I try?',
    answer:
      'Restart the VPN client, check that your internet is working and make sure the client is up to date. If it still fails, raise an IT Support ticket with the error message.',
  },
  {
    id: 'id-card',
    category: 'Admin',
    question: 'How do I get a replacement ID card?',
    answer:
      'Raise an Admin ticket describing the issue (lost or damaged). The Admin team will confirm when the new card is ready for collection.',
  },
];

/* ---------- Reusable pieces (kept in this file) ---------- */

type FilterPillsProps<T extends string> = {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
};

// Single-select pill row. Works with any list of text options.
function FilterPills<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: FilterPillsProps<T>) {
  return (
    <div role="group" aria-label={ariaLabel} className="flex flex-wrap gap-2">
      {options.map(option => {
        const selected = option === value;

        return (
          <Button
            key={option}
            type="button"
            size="sm"
            variant={selected ? 'default' : 'outline'}
            aria-pressed={selected}
            onClick={() => onChange(option)}
            className="rounded-full"
          >
            {option}
          </Button>
        );
      })}
    </div>
  );
}

type FaqAccordionProps = {
  items: Array<Pick<FaqRecord, 'id' | 'question' | 'answer'>>;
  openId: string | null;
  onToggle: (id: string) => void;
};

// Presentational accordion. The parent owns which item is open.
const FaqAccordion = ({ items, openId, onToggle }: FaqAccordionProps) => (
  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" role="list">
    {items.map(item => {
      const isOpen = openId === item.id;
      const panelId = `faq-panel-${item.id}`;

      return (
        <div
          key={item.id}
          className="rounded-lg border border-border bg-card p-1"
          role="listitem"
        >
          <h3>
            <Button
              type="button"
              variant="ghost"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => onToggle(item.id)}
              className={`h-auto w-full justify-between gap-4 whitespace-normal p-0 text-left text-sm font-semibold transition hover:bg-transparent ${
                isOpen ? 'text-primary' : 'text-foreground hover:text-primary'
              }`}
            >
              <span>{item.question}</span>
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
                  isOpen ? 'rotate-180' : ''
                }`}
                aria-hidden="true"
              />
            </Button>
          </h3>

          {isOpen && (
            <p
              id={panelId}
              className="pt-3 text-sm leading-relaxed text-muted-foreground"
            >
              {item.answer}
            </p>
          )}
        </div>
      );
    })}
  </div>
);

/* ---------- Page ---------- */

const FAQPage = ({ onRaiseTicket }: FAQPageProps) => {
  const [category, setCategory] = useState<FaqCategory>('All');
  const [openId, setOpenId] = useState<string | null>(null);

  const filteredFaqs = useMemo(() => {
    return faqs.filter(faq => category === 'All' || faq.category === category);
  }, [category]);

  const handleToggle = (id: string) => {
    setOpenId(current => (current === id ? null : id));
  };

  const handleRaiseTicket = () => {
    if (onRaiseTicket) {
      onRaiseTicket();
      return;
    }
    toast.info('Open the Raise Ticket tab to submit your request.');
  };

  return (
    <>
      <Section title="FAQs" menuId="faqs" showBreadcrumbs>
        <div className="space-y-3">
          <FilterPills
            options={faqCategories}
            value={category}
            onChange={setCategory}
            ariaLabel="Filter questions by category"
          />
        </div>

        <div className="mt-4">
          {filteredFaqs.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm font-medium text-foreground">
                No questions found
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try a different word, or raise a ticket and we will help you.
              </p>
            </div>
          ) : (
            <FaqAccordion
              items={filteredFaqs}
              openId={openId}
              onToggle={handleToggle}
            />
          )}
        </div>

        <div className=" flex flex-col p-4 sm:flex-row sm:items-center sm:justify-end">
          <Button
            type="button"
            className="w-full shrink-0 sm:w-auto"
            onClick={handleRaiseTicket}
          >
            Raise a ticket
          </Button>
        </div>
      </Section>
    </>
  );
};

export default FAQPage;
