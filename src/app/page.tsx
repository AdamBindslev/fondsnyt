import React from 'react';
import Link from 'next/link';
import { db } from '@/db';
import { grants, foundations, grantDeadlines, fundraisingPipeline, monitoredSources } from '@/db/schema';
import { 
  AlertCircle, 
  Calendar, 
  Clock, 
  Coins, 
  ArrowRight, 
  CheckCircle2, 
  Radio, 
  KanbanSquare, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  BookmarkPlus
} from 'lucide-react';
import { DeadlineBadge } from '@/components/DeadlineBadge';
import { GrantCard } from '@/components/GrantCard';

export const revalidate = 0; // Dynamic server component

export default async function DashboardPage() {
  const allGrants = db.select().from(grants).all();
  const allFoundations = db.select().from(foundations).all();
  const allDeadlines = db.select().from(grantDeadlines).all();
  const allPipeline = db.select().from(fundraisingPipeline).all();
  const allSources = db.select().from(monitoredSources).all();

  const foundMap = new Map(allFoundations.map(f => [f.id, f]));
  const deadlineMap = new Map<string, typeof allDeadlines>();
  for (const d of allDeadlines) {
    if (!deadlineMap.has(d.grantId)) {
      deadlineMap.set(d.grantId, []);
    }
    deadlineMap.get(d.grantId)!.push(d);
  }

  const enrichedGrants = allGrants.map(g => ({
    ...g,
    foundation: foundMap.get(g.foundationId) || null,
    deadlines: deadlineMap.get(g.id) || []
  }));

  // Calculate deadline urgency
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let urgentCount = 0;
  let upcomingCount = 0;
  let ongoingCount = 0;

  const deadlineList: {
    grant: typeof enrichedGrants[0];
    deadline: typeof allDeadlines[0];
    daysRemaining: number | null;
  }[] = [];

  for (const g of enrichedGrants) {
    for (const d of g.deadlines) {
      if (d.isOngoing || !d.deadlineDate) {
        ongoingCount++;
      } else {
        const dDate = new Date(d.deadlineDate);
        const diff = Math.ceil((dDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        deadlineList.push({
          grant: g,
          deadline: d,
          daysRemaining: diff
        });

        if (diff >= 0 && diff <= 14) {
          urgentCount++;
        } else if (diff > 14 && diff <= 30) {
          upcomingCount++;
        }
      }
    }
  }

  // Sort deadlines: urgent first
  deadlineList.sort((a, b) => {
    if (a.daysRemaining === null) return 1;
    if (b.daysRemaining === null) return -1;
    return a.daysRemaining - b.daysRemaining;
  });

  // Calculate total pipeline value
  const totalSought = allPipeline.reduce((acc, curr) => acc + (curr.requestedAmount || 0), 0);
  const activePipelineItems = allPipeline.filter(p => p.status === 'writing' || p.status === 'submitted');

  return (
    <div className="space-y-8">
      {/* Top Welcome / Mission Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Fundraising Dashboard & Fondsovervågning
            </h1>
          </div>
          <p className="text-sm text-slate-600">
            Overblik over danske og europæiske tilskudspuljer, tidsfrister og din ansøgningspipeline.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/pipeline"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold shadow-xs transition-all"
          >
            <KanbanSquare className="w-4 h-4 text-slate-300" />
            <span>Min Pipeline</span>
          </Link>
          <Link
            href="/puljer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold transition-colors"
          >
            <span>Udforsk Fonde</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* KPI Cards with distinct Nordic Signal Colors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Akutte deadlines (< 14 dage) */}
        <div className="nordic-card p-5 border-l-4 border-l-rose-500 bg-linear-to-br from-white to-rose-50/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">
              Akutte Deadlines
            </span>
            <span className="p-1.5 rounded-md bg-rose-100 text-rose-700">
              <AlertCircle className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{urgentCount}</span>
            <span className="text-xs font-medium text-rose-600">frist under 14 dage</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">Kræver omgående handling for indsendelse</p>
        </div>

        {/* Næste frister (14-30 dage) */}
        <div className="nordic-card p-5 border-l-4 border-l-amber-500 bg-linear-to-br from-white to-amber-50/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
              Næste 30 Dage
            </span>
            <span className="p-1.5 rounded-md bg-amber-100 text-amber-700">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{upcomingCount}</span>
            <span className="text-xs font-medium text-amber-700">forberedelse i gang</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">Ideelt vindue til udarbejdelse af bilag</p>
        </div>

        {/* Løbende puljer (uden fast frist) */}
        <div className="nordic-card p-5 border-l-4 border-l-sky-500 bg-linear-to-br from-white to-sky-50/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">
              Løbende Puljer
            </span>
            <span className="p-1.5 rounded-md bg-sky-100 text-sky-700">
              <Calendar className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{ongoingCount}</span>
            <span className="text-xs font-medium text-sky-700">fleksibel ansøgning</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">Først-til-mølle eller hurtig sagsbehandling</p>
        </div>

        {/* Fundraising Pipeline Værdi */}
        <div className="nordic-card p-5 border-l-4 border-l-emerald-500 bg-linear-to-br from-white to-emerald-50/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Søgt i Pipeline
            </span>
            <span className="p-1.5 rounded-md bg-emerald-100 text-emerald-700">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">
              {totalSought > 0 ? `${(totalSought / 1000).toFixed(0)}k` : '0'} kr
            </span>
            <span className="text-xs font-medium text-emerald-700">
              {allPipeline.length} projekter
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">{activePipelineItems.length} aktive ansøgningsprocesser</p>
        </div>
      </div>

      {/* Main Grid: Upcoming Deadlines Timeline & Active Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 spans): Akutte og Nærmeste Deadlines */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-rose-500" />
                <span>Nærmeste Frister & Signalkalender</span>
              </h2>
              <p className="text-xs text-slate-500">
                Sorteret efter færrest dage tilbage til ansøgningsfrist
              </p>
            </div>
            <Link
              href="/puljer"
              className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1"
            >
              <span>Se alle {enrichedGrants.length} puljer</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {deadlineList.slice(0, 6).map(({ grant, deadline, daysRemaining }) => (
              <div
                key={`${grant.id}-${deadline.id}`}
                className="nordic-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-300"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      {grant.foundation?.name}
                    </span>
                    {grant.region === 'EU' && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-bold badge-eu">
                        EU
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 hover:text-indigo-600 transition-colors">
                    {grant.title}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    {deadline.notes && <span>{deadline.notes}</span>}
                    {grant.maxAmount && (
                      <span>• Op til {grant.maxAmount.toLocaleString('da-DK')} {grant.currency}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <DeadlineBadge
                    deadlineDate={deadline.deadlineDate}
                    isOngoing={deadline.isOngoing}
                  />
                  <a
                    href={grant.applicationUrl || grant.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                    title="Åbn ansøgningslink"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (1 span): Pipeline Status & Diff Watcher */}
        <div className="space-y-6">
          {/* Active Pipeline Box */}
          <div className="nordic-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <KanbanSquare className="w-4 h-4 text-slate-700" />
                <span>Min Pipeline (Arbejdsbord)</span>
              </h3>
              <Link
                href="/pipeline"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Gå til tavle
              </Link>
            </div>

            {allPipeline.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">
                Ingen ansøgninger i din pipeline endnu. Tilføj en pulje for at holde styr på dit arbejde.
              </p>
            ) : (
              <div className="space-y-3">
                {allPipeline.slice(0, 4).map((p) => {
                  const statusColors: Record<string, string> = {
                    idea: 'bg-amber-50 text-amber-800 border-amber-200',
                    writing: 'bg-indigo-50 text-indigo-800 border-indigo-200',
                    submitted: 'bg-sky-50 text-sky-800 border-sky-200',
                    granted: 'bg-emerald-50 text-emerald-800 border-emerald-200',
                    rejected: 'bg-slate-100 text-slate-600 border-slate-200'
                  };
                  const statusNames: Record<string, string> = {
                    idea: 'Idéfase',
                    writing: 'Under udarbejdelse',
                    submitted: 'Indsendt',
                    granted: 'Bevilget',
                    rejected: 'Afslået'
                  };

                  return (
                    <div key={p.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {p.projectTitle}
                        </span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusColors[p.status] || 'bg-slate-100'}`}>
                          {statusNames[p.status] || p.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>{p.requestedAmount ? `${p.requestedAmount.toLocaleString('da-DK')} kr` : 'Beløb ikke angivet'}</span>
                        {p.customDeadline && <span>Frist: {p.customDeadline}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Diff-Detection Live Status Box */}
          <div className="nordic-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
                <span>Kildeovervågning (Lag 2)</span>
              </h3>
              <Link
                href="/overvaagning"
                className="text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Se monitorering
              </Link>
            </div>

            <div className="space-y-2.5">
              {allSources.slice(0, 4).map((src) => {
                const found = foundMap.get(src.foundationId);
                const isChanged = src.lastStatus === 'CHANGED';

                return (
                  <div key={src.id} className="text-xs flex items-start gap-2.5 p-2 rounded-md hover:bg-slate-50 transition-colors">
                    <span className={`w-2 h-2 rounded-full mt-1 shrink-0 ${isChanged ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'}`} />
                    <div className="space-y-0.5 min-w-0">
                      <div className="font-semibold text-slate-800 truncate">
                        {found?.name || 'Fond'}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {src.detectedChangesSummary || 'Overvåges via SHA-256 indholdshash'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
