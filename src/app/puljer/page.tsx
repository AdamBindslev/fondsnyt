import React from 'react';
import { db } from '@/db';
import { grants, foundations, grantDeadlines } from '@/db/schema';
import { PuljerCatalog } from '@/components/PuljerCatalog';

export const revalidate = 0;

interface PuljerPageProps {
  searchParams: Promise<{ kategori?: string }>;
}

export default async function PuljerPage({ searchParams }: PuljerPageProps) {
  const params = await searchParams;
  const initialCategory = params.kategori || 'Alle';

  const allGrants = db.select().from(grants).all();
  const allFoundations = db.select().from(foundations).all();
  const allDeadlines = db.select().from(grantDeadlines).all();

  const foundMap = new Map(allFoundations.map(f => [f.id, f]));
  const deadlineMap = new Map<string, typeof allDeadlines>();
  for (const d of allDeadlines) {
    if (!deadlineMap.has(d.grantId)) {
      deadlineMap.set(d.grantId, []);
    }
    deadlineMap.get(d.grantId)!.push(d);
  }

  const enriched = allGrants.map(g => ({
    ...g,
    foundation: foundMap.get(g.foundationId) || null,
    deadlines: deadlineMap.get(g.id) || []
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Fonds- og Puljekatalog
        </h1>
        <p className="text-sm text-slate-600">
          Udforsk aktive fonde og puljer i Danmark og EU med opdaterede frister, målgrupper og beløb.
        </p>
      </div>

      <PuljerCatalog initialGrants={enriched} initialCategory={initialCategory} />
    </div>
  );
}
