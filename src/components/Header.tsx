'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTheme } from './ThemeProvider';
import { Sun, Moon, X, LayoutGrid } from 'lucide-react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'General', href: '/category/general' },
    { label: 'Politics', href: '/category/politics' },
    { label: 'Business', href: '/category/business' },
    { label: 'Sports', href: '/category/sports' },
    { label: 'Tech', href: '/category/tech' },
    { label: 'Entertainment', href: '/category/entertainment' },
    { label: 'Live News', href: '/live-news' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        scrolled
          ? 'glass shadow-lg border-transparent'
          : 'bg-transparent border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 relative">
        {/* Logo left */}
        <div className="flex items-center justify-between">
          <Link href="/" className="flex-shrink-0 group z-10">
            <Image
              src={theme === 'dark' ? '/whitelogo.png' : '/blacklogo.png'}
              alt="VibeStale"
              className="h-10 w-auto transition-transform group-hover:scale-105"
              width={120}
              height={40}
              priority
            />
          </Link>

          {/* Right actions */}
          <div className="flex items-center gap-2 z-10">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-[var(--surface-hover)] transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Mobile menu button (grid icon) */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-full hover:bg-[var(--surface-hover)] transition-colors"
              aria-label="Menu"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <LayoutGrid className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Perfectly centered desktop navigation */}
        <nav className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`whitespace-nowrap text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-[var(--accent)]'
                    : 'text-[var(--text-primary)] hover:text-[var(--accent)]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute left-0 right-0 top-full glass border-t border-[var(--border)] z-50">
            <nav className="flex flex-col p-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-lg font-medium transition-colors ${
                    pathname === link.href
                      ? 'text-[var(--accent)]'
                      : 'text-[var(--accent)]'
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}