"use client";

import Link from 'next/link';
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
};

function getFallbackImage(slug: string): string {
  return `https://picsum.photos/seed/${slug}/400/300`;
}

export default function HeadlineCard({ headline }: { headline: Headline }) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const shareUrl = `${baseUrl}/headline/${headline.slug}`;

  const fallbackImage = getFallbackImage(headline.slug);
  const imageSrc = headline.image_url || fallbackImage;

  return (
    <article className="bg-white rounded-lg shadow p-4 hover:shadow-md transition flex gap-4">
      <img
        src={imageSrc}
        alt={headline.title}
        className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
        referrerPolicy="no-referrer"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = fallbackImage;
        }}
      />

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <Link href={`/headline/${headline.slug}`} className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900 hover:text-green-700">
              {headline.title}
            </h2>
          </Link>
          <WhatsAppShare title={headline.title} url={shareUrl} />
        </div>

        {headline.ai_summary && (
          <p className="mt-2 text-sm text-gray-600">
            <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded mr-1">
              AI Analysis
            </span>
            {headline.ai_summary}
          </p>
        )}

        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
          <span>Category: {headline.category || 'general'}</span>
          <a
            href={headline.original_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-700 font-medium hover:underline"
          >
            Read Full Story →
          </a>
        </div>
      </div>
    </article>
  );
}