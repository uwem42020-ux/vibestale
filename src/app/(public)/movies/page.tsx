import Link from 'next/link';

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
    return data.results || [];
  } catch {
    return [];
  }
}

export default async function MoviesPage() {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    return <p className="text-red-500">TMDB_API_KEY is not set.</p>;
  }

  const [nigerian, foreign] = await Promise.all([
    fetchMovies(
      `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&region=NG&with_original_language=en|yo|ha|ig&sort_by=popularity.desc&page=1`
    ),
    fetchMovies(
      `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&page=1`
    ),
  ]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">🎬 Movies</h1>

      <h2 className="text-xl font-bold mb-3">🇳🇬 Nigerian Movies</h2>
      <MovieRow movies={nigerian} />

      <h2 className="text-xl font-bold mb-3 mt-8">🌍 Foreign Movies</h2>
      <MovieRow movies={foreign} />
    </div>
  );
}

function MovieRow({ movies }: { movies: Movie[] }) {
  if (movies.length === 0) return <p>No movies found.</p>;

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x">
      {movies.map((movie) => (
        <Link
          key={movie.id}
          href={`/movie/${movie.id}`}
          className="snap-start flex-shrink-0 w-40 sm:w-48 bg-white rounded-xl shadow-sm hover:shadow-md overflow-hidden"
        >
          {movie.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full aspect-[2/3] object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full aspect-[2/3] bg-gray-200 flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
          <div className="p-2">
            <h3 className="text-sm font-semibold line-clamp-1">{movie.title}</h3>
            <p className="text-xs text-gray-500 mt-1">{movie.release_date?.substring(0, 4)}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}