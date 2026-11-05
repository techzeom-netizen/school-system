// Main components index - exports all reusable components

// UI Components (Radix UI + Tailwind)
export * from './ui';

// Layout Components
export { default as ModernNavbar } from './layout/ModernNavbar';

// Common Components
export { default as ErrorBoundary } from './common/ErrorBoundary';
export { default as SuspenseWrapper } from './common/SuspenseWrapper';
export * from './common/LoadingFallbacks';

// Auth Components
export { default as AuthSuspense } from './auth/AuthSuspense';

// Dashboard Components
export * from './dashboard';
