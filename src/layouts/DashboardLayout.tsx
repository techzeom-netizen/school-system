import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types';
import ModernNavbar from '@/components/layout/ModernNavbar';
import Footer from '@/components/layout/Footer';
import { useLayout } from '@/hooks/useLayout';
import VerticalNavbar from '@/components/layout/VerticalNavbar';
import TopNavbar from '@/components/layout/TopNavbar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  showNavigation = true,
}) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isVertical } = useLayout();

  const handleLogout = async () => {
    let logoutPath = '/login';
    if (user?.role === UserRole.COMPANY_ADMIN) {
      logoutPath = '/employer';
    } else if (user?.role === UserRole.SUPER_ADMIN) {
      logoutPath = '/superadmin/login';
    }

    await navigate(logoutPath, { replace: true });
    await logout();
  };

  useEffect(() => {
    document.body.classList.add('dashboard-layout');
    document.body.classList.toggle('vertical-layout', isVertical);

    return () => {
      document.body.classList.remove('dashboard-layout', 'vertical-layout');
    };
  }, [isVertical]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* TopNavbar - Always fixed at top */}
      <TopNavbar onLogout={handleLogout} />

      {/* 
        Padding offset for fixed navbars:
        - Vertical mode: pt-12 (TopNavbar h-12 = 48px)
        - Horizontal mode: pt-24 (TopNavbar 48px + ModernNavbar 44px ≈ 96px)
      */}
      <div
        className={`flex flex-1 ${
          isVertical
            ? 'flex-row pt-12'
            : showNavigation
              ? 'flex-col pt-24'
              : 'flex-col pt-12'
        }`}
      >
        {/* Main Navigation */}
        {showNavigation && isVertical ? (
          <VerticalNavbar onLogout={handleLogout} />
        ) : showNavigation ? (
          <ModernNavbar onLogout={handleLogout} />
        ) : null}

        {/* Main Content Area */}
        <div
          className={`flex-1 flex flex-col ${showNavigation && isVertical ? 'ml-64' : ''}`}
        >
          <main className="flex-1 bg-gray-50 dark:bg-gray-900">
            <div className="container-responsive p-6">{children}</div>
          </main>

          {/* Footer - Only in horizontal mode */}
          {showNavigation && !isVertical && <Footer />}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
