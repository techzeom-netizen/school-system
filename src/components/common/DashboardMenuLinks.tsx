import React from 'react';
import { Link } from 'react-router-dom';
import { UserRole } from '@/types/auth';

export interface MenuItem {
  id: string;
  name: string;
  href?: string;
  icon?: string;
  roles: UserRole[];
  children?: MenuItem[];
}

export interface DashboardMenuLinksProps {
  menuData: MenuItem[];
  title?: string;
  className?: string;
}

const DashboardMenuLinks: React.FC<DashboardMenuLinksProps> = ({
  menuData,
}) => {
  const renderMenuItems = (items: MenuItem[]) => {
    return items.map(item => {
      // Skip items without children (these are likely navigation items, not category items)
      if (!item.children || item.children.length === 0) {
        return null;
      }

      return (
        <div key={item.id} className="rounded-lg p-3 boder border-gray-300 ">
          <h2 className="text-sm font-semibold  mb-3 pb-2 border-b border-gray-300">
            {item.name}
          </h2>
          <ul className="space-y-2">
            {item.children.map(child => (
              <li key={child.id}>
                <Link
                  to={child.href || '#'}
                  className="block text-xs px-2 py-1 rounded transition-colors duration-150"
                >
                  {child.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      );
    });
  };

  return (
    <div className="-m-2  border border-blue-500 bg-for rounded-lg shadow-md p-3 ">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {renderMenuItems(menuData)}
      </div>
    </div>
  );
};

export default DashboardMenuLinks;
