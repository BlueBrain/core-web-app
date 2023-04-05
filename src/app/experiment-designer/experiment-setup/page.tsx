'use client';

import { Params, Visualization } from '@/components/experiment-designer/experiment-setup';

export default function ExperimentSetupView() {
  return (
    <div className="columns-2 h-full">
      <Params />
      <Visualization />
    </div>
  );
}
