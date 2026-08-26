import TrackCard from '@/components/music/TrackCard';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const ARTISTS = [
  // Afrobeats / Mainstream
  'Burna Boy', 'Wizkid', 'Davido', 'Tiwa Savage', 'Asake', 'Rema',
  'Ayra Starr', 'Fireboy DML', 'Omah Lay', 'Tems', 'Kizz Daniel',
  'BNXN', 'Seyi Vibez', 'Ruger', 'Ckay', 'Joeboy', 'Lojay', 'Victony',
  'Bella Shmurda', 'Zinoleesky', 'Mohbad', 'Portable', 'Shallipopi',
  'Odumodublvck', 'Bloody Civilian', 'Qing Madi', 'Llona', 'Ayo Maff',
  'Fave', 'Shenseea', 'Gyakie', 'Ayra Starr',

  // Veteran / Legends
  '2Baba', 'D\'banj', 'P-Square', 'Don Jazzy', 'Flavour', 'Phyno',
  'Olamide', 'M.I Abaga', 'Ice Prince', 'Banky W', 'Timaya', 'Kcee',
  'Tekno', 'Yemi Alade', 'Simi', 'Adekunle Gold', 'Niniola', 'Reekado Banks',

  // Gospel
  'Sinach', 'Mercy Chinwo', 'Tope Alabi', 'Nathaniel Bassey', 'Dunsin Oyekan',
  'Joe Praize', 'Ada Ehi',

  // Hip‑Hop / Rap
  'Falz', 'Ladipoe', 'Blaqbonez', 'PsychoYP', 'Ycee', 'Dremo',

  // Alternative / R&B
  'Tay Iwar', 'Nonso Amadi', 'Odunsi', 'Santi', 'Cruel Santino', 'Amaarae',
  'Tems', 'Wurld', 'Show Dem Camp', 'Ric Hassani',

  // Street / Indigenous
  'Naira Marley', 'Lil Kesh', 'CDQ', 'Oritse Femi', 'Qdot', '9ice',
  'Small Doctor', 'Slimcase', 'Mr Real',

  // Reggae / Dancehall
  'Patoranking', 'Burna Boy', 'Jesse Jagz', 'Runtown', 'Skales'
];

type Track = {
  trackName: string;
  artistName: string;
  artworkUrl100: string;
  previewUrl: string | null;
  trackViewUrl: string;
  collectionName?: string;
  primaryGenreName?: string;
};

async function fetchArtistTracks(artist: string): Promise<Track[]> {
  try {
    const response = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(artist)}&entity=song&limit=3`,
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
  // Fetch tracks for all artists in parallel (limit 3 each)
  const results = await Promise.all(ARTISTS.map(fetchArtistTracks));
  const allTracks = results.flat();

  // Remove duplicates (by track name + artist)
  const uniqueTracks = Array.from(
    new Map(allTracks.map((track) => [`${track.trackName}-${track.artistName}`, track])).values()
  );

  // Shuffle and take up to 48 tracks
  const shuffled = uniqueTracks.sort(() => 0.5 - Math.random()).slice(0, 48);

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">🎵 Tracks</h1>
          <p className="text-sm text-gray-500 mt-1">
            Curated Nigerian music from iTunes — 30‑second previews.
          </p>
        </div>
        <Link
          href="/music-news"
          className="text-sm text-green-700 hover:underline whitespace-nowrap"
        >
          Music News →
        </Link>
      </div>

      {shuffled.length === 0 ? (
        <p>No tracks available right now.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {shuffled.map((track) => (
            <TrackCard key={`${track.trackName}-${track.artistName}`} track={track} />
          ))}
        </div>
      )}
    </div>
  );
}