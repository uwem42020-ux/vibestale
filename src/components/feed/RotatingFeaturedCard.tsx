'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import SourceBadge from '@/components/SourceBadge';
import ShareMenu from '@/components/share/ShareMenu';
import { Clock, TrendingUp, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

type Headline = {
  id: string;
  title: string;
  slug: string;
  ai_summary: string | null;
  source_id: string;
  category: string | null;
  published_at: string | null;
  original_url: string;
  image_url?: string | null;
  sources?: { name: string; base_url: string } | null;
};

function timeAgo(dateString: string | null): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffMins = Math.floor((now.getTime() - date.getTime()) / 60000);
  if (diffMins < 60) return diffMins <= 1 ? 'just now' : `${diffMins} min ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return new Intl.DateTimeFormat('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

interface RotatingFeaturedCardProps {
  headlines: Headline[];
  intervalMs?: number; // default 5000
}

export default function RotatingFeaturedCard({ headlines, intervalMs = 5000 }: RotatingFeaturedCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const total = headlines.length;
  const goTo = useCallback((index: number) => {
    setCurrentIndex((index + total) % total);
  }, [total]);

  const next = useCallback(() => goTo(currentIndex + 1), [goTo, currentIndex]);
  const prev = useCallback(() => goTo(currentIndex - 1), [goTo, currentIndex]);

  // Auto-play with pause when not visible or paused
  useEffect(() => {
    if (total <= 1) return;
    if (isPaused) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          timerRef.current = setInterval(next, intervalMs);
        } else {
          if (timerRef.current) clearInterval(timerRef.current);
        }
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, next, intervalMs, total]);

  // Clear timer when paused
  useEffect(() => {
    if (isPaused && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [isPaused]);

  if (!headlines || headlines.length === 0) return null;

  const current = headlines[currentIndex];
  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/headline/${current.slug}`;

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Featured badge */}
      <div className="absolute top-4 left-4 z-20">
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-[var(--accent)] text-white text-xs font-bold rounded-full shadow-lg">
          <TrendingUp className="w-3 h-3" />
          Featured
        </span>
      </div>

      {/* Image and overlay */}
      <div className="relative h-72 sm:h-80 lg:h-96">
        {headlines.map((h, i) => (
          <div
            key={h.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              i === currentIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <Link href={`/headline/${h.slug}`} className="block w-full h-full">
              {h.image_url ? (
                <Image
                  src={`/api/image?url=${encodeURIComponent(h.image_url)}`}
                  alt={h.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={i === 0}
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[var(--surface-hover)] flex items-center justify-center">
                  <svg className="w-16 h-16 text-[var(--text-tertiary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              {/* Dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            </Link>
          </div>
        ))}

        {/* Text content overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 z-10">
          <div className="flex items-center gap-2 text-xs text-white/80 mb-2 flex-wrap">
            {current.sources && (
              <SourceBadge name={current.sources.name} baseUrl={current.sources.base_url} />
            )}
            <span className="text-white/60">•</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {timeAgo(current.published_at)}
            </span>
            {current.category && (
              <span className="px-2 py-1 bg-[var(--accent)]/80 text-white rounded-full font-medium capitalize">
                {current.category}
              </span>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight font-space-grotesk">
            {current.title}
          </h2>
        </div>
      </div>

      {/* Bottom bar with summary and actions */}
      <div className="p-5 sm:p-6">
        {current.ai_summary && (
          <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed line-clamp-3 mb-4">
            {current.ai_summary}
          </p>
        )}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-[var(--border)]">
          <Link
            href={`/headline/${current.slug}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--accent)] text-white text-sm font-semibold rounded-xl hover:bg-[var(--accent-hover)] transition-colors"
          >
            Read Summary
            <ArrowRight className="w-4 h-4" />
          </Link>
          <ShareMenu title={current.title} url={shareUrl} />
        </div>
      </div>

      {/* Navigation arrows */}
      {total > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous headline"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            aria-label="Next headline"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Dots indicator */}
      {total > 1 && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {headlines.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to headline ${i + 1}`}
              className={`w-2 h-2 rounded-full transition-all ${
                i === currentIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}