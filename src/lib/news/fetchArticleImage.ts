import { createClient } from '@/lib/supabase/server';

const MICROLINK_DAILY_LIMIT = 50;

async function manualOgImage(url: string): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36',
      },
    });
    clearTimeout(timeout);

    if (!response.ok) return null;

    const html = await response.text();
    const match = html.match(
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i
    );
    return match ? match[1] : null;
  } catch (error) {
    console.error('Manual og:image fetch failed:', error);
    return null;
  }
}

async function canUseMicrolink(): Promise<boolean> {
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from('microlink_usage')
    .select('request_count')
    .eq('usage_date', today)
    .maybeSingle();

  if (error) {
    console.error('Failed to check Microlink usage:', error);
    return false;
  }

  const count = data?.request_count || 0;
  return count < MICROLINK_DAILY_LIMIT;
}

async function incrementMicrolinkCount(): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.rpc('increment_microlink_count');
  if (error) {
    console.error('Failed to increment Microlink count:', error);
  }
}

async function microlinkOgImage(url: string): Promise<string | null> {
  if (!(await canUseMicrolink())) {
    console.warn('Microlink daily limit reached (50). Skipping.');
    return null;
  }

  try {
    const apiUrl = `https://api.microlink.io/?url=${encodeURIComponent(url)}`;
    const response = await fetch(apiUrl, { signal: AbortSignal.timeout(8000) });
    if (!response.ok) return null;

    const data = await response.json();
    const imageUrl = data?.data?.image?.url || null;

    if (imageUrl) {
      await incrementMicrolinkCount();
    }

    return imageUrl;
  } catch (error) {
    console.error('Microlink fetch failed:', error);
    return null;
  }
}

export async function fetchArticleImage(url: string): Promise<string | null> {
  // 1. Try manual extraction first
  const manual = await manualOgImage(url);
  if (manual) return manual;

  // 2. Fallback to Microlink (respecting daily limit)
  const microlink = await microlinkOgImage(url);
  if (microlink) return microlink;

  // 3. No image found
  return null;
}