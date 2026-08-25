import Link from 'next/link';

type MusicTrack = {
  id: string;
  title: string;
  artist: string | null;
  slug: string;
  original_url: string;
  cover_image_url: string | null;
  genre: string | null;
  ai_review: string | null;
  release_date: string | null;
};

function getFallbackCover(slug: string): string {
  return `https://picsum.photos/seed/${slug}/600/400`;
}

export default function MusicCard({ track }: { track: MusicTrack }) {
  const cover = track.cover_image_url || getFallbackCover(track.slug);
  return (
    <article className="bg-white rounded-xl shadow-sm hover:shadow-md overflow-hidden">
      <img src={cover} alt={track.title} className="w-full h-32 sm:h-40 object-cover" />
      <div className="p-3">
        <h2 className="text-sm font-semibold line-clamp-2">{track.title}</h2>
        {track.artist && <p className="text-xs text-gray-500 mt-1">{track.artist}</p>}
        {track.genre && <span className="inline-block bg-purple-100 text-purple-700 text-[10px] px-2 py-0.5 rounded mt-1">{track.genre}</span>}
        {track.ai_review && <p className="text-xs text-gray-600 mt-1 line-clamp-2">{track.ai_review}</p>}
        <a
          href={track.original_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-2 text-green-700 text-xs font-medium hover:underline"
        >
          Listen/Read →
        </a>
      </div>
    </article>
  );
}