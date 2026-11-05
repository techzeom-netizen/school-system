import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types';
import JobSeekerDashboardLayout from '../layouts/JobSeekerDashboardLayout';

const LoadingPage = () => (
  <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-slate-950 text-sm font-medium text-gray-600 dark:text-slate-300">
    Loading...
  </div>
);

const ProtectedJobSeekerRoute = () => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  if (user.role !== UserRole.JOB_SEEKER) {
    return <Navigate to="/login" replace />;
  }

  return (
    <JobSeekerDashboardLayout>
      <Outlet />
    </JobSeekerDashboardLayout>
  );
};

export default ProtectedJobSeekerRoute;
