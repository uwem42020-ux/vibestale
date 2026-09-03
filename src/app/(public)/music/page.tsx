import { createClient } from '@/lib/supabase/server';
import AudioCard from '@/components/music/AudioCard';
import Sidebar from '@/components/Sidebar';
import LiveClock from '@/components/LiveClock';

export const dynamic = 'force-dynamic';
export const revalidate = 300;

export default async function MusicPage() {
  const supabase = await createClient();
  const serverNow = new Date().toLocaleString('en-US', { timeZone: 'Africa/Lagos' });

  const { data: tracks, error } = await supabase
    .from('audio_tracks')
    .select('id, title, artist, youtube_video_id, thumbnail_url')
    .order('created_at', { ascending: false })
    .limit(8);  // reduced from 20

  if (error) {
    console.error('Error fetching audio tracks:', error);
    return <div className="text-red-500">Error loading audio.</div>;
  }

  return (
    <div className="md:flex md:gap-8">
      <Sidebar initialTime={serverNow} />

      <div className="flex-1 min-w-0">
        <div className="md:hidden mb-4">
          <LiveClock initialTime={serverNow} />
        </div>

        <h1 className="text-3xl font-bold text-white mb-2">🎧 Music</h1>
        <p className="text-sm text-gray-400 mb-6">Listen to the latest Nigerian songs.</p>

        {tracks && tracks.length > 0 ? (
          <div className="space-y-3">
            {tracks.map((track) => (
              <AudioCard key={track.id} track={track} />
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No audio tracks yet.</p>
        )}
      </div>
    </div>
  );
}