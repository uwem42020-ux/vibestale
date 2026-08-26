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

export default function TrackRow({ title, tracks }: { title: string; tracks: Track[] }) {
  if (tracks.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-3">{title}</h2>
      <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x">
        {tracks.map((track) => (
          <div key={`${track.trackName}-${track.artistName}`} className="snap-start flex-shrink-0">
            <TrackCard track={track} />
          </div>
        ))}
      </div>
    </section>
  );
}