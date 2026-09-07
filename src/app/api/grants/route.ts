import { NextResponse } from 'next/server';
import { db } from '@/db';
import { grants, foundations, grantDeadlines } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.toLowerCase() || '';
    const category = searchParams.get('category') || '';
    const region = searchParams.get('region') || '';

    const allGrants = db.select().from(grants).all();
    const allFoundations = db.select().from(foundations).all();
    const allDeadlines = db.select().from(grantDeadlines).all();

    const foundationMap = new Map(allFoundations.map(f => [f.id, f]));
    const deadlineMap = new Map<string, typeof allDeadlines>();
    for (const d of allDeadlines) {
      if (!deadlineMap.has(d.grantId)) {
        deadlineMap.set(d.grantId, []);
      }
      deadlineMap.get(d.grantId)!.push(d);
    }

    let results = allGrants.map(g => ({
      ...g,
      foundation: foundationMap.get(g.foundationId) || null,
      deadlines: deadlineMap.get(g.id) || []
    }));

    if (query) {
      results = results.filter(g => 
        g.title.toLowerCase().includes(query) ||
        g.description.toLowerCase().includes(query) ||
        (g.foundation && g.foundation.name.toLowerCase().includes(query)) ||
        g.categories.some(c => c.toLowerCase().includes(query))
      );
    }

    if (category && category !== 'Alle') {
      results = results.filter(g => g.categories.includes(category));
    }

    if (region && region !== 'Alle') {
      results = results.filter(g => g.region === region);
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error('Failed to fetch grants:', error);
    return NextResponse.json({ error: 'Kunne ikke hente puljer' }, { status: 500 });
  }
}
