import TrackCard from '@/components/music/TrackCard';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const ARTISTS = [
  'Burna Boy',
  'Wizkid',
  'Davido',
  'Tiwa Savage',
  'Asake',
  'Rema',
  'Ayra Starr',
  'Fireboy DML',
  'Omah Lay',
  'Tems',
  'Kizz Daniel',
  'BNXN',
  'Seyi Vibez',
  'Ruger',
  'Ckay',
];

type Track = {
  trackName: string;
  artistName: string;
  artworkUrl100: string;
  previewUrl: string | null;
  trackViewUrl: string;
  collectionName?: string;
};

async function fetchArtistTracks(artist: string): Promise<Track[]> {
  try {
    const response = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(artist)}&entity=song&limit=5`,
      { next: { revalidate: 3600 } }
    );
    if (!response.ok) return [];
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error(`Failed to fetch tracks for ${artist}:`, error);
    return [];
  }
}

export default async function MusicPage() {
  const results = await Promise.all(ARTISTS.map(fetchArtistTracks));
  const allTracks = results.flat();

  const uniqueTracks = Array.from(
    new Map(allTracks.map((track) => [`${track.trackName}-${track.artistName}`, track])).values()
  );

  const shuffled = uniqueTracks.sort(() => 0.5 - Math.random()).slice(0, 30);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">?? Tracks</h1>
        <Link href="/music-news" className="text-sm text-green-700 hover:underline">
          Music News ?
        </Link>
      </div>

      {shuffled.length === 0 ? (
        <p>No tracks available right now.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {shuffled.map((track) => (
            <TrackCard key={`${track.trackName}-${track.artistName}`} track={track} />
          ))}
        </div>
      )}
    </div>
  );
}
