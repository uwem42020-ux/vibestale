export async function fetchYouTubePlaylist(playlistId: string, maxResults = 8) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) return { videos: [], nextPageToken: null };

  const url = new URL('https://www.googleapis.com/youtube/v3/playlistItems');
  url.searchParams.set('part', 'snippet');
  url.searchParams.set('playlistId', playlistId);
  url.searchParams.set('maxResults', String(maxResults));
  url.searchParams.set('key', apiKey);

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000); // Increased to 15 seconds

    const response = await fetch(url.toString(), { 
      signal: controller.signal,
      cache: 'no-store',
    });
    clearTimeout(timeout);

    if (!response.ok) {
      console.error(`Playlist fetch failed: ${response.status} ${response.statusText}`);
      return { videos: [], nextPageToken: null };
    }

    const data = await response.json();
    const videos = (data.items || []).map((item: any) => ({
      videoId: item.snippet.resourceId.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url || '',
    }));

    return { videos, nextPageToken: data.nextPageToken || null };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('YouTube playlist fetch timeout');
    } else {
      console.error('YouTube playlist fetch failed:', error);
    }
    return { videos: [], nextPageToken: null };
  }
}