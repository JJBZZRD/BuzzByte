/**
 * Simplified client-side analytics utilities
 */

import { v4 as uuidv4 } from 'uuid';

// Configure debugging - set to true to see analytics logs in the console
const DEBUG = true;

// Session timeout in minutes - if no activity for this time, a new session starts
const SESSION_TIMEOUT_MINUTES = 30;

/**
 * Paths that should be excluded from tracking
 */
const excludedPaths: string[] = [
  '/admin',
  '/api',
  '/analytics',
  '/_next'
];

/**
 * Log debug information if DEBUG is enabled
 */
function debugLog(...args: unknown[]): void {
  if (DEBUG) {
    console.log('[Analytics]', ...args);
  }
}

/**
 * Set a cookie with given name, value and expiration days
 */
function setCookie(name: string, value: string, days: number = 365): void {
  if (typeof window === 'undefined') return;
  
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = `; expires=${date.toUTCString()}`;
  
  // Set a cookie with HttpOnly=false so JavaScript can read it
  document.cookie = `${name}=${value}${expires}; path=/; SameSite=Lax`;
  debugLog('Set cookie:', name, 'expires in', days, 'days');
}

/**
 * Get a cookie by name
 */
function getCookie(name: string): string | null {
  if (typeof window === 'undefined') return null;
  
  const nameEQ = `${name}=`;
  const cookies = document.cookie.split(';');
  
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.indexOf(nameEQ) === 0) {
      return cookie.substring(nameEQ.length, cookie.length);
    }
  }
  
  return null;
}

/**
 * Get or create a visitor ID from localStorage and cookies for better persistence
 */
export function getVisitorId(): string {
  const storageKey = 'jb_visitor_id';
  const cookieKey = 'jb_visitor';
  
  if (typeof window === 'undefined') {
    // For SSR, return a temporary ID that will be replaced on client
    return 'ssr-temp-id';
  }
  
  try {
    // First try to get from cookie (more persistent)
    let visitorId = getCookie(cookieKey) || '';
    
    // Then try localStorage
    if (!visitorId && typeof localStorage !== 'undefined') {
      try {
        const localStorageId = localStorage.getItem(storageKey);
        if (localStorageId) {
          visitorId = localStorageId;
        }
      } catch (e) {
        console.warn('Error accessing localStorage:', e);
        // Continue with cookie or create new ID
      }
    }
    
    // Create new ID if none found
    if (!visitorId) {
      visitorId = uuidv4();
      debugLog('Created new visitor ID:', visitorId);
    } else {
      debugLog('Using existing visitor ID:', visitorId);
    }
    
    // Store in both locations for redundancy
    // Set cookie with 2 year expiration for extended persistence
    setCookie(cookieKey, visitorId, 730); 
    
    // Also store in localStorage
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(storageKey, visitorId);
      } catch {
        // Silently fail if localStorage is not available
        console.warn('Could not store visitor ID in localStorage');
      }
    }
    
    return visitorId;
  } catch (error) {
    // Handle case where both cookies and localStorage are disabled
    console.error('Error accessing visitor storage:', error);
    return `temp-${uuidv4()}`;
  }
}

/**
 * Get or create a session ID and manage session state
 */
