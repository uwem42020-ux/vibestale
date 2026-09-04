import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');
  const page = Number(searchParams.get('page') || '1');
  const limit = Number(searchParams.get('limit') || '10');
  const offset = (page - 1) * limit;

  if (!slug) return NextResponse.json({ error: 'Missing slug' }, { status: 400 });

  const supabase = await createClient();

  if (slug === 'entertainment') {
    const { data: general } = await supabase
      .from('headlines')
      .select('*, sources(name, base_url)')
      .eq('category', 'entertainment')
      .eq('ai_analysis_status', 'completed')
      .eq('status', 'published')
      .is('deleted_at', null)
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data: celeb } = await supabase
      .from('entertainment_news')
      .select('*, entertainment_sources(name, base_url)')
      .eq('ai_analysis_status', 'completed')
      .is('deleted_at', null)
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const normalised = (celeb || []).map((item: any) => ({
      ...item,
      sources: item.entertainment_sources || null,
      category: 'celebrity',
    }));

    const merged = [...(general || []), ...normalised]
      .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
      .slice(0, limit);

    return NextResponse.json({ items: merged });
  }

  const { data, error } = await supabase
    .from('headlines')
    .select('*, sources(name, base_url)')
    .eq('category', slug)
    .eq('ai_analysis_status', 'completed')
    .eq('status', 'published')
    .is('deleted_at', null)
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ items: data || [] });
}