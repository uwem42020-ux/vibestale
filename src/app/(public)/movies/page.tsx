import Link from 'next/link';
import { searchYouTube } from '@/lib/youtube/search';
import { fetchYouTubePlaylist } from '@/lib/youtube/playlist';
import { fetchArchiveMovies } from '@/lib/movies/archive';
import PlaylistSection from '@/components/movies/PlaylistSection';

export const dynamic = 'force-dynamic';

type Movie = {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  overview: string;
};

async function fetchMovies(url: string): Promise<Movie[]> {
  try {
    const response = await fetch(url, { next: { revalidate: 21600 } });
    if (!response.ok) return [];
    const data = await response.json();
    const movies = (data.results || []) as Movie[];
    return movies.filter((movie) => movie.poster_path !== null);
  } catch (error) {
    console.error('Failed to fetch movies:', error);
    return [];
  }
}

async function fetchYouTubeMovies(): Promise<any[]> {
  const queries = [
    'Nigerian Nollywood full movie 2026',
    'Nollywood full movie 2025',
    'African full movie 2026',
  ];
  try {
    const results = await Promise.all(queries.map((q) => searchYouTube(q, 4)));
    return results.flat();
  } catch (error) {
    console.error('YouTube fetch failed:', error);
    return [];
  }
}

export default async function MoviesPage() {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    return <p className="text-red-500">TMDB_API_KEY is not set.</p>;
  }

  const [nollywood, foreign, nowPlaying, upcoming, archiveMovies, playlist1Data, playlist2Data] =
    await Promise.all([
      fetchMovies(
        `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_origin_country=NG&sort_by=popularity.desc&page=1`
      ),
      fetchMovies(
        `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&page=1`
      ),
      fetchMovies(
        `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&page=1`
      ),
      fetchMovies(
        `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&page=1`
      ),
      fetchArchiveMovies('nollywood', 20),
      fetchYouTubePlaylist('PL6jGPxDsfalAMGeQzPpEE3BGs7Ya7Mupc', 8),
      fetchYouTubePlaylist('PL6jGPxDsfalCoKySf7UMeVVw6fjRcB-bm', 8),
    ]);

  const youtubeMovies = await fetchYouTubeMovies();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-white">🎬 Movies</h1>

      <MovieSection title="🇳🇬 Nollywood" movies={nollywood} />
      <MovieSection title="🌍 Foreign Top Rated" movies={foreign} />
      <MovieSection title="🆕 Now Playing" movies={nowPlaying} />
      <MovieSection title="⏳ Upcoming International" movies={upcoming} />

      {/* Archive Movies Section */}
      {archiveMovies.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-3">🗂️ Classic/Free Movies</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x">
            {archiveMovies.map((movie) => (
              <a
                key={movie.identifier}
                href={`https://archive.org/details/${movie.identifier}`}
                target="_blank"
                rel="noopener noreferrer"
                className="snap-start flex-shrink-0 w-40 sm:w-48 bg-gray-900 rounded-xl shadow-sm hover:shadow-md overflow-hidden"
              >
                <img
                  src={`https://archive.org/services/img/${movie.identifier}`}
                  alt={movie.title}
                  className="w-full aspect-[2/3] object-cover"
                  loading="lazy"
                />
                <div className="p-2">
                  <h3 className="text-xs font-semibold text-white line-clamp-1">{movie.title}</h3>
                  {movie.year && <p className="text-[10px] text-gray-400 mt-1">{movie.year}</p>}
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Playlist sections with Load more */}
      <PlaylistSection
        title="🎞️ NollyTimes TV Full Movies"
        playlistId="PL6jGPxDsfalAMGeQzPpEE3BGs7Ya7Mupc"
        initialVideos={playlist1Data.videos}
        initialPageToken={playlist1Data.nextPageToken}
      />

      <PlaylistSection
        title="🎞️ African Movies Plus"
        playlistId="PL6jGPxDsfalCoKySf7UMeVVw6fjRcB-bm"
        initialVideos={playlist2Data.videos}
        initialPageToken={playlist2Data.nextPageToken}
      />

      {/* YouTube Search Results */}
      {youtubeMovies.length > 0 && (
        <VideoSection title="📺 Full Movies on YouTube" videos={youtubeMovies} />
      )}
    </div>
  );
}

function MovieSection({ title, movies }: { title: string; movies: Movie[] }) {
  if (movies.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold text-white mb-3">{title}</h2>
      <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x">
        {movies.map((movie) => (
          <Link
            key={movie.id}
            href={`/movie/${movie.id}`}
            className="snap-start flex-shrink-0 w-40 sm:w-48 bg-gray-900 rounded-xl shadow-sm hover:shadow-md overflow-hidden"
          >
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full aspect-[2/3] object-cover"
              loading="lazy"
            />
            <div className="p-2">
              <h3 className="text-xs font-semibold text-white line-clamp-1">{movie.title}</h3>
              <p className="text-[10px] text-gray-400 mt-1">{movie.release_date?.substring(0, 4)}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function VideoSection({ title, videos }: { title: string; videos: any[] }) {
  if (videos.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold text-white mb-3">{title}</h2>
      <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x">
        {videos.map((video) => (
          <div key={video.videoId} className="snap-start flex-shrink-0 w-40 sm:w-48">
            <a
              href={`https://www.youtube.com/watch?v=${video.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-gray-900 rounded-xl shadow-md overflow-hidden"
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full aspect-video object-cover"
                loading="lazy"
              />
              <div className="p-2">
                <h3 className="text-xs font-semibold text-white line-clamp-2">{video.title}</h3>
              </div>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}