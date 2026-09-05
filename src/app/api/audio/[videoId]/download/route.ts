import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { videoId: string } }
) {
  const videoId = params.videoId;
  const PROXY_URL = process.env.PROXY_URL;
  return NextResponse.redirect(`${PROXY_URL}/download/${videoId}`);
}