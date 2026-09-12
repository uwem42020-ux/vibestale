import LiveTVCard from '@/components/livetv/LiveTVCard';
import PortraitAdBanner from '@/components/PortraitAdBanner';
import LiveClock from '@/components/LiveClock';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 300;

const channels = [
  {
    name: 'Channels Television',
    videoId: 'W8nThq62Vb4',
    logo: '/livetv/chnnels cover.jpg',
    description: 'Nigeria’s leading 24/7 news channel',
  },
  {
    name: 'TVC News Nigeria',
    videoId: '2qlPEcq6Qkw',
    logo: '/livetv/TVC cover.jpg',
    description: 'Breaking news and current affairs',
  },
  {
    name: 'Arise News',
    videoId: 'Fy_03Aorpq8',
    logo: '/livetv/arise new cover.png',
    description: 'Global news from an African perspective',
  },
  {
    name: 'Al Jazeera English',
    videoId: 'gCNeDWCI0vo',
    logo: '/livetv/Al Jazeera.jfif',
    description: 'International news and documentaries',
  },
  {
    name: 'CNN Africa',
    videoId: 'GotlA1KKWoo',
    logo: '/livetv/cnn cover.jfif',
    description: 'African news from CNN',
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vibestale.com';
  return {
    title: 'Live News Channels in Nigeria | Watch Live TV Online',
    description:
      'Watch live news from trusted Nigerian and international channels including Channels TV, Arise News, CNN Africa, and more. Stream online free.',
    alternates: {
      canonical: `${baseUrl}/live-news`,
    },
    openGraph: {
      title: 'Live News Channels in Nigeria | Watch Live TV Online',
      description:
        'Watch live news from trusted Nigerian and international channels including Channels TV, Arise News, CNN Africa, and more. Stream online free.',
      type: 'website',
      url: `${baseUrl}/live-news`,
      siteName: 'Vibestale',
    },
    twitter: {
      card: 'summary',
      title: 'Live News Channels in Nigeria | Watch Live TV Online',
      description:
        'Watch live news from trusted Nigerian and international channels including Channels TV, Arise News, CNN Africa, and more. Stream online free.',
    },
  };
}

export default async function LiveNewsPage() {
  const serverNow = new Date().toLocaleString('en-US', { timeZone: 'Africa/Lagos' });
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vibestale.com';

  // Breadcrumb structured data
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Live News',
        item: `${baseUrl}/live-news`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="md:flex md:gap-8">
        {/* Portrait advert banner (desktop left) */}
        <PortraitAdBanner />

        <div className="flex-1 min-w-0">
          <div className="md:hidden mb-4">
            <LiveClock initialTime={serverNow} />
          </div>

          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">🔴 Live News</h1>
          <p className="text-sm text-gray-400 mb-6">Watch live news from trusted channels.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {channels.map((channel) => (
              <LiveTVCard key={channel.videoId} channel={channel} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}