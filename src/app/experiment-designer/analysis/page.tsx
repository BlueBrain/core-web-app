'use client';

import { Params, Visualization } from '@/components/experiment-designer/analysis';

export default function AnalysisPage() {
  return (
    <div className="columns-2 h-full">
      <Params />
      <Visualization />
    </div>
  );
}