export function getSessionId(): string {
  const sessionIdKey = 'jb_session_id';
  const lastActivityKey = 'jb_last_activity';
  const cookieSessionKey = 'jb_session';
  const cookieActivityKey = 'jb_activity';
  
  if (typeof window === 'undefined') {
    // For SSR, return a temporary ID that will be replaced on client
    return 'ssr-temp-session';
  }
  
  try {
    const now = new Date().getTime();
    
    // Try to get session data from cookies first, then localStorage
    const sessionCookie = getCookie(cookieSessionKey);
    let sessionId = sessionCookie || '';
    let lastActivityStr = '';
    
    // Only access localStorage if it exists and is accessible
    if (typeof localStorage !== 'undefined') {
      try {
        const localSessionId = localStorage.getItem(sessionIdKey);
        if (!sessionId && localSessionId) {
          sessionId = localSessionId;
        }
        
        const activityCookie = getCookie(cookieActivityKey);
        const localActivityTime = localStorage.getItem(lastActivityKey);
        lastActivityStr = activityCookie || localActivityTime || '';
      } catch (e) {
        console.warn('Error accessing localStorage for session data:', e);
        // Continue with cookie data only
      }
    } else {
      // If localStorage not available, try to get activity from cookie only
      lastActivityStr = getCookie(cookieActivityKey) || '';
    }
    
    // Check if we need to create a new session
    let isNewSession = false;
    
    if (!sessionId) {
      // No session exists, create a new one
      isNewSession = true;
    } else if (lastActivityStr) {
      // Check if the session has timed out
      const lastActivity = parseInt(lastActivityStr, 10);
      const timeSinceLastActivity = now - lastActivity;
      const timeoutMs = SESSION_TIMEOUT_MINUTES * 60 * 1000;
      
      if (timeSinceLastActivity > timeoutMs) {
        // Session has timed out, create a new one
        isNewSession = true;
        debugLog('Session timed out after', Math.round(timeSinceLastActivity / 1000 / 60), 'minutes');
      }
    }
    
    if (isNewSession) {
      sessionId = uuidv4();
      debugLog('Created new session ID:', sessionId);
    } else {
      debugLog('Using existing session ID:', sessionId);
    }
    
    // Store session data in both cookies and localStorage
    setCookie(cookieSessionKey, sessionId, 1); // Sessions expire in 1 day max
    setCookie(cookieActivityKey, now.toString(), 1);
    
    // Only use localStorage if available
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(sessionIdKey, sessionId);
        localStorage.setItem(lastActivityKey, now.toString());
      } catch {
        // Silently fail if localStorage is not available
        console.warn('Could not store session data in localStorage');
      }
    }
    
    // Refresh session expiration
    refreshSession();
    
    return sessionId;
  } catch (error) {
    // Handle case where both cookies and localStorage are disabled
    console.error('Error managing session storage:', error);
    return `temp-session-${uuidv4()}`;
  }
}

/**
 * Refresh session timeout by updating the last activity timestamp
 */
function refreshSession(): void {
  const now = new Date().getTime();
  setCookie('lastActivity', now.toString(), 0);
  debugLog('Session refreshed at:', new Date().toISOString());
}

/**
 * Track a page view
 */
export async function trackPageView(pageName: string, path: string, isAdmin = false): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    const visitorId = getVisitorId();
    const sessionId = getSessionId();
    
    // Skip tracking for excluded paths
    if (excludedPaths.some((p: string) => path.startsWith(p))) {
      debugLog('Skipping excluded path:', path);
      return;
    }
    
    // Skip tracking for admin users
    if (isAdmin) {
      debugLog('Skipping tracking for admin user');
      return;
    }
    
    debugLog('Tracking page view:', { pageName, path, visitorId, sessionId, isAdmin });
    
    const response = await fetch('/api/analytics/pageview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        visitorId,
        sessionId,
        pageName,
        path,
        isAdmin,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to track page view: ${response.statusText}`);
    }
    
    debugLog('Page view tracked successfully');
  } catch (error) {
    console.error('Error tracking page view:', error);
  }
}

/**
 * Track an event
 */
export async function trackEvent(eventName: string, eventData: Record<string, unknown> = {}, isAdmin = false): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    const visitorId = getVisitorId();
    const sessionId = getSessionId();
    const path = window.location.pathname;
    
    // Skip tracking for excluded paths
    if (excludedPaths.some((p: string) => path.startsWith(p))) {
      debugLog('Skipping event tracking for excluded path:', path);
      return;
    }
    
    // Skip tracking for admin users
    if (isAdmin) {
      debugLog('Skipping event tracking for admin user');
      return;
    }
    
    debugLog('Tracking event:', { eventName, eventData, visitorId, sessionId });
    
    const response = await fetch('/api/analytics/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        visitorId,
        sessionId,
        eventName,
        eventData,
        path,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to track event: ${response.statusText}`);
    }
    
    debugLog('Event tracked successfully');
  } catch (error) {
    console.error('Error tracking event:', error);
  }
} 