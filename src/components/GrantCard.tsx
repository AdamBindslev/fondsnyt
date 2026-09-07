'use client';

import React from 'react';
import { ExternalLink, Coins } from 'lucide-react';
import { DeadlineBadge } from './DeadlineBadge';

interface GrantCardProps {
  grant: {
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
  };
}

export function GrantCard({ grant }: GrantCardProps) {
  const primaryDeadline = grant.deadlines?.[0] || { deadlineDate: null, isOngoing: true, notes: null };
  const targetUrl = grant.applicationUrl || grant.sourceUrl || grant.foundation?.websiteUrl || '#';

  const formatAmount = (num: number | null, curr: string) => {
    if (!num) return null;
    return `${num.toLocaleString('da-DK')} ${curr}`;
  };

  const amountDisplay = () => {
    const min = formatAmount(grant.minAmount, grant.currency);
    const max = formatAmount(grant.maxAmount, grant.currency);

    if (min && max) return `${min} – ${max}`;
    if (max) return `Op til ${max}`;
    if (min) return `Fra ${min}`;
    return 'Beløb ikke fastsat';
  };

  return (
    <div className="nordic-card p-5 flex flex-col justify-between group hover:border-slate-300 transition-all">
      <div>
        {/* Header row: Foundation & Region Badge */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2">
            {grant.foundation?.websiteUrl ? (
              <a
                href={grant.foundation.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-slate-800 transition-colors inline-flex items-center gap-1"
                title={`Besøg ${grant.foundation.name}`}
              >
                <span>{grant.foundation.name}</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-60" />
              </a>
            ) : (
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {grant.foundation?.name || 'Fond'}
              </span>
            )}
            {grant.region === 'EU' && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold badge-eu">
                EU
              </span>
            )}
          </div>

          {/* Deadline Signal Badge */}
          <DeadlineBadge
            deadlineDate={primaryDeadline.deadlineDate}
            isOngoing={primaryDeadline.isOngoing}
            compact
          />
        </div>

        {/* Title as clickable link */}
        <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-900 transition-colors leading-snug mb-2">
          <a
            href={targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline flex items-start justify-between gap-1.5"
            title="Åbn fondens officielle ansøgningsside"
          >
            <span>{grant.title}</span>
            <ExternalLink className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-slate-600 mt-0.5 transition-colors" />
          </a>
        </h3>

        {/* Description */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
          {grant.description}
        </p>

        {/* Categories & Targets */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {grant.categories.slice(0, 3).map((cat) => (
            <span
              key={cat}
              className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200/60"
            >
              {cat}
            </span>
          ))}
          {grant.categories.length > 3 && (
            <span className="px-1.5 py-0.5 rounded-md text-[10px] font-medium text-slate-400 bg-slate-50 border border-slate-200/50">
              +{grant.categories.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Footer info: Amount, Competition & Action */}
      <div className="pt-3 border-t border-slate-100/90 mt-2 space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-1.5 font-medium text-slate-800">
            <Coins className="w-3.5 h-3.5 text-slate-400" />
            <span>{amountDisplay()}</span>
          </div>
          {grant.successRateEst && (
            <span className="text-[11px] text-slate-600 font-normal">
              {grant.successRateEst}
            </span>
          )}
        </div>

        <div className="pt-1">
          <a
            href={targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-all shadow-xs group/btn"
          >
            <span>Gå til pulje / ansøgning</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-300 group-hover/btn:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  );
}
