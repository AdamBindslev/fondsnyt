import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { db } from '@/db';
import { monitoredSources, foundations } from '@/db/schema';
import { checkSourceForChanges } from '@/lib/scraper/diff-detector';
import { eq } from 'drizzle-orm';

function isAuthorized(request: NextRequest): boolean {
  // 1. Check user login session cookie
  const authCookie = request.cookies.get('fondsnyt_auth');
  if (authCookie?.value) return true;

  // 2. Check CRON secret header
  const authHeader = request.headers.get('authorization');
  const customCronHeader = request.headers.get('x-cron-secret');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret) {
    if (authHeader && (authHeader === `Bearer ${cronSecret}` || authHeader === cronSecret)) {
      return true;
    }
    if (customCronHeader && customCronHeader === cronSecret) {
      return true;
    }
  }

  // 3. Fallback for local development when CRON_SECRET is not explicitly set
  if (process.env.NODE_ENV === 'development' && !cronSecret) {
    return true;
  }

  return false;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { error: 'Uautoriseret adgang. Login eller gyldig CRON_SECRET påkrævet.' },
      { status: 401 }
    );
  }

  try {
    const sources = db.select().from(monitoredSources).all();
    const allFoundations = db.select().from(foundations).all();
    const foundMap = new Map(allFoundations.map(f => [f.id, f]));

    const enriched = sources.map(s => ({
      ...s,
      foundation: foundMap.get(s.foundationId) || null
    }));

    return NextResponse.json(enriched);
  } catch (error) {
    console.error('Failed to get sources:', error);
    return NextResponse.json({ error: 'Kunne ikke hente kilder' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { error: 'Uautoriseret adgang. Login eller gyldig CRON_SECRET påkrævet.' },
      { status: 401 }
    );
  }

  try {
    const sources = db.select().from(monitoredSources).all();
    const results = [];

    for (const src of sources) {
      const diff = await checkSourceForChanges(
        src.id,
        src.targetUrl,
        src.lastContentHash
      );

      const status = diff.hasChanged ? 'CHANGED' : 'OK';
      db.update(monitoredSources)
        .set({
          lastCheckedAt: diff.checkedAt,
          lastStatus: status,
          lastContentHash: diff.newHash,
          detectedChangesSummary: diff.summary
        })
        .where(eq(monitoredSources.id, src.id))
        .run();

      results.push({
        sourceId: src.id,
        url: src.targetUrl,
        status,
        summary: diff.summary,
        checkedAt: diff.checkedAt
      });
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      checkedCount: sources.length,
      results
    });
  } catch (error) {
    console.error('Crawl execution failed:', error);
    return NextResponse.json({ error: 'Crawl kørsel fejlede' }, { status: 500 });
  }
}
