import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-6">Page Not Found</h2>
        <p className="text-foreground/70 mb-8 max-w-md mx-auto">
          Sorry, the page you are looking for might have been removed or
          is temporarily unavailable.
        </p>
        <Link 
          href="/"
          className="inline-block rounded-full bg-foreground text-background hover:bg-foreground/90 transition px-8 py-3 font-medium"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
} 