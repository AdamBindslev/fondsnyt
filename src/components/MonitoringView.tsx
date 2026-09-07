'use client';

import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  ShieldCheck, 
  Layers, 
  Cpu, 
  Database,
  Hash,
  Loader2,
  Sparkles
} from 'lucide-react';

interface MonitoredSourceItem {
  id: string;
  foundationId: string;
  sourceType: string;
  targetUrl: string;
  contentSelector?: string | null;
  lastContentHash?: string | null;
  lastCheckedAt?: string | null;
  lastStatus: string;
  status: string;
  detectedChangesSummary?: string | null;
  foundation?: {
    name: string;
    websiteUrl: string;
  } | null;
}

export function MonitoringView() {
  const [sources, setSources] = useState<MonitoredSourceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [crawling, setCrawling] = useState(false);
  const [lastSyncResult, setLastSyncResult] = useState<string | null>(null);

  const fetchSources = async () => {
    try {
      const res = await fetch('/api/crawl');
      if (res.ok) {
        const data = await res.json();
        setSources(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSources();
  }, []);

  const triggerCrawl = async () => {
    setCrawling(true);
    setLastSyncResult(null);
    try {
      const res = await fetch('/api/crawl', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setLastSyncResult(`Synkroniseret ${data.checkedCount} kilder kl. ${new Date().toLocaleTimeString('da-DK')}.`);
        await fetchSources();
      }
    } catch (err) {
      console.error(err);
      setLastSyncResult('Fejl ved kørsel af synkronisering.');
    } finally {
      setCrawling(false);
    }
  };

  const changedCount = sources.filter((s) => s.lastStatus === 'CHANGED').length;

  return (
    <div className="space-y-8">
      {/* 3-layer architecture visual breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="nordic-card p-5 border-l-4 border-l-sky-500 bg-linear-to-br from-white to-sky-50/20">
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-md bg-sky-100 text-sky-700">
              <Database className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-sky-800 uppercase tracking-wider">
              Lag 1: API & Feeds
            </span>
          </div>
          <h4 className="text-sm font-bold text-slate-900">Offentlige Portaler & EU</h4>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Strukturerede JSON endpoints fra Statens-tilskudspuljer, Slots- og Kulturstyrelsen (SLKS) og EU Tenders Portal.
          </p>
        </div>

        <div className="nordic-card p-5 border-l-4 border-l-indigo-500 bg-linear-to-br from-white to-indigo-50/20">
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-md bg-indigo-100 text-indigo-700">
              <Cpu className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-indigo-800 uppercase tracking-wider">
              Lag 2: Diff-Detection
            </span>
          </div>
          <h4 className="text-sm font-bold text-slate-900">SHA-256 Hash Kontrol</h4>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Automatisk indholdskontrol af 30+ private fonde (Nordea, Bikuben, Tuborg mv.). Parser kun via LLM når ændringer detekteres.
          </p>
        </div>

        <div className="nordic-card p-5 border-l-4 border-l-emerald-500 bg-linear-to-br from-white to-emerald-50/20">
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-md bg-emerald-100 text-emerald-700">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Lag 3: CVR Register
            </span>
          </div>
          <h4 className="text-sm font-bold text-slate-900">Nye Fondsstiftelser</h4>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Datafordeler-overvågning på branchekoder 64.20.20 og 88.99.10 for at fange nystiftede fonde og formålsændringer.
          </p>
        </div>
      </div>

      {/* Control bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
            <h2 className="text-base font-bold text-slate-900">
              Overvågede Kilder ({sources.length})
            </h2>
            {changedCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold badge-warning">
                {changedCount} ændring fundet
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Systemet gemmer hash for hver side for at eliminere redundante LLM tokens.
          </p>
          {lastSyncResult && (
            <p className="text-xs font-medium text-emerald-600 mt-1">
              ✓ {lastSyncResult}
            </p>
          )}
        </div>

        <button
          onClick={triggerCrawl}
          disabled={crawling}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-all disabled:opacity-50 shrink-0"
        >
          {crawling ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Kører Diff-Detection...</span>
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              <span>Kør Synkronisering Nu</span>
            </>
          )}
        </button>
      </div>

      {/* Monitored Sources Table */}
      <div className="nordic-card overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Fond & Institution</th>
                <th className="py-3 px-4">Metode</th>
                <th className="py-3 px-4">Kilde URL</th>
                <th className="py-3 px-4">SHA-256 Hash</th>
                <th className="py-3 px-4">Seneste Tjek</th>
                <th className="py-3 px-4">Status & Fund</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sources.map((src) => {
                const isChanged = src.lastStatus === 'CHANGED';

                return (
                  <tr key={src.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Fond */}
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {src.foundation?.name || 'Fond'}
                    </td>

                    {/* Type */}
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {src.sourceType}
                      </span>
                    </td>

                    {/* URL */}
                    <td className="py-3 px-4 max-w-xs truncate text-slate-500">
                      <a
                        href={src.targetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-slate-900 inline-flex items-center gap-1"
                      >
                        <span className="truncate">{src.targetUrl}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </td>

                    {/* Hash */}
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                      {src.lastContentHash ? `${src.lastContentHash.slice(0, 10)}...` : '—'}
                    </td>

                    {/* Last Checked */}
                    <td className="py-3 px-4 text-slate-500">
                      {src.lastCheckedAt
                        ? new Date(src.lastCheckedAt).toLocaleDateString('da-DK', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : 'Ikke tjekket'}
                    </td>

                    {/* Status & Summary */}
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold ${
                            isChanged
                              ? 'badge-warning'
                              : 'badge-calm'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isChanged ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'
                            }`}
                          />
                          {isChanged ? 'Ændring opdaget' : 'Uændret (OK)'}
                        </span>
                        {src.detectedChangesSummary && (
                          <div className="flex items-start gap-1.5 text-[11px] text-slate-700 max-w-sm leading-tight bg-slate-50/80 p-1.5 rounded border border-slate-200/70">
                            {isChanged && <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />}
                            <span>{src.detectedChangesSummary}</span>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
