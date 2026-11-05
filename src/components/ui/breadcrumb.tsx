import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  id: string;
  name: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
  homeHref?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  className = '',
  showHome = true,
  homeHref = '/dashboard/admin',
}) => {
  return (
    <nav
      className={cn(
        'flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400',
        className
      )}
      aria-label="Breadcrumb"
    >
      {showHome && (
        <>
          <a
            href={homeHref}
            className="flex items-center hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            <Home className="w-4 h-4" />
          </a>
          <ChevronRight className="w-4 h-4" />
        </>
      )}

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const Icon = item.icon;

        return (
          <React.Fragment key={item.id}>
            {item.href && !isLast ? (
              <a
                href={item.href}
                className="flex items-center hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                {Icon && <Icon className="w-4 h-4 mr-1" />}
                <span>{item.name}</span>
              </a>
            ) : (
              <span className="flex items-center text-gray-900 dark:text-gray-100 font-medium">
                {Icon && <Icon className="w-4 h-4 mr-1" />}
                <span>{item.name}</span>
              </span>
            )}

            {!isLast && <ChevronRight className="w-4 h-4" />}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
