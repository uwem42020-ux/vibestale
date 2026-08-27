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
  const fallbackImage = `https://picsum.photos/seed/${headline.slug}/200/200`;

  return (
    <article className="bg-gray-900 rounded-xl shadow-sm hover:shadow-md transition p-3 flex gap-3 items-start">
      <Link href={`/headline/${headline.slug}`} className="flex-shrink-0">
        <img
          src={headline.image_url || fallbackImage}
          alt={headline.title}
          className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg"
          loading="lazy"
        />
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