'use client';

import { useState, useEffect } from 'react';
import { useAudio } from './AudioProvider';

type Video = {
  id: string;
  title: string;
  artist: string;
  youtube_video_id: string;
  thumbnail_url: string | null;
};

type VideoCardProps = {
  video: Video;
};

export default function VideoCard({ video }: VideoCardProps) {
  const [playing, setPlaying] = useState(false);
  const { closePlayer } = useAudio();

  const thumbnail =
    video.thumbnail_url ||
    `https://img.youtube.com/vi/${video.youtube_video_id}/hqdefault.jpg`;

  // Stop this video if audio starts or another video is played
  useEffect(() => {
    const stop = () => setPlaying(false);
    const handleVideoPlay = (e: Event) => {
      const custom = e as CustomEvent<{ id: string }>;
      if (custom.detail?.id !== video.id) setPlaying(false);
    };

    window.addEventListener('vibestale:audio-play', stop);
    window.addEventListener('vibestale:video-play', handleVideoPlay as EventListener);

    return () => {
      window.removeEventListener('vibestale:audio-play', stop);
      window.removeEventListener('vibestale:video-play', handleVideoPlay as EventListener);
    };
  }, [video.id]);

  const handlePlay = () => {
    // Stop any playing audio preview
    closePlayer();

    // Notify other videos to stop
    window.dispatchEvent(
      new CustomEvent('vibestale:video-play', { detail: { id: video.id } })
    );

    setPlaying(true);
  };

  return (
    <article className="bg-white rounded-xl shadow-sm hover:shadow-md overflow-hidden w-64 flex-shrink-0">
      {playing ? (
        <div className="relative aspect-video">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.youtube_video_id}?autoplay=1&rel=0`}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>
      ) : (
        <button
          onClick={handlePlay}
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