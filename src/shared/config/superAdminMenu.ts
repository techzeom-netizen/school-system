import { UserRole } from '@/types/auth';
import { AppMenu } from '@/types/menu';

export const superAdminDefaultMenu: AppMenu = {
  id: 'super-admin-default',
  name: 'Super Admin Dashboard',
  isDefault: true,
  items: [
    {
      id: 'home',
      name: 'Dashboard',
      href: '/dashboard/super-admin',
      icon: 'Home',
      roles: [UserRole.SUPER_ADMIN],
    },
    {
      id: 'platform-users',
      name: 'Users',
      href: '/dashboard/super-admin/users',
      icon: 'Users',
      roles: [UserRole.SUPER_ADMIN],
    },
    {
      id: 'companies',
      name: 'Companies',
      href: '/dashboard/super-admin/companies',
      icon: 'Building',
      roles: [UserRole.SUPER_ADMIN],
    },
    {
      id: 'company-approvals',
      name: 'Company Approvals',
      href: '/dashboard/super-admin/company-approvals',
      icon: 'CheckCircle',
      roles: [UserRole.SUPER_ADMIN],
    },
    {
      id: 'jobs',
      name: 'Jobs',
      href: '/dashboard/super-admin/jobs',
      icon: 'Briefcase',
      roles: [UserRole.SUPER_ADMIN],
    },
  ],
};

export default superAdminDefaultMenu;
