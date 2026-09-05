import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ videoId: string }> }
) {
  const { videoId } = await params;
  const PROXY_URL = process.env.PROXY_URL;
  return NextResponse.redirect(`${PROXY_URL}/download/${videoId}`);
}