// components/Header.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from './ThemeProvider';
import { Sun, Moon, Menu, X, Search, Bell } from 'lucide-react';

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

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? 'glass shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 group">
            <img
              src={theme === 'dark' ? '/whitelogo.png' : '/blacklogo.png'}
              alt="VibeStale"
              className="h-10 w-auto transition-transform group-hover:scale-105"
              width={2172}
              height={724}
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`font-medium transition-all hover:text-[var(--accent)] ${
                pathname === '/' ? 'text-[var(--accent)]' : 'text-[var(--text-primary)]'
              }`}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={`font-medium transition-all hover:text-[var(--accent)] ${
                pathname === '/about' ? 'text-[var(--accent)]' : 'text-[var(--text-primary)]'
              }`}
            >
              About
            </Link>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <button 
              className="p-2 rounded-full hover:bg-[var(--surface-hover)] transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Notifications */}
            <button 
              className="p-2 rounded-full hover:bg-[var(--surface-hover)] transition-colors relative"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--accent)] rounded-full" />
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-[var(--surface-hover)] transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-full hover:bg-[var(--surface-hover)] transition-colors"
              aria-label="Menu"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
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
              <Link
                href="/"
                className={`text-lg font-medium transition-colors ${
                  pathname === '/' ? 'text-[var(--accent)]' : 'text-[var(--text-primary)]'
                }`}
                onClick={() => setMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/about"
                className={`text-lg font-medium transition-colors ${
                  pathname === '/about' ? 'text-[var(--accent)]' : 'text-[var(--text-primary)]'
                }`}
                onClick={() => setMenuOpen(false)}
              >
                About
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}