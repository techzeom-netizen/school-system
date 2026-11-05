import { useState, type ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ProfileCard = ({
  icon: Icon,
  title,
  children,
}: {
  icon?: LucideIcon;
  title: string;
  children: ReactNode;
}) => (
  <section className="rounded-lg border border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-900 p-4 shadow-sm sm:p-5">
    <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
      {Icon && <Icon className="h-5 w-5 text-blue-700 dark:text-blue-400" />}
      <h2 className="text-lg font-bold text-slate-950 dark:text-slate-100">
        {title}
      </h2>
    </div>
    <div className="pt-4">{children}</div>
  </section>
);

export const ExpandableText = ({
  text,
  maxLength = 260,
}: {
  text: string;
  maxLength?: number;
}) => {
  const [expanded, setExpanded] = useState(false);
  const canExpand = text.length > maxLength;
  const visibleText =
    canExpand && !expanded ? `${text.slice(0, maxLength).trim()}...` : text;

  return (
    <div>
      <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
        {visibleText}
      </p>
      {canExpand && (
        <Button
          type="button"
          variant="link"
          className="mt-1 h-auto p-0 text-blue-700 dark:text-blue-400"
          aria-expanded={expanded}
          onClick={() => setExpanded(current => !current)}
        >
          {expanded ? 'Show less' : 'Show more'}
        </Button>
      )}
    </div>
  );
};

export const ShowAllButton = ({
  expanded,
  total,
  onClick,
}: {
  expanded: boolean;
  total: number;
  onClick: () => void;
}) => (
  <Button
    type="button"
    variant="outline"
    size="sm"
    className="mt-4 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40"
    aria-expanded={expanded}
    onClick={onClick}
  >
    {expanded ? 'Show less' : `Show all ${total}`}
  </Button>
);
