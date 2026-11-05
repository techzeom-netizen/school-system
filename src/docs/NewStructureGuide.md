# Sangamam Frontend - New Structure Guide

This guide explains the new clean structure implemented after removing the sidebar and implementing a header navbar with centralized route management.

## 🏗️ **New Architecture Overview**

### **Key Changes Made:**

1. ✅ **Removed Sidebar** - Replaced with responsive header navbar
2. ✅ **Centralized Route Management** - Clean route configuration system
3. ✅ **Menu Authorization** - Role-based menu filtering
4. ✅ **Clean File Structure** - Better organization and maintainability

---

## 📁 **New File Structure**

```
src/
├── routes/                    # 🆕 Route management system
│   ├── index.ts              # Route exports
│   ├── routeConfig.ts        # Route and menu configuration
│   ├── routeTypes.ts         # TypeScript interfaces
│   ├── routeUtils.ts         # Route utility functions
│   └── AppRoutes.tsx         # Main routing component
├── components/
│   ├── layout/
│   │   └── Navbar.tsx        # 🆕 Header navbar component
│   └── auth/
│       ├── AuthSuspense.tsx  # 🆕 Auth-aware Suspense wrapper
│       └── ...
├── layouts/
│   └── DashboardLayout.tsx   # ✅ Updated to use navbar
├── pages/                    # ✅ Cleaned up
├── contexts/                 # ✅ Removed SidebarContext
└── utils/
    └── roleUtils.ts          # ✅ Updated to avoid duplication
```

---

## 🧭 **Route Management System**

### **1. Route Configuration (`src/routes/routeConfig.ts`)**

```typescript
export const routes: RouteConfig[] = [
  {
    path: '/dashboard/customer',
    element: LazyDashboardPage,
    allowedRoles: [UserRole.CUSTOMER],
    title: 'Customer Dashboard',
    requiresAuth: true
  },
  // ... more routes
];

export const menuItems: MenuItem[] = [
  {
    name: 'Banking',
    icon: <BankingIcon />,
    roles: [UserRole.CUSTOMER, UserRole.BANK_MANAGER],
    children: [
      {
        name: 'Accounts',
        href: '/accounts',
        roles: [UserRole.CUSTOMER, UserRole.BANK_MANAGER]
      }
    ]
  }
];
```

### **2. Route Utilities (`src/routes/routeUtils.ts`)**

```typescript
// Get dashboard path for user role
getRoleDashboardPath(UserRole.CUSTOMER); // '/dashboard/customer'

// Check route permissions
hasRoutePermission('/accounts', UserRole.CUSTOMER); // true

// Get filtered menu items
getFilteredMenuItems(UserRole.CUSTOMER); // Returns only customer-accessible items

// Generate breadcrumbs
generateBreadcrumbs('/accounts', UserRole.CUSTOMER); // Breadcrumb array
```

### **3. Main Routing Component (`src/routes/AppRoutes.tsx`)**

```typescript
const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      <Routes>
        {routes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={renderRoute(route)}
          />
        ))}
      </Routes>
    </Suspense>
  );
};
```

---

## 🧭 **Navbar Component**

### **Features:**

- **Responsive Design** - Works on desktop and mobile
- **Role-Based Menus** - Only shows authorized menu items
- **Dropdown Menus** - Hierarchical navigation with submenus
- **Search Functionality** - Global search bar
- **Theme Toggle** - Dark/light mode switching
- **User Profile** - User info and logout

### **Usage:**

```typescript
import Navbar from '../components/layout/Navbar';

<Navbar onLogout={handleLogout} />
```

### **Menu Structure:**

```
Navbar
├── Logo & Brand
├── Navigation Menu (Role-based)
│   ├── Dashboard
│   ├── Banking
│   │   ├── Accounts
│   │   ├── Transactions
│   │   └── Loans
│   ├── Management
│   │   └── Customers
│   └── Support
│       ├── Help & Support
│       ├── Settings
│       └── Documents
├── Search Bar
├── Notifications
├── Theme Toggle
└── User Profile
```

---

## 🔐 **Authorization System**

### **Menu Authorization:**

