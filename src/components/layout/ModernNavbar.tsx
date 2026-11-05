import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types';
import { getRoleDashboardPath } from '@/utils/roleUtils';
import {
  adminDefaultMenu,
  jobSeekerMenu,
  // recruiterMenu,
  employerMenu,
} from '@/shared/config/adminMenu';
import { superAdminDefaultMenu } from '@/shared/config/superAdminMenu';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  onLogout?: () => void;
}

const ModernNavbar: React.FC<NavbarProps> = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeGrandDropdown, setActiveGrandDropdown] = useState<string | null>(
    null
  );
  const [submenuPositions, setSubmenuPositions] = useState<
    Record<string, { left: string; right: string }>
  >({});
  const [mainDropdownPositions, setMainDropdownPositions] = useState<
    Record<string, { left: string; right: string }>
  >({});

  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const menuItems = useMemo(() => {
    const role = user?.role || UserRole.JOB_SEEKER;
    const menuByRole = {
      [UserRole.SUPER_ADMIN]: superAdminDefaultMenu,
      [UserRole.ADMIN]: adminDefaultMenu,
      [UserRole.JOB_SEEKER]: jobSeekerMenu,
      [UserRole.EMPLOYEE]: employerMenu,
    };

    return menuByRole[role].items.filter(item => item.roles.includes(role));
  }, [user?.role]);

  const getSubmenuPosition = useCallback((buttonElement: HTMLElement) => {
    const buttonRect = buttonElement.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const dropdownWidth = 256; // w-64 = 256px

    // Check if there's enough space on the right
    if (buttonRect.right + dropdownWidth + 20 > viewportWidth) {
      return { left: 'auto', right: '100%' };
    }

    return { left: '100%', right: 'auto' };
  }, []);

  const getMainDropdownPosition = useCallback((buttonElement: HTMLElement) => {
    const buttonRect = buttonElement.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const dropdownWidth = 256; // w-64 = 256px

    // Check if dropdown would go off the left edge
    if (buttonRect.left < 20) {
      return { left: '0', right: 'auto' };
    }

    // Check if dropdown would go off the right edge
    if (buttonRect.right + dropdownWidth > viewportWidth - 20) {
      return { left: 'auto', right: '0' };
    }

    // Default: align to left edge of button
    return { left: '0', right: 'auto' };
  }, []);

  const navigationItems = useMemo(() => {
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

  const handleDropdownEnter = useCallback(
    (itemId: string, buttonElement: HTMLElement) => {
      // Clear any pending close timeout
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
        dropdownTimeoutRef.current = null;
      }

      setActiveDropdown(itemId);
      setActiveGrandDropdown(null); // Close grand dropdown when main dropdown changes

      // Calculate main dropdown position immediately when opening
      const position = getMainDropdownPosition(buttonElement);
      setMainDropdownPositions(prev => ({
        ...prev,
        [itemId]: position,
      }));
    },
    [getMainDropdownPosition]
  );

  const handleDropdownLeave = useCallback(() => {
    // Set a small delay before closing to allow moving to dropdown
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
      setActiveGrandDropdown(null);
    }, 150); // Reduced delay for better UX
  }, []);

  const handleGrandDropdownEnter = useCallback(
    (itemId: string, buttonElement: HTMLElement) => {
      // Clear any pending close timeout
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
        dropdownTimeoutRef.current = null;
      }

      setActiveGrandDropdown(itemId);

      // Calculate position immediately when opening
      const position = getSubmenuPosition(buttonElement);
      setSubmenuPositions(prev => ({
        ...prev,
        [itemId]: position,
      }));
    },
    [getSubmenuPosition]
  );

  const handleGrandDropdownLeave = useCallback(() => {
    // Set a small delay before closing to allow moving to submenu
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveGrandDropdown(null);
    }, 150);
  }, []);

  const handleDropdownContainerEnter = useCallback(() => {
    // Clear any pending close timeout when entering dropdown container
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
  }, []);

  const handleDropdownContainerLeave = useCallback(() => {
    // Close dropdown when leaving the container
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
      setActiveGrandDropdown(null);
    }, 150);
  }, []);

  const closeAllDropdowns = useCallback(() => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setActiveDropdown(null);
    setActiveGrandDropdown(null);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

  return (
    <TooltipProvider>
      <nav className="fixed top-12 left-0 right-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container-responsive">
          <div className="full-width-container border-t border-border/50 bg-navbar-bg min-h-[44px]">
            <div className="container-responsive">
              {/* Desktop Navigation */}
              <div
                ref={dropdownRef}
                className="hidden md:flex items-center space-x-1 lg:space-x-2 py-1 min-h-[44px]"
              >
                {navigationItems.map(item => (
                  <div key={item.id} className="relative">
                    {item.children ? (
                      <div
                        className="relative"
                        onMouseLeave={handleDropdownLeave}
                      >
                        <button
                          onMouseEnter={e =>
                            handleDropdownEnter(item.id, e.currentTarget)
                          }
                          className={`flex items-center px-1.5 py-2 text-xs font-medium rounded-md transition-all duration-200 ${
                            activeDropdown === item.id
                              ? 'text-navbar-text-hover bg-navbar-bg-hover'
                              : 'text-navbar-text hover:text-navbar-text-hover hover:bg-navbar-bg-hover'
                          }`}
                        >
                          {item.name}
                        </button>

                        {activeDropdown === item.id && item.children && (
                          <div
                            className="absolute top-full mt-0 w-52 bg-background border border-border rounded-lg shadow-xl z-50 dropdown-enter-active"
                            style={{
                              left: mainDropdownPositions[item.id]?.left || '0',
                              right:
                                mainDropdownPositions[item.id]?.right || 'auto',
                            }}
                            onMouseEnter={handleDropdownContainerEnter}
                            onMouseLeave={handleDropdownContainerLeave}
                          >
                            <div className="p-2">
                              {item.children.map(child => {
                                const isActive =
                                  location.pathname === child.href;
                                return (
                                  <div key={child.id} className="relative">
                                    {child.children ? (
                                      <div
                                        className="relative"
                                        onMouseLeave={handleGrandDropdownLeave}
                                      >
                                        <button
                                          onMouseEnter={e =>
                                            handleGrandDropdownEnter(
                                              child.id,
                                              e.currentTarget
                                            )
                                          }
                                          className="flex items-center justify-between w-full px-3 py-1.5 text-xs hover:bg-accent rounded-md transition-colors text-left"
                                        >
                                          <span>{child.name}</span>
                                          <svg
                                            className={`h-3 w-3 arrow-transition ${activeGrandDropdown === child.id ? 'arrow-rotate-90' : ''}`}
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

                                        {activeGrandDropdown === child.id && (
                                          <div
                                            className="absolute top-0 ml-0 w-64 bg-background border border-border rounded-lg shadow-xl z-60 dropdown-enter-active"
                                            style={{
                                              left:
                                                submenuPositions[child.id]
                                                  ?.left || '100%',
                                              right:
                                                submenuPositions[child.id]
                                                  ?.right || 'auto',
                                            }}
                                            onMouseEnter={
                                              handleDropdownContainerEnter
                                            }
                                            onMouseLeave={
                                              handleGrandDropdownLeave
                                            }
                                          >
                                            <div className="p-2">
                                              {child.children.map(
                                                grandChild => {
                                                  const isGrandActive =
                                                    location.pathname ===
                                                    grandChild.href;
                                                  return (
                                                    <Link
                                                      key={grandChild.id}
                                                      to={
                                                        grandChild.href || '#'
                                                      }
                                                      onClick={
                                                        closeAllDropdowns
                                                      }
                                                      className={`block px-2 py-1.5 text-xs hover:bg-accent rounded-md transition-colors ${
                                                        isGrandActive
                                                          ? 'bg-accent text-accent-foreground'
                                                          : 'text-foreground'
                                                      }`}
                                                    >
                                                      {grandChild.name}
                                                    </Link>
                                                  );
                                                }
                                              )}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    ) : (
                                      <Link
                                        to={child.href || '#'}
                                        onClick={closeAllDropdowns}
                                        className={`block px-3 py-1.5 text-xs hover:bg-accent rounded-md transition-colors ${
                                          isActive
                                            ? 'bg-accent text-accent-foreground'
                                            : 'text-foreground'
                                        }`}
                                      >
                                        {child.name}
                                      </Link>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link
                        to={item.href || '#'}
                        className={`flex items-center px-1.5 py-2 text-xs font-medium rounded-md transition-all duration-200 ${
                          location.pathname === item.href
                            ? 'text-navbar-text-hover bg-navbar-bg-hover border-b-2 border-navbar-text-hover'
                            : 'text-navbar-text hover:text-navbar-text-hover hover:bg-navbar-bg-hover'
                        }`}
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
              </div>

              {/* Mobile Navigation */}
              <div ref={mobileMenuRef} className="md:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="flex items-center justify-between w-full py-3 px-2 text-xs font-medium text-navbar-text hover:bg-navbar-bg-hover rounded-md transition-colors"
                >
                  <span>Menu</span>
                  {isMobileMenuOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </button>

                {isMobileMenuOpen && (
                  <div className="py-3 space-y-1 border-t border-border/50">
                    {navigationItems.map(item => (
                      <div key={item.id}>
                        {item.children ? (
                          <div>
                            <button
                              onClick={e =>
                                handleDropdownEnter(item.id, e.currentTarget)
                              }
                              className={`flex items-center justify-between w-full py-2 px-1.5 text-xs rounded-md transition-colors ${
                                activeDropdown === item.id
                                  ? 'text-navbar-text-hover bg-navbar-bg-hover'
                                  : 'text-navbar-text hover:text-navbar-text-hover hover:bg-navbar-bg-hover'
                              }`}
                            >
                              <div className="flex items-center justify-between w-full">
                                <span>{item.name}</span>
                              </div>
                            </button>

                            {activeDropdown === item.id && (
                              <div className="pl-4 space-y-1 mt-2">
                                {item.children.map(child => {
                                  const isActive =
                                    location.pathname === child.href;
                                  return (
                                    <div key={child.id}>
                                      {child.children ? (
                                        <div>
                                          <button
                                            type="button"
                                            onClick={e => {
                                              e.preventDefault();
                                              e.stopPropagation();
                                              handleGrandDropdownEnter(
                                                child.id,
                                                e.currentTarget
                                              );
                                            }}
                                            className={`flex items-center justify-between w-full py-2 px-1.5 text-xs font-medium rounded-md transition-colors ${
                                              activeGrandDropdown === child.id
                                                ? 'text-navbar-text-hover bg-accent/50'
                                                : 'text-navbar-text-hover hover:text-primary hover:bg-accent/30'
                                            }`}
                                          >
                                            <span>{child.name}</span>
                                            <svg
                                              className={`h-3 w-3 arrow-transition ${activeGrandDropdown === child.id ? 'arrow-rotate-90' : ''}`}
                                              fill="none"
                                              stroke="currentColor"
                                              viewBox="0 0 24 24"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 5l7 7-7-7"
                                              />
                                            </svg>
                                          </button>

                                          {activeGrandDropdown === child.id && (
                                            <div className="pl-4 space-y-1 mt-2">
                                              {child.children.map(
                                                grandChild => {
                                                  const isGrandActive =
                                                    location.pathname ===
                                                    grandChild.href;
                                                  return (
                                                    <Link
                                                      key={grandChild.id}
                                                      to={
                                                        grandChild.href || '#'
                                                      }
                                                      onClick={e => {
                                                        if (
                                                          !grandChild.href ||
                                                          grandChild.href ===
                                                            '#'
                                                        ) {
                                                          e.preventDefault();
                                                          return;
                                                        }
                                                        setIsMobileMenuOpen(
                                                          false
                                                        );
                                                        closeAllDropdowns();
                                                      }}
                                                      className={`block py-2 px-1.5 text-xs rounded-md transition-colors ${
                                                        isGrandActive
                                                          ? 'text-navbar-text-hover bg-accent/30'
                                                          : 'text-navbar-text-hover hover:text-primary hover:bg-accent/20'
                                                      }`}
                                                    >
                                                      {grandChild.name}
                                                    </Link>
                                                  );
                                                }
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      ) : (
                                        <Link
                                          to={child.href || '#'}
                                          onClick={e => {
                                            if (
                                              !child.href ||
                                              child.href === '#'
                                            ) {
                                              e.preventDefault();
                                              return;
                                            }
                                            e.stopPropagation();
                                            setIsMobileMenuOpen(false);
                                            closeAllDropdowns();
                                          }}
                                          className={`block py-2 px-1.5 text-xs rounded-md transition-colors relative z-20 cursor-pointer ${
                                            isActive
                                              ? 'text-navbar-text-hover bg-accent/30'
                                              : 'text-navbar-text-hover hover:text-primary hover:bg-accent/20'
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
                            onClick={e => {
                              if (!item.href || item.href === '#') {
                                e.preventDefault();
                                return;
                              }
                              setIsMobileMenuOpen(false);
                              closeAllDropdowns();
                            }}
                            className={`flex items-center py-2 px-1.5 text-xs font-medium rounded-md transition-colors ${
                              location.pathname === item.href
                                ? 'text-navbar-text-hover bg-navbar-bg-hover'
                                : 'text-navbar-text hover:text-navbar-text-hover hover:bg-navbar-bg-hover'
                            }`}
                          >
                            {item.name}
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </TooltipProvider>
  );
};

export default ModernNavbar;
