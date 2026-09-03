export async function fetchChannelVideos(handle: string, maxResults = 4) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) return [];

  try {
    // Get channel ID from handle with timeout
    const handleController = new AbortController();
    const handleTimeout = setTimeout(() => handleController.abort(), 20000); // Increased to 20 seconds

    const handleRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=${encodeURIComponent(handle)}&key=${apiKey}`,
      { signal: handleController.signal, cache: 'no-store' }
    );
    clearTimeout(handleTimeout);

    if (!handleRes.ok) {
      return [];
    }

    const handleData = await handleRes.json();
    const channelId = handleData?.items?.[0]?.id;
    if (!channelId) return [];

    // Get uploads playlist ID
    const chController = new AbortController();
    const chTimeout = setTimeout(() => chController.abort(), 20000); // Increased to 20 seconds

    const chRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${apiKey}`,
      { signal: chController.signal, cache: 'no-store' }
    );
    clearTimeout(chTimeout);

    if (!chRes.ok) return [];
    const chData = await chRes.json();
    const uploadsId = chData?.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
    if (!uploadsId) return [];

    // Get playlist items
    const playlistController = new AbortController();
    const playlistTimeout = setTimeout(() => playlistController.abort(), 20000); // Increased to 20 seconds

    const playlistRes = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsId}&maxResults=${maxResults}&key=${apiKey}`,
      { signal: playlistController.signal, cache: 'no-store' }
    );
    clearTimeout(playlistTimeout);

    if (!playlistRes.ok) return [];
    const playlistData = await playlistRes.json();

    return (playlistData.items || []).map((item: any) => ({
      videoId: item.snippet.resourceId.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url || '',
    }));
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error(`Timeout fetching channel ${handle}`);
    } else {
      console.error(`Failed to fetch channel ${handle}:`, error);
    }
    return [];
  }
}