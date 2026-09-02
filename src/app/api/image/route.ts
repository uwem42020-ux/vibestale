import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const imageUrl = url.searchParams.get('url');

  if (!imageUrl) {
    return NextResponse.json({ error: 'Missing image URL' }, { status: 400 });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    // Use the original site's domain as referer for better results
    let referer = 'https://www.google.com/';
    try {
      const parsedUrl = new URL(imageUrl);
      referer = `${parsedUrl.protocol}//${parsedUrl.host}/`;
    } catch {
      // keep default referer
    }

    const response = await fetch(imageUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36',
        'Accept': 'image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': referer,
        'Origin': referer,
      },
    });
    clearTimeout(timeout);

    if (!response.ok) {
      // Try without referer if first attempt fails
      const retryResponse = await fetch(imageUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36',
        },
      });
      if (!retryResponse.ok) {
        return NextResponse.json({ error: 'Failed to fetch image' }, { status: retryResponse.status });
      }
      const contentType = retryResponse.headers.get('content-type') || 'image/jpeg';
      const imageBuffer = await retryResponse.arrayBuffer();
      return new NextResponse(imageBuffer, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=86400, s-maxage=86400',
        },
      });
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const imageBuffer = await response.arrayBuffer();

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    });
  } catch (error) {
    console.error('Image proxy failed:', error);
    return NextResponse.json({ error: 'Image proxy failed' }, { status: 500 });
  }
}