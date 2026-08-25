'use client';

import Link from 'next/link';
import WhatsAppShare from '@/components/share/WhatsAppShare';
import SourceBadge from '@/components/SourceBadge';

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

function getFallbackImage(slug: string): string {
  return `https://picsum.photos/seed/${slug}/600/400`;
}

function timeAgo(dateString: string | null): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) {
    return diffMins <= 1 ? 'just now' : `${diffMins} min ago`;
  }
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  }
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  }
  return new Intl.DateTimeFormat('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export default function HeadlineCard({ headline }: { headline: Headline }) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const shareUrl = `${baseUrl}/headline/${headline.slug}`;

  const fallbackImage = getFallbackImage(headline.slug);
  const imageSrc = headline.image_url || fallbackImage;

  return (
    <article className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden group">
      <Link href={`/headline/${headline.slug}`} className="block relative">
        <img
          src={imageSrc}
          alt={headline.title}
          className="w-full h-32 sm:h-40 object-cover group-hover:scale-105 transition-transform duration-300"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        <span className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full">
          {headline.category || 'general'}
        </span>
      </Link>

      <div className="p-3">
        <Link href={`/headline/${headline.slug}`}>
          <h2 className="text-sm sm:text-base font-semibold text-gray-900 leading-snug line-clamp-2 hover:text-green-700">
            {headline.title}
          </h2>
        </Link>

        {headline.ai_summary && (
          <p className="mt-1 text-xs text-gray-600 line-clamp-2">
            <span className="inline-block bg-green-100 text-green-800 text-[9px] px-1.5 py-0.5 rounded mr-1 align-middle">
              AI
            </span>
            {headline.ai_summary}
          </p>
        )}

        <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-2 min-w-0">
            {headline.sources && (
              <SourceBadge name={headline.sources.name} baseUrl={headline.sources.base_url} />
            )}
            <span className="truncate">{timeAgo(headline.published_at)}</span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={headline.original_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-700 font-medium hover:underline whitespace-nowrap"
            >
              Read
            </a>
            <WhatsAppShare title={headline.title} url={shareUrl} />
          </div>
        </div>
      </div>
    </article>
  );
}