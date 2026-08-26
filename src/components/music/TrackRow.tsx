import TrackCard from './TrackCard';
import ArtistCircle from './ArtistCircle';

type Track = {
  trackName: string;
  artistName: string;
  artworkUrl100: string;
  previewUrl: string | null;
  trackViewUrl: string;
  collectionName?: string;
  primaryGenreName?: string;
};

type Artist = {
  name: string;
  imageUrl: string;
  link: string;
};

interface TrackRowProps {
  title: string;
  tracks?: Track[];
  artists?: Artist[]; // if provided, render circles instead of track cards
}

export default function TrackRow({ title, tracks, artists }: TrackRowProps) {
  const hasArtists = artists && artists.length > 0;
  const hasTracks = tracks && tracks.length > 0;

  if (!hasArtists && !hasTracks) return null;

  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-3">{title}</h2>

      {hasArtists && (
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x">
          {artists.map((artist) => (
            <div key={artist.name} className="snap-start flex-shrink-0">
              <ArtistCircle artist={artist} />
            </div>
          ))}
        </div>
      )}

      {hasTracks && (
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x">
          {tracks.map((track) => (
            <div key={`${track.trackName}-${track.artistName}`} className="snap-start flex-shrink-0">
              <TrackCard track={track} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}