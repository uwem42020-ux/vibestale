import { NextResponse } from 'next/server';
import { ingestMusic } from '@/lib/music/ingest';

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const result = await ingestMusic();
  return NextResponse.json(result);
}