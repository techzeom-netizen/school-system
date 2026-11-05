import React from 'react';

interface DashboardSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
}

const DashboardSection: React.FC<DashboardSectionProps> = ({
  title,
  children,
  className = '',
  headerClassName = '',
  contentClassName = '',
}) => {
  return (
    <div className={`mb-8 ${className}`}>
      <div className={`mb-6 ${headerClassName}`}>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {title}
        </h2>
      </div>
      <div className={contentClassName}>{children}</div>
    </div>
  );
};

export default DashboardSection;
