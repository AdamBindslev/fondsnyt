import React from 'react';
import Link from 'next/link';
import { db } from '@/db';
import { grants, foundations, grantDeadlines, monitoredSources } from '@/db/schema';
import { 
  Building2,
  Layers,
  Calendar,
  Radio,
  ExternalLink,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  Palette,
  Users,
  HeartHandshake,
  Sparkles,
  Trees,
  Landmark,
  Coins,
  CheckCircle2,
  BookOpen,
  Info
} from 'lucide-react';

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

  // Puljer med verificeret løbende ansøgningsbehandling
  const ongoingGrants = enrichedGrants.filter(g => 
    g.deadlines.some(d => d.isOngoing)
  );

  const changedSourcesCount = allSources.filter(s => s.lastStatus === 'CHANGED').length;

  // Fokusområder med optælling af puljer
  const categoryCards = [
    {
      title: 'Kultur, Scenekunst & Musik',
      slug: 'Kultur',
      description: 'Teater, koncerter, samtidskunst og kulturarvsprojekter',
      icon: Palette,
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
      count: enrichedGrants.filter(g => g.categories.some(c => ['Kultur', 'Billedkunst', 'Musik', 'Scenekunst', 'Samtidskunst', 'Kulturarv'].includes(c))).length
    },
    {
      title: 'Fællesskab & Civilsamfund',
      slug: 'Fællesskab',
      description: 'Lokale borgerinitiativer, frivillighed og mødesteder',
      icon: Users,
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
      count: enrichedGrants.filter(g => g.categories.some(c => ['Fællesskab', 'Civilsamfund', 'Frivillighed'].includes(c))).length
    },
    {
      title: 'Sociale Indsatser & Trivsel',
      slug: 'Social',
      description: 'Udsatte grupper, trivsel, ensomhed og social rådgivning',
      icon: HeartHandshake,
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
      count: enrichedGrants.filter(g => g.categories.some(c => ['Social', 'Sundhed'].includes(c))).length
    },
    {
      title: 'Børn, Unge & Uddannelse',
      slug: 'Børn & Unge',
      description: 'Ungeinitiativer, læring, trivsel og talentudvikling',
      icon: Sparkles,
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      count: enrichedGrants.filter(g => g.categories.some(c => ['Børn & Unge', 'Ungdom', 'Uddannelse'].includes(c))).length
    },
    {
      title: 'Natur, Miljø & Friluftsliv',
      slug: 'Natur & Miljø',
      description: 'Vild natur, friluftsliv, grøn omstilling og biodiversitet',
      icon: Trees,
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      count: enrichedGrants.filter(g => g.categories.some(c => ['Natur & Miljø', 'Idræt & Friluftsliv', 'Bæredygtighed'].includes(c))).length
    },
    {
      title: 'Byggeri, Byrum & Arkitektur',
      slug: 'Byggeri/Byrum',
      description: 'Fysiske samlingssteder, bygningsarv og byrum',
      icon: Landmark,
      badgeColor: 'bg-slate-100 text-slate-800 border-slate-200',
      count: enrichedGrants.filter(g => g.categories.some(c => ['Byggeri/Byrum', 'Kulturarv'].includes(c))).length
    }
  ];

  // Centrale offentlige og private portaler
  const officialPortals = [
    {
      name: 'Statens Tilskudspuljer',
      operator: 'Social- og Boligstyrelsen / Ministerierne',
      url: 'https://statens-tilskudspuljer.dk',
      description: 'Statslige puljer og § 18-midler til civilsamfund, udsatte borgere og frivillighed.'
    },
    {
      name: 'Statens Kunstfond Portal',
      operator: 'Slots- og Kulturstyrelsen',
      url: 'https://portal.slks.dk',
      description: 'Det centrale digitale ansøgningssystem for al statslig kunst- og kulturstøtte.'
    },
    {
      name: 'EU Funding & Tenders Portal',
      operator: 'Europa-Kommissionen',
      url: 'https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/home',
      description: 'Adgang til Creative Europe, Erasmus+, Horizon Europe og CERV programmerne.'
    },
    {
      name: 'NORMA Grants Portal',
      operator: 'Novo Nordisk Fonden',
      url: 'https://norma.novonordiskfonden.dk',
      description: 'Digital ansøgningsportal for Novo Nordisk Fondens uddelinger og calls.'
    }
  ];

  const formatAmount = (min: number | null, max: number | null, curr: string) => {
    if (min && max) return `${min.toLocaleString('da-DK')} – ${max.toLocaleString('da-DK')} ${curr}`;
    if (max) return `Op til ${max.toLocaleString('da-DK')} ${curr}`;
    if (min) return `Fra ${min.toLocaleString('da-DK')} ${curr}`;
    return 'Beløb efter ansøgning';
  };

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
            Intelligens og automatiseret overvågning af danske og europæiske fonde, puljer og kildeændringer.
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
            <span>Udforsk Alle Puljer</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* KPI Cards: Reelle nøgletal over datagrundlaget */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Aktive Fonde */}
        <Link href="/puljer" className="nordic-card p-5 border-l-4 border-l-slate-900 bg-linear-to-br from-white to-slate-50/50 hover:border-slate-400 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Registrerede Fonde
            </span>
            <span className="p-1.5 rounded-md bg-slate-100 text-slate-700">
              <Building2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{allFoundations.length}</span>
            <span className="text-xs font-medium text-slate-600">aktive donorer</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">Almennyttige, erhvervsdrivende, offentlige & EU</p>
        </Link>

        {/* 2. Monitorerede Puljer */}
        <Link href="/puljer" className="nordic-card p-5 border-l-4 border-l-indigo-500 bg-linear-to-br from-white to-indigo-50/20 hover:border-indigo-400 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
              Monitorerede Puljer
            </span>
            <span className="p-1.5 rounded-md bg-indigo-100 text-indigo-700">
              <Layers className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{allGrants.length}</span>
            <span className="text-xs font-medium text-indigo-600">tilskudsordninger</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">Med verificerede links til officielle vejledninger</p>
        </Link>

        {/* 3. Åbne Puljer Lige Nu */}
        <a href="#loebende-puljer" className="nordic-card p-5 border-l-4 border-l-sky-500 bg-linear-to-br from-white to-sky-50/20 hover:border-sky-400 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">
              Løbende Åbne Puljer
            </span>
            <span className="p-1.5 rounded-md bg-sky-100 text-sky-700">
              <Calendar className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{ongoingGrants.length}</span>
            <span className="text-xs font-medium text-sky-700">åbne for ansøgning nu</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">Uden tidsbegrænsning – løbende sagsbehandling</p>
        </a>

        {/* 4. Overvågede Webkilder */}
        <Link href="/overvaagning" className="nordic-card p-5 border-l-4 border-l-emerald-500 bg-linear-to-br from-white to-emerald-50/20 hover:border-emerald-400 transition-all">
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
              {changedSourcesCount > 0 ? `${changedSourcesCount} ændring fundet` : 'aktive scanninger'}
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">Automatisk SHA-256 hash & API-tjek</p>
        </Link>
      </div>

      {/* Main Grid: Løbende Puljer & Thematic Gateway vs Live Monitoring */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 spans): Aktive Puljer & Kategori-indgange */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* SEKTION 1: Åbne puljer med løbende ansøgning */}
          <div id="loebende-puljer" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-sky-600" />
                  <span>Åbne Puljer med Løbende Ansøgning ({ongoingGrants.length})</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Verificerede puljer, hvor du kan indsende en ansøgning allerede i dag uden at afvente faste tidsfrister.
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

            <div className="grid grid-cols-1 gap-3">
              {ongoingGrants.map((grant) => {
                const infoUrl = grant.sourceUrl || grant.foundation?.websiteUrl || '#';
                const hasSeparateApplication = Boolean(
                  grant.applicationUrl &&
                  grant.applicationUrl.trim() !== '' &&
                  grant.applicationUrl !== grant.sourceUrl
                );
                const foundationWebsite = grant.foundation?.websiteUrl;

                return (
                  <div
                    key={grant.id}
                    className="nordic-card p-4.5 flex flex-col justify-between gap-3 hover:border-slate-300 transition-all group"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
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

                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold badge-ongoing">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                          Løbende frist
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-900 transition-colors">
                        <a
                          href={infoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline inline-flex items-center gap-1.5"
                          title="Læs officiel vejledning og betingelser for puljen"
                        >
                          <span>{grant.title}</span>
                        </a>
                      </h3>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {grant.description}
                      </p>
                    </div>

                    <div className="pt-2.5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                        <Coins className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formatAmount(grant.minAmount, grant.maxAmount, grant.currency)}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={infoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-medium transition-colors shadow-xs"
                          title="Læs puljevejledning & krav"
                        >
                          <span className="text-[11px]">Vejledning</span>
                          <ExternalLink className="w-3 h-3 text-slate-300" />
                        </a>
                        {hasSeparateApplication && (
                          <a
                            href={grant.applicationUrl!}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-medium transition-colors border border-slate-200"
                            title="Gå til digitalt ansøgningsskema / portal"
                          >
                            <span className="text-[11px]">Ansøg</span>
                            <ExternalLink className="w-3 h-3 text-slate-400" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SEKTION 2: Udforsk puljer efter formål / fokusområde */}
          <div className="space-y-4 pt-2">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                <span>Udforsk Fonde & Puljer efter Fokusområde</span>
              </h2>
              <p className="text-xs text-slate-500">
                Find relevante tilskudsmuligheder målrettet dit faglige felt og målgruppe.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {categoryCards.map((cat) => {
                const IconComponent = cat.icon;
                return (
                  <Link
                    key={cat.title}
                    href={`/puljer?kategori=${encodeURIComponent(cat.slug)}`}
                    className="nordic-card p-4 hover:border-slate-300 hover:shadow-xs transition-all flex flex-col justify-between group"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="p-2 rounded-lg bg-slate-50 group-hover:bg-indigo-50 text-slate-700 group-hover:text-indigo-600 transition-colors">
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${cat.badgeColor}`}>
                          {cat.count} puljer
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-900 transition-colors pt-1">
                        {cat.title}
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {cat.description}
                      </p>
                    </div>

                    <div className="pt-3 flex items-center text-xs font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors gap-1">
                      <span>Udforsk puljer</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Infoboks: Verificeret datagrundlag */}
          <div className="nordic-card p-4.5 bg-slate-50/80 border-slate-200/90 flex items-start gap-3">
            <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs text-slate-600">
              <span className="font-semibold text-slate-900">Verificeret datagrundlag uden gætværk:</span>
              <p className="leading-relaxed">
                Fondsnyt viser udelukkende verificerede oplysninger fra fondenes officielle sider. Der anvendes ingen kunstige eller opdigtede ansøgningsfrister. Periodiske puljer opdateres automatisk, så snart kildeovervågningen registrerer nye datoer fra fondens portal.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column (1 span): Live Kildeovervågning & Centrale Portaler */}
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

          {/* Centrale Digitale Fondsportaler */}
          <div className="nordic-card p-5 space-y-3.5">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                <span>Centrale Fondsportaler</span>
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Direkte adgang til de store officielle ansøgningssystemer.
              </p>
            </div>

            <div className="space-y-2 pt-1">
              {officialPortals.map((portal) => (
                <a
                  key={portal.name}
                  href={portal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-lg border border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/70 transition-all flex flex-col gap-1 group block"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-900 transition-colors">
                      {portal.name}
                    </span>
                    <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-slate-600 transition-colors shrink-0" />
                  </div>
                  <span className="text-[10px] font-medium text-slate-500">
                    {portal.operator}
                  </span>
                  <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5 leading-snug">
                    {portal.description}
                  </p>
                </a>
              ))}
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
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                <span><strong>Lag 1:</strong> Direkte JSON API'er (SLKS, Statens puljer, EU Tenders)</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                <span><strong>Lag 2:</strong> SHA-256 Diff-detection på private fondshjemmesider</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Lag 3:</strong> CVR Erhvervsstyrelsen (nystiftede fonde)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
