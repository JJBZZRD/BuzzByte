import Link from 'next/link';

const navLinkClass = "text-foreground/80 hover:text-foreground px-4 py-2 rounded-lg transition-colors hover:bg-foreground/5";

export default function Navigation() {
  return (
    <div className="md:flex items-center gap-1 hidden">
      <Link href="/projects" className={navLinkClass}>
        Projects
      </Link>
      <Link href="/about" className={navLinkClass}>
        About
      </Link>
      <Link href="/contact" className={navLinkClass}>
        Contact
      </Link>
    </div>
  );
} 