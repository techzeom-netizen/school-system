import React from 'react';
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types';
import { getRoleDashboardPath } from '@/utils/roleUtils';
import { getJobSeekerProfilePath } from '@/features/jobseekers/config/jobSeekerNavigation';
import DashboardLayout from '@/layouts/DashboardLayout';
import PublicLayout from '@/layouts/PublicLayout';
import LoginPage from '@/pages/LoginPage';
import SuperAdminLoginPage from '@/pages/SuperAdminLoginPage';
import DashboardPage from '@/pages/DashboardPage';
import WebsiteApp, { NotFoundPage } from '@/pages/WebsiteApp';
import { employerRoutes } from '@/pages/employer';
import CompanyRegistrationPage from '@/pages/admin/CompanyRegistrationPage';
import CompanyApprovalRequestsPage from '@/pages/superadmin/CompanyApprovalRequestsPage';

const dashboardRoles = [
  UserRole.SUPER_ADMIN,
  UserRole.COMPANY_ADMIN,
  UserRole.JOB_SEEKER,
  UserRole.EMPLOYEE,
];

const DashboardRedirect: React.FC = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (user.role === UserRole.ADMIN && user.isRegisterComplete !== true) {
    return <Navigate to="/dashboard/admin/register-company" replace />;
  }

  if (user.role === UserRole.JOB_SEEKER) {
    return <Navigate to={getJobSeekerProfilePath(user)} replace />;
  }

  if (user.role === UserRole.EMPLOYEE) {
    return <Navigate to="/dashboard/employer" replace />;
  }

  return <Navigate to={getRoleDashboardPath(user.role)} replace />;
};

const JobSeekerDashboardRedirect: React.FC = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  return <Navigate to={getJobSeekerProfilePath(user)} replace />;
};

const SuperAdminDashboardContent: React.FC = () => {
  const location = useLocation();

  if (location.pathname.endsWith('/super-admin/company-approvals')) {
    return <CompanyApprovalRequestsPage />;
  }

  return <DashboardPage />;
};

const AdminDashboardGuard: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const isCompanyRegistration = location.pathname.endsWith(
    '/admin/register-company'
  );

  if (user?.isRegisterComplete !== true && !isCompanyRegistration) {
    return <Navigate to="/dashboard/admin/register-company" replace />;
  }

  if (user?.isRegisterComplete === true && isCompanyRegistration) {
    return <Navigate to="/dashboard/admin" replace />;
  }

  if (isCompanyRegistration) {
    return (
      <DashboardLayout showNavigation={false}>
        <CompanyRegistrationPage />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardPage />
    </DashboardLayout>
  );
};

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <PublicLayout>{children}</PublicLayout>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/superadmin/login" element={<SuperAdminLoginPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={dashboardRoles}>
            <Outlet />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardRedirect />} />
        <Route path="redirect" element={<DashboardRedirect />} />

        <Route
          path="super-admin/*"
          element={
            <ProtectedRoute allowedRoles={[UserRole.SUPER_ADMIN]}>
              <DashboardLayout>
                <SuperAdminDashboardContent />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/*"
          element={
            <ProtectedRoute allowedRoles={[UserRole.COMPANY_ADMIN]}>
              <AdminDashboardGuard />
            </ProtectedRoute>
          }
        />
        <Route
          path="job-seeker/*"
          element={
            <ProtectedRoute allowedRoles={[UserRole.JOB_SEEKER]}>
              <JobSeekerDashboardRedirect />
            </ProtectedRoute>
          }
        />
        <Route
          path="recruiter/*"
          element={
            <ProtectedRoute allowedRoles={[UserRole.EMPLOYEE]}>
              <DashboardLayout>
                <DashboardPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="employer"
          element={
            <ProtectedRoute allowedRoles={[UserRole.EMPLOYEE]}>
              <DashboardLayout>
                <Outlet />
              </DashboardLayout>
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          {employerRoutes}
          <Route path="*" element={<DashboardPage />} />
        </Route>
      </Route>

      <Route
        path="/*"
        element={
          <PublicRoute>
            <WebsiteApp />
          </PublicRoute>
        }
      />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
