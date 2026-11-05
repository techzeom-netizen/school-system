import React from 'react';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description?: string;
  menuId?: string;
  breadcrumbItems?: Array<{ id: string; name: string; href?: string }>;
  buttonText?: string;
  buttonIcon?: LucideIcon;
  onButtonClick?: () => void;
  buttonVariant?: 'default' | 'outline' | 'ghost' | 'destructive';
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  menuId,
  breadcrumbItems,
  buttonText,
  buttonIcon: ButtonIcon,
  onButtonClick,
  buttonVariant = 'default',
}) => {
  let breadcrumbs: Array<{ id: string; name: string; href?: string }> = [];

  if (breadcrumbItems) {
    breadcrumbs = breadcrumbItems;
  } else if (menuId && title) {
    breadcrumbs = [{ id: menuId, name: title }];
  }

  return (
    <>
      {/* Breadcrumb */}
      {breadcrumbs.length > 0 && (
        <div className="mb-4">
          <Breadcrumb items={breadcrumbs} />
        </div>
      )}

      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="font-bold text-gray-900 dark:text-gray-100">
            {title}
          </h1>
          {description && (
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
        {buttonText && onButtonClick && (
          <Button
            onClick={onButtonClick}
            variant={buttonVariant}
            className="flex items-center gap-2"
          >
            {ButtonIcon && <ButtonIcon className="w-4 h-4" />}
            {buttonText}
          </Button>
        )}
      </div>
    </>
  );
};

export default PageHeader;
