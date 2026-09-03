import { fetchChannelVideos } from '@/lib/youtube/channel';
import { fetchYouTubePlaylist } from '@/lib/youtube/playlist';
import VideoRow from '@/components/movies/VideoRow';
import Sidebar from '@/components/Sidebar';
import LiveClock from '@/components/LiveClock';

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
  const serverNow = new Date().toLocaleString('en-US', { timeZone: 'Africa/Lagos' });

  // Fetch videos for each section
  const [nigerian, actionData, comedy] = await Promise.all([
    Promise.all(nigerianMovieChannels.map((ch) => fetchChannelVideos(ch, 2))).then((res) => res.flat()),
    fetchYouTubePlaylist(actionPlaylistId, 8),
    Promise.all(comedyChannels.map((ch) => fetchChannelVideos(ch, 2))).then((res) => res.flat()),
  ]);

  // Correct: use actionData.videos (array)
  const action = actionData.videos || [];

  return (
    <div className="md:flex md:gap-8">
      <Sidebar initialTime={serverNow} />

      <div className="flex-1 min-w-0">
        <div className="md:hidden mb-4">
          <LiveClock initialTime={serverNow} />
        </div>

        <h1 className="text-3xl font-bold text-white mb-2">🎬 Movies</h1>
        <p className="text-sm text-gray-400 mb-6">Nigerian movies, action, and comedy.</p>

        <VideoRow title="🇳🇬 Nigerian Movies" videos={nigerian} />
        <VideoRow title="💥 Action Movies" videos={action} />
        <VideoRow title="😂 Comedy" videos={comedy} />
      </div>
    </div>
  );
}