'use client';

import { Params, Visualization } from '@/components/experiment-designer/experiment-setup';

export default function ExperimentSetupPage() {
  return (
    <div className="columns-2 h-full">
      <Params />
      <Visualization />
    </div>
  );
}
