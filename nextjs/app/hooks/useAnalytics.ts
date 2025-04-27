'use client';

import { useContext } from 'react';
import { AnalyticsContext } from '../components/analytics/AnalyticsProvider';

// Hook to use analytics in components
export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  
  // Make sure the context exists
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  
  return context;
} 