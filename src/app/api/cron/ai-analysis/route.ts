import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateCommentary } from '@/lib/ai/commentary';
import { fetchArticleImage } from '@/lib/news/fetchArticleImage';

export async function GET(req: Request) {
  // Protect endpoint with cron secret
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = await createClient();

  // Process News Headlines (newest first, limit 5)
  const { data: pendingHeadlines, error: headlineError } = await supabase
    .from('headlines')
    .select('id, title, original_url')
    .eq('ai_analysis_status', 'pending')
    .order('fetched_at', { ascending: false })
    .limit(5);

  if (headlineError) {
    console.error('Error fetching pending headlines:', headlineError);
    return NextResponse.json({ error: 'Failed to fetch pending headlines' }, { status: 500 });
  }

  const results = { headlines: 0, entertainment: 0, failed: 0 };

  if (pendingHeadlines && pendingHeadlines.length > 0) {
    for (const headline of pendingHeadlines) {
      try {
        const analysis = await generateCommentary(headline.title);
        const imageUrl = await fetchArticleImage(headline.original_url);

        const { error: updateError } = await supabase
          .from('headlines')
          .update({
            ai_summary: analysis.summary,
            ai_sentiment: analysis.sentiment,
            ai_key_entities: analysis.keyEntities,
            ai_confidence_score: analysis.confidenceScore,
            ai_analysis_status: 'completed',
            ai_model_used: 'openai',
            meta_title: `${headline.title.substring(0, 55)} | VibeStale`,
            meta_description: analysis.summary.substring(0, 155),
            image_url: imageUrl,
            category: analysis.category,
            updated_at: new Date().toISOString(),
          })
          .eq('id', headline.id);

        if (updateError) {
          console.error(`Update failed for headline ${headline.id}:`, updateError.message);
          await supabase.from('headlines').update({ ai_analysis_status: 'failed' }).eq('id', headline.id);
          results.failed++;
        } else {
          results.headlines++;
        }
      } catch (error) {
        console.error(`AI analysis failed for headline ${headline.id}:`, error);
        await supabase.from('headlines').update({ ai_analysis_status: 'failed' }).eq('id', headline.id);
        results.failed++;
      }
    }
  }

  // Process Entertainment News (newest first, limit 5)
  const { data: pendingEntertainment, error: entertainmentError } = await supabase
    .from('entertainment_news')
    .select('id, title, original_url')
    .eq('ai_analysis_status', 'pending')
    .order('fetched_at', { ascending: false })
    .limit(5);

  if (entertainmentError) {
    console.error('Error fetching pending entertainment:', entertainmentError);
    return NextResponse.json({ error: 'Failed to fetch pending entertainment' }, { status: 500 });
  }

  if (pendingEntertainment && pendingEntertainment.length > 0) {
    for (const item of pendingEntertainment) {
      try {
        const analysis = await generateCommentary(item.title);
        const imageUrl = await fetchArticleImage(item.original_url);

        const { error: updateError } = await supabase
          .from('entertainment_news')
          .update({
            ai_summary: analysis.summary,
            ai_sentiment: analysis.sentiment,
            ai_key_entities: analysis.keyEntities,
            ai_confidence_score: analysis.confidenceScore,
            ai_analysis_status: 'completed',
            ai_model_used: 'openai',
            image_url: imageUrl,
            category: 'celebrity',
            updated_at: new Date().toISOString(),
          })
          .eq('id', item.id);

        if (updateError) {
          console.error(`Update failed for entertainment ${item.id}:`, updateError.message);
          await supabase.from('entertainment_news').update({ ai_analysis_status: 'failed' }).eq('id', item.id);
          results.failed++;
        } else {
          results.entertainment++;
        }
      } catch (error) {
        console.error(`AI analysis failed for entertainment ${item.id}:`, error);
        await supabase.from('entertainment_news').update({ ai_analysis_status: 'failed' }).eq('id', item.id);
        results.failed++;
      }
    }
  }

  return NextResponse.json(results);
}