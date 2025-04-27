'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { trackPageView, trackEvent } from '@/lib/clientAnalytics';
import { getVisitorId } from '@/lib/clientAnalytics';
import { getProjectBySlug } from '@/app/projects/projectsData';
import { useAuth } from '../auth/AuthContext';

// Simple analytics context with initialized state and tracking methods
export type AnalyticsContextType = {
  initialized: boolean;
  trackClick: (eventName: string, properties?: Record<string, unknown>) => void;
};

// Create context with default values
export const AnalyticsContext = createContext<AnalyticsContextType>({
  initialized: false,
  trackClick: () => {},
});

// Check if the current path is an admin page
const isAdminPage = (path: string): boolean => {
  return path === '/admin' || 
         path === '/analytics' || 
         path.startsWith('/admin/');
};

// Helper function to get page name from path
const getPageName = (path: string): string => {
  // Root path is home
  if (path === '/') return 'home';
  
  // Remove initial slash and handle nested routes
  const pathParts = path.substring(1).split('/');
  
  // Handle project detail pages - use the specific project title as the page name
  if (pathParts[0] === 'projects' && pathParts.length > 1) {
    const projectSlug = pathParts[1];
    const projectTitle = getProjectTitle(projectSlug);
    return `project: ${projectTitle}`; // e.g. "project: IBM UCL AI Islands"
  }
  
  // Use first part of the path as the page name
  return pathParts[0] || 'unknown';
};

// Helper to extract project slug from path
const getProjectSlug = (path: string): string | null => {
  const pathParts = path.split('/');
  if (pathParts.length >= 3 && pathParts[1] === 'projects') {
    return pathParts[2];
  }
  return null;
};

// Mapping of project slugs to their IDs
const projectMapping = {
  'ibm-ucl-ai-islands': '1',
  'mental-health-management-platform': '2',
  'chemucl-inventory-system': '3',
  'humanitarian-management-system': '4',
};

// Helper to get project title for analytics
const getProjectTitle = (slug: string): string => {
  const project = getProjectBySlug(slug);
  return project ? project.title : `Project: ${slug}`;
};

// Hook to use analytics in components
export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};

export const AnalyticsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [initialized, setInitialized] = useState(false);
  const [previousPath, setPreviousPath] = useState<string | null>(null);
  
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Get authentication context to check if user is an admin
  const { isLoggedIn } = useAuth();

  // Track click events
  const trackClick = (eventName: string, properties?: Record<string, unknown>) => {
    // Don't track if not initialized or if user is an admin
    if (!initialized || isLoggedIn) return;
    
    console.log('[Analytics] Tracking click event:', { eventName, properties, isAdmin: isLoggedIn });
    trackEvent(eventName, properties || {}, isLoggedIn);
  };

  // Initialize analytics when component mounts
  useEffect(() => {
    // This will only run on the client, preventing hydration errors
    if (typeof window !== 'undefined') {
      setInitialized(true);
      console.log('[Analytics] Provider initialized');
    }
  }, []);

  // Track page views and project views when pathname or search params change
  useEffect(() => {
    // Skip tracking if not initialized
    if (!initialized) return;
    
    // Skip tracking for admin users
    if (isLoggedIn) {
      console.log('[Analytics] Skipping tracking for admin user');
      return;
    }
    
    // Skip tracking for admin pages
    if (isAdminPage(pathname)) {
      console.log('[Analytics] Skipping tracking for admin page:', pathname);
      return;
    }
    
    const fullPath = searchParams?.size 
      ? `${pathname}?${searchParams.toString()}` 
      : pathname;
      
    // Don't track if it's the same path
    if (fullPath === previousPath) return;
    
    // Store current path to avoid tracking the same page multiple times
    setPreviousPath(fullPath);
    
    // Check if this is a project page
    const projectSlug = getProjectSlug(pathname);
    // Get the page name (will include project title for project pages)
    const pageName = getPageName(pathname);
    
    console.log('[Analytics] Tracking page view:', { 
      pathname, 
      fullPath, 
      pageName,
      isAdmin: isLoggedIn
    });
    
    // Client-side only code - must be executed after window is defined
    // This fixes the hydration error by ensuring this code doesn't run during SSR
    setTimeout(() => {
      // Track the page view - using the clientAnalytics.ts signature
      trackPageView(
        pageName,
        fullPath,
        isLoggedIn
      );
      
      // Check if this is a project page and track project view as an event
      if (projectSlug && projectMapping[projectSlug as keyof typeof projectMapping]) {
        const projectId = projectMapping[projectSlug as keyof typeof projectMapping];
        console.log('[Analytics] Tracking project view:', { projectSlug, projectId });
        
        // Track project view as a custom event - using the clientAnalytics.ts signature
        trackEvent(
          'project-view', 
          {
            projectId,
            projectSlug,
            projectTitle: getProjectTitle(projectSlug),
            visitorId: getVisitorId(),
          }, 
          isLoggedIn
        );
      }
    }, 0);
    
  }, [pathname, searchParams, initialized, isLoggedIn, previousPath]);

  return (
    <AnalyticsContext.Provider
      value={{
        initialized,
        trackClick,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
}; 