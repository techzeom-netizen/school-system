import React from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { LucideIcon } from 'lucide-react';

interface SectionProps {
  title?: string; // Made optional
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  menuId?: string;
  breadcrumbItems?: Array<{ id: string; name: string; href?: string }>;
  showBreadcrumbs?: boolean;
  buttonText?: string;
  buttonIcon?: LucideIcon;
  onButtonClick?: () => void;
  buttonVariant?: 'default' | 'outline' | 'ghost' | 'destructive';
  icon?: LucideIcon; // New prop for title icon
}

const Section: React.FC<SectionProps> = ({
  title,
  children,
  className = '',
  headerClassName = '',
  contentClassName = '',
  menuId,
  breadcrumbItems,
  showBreadcrumbs = false,
  buttonText,
  buttonIcon: ButtonIcon,
  onButtonClick,
  buttonVariant = 'default',
  icon: TitleIcon, // New prop for title icon
}) => {
  let breadcrumbs: Array<{ id: string; name: string; href?: string }> = [];

  if (showBreadcrumbs) {
    if (breadcrumbItems) {
      breadcrumbs = breadcrumbItems;
    } else if (menuId && title) {
      breadcrumbs = [{ id: menuId, name: title }];
    }
  }

  // Determine content background based on menuId presence
  const contentBackgroundClass = menuId ? '' : 'bg-gray- dark:bg-gray00';

  // Check if we should show the header (blue bar)
  const shouldShowHeader = title || menuId || TitleIcon;

  return (
    <>
      {(breadcrumbs.length > 0 || (buttonText && onButtonClick)) && (
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="flex-1">
            {breadcrumbs.length > 0 && <Breadcrumb items={breadcrumbs} />}
          </div>
          {buttonText && onButtonClick && (
            <Button
              onClick={onButtonClick}
              variant={buttonVariant}
              className="flex items-center gap-2 ml-auto"
            >
              {ButtonIcon && <ButtonIcon className="w-4 h-4" />}
              {buttonText}
            </Button>
          )}
        </div>
      )}

      <Card className={`overflow-hidden rounded-none ${className}`}>
        {shouldShowHeader && (
          <CardHeader
            className={`bg-navbar-bg text-navbar-text p-2 ${headerClassName}`}
          >
            <CardTitle className="text-sm font-semibold uppercase text-navbar-text flex items-center gap-2">
              {TitleIcon && <TitleIcon className="w-4 h-4" />}
              {title}
            </CardTitle>
          </CardHeader>
        )}
        <CardContent
          className={`p-6 ${contentBackgroundClass} ${contentClassName}`}
        >
          {children}
        </CardContent>
      </Card>
    </>
  );
};

export default Section;
