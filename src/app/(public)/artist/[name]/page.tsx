import Link from 'next/link';
import { notFound } from 'next/navigation';
import TrackCard from '@/components/music/TrackCard';
import { ARTISTS } from '@/lib/artists';
import { searchYouTube } from '@/lib/youtube/search';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ name: string }>;
};

type ArtistTrack = {
  trackId?: number;
  trackName: string;
  artistName: string;
  artworkUrl100: string;
  previewUrl: string | null;
  trackViewUrl: string;
  collectionName?: string;
  primaryGenreName?: string;
  releaseDate?: string;
};

type Album = {
  collectionId: number;
  collectionName: string;
  artworkUrl100: string;
  releaseDate: string;
};

type ArtistInfo = {
  artistName?: string;
  primaryGenreName?: string;
  artworkUrl100?: string;
};

type YouTubeVideo = {
  videoId: string;
  title: string;
  thumbnail: string;
};

async function fetchArtistInfo(artist: string): Promise<ArtistInfo | null> {
  try {
    const response = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(artist)}&entity=allArtist&limit=1`
    );
    if (!response.ok) return null;
    const data = await response.json();
    if (!data.results || data.results.length === 0) return null;
    const result = data.results[0];
    return {
      artistName: result.artistName,
      primaryGenreName: result.primaryGenreName,
      artworkUrl100: result.artworkUrl100,
    };
  } catch {
    return null;
  }
}

async function fetchArtistAlbums(artist: string): Promise<Album[]> {
  try {
    const response = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(artist)}&entity=album&limit=10`
    );
    if (!response.ok) return [];
    const data = await response.json();
    return (data.results || []).map((item: any) => ({
      collectionId: item.collectionId,
      collectionName: item.collectionName,
      artworkUrl100: item.artworkUrl100,
      releaseDate: item.releaseDate?.substring(0, 10) || '',
    }));
  } catch {
    return [];
  }
}

async function fetchArtistTracks(artist: string): Promise<ArtistTrack[]> {
  try {
    const response = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(artist)}&entity=song&limit=20`
    );
    if (!response.ok) return [];
    const data = await response.json();
    return data.results || [];
  } catch {
    return [];
  }
}

async function fetchYouTubeVideos(artist: string): Promise<YouTubeVideo[]> {
  const queries = [
    `${artist} official music video`,
    `${artist} audio`,
    `${artist} full song`,
  ];

  const allResults = await Promise.all(
    queries.map((q) => searchYouTube(q, 3))
  );

  const flat = allResults.flat();
  const unique = Array.from(
    new Map(flat.map((v) => [v.videoId, v])).values()
  );

  return unique.slice(0, 6); // show up to 6 videos
}

async function fetchYouTubeImage(artist: string): Promise<string | null> {
  try {
    const videos = await searchYouTube(`${artist} official`, 1);
    return videos[0]?.thumbnail || null;
  } catch {
    return null;
  }
}

async function fetchFirstTrackImage(artist: string): Promise<string | null> {
  const tracks = await fetchArtistTracks(artist);
  return tracks[0]?.artworkUrl100 || null;
}

export default async function ArtistPage({ params }: Props) {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);

  const [artistInfo, albums, tracks, youtubeVideos] = await Promise.all([
    fetchArtistInfo(decodedName),
    fetchArtistAlbums(decodedName),
    fetchArtistTracks(decodedName),
    fetchYouTubeVideos(decodedName),
  ]);

  const playableTracks = tracks.filter((track) => track.previewUrl);

  let artistImage =
    artistInfo?.artworkUrl100 ||
    playableTracks[0]?.artworkUrl100 ||
    albums[0]?.artworkUrl100 ||
    null;

  if (!artistImage) {
    artistImage = await fetchYouTubeImage(decodedName);
  }

  // Similar artists
  const similarArtistNames = ARTISTS
    .filter((a) => a.toLowerCase() !== decodedName.toLowerCase())
    .sort(() => 0.5 - Math.random())
    .slice(0, 8);

  const similarArtists = await Promise.all(
    similarArtistNames.map(async (name) => ({
      name,
      image: (await fetchFirstTrackImage(name)) || (await fetchYouTubeImage(name)),
    }))
  );

  return (
    <div className="max-w-5xl mx-auto">
      {/* Artist header */}
      <div className="flex items-center gap-4 mb-8">
        {artistImage ? (
          <img
            src={artistImage.replace('100x100', '400x400')}
            alt={artistInfo?.artistName || decodedName}
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-500">
            {(artistInfo?.artistName || decodedName).charAt(0)}
          </div>
        )}
        <div>
          <h1 className="text-3xl font-bold">{artistInfo?.artistName || decodedName}</h1>
          {artistInfo?.primaryGenreName && (
            <p className="text-sm text-gray-500">{artistInfo.primaryGenreName}</p>
          )}
        </div>
      </div>

      {/* Videos Section (YouTube) */}
      {youtubeVideos.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Videos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {youtubeVideos.map((video) => (
              <div key={video.videoId} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="aspect-video">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube-nocookie.com/embed/${video.videoId}`}
                    title={video.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-semibold line-clamp-1">{video.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Albums */}
      {albums.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Albums</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {albums.map((album) => (
              <div key={album.collectionId} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <img
                  src={album.artworkUrl100.replace('100x100', '400x400')}
                  alt={album.collectionName}
                  className="w-full aspect-square object-cover"
                  loading="lazy"
                />
                <div className="p-3">
                  <h3 className="text-sm font-semibold line-clamp-1">{album.collectionName}</h3>
                  <p className="text-xs text-gray-500 mt-1">{album.releaseDate}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Top Tracks (iTunes previews) */}
      <h2 className="text-2xl font-bold mb-4">Top Tracks</h2>
      {playableTracks.length === 0 ? (
        <p>No playable iTunes previews, but check the videos above.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {playableTracks.map((track) => (
            <TrackCard
              key={track.trackId || `${track.trackName}-${track.artistName}-${track.collectionName || ''}`}
              track={track}
            />
          ))}
        </div>
      )}

      {/* Similar Artists */}
      {similarArtists.length > 0 && (
        <section className="mt-8 mb-12">
          <h2 className="text-2xl font-bold mb-4">Similar Artists</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x">
            {similarArtists.map((artist) => (
              <div key={artist.name} className="snap-start flex-shrink-0">
                <Link
                  href={`/artist/${encodeURIComponent(artist.name)}`}
                  className="flex flex-col items-center gap-2 w-20"
                >
                  {artist.image ? (
                    <img
                      src={artist.image.replace('100x100', '300x300')}
                      alt={artist.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 hover:border-green-500 transition"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-500">
                      {artist.name.charAt(0)}
                    </div>
                  )}
                  <span className="text-xs text-center text-gray-700 line-clamp-2 leading-tight">
                    {artist.name}
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}