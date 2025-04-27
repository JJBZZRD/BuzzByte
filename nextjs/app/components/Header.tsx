"use client";

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from './auth/AuthContext';
import ThemeToggle from './ThemeToggle';

const Header = () => {
  const [scrollState, setScrollState] = useState({
    initialScrolled: false,
    compactScrolled: false
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const adminDropdownRef = useRef<HTMLDivElement>(null);
  const { isLoggedIn, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      // First transition at a slight scroll (10px)
      const isInitialScrolled = window.scrollY > 10;
      // Second transition at deeper scroll (100px)
      const isCompactScrolled = window.scrollY > 100;
      
      setScrollState({
        initialScrolled: isInitialScrolled,
        compactScrolled: isCompactScrolled
      });
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (adminDropdownRef.current && !adminDropdownRef.current.contains(event.target as Node)) {
        setAdminMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const pathname = usePathname();
  const isAdminActive = pathname === '/admin' || 
                        pathname === '/analytics' || 
                        pathname.startsWith('/admin/');

  const handleLogout = () => {
    logout();
    setAdminMenuOpen(false);
  };

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-500 ease-in-out ${
        !scrollState.initialScrolled 
          ? 'bg-gradient-to-r from-background/40 via-background/30 to-background/40 backdrop-blur-sm' 
          : scrollState.compactScrolled
            ? 'bg-gradient-to-r from-background/95 via-background/95 to-background/95 backdrop-blur-md shadow-md border-b border-foreground/5'
            : 'bg-gradient-to-r from-background/95 via-background/90 to-background/95 backdrop-blur-md shadow-md border-b border-foreground/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex justify-between items-center transition-all duration-500 ease-in-out ${
          scrollState.compactScrolled 
            ? 'py-2 md:py-2' 
            : 'py-4 md:py-6'
        }`}>
          <div className="flex items-center">
            <Link 
              href="/" 
              className={`text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 dark:from-blue-400 dark:to-purple-400 dark:hover:from-blue-300 dark:hover:to-purple-300 transition-all duration-500 ease-in-out ${
                scrollState.compactScrolled ? 'md:text-xl' : 'md:text-2xl'
              }`}
            >
              BuzzByte
            </Link>
          </div>

          {/* Mobile menu button and theme toggle */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => {
                setMenuOpen(!menuOpen);
              }}
              className="text-foreground hover:text-foreground/80 transition-colors p-2"
              aria-label="Toggle menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Desktop menu */}
          <nav className={`hidden md:flex items-center transition-all duration-500 ease-in-out ${
            scrollState.compactScrolled ? 'space-x-6' : 'space-x-8'
          }`}>
            <NavLink href="/" compactMode={scrollState.compactScrolled}>Home</NavLink>
            <NavLink href="/about" compactMode={scrollState.compactScrolled}>About</NavLink>
            <NavLink href="/projects" compactMode={scrollState.compactScrolled}>Projects</NavLink>
            <NavLink href="/contact" compactMode={scrollState.compactScrolled}>Contact</NavLink>
            
            {/* Admin Dropdown - Only shown if logged in */}
            {isLoggedIn && (
              <div 
                className="relative" 
                ref={adminDropdownRef}
                onMouseEnter={() => setAdminMenuOpen(true)}
              >
                <button 
                  className={`relative font-medium transition-colors flex items-center gap-1
                    ${isAdminActive 
                      ? 'text-blue-600 dark:text-blue-400' 
                      : 'text-foreground/80 hover:text-foreground'
                    }`}
                  onClick={() => {
                    setAdminMenuOpen(!adminMenuOpen);
                  }}
                  aria-expanded={adminMenuOpen}
                  aria-haspopup="true"
                >
                  Admin
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mt-0.5">
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                  </svg>
                  <span 
                    className={`absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400 transform origin-bottom transition-all duration-200 ${
                      isAdminActive ? 'scale-x-100' : adminMenuOpen ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  ></span>
                </button>
                
                {/* Admin Dropdown Menu */}
                {adminMenuOpen && (
                  <div 
                    className="absolute top-full left-0 mt-1 bg-background border border-foreground/10 rounded-md shadow-lg py-2 w-48"
                    onMouseLeave={() => setAdminMenuOpen(false)}
                  >
                    <Link 
                      href="/analytics"
                      className={`block px-4 py-2 hover:text-foreground hover:bg-foreground/5 transition-colors ${
                        pathname === '/analytics' ? 'text-blue-600 dark:text-blue-400 bg-foreground/5' : 'text-foreground/80'
                      }`}
                      onClick={() => {
                        setAdminMenuOpen(false);
                      }}
                    >
                      Analytics
                    </Link>
                    <Link 
                      href="/admin/messages"
                      className={`block px-4 py-2 hover:text-foreground hover:bg-foreground/5 transition-colors ${
                        pathname === '/admin/messages' ? 'text-blue-600 dark:text-blue-400 bg-foreground/5' : 'text-foreground/80'
                      }`}
                      onClick={() => {
                        setAdminMenuOpen(false);
                      }}
                    >
                      Messages
                    </Link>
                    <button
                      className="w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {/* Theme toggle in desktop menu */}
            <ThemeToggle />
          </nav>
        </div>
      </div>

      {/* Mobile menu */}
      <div 
        className={`md:hidden ${menuOpen ? 'block' : 'hidden'} bg-gradient-to-b from-background/95 to-background/90 backdrop-blur-md shadow-lg border-b border-foreground/5`}
      >
        <nav className="px-4 pt-2 pb-4 space-y-2">
          <MobileNavLink href="/" onClick={() => setMenuOpen(false)}>Home</MobileNavLink>
          <MobileNavLink href="/about" onClick={() => setMenuOpen(false)}>About</MobileNavLink>
          <MobileNavLink href="/projects" onClick={() => setMenuOpen(false)}>Projects</MobileNavLink>
          <MobileNavLink href="/contact" onClick={() => setMenuOpen(false)}>Contact</MobileNavLink>
          
          {/* Mobile Admin Section - Only shown if logged in */}
          {isLoggedIn && (
            <div className="pt-2 border-t border-foreground/10">
              <div className="px-4 py-2 text-sm font-medium text-foreground/60">Admin</div>
              <MobileNavLink href="/analytics" onClick={() => setMenuOpen(false)}>Analytics</MobileNavLink>
              <MobileNavLink href="/admin/messages" onClick={() => setMenuOpen(false)}>Messages</MobileNavLink>
              <button
                className="w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors rounded-md"
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
              >
                Logout
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

const NavLink = ({ 
  href, 
  children, 
  className = '',
  compactMode = false
}: { 
  href: string; 
  children: React.ReactNode; 
  className?: string;
  compactMode?: boolean;
}) => {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);
  
  const isActive = pathname === href || (pathname.startsWith(href) && href !== '/') || (href === '/' && pathname === '/');

  return (
    <Link 
      href={href}
      className={`relative font-medium transition-all duration-500 ease-in-out ${
        isActive 
          ? 'text-blue-600 dark:text-blue-400' 
          : 'text-foreground/80 hover:text-foreground'
      } ${compactMode ? 'text-sm' : 'text-base'} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      <span 
        className={`absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400 transform origin-bottom transition-all duration-500 ease-in-out ${
          isActive ? 'scale-x-100' : isHovered ? 'scale-x-100' : 'scale-x-0'
        }`}
      ></span>
    </Link>
  );
};

const MobileNavLink = ({ 
  href, 
  onClick, 
  children 
}: { 
  href: string; 
  onClick: () => void;
  children: React.ReactNode 
}) => {
  const pathname = usePathname();
  
  const isActive = pathname === href || (pathname.startsWith(href) && href !== '/') || (href === '/' && pathname === '/');

  return (
    <Link 
      href={href}
      className={`block py-2 px-4 rounded-md transition-all duration-500 ease-in-out ${
        isActive
          ? 'text-blue-600 dark:text-blue-400 bg-foreground/5' 
          : 'text-foreground/80 hover:text-foreground hover:bg-foreground/5'
      }`}
      onClick={() => {
        onClick();
      }}
    >
      {children}
    </Link>
  );
};

export default Header; 