import { NextResponse } from 'next/server';
import { db } from '@/db';
import { fundraisingPipeline, grants, foundations } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import crypto from 'crypto';

export async function GET() {
  try {
    const items = db.select().from(fundraisingPipeline).orderBy(desc(fundraisingPipeline.createdAt)).all();
    const allGrants = db.select().from(grants).all();
    const allFoundations = db.select().from(foundations).all();

    const grantMap = new Map(allGrants.map(g => [g.id, g]));
    const foundMap = new Map(allFoundations.map(f => [f.id, f]));

    const enriched = items.map(item => {
      const grant = grantMap.get(item.grantId);
      const foundation = grant ? foundMap.get(grant.foundationId) : null;
      return {
        ...item,
        grant,
        foundation
      };
    });

    return NextResponse.json(enriched);
  } catch (error) {
    console.error('Failed to get pipeline:', error);
    return NextResponse.json({ error: 'Kunne ikke hente pipeline' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = 'pipe-' + crypto.randomUUID().slice(0, 8);
    const newItem = {
      id,
      grantId: body.grantId,
      projectTitle: body.projectTitle || 'Nyt fundraisingprojekt',
      status: body.status || 'idea',
      notes: body.notes || '',
      requestedAmount: body.requestedAmount ? Number(body.requestedAmount) : null,
      customDeadline: body.customDeadline || null,
      submissionDate: body.submissionDate || null,
      decisionDate: null
    };

    db.insert(fundraisingPipeline).values(newItem).run();
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error('Failed to create pipeline item:', error);
    return NextResponse.json({ error: 'Kunne ikke tilføje ansøgning til pipeline' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    if (!id) {
      return NextResponse.json({ error: 'Mangler id' }, { status: 400 });
    }

    db.update(fundraisingPipeline)
      .set(updates)
      .where(eq(fundraisingPipeline.id, id))
      .run();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update pipeline item:', error);
    return NextResponse.json({ error: 'Kunne ikke opdatere' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Mangler id' }, { status: 400 });
    }

    db.delete(fundraisingPipeline).where(eq(fundraisingPipeline.id, id)).run();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete item:', error);
    return NextResponse.json({ error: 'Kunne ikke slette' }, { status: 500 });
  }
}
