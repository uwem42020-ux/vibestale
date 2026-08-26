'use client';

import { useState } from 'react';

type Video = {
  id: string;
  title: string;
  artist: string;
  youtube_video_id: string;
  thumbnail_url: string | null;
};

export default function VideoCard({ video }: { video: Video }) {
  const [playing, setPlaying] = useState(false);

  const thumbnail = video.thumbnail_url || `https://img.youtube.com/vi/${video.youtube_video_id}/hqdefault.jpg`;

  return (
    <article className="bg-white rounded-xl shadow-sm hover:shadow-md overflow-hidden w-64 flex-shrink-0">
      {playing ? (
        <div className="aspect-video">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${video.youtube_video_id}?autoplay=1&rel=0`}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      ) : (
        <button
          onClick={() => setPlaying(true)}
          className="relative block w-full aspect-video bg-gray-100"
        >
          <img
            src={thumbnail}
            alt={video.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </span>
          </span>
        </button>
      )}

      <div className="p-3">
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">{video.title}</h3>
        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{video.artist}</p>
      </div>
    </article>
  );
}