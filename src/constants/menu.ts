import { UserRole } from '../types';

/**
 * Menu Item Interface for Dynamic Menu System
 */
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

/**
 * Menu Configuration Interface
 */
export interface MenuConfig {
  id: string;
  name: string;
  icon: string;
  roles: UserRole[];
  badge?: string;
  isVisible: boolean;
  isEnabled: boolean;
  order: number;
  description?: string;
  children?: MenuItem[];
}

/**
 * Complete Menu Configuration
 * Fully dynamic, nested multilayer menu system
 */

/**
 * Menu Utility Functions
 */

// Performance optimization: Cache for filtered menu items by role
const menuCache = new Map<UserRole, MenuItem[]>();
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes
const cacheTimestamps = new Map<UserRole, number>();

/**
 * Check if user has access to menu item
 */
const hasAccessToItem = (item: MenuItem, userRole: UserRole): boolean => {
  return (
    item.roles.includes(userRole) &&
    item.isVisible !== false &&
    item.isEnabled !== false
  );
};

/**
 * Recursively filter menu items with optimized performance
 */
const filterMenuItemsRecursive = (
  items: MenuItem[],
  userRole: UserRole
): MenuItem[] => {
  const filtered: MenuItem[] = [];

  for (const item of items) {
    if (!hasAccessToItem(item, userRole)) continue;

    const filteredItem: MenuItem = {
      ...item,
      children: undefined,
    };

    // Only process children if they exist
    if (item.children && item.children.length > 0) {
      const filteredChildren = filterMenuItemsRecursive(
        item.children,
        userRole
      );
      if (filteredChildren.length > 0) {
        filteredItem.children = filteredChildren.sort(
          (a, b) => (a.order || 0) - (b.order || 0)
        );
      }
    }

    filtered.push(filteredItem);
  }

  return filtered.sort((a, b) => (a.order || 0) - (b.order || 0));
};

/**
 * Get filtered menu items based on user role (optimized with caching)
 */
export const getFilteredMenuItems = (
  userRole: UserRole,
  menuItems: MenuItem[]
): MenuItem[] => {
  // Check cache first
  const cached = menuCache.get(userRole);
  const timestamp = cacheTimestamps.get(userRole);

  if (cached && timestamp && Date.now() - timestamp < CACHE_EXPIRY) {
    return cached;
  }

  // Generate filtered menu items
  const filteredItems = filterMenuItemsRecursive(menuItems, userRole);

  // Cache the result
  menuCache.set(userRole, filteredItems);
  cacheTimestamps.set(userRole, Date.now());

  return filteredItems;
};

/**
 * Clear menu cache (useful for development or when menu structure changes)
 */
export const clearMenuCache = (userRole?: UserRole): void => {
  if (userRole) {
    menuCache.delete(userRole);
    cacheTimestamps.delete(userRole);
  } else {
    menuCache.clear();
    cacheTimestamps.clear();
  }
};

/**
 * Find menu item by ID
 */
export const findMenuItemById = (
  menuItems: MenuItem[],
  id: string
): MenuItem | null => {
  for (const item of menuItems) {
    if (item.id === id) return item;
    if (item.children) {
      const found = findMenuItemById(item.children, id);
      if (found) return found;
    }
  }
  return null;
};

/**
 * Get breadcrumb path for a menu item
 */
export const getBreadcrumbPath = (
  menuItems: MenuItem[],
  targetId: string
): MenuItem[] => {
  const path: MenuItem[] = [];

  const findPath = (items: MenuItem[], id: string): boolean => {
    for (const item of items) {
      path.push(item);
      if (item.id === id) return true;
      if (item.children && findPath(item.children, id)) return true;
      path.pop();
    }
    return false;
  };

  findPath(menuItems, targetId);
  return path;
};

// Performance optimization: Search cache
const searchCache = new Map<string, MenuItem[]>();
const searchCacheTimestamps = new Map<string, number>();
const SEARCH_CACHE_EXPIRY = 2 * 60 * 1000; // 2 minutes

/**
 * Search menu items by keywords (optimized with caching)
 */
export const searchMenuItems = (
  menuItems: MenuItem[],
  query: string
): MenuItem[] => {
  if (!query.trim()) return menuItems;

  const searchKey = `${query.toLowerCase()}_${menuItems.length}`;

  // Check cache first
  const cached = searchCache.get(searchKey);
  const timestamp = searchCacheTimestamps.get(searchKey);

  if (cached && timestamp && Date.now() - timestamp < SEARCH_CACHE_EXPIRY) {
    return cached;
  }

  const results: MenuItem[] = [];
  const searchTerm = query.toLowerCase().trim();

  // Pre-compile search terms for faster matching
  const searchTerms = searchTerm.split(/\s+/);

  const search = (items: MenuItem[]) => {
    for (const item of items) {
      // Create searchable text once
      const searchableText = [
        item.name,
        item.description,
        ...(item.keywords || []),
      ]
        .join(' ')
        .toLowerCase();

      // Check if all search terms are found (AND logic for better relevance)
      const matches = searchTerms.every(term => searchableText.includes(term));

      if (matches) {
        results.push(item);
      }

      // Continue searching in children
      if (item.children && item.children.length > 0) {
        search(item.children);
      }
    }
  };

  search(menuItems);

  // Cache the results
  searchCache.set(searchKey, results);
  searchCacheTimestamps.set(searchKey, Date.now());

  return results;
};

/**
 * Clear search cache
 */
export const clearSearchCache = (): void => {
  searchCache.clear();
  searchCacheTimestamps.clear();
};

/**
 * Get menu statistics
 */
export const getMenuStats = (menuItems: MenuItem[]) => {
  let totalItems = 0;
  let itemsWithChildren = 0;
  let maxDepth = 0;

  const analyze = (items: MenuItem[], depth = 1) => {
    maxDepth = Math.max(maxDepth, depth);

    for (const item of items) {
      totalItems++;
      if (item.children && item.children.length > 0) {
        itemsWithChildren++;
        analyze(item.children, depth + 1);
      }
    }
  };

  analyze(menuItems);

  return {
    totalItems,
    itemsWithChildren,
    maxDepth,
    averageDepth: totalItems > 0 ? totalItems / itemsWithChildren : 0,
  };
};
