import { createClient } from '@/lib/supabase/server';
import VideoCard from '@/components/music/VideoCard';
import Sidebar from '@/components/Sidebar';
import LiveClock from '@/components/LiveClock';

export const dynamic = 'force-dynamic';
export const revalidate = 300;

export default async function MusicVideosPage() {
  const supabase = await createClient();
  const serverNow = new Date().toLocaleString('en-US', { timeZone: 'Africa/Lagos' });

  const { data: videos, error } = await supabase
    .from('youtube_videos')
    .select('id, title, artist, youtube_video_id, thumbnail_url')
    .order('created_at', { ascending: false })
    .limit(8);  // reduced from 20

  if (error) {
    console.error('Error fetching music videos:', error);
    return <div className="text-red-500">Error loading videos.</div>;
  }

  return (
    <div className="md:flex md:gap-8">
      <Sidebar initialTime={serverNow} />

      <div className="flex-1 min-w-0">
        <div className="md:hidden mb-4">
          <LiveClock initialTime={serverNow} />
        </div>

        <h1 className="text-3xl font-bold text-white mb-2">🎬 Music Videos</h1>
        <p className="text-sm text-gray-400 mb-6">Watch the latest Nigerian music videos.</p>

        {videos && videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No music videos yet.</p>
        )}
      </div>
    </div>
  );
}