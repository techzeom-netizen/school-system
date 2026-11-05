# Suspense and Error Handling Guide

This guide explains how to use **React Suspense** and **ErrorBoundary** together in your Sangamam Frontend application for better user experience and error handling.

## Overview

### What is Suspense?

React Suspense is a feature that lets you "suspend" rendering while waiting for something (like data fetching or code splitting). When a component is suspended, React shows a fallback UI instead.

### What is ErrorBoundary?

Error boundaries are React components that catch JavaScript errors anywhere in their child component tree, log those errors, and display a fallback UI instead of the component tree that crashed.

### Why Combine Them?

- **Suspense** handles loading states gracefully
- **ErrorBoundary** catches and handles errors
- Together, they provide comprehensive error handling and loading state management

## Components Overview

### 1. SuspenseWrapper

A component that combines ErrorBoundary and Suspense for comprehensive error handling and loading states.

```tsx
import { SuspenseWrapper, BasicLoadingFallback } from '../components/common';
<SuspenseWrapper
  fallback={<BasicLoadingFallback message="Loading..." />}
  errorFallback={<div>Custom error message</div>}
  showErrorDetails={true}
>
  <YourComponent />
</SuspenseWrapper>;
```

### 2. Loading Fallbacks

Pre-built loading components for different scenarios:

- `BasicLoadingFallback` - Simple loading with spinner
- `PageLoadingFallback` - Full page loading state
- `DataLoadingFallback` - Data fetching loading state
- `TableLoadingFallback` - Skeleton loading for tables
- `CardLoadingFallback` - Skeleton loading for cards
- `ChartLoadingFallback` - Loading state for charts
- `AuthLoadingFallback` - Authentication loading state
- `RouteLoadingFallback` - Route loading state

### 3. Lazy Loading

Components are lazy-loaded for better performance:

```tsx
import { LazyDashboardPage } from '../pages';
<SuspenseWrapper fallback={<RouteLoadingFallback />}>
  <LazyDashboardPage />
</SuspenseWrapper>;
```

## Usage Patterns

### 1. Route-Level Suspense

All routes are wrapped with SuspenseWrapper for consistent loading and error handling:

```tsx
<Route
  path="/dashboard"
  element={
    <ProtectedRoute allowedRoles={[UserRole.CUSTOMER]}>
      <SuspenseWrapper fallback={<RouteLoadingFallback />}>
        <LazyDashboardPage />
      </SuspenseWrapper>
    </ProtectedRoute>
  }
/>
```

### 2. Data Fetching with Suspense

Use the `useSuspenseData` hook for Suspense-compatible data fetching:

```tsx
import { useSuspenseData } from '../hooks/useSuspenseData';

const fetchUserData = async (userId: string) => {
  const response = await fetch(`/api/users/${userId}`);
  return response.json();
};

const UserProfile: React.FC<{ userId: string }> = ({ userId }) => {
  // This will suspend while loading, triggering Suspense fallback
  const { data } = useSuspenseData(() => fetchUserData(userId), [userId]);

  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.email}</p>
    </div>
  );
};

// Wrap with SuspenseWrapper
<SuspenseWrapper fallback={<DataLoadingFallback />}>
  <UserProfile userId="123" />
</SuspenseWrapper>;
```

### 3. Component-Level Error Handling

Wrap individual components that might fail:

```tsx
<SuspenseWrapper
  fallback={<CardLoadingFallback />}
  errorFallback={<div>Failed to load chart</div>}
>
  <DataChart />
</SuspenseWrapper>
```

### 4. Nested Suspense Boundaries

You can nest Suspense boundaries for granular control:

```tsx
<SuspenseWrapper fallback={<PageLoadingFallback />}>
  <div>
    <h1>Dashboard</h1>

    <SuspenseWrapper fallback={<DataLoadingFallback />}>
      <UserStats />
    </SuspenseWrapper>

    <SuspenseWrapper fallback={<TableLoadingFallback />}>
      <TransactionTable />
    </SuspenseWrapper>
  </div>
</SuspenseWrapper>
```

## Error Handling Strategy

### 1. Error Boundary Hierarchy

```
App
├── ErrorBoundary (Global)
├── Routes
│   ├── ErrorBoundary (Route-level)
│   │   ├── SuspenseWrapper (Component-level)
│   │   └── SuspenseWrapper (Component-level)
│   └── ErrorBoundary (Route-level)
└── ErrorBoundary (Global)
```

### 2. Error Types Handled

- **JavaScript Errors**: Caught by ErrorBoundary
- **Network Errors**: Caught by ErrorBoundary when promises reject
- **Loading States**: Handled by Suspense
- **Code Splitting**: Handled by Suspense with lazy loading

### 3. Error Recovery

- Users can retry failed operations
- Error boundaries provide fallback UIs
- Detailed error information available in development mode

## Best Practices

### 1. Loading States

- Use appropriate loading fallbacks for different content types
- Provide meaningful loading messages
- Consider skeleton screens for better UX

### 2. Error Messages

- Show user-friendly error messages
- Provide recovery options (retry buttons)
- Log detailed errors for debugging

### 3. Performance

- Use lazy loading for route components
- Implement code splitting for large features
- Cache data appropriately to reduce loading states

### 4. Accessibility

- Ensure loading states are accessible
- Provide screen reader announcements for errors
- Maintain focus management during loading

## Migration Guide

### From Old ErrorBoundary Usage

**Before:**

```tsx
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

**After:**

```tsx
<SuspenseWrapper fallback={<BasicLoadingFallback />}>
  <YourComponent />
</SuspenseWrapper>
```

### Adding Suspense to Existing Components

1. Wrap your component with `SuspenseWrapper`
2. Choose an appropriate loading fallback
3. Optionally customize error fallback
4. Test loading and error scenarios

## Examples

See `src/examples/SuspenseUsageExamples.tsx` for comprehensive examples of:

- Basic SuspenseWrapper usage
- Data fetching with Suspense
- Lazy loading components
- Error handling demonstrations
- Nested Suspense boundaries

## Troubleshooting

### Common Issues

1. **Component not suspending**: Ensure you're throwing a promise in your data fetching
2. **Infinite loading**: Check that promises resolve or reject properly
3. **Error not caught**: Verify ErrorBoundary is wrapping the component that throws
4. **Multiple fallbacks showing**: Check for nested Suspense boundaries

### Debug Tips

- Use React DevTools to inspect Suspense boundaries
- Add console logs in your data fetching functions
- Test error scenarios by throwing errors in development
- Monitor network requests in browser dev tools

## Conclusion

Combining Suspense and ErrorBoundary provides a robust foundation for handling loading states and errors in your React application. This approach improves user experience by showing appropriate loading states and gracefully handling errors when they occur.
