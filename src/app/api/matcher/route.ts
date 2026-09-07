import { NextResponse } from 'next/server';
import { db } from '@/db';
import { grants, foundations, grantDeadlines } from '@/db/schema';
import { calculateMatch, ProjectInput } from '@/lib/ai/matcher';

export async function POST(request: Request) {
  try {
    const project: ProjectInput = await request.json();
    if (!project.projectDescription && !project.projectTitle) {
      return NextResponse.json({ error: 'Projektbeskrivelse eller titel er påkrævet' }, { status: 400 });
    }

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

    const scoredGrants = allGrants.map(g => {
      const found = foundationMap.get(g.foundationId) || { name: 'Ukendt Fond' };
      const dls = deadlineMap.get(g.id) || [];
      const match = calculateMatch(project, {
        ...g,
        foundation: found,
        deadlines: dls
      });

      return {
        ...match,
        grant: {
          ...g,
          foundation: found,
          deadlines: dls
        }
      };
    });

    // Sort by match score descending
    scoredGrants.sort((a, b) => b.matchScore - a.matchScore);

    return NextResponse.json({
      project,
      totalEvaluated: allGrants.length,
      matches: scoredGrants
    });
  } catch (error) {
    console.error('Match failed:', error);
    return NextResponse.json({ error: 'Matche-processen fejlede' }, { status: 500 });
  }
}
