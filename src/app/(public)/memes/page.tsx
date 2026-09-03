import { fetchChannelVideos } from '@/lib/youtube/channel';
import MemeCard from '@/components/memes/MemeCard';
import Sidebar from '@/components/Sidebar';
import LiveClock from '@/components/LiveClock';

export const dynamic = 'force-dynamic';
export const revalidate = 300;

const memeChannels = [
  '@Laughcable',
  '@GemStoneMemes',
  '@lasisielenu',
  '@FunnyZone-xu9pp',
  '@LayiWasabi',
];

export default async function MemesPage() {
  const serverNow = new Date().toLocaleString('en-US', { timeZone: 'Africa/Lagos' });

  const memeVideos = await Promise.all(
    memeChannels.map((ch) => fetchChannelVideos(ch, 3))
  ).then((res) => res.flat());

  return (
    <div className="md:flex md:gap-8">
      <Sidebar initialTime={serverNow} />

      <div className="flex-1 min-w-0">
        <div className="md:hidden mb-4">
          <LiveClock initialTime={serverNow} />
        </div>

        <h1 className="text-3xl font-bold text-white mb-2">😂 Memes</h1>
        <p className="text-sm text-gray-400 mb-6">Funny videos from popular Nigerian creators.</p>

        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x no-scrollbar">
          {memeVideos.map((video) => (
            <MemeCard key={video.videoId} video={video} />
          ))}
        </div>
      </div>
    </div>
  );
}