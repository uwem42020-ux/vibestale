'use client';

import { useState, useTransition } from 'react';

type Video = {
  videoId: string;
  title: string;
  thumbnail: string;
};

interface PlaylistSectionProps {
  title: string;
  playlistId: string;
  initialVideos: Video[];
  initialPageToken?: string | null;
}

export default function PlaylistSection({
  title,
  playlistId,
  initialVideos,
  initialPageToken = null,
}: PlaylistSectionProps) {
  const [videos, setVideos] = useState<Video[]>(initialVideos);
  const [pageToken, setPageToken] = useState<string | null>(initialPageToken);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  const loadMore = async () => {
    if (!pageToken) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(
        `/api/youtube/playlist?playlistId=${encodeURIComponent(playlistId)}&pageToken=${encodeURIComponent(pageToken)}`
      );
      if (!res.ok) {
        throw new Error('Failed to load more');
      }
      const data = await res.json();
      startTransition(() => {
        setVideos((prev) => [...prev, ...data.videos]);
        setPageToken(data.nextPageToken);
      });
    } catch (err: any) {
      setError(err.message || 'Error loading more videos');
    } finally {
      setLoading(false);
    }
  };

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

      {pageToken && (
        <button
          onClick={loadMore}
          disabled={loading}
          className="mt-2 px-4 py-2 bg-gray-800 text-white text-sm rounded hover:bg-gray-700 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Load more'}
        </button>
      )}

      {error && <p className="text-red-400 text-sm mt-2">{error}</p>}

      <a
        href={`https://www.youtube.com/playlist?list=${playlistId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="ml-2 text-green-500 text-sm hover:underline"
      >
        View full playlist ↗
      </a>
    </section>
  );
}