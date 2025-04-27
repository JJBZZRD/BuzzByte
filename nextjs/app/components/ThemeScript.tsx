'use client';

import React from 'react';

// This component injects a script into the head to set the theme before the page loads
// This prevents the flash of wrong theme on initial load
const ThemeScript = () => {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            // Get the saved theme from localStorage or default to 'system'
            const savedTheme = localStorage.getItem('theme') || 'system';
            
            // Detect system preference if theme is set to 'system'
            if (savedTheme === 'system') {
              const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
              if (systemTheme === 'dark') {
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.remove('dark');
              }
            } else if (savedTheme === 'dark') {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }
          })();
        `,
      }}
    />
  );
};

export default ThemeScript; 