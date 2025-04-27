'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from './ThemeProvider';

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        aria-label="Toggle theme"
        className="p-2 rounded-md text-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-colors"
        onClick={() => setOpen(!open)}
      >
        {resolvedTheme === 'dark' ? (
          <MoonIcon className="w-5 h-5" />
        ) : (
          <SunIcon className="w-5 h-5" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-36 bg-background border border-foreground/10 rounded-md shadow-lg overflow-hidden z-50">
          <div className="py-1">
            <button
              className={`w-full text-left px-4 py-2 text-sm ${
                theme === 'light' ? 'text-blue-600 bg-foreground/5' : 'text-foreground/70 hover:bg-foreground/5'
              }`}
              onClick={() => {
                setTheme('light');
                setOpen(false);
              }}
            >
              <div className="flex items-center">
                <SunIcon className="w-4 h-4 mr-2" />
                <span>Light</span>
              </div>
            </button>
            
            <button
              className={`w-full text-left px-4 py-2 text-sm ${
                theme === 'dark' ? 'text-blue-600 bg-foreground/5' : 'text-foreground/70 hover:bg-foreground/5'
              }`}
              onClick={() => {
                setTheme('dark');
                setOpen(false);
              }}
            >
              <div className="flex items-center">
                <MoonIcon className="w-4 h-4 mr-2" />
                <span>Dark</span>
              </div>
            </button>
            
            <button
              className={`w-full text-left px-4 py-2 text-sm ${
                theme === 'system' ? 'text-blue-600 bg-foreground/5' : 'text-foreground/70 hover:bg-foreground/5'
              }`}
              onClick={() => {
                setTheme('system');
                setOpen(false);
              }}
            >
              <div className="flex items-center">
                <ComputerIcon className="w-4 h-4 mr-2" />
                <span>System</span>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Icons
const SunIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
    />
  </svg>
);

const MoonIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
    />
  </svg>
);

const ComputerIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25"
    />
  </svg>
); 