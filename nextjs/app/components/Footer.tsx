"use client";

import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-b from-foreground/5 to-foreground/10 dark:from-foreground/10 dark:to-foreground/15 py-12 border-t border-foreground/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-8 md:mb-0">
            <Link href="/" className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 dark:from-blue-400 dark:to-purple-400 dark:hover:from-blue-300 dark:hover:to-purple-300 transition-colors">
              BuzzByte
            </Link>
            <p className="mt-2 text-sm text-foreground/60">
              © {currentYear} BuzzByte.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-10 md:gap-16">
            <div>
              <h3 className="text-sm font-semibold mb-4 text-foreground/80 border-b border-foreground/10 pb-2">Navigation</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/" className="text-sm text-foreground/70 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Home</Link>
                </li>
                <li>
                  <Link href="/about" className="text-sm text-foreground/70 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About</Link>
                </li>
                <li>
                  <Link href="/projects" className="text-sm text-foreground/70 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Projects</Link>
                </li>
                <li>
                  <Link href="/contact" className="text-sm text-foreground/70 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact</Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold mb-4 text-foreground/80 border-b border-foreground/10 pb-2">Connect</h3>
              <ul className="space-y-3">
                <li>
                  <a href="https://github.com/JJBZZRD" target="_blank" rel="noopener noreferrer" className="text-sm text-foreground/70 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group flex items-center">
                    <svg className="w-4 h-4 mr-2 text-foreground/40 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 0C5.37 0 0 5.37 0 12C0 17.31 3.435 21.795 8.205 23.385C8.805 23.49 9.03 23.13 9.03 22.815C9.03 22.53 9.015 21.585 9.015 20.58C6 21.135 5.22 19.845 4.98 19.17C4.845 18.825 4.26 17.76 3.75 17.475C3.33 17.25 2.73 16.695 3.735 16.68C4.68 16.665 5.355 17.55 5.58 17.91C6.66 19.725 8.385 19.215 9.075 18.9C9.18 18.12 9.495 17.595 9.84 17.295C7.17 16.995 4.38 15.96 4.38 11.37C4.38 10.065 4.845 8.985 5.61 8.145C5.49 7.845 5.07 6.615 5.73 4.965C5.73 4.965 6.735 4.65 9.03 6.195C9.99 5.925 11.01 5.79 12.03 5.79C13.05 5.79 14.07 5.925 15.03 6.195C17.325 4.635 18.33 4.965 18.33 4.965C18.99 6.615 18.57 7.845 18.45 8.145C19.215 8.985 19.68 10.05 19.68 11.37C19.68 15.975 16.875 16.995 14.205 17.295C14.64 17.67 15.015 18.39 15.015 19.515C15.015 21.12 15 22.41 15 22.815C15 23.13 15.225 23.505 15.825 23.385C18.2072 22.5807 20.2772 21.0497 21.7437 19.0074C23.2101 16.965 23.9993 14.5143 24 12C24 5.37 18.63 0 12 0Z" />
                    </svg>
                    GitHub
                  </a>
                </li>
                <li>
                  <a href="https://www.linkedin.com/in/john-buzzard-a73051316/" target="_blank" rel="noopener noreferrer" className="text-sm text-foreground/70 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group flex items-center">
                    <svg className="w-4 h-4 mr-2 text-foreground/40 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    LinkedIn
                  </a>
                </li>
                <li>
                  
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 