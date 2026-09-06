import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const PIPED_INSTANCES = [
  'https://pipedapi.kavin.rocks',
  'https://pipedapi.tokhmi.xyz',
  'https://pipedapi.moomoo.me',
  'https://pipedapi.syncpundit.io',
];

async function getPipedAudioUrl(videoId: string): Promise<string> {
  for (const instance of PIPED_INSTANCES) {
    try {
      const response = await fetch(`${instance}/streams/${videoId}`);
      if (!response.ok) continue;
      const data = await response.json();
      if (data.audioStreams && data.audioStreams.length > 0) {
        return data.audioStreams[0].url;
      }
    } catch (err) {
      console.error(`Piped instance ${instance} failed:`, err);
    }
  }
  throw new Error('All Piped instances failed');
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ videoId: string }> }
) {
  const { videoId } = await params;
  if (!videoId) {
    return NextResponse.json({ error: 'Missing video ID' }, { status: 400 });
  }

  try {
    // Check cache
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

    // Fetch fresh
    const audioUrl = await getPipedAudioUrl(videoId);
    const expiresAt = new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString();

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
    console.error('Audio API error:', error);
    return NextResponse.json({ error: 'Failed to get audio URL' }, { status: 500 });
  }
}