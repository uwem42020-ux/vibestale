'use client';

import Link from 'next/link';
import { useTheme } from '@/components/ThemeProvider';
import { MessageCircle, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();
  const { theme } = useTheme();

  // Custom SVG icons for social media
  const socialIcons = [
    {
      name: 'Facebook',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      href: '#',
      label: 'Facebook',
    },
    {
      name: 'Twitter',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      href: '#',
      label: 'Twitter/X',
    },
    {
      name: 'Instagram',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
      href: '#',
      label: 'Instagram',
    },
    {
      name: 'YouTube',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      ),
      href: '#',
      label: 'YouTube',
    },
  ];

  return (
    <footer className="bg-[var(--surface)] border-t border-[var(--border)] mt-auto">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <img
                src={theme === 'dark' ? '/whitelogo.png' : '/blacklogo.png'}
                alt="VibeStale"
                className="h-10 w-auto"
              />
            </Link>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
              AI-powered Nigerian news, music, movies, and media intelligence at your fingertips.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialIcons.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="p-2 rounded-lg bg-[var(--surface-hover)] text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-colors"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Headlines */}
          <div>
            <h3 className="text-[var(--text-primary)] font-semibold mb-4 text-sm uppercase tracking-wider">
              Headlines
            </h3>
            <ul className="space-y-2.5">
              {[
                { label: 'General', href: '/category/general' },
                { label: 'Politics', href: '/category/politics' },
                { label: 'Business', href: '/category/business' },
                { label: 'Sports', href: '/category/sports' },
                { label: 'Tech', href: '/category/tech' },
                { label: 'Entertainment', href: '/category/entertainment' },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors inline-flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-[var(--accent)] transition-all duration-300 mr-0 group-hover:mr-2" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Media */}
          <div>
            <h3 className="text-[var(--text-primary)] font-semibold mb-4 text-sm uppercase tracking-wider">
              Media
            </h3>
            <ul className="space-y-2.5">
              {[
                { label: 'Music', href: '/music' },
                { label: 'Music Videos', href: '/music-videos' },
                { label: 'Celebrity News', href: '/music-news' },
                { label: 'Movies', href: '/movies' },
                { label: 'Live TV', href: '/live-tv' },
                { label: 'Memes', href: '/memes' },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors inline-flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-[var(--accent)] transition-all duration-300 mr-0 group-hover:mr-2" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company & Legal */}
          <div>
            <h3 className="text-[var(--text-primary)] font-semibold mb-4 text-sm uppercase tracking-wider">
              Company & Legal
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors inline-flex items-center group"
                >
                  <span className="w-0 group-hover:w-2 h-px bg-[var(--accent)] transition-all duration-300 mr-0 group-hover:mr-2" />
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors inline-flex items-center group"
                >
                  <span className="w-0 group-hover:w-2 h-px bg-[var(--accent)] transition-all duration-300 mr-0 group-hover:mr-2" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors inline-flex items-center group"
                >
                  <span className="w-0 group-hover:w-2 h-px bg-[var(--accent)] transition-all duration-300 mr-0 group-hover:mr-2" />
                  Terms of Service
                </Link>
              </li>
              <li>
                <a
                  href="https://wa.me/2348038887589"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors inline-flex items-center group"
                >
                  <span className="w-0 group-hover:w-2 h-px bg-[var(--accent)] transition-all duration-300 mr-0 group-hover:mr-2" />
                  Advertise
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/2348038887589"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors inline-flex items-center group"
                >
                  <span className="w-0 group-hover:w-2 h-px bg-[var(--accent)] transition-all duration-300 mr-0 group-hover:mr-2" />
                  Contact
                </a>
              </li>
            </ul>

            {/* Contact Info */}
            <div className="mt-6 space-y-2">
              <a
                href="https://wa.me/2348038887589"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[var(--accent)]" />
                +234 803 888 7589
              </a>
              <a
                href="mailto:info@vibestale.com"
                className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
              >
                <Mail className="w-4 h-4 text-[var(--accent)]" />
                info@vibestale.com
              </a>
              <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                <MapPin className="w-4 h-4 text-[var(--accent)]" />
                Lagos, Nigeria
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-sm text-[var(--text-tertiary)]">
              © {year} VibeStale — AI-powered Nigerian news intelligence. All rights reserved.
            </p>
            
            <div className="flex items-center gap-4 text-sm text-[var(--text-tertiary)]">
              <Link href="/privacy" className="hover:text-[var(--accent)] transition-colors">
                Privacy Policy
              </Link>
              <span className="text-[var(--border)]">|</span>
              <Link href="/terms" className="hover:text-[var(--accent)] transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}