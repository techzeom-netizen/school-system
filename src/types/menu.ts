import { UserRole } from './auth';

export interface MenuItem {
  id: string;
  name: string;
  href?: string;
  icon: string;
  roles: UserRole[];
  badge?: string;
  children?: MenuItem[];
  isVisible?: boolean;
  isEnabled?: boolean;
  order?: number;
  description?: string;
  keywords?: string[];
  permissions?: string[];
  external?: boolean;
  target?: '_blank' | '_self';
}

export interface AppMenu {
  id: string;
  name: string;
  items: MenuItem[];
  isDefault?: boolean;
}
