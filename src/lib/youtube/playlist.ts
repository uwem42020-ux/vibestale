// src/lib/youtube/playlist.ts

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
      const timeout = setTimeout(() => controller.abort(), 10000);
  
      const response = await fetch(url.toString(), { signal: controller.signal });
      clearTimeout(timeout);
  
      if (!response.ok) return { videos: [], nextPageToken: null };
  
      const data = await response.json();
      const videos = (data.items || []).map((item: any) => ({
        videoId: item.snippet.resourceId.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url || '',
      }));
  
      return { videos, nextPageToken: data.nextPageToken || null };
    } catch (error) {
      console.error('YouTube playlist fetch failed:', error);
      return { videos: [], nextPageToken: null };
    }
  }