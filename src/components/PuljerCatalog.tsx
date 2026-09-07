'use client';

import React, { useState, useMemo } from 'react';
import { Search, Filter, SlidersHorizontal, RotateCcw, Coins, Calendar, Sparkles } from 'lucide-react';
import { GrantCard } from './GrantCard';

interface GrantItem {
  id: string;
  title: string;
  description: string;
  categories: string[];
  targetGroups: string[];
  minAmount: number | null;
  maxAmount: number | null;
  currency: string;
  region: string;
  sourceUrl: string;
  applicationUrl?: string | null;
  successRateEst?: string | null;
  foundation?: {
    name: string;
    websiteUrl?: string;
    type?: string | null;
  } | null;
  deadlines?: {
    id: string;
    deadlineDate: string | null;
    isOngoing: boolean;
    notes?: string | null;
  }[];
}

interface PuljerCatalogProps {
  initialGrants: GrantItem[];
}

const CATEGORIES = [
  'Alle',
  'Kultur',
  'Scenekunst',
  'Billedkunst',
  'Musik',
  'Social',
  'Børn & Unge',
  'Fællesskab',
  'Byggeri/Byrum',
  'Forskning',
  'EU / International'
];

export function PuljerCatalog({ initialGrants }: PuljerCatalogProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Alle');
  const [selectedRegion, setSelectedRegion] = useState('Alle');
  const [deadlineFilter, setDeadlineFilter] = useState<'all' | 'urgent' | 'upcoming' | 'ongoing'>('all');
  const [sortBy, setSortBy] = useState<'deadline' | 'amount_desc' | 'title'>('deadline');

  const filteredGrants = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return initialGrants.filter((g) => {
      // Search term
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchTitle = g.title.toLowerCase().includes(q);
        const matchDesc = g.description.toLowerCase().includes(q);
        const matchFound = g.foundation?.name.toLowerCase().includes(q);
        const matchCat = g.categories.some(c => c.toLowerCase().includes(q));
        const matchTg = g.targetGroups.some(t => t.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchFound && !matchCat && !matchTg) {
          return false;
        }
      }

      // Category
      if (selectedCategory !== 'Alle') {
        if (!g.categories.includes(selectedCategory)) return false;
      }

      // Region
      if (selectedRegion !== 'Alle') {
        if (g.region !== selectedRegion) return false;
      }

      // Deadline filter
      if (deadlineFilter !== 'all') {
        const primary = g.deadlines?.[0];
        if (!primary) return false;

        if (deadlineFilter === 'ongoing') {
          if (!primary.isOngoing) return false;
        } else if (deadlineFilter === 'urgent') {
          if (primary.isOngoing || !primary.deadlineDate) return false;
          const diff = Math.ceil((new Date(primary.deadlineDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          if (diff < 0 || diff > 14) return false;
        } else if (deadlineFilter === 'upcoming') {
          if (primary.isOngoing || !primary.deadlineDate) return false;
          const diff = Math.ceil((new Date(primary.deadlineDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          if (diff < 0 || diff > 30) return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'amount_desc') {
        return (b.maxAmount || 0) - (a.maxAmount || 0);
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title, 'da');
      }

      // Sort by deadline
      const dateA = a.deadlines?.[0]?.deadlineDate;
      const dateB = b.deadlines?.[0]?.deadlineDate;
      if (a.deadlines?.[0]?.isOngoing) return 1;
      if (b.deadlines?.[0]?.isOngoing) return -1;
      if (!dateA) return 1;
      if (!dateB) return -1;
      return new Date(dateA).getTime() - new Date(dateB).getTime();
    });
  }, [initialGrants, search, selectedCategory, selectedRegion, deadlineFilter, sortBy]);

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('Alle');
    setSelectedRegion('Alle');
    setDeadlineFilter('all');
    setSortBy('deadline');
  };

  return (
    <div className="space-y-6">
      {/* Search & Top Filters Bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Søg i puljer, fonde, nøgleord eller målgrupper..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Ryd
              </button>
            )}
          </div>

          {/* Region selector */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 self-start">
            {['Alle', 'Danmark', 'EU'].map((reg) => (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  selectedRegion === reg
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {reg}
              </button>
            ))}
          </div>

          {/* Sortering */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3.5 py-2 text-xs font-medium bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
          >
            <option value="deadline">📅 Sorter: Nærmeste frist</option>
            <option value="amount_desc">💰 Sorter: Største bevillingsbeløb</option>
            <option value="title">🔤 Sorter: Alfabetisk</option>
          </select>
        </div>

        {/* Urgency signal buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
          <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> Frist:
          </span>
          <button
            onClick={() => setDeadlineFilter('all')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              deadlineFilter === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Alle Frister
          </button>
          <button
            onClick={() => setDeadlineFilter('urgent')}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
              deadlineFilter === 'urgent'
                ? 'bg-rose-600 text-white ring-2 ring-rose-200'
                : 'badge-urgent hover:bg-rose-100'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Akut (&lt; 14 dage)
          </button>
          <button
            onClick={() => setDeadlineFilter('upcoming')}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
              deadlineFilter === 'upcoming'
                ? 'bg-amber-600 text-white ring-2 ring-amber-200'
                : 'badge-warning hover:bg-amber-100'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Næste 30 dage
          </button>
          <button
            onClick={() => setDeadlineFilter('ongoing')}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
              deadlineFilter === 'ongoing'
                ? 'bg-sky-600 text-white ring-2 ring-sky-200'
                : 'badge-ongoing hover:bg-sky-100'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
            Løbende frist
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Kategori:
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-2xs font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}

          {(selectedCategory !== 'Alle' || selectedRegion !== 'Alle' || deadlineFilter !== 'all' || search) && (
            <button
              onClick={resetFilters}
              className="ml-auto inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-800 font-medium py-1 px-2 hover:bg-rose-50 rounded-md transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Nulstil filtre
            </button>
          )}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-slate-500">
          Viser <span className="font-bold text-slate-900">{filteredGrants.length}</span> af{' '}
          <span className="font-bold text-slate-900">{initialGrants.length}</span> overvågede puljer
        </p>
      </div>

      {/* Grid of Grant Cards */}
      {filteredGrants.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xl border border-slate-200 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Search className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-slate-800">Ingen puljer matchede dine filtre</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Prøv at fjerne nogle af dine søgekriterier eller nulstille filtrene for at se alle fonde.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors"
          >
            Nulstil alle filtre
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredGrants.map((grant) => (
            <GrantCard key={grant.id} grant={grant} />
          ))}
        </div>
      )}
    </div>
  );
}
