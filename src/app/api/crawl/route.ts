import { NextResponse } from 'next/server';
import { db } from '@/db';
import { monitoredSources, foundations } from '@/db/schema';
import { checkSourceForChanges } from '@/lib/scraper/diff-detector';
import { eq } from 'drizzle-orm';

export async function GET() {
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

export async function POST() {
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
