import Parser from 'rss-parser';
import dns from 'dns';
import { createClient } from '@/lib/supabase/server';
import { generateStoryHash } from './deduplicate';

dns.setDefaultResultOrder('ipv4first');

const parser = new Parser({
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36',
    'Accept': 'application/rss+xml, application/xml, text/xml, */*',
  },
  timeout: 15000,
});

export async function ingestHeadlines() {
  const supabase = await createClient();

  const { data: sources, error: sourceError } = await supabase
    .from('sources')
    .select('*')
    .eq('is_active', true);

  if (sourceError || !sources || sources.length === 0) {
    console.error('No active sources found');
    return { processed: 0, duplicates: 0, errors: 0 };
  }

  let processed = 0;
  let duplicates = 0;
  let errors = 0;

  for (const source of sources) {
    try {
      const feed = await parser.parseURL(source.rss_url);

      for (const item of feed.items.slice(0, 10)) {
        const title = item.title?.trim();
        const link = item.link;
        const pubDate = item.pubDate;

        if (!title || !link) continue;

        const imageUrl =
          item.enclosure?.url ||
          (item as any)['media:content']?.url ||
          (item as any)['media:thumbnail']?.url ||
          null;

        const storyHash = generateStoryHash(title);

        const { data: existing } = await supabase
          .from('headlines')
          .select('id')
          .eq('story_hash', storyHash)
          .maybeSingle();

        if (existing) {
          duplicates++;
          continue;
        }

        const slug = generateSlug(title);
        const { data: slugExists } = await supabase
          .from('headlines')
          .select('id')
          .eq('slug', slug)
          .maybeSingle();
        const finalSlug = slugExists ? `${slug}-${Date.now()}` : slug;

        const { error: insertError } = await supabase.from('headlines').insert({
          source_id: source.id,
          external_id: item.guid || link,
          title,
          original_url: link,
          category: source.category,
          published_at: pubDate ? new Date(pubDate).toISOString() : null,
          story_hash: storyHash,
          slug: finalSlug,
          ai_analysis_status: 'pending',
          status: 'published',
          image_url: imageUrl,
        });

        if (insertError) {
          console.error(`Insert error for ${source.name}:`, insertError.message);
          errors++;
        } else {
          processed++;
        }
      }

      await supabase
        .from('sources')
        .update({ last_fetched: new Date().toISOString(), fetch_errors: 0 })
        .eq('id', source.id);

    } catch (error) {
      console.error(`Failed to fetch ${source.name}:`, error);
      errors++;

      const { data: currentSource } = await supabase
        .from('sources')
        .select('fetch_errors')
        .eq('id', source.id)
        .single();

      const newErrorCount = (currentSource?.fetch_errors || 0) + 1;
      const shouldDisable = newErrorCount >= 3;

      await supabase
        .from('sources')
        .update({ fetch_errors: newErrorCount, is_active: !shouldDisable })
        .eq('id', source.id);

      if (shouldDisable) {
        console.warn(`Source ${source.name} disabled after 3 consecutive errors.`);
      }
    }
  }

  return { processed, duplicates, errors };
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .substring(0, 100);
}