import LiveTVCard from '@/components/livetv/LiveTVCard';
import Sidebar from '@/components/Sidebar';
import LiveClock from '@/components/LiveClock';

export const dynamic = 'force-dynamic';
export const revalidate = 300;

const channels = [
  {
    name: 'Channels Television',
    videoId: 'W8nThq62Vb4',
    logo: '/livetv/chnnels cover.jpg',
    description: 'Nigeria’s leading 24/7 news channel',
  },
  {
    name: 'TVC News Nigeria',
    videoId: '2qlPEcq6Qkw',
    logo: '/livetv/TVC cover.jpg',
    description: 'Breaking news and current affairs',
  },
  {
    name: 'Arise News',
    videoId: 'Fy_03Aorpq8',
    logo: '/livetv/arise new cover.png',
    description: 'Global news from an African perspective',
  },
  {
    name: 'Al Jazeera English',
    videoId: 'gCNeDWCI0vo',
    logo: '/livetv/Al Jazeera.jfif',
    description: 'International news and documentaries',
  },
  {
    name: 'CNN Africa',
    videoId: 'GotlA1KKWoo',
    logo: '/livetv/cnn cover.jfif',
    description: 'African news from CNN',
  },
];

export default async function LiveTVPage() {
  const serverNow = new Date().toLocaleString('en-US', { timeZone: 'Africa/Lagos' });

  return (
    <div className="md:flex md:gap-8">
      <Sidebar initialTime={serverNow} />

      <div className="flex-1 min-w-0">
        <div className="md:hidden mb-4">
          <LiveClock initialTime={serverNow} />
        </div>

        <h1 className="text-3xl font-bold text-white mb-2">🔴 Live News TV</h1>
        <p className="text-sm text-gray-400 mb-6">Watch live news from trusted channels.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {channels.map((channel) => (
            <LiveTVCard key={channel.videoId} channel={channel} />
          ))}
        </div>
      </div>
    </div>
  );
}