import React from 'react';
import { PipelineBoard } from '@/components/PipelineBoard';

export const revalidate = 0;

export default function PipelinePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Min Fundraising Pipeline
        </h1>
        <p className="text-sm text-slate-600">
          Styr dine igangværende ansøgninger, deadlines og bevillinger fra idé til indsendelse og bevilling.
        </p>
      </div>

      <PipelineBoard />
    </div>
  );
}
