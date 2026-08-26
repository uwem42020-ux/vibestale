'use client';

type Track = {
  trackName: string;
  artistName: string;
  artworkUrl100: string;
  previewUrl: string | null;
  trackViewUrl: string;
  collectionName?: string;
  primaryGenreName?: string;
};

export default function TrackCard({ track }: { track: Track }) {
  const coverImage = track.artworkUrl100?.replace('100x100', '600x600') || '/placeholder.png';

  return (
    <article className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition overflow-hidden flex flex-col w-44 sm:w-48">
      <img
        src={coverImage}
        alt={track.trackName}
        className="w-full aspect-square object-cover"
        loading="lazy"
      />

      <div className="p-3 flex flex-col flex-1">
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">{track.trackName}</h3>
        <p className="text-xs text-gray-600 mt-0.5 line-clamp-1">{track.artistName}</p>
        {track.collectionName && (
          <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">{track.collectionName}</p>
        )}

        {track.primaryGenreName && (
          <span className="mt-2 inline-block bg-purple-100 text-purple-700 text-[10px] px-2 py-0.5 rounded-full self-start">
            {track.primaryGenreName}
          </span>
        )}

        <div className="mt-auto pt-3 space-y-2">
          {track.previewUrl && (
            <audio controls src={track.previewUrl} className="w-full h-8" />
          )}
          <a
            href={track.trackViewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-700 text-xs font-medium hover:underline block"
          >
            Open in Music ↗
          </a>
        </div>
      </div>
    </article>
  );
}