```typescript
// Menu items are filtered based on user role
const filteredItems = getFilteredMenuItems(userRole);

// Only show items the user has access to
filteredItems.forEach(item => {
  if (item.roles.includes(userRole)) {
    // Show this menu item
  }
});
```

### **Route Protection:**

```typescript
// Each route defines allowed roles
{
  path: '/customers',
  allowedRoles: [UserRole.BANK_MANAGER, UserRole.TELLER, UserRole.ADMIN],
  requiresAuth: true
}
```

### **Permission Checking:**

```typescript
// Check if user can access a route
const { hasAccess, reason } = validateRouteAccess('/customers', userRole);

if (!hasAccess) {
  // Redirect or show error
}
```

---

## 📱 **Responsive Design**

### **Desktop Navigation:**

- Horizontal navbar with dropdown menus
- Full search bar visible
- User profile dropdown
- Theme toggle and notifications

### **Mobile Navigation:**

- Hamburger menu button
- Collapsible mobile menu
- Touch-friendly interface
- Optimized for small screens

---

## 🚀 **Usage Examples**

### **1. Adding a New Route:**

```typescript
// In routeConfig.ts
{
  path: '/new-feature',
  element: LazyNewFeaturePage,
  allowedRoles: [UserRole.ADMIN],
  title: 'New Feature',
  requiresAuth: true
}
```

### **2. Adding a New Menu Item:**

```typescript
// In routeConfig.ts
{
  name: 'New Feature',
  href: '/new-feature',
  icon: <NewFeatureIcon />,
  roles: [UserRole.ADMIN]
}
```

### **3. Checking Permissions:**

```typescript
import { hasRoutePermission } from '../routes/routeUtils';

if (hasRoutePermission('/admin-panel', userRole)) {
  // User can access admin panel
}
```

---

## 🎯 **Benefits of New Structure**

### **1. Clean Code:**

- ✅ Centralized route configuration
- ✅ Reusable components
- ✅ Type-safe route definitions
- ✅ Consistent authorization patterns

### **2. Better UX:**

- ✅ Responsive navbar design
- ✅ Role-based menu filtering
- ✅ Intuitive navigation
- ✅ Mobile-friendly interface

### **3. Maintainability:**

- ✅ Single source of truth for routes
- ✅ Easy to add new routes/menus
- ✅ Consistent authorization logic
- ✅ Clean file organization

### **4. Performance:**

- ✅ Lazy-loaded route components
- ✅ Optimized bundle splitting
- ✅ Efficient menu filtering
- ✅ Minimal re-renders

---

## 🔄 **Migration Guide**

### **From Old Sidebar to New Navbar:**

**Before:**

```typescript
<Sidebar isOpen={isOpen} onClose={closeSidebar} onLogout={handleLogout} />
```

**After:**

```typescript
<Navbar onLogout={handleLogout} />
```

### **From Hardcoded Routes to Centralized Config:**

**Before:**

```typescript
<Route path="/accounts" element={<AccountsPage />} />
```

**After:**

```typescript
// Routes are automatically generated from routeConfig.ts
{routes.map((route) => (
  <Route key={route.path} path={route.path} element={renderRoute(route)} />
))}
```

---

## 🛠️ **Development Workflow**

### **Adding New Features:**

1. **Add Route** - Update `routeConfig.ts`
2. **Add Menu Item** - Update `menuItems` in `routeConfig.ts`
3. **Set Permissions** - Define `allowedRoles` for the route
4. **Test Authorization** - Verify role-based access works

### **Modifying Navigation:**

1. **Update Menu Structure** - Edit `menuItems` in `routeConfig.ts`
2. **Add Icons** - Include React icon components
3. **Test Responsiveness** - Verify mobile/desktop behavior

---

## 📚 **Additional Resources**

- **Suspense Guide**: `src/docs/SuspenseAndErrorHandling.md`
- **Component Examples**: `src/examples/SuspenseUsageExamples.tsx`
- **Route Types**: `src/routes/routeTypes.ts`
- **Utility Functions**: `src/routes/routeUtils.ts`

---

## 🎉 **Conclusion**

The new structure provides:

- **Clean, maintainable code**
- **Better user experience**
- **Centralized route management**
- **Role-based authorization**
- **Responsive design**

This architecture makes it easy to add new features, manage permissions, and maintain the application over time.
