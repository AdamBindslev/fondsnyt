'use client';

import React, { useState, useEffect } from 'react';
import { 
  KanbanSquare, 
  Plus, 
  Trash2, 
  MoveRight, 
  Coins, 
  Calendar, 
  FileText, 
  CheckCircle2, 
  XCircle,
  Clock,
  ExternalLink
} from 'lucide-react';
import { DeadlineBadge } from './DeadlineBadge';

interface PipelineItem {
  id: string;
  grantId: string;
  projectTitle: string;
  status: 'idea' | 'writing' | 'submitted' | 'granted' | 'rejected';
  notes?: string | null;
  requestedAmount?: number | null;
  customDeadline?: string | null;
  submissionDate?: string | null;
  grant?: {
    id: string;
    title: string;
    categories: string[];
    sourceUrl: string;
    applicationUrl?: string | null;
  } | null;
  foundation?: {
    name: string;
  } | null;
}

const COLUMNS = [
  { id: 'idea', label: 'Idéfase', icon: '💡', color: 'border-t-amber-400' },
  { id: 'writing', label: 'Under udarbejdelse', icon: '✍️', color: 'border-t-indigo-500' },
  { id: 'submitted', label: 'Indsendt', icon: '🚀', color: 'border-t-sky-500' },
  { id: 'granted', label: 'Bevilget', icon: '🎉', color: 'border-t-emerald-500' },
  { id: 'rejected', label: 'Afslået', icon: '❌', color: 'border-t-slate-400' }
] as const;

export function PipelineBoard() {
  const [items, setItems] = useState<PipelineItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/pipeline');
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (err) {
      console.error('Failed to load pipeline:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    // Optimistic update
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus as any } : item))
    );

    try {
      await fetch('/api/pipeline', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      });
    } catch (err) {
      console.error(err);
      fetchItems();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Er du sikker på, at du vil fjerne denne ansøgning fra din pipeline?')) return;

    setItems((prev) => prev.filter((item) => item.id !== id));
    try {
      await fetch(`/api/pipeline?id=${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error(err);
      fetchItems();
    }
  };

  // Metrics
  const totalRequested = items.reduce((sum, item) => sum + (item.requestedAmount || 0), 0);
  const totalGranted = items
    .filter((item) => item.status === 'granted')
    .reduce((sum, item) => sum + (item.requestedAmount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top metrics summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="nordic-card p-4">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Aktive Ansøgninger
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {items.length} projekter
          </div>
          <p className="text-xs text-slate-500 mt-1">I fundraising pipeline</p>
        </div>

        <div className="nordic-card p-4 border-l-4 border-l-indigo-500">
          <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wider">
            Samlet Søgt Beløb
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {totalRequested.toLocaleString('da-DK')} DKK
          </div>
          <p className="text-xs text-slate-500 mt-1">På tværs af alle faser</p>
        </div>

        <div className="nordic-card p-4 border-l-4 border-l-emerald-500">
          <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
            Bevilget Finansiering
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {totalGranted.toLocaleString('da-DK')} DKK
          </div>
          <p className="text-xs text-slate-500 mt-1">Hjemtaget kapital</p>
        </div>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-start">
        {COLUMNS.map((col) => {
          const colItems = items.filter((item) => item.status === col.id);
          const colSum = colItems.reduce((acc, curr) => acc + (curr.requestedAmount || 0), 0);

          return (
            <div
              key={col.id}
              className={`bg-slate-100/75 rounded-xl border border-slate-200/80 border-t-4 ${col.color} p-3 space-y-3 min-h-[500px] flex flex-col`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">{col.icon}</span>
                  <h3 className="text-xs font-bold text-slate-800 tracking-tight">
                    {col.label}
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-slate-600 border border-slate-200">
                  {colItems.length}
                </span>
              </div>

              {colSum > 0 && (
                <div className="text-[11px] text-slate-500 font-medium px-1">
                  I alt: {colSum.toLocaleString('da-DK')} kr
                </div>
              )}

              {/* Cards list */}
              <div className="space-y-3 flex-1">
                {colItems.length === 0 ? (
                  <div className="h-32 rounded-lg border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 text-xs">
                    Ingen sager her
                  </div>
                ) : (
                  colItems.map((item) => (
                    <div
                      key={item.id}
                      className="nordic-card p-3.5 space-y-2.5 bg-white text-xs hover:border-slate-300 transition-all group"
                    >
                      {/* Foundation name & delete button */}
                      <div className="flex items-center justify-between gap-1 text-slate-400">
                        <span className="font-bold text-[10px] text-slate-500 uppercase tracking-wider truncate">
                          {item.foundation?.name || 'Fond'}
                        </span>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 transition-opacity"
                          title="Slet fra pipeline"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Project Title */}
                      <h4 className="font-bold text-slate-900 text-sm leading-snug">
                        {item.projectTitle}
                      </h4>

                      {/* Grant title */}
                      {item.grant && (
                        <p className="text-[11px] text-slate-500 truncate">
                          Pulje: {item.grant.title}
                        </p>
                      )}

                      {/* Requested Amount */}
                      {item.requestedAmount && (
                        <div className="inline-flex items-center gap-1 font-semibold text-slate-800 bg-slate-50 px-2 py-1 rounded border border-slate-200/60">
                          <Coins className="w-3 h-3 text-slate-400" />
                          <span>{item.requestedAmount.toLocaleString('da-DK')} DKK</span>
                        </div>
                      )}

                      {/* Notes excerpt */}
                      {item.notes && (
                        <p className="text-[11px] text-slate-600 bg-slate-50/70 p-2 rounded border border-slate-100 leading-relaxed italic">
                          "{item.notes}"
                        </p>
                      )}

                      {/* Stage selector dropdown */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                        <select
                          value={item.status}
                          onChange={(e) => handleUpdateStatus(item.id, e.target.value)}
                          className="w-full text-[11px] font-medium bg-slate-50 border border-slate-200 rounded p-1 text-slate-700 focus:outline-hidden"
                        >
                          <option value="idea">💡 Flyt til Idé</option>
                          <option value="writing">✍️ Flyt til Udarbejdelse</option>
                          <option value="submitted">🚀 Flyt til Indsendt</option>
                          <option value="granted">🎉 Flyt til Bevilget</option>
                          <option value="rejected">❌ Flyt til Afslået</option>
                        </select>

                        {item.grant?.applicationUrl && (
                          <a
                            href={item.grant.applicationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 text-slate-400 hover:text-slate-800"
                            title="Portal"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
