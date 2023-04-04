'use client';

import { Params, Visualization } from '@/components/experiment-designer/experiment-setup';
import useSessionState from '@/hooks/session';

export default function ExperimentSetupView() {
  useSessionState();

  return (
    <div className="columns-2 h-full">
      <Params />
      <Visualization />
    </div>
  );
}
