import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { db } from '@/db';
import { monitoredSources, foundations, grants, grantDeadlines } from '@/db/schema';
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
    const allFoundations = db.select().from(foundations).all();
    const foundMap = new Map(allFoundations.map(f => [f.id, f]));
    const allGrants = db.select().from(grants).all();
    const results = [];

    for (const src of sources) {
      const foundation = foundMap.get(src.foundationId);
      const foundationName = foundation?.name || 'Ukendt fond';

      const diff = await checkSourceForChanges(
        src.id,
        src.targetUrl,
        src.lastContentHash,
        undefined,
        foundationName
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

      // If changes and deadlines were extracted by Gemini, sync to grant deadlines
      let syncedDeadlinesCount = 0;
      if (diff.hasChanged && diff.extractedInfo) {
        const foundationGrants = allGrants.filter(g => g.foundationId === src.foundationId);
        for (const fGrant of foundationGrants) {
          const existingDeadlines = db.select().from(grantDeadlines).where(eq(grantDeadlines.grantId, fGrant.id)).all();

          if (diff.extractedInfo.isOngoing) {
            if (!existingDeadlines.some(d => d.isOngoing)) {
              db.insert(grantDeadlines).values({
                id: `dl-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                grantId: fGrant.id,
                isOngoing: true,
                notes: 'Løbende frist opdateret via AI overvågning',
                deadlineDate: null
              }).run();
              syncedDeadlinesCount++;
            }
          } else if (diff.extractedInfo.deadlines.length > 0) {
            for (const newDate of diff.extractedInfo.deadlines) {
              const alreadyExists = existingDeadlines.some(d => d.deadlineDate === newDate);
              if (!alreadyExists) {
                db.insert(grantDeadlines).values({
                  id: `dl-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                  grantId: fGrant.id,
                  deadlineDate: newDate,
                  isOngoing: false,
                  notes: 'Ny frist udregnet af Gemini fra fondens hjemmeside'
                }).run();
                syncedDeadlinesCount++;
              }
            }
          }
        }
      }

      results.push({
        sourceId: src.id,
        url: src.targetUrl,
        status,
        summary: diff.summary,
        checkedAt: diff.checkedAt,
        extractedDeadlines: diff.extractedDeadlines || [],
        syncedDeadlinesCount
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
