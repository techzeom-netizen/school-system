import { UserRole } from '../types';

export const getRoleDisplayName = (role: UserRole): string => {
  const roleNames: Record<UserRole, string> = {
    [UserRole.SUPER_ADMIN]: 'Super Administrator',
    [UserRole.COMPANY_ADMIN]: 'Company Admin',
    [UserRole.JOB_SEEKER]: 'Jobseeker',
    [UserRole.EMPLOYEE]: 'Employee',
  };

  return roleNames[role];
};

export const getRoleDashboardPath = (role: UserRole): string => {
  const dashboardPaths: Record<UserRole, string> = {
    [UserRole.SUPER_ADMIN]: '/dashboard/super-admin',
    [UserRole.COMPANY_ADMIN]: '/dashboard/admin',
    [UserRole.JOB_SEEKER]: '/jobseekers',
    [UserRole.EMPLOYEE]: '/dashboard/employer',
  };

  return dashboardPaths[role] || '/jobseekers';
};

export const hasPermission = (
  userRole: UserRole,
  requiredRole: UserRole
): boolean => {
  const roleHierarchy: Record<UserRole, number> = {
    [UserRole.JOB_SEEKER]: 1,
    [UserRole.EMPLOYEE]: 2,
    [UserRole.COMPANY_ADMIN]: 4,
    [UserRole.SUPER_ADMIN]: 5,
  };

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
};

export const canAccessCandidateData = (userRole: UserRole): boolean => {
  const allowedRoles: UserRole[] = [
    UserRole.EMPLOYEE,
    UserRole.COMPANY_ADMIN,
    UserRole.SUPER_ADMIN,
  ];

  return allowedRoles.includes(userRole);
};

export const canManageUsers = (userRole: UserRole): boolean => {
  const allowedRoles: UserRole[] = [
    UserRole.EMPLOYEE,
    UserRole.COMPANY_ADMIN,
    UserRole.SUPER_ADMIN,
  ];

  return allowedRoles.includes(userRole);
};

export const canViewAuditLogs = (userRole: UserRole): boolean => {
  const allowedRoles: UserRole[] = [
    UserRole.COMPANY_ADMIN,
    UserRole.SUPER_ADMIN,
  ];

  return allowedRoles.includes(userRole);
};
