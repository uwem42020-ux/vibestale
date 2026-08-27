import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import TrackRow from '@/components/music/TrackRow';
import VideoCard from '@/components/music/VideoCard';
import { ARTISTS } from '@/lib/artists';

export const dynamic = 'force-dynamic';

type Track = {
  trackName: string;
  artistName: string;
  artworkUrl100: string;
  previewUrl: string | null;
  trackViewUrl: string;
  collectionName?: string;
  primaryGenreName?: string;
  youtubeVideoId?: string;
};

type PopularArtist = {
  name: string;
  imageUrl: string | null;
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
  } catch {
    return [];
  }
}

// Fetch a profile image for an artist (from first track's artwork)
async function fetchArtistImage(artist: string): Promise<string | null> {
  const tracks = await fetchArtistTracks(artist);
  return tracks[0]?.artworkUrl100 || null;
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
  const supabase = await createClient();

  // ========== 1. Fetch iTunes tracks for all artists (for genre sections) ==========
  const results = await Promise.all(ARTISTS.map(fetchArtistTracks));
  const allTracks = results.flat();
  const playableTracks = allTracks.filter((track) => track.previewUrl);
  const uniqueTracks = Array.from(
    new Map(playableTracks.map((track) => [`${track.trackName}-${track.artistName}`, track])).values()
  );

  // ========== 2. Fetch YouTube videos ==========
  const { data: youtubeVideos } = await supabase
    .from('youtube_videos')
    .select('id, title, artist, youtube_video_id, thumbnail_url')
    .order('created_at', { ascending: false })
    .limit(20);

  // Map YouTube IDs to tracks (for audio tracks if needed)
  const youtubeMap = new Map<string, string>();
  if (youtubeVideos) {
    for (const video of youtubeVideos) {
      const key = `${video.title.toLowerCase()}-${video.artist.toLowerCase()}`;
      youtubeMap.set(key, video.youtube_video_id);
    }
  }

  const tracksWithYouTube = uniqueTracks.map((track) => {
    const key = `${track.trackName.toLowerCase()}-${track.artistName.toLowerCase()}`;
    return { ...track, youtubeVideoId: youtubeMap.get(key) };
  });

  // ========== 3. Build Popular Artists directly from ARTISTS ==========
  // Remove duplicates while preserving order
  const uniqueArtists = Array.from(new Set(ARTISTS));
  const popularArtistNames = uniqueArtists.slice(0, 20); // show first 20

  // Fetch image for each popular artist in parallel
  const popularArtists: PopularArtist[] = await Promise.all(
    popularArtistNames.map(async (name) => ({
      name,
      imageUrl: await fetchArtistImage(name),
    }))
  );

  // ========== 4. Group audio tracks by genre ==========
  const sections: Record<string, Track[]> = {};
  for (const track of tracksWithYouTube) {
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
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">🎵 Music</h1>
          <p className="text-sm text-gray-500 mt-1">
            Curated Nigerian tracks — 30‑second previews, full videos, and music news.
          </p>
        </div>
        <Link href="/music-news" className="text-sm text-green-700 hover:underline whitespace-nowrap">
          Music News →
        </Link>
      </div>

      {/* ========== Popular Artists (from ARTISTS list) ========== */}
      {popularArtists.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Popular Artists</h2>
          <div className="flex gap-3 overflow-x-auto pb-3 -mx-4 px-4 snap-x">
            {popularArtists.map((artist) => (
              <div key={artist.name} className="snap-start flex-shrink-0">
                <Link
                  href={`/artist/${encodeURIComponent(artist.name)}`}
                  className="flex flex-col items-center gap-1.5 w-16"
                >
                  {artist.imageUrl ? (
                    <img
                      src={artist.imageUrl.replace('100x100', '300x300')}
                      alt={artist.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 hover:border-green-500 transition"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-500">
                      {artist.name.charAt(0)}
                    </div>
                  )}
                  <span className="text-[10px] text-center text-gray-700 line-clamp-2 leading-tight max-w-[64px]">
                    {artist.name}
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ========== Music Videos ========== */}
      {youtubeVideos && youtubeVideos.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">🎬 Music Videos</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x">
            {youtubeVideos.map((video) => (
              <div key={video.id} className="snap-start flex-shrink-0">
                <VideoCard video={video} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ========== Audio Track Sections ========== */}
      {orderedSections.map((sectionName) => {
        const tracks = sections[sectionName] || [];
        return <TrackRow key={sectionName} title={sectionName} tracks={tracks} max={10} />;
      })}
    </div>
  );
}