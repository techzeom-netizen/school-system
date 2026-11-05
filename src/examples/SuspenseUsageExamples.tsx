import React from 'react';
import {
  SuspenseWrapper,
  BasicLoadingFallback,
  PageLoadingFallback,
  DataLoadingFallback,
  TableLoadingFallback,
  CardLoadingFallback,
} from '../components/common';
import { useSuspenseData } from '../hooks/useSuspenseData';

/**
 * Examples demonstrating how to use Suspense and ErrorBoundary together
 * These examples show different patterns for handling loading states and errors
 */

// Example 1: Basic SuspenseWrapper usage
export const BasicSuspenseExample: React.FC = () => {
  return (
    <SuspenseWrapper
      fallback={<BasicLoadingFallback message="Loading component..." />}
      errorFallback={<div>Custom error message</div>}
    >
      <div>
        <h2>This component is wrapped with SuspenseWrapper</h2>
        <p>
          It will show a loading state while loading and handle errors
          gracefully.
        </p>
      </div>
    </SuspenseWrapper>
  );
};

// Example 2: Using Suspense with async data fetching
const fetchUserData = async (userId: string) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 2000));
  return {
    id: userId,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Customer',
  };
};

export const DataFetchingExample: React.FC<{ userId: string }> = ({
  userId,
}) => {
  // This will throw a promise while loading, triggering Suspense
  const { data } = useSuspenseData(() => fetchUserData(userId), [userId]);

  return (
    <div className="p-4 border rounded-lg">
      <h3>User Data</h3>
      <p>Name: {data.name}</p>
      <p>Email: {data.email}</p>
      <p>Role: {data.role}</p>
    </div>
  );
};

// Example 3: Wrapping the data fetching component with SuspenseWrapper
export const DataFetchingWithSuspenseExample: React.FC<{ userId: string }> = ({
  userId,
}) => {
  return (
    <SuspenseWrapper
      fallback={<DataLoadingFallback message="Fetching user data..." />}
    >
      <DataFetchingExample userId={userId} />
    </SuspenseWrapper>
  );
};

// Example 4: Lazy loading a component
const LazyComponent = React.lazy(
  () =>
    new Promise<{ default: React.ComponentType<any> }>(resolve => {
      setTimeout(() => {
        resolve({
          default: function LazyComponent() {
            return (
              <div className="p-4 border rounded-lg bg-green-50">
                <h3>Lazy Loaded Component</h3>
                <p>This component was loaded asynchronously!</p>
              </div>
            );
          },
        });
      }, 3000);
    })
);

export const LazyLoadingExample: React.FC = () => {
  return (
    <SuspenseWrapper
      fallback={<PageLoadingFallback message="Loading lazy component..." />}
    >
      <LazyComponent />
    </SuspenseWrapper>
  );
};

// Example 5: Different loading fallbacks for different scenarios
export const MultipleFallbackExample: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3>Table Loading</h3>
        <SuspenseWrapper fallback={<TableLoadingFallback />}>
          <div className="p-4 border rounded-lg">
            <p>Table content would go here</p>
          </div>
        </SuspenseWrapper>
      </div>

      <div>
        <h3>Card Loading</h3>
        <SuspenseWrapper fallback={<CardLoadingFallback />}>
          <div className="p-4 border rounded-lg">
            <p>Card content would go here</p>
          </div>
        </SuspenseWrapper>
      </div>

      <div>
        <h3>Page Loading</h3>
        <SuspenseWrapper fallback={<PageLoadingFallback />}>
          <div className="p-4 border rounded-lg">
            <p>Page content would go here</p>
          </div>
        </SuspenseWrapper>
      </div>
    </div>
  );
};

// Example 6: Error handling demonstration
const ErrorProneComponent: React.FC = () => {
  const [shouldError, setShouldError] = React.useState(false);

  if (shouldError) {
    throw new Error('This is a test error to demonstrate error handling');
  }

  return (
    <div className="p-4 border rounded-lg">
      <h3>Error Demonstration</h3>
      <p>This component can throw an error to test error handling.</p>
      <button
        onClick={() => setShouldError(true)}
        className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Trigger Error
      </button>
    </div>
  );
};

export const ErrorHandlingExample: React.FC = () => {
  return (
    <SuspenseWrapper
      fallback={<BasicLoadingFallback />}
      errorFallback={
        <div className="p-4 border border-red-200 rounded-lg bg-red-50">
          <h3 className="text-red-800">Custom Error Fallback</h3>
          <p className="text-red-700">
            This is a custom error message for demonstration.
          </p>
        </div>
      }
      showErrorDetails={true}
    >
      <ErrorProneComponent />
    </SuspenseWrapper>
  );
};

// Example 7: Nested Suspense boundaries
const NestedComponent: React.FC = () => {
  return (
    <div className="p-4 border rounded-lg">
      <h3>Nested Component</h3>
      <SuspenseWrapper
        fallback={<BasicLoadingFallback message="Loading nested content..." />}
      >
        <div>
          <p>This is nested content with its own Suspense boundary.</p>
          <DataFetchingExample userId="123" />
        </div>
      </SuspenseWrapper>
    </div>
  );
};

export const NestedSuspenseExample: React.FC = () => {
  return (
    <SuspenseWrapper
      fallback={<PageLoadingFallback message="Loading main content..." />}
    >
      <NestedComponent />
    </SuspenseWrapper>
  );
};
