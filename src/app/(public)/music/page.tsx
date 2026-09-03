import { createClient } from '@/lib/supabase/server';
import AudioCard from '@/components/music/AudioCard';
import Sidebar from '@/components/Sidebar';
import LiveClock from '@/components/LiveClock';
import { Music, Headphones, PlayCircle, ListMusic } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 300;

export default async function MusicPage() {
  const supabase = await createClient();
  const serverNow = new Date().toLocaleString('en-US', { timeZone: 'Africa/Lagos' });

  const { data: tracks, error } = await supabase
    .from('audio_tracks')
    .select('id, title, artist, youtube_video_id, thumbnail_url')
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    console.error('Error fetching audio tracks:', error);
    return (
      <div className="md:flex md:gap-8">
        <Sidebar initialTime={serverNow} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <div className="text-[var(--accent)] text-lg font-semibold mb-2">
                Music Coming Soon
              </div>
              <p className="text-[var(--text-secondary)]">
                We're setting up our music library. Check back soon!
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="md:flex md:gap-8">
      <Sidebar initialTime={serverNow} />

      <div className="flex-1 min-w-0">
        <div className="md:hidden mb-4">
          <LiveClock initialTime={serverNow} />
        </div>

        {/* Header */}
        <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6 mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--accent)]/5 rounded-full blur-3xl" />
          <div className="relative flex items-center gap-4">
            <div className="w-14 h-14 bg-[var(--accent)]/10 rounded-xl flex items-center justify-center">
              <Music className="w-7 h-7 text-[var(--accent)]" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] font-space-grotesk">
                Latest Music
              </h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                Listen to the hottest Nigerian tracks
              </p>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-4 text-center">
            <Headphones className="w-5 h-5 text-[var(--accent)] mx-auto mb-2" />
            <div className="text-lg font-bold text-[var(--text-primary)]">{tracks?.length || 0}</div>
            <div className="text-xs text-[var(--text-tertiary)]">Tracks</div>
          </div>
          <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-4 text-center">
            <PlayCircle className="w-5 h-5 text-[var(--accent)] mx-auto mb-2" />
            <div className="text-lg font-bold text-[var(--text-primary)]">New</div>
            <div className="text-xs text-[var(--text-tertiary)]">Music</div>
          </div>
          <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-4 text-center">
            <ListMusic className="w-5 h-5 text-[var(--accent)] mx-auto mb-2" />
            <div className="text-lg font-bold text-[var(--text-primary)]">Playlist</div>
            <div className="text-xs text-[var(--text-tertiary)]">Ready</div>
          </div>
        </div>

        {/* Track List */}
        {tracks && tracks.length > 0 ? (
          <div className="space-y-3">
            {tracks.map((track) => (
              <AudioCard key={track.id} track={track} />
            ))}
          </div>
        ) : (
          <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-12 text-center">
            <Music className="w-16 h-16 text-[var(--text-tertiary)] mx-auto mb-4" />
            <p className="text-[var(--text-secondary)] text-lg mb-2">No audio tracks yet</p>
            <p className="text-[var(--text-tertiary)]">Check back soon for new music</p>
          </div>
        )}
      </div>
    </div>
  );
}