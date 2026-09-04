'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Newspaper, Music, TrendingUp, Clock } from 'lucide-react';

const headlineCategories = [
  { slug: 'general', label: 'General', icon: '📰' },
  { slug: 'politics', label: 'Politics', icon: '🏛️' },
  { slug: 'business', label: 'Business', icon: '💼' },
  { slug: 'sports', label: 'Sports', icon: '⚽' },
  { slug: 'tech', label: 'Tech', icon: '💻' },
  { slug: 'entertainment', label: 'Entertainment', icon: '🎬' },
];

const mediaCategories = [
  { label: 'Music', href: '/music', icon: '🎵' },
  { label: 'Music Videos', href: '/music-videos', icon: '🎤' },
  { label: 'Movies', href: '/movies', icon: '🎬' },
  { label: 'Live TV', href: '/live-tv', icon: '📺' },
  { label: 'Memes', href: '/memes', icon: '😂' },
];

export default function Sidebar({ initialTime }: { initialTime?: string | null }) {
  const pathname = usePathname();
  const [headlinesOpen, setHeadlinesOpen] = useState(true);
  const [mediaOpen, setMediaOpen] = useState(false);

  useEffect(() => {
    const isMediaRoute = mediaCategories.some((item) => pathname.startsWith(item.href));
    if (isMediaRoute) {
      setHeadlinesOpen(false);
      setMediaOpen(true);
    } else {
      setHeadlinesOpen(true);
      setMediaOpen(false);
    }
  }, [pathname]);

  const date = initialTime ? new Date(initialTime) : new Date();
  const dateString = new Intl.DateTimeFormat('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Africa/Lagos',
  }).format(date);

  const timeString = new Intl.DateTimeFormat('en-NG', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZone: 'Africa/Lagos',
  }).format(date);

  return (
    <aside className="hidden md:block w-64 flex-shrink-0">
      <div className="sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto no-scrollbar space-y-4">
        {/* Date/Time Card */}
        <div className="bg-[var(--surface)] rounded-xl p-4 shadow-sm border border-[var(--border)]">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-[var(--accent)]" />
            <span className="text-xs text-[var(--text-tertiary)]">{dateString}</span>
          </div>
          <div className="text-2xl font-bold text-[var(--text-primary)] font-space-grotesk">
            {timeString} <span className="text-sm font-normal">WAT</span>
          </div>
        </div>

        {/* Headlines Section */}
        <div className="bg-[var(--surface)] rounded-xl overflow-hidden border border-[var(--border)]">
          <button
            onClick={() => setHeadlinesOpen(!headlinesOpen)}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-[var(--surface-hover)] transition-colors"
          >
            <span className="flex items-center gap-2">
              <Newspaper className="w-4 h-4 text-[var(--accent)]" />
              <span className="text-sm font-semibold text-[var(--text-primary)]">Headlines</span>
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform ${headlinesOpen ? 'rotate-180' : ''}`} />
          </button>

          {headlinesOpen && (
            <div className="px-2 pb-2 space-y-1">
              {headlineCategories.map((cat) => {
                const active = pathname === `/category/${cat.slug}`;
                return (
                  <Link
                    key={cat.slug}
                    href={`/category/${cat.slug}`}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                      active
                        ? 'bg-[var(--accent)] text-white font-semibold shadow-md'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <span className="text-lg">{cat.icon}</span>
                    <span>{cat.label}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Media Section */}
        <div className="bg-[var(--surface)] rounded-xl overflow-hidden border border-[var(--border)]">
          <button
            onClick={() => setMediaOpen(!mediaOpen)}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-[var(--surface-hover)] transition-colors"
          >
            <span className="flex items-center gap-2">
              <Music className="w-4 h-4 text-[var(--accent)]" />
              <span className="text-sm font-semibold text-[var(--text-primary)]">Media</span>
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform ${mediaOpen ? 'rotate-180' : ''}`} />
          </button>

          {mediaOpen && (
            <div className="px-2 pb-2 space-y-1">
              {mediaCategories.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                      active
                        ? 'bg-[var(--accent)] text-white font-semibold shadow-md'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}