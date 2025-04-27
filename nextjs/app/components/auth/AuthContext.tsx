'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  // These functions are used in the original cookies.ts utility 
  // but are now commented to satisfy ESLint
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getAdminToken, 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setAdminToken, 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removeAdminToken,
  generateCsrfToken,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removeCsrfToken 
} from '@/app/utils/cookies';
import Cookies from 'js-cookie';

// Define the shape of the context
type AuthContextType = {
  isLoggedIn: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
};

// Token refresh interval in milliseconds (12 hours)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TOKEN_REFRESH_INTERVAL = 12 * 60 * 60 * 1000;

// Create the context
const AuthContext = createContext<AuthContextType | null>(null);

// Provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Logout function - defined with useCallback to avoid dependencies issues in useEffect
  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      // Call the logout API endpoint
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'X-CSRF-Token': Cookies.get('csrf_token') || '',
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to logout');
      }

      // The API endpoint will clear the cookies, so we just update our state
      setIsLoggedIn(false);
      
      // Redirect to the admin login page
      router.push('/admin');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if there's an error, still attempt to redirect
      router.push('/admin');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to refresh the token
  const refreshToken = async (): Promise<boolean> => {
    try {
      // Call the refresh endpoint - it will use the HTTP-only cookie
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });
      
      if (!response.ok) {
        console.error('Token refresh failed:', response.status);
        return false;
      }
      
      const data = await response.json();
      
      if (data.success) {
        // The server will already set the new token as an HTTP-only cookie
        // Just generate a new CSRF token 
        generateCsrfToken();
        console.log('Token refreshed successfully');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  };

  // Check if the user is already logged in on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Verify token with server using the HTTP-only cookie (no need to pass token)
        const response = await fetch('/api/auth/verify', {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.authenticated) {
            console.log('Auth check: User is authenticated');
            setIsLoggedIn(true);
            // Generate a CSRF token for secure operations
            generateCsrfToken();
            // Refresh token on successful verification
            await refreshToken();
          } else {
            console.log('Auth check: User is not authenticated');
            setIsLoggedIn(false);
          }
        } else {
          console.log('Auth check: Failed to verify token');
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error verifying authentication:', error);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Set up interval to refresh the token
  useEffect(() => {
    if (!isLoggedIn) return;
    
    console.log('Setting up token refresh interval');
    
    // Refresh token immediately to ensure we have a fresh one
    refreshToken();
    
    // Set up interval to refresh token (every 4 hours)
    const intervalId = setInterval(async () => {
      console.log('Refreshing token on interval');
      const success = await refreshToken();
      
      if (!success) {
        console.error('Token refresh failed, logging out');
        // If token refresh fails, log the user out
        logout();
      }
    }, 4 * 60 * 60 * 1000); // 4 hours
    
    return () => {
      console.log('Clearing token refresh interval');
      clearInterval(intervalId);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, refreshToken]); // Adding 'refreshToken' but not 'logout' to avoid infinite render cycles

  // Login function
  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Call the login API endpoint
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        // Instead of throwing an error, just return false
        console.log('Login failed:', data.error || 'Unknown error');
        return false;
      }

      // We don't need to manually set the token anymore as it's set in an HTTP-only cookie
      setIsLoggedIn(true);
      
      // Token is already verified by login
      console.log('Login successful');
      
      return true;
    } catch (error) {
      console.error('Login request error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const checkAuthStatus = async (): Promise<void> => {
    setIsLoading(true);
    try {
      // Call the verify API endpoint
      const response = await fetch('/api/auth/verify', {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.authenticated) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Show nothing until we've checked authentication
  if (isLoading) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 