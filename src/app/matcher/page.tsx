'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Coins, 
  Calendar, 
  BookmarkPlus, 
  Lightbulb, 
  ExternalLink,
  ChevronRight,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { DeadlineBadge } from '@/components/DeadlineBadge';
import { PipelineModal } from '@/components/PipelineModal';

interface MatchItem {
  grantId: string;
  grantTitle: string;
  foundationName: string;
  matchScore: number;
  matchStrengths: string[];
  tipsForApplication: string;
  budgetFit: string;
  deadlineInfo: {
    daysRemaining: number | null;
    isOngoing: boolean;
    date: string | null;
    signalColor: string;
  };
  grant: {
    id: string;
    title: string;
    description: string;
    categories: string[];
    minAmount: number | null;
    maxAmount: number | null;
    currency: string;
    sourceUrl: string;
    applicationUrl?: string | null;
    foundation: { name: string };
  };
}

export default function MatcherPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [category, setCategory] = useState('Kultur');
  const [targetGroup, setTargetGroup] = useState('Unge 16-30 år');
  
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<MatchItem[] | null>(null);
  const [selectedGrantForModal, setSelectedGrantForModal] = useState<any | null>(null);

  // Quick preset loader for fast testing
  const loadExample = (type: 'kultur' | 'social' | 'byggeri') => {
    if (type === 'kultur') {
      setTitle('Ungdoms-Scenekunst: Stemmer fra Gaden');
      setDescription('Et nytænkende teater- og performanceprojekt i Aarhus og Odense, hvor 25 udsatte unge sammen med professionelle instruktører skaber en turnerende forestilling om ensomhed, håb og identitet.');
      setBudget('350000');
      setCategory('Scenekunst');
      setTargetGroup('Unge 16-30 år');
    } else if (type === 'social') {
      setTitle('Lektiecafé og Fællesspisning for Sårbare Børnefamilier');
      setDescription('Frivillig indsats der tilbyder ugentlig lektiehjælp, sund fællesspisning og mentorstøtte til børn og forældre i udsatte boligområder for at styrke børns skolegang og forældrenes netværk.');
      setBudget('180000');
      setCategory('Social');
      setTargetGroup('Børn og familier');
    } else {
      setTitle('Kulturmøllen: Grønt Byrum og Værksted i det Gamle Pakhus');
      setDescription('Borgere og lokale foreninger vil restaurere og omdanne et forladt pakhus til et cirkulært reparationsværksted, fælles café og udstillingssted for lokal kultur og håndværk.');
      setBudget('800000');
      setCategory('Byggeri/Byrum');
      setTargetGroup('Lokalsamfund');
    }
  };

  const handleMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/matcher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectTitle: title || 'Nyt projekt',
          projectDescription: description,
          budget: budget ? parseFloat(budget) : undefined,
          category,
          targetGroup
        })
      });

      if (res.ok) {
        const data = await res.json();
        setResults(data.matches);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1 rounded-md bg-indigo-50 text-indigo-600">
            <Sparkles className="w-5 h-5" />
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Match mit Projekt (Intelligent Fundraising Assistent)
          </h1>
        </div>
        <p className="text-sm text-slate-600">
          Indsæt din projektidé, formål og budget. Systemet analyserer ansøgningskriterier, strategiske fokusområder og puljernes målgrupper for at finde de bedste match.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Form Column (5 spans) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="nordic-card p-6 bg-white space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Projektparametre
              </span>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <span>Prøv en case:</span>
                <button
                  type="button"
                  onClick={() => loadExample('kultur')}
                  className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                >
                  Kultur
                </button>
                <button
                  type="button"
                  onClick={() => loadExample('social')}
                  className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                >
                  Social
                </button>
                <button
                  type="button"
                  onClick={() => loadExample('byggeri')}
                  className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                >
                  Byrum
                </button>
              </div>
            </div>

            <form onSubmit={handleMatch} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Projekttitel
                </label>
                <input
                  type="text"
                  placeholder="F.eks. Skaberrum for Udsatte Unge"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Projektbeskrivelse / Pitch *
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="Beskriv projektets formål, aktiviteter, forventet effekt og hvorfor det er nyskabende..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900 leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Forventet Budget (DKK)
                  </label>
                  <input
                    type="number"
                    placeholder="F.eks. 350000"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Primær Kategori
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                  >
                    <option value="Kultur">Kultur & Kunst</option>
                    <option value="Scenekunst">Scenekunst & Teater</option>
                    <option value="Billedkunst">Billedkunst</option>
                    <option value="Musik">Musik</option>
                    <option value="Social">Social indsats</option>
                    <option value="Børn & Unge">Børn & Unge</option>
                    <option value="Byggeri/Byrum">Byggeri & Byrum</option>
                    <option value="Fællesskab">Lokale Fællesskaber</option>
                    <option value="EU / International">EU / International</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Målgruppe
                </label>
                <input
                  type="text"
                  placeholder="F.eks. Unge 16-30 år, kunstnere, udsatte børn"
                  value={targetGroup}
                  onChange={(e) => setTargetGroup(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !description.trim()}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-xs transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyserer og scorer fonde...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Beregn Fondsmatch</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Results Column (7 spans) */}
        <div className="lg:col-span-7 space-y-4">
          {!results ? (
            <div className="bg-white p-12 text-center rounded-xl border border-slate-200 space-y-3">
              <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center">
                <Lightbulb className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                Klar til at analysere dit projekt
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Udfyld formularen til venstre eller klik på en af eksempelkasserne for straks at se hvilke danske og europæiske fonde der passer bedst til dit formål.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Top Match Resultater ({results.length} puljer analyseret)
                </span>
                <span className="text-xs text-slate-500">
                  Rangeret efter match-score
                </span>
              </div>

              {results.map((match) => {
                const isHighMatch = match.matchScore >= 75;
                const isMedMatch = match.matchScore >= 50 && match.matchScore < 75;

                return (
                  <div
                    key={match.grantId}
                    className="nordic-card p-5 space-y-4 border-l-4 border-l-indigo-600 hover:border-slate-300 transition-all"
                  >
                    {/* Header with match score badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          {match.foundationName}
                        </span>
                        <h3 className="text-base font-bold text-slate-900 mt-0.5">
                          {match.grantTitle}
                        </h3>
                      </div>

                      {/* Score circle badge */}
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-12 h-12 rounded-full flex flex-col items-center justify-center font-extrabold text-sm border-2 ${
                            isHighMatch
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                              : isMedMatch
                              ? 'bg-amber-50 text-amber-700 border-amber-300'
                              : 'bg-slate-50 text-slate-700 border-slate-300'
                          }`}
                        >
                          <span>{match.matchScore}%</span>
                          <span className="text-[9px] font-normal uppercase -mt-0.5">Match</span>
                        </div>
                      </div>
                    </div>

                    {/* Deadline and budget status */}
                    <div className="flex flex-wrap items-center gap-3 text-xs">
                      <DeadlineBadge
                        deadlineDate={match.deadlineInfo.date}
                        isOngoing={match.deadlineInfo.isOngoing}
                      />

                      {match.grant.maxAmount && (
                        <span className="inline-flex items-center gap-1 font-medium text-slate-700">
                          <Coins className="w-3.5 h-3.5 text-slate-400" />
                          Op til {match.grant.maxAmount.toLocaleString('da-DK')} {match.grant.currency}
                        </span>
                      )}
                    </div>

                    {/* Strengths / Why it matches */}
                    <div className="p-3 bg-slate-50 rounded-lg space-y-1.5 border border-slate-200/60">
                      <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                        Hvorfor matcher denne pulje:
                      </span>
                      <ul className="space-y-1 text-xs text-slate-700">
                        {match.matchStrengths.map((str, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                            <span>{str}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Strategic Advice */}
                    <div className="p-3 bg-indigo-50/50 rounded-lg border border-indigo-100 space-y-1 text-xs text-indigo-950">
                      <div className="flex items-center gap-1.5 font-bold text-indigo-900">
                        <Lightbulb className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Strategisk råd til ansøgningen:</span>
                      </div>
                      <p className="leading-relaxed text-indigo-900/90 pl-5">
                        {match.tipsForApplication}
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                      <a
                        href={match.grant.applicationUrl || match.grant.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900"
                      >
                        <span>Gå til fondens portal</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>

                      <button
                        onClick={() => setSelectedGrantForModal(match.grant)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors shadow-2xs"
                      >
                        <BookmarkPlus className="w-3.5 h-3.5" />
                        <span>Føj til min Pipeline</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <PipelineModal
        grant={selectedGrantForModal}
        isOpen={!!selectedGrantForModal}
        onClose={() => setSelectedGrantForModal(null)}
      />
    </div>
  );
}
