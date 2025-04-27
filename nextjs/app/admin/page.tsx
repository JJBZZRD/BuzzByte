"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../components/auth/AuthContext";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { isLoggedIn, login } = useAuth();

  // Redirect to analytics if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      router.push("/analytics");
    }
    
    // Check URL for auth_error parameter (from middleware)
    const urlParams = new URLSearchParams(window.location.search);
    const authError = urlParams.get('auth_error');
    
    if (authError) {
      console.log('Auth error from URL:', authError);
      setError(`Authentication error: ${decodeURIComponent(authError)}`);
      
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [isLoggedIn, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const success = await login(username, password);
      
      if (success) {
        // Login successful, redirect will happen via the useEffect
      } else {
        setError("Invalid username or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="grid md:grid-cols-2 h-screen">
        {/* Decorative Side Panel */}
        <div className="hidden md:flex relative overflow-hidden bg-gradient-to-br from-blue-600 to-purple-600 text-white">
          <div className="absolute inset-0 bg-black/10"></div>
          
          {/* Decorative geometric shapes */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20">
            <div className="absolute -top-40 -left-40 w-80 h-80 bg-white rounded-full"></div>
            <div className="absolute top-1/4 -right-20 w-60 h-60 bg-white rounded-full"></div>
            <div className="absolute -bottom-40 left-1/3 w-80 h-80 bg-white rounded-full"></div>
          </div>
          
          <div className="relative z-10 flex flex-col justify-center items-center w-full h-full p-12">
            <div className="mb-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold mb-6">Admin Portal</h1>
            <p className="text-xl opacity-80 text-center max-w-md">
              Secure access to manage your portfolio content and analytics
            </p>
            <div className="mt-12 text-sm opacity-70">
              JB Portfolio • Admin Access
            </div>
          </div>
        </div>
        
        {/* Login Form Side */}
        <div className="flex flex-col justify-center items-center p-6 sm:p-12">
          <div className="w-full max-w-md">
            {/* Mobile Logo (only shown on small screens) */}
            <div className="md:hidden flex justify-center mb-8">
              <div className="h-16 w-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
            <p className="text-foreground/60 mb-8">
              Please log in to access the admin area
            </p>
            
            {error && (
              <div className="mb-6 p-4 rounded-md bg-red-50 text-red-600 text-sm">
                <p>{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium mb-2">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 border border-foreground/10 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  required
                  placeholder="Enter your username"
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="block text-sm font-medium">
                    Password
                  </label>
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-foreground/10 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  required
                  placeholder="Enter your password"
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-md text-white font-medium transition-all ${
                  isLoading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Authenticating...
                  </span>
                ) : (
                  "Log in to Admin"
                )}
              </button>
            </form>
            
            <div className="mt-8 pt-6 border-t border-foreground/10">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                <span>Return to website</span>
              </Link>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-foreground/60 text-sm">
                This is a secure area. Unauthorized access is prohibited.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}