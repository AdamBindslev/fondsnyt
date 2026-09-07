import React from 'react';
import { Calendar, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface DeadlineBadgeProps {
  deadlineDate: string | null;
  isOngoing: boolean;
  notes?: string | null;
  compact?: boolean;
}

export function DeadlineBadge({ deadlineDate, isOngoing, notes, compact = false }: DeadlineBadgeProps) {
  if (isOngoing) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold badge-ongoing">
        <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
        Løbende frist
      </span>
    );
  }

  if (!deadlineDate) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
        <Clock className="w-3.5 h-3.5 text-slate-400" />
        {notes || 'Se portal'}
      </span>
    );
  }

  const target = new Date(deadlineDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffTime = target.getTime() - today.getTime();
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let badgeClass = 'badge-calm';
  let dotColor = 'bg-emerald-500';
  let label = `${days} dage tilbage`;
  let Icon = Calendar;

  if (days < 0) {
    badgeClass = 'bg-slate-100 text-slate-500 border border-slate-200';
    dotColor = 'bg-slate-400';
    label = 'Udløbet';
  } else if (days <= 14) {
    badgeClass = 'badge-urgent';
    dotColor = 'bg-rose-500';
    label = `Frist om ${days} ${days === 1 ? 'dag' : 'dage'}`;
    Icon = AlertCircle;
  } else if (days <= 30) {
    badgeClass = 'badge-warning';
    dotColor = 'bg-amber-500';
    label = `${days} dage tilbage`;
    Icon = Clock;
  }

  const formattedDate = target.toLocaleDateString('da-DK', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div className="inline-flex items-center gap-2">
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${badgeClass}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
        <Icon className="w-3.5 h-3.5" />
        {label}
      </span>
      {!compact && (
        <span className="text-xs text-slate-600 font-medium">
          ({formattedDate})
        </span>
      )}
    </div>
  );
}
