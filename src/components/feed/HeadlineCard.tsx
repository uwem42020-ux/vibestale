'use client';

import Link from 'next/link';
import SourceBadge from '@/components/SourceBadge';
import WhatsAppShare from '@/components/share/WhatsAppShare';

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
  return new Intl.DateTimeFormat('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
}

export default function HeadlineCard({ headline }: { headline: Headline }) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const shareUrl = `${baseUrl}/headline/${headline.slug}`;

  // Fallback image (can be a local neutral placeholder or a reliable stock)
  const fallbackImage = '/placeholder.png'; // optional: create a simple PNG in public

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.onerror = null; // prevent infinite loop
    e.currentTarget.src = fallbackImage;
  };

  return (
    <article className="bg-gray-900 rounded-xl shadow-sm hover:shadow-md transition p-3 flex gap-3 items-start">
      <Link href={`/headline/${headline.slug}`} className="flex-shrink-0">
        {headline.image_url ? (
          <img
            src={`/api/image?url=${encodeURIComponent(headline.image_url)}`}
            alt={headline.title}
            className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg"
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={handleImageError}
          />
        ) : (
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-800 rounded-lg flex items-center justify-center text-gray-500">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </Link>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
          {headline.sources && (
            <SourceBadge name={headline.sources.name} baseUrl={headline.sources.base_url} />
          )}
          <span>·</span>
          <span>{timeAgo(headline.published_at)}</span>
        </div>

        <Link href={`/headline/${headline.slug}`}>
          <h3 className="text-sm sm:text-base font-semibold text-white leading-snug line-clamp-2 hover:text-green-400">
            {headline.title}
          </h3>
        </Link>

        {headline.ai_summary && (
          <p className="mt-1 text-xs text-gray-300 line-clamp-2">
            <span className="inline-block bg-green-900 text-green-200 text-[9px] px-1.5 py-0.5 rounded mr-1 align-middle">
              AI
            </span>
            {headline.ai_summary}
          </p>
        )}

        <div className="mt-2 flex items-center justify-between">
          <a
            href={headline.original_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-500 text-xs font-medium hover:underline"
          >
            Read →
          </a>
          <WhatsAppShare title={headline.title} url={shareUrl} />
        </div>
      </div>
    </article>
  );
}