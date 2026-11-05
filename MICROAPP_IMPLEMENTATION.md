# Microapp Implementation Guide

## 🎯 Architecture Overview

The Sangamam banking application now uses a **true microapp architecture** where each functional module is a self-contained application with its own menu, routes, and components.

## 📁 Project Structure

```
sangamam-frontend/
├── src/
│   ├── microapps/                      # All microapps
│   │   ├── accounting/                 # Accounting microapp
│   │   │   ├── config/menu.ts         # Accounting menu config
│   │   │   ├── pages/                 # Accounting pages
│   │   │   ├── components/            # Accounting components
│   │   │   ├── services/              # Accounting services
│   │   │   ├── AccountingApp.tsx      # Main entry point
│   │   │   └── index.ts               # Exports
│   │   ├── transaction/               # Transaction microapp
│   │   ├── voucher/                   # Voucher microapp
│   │   ├── vendor/                    # Vendor microapp
│   │   ├── bod/                       # BOD microapp
│   │   └── loan/                      # Loan microapp
│   ├── shared/
│   │   ├── config/
│   │   │   ├── adminMenu.ts           # Admin default menu
│   │   │   └── superAdminMenu.ts      # Super admin menu
│   │   ├── registry/
│   │   │   └── menuRegistry.ts        # Dynamic menu loader
│   │   └── types/
│   │       └── menu.ts                # Shared menu types
│   ├── constants/
│   │   └── menu.ts                    # Employee assignable menus
│   └── contexts/
│       └── MenuContext.tsx            # Menu state management
```

## 🔑 Key Concepts

### 1. Role-Based Menu Loading

| Role            | Menu Source         | Description                    |
| --------------- | ------------------- | ------------------------------ |
| **Super Admin** | `superAdminMenu.ts` | Company & admin management     |
| **Admin**       | `adminMenu.ts`      | Company operations & microapps |
| **Employees**   | `menu.ts`           | Assignable by admin            |

### 2. Menu Types

```typescript
// Regular menu item with navigation
{
  id: 'home',
  name: 'Home',
  href: '/dashboard/admin',
  icon: 'Home',
  roles: [UserRole.ADMIN]
}

// Dropdown menu
{
  id: 'company',
  name: 'Company',
  icon: 'Building',
  roles: [UserRole.ADMIN],
  children: [...]
}

// Microapp trigger (complete menu replacement)
{
  id: 'accounting',
  name: 'Accounting',
  icon: 'Calculator',
  roles: [UserRole.ADMIN],
  menuType: 'full-replacement',
  targetMenuId: 'accounting-menu'
}
```

### 3. Microapp Structure

Each microapp follows this pattern:

```typescript
// microapps/accounting/AccountingApp.tsx
const AccountingApp: React.FC = () => {
  const { goToMenu, currentMenu } = useMenu();

  // Switch to accounting menu when loaded
  useEffect(() => {
    if (currentMenu?.id !== 'accounting-menu') {
      goToMenu('accounting-menu');
    }
  }, []);

  return (
    <Routes>
      <Route index element={<AccountingDashboard />} />
      <Route path="groups/*" element={<GroupManagement />} />
      {/* More routes */}
    </Routes>
  );
};
```

## 🚀 How It Works

### Step-by-Step Flow:

1. **User logs in as Admin**
   - `MenuContext` initializes with `adminMenu.ts`
   - Navbar shows: Home | Company | Accounting | Transaction | Voucher | Vendor | BOD

2. **User clicks "Accounting"**
   - `handleMenuItemClick` detects `menuType: 'full-replacement'`
   - Navigates to `/dashboard/admin/accounting`
   - `AccountingApp` component loads
   - `AccountingApp` calls `goToMenu('accounting-menu')`
   - Menu switches to accounting menu items
   - Navbar now shows: Home | Group Management | Manage Ledger | Report

3. **User clicks "Home"**
   - Navigates to `/dashboard/admin`
   - `useDynamicMenu` detects dashboard URL
   - Calls `resetToDefault()`
   - Menu switches back to admin default menu

4. **User logs out**
   - `MenuContext` dispatches `RESET` action
   - Menu state is cleared
   - Next login loads fresh menu for that role

## 🏗️ Adding a New Microapp

### Example: Adding HR Microapp

1. **Create microapp structure**:

```bash
mkdir -p src/microapps/hr/{config,pages,components,services,hooks,types}
```

2. **Create menu config** (`src/microapps/hr/config/menu.ts`):

