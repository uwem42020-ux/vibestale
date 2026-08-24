import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateCommentary } from '@/lib/ai/commentary';

export async function GET(req: Request) {
  // Protect endpoint with cron secret
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = await createClient();

  // Get pending headlines (limit 20 per run)
  // Once you have OpenAI credits, 20 is safe. If using Gemini free fallback, reduce to 5.
  const { data: pending, error: fetchError } = await supabase
    .from('headlines')
    .select('id, title')
    .eq('ai_analysis_status', 'pending')
    .order('fetched_at', { ascending: true })
    .limit(20);

  if (fetchError || !pending || pending.length === 0) {
    return NextResponse.json({ processed: 0, message: 'No pending headlines' });
  }

  const results = { processed: 0, failed: 0 };

  for (const headline of pending) {
    try {
      const analysis = await generateCommentary(headline.title);

      const { error: updateError } = await supabase
        .from('headlines')
        .update({
          ai_summary: analysis.summary,
          ai_sentiment: analysis.sentiment,
          ai_key_entities: analysis.keyEntities,
          ai_confidence_score: analysis.confidenceScore,
          ai_analysis_status: 'completed',
          ai_model_used: 'openai', // or 'openrouter' depending on actual path
          meta_title: `${headline.title.substring(0, 55)} | VibeStale`,
          meta_description: analysis.summary.substring(0, 155),
          updated_at: new Date().toISOString(),
        })
        .eq('id', headline.id);

      if (updateError) {
        console.error(`Update failed for ${headline.id}:`, updateError.message);
        await supabase
          .from('headlines')
          .update({ ai_analysis_status: 'failed' })
          .eq('id', headline.id);
        results.failed++;
      } else {
        results.processed++;
      }
    } catch (error) {
      console.error(`AI analysis failed for ${headline.id}:`, error);
      await supabase
        .from('headlines')
        .update({ ai_analysis_status: 'failed' })
        .eq('id', headline.id);
      results.failed++;
    }
  }

  return NextResponse.json(results);
}