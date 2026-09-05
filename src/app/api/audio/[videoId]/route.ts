import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const PROXY_URL = process.env.PROXY_URL; // e.g., "https://yt-proxy.onrender.com"

export async function GET(
  request: NextRequest,
  { params }: { params: { videoId: string } }
) {
  const videoId = params.videoId;
  if (!videoId) {
    return NextResponse.json({ error: 'Missing video ID' }, { status: 400 });
  }

  // 1. Check cache
  const { data: track, error: fetchError } = await supabase
    .from('audio_tracks')
    .select('audio_url, audio_url_expires_at')
    .eq('youtube_video_id', videoId)
    .single();

  if (fetchError) {
    console.warn('Supabase fetch error (continuing):', fetchError.message);
  }

  if (
    track?.audio_url &&
    track?.audio_url_expires_at &&
    new Date(track.audio_url_expires_at).getTime() > Date.now() + 60 * 1000
  ) {
    return NextResponse.json({
      audioUrl: track.audio_url,
      expiresAt: track.audio_url_expires_at,
    });
  }

  // 2. Call proxy
  try {
    const proxyResponse = await fetch(`${PROXY_URL}/audio/${videoId}`);
    if (!proxyResponse.ok) throw new Error(`Proxy error ${proxyResponse.status}`);
    const data = await proxyResponse.json();
    const audioUrl = data.audioUrl;
    if (!audioUrl) throw new Error('No audioUrl');

    const expiresAt = new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(); // 6 hours

    const { error: updateError } = await supabase
      .from('audio_tracks')
      .update({
        audio_url: audioUrl,
        audio_url_expires_at: expiresAt,
        audio_url_fetched_at: new Date().toISOString(),
      })
      .eq('youtube_video_id', videoId);

    if (updateError) console.error('Update failed:', updateError.message);

    return NextResponse.json({ audioUrl, expiresAt });
  } catch (error) {
    console.error('Proxy fetch error:', error);
    return NextResponse.json({ error: 'Failed to get audio URL' }, { status: 500 });
  }
}