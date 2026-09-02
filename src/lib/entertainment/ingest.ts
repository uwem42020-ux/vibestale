import Parser from 'rss-parser';
import dns from 'dns';
import { createClient } from '@/lib/supabase/server';

dns.setDefaultResultOrder('ipv4first');

const parser = new Parser({
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36',
    'Accept': 'application/rss+xml, application/xml, text/xml, */*',
  },
  timeout: 15000,
});

function generateSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').substring(0, 100);
}

export async function ingestEntertainmentNews() {
  const supabase = await createClient();
  const { data: sources } = await supabase
    .from('entertainment_sources')
    .select('*')
    .eq('is_active', true);

  if (!sources || sources.length === 0) return { processed: 0, errors: 0 };

  let processed = 0;
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

        const slug = generateSlug(title);
        const { data: existing } = await supabase
          .from('entertainment_news')
          .select('id')
          .eq('slug', slug)
          .maybeSingle();
        if (existing) continue;

        const { error } = await supabase.from('entertainment_news').insert({
          source_id: source.id,
          title,
          original_url: link,
          published_at: pubDate ? new Date(pubDate).toISOString() : null,
          image_url: imageUrl,
          slug,
          ai_analysis_status: 'pending',
        });
        if (error) {
          console.error(`Insert error for ${source.name}:`, error.message);
          errors++;
        } else {
          processed++;
        }
      }

      await supabase
        .from('entertainment_sources')
        .update({ last_fetched: new Date().toISOString(), fetch_errors: 0 })
        .eq('id', source.id);
    } catch (error) {
      console.error(`Failed to fetch ${source.name}:`, error);
      errors++;
      await supabase
        .from('entertainment_sources')
        .update({ fetch_errors: 1, is_active: false })
        .eq('id', source.id);
    }
  }

  return { processed, errors };
}