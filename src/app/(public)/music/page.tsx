import { createClient } from '@/lib/supabase/server';
import MusicCard from '@/components/music/MusicCard';

export const dynamic = 'force-dynamic';

export default async function MusicPage() {
  const supabase = await createClient();
  const { data: tracks } = await supabase
    .from('music_tracks')
    .select('*')
    .eq('ai_analysis_status', 'completed')
    .order('release_date', { ascending: false })
    .limit(20);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">🎵 New Music</h1>
      {!tracks || tracks.length === 0 ? (
        <p>No new music yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {tracks.map((track) => (
            <MusicCard key={track.id} track={track} />
          ))}
        </div>
      )}
    </div>
  );
}