```typescript
import { UserRole } from '@/types/auth';
import { MicroappMenuConfig, MicroappMenu } from '@/shared/types/menu';

const hrMenu: MicroappMenu = {
  id: 'hr-menu',
  name: 'HR Management',
  microappId: 'hr',
  showBackButton: true,
  backToMenuId: 'admin-default',
  items: [
    {
      id: 'hr-home',
      name: 'Home',
      href: '/dashboard/admin',
      icon: 'Home',
      roles: [UserRole.ADMIN],
    },
    {
      id: 'employee-management',
      name: 'Employee Management',
      href: '/dashboard/admin/hr/employees',
      icon: 'Users',
      roles: [UserRole.ADMIN],
    },
    // More menu items...
  ],
};

export const hrMenuConfig: MicroappMenuConfig = {
  microappId: 'hr',
  microappName: 'HR Management',
  menus: [hrMenu],
  defaultMenuId: 'hr-menu',
  roles: [UserRole.ADMIN],
};

export default hrMenuConfig;
```

3. **Create main component** (`src/microapps/hr/HRApp.tsx`):

```typescript
import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useMenu } from '@/contexts/MenuContext';
import HRDashboard from './pages/HRDashboard';

const HRApp: React.FC = () => {
  const { goToMenu, currentMenu } = useMenu();

  useEffect(() => {
    if (currentMenu?.id !== 'hr-menu') {
      goToMenu('hr-menu');
    }
  }, []);

  return (
    <Routes>
      <Route index element={<HRDashboard />} />
      <Route path="employees" element={<EmployeeManagement />} />
    </Routes>
  );
};

export default HRApp;
```

4. **Export from index** (`src/microapps/hr/index.ts`):

```typescript
export { default as hrMenuConfig } from './config/menu';
export { default as HRApp } from './HRApp';
```

5. **Register in menu registry** (`src/shared/registry/menuRegistry.ts`):

```typescript
import { hrMenuConfig } from '@/microapps/hr';

const menuRegistry: MenuRegistry = {
  // ...existing
  hr: hrMenuConfig,
};
```

6. **Add to admin menu** (`src/shared/config/adminMenu.ts`):

```typescript
{
  id: 'hr',
  name: 'HR',
  icon: 'Users',
  roles: [UserRole.ADMIN],
  menuType: 'full-replacement',
  targetMenuId: 'hr-menu',
}
```

7. **Add route** (`src/routes/AppRoutes.tsx`):

```typescript
import { HRApp } from '@/microapps/hr';

// In admin routes:
<Route path="hr/*" element={<HRApp />} />
```

8. **Add to navbar handler** (`src/components/layout/ModernNavbar.tsx`):

```typescript
const microappRoutes: Record<string, string> = {
  // ...existing
  'hr-menu': '/dashboard/admin/hr',
};
```

9. **Add to URL-based switching** (`src/hooks/useDynamicMenu.ts`):

```typescript
else if (pathname.startsWith('/dashboard/admin/hr')) {
  if (currentMenu?.id === 'hr-menu') return;
  menuContext.goToMenu('hr-menu');
}
```

**Done!** Your HR microapp is now fully integrated.

## 📋 Benefits

✅ **Complete Isolation** - Each microapp is self-contained
✅ **Own Menu** - Each microapp controls its navbar
✅ **Own Routes** - Internal routing within microapp
✅ **Modular** - Easy to add/remove microapps
✅ **Scalable** - Can grow to many microapps
✅ **Maintainable** - Changes to one don't affect others
✅ **Type Safe** - Shared types ensure consistency

## 🎨 User Experience

### Admin Workflow:

1. Login → See admin menu
2. Click microapp (e.g., "Accounting") → Menu changes completely, dashboard loads
3. Navigate within microapp → Same menu persists
4. Click "Home" → Return to admin menu and dashboard
5. Logout → Menu state resets

### Menu Replacement:

- **Before**: `[Home] [Company ▼] [Accounting] [Transaction] [Voucher]`
- **Click Accounting**: `[Home] [Group Management ▼] [Manage Ledger ▼] [Report ▼]`
- **Click Home**: `[Home] [Company ▼] [Accounting] [Transaction] [Voucher]`

## 🔧 Technical Details

### Menu State Management

- Uses React Context (`MenuContext`)
- Menu stack for navigation history
- Automatic menu switching based on URL
- Resets on user logout/login

### Menu Loading Priority

1. If `currentMenu` is set → Use that (microapp active)
2. If Super Admin → Load `superAdminMenu.ts`
3. If Admin → Load `adminMenu.ts`
4. Otherwise → Load from `menu.ts` with role filtering

### Performance Optimizations

- Memoized menu items
- Debounced search
- Ref-based path tracking (prevents infinite loops)
- Early returns for same-path navigation

## 📝 Notes

- All console.logs have been removed from production code
- Unused files have been cleaned up
- Menu conversion is optimized with memoization
- Each microapp can have its own state management
- Microapps are lazy-loadable in the future
