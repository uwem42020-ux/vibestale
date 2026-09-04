import { createClient } from '@/lib/supabase/server';
import CategoryHeadlinesList from '@/components/feed/CategoryHeadlinesList';
import Sidebar from '@/components/Sidebar';
import LiveClock from '@/components/LiveClock';
import Link from 'next/link';

type Props = { params: Promise<{ slug: string }> };

const headlineCategories = [
  { slug: 'general', label: 'General' },
  { slug: 'politics', label: 'Politics' },
  { slug: 'business', label: 'Business' },
  { slug: 'sports', label: 'Sports' },
  { slug: 'tech', label: 'Tech' },
  { slug: 'entertainment', label: 'Entertainment' },
];

const mediaCategories = [
  { label: 'Music', href: '/music' },
  { label: 'Celebrity News', href: '/music-news' },
  { label: 'Movies', href: '/movies' },
  { label: 'Live TV', href: '/live-tv' },
  { label: 'Memes', href: '/memes' },
];

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  const serverNow = new Date().toLocaleString('en-US', { timeZone: 'Africa/Lagos' });

  let items: any[] = [];

  if (slug === 'entertainment') {
    const { data: generalEntertainment } = await supabase
      .from('headlines')
      .select('*, sources(name, base_url)')
      .eq('category', 'entertainment')
      .eq('ai_analysis_status', 'completed')
      .eq('status', 'published')
      .is('deleted_at', null)
      .order('published_at', { ascending: false })
      .limit(10);

    const { data: celebrityNews } = await supabase
      .from('entertainment_news')
      .select('*, entertainment_sources(name, base_url)')
      .eq('ai_analysis_status', 'completed')
      .is('deleted_at', null)
      .order('published_at', { ascending: false })
      .limit(10);

    const normalisedCelebrity = (celebrityNews || []).map((item: any) => ({
      ...item,
      sources: item.entertainment_sources || null,
      category: 'celebrity',
    }));

    items = [...(generalEntertainment || []), ...normalisedCelebrity]
      .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
      .slice(0, 10);
  } else {
    const { data: headlines, error } = await supabase
      .from('headlines')
      .select('*, sources(name, base_url)')
      .eq('category', slug)
      .eq('ai_analysis_status', 'completed')
      .eq('status', 'published')
      .is('deleted_at', null)
      .order('published_at', { ascending: false })
      .limit(10);

    if (error) return <div className="text-red-500">Error loading headlines.</div>;

    items = headlines || [];
  }

  const topPicks = items.slice(0, 5);

  const AdvertBox = () => (
    <div className="bg-white border border-gray-300 rounded-xl p-4 text-center shadow-sm">
      <p className="text-sm text-gray-600 mb-2">Advertise with us</p>
      <a
        href="https://wa.me/2348038887589"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 font-semibold text-lg hover:text-blue-800 transition-colors"
      >
        WhatsApp: +234 803 888 7589
      </a>
    </div>
  );

  return (
    <div className="md:flex md:gap-8">
      <Sidebar initialTime={serverNow} />

      <div className="flex-1 min-w-0">
        {/* Mobile nav */}
        <div className="md:hidden mb-4">
          <LiveClock initialTime={serverNow} />
        </div>
        <div className="md:hidden mb-4 relative">
          <div className="flex items-center gap-2 overflow-x-auto pb-3 no-scrollbar">
            <span className="flex-shrink-0 px-3 py-1.5 bg-green-700 text-white text-sm font-semibold rounded-full">Headlines</span>
            {headlineCategories.map((cat) => (
              <Link key={cat.slug} href={`/category/${cat.slug}`} className={`flex-shrink-0 px-3 py-1.5 text-sm rounded-full ${slug === cat.slug ? 'bg-green-700 text-white' : 'bg-gray-800 text-gray-200'}`}>
                {cat.label}
              </Link>
            ))}
            {mediaCategories.map((item) => (
              <Link key={item.href} href={item.href} className="flex-shrink-0 px-3 py-1.5 bg-gray-800 text-gray-200 text-sm rounded-full">
                {item.label}
              </Link>
            ))}
          </div>
          <div className="pointer-events-none absolute right-0 top-0 bottom-3 w-8 bg-gradient-to-l from-black to-transparent" />
        </div>

        {/* Category Heading */}
        <h1 className="inline-block bg-white text-black border border-gray-300 rounded-xl px-5 py-2 text-2xl font-bold mb-6 font-space-grotesk">
          {slug.charAt(0).toUpperCase() + slug.slice(1)}
        </h1>

        {/* Mobile Advert */}
        <div className="md:hidden mb-4">
          <AdvertBox />
        </div>

        {/* Mobile Top Picks slider */}
        {topPicks.length > 0 && (
          <div className="md:hidden mb-6">
            <div className="flex gap-4 overflow-x-auto pb-3 no-scrollbar">
              {topPicks.map((pick) => (
                <Link key={pick.id} href={`/headline/${pick.slug}`} className="flex-shrink-0 w-44 bg-white rounded-xl border border-gray-300 p-3">
                  {pick.image_url ? (
                    <img src={`/api/image?url=${encodeURIComponent(pick.image_url)}`} alt={pick.title} className="w-full h-24 object-cover rounded-lg mb-2" loading="lazy" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-full h-24 bg-gray-100 rounded-lg mb-2 flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                  )}
                  <span className="text-sm font-medium text-black line-clamp-2">{pick.title}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Desktop layout with Top Picks + Advert sidebar */}
        <div className="md:flex md:gap-6">
          <div className="flex-1 min-w-0">
            <CategoryHeadlinesList initialItems={items} slug={slug} />
          </div>

          {topPicks.length > 0 && (
            <aside className="hidden md:block w-72 flex-shrink-0">
              <div className="sticky top-24 space-y-4">
                <div className="bg-white rounded-xl border border-gray-300 p-4">
                  <h2 className="text-lg font-bold text-black mb-3">Top Picks</h2>
                  <div className="space-y-3">
                    {topPicks.map((pick, index) => (
                      <Link key={pick.id} href={`/headline/${pick.slug}`} className="flex items-center gap-3 group">
                        <span className="text-xl font-bold text-black w-6">{index + 1}</span>
                        {pick.image_url ? (
                          <img src={`/api/image?url=${encodeURIComponent(pick.image_url)}`} alt={pick.title} className="w-12 h-12 object-cover rounded-lg" loading="lazy" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          </div>
                        )}
                        <span className="text-sm text-black line-clamp-2 group-hover:text-blue-600">{pick.title}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Desktop Advert */}
                <AdvertBox />
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}