type Track = {
  trackName: string;
  artistName: string;
  artworkUrl100: string;
  previewUrl: string | null;
  trackViewUrl: string;
  collectionName?: string;
};

export default function TrackCard({ track }: { track: Track }) {
  return (
    <article className="bg-white rounded-xl shadow-sm hover:shadow-md overflow-hidden">
      <img
        src={track.artworkUrl100?.replace('100x100', '300x300') || '/placeholder.png'}
        alt={track.trackName}
        className="w-full h-40 object-cover"
        loading="lazy"
      />
      <div className="p-3">
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">{track.trackName}</h3>
        <p className="text-xs text-gray-500 mt-1 line-clamp-1">{track.artistName}</p>
        {track.collectionName && (
          <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{track.collectionName}</p>
        )}
        <div className="mt-2 flex items-center justify-between">
          {track.previewUrl && (
            <audio controls src={track.previewUrl} className="w-full h-8" />
          )}
          <a
            href={track.trackViewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-700 text-xs font-medium hover:underline whitespace-nowrap ml-2"
          >
            Open ?
          </a>
        </div>
      </div>
    </article>
  );
}
