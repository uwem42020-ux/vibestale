import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { searchYouTube } from '@/lib/youtube/search';

const SEED_TRACKS = [
  { title: 'Last Last', artist: 'Burna Boy' },
  { title: 'Essence', artist: 'Wizkid' },
  { title: 'Unavailable', artist: 'Davido' },
  { title: 'Rush', artist: 'Ayra Starr' },
  { title: 'Calm Down', artist: 'Rema' },
  { title: 'Finesse', artist: 'Pheelz' },
  { title: 'Peru', artist: 'Fireboy DML' },
  { title: 'Sability', artist: 'Ayra Starr' },
  { title: 'Buga', artist: 'Kizz Daniel' },
  { title: 'Overdose', artist: 'Mavins' },
];

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = await createClient();
  const results = { processed: 0, failed: 0 };

  for (const track of SEED_TRACKS) {
    const query = `${track.artist} - ${track.title} official`;
    try {
      const youtube = await searchYouTube(query);
      if (youtube) {
        const { error } = await supabase.from('youtube_videos').upsert(
          {
            title: track.title,
            artist: track.artist,
            youtube_video_id: youtube.videoId,
            thumbnail_url: youtube.thumbnail,
          },
          { onConflict: 'title,artist' }
        );

        if (error) {
          console.error(`Upsert failed for ${track.title}:`, error.message);
          results.failed++;
        } else {
          results.processed++;
        }
      } else {
        results.failed++;
      }
    } catch (error) {
      console.error(`YouTube search failed for ${track.title}:`, error);
      results.failed++;
    }
  }

  return NextResponse.json(results);
}