export async function fetchChannelVideos(handle: string, maxResults = 4) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) return [];

  try {
    // Get channel ID from handle
    const handleRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=${encodeURIComponent(handle)}&key=${apiKey}`
    );
    if (!handleRes.ok) return [];
    const handleData = await handleRes.json();
    const channelId = handleData?.items?.[0]?.id;
    if (!channelId) return [];

    // Get uploads playlist ID
    const chRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${apiKey}`
    );
    if (!chRes.ok) return [];
    const chData = await chRes.json();
    const uploadsId = chData?.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
    if (!uploadsId) return [];

    // Get playlist items
    const playlistRes = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsId}&maxResults=${maxResults}&key=${apiKey}`
    );
    if (!playlistRes.ok) return [];
    const playlistData = await playlistRes.json();

    return (playlistData.items || []).map((item: any) => ({
      videoId: item.snippet.resourceId.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url || '',
    }));
  } catch (error) {
    console.error(`Failed to fetch channel ${handle}:`, error);
    return [];
  }
}