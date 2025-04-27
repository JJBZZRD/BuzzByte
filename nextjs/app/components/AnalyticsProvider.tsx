'use client';

import { ReactNode } from 'react';
import { AnalyticsProvider as ActualAnalyticsProvider } from './analytics/AnalyticsProvider';

interface AnalyticsProviderProps {
  children: ReactNode;
}

// This is now a wrapper component that uses the actual analytics provider
// Our actual analytics provider is in app/components/analytics/AnalyticsProvider.tsx
export default function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  return <ActualAnalyticsProvider>{children}</ActualAnalyticsProvider>;
} 