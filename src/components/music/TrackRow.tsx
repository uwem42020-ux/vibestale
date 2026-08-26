import TrackCard from './TrackCard';

type Track = {
  trackName: string;
  artistName: string;
  artworkUrl100: string;
  previewUrl: string | null;
  trackViewUrl: string;
  collectionName?: string;
  primaryGenreName?: string;
};

export default function TrackRow({ title, tracks, max = 10 }: { title: string; tracks: Track[]; max?: number }) {
  if (!tracks || tracks.length === 0) return null;
  const visibleTracks = tracks.slice(0, max);
  return (
    <section className="mb-6">
      <h2 className="text-lg font-bold text-gray-900 mb-2">{title}</h2>
      <div className="flex gap-3 overflow-x-auto pb-3 -mx-4 px-4 snap-x">
        {visibleTracks.map((track) => (
          <div key={`${track.trackName}-${track.artistName}`} className="snap-start flex-shrink-0">
            <TrackCard track={track} />
          </div>
        ))}
      </div>
    </section>
  );
}