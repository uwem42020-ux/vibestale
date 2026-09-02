import Link from 'next/link';

export default function MediaPage() {
  const sections = [
    {
      title: '🎵 Music',
      description: 'Tracks, previews, and music videos.',
      href: '/music',
    },
    {
      title: '🎤 Music News',
      description: 'Latest news from the music industry.',
      href: '/music-news',
    },
    {
      title: '🎬 Movies',
      description: 'Nigerian and foreign films.',
      href: '/movies',
    },
    {
      title: '🔴 Live TV',
      description: 'Watch live news from trusted channels.',
      href: '/live-tv',
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6">📺 Media Hub</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="block bg-gray-900 rounded-xl shadow-sm hover:shadow-md p-6 transition"
          >
            <h2 className="text-xl font-bold text-white">{section.title}</h2>
            <p className="text-sm text-gray-400 mt-2">{section.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}