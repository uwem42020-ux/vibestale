import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const playlistId = url.searchParams.get('playlistId');
  const pageToken = url.searchParams.get('pageToken') || undefined;

  if (!playlistId) {
    return NextResponse.json({ error: 'Missing playlistId' }, { status: 400 });
  }

  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'YouTube API key not set' }, { status: 500 });
  }

  const ytUrl = new URL('https://www.googleapis.com/youtube/v3/playlistItems');
  ytUrl.searchParams.set('part', 'snippet');
  ytUrl.searchParams.set('playlistId', playlistId);
  ytUrl.searchParams.set('maxResults', '8');
  if (pageToken) ytUrl.searchParams.set('pageToken', pageToken);
  ytUrl.searchParams.set('key', apiKey);

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(ytUrl.toString(), { signal: controller.signal });
    clearTimeout(timeout);

    if (!response.ok) {
      return NextResponse.json({ error: 'YouTube API error' }, { status: response.status });
    }

    const data = await response.json();
    const videos = (data.items || []).map((item: any) => ({
      videoId: item.snippet.resourceId.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url || '',
    }));

    return NextResponse.json({ videos, nextPageToken: data.nextPageToken || null });
  } catch (error) {
    console.error('YouTube playlist fetch failed:', error);
    return NextResponse.json({ error: 'Failed to fetch playlist' }, { status: 500 });
  }
}