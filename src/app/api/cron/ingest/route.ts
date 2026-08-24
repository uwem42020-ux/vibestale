import { NextResponse } from 'next/server';
import { ingestHeadlines } from '@/lib/rss/ingest';

export async function GET(req: Request) {
  // Protect endpoint with cron secret
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await ingestHeadlines();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Ingestion failed:', error);
    return NextResponse.json({ error: 'Ingestion failed' }, { status: 500 });
  }
}