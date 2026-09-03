import { fetchChannelVideos } from '@/lib/youtube/channel';
import { fetchYouTubePlaylist } from '@/lib/youtube/playlist';
import { createClient } from '@/lib/supabase/server';
import VideoRow from '@/components/movies/VideoRow';
import Sidebar from '@/components/Sidebar';
import LiveClock from '@/components/LiveClock';
import { Film } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 300;

const nigerianMovieChannels = [
  '@kokmovieschannel',
  '@wapTVchannel',
  '@RuthKadiri247',
  '@mauricesamtv',
  '@OmoniOboliTV',
  '@UduakIsong',
  '@SoniaUcheTV',
  '@UcheMontanaTV',
  '@BimboAdemoyeTV',
  '@iniedotv',
  '@RealnollyTV',
  '@iBAKATV',
];

const comedyChannels = [
  '@MarkAngelComedy',
  '@samspedy',
  '@brainjottercomedian',
  '@brodashaggi',
  '@ugtoons',
  '@izahkusstudios',
  '@YawaSkits',
  '@MarkAngelTV',
  '@McShem',
  '@MrMacaroni',
];

const actionPlaylistId = 'PLum50h_rWpG5e-46sLWgZAvWrbGzms---';

export default async function MoviesPage() {
  const supabase = await createClient();
  const serverNow = new Date().toLocaleString('en-US', { timeZone: 'Africa/Lagos' });

  // Try YouTube API first
  const [nigerianResult, actionResult, comedyResult] = await Promise.allSettled([
    Promise.all(nigerianMovieChannels.slice(0, 4).map((ch) => fetchChannelVideos(ch, 2))).then((res) => res.flat()),
    fetchYouTubePlaylist(actionPlaylistId, 8),
    Promise.all(comedyChannels.slice(0, 4).map((ch) => fetchChannelVideos(ch, 2))).then((res) => res.flat()),
  ]);

  let nigerian = nigerianResult.status === 'fulfilled' ? nigerianResult.value : [];
  let action = actionResult.status === 'fulfilled' ? (actionResult.value.videos || []) : [];
  let comedy = comedyResult.status === 'fulfilled' ? comedyResult.value : [];

  // If YouTube API fails, fallback to database
  if (nigerian.length === 0 && action.length === 0 && comedy.length === 0) {
    const { data: dbVideos, error } = await supabase
      .from('audio_tracks')
      .select('id, title, artist, youtube_video_id, thumbnail_url')
      .order('created_at', { ascending: false })
      .limit(12);

    if (!error && dbVideos && dbVideos.length > 0) {
      const formattedVideos = dbVideos.map((v: any) => ({
        videoId: v.youtube_video_id,
        title: v.title,
        thumbnail: v.thumbnail_url || `https://img.youtube.com/vi/${v.youtube_video_id}/hqdefault.jpg`,
      }));
      
      // Use database videos as Nigerian Movies section
      nigerian = formattedVideos;
    }
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
              <Film className="w-7 h-7 text-[var(--accent)]" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] font-space-grotesk">
                Movies & Videos
              </h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                Nigerian movies, action, and comedy
              </p>
            </div>
          </div>
        </div>

        {/* Movie Sections */}
        <div className="space-y-8">
          {nigerian.length > 0 && (
            <VideoRow title="🎬 Featured Videos" videos={nigerian} />
          )}
          {action.length > 0 && (
            <VideoRow title="💥 Action Movies" videos={action} />
          )}
          {comedy.length > 0 && (
            <VideoRow title="😂 Comedy" videos={comedy} />
          )}
          
          {nigerian.length === 0 && action.length === 0 && comedy.length === 0 && (
            <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-12 text-center">
              <Film className="w-16 h-16 text-[var(--text-tertiary)] mx-auto mb-4" />
              <p className="text-[var(--text-secondary)] text-lg mb-2">No videos available</p>
              <p className="text-[var(--text-tertiary)]">Please check back later</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}