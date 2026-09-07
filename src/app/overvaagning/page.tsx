import React from 'react';
import { MonitoringView } from '@/components/MonitoringView';

export const revalidate = 0;

export default function OvervaagningPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Kildeovervågning & Change-Detection
        </h1>
        <p className="text-sm text-slate-600">
          Den 3-lagede hybridmodel: Følg tilstanden af åbne API'er, scraping med SHA-256 diff-hashing og detekterede fondsændringer.
        </p>
      </div>

      <MonitoringView />
    </div>
  );
}
