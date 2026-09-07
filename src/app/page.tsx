import React from 'react';
import Link from 'next/link';
import { db } from '@/db';
import { grants, foundations, grantDeadlines, monitoredSources } from '@/db/schema';
import { 
  AlertCircle, 
  Calendar, 
  Clock, 
  ArrowRight, 
  Radio, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Database,
  Cpu
} from 'lucide-react';
import { DeadlineBadge } from '@/components/DeadlineBadge';

export const revalidate = 0; // Dynamic server component

export default async function DashboardPage() {
  const allGrants = db.select().from(grants).all();
  const allFoundations = db.select().from(foundations).all();
  const allDeadlines = db.select().from(grantDeadlines).all();
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

  const changedSourcesCount = allSources.filter(s => s.lastStatus === 'CHANGED').length;

  return (
    <div className="space-y-8">
      {/* Top Welcome / Mission Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Fondsnyt // Fondsovervågning
            </h1>
          </div>
          <p className="text-sm text-slate-600">
            Automatiseret overvågning af danske og europæiske tilskudspuljer, ansøgningsfrister og kildeændringer.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/overvaagning"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold shadow-xs transition-all"
          >
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>Kildeovervågning</span>
          </Link>
          <Link
            href="/puljer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold transition-colors"
          >
            <span>Udforsk Puljer</span>
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
          <p className="mt-2 text-xs text-slate-500">Kræver hurtig handling for indsendelse</p>
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
          <p className="mt-2 text-xs text-slate-500">Først-til-mølle eller løbende sagsbehandling</p>
        </div>

        {/* Overvågede Kilder */}
        <div className="nordic-card p-5 border-l-4 border-l-emerald-500 bg-linear-to-br from-white to-emerald-50/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Overvågede Kilder
            </span>
            <span className="p-1.5 rounded-md bg-emerald-100 text-emerald-700">
              <Radio className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {allSources.length}
            </span>
            <span className="text-xs font-medium text-emerald-700">
              {changedSourcesCount > 0 ? `${changedSourcesCount} ændring fundet` : 'aktive kilder'}
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">Automatisk SHA-256 hash & API-tjek</p>
        </div>
      </div>

      {/* Main Grid: Upcoming Deadlines Timeline & Live Monitoring */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 spans): Akutte og Nærmeste Deadlines */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-rose-500" />
                <span>Nærmeste Frister & Puljekalender</span>
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
            {deadlineList.slice(0, 6).map(({ grant, deadline, daysRemaining }) => {
              const targetUrl = grant.applicationUrl || grant.sourceUrl || grant.foundation?.websiteUrl || '#';
              const foundationWebsite = grant.foundation?.websiteUrl;

              return (
                <div
                  key={`${grant.id}-${deadline.id}`}
                  className="nordic-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-300 transition-all group"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {foundationWebsite ? (
                        <a
                          href={foundationWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-bold text-slate-500 hover:text-slate-800 uppercase tracking-wider inline-flex items-center gap-1 transition-colors"
                          title={`Besøg ${grant.foundation?.name}`}
                        >
                          <span>{grant.foundation?.name}</span>
                          <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                        </a>
                      ) : (
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          {grant.foundation?.name}
                        </span>
                      )}
                      {grant.region === 'EU' && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-bold badge-eu">
                          EU
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-900 transition-colors">
                      <a
                        href={targetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline inline-flex items-center gap-1.5"
                        title="Gå direkte til puljesiden"
                      >
                        <span>{grant.title}</span>
                      </a>
                    </h4>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      {deadline.notes && <span>{deadline.notes}</span>}
                      {grant.maxAmount && (
                        <span>• Op til {grant.maxAmount.toLocaleString('da-DK')} {grant.currency}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    <DeadlineBadge
                      deadlineDate={deadline.deadlineDate}
                      isOngoing={deadline.isOngoing}
                    />
                    <a
                      href={targetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-medium transition-colors"
                      title="Åbn officiel kilde i ny fane"
                    >
                      <span className="hidden sm:inline text-[11px]">Kilde</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (1 span): Live Kildeovervågning & Overvågningsstatus */}
        <div className="space-y-6">
          {/* Diff-Detection Live Status Box */}
          <div className="nordic-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
                <span>Kildeovervågning (Live)</span>
              </h3>
              <Link
                href="/overvaagning"
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-0.5"
              >
                <span>Alle kilder</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-2.5">
              {allSources.slice(0, 5).map((src) => {
                const found = foundMap.get(src.foundationId);
                const isChanged = src.lastStatus === 'CHANGED';

                return (
                  <div key={src.id} className="text-xs flex items-start gap-2.5 p-2 rounded-md hover:bg-slate-50 transition-colors">
                    <span className={`w-2 h-2 rounded-full mt-1 shrink-0 ${isChanged ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'}`} />
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-semibold text-slate-800 truncate">
                          {found?.name || 'Fond'}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 shrink-0">
                          {src.sourceType}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {src.detectedChangesSummary || 'Overvåges via SHA-256 indholdshash'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 mt-3 border-t border-slate-100">
              <Link
                href="/overvaagning"
                className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200/80 transition-colors"
              >
                <span>Gå til monitoreringscenter</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            </div>
          </div>

          {/* Overvågningsarkitektur & Sikkerhed */}
          <div className="nordic-card p-5 space-y-3 bg-slate-50/60">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>3-Lags Overvågningsmodel</span>
            </h3>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-start gap-2">
                <Database className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                <span><strong>Lag 1:</strong> Direkte JSON API'er (SLKS, Statens puljer, EU Tenders)</span>
              </div>
              <div className="flex items-start gap-2">
                <Cpu className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                <span><strong>Lag 2:</strong> SHA-256 Diff-detection på private fondshjemmesider</span>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Lag 3:</strong> CVR Erhvervsstyrelsen (nystiftede fonde)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
