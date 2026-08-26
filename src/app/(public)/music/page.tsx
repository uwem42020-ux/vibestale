import TrackRow from '@/components/music/TrackRow';

export const dynamic = 'force-dynamic';

const ARTISTS = [
  // Afrobeats / Mainstream
  'Burna Boy', 'Wizkid', 'Davido', 'Tiwa Savage', 'Asake', 'Rema',
  'Ayra Starr', 'Fireboy DML', 'Omah Lay', 'Tems', 'Kizz Daniel',
  'BNXN', 'Seyi Vibez', 'Ruger', 'Ckay', 'Joeboy', 'Lojay', 'Victony',
  'Bella Shmurda', 'Zinoleesky', 'Mohbad', 'Portable', 'Shallipopi',
  'Odumodublvck', 'Bloody Civilian', 'Qing Madi', 'Llona', 'Ayo Maff',
  'Fave', 'Gyakie',

  // Veteran / Legends
  '2Baba', 'D\'banj', 'P-Square', 'Don Jazzy', 'Flavour', 'Phyno',
  'Olamide', 'M.I Abaga', 'Ice Prince', 'Banky W', 'Timaya', 'Kcee',
  'Tekno', 'Yemi Alade', 'Simi', 'Adekunle Gold', 'Niniola', 'Reekado Banks',

  // Gospel
  'Sinach', 'Mercy Chinwo', 'Tope Alabi', 'Nathaniel Bassey', 'Dunsin Oyekan',
  'Joe Praize', 'Ada Ehi',

  // Hip-Hop / Rap
  'Falz', 'Ladipoe', 'Blaqbonez', 'PsychoYP', 'Ycee', 'Dremo',

  // Alternative / R&B
  'Tay Iwar', 'Nonso Amadi', 'Odunsi', 'Santi', 'Cruel Santino', 'Amaarae',
  'Tems', 'Wurld', 'Show Dem Camp', 'Ric Hassani',

  // Street / Indigenous
  'Naira Marley', 'Lil Kesh', 'CDQ', 'Oritse Femi', 'Qdot', '9ice',
  'Small Doctor', 'Slimcase', 'Mr Real',

  // Reggae / Dancehall
  'Patoranking', 'Jesse Jagz', 'Runtown', 'Skales'
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

type Artist = {
  name: string;
  imageUrl: string;
  link: string;
};

async function fetchArtistTracks(artist: string): Promise<Track[]> {
  try {
    const response = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(artist)}&entity=song&limit=25`,
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

function getGenre(primaryGenreName?: string): string {
  if (!primaryGenreName) return 'Other';
  const genre = primaryGenreName.toLowerCase();
  if (genre.includes('afro') || genre.includes('pop') || genre.includes('dance')) return 'Afrobeats & Pop';
  if (genre.includes('hip') || genre.includes('rap')) return 'Hip-Hop & Rap';
  if (genre.includes('gospel') || genre.includes('christian')) return 'Gospel';
  if (genre.includes('r&b') || genre.includes('soul')) return 'R&B & Soul';
  if (genre.includes('reggae') || genre.includes('dancehall')) return 'Reggae & Dancehall';
  if (genre.includes('alternative')) return 'Alternative';
  return 'Other';
}

export default async function MusicPage() {
  const results = await Promise.all(ARTISTS.map(fetchArtistTracks));
  const allTracks = results.flat();

  // Unique tracks
  const uniqueTracks = Array.from(
    new Map(allTracks.map((track) => [`${track.trackName}-${track.artistName}`, track])).values()
  );

  // Build circular artist list (use first track's artwork for each artist)
  const artistMap = new Map<string, Artist>();
  for (const track of uniqueTracks) {
    if (!artistMap.has(track.artistName)) {
      artistMap.set(track.artistName, {
        name: track.artistName,
        imageUrl: track.artworkUrl100?.replace('100x100', '300x300') || '/placeholder.png',
        link: track.trackViewUrl,
      });
    }
  }
  const popularArtists = Array.from(artistMap.values()).slice(0, 20);

  // Group tracks by genre
  const sections: Record<string, Track[]> = {};
  for (const track of uniqueTracks) {
    const genre = getGenre(track.primaryGenreName);
    if (!sections[genre]) sections[genre] = [];
    sections[genre].push(track);
  }

  const orderedSections = [
    'Afrobeats & Pop',
    'Hip-Hop & Rap',
    'Gospel',
    'R&B & Soul',
    'Reggae & Dancehall',
    'Alternative',
    'Other',
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">🎵 Music</h1>
        <p className="text-sm text-gray-500 mt-1">
          Curated Nigerian tracks by genre — 30‑second previews from iTunes.
        </p>
      </div>

      {/* Popular Artists (circular) */}
      {popularArtists.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Popular Artists</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x">
            {popularArtists.map((artist) => (
              <div key={artist.name} className="snap-start flex-shrink-0">
                {/* ArtistCircle */}
                <div className="flex flex-col items-center gap-2 w-20">
                  <a href={artist.link} className="block">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200 hover:border-green-500 transition">
                      <img src={artist.imageUrl} alt={artist.name} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                  </a>
                  <span className="text-xs text-center text-gray-700 line-clamp-2 leading-tight">
                    {artist.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Genre sections */}
      {orderedSections.map((sectionName) => {
        const tracks = sections[sectionName] || [];
        return <TrackRow key={sectionName} title={sectionName} tracks={tracks} />;
      })}
    </div>
  );
}