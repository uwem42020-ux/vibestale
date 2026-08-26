import Link from 'next/link';

type Artist = {
  name: string;
  imageUrl: string;
  link: string;
};

export default function ArtistCircle({ artist }: { artist: Artist }) {
  return (
    <Link
      href={artist.link}
      className="flex flex-col items-center gap-2 w-20 flex-shrink-0"
    >
      <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200 hover:border-green-500 transition">
        <img
          src={artist.imageUrl}
          alt={artist.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <span className="text-xs text-center text-gray-700 line-clamp-2 leading-tight">
        {artist.name}
      </span>
    </Link>
  );
}