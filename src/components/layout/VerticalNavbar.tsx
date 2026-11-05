import React, { useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types';
import { MenuItem } from '@/types/menu';
import { getRoleDashboardPath } from '@/utils/roleUtils';
import {
  adminDefaultMenu,
  jobSeekerMenu,
  employerMenu,
} from '@/shared/config/adminMenu';
import { superAdminDefaultMenu } from '@/shared/config/superAdminMenu';
import { ChevronRight, ChevronDown } from 'lucide-react';

interface VerticalNavbarProps {
  onLogout?: () => void;
}

const VerticalNavbar: React.FC<VerticalNavbarProps> = () => {
  const { user } = useAuth();
  const location = useLocation();
  const menuItems = React.useMemo(() => {
    const role = user?.role || UserRole.JOB_SEEKER;
    const menuByRole = {
      [UserRole.SUPER_ADMIN]: superAdminDefaultMenu,
      [UserRole.ADMIN]: adminDefaultMenu,
      [UserRole.JOB_SEEKER]: jobSeekerMenu,
      [UserRole.EMPLOYEE]: employerMenu,
    };

    return menuByRole[role].items.filter(item => item.roles.includes(role));
  }, [user?.role]);

  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [expandedGrandItems, setExpandedGrandItems] = useState<Set<string>>(
    new Set()
  );

  const navigationItems = React.useMemo(() => {
    return menuItems.map(item => {
      if (item.id === 'home') {
        return {
          ...item,
          href: getRoleDashboardPath(user?.role || UserRole.JOB_SEEKER),
        };
      }
      return item;
    });
  }, [menuItems, user?.role]);

  const toggleItem = useCallback(
    (itemId: string) => {
      setExpandedItems(prev => {
        const newSet = new Set(prev);
        if (newSet.has(itemId)) {
          newSet.delete(itemId);
          // Also close any grand children
          setExpandedGrandItems(prevGrand => {
            const newGrandSet = new Set(prevGrand);
            navigationItems
              .find(item => item.id === itemId)
              ?.children?.forEach(child => newGrandSet.delete(child.id));
            return newGrandSet;
          });
        } else {
          newSet.add(itemId);
        }
        return newSet;
      });
    },
    [navigationItems]
  );

  const toggleGrandItem = useCallback((itemId: string) => {
    setExpandedGrandItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  }, []);

  const isItemActive = useCallback(
    (itemHref: string | undefined) => {
      return itemHref ? location.pathname === itemHref : false;
    },
    [location.pathname]
  );

  const hasActiveChild = useCallback(
    (children: MenuItem[]) => {
      return children.some(child => {
        if (child.children) {
          return (
            child.children.some(grandChild => isItemActive(grandChild.href)) ||
            isItemActive(child.href)
          );
        }
        return isItemActive(child.href);
      });
    },
    [isItemActive]
  );

  return (
    <div className="fixed left-0 top-12 h-[calc(100vh-3rem)] w-64 bg-navbar-bg border-r border-border flex flex-col z-40 navbar-transition">
      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto py-4 scrollbar-navbar">
        <nav className="space-y-1 px-3">
          {navigationItems.map(item => {
            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = expandedItems.has(item.id);
            const isActive = isItemActive(item.href);
            const hasActiveChildren =
              hasChildren && hasActiveChild(item.children!);

            return (
              <div key={item.id} className="relative">
                {hasChildren ? (
                  <div>
                    <button
                      onClick={() => toggleItem(item.id)}
                      className={`flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                        isActive || hasActiveChildren || isExpanded
                          ? 'text-navbar-text bg-navbar-bg-hover'
                          : 'text-navbar-text hover:text-navbar-text-hover hover:bg-navbar-bg-hover'
                      }`}
                    >
                      <span>{item.name}</span>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {isExpanded && (
                      <div className="mt-1 space-y-1 pl-4">
                        {item.children!.map(child => {
                          const hasGrandChildren =
                            child.children && child.children.length > 0;
                          const isGrandExpanded = expandedGrandItems.has(
                            child.id
                          );
                          const isChildActive = isItemActive(child.href);
                          const hasActiveGrandChildren =
                            hasGrandChildren && hasActiveChild(child.children!);

                          return (
                            <div key={child.id}>
                              {hasGrandChildren ? (
                                <div>
                                  <button
                                    onClick={() => toggleGrandItem(child.id)}
                                    className={`flex items-center justify-between w-full px-3 py-2 text-sm rounded-md transition-colors ${
                                      isChildActive ||
                                      hasActiveGrandChildren ||
                                      isGrandExpanded
                                        ? 'text-navbar-text bg-navbar-bg-hover/70'
                                        : 'text-navbar-text/90 hover:text-navbar-text hover:bg-navbar-bg-hover/50'
                                    }`}
                                  >
                                    <span>{child.name}</span>
                                    <ChevronRight
                                      className={`h-3 w-3 transition-transform duration-200 ${
                                        isGrandExpanded ? 'rotate-90' : ''
                                      }`}
                                    />
                                  </button>

                                  {isGrandExpanded && (
                                    <div className="mt-1 space-y-1 pl-4">
                                      {child.children!.map(grandChild => {
                                        const isGrandChildActive = isItemActive(
                                          grandChild.href
                                        );
                                        return (
                                          <Link
                                            key={grandChild.id}
                                            to={grandChild.href || '#'}
                                            className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                                              isGrandChildActive
                                                ? 'text-navbar-text bg-navbar-bg-hover/50'
                                                : 'text-navbar-text/80 hover:text-navbar-text hover:bg-navbar-bg-hover/30'
                                            }`}
                                          >
                                            {grandChild.name}
                                          </Link>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <Link
                                  to={child.href || '#'}
                                  className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                                    isChildActive
                                      ? 'text-navbar-text bg-navbar-bg-hover/50'
                                      : 'text-navbar-text/80 hover:text-navbar-text hover:bg-navbar-bg-hover/30'
                                  }`}
                                >
                                  {child.name}
                                </Link>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.href || '#'}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                      isActive
                        ? 'text-navbar-text bg-navbar-bg-hover'
                        : 'text-navbar-text hover:text-navbar-text-hover hover:bg-navbar-bg-hover'
                    }`}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default VerticalNavbar;
