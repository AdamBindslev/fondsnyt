'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home, LogIn } from 'lucide-react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App Error caught by Error Boundary:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200/90 shadow-lg shadow-slate-200/50 p-8 text-center space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 mx-auto flex items-center justify-center shadow-xs">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Der opstod en midlertidig serverfejl
          </h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            Siden kunne ikke indlæses i øjeblikket. Dette kan skyldes en midlertidig forbindelse eller sessionsopdatering.
          </p>
        </div>

        {error.digest && (
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70 text-[11px] font-mono text-slate-500 truncate">
            Fejlkode: {error.digest}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
          <button
            onClick={() => reset()}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-all shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Prøv igen</span>
          </button>

          <a
            href="/"
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Til forsiden</span>
          </a>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <Link
            href="/login"
            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center gap-1.5"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Gå til loginskærmen</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
