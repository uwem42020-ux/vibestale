import TrackRow from '@/components/music/TrackRow';

export const dynamic = 'force-dynamic';

const ARTISTS = [
  'Burna Boy', 'Wizkid', 'Davido', 'Tiwa Savage', 'Asake', 'Rema',
  'Ayra Starr', 'Fireboy DML', 'Omah Lay', 'Tems', 'Kizz Daniel',
  'BNXN', 'Ruger', 'Ckay', 'Joeboy', 'Lojay', 'Victony',
  'Bella Shmurda', 'Zinoleesky', 'Shallipopi', 'Odumodublvck',
  'Qing Madi', 'Llona', 'Ayo Maff', 'Fave',
  '2Baba', 'D\'banj', 'P-Square', 'Flavour', 'Olamide', 'Yemi Alade', 'Simi',
  'Sinach', 'Mercy Chinwo', 'Nathaniel Bassey', 'Joe Praize',
  'Falz', 'Ladipoe', 'Blaqbonez', 'Ycee',
  'Tay Iwar', 'Nonso Amadi', 'Amaarae', 'Wurld',
  'Naira Marley', 'Lil Kesh', '9ice',
  'Patoranking', 'Runtown', 'Skales'
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
      `https://itunes.apple.com/search?term=${encodeURIComponent(artist)}&entity=song&limit=5`,
      { next: { revalidate: 21600 } }
    );
    if (!response.ok) return [];
    const data = await response.json();
    return data.results || [];
  } catch (error) {
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
  const playable = results.flat().filter((track) => track.previewUrl);
  const unique = Array.from(new Map(playable.map((track) => [`${track.trackName}-${track.artistName}`, track])).values());

  const artistMap = new Map<string, Artist>();
  for (const track of unique) {
    if (!artistMap.has(track.artistName)) {
      artistMap.set(track.artistName, {
        name: track.artistName,
        imageUrl: track.artworkUrl100?.replace('100x100', '300x300') || '/placeholder.png',
        link: track.trackViewUrl,
      });
    }
  }
  const popularArtists = Array.from(artistMap.values()).slice(0, 15);

  const sections: Record<string, Track[]> = {};
  for (const track of unique) {
    const genre = getGenre(track.primaryGenreName);
    if (!sections[genre]) sections[genre] = [];
    sections[genre].push(track);
  }

  const orderedSections = ['Afrobeats & Pop', 'Hip-Hop & Rap', 'Gospel', 'R&B & Soul', 'Reggae & Dancehall', 'Alternative', 'Other'];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">🎵 Music</h1>
        <p className="text-sm text-gray-500 mt-1">Curated Nigerian tracks — 30-second previews.</p>
      </div>

      {popularArtists.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Popular Artists</h2>
          <div className="flex gap-3 overflow-x-auto pb-3 -mx-4 px-4 snap-x">
            {popularArtists.map((artist) => (
              <div key={artist.name} className="snap-start flex-shrink-0">
                <div className="flex flex-col items-center gap-1.5 w-16">
                  <a href={artist.link} className="block">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200 hover:border-green-500 transition">
                      <img src={artist.imageUrl} alt={artist.name} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                  </a>
                  <span className="text-[10px] text-center text-gray-700 line-clamp-1 leading-tight max-w-[64px]">{artist.name}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {orderedSections.map((sectionName) => {
        const tracks = sections[sectionName] || [];
        return <TrackRow key={sectionName} title={sectionName} tracks={tracks} max={10} />;
      })}
    </div>
  );
}