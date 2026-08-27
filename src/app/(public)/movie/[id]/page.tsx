import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ id: string }>;
};

type MovieDetail = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  genres: { name: string }[];
  videos?: { results: any[] };
};

async function fetchMovie(id: string): Promise<MovieDetail | null> {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.TMDB_API_KEY}&append_to_response=videos`
    );
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

async function searchYouTube(query: string): Promise<string | null> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) return null;
  const url = new URL('https://www.googleapis.com/youtube/v3/search');
  url.searchParams.set('part', 'snippet');
  url.searchParams.set('q', query);
  url.searchParams.set('type', 'video');
  url.searchParams.set('maxResults', '1');
  url.searchParams.set('key', apiKey);
  try {
    const response = await fetch(url.toString());
    if (!response.ok) return null;
    const data = await response.json();
    return data.items?.[0]?.id?.videoId || null;
  } catch {
    return null;
  }
}

export default async function MoviePage({ params }: Props) {
  const { id } = await params;
  const movie = await fetchMovie(id);
  if (!movie) notFound();

  const trailer = movie.videos?.results?.find(
    (v: any) => v.type === 'Trailer' || v.site === 'YouTube'
  );
  const trailerId = trailer?.key || null;

  const fullMovieId = await searchYouTube(`${movie.title} full movie official`);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-6">
        {movie.poster_path ? (
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="w-48 rounded-xl shadow"
          />
        ) : (
          <div className="w-48 h-72 bg-gray-200 rounded-xl flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">{movie.title}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {movie.release_date?.substring(0, 4)} · ⭐ {movie.vote_average?.toFixed(1)}
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            {movie.genres?.map((g) => (
              <span key={g.name} className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                {g.name}
              </span>
            ))}
          </div>
          <p className="text-sm text-gray-700 mt-4">{movie.overview}</p>

          {trailerId && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">Trailer</h2>
              <div className="aspect-video max-w-xl">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube-nocookie.com/embed/${trailerId}`}
                  title={`${movie.title} trailer`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {fullMovieId && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">Full Movie</h2>
              <div className="aspect-video max-w-xl">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube-nocookie.com/embed/${fullMovieId}`}
                  title={`${movie.title} full movie`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}