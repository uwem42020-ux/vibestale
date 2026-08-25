import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateMusicReview } from '@/lib/ai/music-analysis';

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = await createClient();
  const { data: pending } = await supabase
    .from('music_tracks')
    .select('id, title')
    .eq('ai_analysis_status', 'pending')
    .limit(10);

  if (!pending || pending.length === 0) return NextResponse.json({ processed: 0 });

  const results = { processed: 0, failed: 0 };
  for (const track of pending) {
    try {
      const analysis = await generateMusicReview(track.title);
      await supabase
        .from('music_tracks')
        .update({
          ai_review: analysis.review,
          genre: analysis.genre,
          ai_confidence_score: analysis.confidenceScore,
          ai_analysis_status: 'completed',
          updated_at: new Date().toISOString(),
        })
        .eq('id', track.id);
      results.processed++;
    } catch (error) {
      console.error('Music analysis failed:', error);
      await supabase.from('music_tracks').update({ ai_analysis_status: 'failed' }).eq('id', track.id);
      results.failed++;
    }
  }
  return NextResponse.json(results);
}